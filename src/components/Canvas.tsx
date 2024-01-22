import React, {
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
} from "react";
import reducer, { initialState, LayerAction } from "../domains/Layer/reducer";
import { RectLayer } from "./RectLayer";
import { ArrowLayer } from "./ArrowLayer";
import { TextLayer } from "./TextLayer";
import CanvasContext from "./context";
import html2canvas from "html2canvas";
import backgroundImg from "../assets/screen.png";
import { useDrag } from "./hooks";
import { isTouchDevice } from "../lib/browser/device";
import { actionItem, actionItems, Layer } from "../domains/Layer/model";

export function Canvas() {
  const [state, dispatch] = useContext(CanvasContext);

  const onDragStart = useCallback((x: Pixel, y: Pixel, e: Event) => {
    dispatch(LayerAction.dragStarted(x, y));
  }, []);

  const onDrag = useCallback((dx: Pixel, dy: Pixel) => {
    dispatch(LayerAction.drag(dx, dy));
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

  const saveAsImage = (uri: string) => {
    const downloadLink = document.createElement("a");

    if (typeof downloadLink.download === "string") {
      downloadLink.href = uri;
      downloadLink.download = "save.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      window.open(uri);
    }
  };

  const onClickExport = () => {
    const target = document.getElementById("target-component");
    if (target)
      html2canvas(target).then((canvas) => {
        const targetImgUri = canvas.toDataURL("img/png");
        saveAsImage(targetImgUri);
      });
  };

  const getLayer = (layer: Layer) => {
    if (layer.type === actionItems.RECT) {
      return <RectLayer key={layer.id} src={layer} />;
    } else if (layer.type === actionItems.ARROW) {
      return <ArrowLayer key={layer.id} src={layer} />;
    } else if (layer.type === actionItems.TEXT) {
      return <TextLayer key={layer.id} src={layer} />;
    }
  };

  return (
    <>
      <div
        id="target-component"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <svg viewBox="0 0 800 800" width="800" height="800" ref={ref}>
          {state.layers?.map((layer: Layer) => {
            return getLayer(layer);
          })}
        </svg>
      </div>
      <button onClick={onClickExport}>dawnload</button>
    </>
  );
}
