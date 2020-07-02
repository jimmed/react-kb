import { useContext, useEffect } from "react";
import { KeyboardShortcutsContext } from "../context";

export const useIgnoreKeyboardShortcuts = (element?: Element | null) => {
  const { registerIgnored } = useContext(KeyboardShortcutsContext);
  useEffect(() => {
    if (element) return registerIgnored(element);
  }, [element]);
};
