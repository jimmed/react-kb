import { useCallback } from "react";
import { useEventListener } from "./useEventListener";
import { ProxiedSet, useSet } from "./useSet";

export const usePressedKeys = (
  target: Element | Window = window,
  watchedKeys?: string[]
): ProxiedSet<string> => {
  const pressed = useSet<string>();

  useEventListener(
    target,
    "keydown",
    useCallback(
      (event) => {
        const { key, defaultPrevented } = event as KeyboardEvent;
        if (!defaultPrevented && (!watchedKeys || watchedKeys.includes(key))) {
          pressed.add(key);
        }
      },
      [pressed]
    )
  );

  useEventListener(
    target,
    "keyup",
    useCallback(
      (event) => {
        const { key, defaultPrevented } = event as KeyboardEvent;
        if (!defaultPrevented) {
          pressed.delete(key);
        }
      },
      [pressed]
    )
  );

  return pressed;
};
