export const mapKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];

export const exhaustiveCheck = (
  a: never,
  msg = "Unexhaustive handling for"
): never => {
  throw new Error(`${msg} ${a}`);
};

// Shallow eq on props (without children)
export const shallowEq = <P>(p1: P, p2: P): boolean => {
  const keys1 = mapKeys(p1);
  const keys2 = mapKeys(p2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (key === "children") {
      continue;
    }
    if (p1[key] !== p2[key]) {
      return false;
    }
  }
  return true;
};
