import produce, { Patch, applyPatches } from "immer";
import pick from "lodash-es/pick";
import {
  Layer,
  Transform,
  getAbsoluteCenter,
  rotateByCenter,
  actionItem,
  actionItems,
} from "./model";
import { action, KnownActions, unreduceable } from "../../lib/flux/util";
import { radian2degree } from "../../lib/math/geometry";
import { enablePatches } from "immer";
enablePatches();

interface State {
  layers: Layer[];
  currentLayerId: number;
  initialTransforms: Record<Layer["id"], Transform>;
  initialMousePosition: [Pixel, Pixel];
  layerCenter: Record<Layer["id"], [Pixel, Pixel]>;
  activeItem: actionItem;
}

interface IChange {
  redo: Patch[];
  undo: Patch[];
}

export const initialState: State = {
  layers: [
    {
      id: 1,
      width: 0,
      height: 0,
      positionX: 0,
      positionY: 0,
      rotate: 0,
      type: actionItems.ARROW,
    },
  ],
  currentLayerId: 0,
  initialTransforms: {},
  initialMousePosition: [0, 0],
  layerCenter: {},
  activeItem: actionItems.ARROW,
};

export const LayerAction = {
  create: (x: Pixel, y: Pixel) => action("layer/create", { x, y }),
  dragStarted: (x: Pixel, y: Pixel) => action("layer/dragStarted", { x, y }),
  drag: (dx: Pixel, dy: Pixel) => action("layer/drag", { dx, dy }),
  moveStarted: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/moveStarted", { id, x, y }),
  moved: (dx: Pixel, dy: Pixel) => action("layer/moved", { dx, dy }),
  moveEnded: (dx: Pixel, dy: Pixel) => action("layer/moveEnded", { dx, dy }),
  resized: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/resized", { id, x, y }),
  rotated: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/rotated", { id, x, y }),
  resizedArrow: (x: Pixel, y: Pixel) => action("layer/resizedArrow", { x, y }),
  select: (item: actionItem) => action("navigation/select", { item }),
  undo: () => action("navigation/undo", {}),
  redo: () => action("navigation/redo", {}),
};

const changes: { [key: number]: IChange } = {};
let currentVersion = -1;
const noOfVersionsSupported = 100;
const undoableActions = ["layer/moveEnded"];

