import { createContext, createElement, FC } from "react";
import { useKeyboardShortcutsApi } from "./hooks/useKeyboardShortcutsApi";
import { Sequence } from "./types";
import { normalizeSequence } from "./hooks/useMappingState";

export const KeyboardShortcutsContext = createContext<
  (
    sequence: Sequence,
    callback: () => void,
    preventDefault?: boolean
  ) => () => void
>((sequence) => {
  throw new Error(
    `Tried to add keyboard shortcut for [${normalizeSequence(sequence).join(
      "+"
    )}], but no KeyboardShortcutProvider context was found`
  );
});

export const KeyboardShortcutsProvider: FC<{ target?: Element | Window }> = ({
  children,
  target = window,
}) =>
  createElement(
    KeyboardShortcutsContext.Provider,
    { value: useKeyboardShortcutsApi(target) },
    children
  );
