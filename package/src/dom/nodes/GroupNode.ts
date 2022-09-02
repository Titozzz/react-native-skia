import type {
  Skia,
  SkMatrix,
  SkPath,
  SkPathEffect,
  SkRect,
  SkRRect,
  SkShader,
} from "../../skia/types";
import { ClipOp } from "../../skia/types";
import type { SkMaskFilter } from "../../skia/types/MaskFilter";
import type { SkColorFilter } from "../../skia/types/ColorFilter/ColorFilter";
import type { SkImageFilter } from "../../skia/types/ImageFilter/ImageFilter";
import { exhaustiveCheck } from "../../renderer/typeddash";

import type { PaintNodeProps } from "./paint/PaintNode";
import { PaintNode } from "./paint/PaintNode";
import { JsiRenderNode } from "./Node";
import type { DeclarationNode, DrawingContext, RenderNode } from "./types";
import { NodeType } from "./types";

export interface GroupNodeProps {
  matrix?: SkMatrix;
  paint?: PaintNodeProps;
  clipRect?: SkRect;
  clipRRect?: SkRRect;
  invertClip?: boolean;
  clipPath?: SkPath;
}

export class GroupNode extends JsiRenderNode<GroupNodeProps> {
  paint?: PaintNode;
  children: RenderNode<unknown>[] = [];

  constructor(Skia: Skia, props: GroupNodeProps = {}) {
    super(Skia, NodeType.Group, props);
    if (props.paint) {
      this.paint = new PaintNode(this.Skia, props.paint);
    }
  }

  addChild(child: RenderNode<unknown>) {
    this.children.push(child);
  }

  addEffect(
    effect:
      | DeclarationNode<unknown, SkShader>
      | DeclarationNode<unknown, SkImageFilter>
      | DeclarationNode<unknown, SkColorFilter>
      | DeclarationNode<unknown, SkMaskFilter>
      | DeclarationNode<unknown, SkPathEffect>
  ) {
    if (!this.paint) {
      this.paint = new PaintNode(this.Skia);
    }
    if (effect.isColorFilter()) {
      this.paint.addColorFilter(effect);
    } else if (effect.isMaskFilter()) {
      this.paint.addMaskFilter(effect);
    } else if (effect.isShader()) {
      this.paint.addShader(effect);
    } else if (effect.isImageFilter()) {
      this.paint.addImageFilter(effect);
    } else if (effect.isPathEffect()) {
      this.paint.addPathEffect(effect);
    } else {
      exhaustiveCheck(effect);
    }
  }

  render(parentCtx: DrawingContext) {
    const { invertClip, matrix, clipRect, clipRRect, clipPath } = this.props;
    const { canvas } = parentCtx;

    const opacity =
      this.props.paint && this.props.paint.opacity
        ? parentCtx.opacity * this.props.paint.opacity
        : parentCtx.opacity;

    const paint = this.paint
      ? this.paint.concat(parentCtx.paint, opacity)
      : parentCtx.paint;

    // TODO: can we only recreate a new context here if needed?
    const ctx = { ...parentCtx, opacity, paint };
    const hasTransform = matrix !== undefined;
    const hasClip = clipRect !== undefined;
    const shouldSave = hasTransform || hasClip;
    const op = invertClip ? ClipOp.Difference : ClipOp.Intersect;

    if (shouldSave) {
      canvas.save();
    }

    if (matrix) {
      canvas.concat(matrix);
    }
    if (clipRect) {
      canvas.clipRect(clipRect, op, true);
    }
    if (clipRRect) {
      canvas.clipRRect(clipRRect, op, true);
    }
    if (clipPath) {
      canvas.clipPath(clipPath, op, true);
    }

    this.children.forEach((child) => child.render(ctx));

    if (shouldSave) {
      canvas.restore();
    }
  }
}
