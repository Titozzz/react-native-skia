import type { SkiaValue } from "../values/types";
import type { SkiaSelector } from "../values/selector";

export const isValue = (value: unknown): value is SkiaValue<unknown> => {
  if (value === undefined || value === null) {
    return false;
  }
  try {
    if (
      typeof value === "object" &&
      (value as SkiaValue<unknown>).__typename__ === "RNSkValue"
    ) {
      return true;
    }
  } catch {}
  return false;
};

export const isSelector = <T, R>(
  value: unknown
): value is {
  selector: (v: T) => R;
  value: SkiaValue<T>;
} => {
  if (value) {
    return (
      typeof value === "object" &&
      (value as Record<string, unknown>).selector !== undefined &&
      (value as Record<string, unknown>).value !== undefined
    );
  }
  return false;
};

export const materialize = <T>(prop: T | SkiaValue<T> | SkiaSelector<T>) => {
  if (isValue(prop)) {
    return prop.current;
  } else if (isSelector(prop)) {
    return prop.selector(prop.value.current);
  }
  return prop;
};

export type AnimatedProp<T, P = unknown> =
  | T
  | SkiaValue<T>
  | SkiaSelector<T, P>;

export type AnimatedProps<T> = {
  [K in keyof T]: AnimatedProp<T[K]>;
};
