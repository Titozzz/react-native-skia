import type { RefObject } from "react";
import React from "react";

import type { SkPaint } from "../../skia";
import { createDrawing } from "../nodes";
import { concatPaint } from "../processors";
import type { AnimatedProps, CustomPaintProps } from "../processors";

import { Paint, usePaintRef } from "./Paint";

export type PaintNodeProps = { paint: RefObject<SkPaint> };

const onDraw = createDrawing<PaintNodeProps>((ctx, props, node) => {
  const paint = props.paint.current ? ctx.paint.copy() : ctx.paint;
  if (props.paint.current) {
    concatPaint(paint, props.paint.current);
  }
  node.visit({
    ...ctx,
    paint,
  });
});

export const PaintNode = ({
  children,
  ...props
}: AnimatedProps<CustomPaintProps>) => {
  const paint = usePaintRef();
  return (
    <>
      <Paint ref={paint} {...props}>
        {children}
      </Paint>
      <skDrawing onDraw={onDraw} {...{ paint }} skipProcessing />
    </>
  );
};
