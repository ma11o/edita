import React, { useContext, useCallback, useRef, useEffect } from "react";
import { Layer } from "../domains/Layer/model";
import { useDrag } from "./hooks";
import { LayerAction } from "../domains/Layer/reducer";
import { isTouchDevice } from "../lib/browser/device";
import CanvasContext from "./context";
import { ResizeHandler } from "./ResizeHandler";

interface Props {
  src: Layer;
  //onMove(x: Pixel, y: Pixel): void;
  //onMove(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel): void;
  //onDragStart(x: Pixel, y: Pixel, e: Event): void;
  //onDragEnd(e: Event): void;
}

export function RectLayer({ src }: Props) {
  const [state, dispatch] = useContext(CanvasContext);

  const onDragStart = useCallback((x: Pixel, y: Pixel, e: Event) => {
    const layerId = Number((e.currentTarget as HTMLElement).dataset.layerId);

    dispatch(LayerAction.moveStarted(layerId, x, y));
  }, []);

  const onDrag = useCallback((dx: Pixel, dy: Pixel) => {
    dispatch(LayerAction.moved(dx, dy));
  }, []);

  const onDragEnd = useCallback((dx: Pixel, dy: Pixel, e: Event) => {
    e.stopPropagation();
    dispatch(LayerAction.moveEnded(dx, dy));
  }, []);

  const ref = useDrag<SVGSVGElement>(isTouchDevice, {
    onDrag,
    onDragStart,
    onDragEnd,
  });

  const onDragResizeHandler = useCallback((dx: Pixel, dy: Pixel) => {
    dispatch(LayerAction.resizedArrow(dx, dy));
  }, []);

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
      <rect
        fill="none"
        stroke="purple"
        stroke-width="20"
        width={src.width}
        height={src.height}
      />
      <ResizeHandler
        layer={src}
        parentSize={[src.width - 5, src.height - 5]}
        onDrag={onDragResizeHandler}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      ></ResizeHandler>
    </svg>
  );
}
