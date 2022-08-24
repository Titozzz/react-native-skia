import type { DependencyManager } from "../DependencyManager";

import type { DrawingContext } from "./DrawingContext";
import type { DrawingNode, DeclarationNode } from "./Node";
import { Node } from "./Node";
import { NodeType } from "./NodeType";

export class RootNode
  extends Node<null>
  implements DrawingNode, DeclarationNode
{
  type = NodeType.Root;
  children: DrawingNode[] = [];

  constructor(public depMgr: DependencyManager, public redraw: () => void) {
    super(null);
  }

  draw(ctx: DrawingContext) {
    for (const child of this.children) {
      child.draw(ctx);
    }
  }
}
