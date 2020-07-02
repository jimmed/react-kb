import { createContext, createElement, FC, useContext } from "react";
import { useKeyboardShortcutsApi } from "./hooks/useKeyboardShortcutsApi";
import { normalizeSequence } from "./hooks/useMappingState";
import { KeyboardShortcutsApi } from "./types";

export const KeyboardShortcutsContext = createContext<KeyboardShortcutsApi>({
  registerShortcut: (sequence) => {
    throw new Error(
      `Tried to add keyboard shortcut for [${normalizeSequence(sequence).join(
        "+"
      )}], but no KeyboardShortcutProvider context was found`
    );
  },
  registerIgnored: (element) => {
    throw new Error(
      `Tried to add ignored element [${element}], but no KeyboardShortcutProvider context was found`
    );
  },
  mappings: null as any,
  target: null as any,
});

export const KeyboardShortcutsProvider: FC<{ target?: Element | Window }> = ({
  children,
  target = window,
}) => {
  const parentContext = useContext(KeyboardShortcutsContext);
  const childContext = useKeyboardShortcutsApi(target);

  const value =
    parentContext.target === childContext.target ? parentContext : childContext;

  return createElement(KeyboardShortcutsContext.Provider, { value }, children);
};
