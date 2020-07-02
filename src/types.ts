export type Sequence = string | string[];

export interface KeyboardShortcutsApi {
  registerShortcut: RegisterKeyboardShortcut;
  registerIgnored: RegisterIgnoreElement;
  mappings: ShortcutMapping[];
  target: Element | Window;
}

export interface RegisterKeyboardShortcut {
  (
    sequence: Sequence,
    callback: () => void,
    preventDefault?: boolean
  ): Unregister;
}

export interface RegisterIgnoreElement {
  (element: Element): Unregister;
}

export interface Unregister {
  (): void;
}

export interface ShortcutMapping {
  sequence: string[];
  callback: () => void;
  preventDefault?: boolean;
}
