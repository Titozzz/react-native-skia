import React from "react";

import type { MorphologyImageFilterProps } from "../../../dom/types";
import type { SkiaProps } from "../../processors";

export const Morphology = (props: SkiaProps<MorphologyImageFilterProps>) => {
  return <skMorphology {...props} />;
};

Morphology.defaultProps = {
  operator: "dilate",
};
