import type { DependencyManager } from "../../renderer";

import type { DrawingContext } from "./DrawingContext";
import { Node } from "./Node";
import type { DrawingNode, DeclarationNode } from "./Node";
import { NodeType } from "./NodeType";

export class RootNode extends Node implements DrawingNode, DeclarationNode {
  type = NodeType.Root;
  children: DrawingNode[] = [];

  constructor(public depMgr: DependencyManager, public redraw: () => void) {
    super({});
  }

  draw(ctx: DrawingContext) {
    for (const child of this.children) {
      child.draw(ctx);
    }
  }
}
