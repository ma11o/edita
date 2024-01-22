import { TouchDraggable } from "./TouchDraggable";
import { MouseDraggable } from "./MouseDraggable";
import { Handlers } from "./types";

/*
export default function makeDraggable<E extends SVGElement>(
  el: E,
  isTouchDevice: boolean,
  { onMove, onDragStart, onDragEnd }: Handlers
) {
  if (isTouchDevice) {
    return new TouchDraggable(el, { onMove, onDragStart, onDragEnd });
  } else {
    return new MouseDraggable(el, { onMove, onDragStart, onDragEnd });
  }
}
*/
export default function makeElemDraggable<E extends SVGElement>(
  el: E,
  isTouchDevice: boolean,
  { onDrag, onDragStart, onDragEnd }: Handlers
) {
  if (isTouchDevice) {
    return new TouchDraggable(el, { onDrag, onDragStart, onDragEnd });
  } else {
    return new MouseDraggable(el, { onDrag, onDragStart, onDragEnd });
  }
}
