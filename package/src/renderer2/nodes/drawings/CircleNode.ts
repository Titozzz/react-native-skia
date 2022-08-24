import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import type { Vector } from "../../../skia/types";
import { NodeType } from "../NodeType";

export interface CircleNodeProps {
  c: Vector;
  r: number;
}

export class CircleNode implements DrawingNode {
  type = NodeType.Circle;
  c: Vector;
  r: number;

  constructor({ c, r }: CircleNodeProps) {
    this.c = c;
    this.r = r;
  }

  draw({ canvas, paint }: DrawingContext) {
    canvas.drawCircle(this.c.x, this.c.y, this.r, paint);
  }
}
