import { useContext, useEffect } from "react";
import { KeyboardShortcutsContext } from "../context";
import { Sequence } from "../types";

export const useKeyboardShortcuts = (
  sequence: Sequence,
  callback: () => void
) => {
  const register = useContext(KeyboardShortcutsContext);
  useEffect(() => register(sequence, callback), [sequence, callback]);
};
