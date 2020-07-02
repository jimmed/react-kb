import { useCallback } from "react";
import { useEventListener } from "./useEventListener";
import { ProxiedSet, useSet } from "./useSet";

export const usePressedKeys = (
  target: Element | Window = window,
  watchedKeys?: string[],
  ignoredElements?: ProxiedSet<Element>
): ProxiedSet<string> => {
  const pressed = useSet<string>();

  const isIgnored = useCallback(
    (target: Element) =>
      ignoredElements?.has(target) ||
      ignoredElements?.toArray().some((el) => el.contains(target)),
    [ignoredElements]
  );

  const handleKeyDown = useCallback(
    (event) => {
      const { key, defaultPrevented, target } = event as KeyboardEvent;
      if (
        !defaultPrevented &&
        (!watchedKeys || watchedKeys.includes(key)) &&
        !isIgnored(target as Element)
      ) {
        pressed.add(key);
      }
    },
    [pressed]
  );

  const handleKeyUp = useCallback(
    (event) => {
      const { key, defaultPrevented, target } = event as KeyboardEvent;
      if (!defaultPrevented && !isIgnored(target as Element)) {
        pressed.delete(key);
      }
    },
    [pressed]
  );

  useEventListener(target, "keydown", handleKeyDown);
  useEventListener(target, "keyup", handleKeyUp);

  return pressed;
};
