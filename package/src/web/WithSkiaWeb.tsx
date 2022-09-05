import type { ClassicElement, ComponentProps, ComponentType } from "react";
import React, { useMemo, lazy, Suspense } from "react";
import { Platform } from "react-native";

import { LoadSkiaWeb } from "./LoadSkiaWeb";

interface WithSkiaProps {
  fallback?: ComponentProps<typeof Suspense>["fallback"];
  getComponent: () => Promise<{ default: ComponentType }>;
  opts?: Parameters<typeof LoadSkiaWeb>[0];
}

export const WithSkiaWeb = ({
  getComponent,
  fallback,
  opts,
}: WithSkiaProps) => {
  const Inner = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (): ClassicElement<{}> =>
      lazy(async () => {
        if (Platform.OS === "web") {
          await LoadSkiaWeb(opts);
        } else {
          console.warn(
            "<WithSkiaWeb /> is only necessary on web. Consider not using on native."
          );
        }
        return getComponent();
      }),
    [getComponent, opts]
  );
  return (
    <Suspense fallback={fallback ?? null}>
      <Inner />
    </Suspense>
  );
};