const reducer = (
  currentState: State,
  action: KnownActions<typeof LayerAction>
) =>
  produce(
    currentState,
    (state: State) => {
      switch (action.type) {
        case "layer/create": {
          const { x, y } = action.payload;
          state.layers.push({
            id: state.layers.length + 1,
            width: 10,
            height: 10,
            positionX: x,
            positionY: y,
            rotate: 0,
            type: state.activeItem,
          });
          return;
        }

        case "layer/dragStarted": {
          const { x, y } = action.payload;
          const layerId = state.layers.length + 1;
          const newLayer = {
            id: layerId,
            width: 10,
            height: 10,
            positionX: x,
            positionY: y,
            rotate: 0,
            type: state.activeItem,
          };
          state.currentLayerId = newLayer.id;
          state.layers.push(newLayer);

          // 変形開始時のレイヤーの状態を覚えておく
          state.initialTransforms[newLayer.id] = pick(newLayer, [
            "width",
            "height",
            "positionX",
            "positionY",
            "rotate",
            "type",
          ]);

          // 変形開始時のマウスの座標も覚えておく
          state.initialMousePosition = [x, y];
          break;
        }

        case "layer/drag": {
          const { dx, dy } = action.payload;
          let layer = state.layers.find(
            (layer) => layer.id === state.currentLayerId
          );
          const transform = state.initialTransforms[state.currentLayerId];
          if (!layer || !transform) {
            return;
          }
          const { positionX, positionY } = transform;

          if (layer.type === actionItems.RECT) {
            if (dx < 0) {
              layer.width = dx * -1;
              layer.positionX = positionX + dx;
            } else {
              layer.width = dx;
            }
            if (dy < 0) {
              layer.height = dy * -1;
              layer.positionY = positionY + dy;
            } else {
              layer.height = dy;
            }
          } else {
            layer.width = dx;
            layer.height = dy;
          }
          break;
        }

        case "layer/moveStarted": {
          const { id, x, y } = action.payload;
          const layer = state.layers.find((layer) => layer.id === id);
          if (!layer) {
            return;
          }

          // 変形開始時のレイヤーの状態を覚えておく
          state.initialTransforms[layer.id] = pick(layer, [
            "width",
            "height",
            "positionX",
            "positionY",
            "rotate",
          ]);

          //state.layerCenter[layer.id] = getAbsoluteCenter(layer);

          // 変形開始時のマウスの座標も覚えておく
          state.initialMousePosition = [x, y];
          break;
        }

        case "layer/moved": {
          const { dx, dy } = action.payload;
          state.layers.forEach((layer) => {
            const transform = state.initialTransforms[layer.id];
            if (!transform) {
              return;
            }

            const { positionX, positionY } = transform;
            layer.positionX = positionX + dx;
            layer.positionY = positionY + dy;
          });
          break;
        }

        case "layer/moveEnded": {
          const { dx, dy } = action.payload;
          let layer = state.layers.find(
            (layer) => layer.id === state.currentLayerId
          );

          let newLayers = state.layers.filter(
            (layer) => layer.id !== state.currentLayerId
          );

          const transform = state.initialTransforms[state.currentLayerId];

          if (!layer || !transform) {
            return;
          }
          const layerId = state.layers.length + 1;
          const newLayer = {
            id: layerId,
            width: layer.width,
            height: layer.height,
            positionX: layer.positionX,
            positionY: layer.positionY,
            rotate: layer.rotate,
            type: state.activeItem,
          };

          layer = newLayer;
          state.layers = newLayers;
          // layer = {};
          state.layers.push(newLayer);
          state.currentLayerId = layerId;

          state.initialTransforms = {};
          state.layerCenter = {};
          state.initialMousePosition = [0, 0];
          break;
        }

        case "layer/resized": {
          const { id, x, y } = action.payload;
          const layer = state.layers.find((layer) => layer.id === id);
          if (!layer) {
            return;
          }

          const transform = state.initialTransforms[layer.id];
          if (!transform) {
            return;
          }

          const layerCenter = state.layerCenter[layer.id];
          if (!layerCenter) {
            return;
          }

          const { width, height } = transform;

          const [cx, cy] = layerCenter;
          const [rotatedCursorX, rotatedCursorY] = rotateByCenter(
            -layer.rotate,
            [cx, cy]
          )([x, y]);

          const [endX, endY] = [
            transform.width + transform.positionX,
            transform.height + transform.positionY,
          ];

          // レイヤーの中心を原点に拡大する場合、マウスの移動分に対して半分しか大きくならないように見えてしまうので、差分を2倍すると良い
          const nextWidth = width + (rotatedCursorX - endX) * 2;
          const nextHeight = height + (rotatedCursorY - endY) * 2;

          layer.width = nextWidth;
          layer.height = nextHeight;
          layer.positionX = cx - nextWidth / 2;
          layer.positionY = cy - nextHeight / 2;
          break;
        }

        case "layer/resizedArrow": {
          const { x, y } = action.payload;
          state.layers.forEach((layer) => {
            const transform = state.initialTransforms[layer.id];
            if (!transform) {
              return;
            }
            const { width, height } = transform;

            layer.width = width + x;
            layer.height = height + y;
          });
          break;
        }

        case "layer/rotated": {
          const { id, x, y } = action.payload;
          const layer = state.layers.find((layer) => layer.id === id);
          if (!layer) {
            return;
          }

          const [cx, cy] = state.layerCenter[layer.id];

          /** θ の隣辺の長さ( x 方向) */
          const vx = x - cx;
          /** θ の対辺の長さ( y 方向) */
          const vy = y - cy;
          /** θ: 回転角(ラジアン) */
          const nextTheta = Math.atan2(vy, vx);

          layer.rotate = radian2degree(nextTheta);
          break;
        }

        case "navigation/select": {
          const { item } = action.payload;
          state.activeItem = item;

          break;
        }

        case "navigation/undo":
          return (
            currentVersion > -1 &&
            applyPatches(state, changes[currentVersion--]?.undo)
          );

        case "navigation/redo":
          return applyPatches(state, changes[++currentVersion]?.redo);

        default: {
          unreduceable(action);
        }
      }
    },
    (patches, inversePatches) => {
      if (undoableActions.indexOf(action.type) !== -1) {
        currentVersion++;

        changes[currentVersion] = {
          redo: patches,
          undo: inversePatches,
        };
        console.log(patches);

        delete changes[currentVersion + 1];
        delete changes[currentVersion - noOfVersionsSupported];
      }
    }
  );

export default reducer;
