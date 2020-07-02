import { useCallback } from "react";
import { useEventListener } from "./useEventListener";
import { ProxiedSet, useSet } from "./useSet";

export const usePressedKeys = (
  target: Element | Window = window,
  watchedKeys?: string[]
): ProxiedSet<string> => {
  const pressed = useSet<string>();

  const handleKeyDown = useCallback(
    (event) => {
      const { key, defaultPrevented } = event as KeyboardEvent;
      if (!defaultPrevented && (!watchedKeys || watchedKeys.includes(key))) {
        pressed.add(key);
      }
    },
    [pressed]
  );

  const handleKeyUp = useCallback(
    (event) => {
      const { key, defaultPrevented } = event as KeyboardEvent;
      if (!defaultPrevented) {
        pressed.delete(key);
      }
    },
    [pressed]
  );

  useEventListener(target, "keydown", handleKeyDown);
  useEventListener(target, "keyup", handleKeyUp);

  return pressed;
};
