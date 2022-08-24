import React from "react";
import type { ReactNode } from "react";

import { Skia } from "../../skia";
import type {
  Color,
  PaintStyle,
  SkMatrix,
  StrokeCap,
  StrokeJoin,
  Transforms2d,
  Vector,
} from "../../skia/types";
import { processTransform, BlendMode } from "../../skia/types";
import { useComputedValue } from "../../values";
import type { AnimatedProps } from "../../animation";
import { materialize } from "../../animation";

import type { SkEnum } from "./Enum";
import { enumKey } from "./Enum";

export const localMatrix = (
  m: SkMatrix,
  { transform, origin }: TransformProps
) => {
  if (transform) {
    return processTransform(
      m,
      origin ? transformOrigin(origin, transform) : transform
    );
  }
  return undefined;
};

export const transformOrigin = (origin: Vector, transform: Transforms2d) => [
  { translateX: origin.x },
  { translateY: origin.y },
  ...transform,
  { translateX: -origin.x },
  { translateY: -origin.y },
];

const processCanvasTransform = ({
  transform,
  origin,
  matrix,
}: TransformProps) => {
  const m3 = Skia.Matrix();
  if (matrix) {
    if (origin) {
      m3.translate(origin.x, origin.y);
      m3.concat(matrix);
      m3.translate(-origin.x, -origin.y);
    } else {
      m3.concat(matrix);
    }
  } else if (transform) {
    processTransform(
      m3,
      origin ? transformOrigin(origin, transform) : transform
    );
  }
  return m3;
};

export interface ChildrenProps {
  children?: ReactNode | ReactNode[];
}

export interface PaintProps extends ChildrenProps {
  color?: Color;
  strokeWidth?: number;
  blendMode?: SkEnum<typeof BlendMode>;
  style?: SkEnum<typeof PaintStyle>;
  strokeJoin?: SkEnum<typeof StrokeJoin>;
  strokeCap?: SkEnum<typeof StrokeCap>;
  strokeMiter?: number;
  opacity?: number;
  antiAlias?: boolean;
}

export interface TransformProps {
  transform?: Transforms2d;
  origin?: Vector;
  matrix?: SkMatrix;
}

export type GroupProps = PaintProps & TransformProps;

export const Group = ({ children, ...props }: AnimatedProps<GroupProps>) => {
  const m3 = useComputedValue(() => {
    const transform = materialize(props.transform);
    const origin = materialize(props.origin);
    const matrix = materialize(props.matrix);
    return processCanvasTransform({ transform, origin, matrix });
  }, [props.transform, props.matrix, props.origin]);
  const paint = useComputedValue(() => {
    const cl = materialize(props.color);
    const color = cl ? Skia.Color(cl) : undefined;
    const bm = materialize(props.blendMode);
    const blendMode = bm ? BlendMode[enumKey(bm)] : undefined;
    return {
      color,
      blendMode,
    };
  }, [props.color, props.blendMode]);
  return <skGroup m3={m3} paint={paint} {...{ children }} />;
};
