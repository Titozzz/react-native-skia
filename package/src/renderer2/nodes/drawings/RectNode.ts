import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import type { SkRect } from "../../../skia/types";
import { NodeType } from "../NodeType";

export interface RectNodeProps {
  rect: SkRect;
}

export class RectNode implements DrawingNode {
  type = NodeType.Rect;
  rect: SkRect;

  constructor({ rect }: RectNodeProps) {
    this.rect = rect;
  }

  draw({ canvas, paint }: DrawingContext) {
    canvas.drawRect(this.rect, paint);
  }
}
