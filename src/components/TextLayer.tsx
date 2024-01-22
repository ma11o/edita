import React, { useContext, useCallback, useState } from "react";
import CanvasContext from "./context";
import { Layer } from "../domains/Layer/model";
import { LayerAction } from "../domains/Layer/reducer";
import { isTouchDevice } from "../lib/browser/device";
import { useDrag } from "./hooks";

interface Props {
  src: Layer;
}

const HANDLE_SIZE = 20 as Pixel;
/**
 * 実際のリサイズハンドラよりもどのくらい当たり判定を大きくするか
 */
const TOLERANCE = 4 as Pixel;

export function TextLayer({ src }: Props) {
  const [state, dispatch] = useContext(CanvasContext);
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleClick = (
    event: React.MouseEvent<SVGForeignObjectElement, MouseEvent>
  ) => {
    console.log("mousedown");

    event.stopPropagation();
    return;
  };

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

  return (
    <>
      <svg
        ref={ref}
        data-layer-id={src.id}
        viewBox={`0 0 ${src.width} ${src.height}`}
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        x={src.positionX - HANDLE_SIZE}
        y={src.positionY - HANDLE_SIZE}
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <rect
            fill="white"
            stroke="#666666"
            strokeWidth="1"
            width={HANDLE_SIZE}
            height={HANDLE_SIZE}
            x="0"
            y="0"
          />
          <rect
            fillOpacity="0"
            width={HANDLE_SIZE + TOLERANCE * 2}
            height={HANDLE_SIZE + TOLERANCE * 2}
            x={0 - TOLERANCE}
            y={0 - TOLERANCE}
            style={{ cursor: "pointer" }}
          />
        </g>
      </svg>
      <foreignObject
        x={src.positionX}
        y={src.positionY}
        width="500"
        height="100%"
        onMouseDown={handleClick}
      >
        <div className="FlexTextarea">
          <div
            className="FlexTextarea__dummy"
            aria-hidden="true"
            style={{
              color: "red",
              fontSize: "50px",
              width: "100%",
              lineHeight: 1,
            }}
          >
            {value.split("\n").map((str, index) => (
              <React.Fragment key={index}>
                {str}
                <br />
              </React.Fragment>
            ))}
          </div>
          <textarea
            id="FlexTextarea"
            className="FlexTextarea__textarea nonBaseLayer"
            onChange={handleChange}
            value={value}
            style={{
              background: "transparent",
              color: "red",
              fontSize: "50px",
              width: "100%",
              lineHeight: 1,
            }}
          ></textarea>
        </div>
      </foreignObject>
    </>
  );
}
