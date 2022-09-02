import type { Skia, SkRect } from "../../../skia/types";
import type { DrawingContext } from "../types";
import { NodeType } from "../types";

import type { DrawingNodeProps } from "./DrawingNode";
import { DrawingNode } from "./DrawingNode";

export interface OvalNodeProps extends DrawingNodeProps {
  rect: SkRect;
}

export class OvalNode extends DrawingNode<OvalNodeProps> {
  constructor(Skia: Skia, props: OvalNodeProps) {
    super(Skia, NodeType.Oval, props);
  }

  onPropChange(): void {}

  draw({ canvas, paint }: DrawingContext) {
    const { rect } = this.props;
    canvas.drawOval(rect, paint);
  }
}
