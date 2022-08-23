import React from "react";

import { createDrawing, DrawingNode, isDeclarationNode } from "../nodes";
import type { AnimatedProps, CustomPaintProps } from "../processors";
import { processPaint } from "../processors/Paint";

export type PaintNodeProps = CustomPaintProps;

const onDraw = createDrawing<PaintNodeProps>((ctx, props, node) => {
  const { opacity } = ctx;
  const declarations = node.children
    .filter(isDeclarationNode)
    .map((child) => child.draw(ctx));
  const drawings = node.children.filter(
    (child) => child instanceof DrawingNode
  );
  const paint = processPaint(
    ctx.Skia,
    ctx.paint.copy(),
    opacity,
    props,
    declarations
  );
  node.visit(
    {
      ...ctx,
      paint,
      opacity: props.opacity ? props.opacity * opacity : opacity,
    },
    drawings
  );
});

export const PaintNode = (props: AnimatedProps<PaintNodeProps>) => {
  return <skDrawing onDraw={onDraw} {...props} skipProcessing />;
};
