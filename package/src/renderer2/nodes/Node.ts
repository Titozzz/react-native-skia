import type { DrawingContext } from "./DrawingContext";
import type { NodeType } from "./NodeType";

export type UnknownProps = unknown;

export abstract class Node<P = UnknownProps> {
  abstract type: NodeType;

  constructor(public props: P) {}
}

export interface DeclarationNode extends Node {
  children: Node[];
}

export interface DrawingNode extends Node {
  draw(ctx: DrawingContext): void;
}

export const isDeclarationNode = (node: Node): node is DeclarationNode =>
  Array.isArray((node as unknown as Record<string, unknown>).children);
