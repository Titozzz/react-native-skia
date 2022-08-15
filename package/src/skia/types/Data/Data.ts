import type { SkJSIInstance } from "../JsiInstance";

export type ESModule = {
  __esModule: true;
  default: string;
};
export type RNModule = number;
export type ReturnTypeOfRequire = RNModule | ESModule;

export type SkData = SkJSIInstance<"Data">;

export const isESModule = (source: ReturnTypeOfRequire): source is ESModule =>
  typeof source !== "number";

export type DataSource = ReturnTypeOfRequire | string | Uint8Array;
export type DataSourceFromHook = DataSource | null | undefined;
