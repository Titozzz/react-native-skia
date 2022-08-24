import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import { NodeType } from "../NodeType";

export class FillNode implements DrawingNode {
  type = NodeType.Fill;

  draw({ canvas, paint }: DrawingContext) {
    canvas.drawPaint(paint);
  }
}
