export type Sequence = string | string[];

export interface RegisterKeyboardShortcut {
  (
    sequence: Sequence,
    callback: () => void,
    preventDefault?: boolean
  ): UnregisterKeyboardShortcut;
}

export interface UnregisterKeyboardShortcut {
  (): void;
}
