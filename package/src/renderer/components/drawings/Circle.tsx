import React from "react";

import type { AnimatedProps } from "../../../animation";
import type { Vector } from "../../../skia/types";
import { useComputedValue } from "../../../values";
import type { GroupProps } from "../Group";
import { Group } from "../Group";
import { materialize } from "../../../animation/Animations";

export interface CircleProps extends GroupProps {
  c: Vector;
  r: number;
}

export const Circle = (props: AnimatedProps<CircleProps>) => {
  const c = useComputedValue(() => {
    return materialize(props.c);
  }, [props.c]);
  const r = useComputedValue(() => {
    return materialize(props.r);
  }, [props.r]);
  return (
    <Group {...props}>
      <skCircle c={c} r={r} />
    </Group>
  );
};
