import { importSkia, width, height } from "../../renderer/__tests__/setup";
import { setupSkia } from "../../skia/__tests__/setup";
import { processResult } from "../../__tests__/setup";

describe("Drawings", () => {
  it("Apple Breathe Demo", () => {
    const { surface, canvas } = setupSkia(width, height);
    const { Skia, vec, polar2Canvas } = importSkia();
    const c = vec(width / 2, height / 2);
    const c1 = Skia.Color("#61bea2");
    const c2 = Skia.Color("#529ca0");
    const R = width / 4;
    const color = Skia.Color("rgb(36,43,56)");
    const root = Sk.Group({ color });
    root.addChild(Sk.Fill());
    const rings = Sk.Group({
      blendMode: "screen",
    });
    const blur = Sk.BlurMaskFilter({
      blur: 10,
      style: "solid",
      respectCTM: true,
    });
    expect(blur.isMaskFilter()).toBe(true);
    rings.addChild(blur);
    for (let i = 0; i < 6; i++) {
      const theta = (i * (2 * Math.PI)) / 6;
      const matrix = Skia.Matrix();
      const { x, y } = polar2Canvas({ theta, radius: R }, { x: 0, y: 0 });
      matrix.translate(x, y);
      const ring = Sk.Group({
        matrix,
        color: i % 2 ? c1 : c2,
      });
      ring.addChild(Sk.Circle({ c, r: R }));
      rings.addChild(ring);
    }
    root.addChild(rings);
    const ctx = { canvas, paint: Skia.Paint(), opacity: 1, Skia };
    root.render(ctx);
    processResult(surface, "snapshots/demos/breathe.png");
  });

  it("Apple Breathe Demo with the new API", () => {
    const { surface, canvas } = setupSkia(width, height);
    const { Skia, vec, polar2Canvas } = importSkia();
    const c = vec(width / 2, height / 2);
    const c1 = Skia.Color("#61bea2");
    const c2 = Skia.Color("#529ca0");
    const R = width / 4;
    const color = Skia.Color("rgb(36,43,56)");
    const root = Sk.Group({ color });
    root.addChild(Sk.Fill());
    const rings = Sk.Group({
      blendMode: "screen",
    });
    const blur = Sk.BlurMaskFilter({
      blur: 10,
      style: "solid",
      respectCTM: true,
    });
    expect(blur.isMaskFilter()).toBe(true);
    rings.addChild(blur);
    for (let i = 0; i < 6; i++) {
      const theta = (i * (2 * Math.PI)) / 6;
      const matrix = Skia.Matrix();
      const { x, y } = polar2Canvas({ theta, radius: R }, { x: 0, y: 0 });
      matrix.translate(x, y);
      rings.addChild(Sk.Circle({ c, r: R, matrix, color: i % 2 ? c1 : c2 }));
    }
    root.addChild(rings);
    const ctx = { canvas, paint: Skia.Paint(), opacity: 1, Skia };
    root.render(ctx);
    processResult(surface, "snapshots/demos/breathe.png");
  });
});

// TODO: add test where each circle is not around a group
