import { useContext, useEffect } from "react";
import { KeyboardShortcutsContext } from "../context";
import { Sequence } from "../types";

export const useKeyboardShortcut = (
  sequence: Sequence,
  callback: () => void,
  preventDefault = true
) => {
  const register = useContext(KeyboardShortcutsContext);
  useEffect(() => register(sequence, callback, preventDefault), [
    sequence,
    callback,
    preventDefault,
  ]);
};
