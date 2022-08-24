import React, { useMemo } from "react";
import { StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import type { SkiaValue } from "@shopify/react-native-skia";
import {
  useComputedValue,
  useLoop,
  // BlurMask,
  vec,
  Canvas,
  Circle,
  Fill,
  Group,
  polar2Canvas,
  Easing,
  mix,
} from "@shopify/react-native-skia";

const c1 = "#61bea2";
const c2 = "#529ca0";
const { width, height } = Dimensions.get("window");
const center = vec(width / 2, height / 2);
const R = width / 4;

interface RingProps {
  index: number;
  progress: SkiaValue<number>;
}

const Ring = ({ index, progress }: RingProps) => {
  const theta = (index * (2 * Math.PI)) / 6;
  const transform = useComputedValue(() => {
    const { x, y } = polar2Canvas(
      { theta, radius: progress.current * R },
      { x: 0, y: 0 }
    );
    const scale = mix(progress.current, 0.3, 1);
    return [{ translateX: x }, { translateY: y }, { scale }];
  }, [progress]);

  return (
    <Circle
      c={center}
      r={R}
      color={index % 2 ? c1 : c2}
      origin={center}
      transform={transform}
    />
  );
};

export const Breathe = () => {
  const progress = useLoop({
    duration: 3000,
    easing: Easing.inOut(Easing.ease),
  });

  const transform = useComputedValue(
    () => [{ rotate: mix(progress.current, -Math.PI, 0) }],
    [progress]
  );

  return (
    <Canvas style={styles.container} mode="continuous" debug>
      <Fill color="rgb(36,43,56)" />
      <Circle c={center} r={R} color="red" />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/*
   <Group origin={center} transform={transform} blendMode="screen">
      <BlurMask style="solid" blur={40} />
        {new Array(6).fill(0).map((_, index) => {
          return <Ring key={index} index={index} progress={progress} />;
        })}
      </Group>
      */
