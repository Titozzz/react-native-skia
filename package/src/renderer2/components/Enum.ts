export type SkEnum<T> = Uncapitalize<keyof T extends string ? keyof T : never>;

export const enumKey = <K extends string>(k: K) =>
  (k.charAt(0).toUpperCase() + k.slice(1)) as Capitalize<K>;
