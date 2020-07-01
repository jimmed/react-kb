import { useEffect } from "react";
import { useMappingState } from "./useMappingState";
import { usePressedKeys } from "./usePressedKeys";

export const useKeyboardShortcutsApi = (target: Element | Window) => {
  const pressed = usePressedKeys(target);
  const { mappings, register } = useMappingState();

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

  return register;
};
