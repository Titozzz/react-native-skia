import { Node } from "../Node";
import type { DrawingNode } from "../Node";
import type { DrawingContext } from "../DrawingContext";
import type { SkRect } from "../../../skia/types";
import { NodeType } from "../NodeType";

export interface RectNodeProps {
  rect: SkRect;
}

export class RectNode extends Node<RectNodeProps> implements DrawingNode {
  type = NodeType.Rect;

  constructor(props: RectNodeProps) {
    super(props);
  }

  draw({ canvas, paint }: DrawingContext) {
    const { rect } = this.props;
    canvas.drawRect(rect, paint);
  }
}
