import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import type { SkPaint, SkRect } from "@shopify/react-native-skia";
import {
  CircleNode,
  center,
  Circle,
  useFont,
  FilterMode,
  Canvas,
  Group,
  Rect,
  Text,
  useClockValue,
  useComputedValue,
  rect,
  createDrawing,
  Skia,
  TileMode,
} from "@shopify/react-native-skia";

const size = 200;
const n = 99;

export const FreezeExample = () => {
  const font = useFont(require("../../assets/SF-Mono-Semibold.otf"), 32);
  const clock = useClockValue();
  const transform = useComputedValue(
    () => [{ translateY: 100 }, { rotate: (Math.PI * clock.current) / 4000 }],
    [clock]
  );
  if (font === null) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1, margin: 50 }} debug>
      <Group origin={{ x: size / 2, y: size / 2 }} transform={transform}>
        <Checkerboard color={"black"} />
      </Group>
      {font && <Text x={20} y={size + 100} text={`n = ${n}`} font={font} />}
    </Canvas>
  );
};

const Checkerboard = ({ color }: { color: string }) => {
  // draw a n * n checkerboard

  return (
    <>
      {[...Array(n * n)].map((_, i) => {
        const rct = rect(
          ((i % n) * size) / n,
          (Math.floor(i / n) * size) / n,
          size / n,
          size / n
        );
        return (
          <Circle
            key={i}
            c={center(rct)}
            r={size / n / 2}
            color={i % 2 === 0 ? color : "white"}
          />
        );
      })}
    </>
  );
};

interface FreezeProps {
  rect: SkRect;
  children?: ReactNode | ReactNode[];
}

const onDraw = createDrawing<FreezeProps>(
  (ctx, { rect: boundingRect }, node) => {
    if (node.memoized === null) {
      const recorder = Skia.PictureRecorder();
      const canvas = recorder.beginRecording(boundingRect);
      node.visit({
        ...ctx,
        canvas,
      });
      const pic = recorder.finishRecordingAsPicture();
      const shaderPaint = Skia.Paint();
      shaderPaint.setShader(
        pic.makeShader(TileMode.Decal, TileMode.Decal, FilterMode.Nearest)
      );
      node.memoized = shaderPaint;
    }
    ctx.canvas.drawRect(boundingRect, node.memoized as SkPaint);
  }
);

export const Freeze = (props: FreezeProps) => {
  return <skDrawing onDraw={onDraw} skipProcessing {...props} />;
};
