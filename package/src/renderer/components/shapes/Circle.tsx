import React from "react";

import type {
  CustomPaintProps,
  AnimatedProps,
  CircleDef,
} from "../../processors";
import { createDrawing } from "../../nodes/Drawing";
import { processCircle } from "../../processors";
import { PaintNode } from "../PaintNode";

export type CircleProps = CircleNodeProps & CustomPaintProps;

export const Circle = (props: AnimatedProps<CircleProps>) => {
  return (
    <PaintNode {...props}>
      <CircleNode {...props} />
    </PaintNode>
  );
};

Circle.defaultProps = {
  c: { x: 0, y: 0 },
};

export type CircleNodeProps = CircleDef;

const onDraw = createDrawing<CircleNodeProps>(
  ({ canvas, paint, Skia }, def) => {
    const { c, r } = processCircle(Skia, def);
    canvas.drawCircle(c.x, c.y, r, paint);
  }
);

export const CircleNode = (props: AnimatedProps<CircleNodeProps>) => {
  return <skDrawing onDraw={onDraw} {...props} />;
};
