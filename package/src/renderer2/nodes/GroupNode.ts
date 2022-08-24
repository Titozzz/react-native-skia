import type { SkMatrix } from "../../skia/types";

import type { DrawingContext } from "./DrawingContext";
import type { DrawingNode, DeclarationNode } from "./Node";
import { Node } from "./Node";
import { NodeType } from "./NodeType";
import type { PaintNodeProps } from "./paint/PaintNode";
import { concatPaint } from "./paint/PaintNode";

export interface GroupNodeProps {
  m3?: SkMatrix;
  paint?: PaintNodeProps;
}

export class GroupNode
  extends Node<GroupNodeProps>
  implements DrawingNode, DeclarationNode
{
  type = NodeType.Group;

  children: DrawingNode[] = [];

  constructor(props: GroupNodeProps) {
    super(props);
  }

  draw(ctx: DrawingContext) {
    const { canvas, paint } = ctx;
    const { m3, paint: thisPaint } = this.props;
    if (m3) {
      canvas.concat(m3);
    }
    const childCtx =
      paint && thisPaint
        ? { ...ctx, paint: concatPaint(paint, thisPaint) }
        : ctx;
    for (const child of this.children) {
      child.draw(childCtx);
    }
    if (m3) {
      canvas.restore();
    }
  }
}
