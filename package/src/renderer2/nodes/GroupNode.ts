import type { SkMatrix } from "../../skia/types";

import type { DrawingContext } from "./DrawingContext";
import type { DrawingNode, DeclarationNode } from "./Node";
import { NodeType } from "./NodeType";
import type { PaintNode } from "./paint";

export interface GroupNodeProps {
  m3?: SkMatrix;
  paint?: PaintNode;
}

export class GroupNode implements DrawingNode, DeclarationNode {
  type = NodeType.Group;

  children: DrawingNode[] = [];
  m3?: SkMatrix;
  paint?: PaintNode;

  constructor(m3?: SkMatrix, paint?: PaintNode) {
    this.m3 = m3;
    this.paint = paint;
  }

  draw(ctx: DrawingContext) {
    const { canvas, paint } = ctx;
    if (this.m3) {
      canvas.concat(this.m3);
    }
    const childCtx =
      paint && this.paint ? { ...ctx, paint: this.paint.concat(paint) } : ctx;
    for (const child of this.children) {
      child.draw(childCtx);
    }
    if (this.m3) {
      canvas.restore();
    }
  }
}
