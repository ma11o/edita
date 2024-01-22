import React, { useContext, useCallback, useRef, useEffect } from "react";
import CanvasContext from "./context";
import { Layer } from "../domains/Layer/model";
import { LayerAction } from "../domains/Layer/reducer";
import { isTouchDevice } from "../lib/browser/device";
import { useDrag } from "./hooks";
import { ResizeHandler } from "./ResizeHandler";

interface Props {
  src: Layer;
}

const HANDLE_SIZE = 20 as Pixel;
/**
 * 実際のリサイズハンドラよりもどのくらい当たり判定を大きくするか
 */
const TOLERANCE = 4 as Pixel;

export function ArrowLayer({ src }: Props) {
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
    <svg ref={ref} data-layer-id={src.id}>
      <defs>
        <marker
          id="arrow"
          viewBox="0 -5 10 10"
          refX="5"
          refY="0"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0,-5L10,0L0,5"></path>
        </marker>
        <filter id="drop-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10"></feGaussianBlur>
        </filter>
      </defs>

      <line
        className="nonBaseLayer"
        x1={src.positionX}
        y1={src.positionY}
        x2={src.positionX + src.width}
        y2={src.positionY + src.height}
        stroke="teal"
        stroke-width="10"
        marker-end="url(#arrow)"
      ></line>
      <ResizeHandler
        layer={src}
        parentSize={[
          src.positionX + src.width + 15,
          src.positionY + src.height,
        ]}
        onDrag={onDragResizeHandler}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      ></ResizeHandler>
    </svg>
  );
}
