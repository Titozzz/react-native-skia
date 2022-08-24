import type { SkPaint } from "../../skia";
import type { SkCanvas } from "../../skia/types/Canvas";

export interface DrawingContext {
  canvas: SkCanvas;
  paint: SkPaint;
  opacity: number;
}
