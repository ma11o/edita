export interface Draggable {
  destroy(): void;
}

export interface Handlers {
  onDrag(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel, e: Event): void;
  onDragStart(x: Pixel, y: Pixel, e: Event): void;
  onDragEnd(dx: Pixel, dy: Pixel, e: Event): void;
}
