import { useMemo, useState } from "react";

export interface ProxiedSet<S> extends Set<S> {
  toArray(): S[];
}

export function useSet<S, A extends any[] = []>(
  initialValueOrInitialiser: S[] | ((...args: A) => S[]) = [],
  ...initialiserArgs: A
): ProxiedSet<S> {
  const state = useState(() => {
    if (typeof initialValueOrInitialiser === "function") {
      return new Set(initialValueOrInitialiser(...initialiserArgs) as S[]);
    }
    return new Set(initialValueOrInitialiser);
  });

  return useMemo(() => makeSetImmutable(...state), state);
}

export const makeSetImmutable = <S>(
  set: Set<S>,
  setSet: (newSet: Set<S>) => void
): ProxiedSet<S> =>
  new Proxy(set, {
    get(set, key, r) {
      switch (key) {
        case "add":
          return (item: S) => setSet(new Set(set).add(item));
        case "delete":
          return (item: S) => {
            const newSet = new Set(set);
            newSet.delete(item);
            setSet(newSet);
          };
        case "clear":
          return () => setSet(new Set());
        case "toArray":
          return () => Array.from(set);
        default:
          const value = set[key as keyof Set<S>];
          return typeof value === "function" ? value.bind(set) : value;
      }
    },
  }) as ProxiedSet<S>;
