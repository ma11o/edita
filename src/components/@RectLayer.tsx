import React, { useContext, useCallback, useRef, useEffect } from "react";
/*
import { Layer } from "../domains/Layer/model";
import { useDrag } from "./hooks";
import { ResizeHandler } from "./ResizeHandler";
import { RotateHandler } from "./RotateHandler";
import { LayerAction } from "../domains/Layer/reducer";
import { isTouchDevice } from "../lib/browser/device";
import CanvasContext from "./context";
import { arrow } from "./image";
/*
interface Props {
  src: Layer;
  //onMove(x: Pixel, y: Pixel): void;
  onMove(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel): void;
  onDragStart(x: Pixel, y: Pixel, e: Event): void;
  onDragEnd(e: Event): void;
}

export function RectLayer({ src, onMove, onDragStart, onDragEnd }: Props) {
  const [, dispatch] = useContext(CanvasContext);

  const onResize = useCallback(
    (_dx: Pixel, _dy: Pixel, x: Pixel, y: Pixel) => {
      dispatch(LayerAction.resized(src.id, x, y));
    },
    [dispatch, src.id]
  );

  const onRotate = useCallback(
    (_dx: Pixel, _dy: Pixel, x: Pixel, y: Pixel) => {
      dispatch(LayerAction.rotated(src.id, x, y));
    },
    [dispatch, src.id]
  );

  const ref = useDrag<SVGSVGElement>(isTouchDevice, {
    onMove,
    onDragStart,
    onDragEnd,
  });

  return (
    <svg
      ref={ref}
      data-layer-id={src.id}
      viewBox={`0 0 ${src.width} ${src.height}`}
      width={src.width}
      height={src.height}
      x={src.positionX}
      y={src.positionY}
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`rotate(${src.rotate} ${src.width / 2} ${src.height / 2})`}>
        <rect
          fill="none"
          stroke="purple"
          stroke-width="20"
          width={src.width}
          height={src.height}
        />
        <ResizeHandler
          layer={src}
          parentSize={[src.width, src.height]}
          onMove={onResize}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </g>
    </svg>
  );
}
*/
