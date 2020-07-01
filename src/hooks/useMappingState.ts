import { useCallback, useMemo } from "react";
import { Sequence } from "../types";
import { useSet } from "./useSet";

export const useMappingState = () => {
  const mappings = useSet<{ sequence: string[]; callback: () => void }>();

  const register = useCallback(
    (sequence: Sequence, callback: () => void) => {
      const mapping = { sequence: normalizeSequence(sequence), callback };
      mappings.add(mapping);
      return () => {
        mappings.delete(mapping);
      };
    },
    [mappings]
  );

  return { mappings: useMemo(() => mappings.toArray(), [mappings]), register };
};

export const normalizeSequence = (sequence: Sequence): string[] =>
  Array.isArray(sequence) ? sequence : sequence.split(/\s*\+\s*/g);
