import { createContext, createElement, FC } from "react";
import { useKeyboardShortcutsApi } from "./hooks/useKeyboardShortcutsApi";
import { Sequence } from "./types";

export const KeyboardShortcutsContext = createContext<
  (sequence: Sequence, callback: () => void) => () => void
>(() => {
  throw new Error("No KeyboardShortcutProvider context found");
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
