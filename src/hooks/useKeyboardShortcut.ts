import { useContext, useEffect } from "react";
import { KeyboardShortcutsContext } from "../context";
import { Sequence } from "../types";

export const useKeyboardShortcut = (
  sequence: Sequence,
  callback: () => void,
  preventDefault = true
) => {
  const { registerShortcut } = useContext(KeyboardShortcutsContext);
  useEffect(() => registerShortcut(sequence, callback, preventDefault), [
    sequence,
    callback,
    preventDefault,
  ]);
};
