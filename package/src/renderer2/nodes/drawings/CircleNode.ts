import { Node } from "../Node";
import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import type { Vector } from "../../../skia/types";
import { NodeType } from "../NodeType";

export interface CircleNodeProps {
  c: Vector;
  r: number;
}

export class CircleNode extends Node<CircleNodeProps> implements DrawingNode {
  type = NodeType.Circle;

  constructor(props: CircleNodeProps) {
    super(props);
  }

  draw({ canvas, paint }: DrawingContext) {
    const { c, r } = this.props;
    canvas.drawCircle(c.x, c.y, r, paint);
  }
}
