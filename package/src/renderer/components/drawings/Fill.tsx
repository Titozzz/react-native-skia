import React from "react";

import type { AnimatedProps } from "../../../animation/Animations";
import type { GroupProps } from "../Group";
import { Group } from "../Group";

export const Fill = (props: AnimatedProps<GroupProps>) => {
  return (
    <Group {...props}>
      <skFill />
    </Group>
  );
};
