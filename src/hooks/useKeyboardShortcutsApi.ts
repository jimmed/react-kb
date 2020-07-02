import { useEffect, useCallback } from "react";
import { KeyboardShortcutsApi } from "../types";
import { useMappingState } from "./useMappingState";
import { usePressedKeys } from "./usePressedKeys";
import { useSet } from "./useSet";

export const useKeyboardShortcutsApi = (
  target: Element | Window
): KeyboardShortcutsApi => {
  const ignored = useSet<Element>();
  const pressed = usePressedKeys(target, undefined, ignored);
  const { mappings, registerShortcut } = useMappingState();

  const registerIgnored = useCallback(
    (element: Element) => {
      ignored.add(element);
      return () => {
        ignored.delete(element);
      };
    },
    [ignored]
  );

  useEffect(() => {
    mappings.forEach((mapping) => {
      if (
        mapping.sequence.length === pressed.size &&
        mapping.sequence.every((key) => pressed.has(key))
      ) {
        mapping.callback();
      }
    });
  }, [mappings, pressed]);

  return { registerShortcut, registerIgnored, mappings, target };
};
