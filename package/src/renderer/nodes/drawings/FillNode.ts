import { Node } from "../Node";
import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import { NodeType } from "../NodeType";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FillNodeProps {}

export class FillNode extends Node<null> implements DrawingNode {
  type = NodeType.Fill;

  constructor() {
    super(null);
  }

  draw({ canvas, paint }: DrawingContext) {
    canvas.drawPaint(paint);
  }
}
