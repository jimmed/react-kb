import { useCallback, useMemo } from "react";
import { RegisterKeyboardShortcut, Sequence, ShortcutMapping } from "../types";
import { useSet } from "./useSet";

export const useMappingState = () => {
  const mappings = useSet<ShortcutMapping>();

  const registerShortcut = useCallback<RegisterKeyboardShortcut>(
    (sequence, callback, preventDefault = true) => {
      const mapping = {
        sequence: normalizeSequence(sequence),
        callback,
        preventDefault,
      };
      mappings.add(mapping);
      return () => {
        mappings.delete(mapping);
      };
    },
    [mappings]
  );

  return {
    mappings: useMemo(() => mappings.toArray(), [mappings]),
    registerShortcut,
  };
};

export const normalizeSequence = (sequence: Sequence): string[] =>
  Array.isArray(sequence) ? sequence : sequence.split(/\s*\+\s*/g);
