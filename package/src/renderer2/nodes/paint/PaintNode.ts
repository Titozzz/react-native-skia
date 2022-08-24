import type { SkPaint, SkColor, BlendMode } from "../../../skia/types";

export interface PaintNodeProps {
  color?: SkColor;
  blendMode?: BlendMode;
}

export class PaintNode {
  color?: SkColor;
  blendMode?: BlendMode;

  constructor({ color, blendMode }: PaintNodeProps) {
    this.color = color;
    this.blendMode = blendMode;
  }

  concat(parentPaint: SkPaint) {
    const paint = parentPaint.copy();
    if (this.color !== undefined) {
      paint.setColor(this.color);
    }
    if (this.blendMode !== undefined) {
      paint.setBlendMode(this.blendMode);
    }
    return paint;
  }
}
