import type {
  FillType,
  SkImage,
  StrokeOpts,
  Vector,
  Color,
  SkPoint,
  BlendMode,
  PointMode,
  VertexMode,
  SkFont,
  SkRRect,
} from "../../skia/types";

import type {
  CircleDef,
  Fit,
  PathDef,
  RectDef,
  RRectDef,
  SkEnum,
} from "./Common";
import type { DrawingContext } from "./DrawingContext";
import type { DrawingNodeProps } from "./Node";

export type ImageProps = DrawingNodeProps &
  RectDef & {
    fit: Fit;
    image: SkImage;
  };

export type CircleProps = CircleDef & DrawingNodeProps;

export interface PathProps extends DrawingNodeProps {
  path: PathDef;
  start: number;
  end: number;
  stroke?: StrokeOpts;
  fillType?: SkEnum<typeof FillType>;
}

export interface CustomDrawingNodeProps extends DrawingNodeProps {
  onDraw: (ctx: DrawingContext) => void;
}

export interface LineProps extends DrawingNodeProps {
  p1: Vector;
  p2: Vector;
}

export type OvalProps = RectDef & DrawingNodeProps;

export type RectProps = RectDef & DrawingNodeProps;

export type RoundedRectProps = RRectDef & DrawingNodeProps;

export interface CubicBezierHandle {
  pos: Vector;
  c1: Vector;
  c2: Vector;
}

export interface PatchProps extends DrawingNodeProps {
  colors?: Color[];
  patch: [
    CubicBezierHandle,
    CubicBezierHandle,
    CubicBezierHandle,
    CubicBezierHandle
  ];
  texture?: [SkPoint, SkPoint, SkPoint, SkPoint];
  blendMode?: SkEnum<typeof BlendMode>;
}

export interface VerticesProps extends DrawingNodeProps {
  colors?: string[];
  vertices: SkPoint[];
  textures?: SkPoint[];
  mode: SkEnum<typeof VertexMode>;
  blendMode?: SkEnum<typeof BlendMode>;
  indices?: number[];
}

export interface PointsProps extends DrawingNodeProps {
  points: SkPoint[];
  mode: SkEnum<typeof PointMode>;
}

export interface TextProps extends DrawingNodeProps {
  font: SkFont;
  text: string;
  x: number;
  y: number;
}

export interface TextPathProps extends DrawingNodeProps {
  font: SkFont;
  text: string;
  path: PathDef;
  initialOffset: number;
}

export interface DiffRectProps extends DrawingNodeProps {
  inner: SkRRect;
  outer: SkRRect;
}
