import type { SkPaint, SkColor, BlendMode } from "../../../skia/types";
import { Node } from "../Node";
import { NodeType } from "../NodeType";

export const concatPaint = (
  parentPaint: SkPaint,
  paintProps: PaintNodeProps
) => {
  const { color, blendMode } = paintProps;
  const paint = parentPaint.copy();
  if (color !== undefined) {
    paint.setColor(color);
  }
  if (blendMode !== undefined) {
    paint.setBlendMode(blendMode);
  }
  return paint;
};

export interface PaintNodeProps {
  color?: SkColor;
  blendMode?: BlendMode;
}

export class PaintNode extends Node<PaintNodeProps> {
  type = NodeType.Paint;

  constructor(props: PaintNodeProps) {
    super(props);
  }
}
