# useKeyboardShortcuts

Use keyboard shortcuts to control your React app.

## Basic Usage

1. Wrap the top level of your application with a `KeyboardShortcutProvider`:

   ```tsx
   import React from "react";
   import { render } from "react-dom";
   import { KeyboardShortcutProvider } from "react-kb";
   import { App } from "./App";

   render(
     <KeyboardShortcutProvider>
       <App />
     </KeyboardShortcutProvider>,
     document.getElementById("root")
   );
   ```

2. In a component, use the `useKeyboardShortcut` hook to enable some keyboard shortcuts:

   ```tsx
   import React, { useCallback, useState } from "react";
   import { useKeyboardShortcut } from "react-kb";

   export const MyCounter = () => {
     const [count, setCount] = useState(0);

     const addOne = useCallback(() => setCount(count + 1), [count]);
     const subOne = useCallback(() => setCount(count - 1), [count]);
     const reset = useCallback(() => setCount(0), []);

     useKeyboardShortcut("Up", addOne);
     useKeyboardShortcut("Down", subOne);
     useKeyboardShortcut("Escape", reset);

     return <p>Count: {count}</p>;
   };
   ```

### Keyboard shortcuts

When specifying a key to listen for, you can use any value supported by the `key` property of the browser's native `KeyboardEvent`.

> You can find a [full list of valid key names on MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values).

### Keyboard combinations

When calling `useKeyboardShortcut`, if you want to specify a combination of multiple keys, you can either pass the keys as:

- a string, joining the keys with `+` (e.g. `"Ctrl+Alt+F"`), or
- an array of keys, e.g. `['Ctrl', 'Alt', 'F']`.

### Capturing keypresses from a specific element

By default, `KeyboardShortcutProvider` will listen for events on the `window` object. This can be overridden by passing the target element as the `target` prop.

```tsx
const rootElement = document.getElementById("root");

render(
  <KeyboardShortcutProvider target={rootElement}>
    <App />
  </KeyboardShortcutProvider>,
  rootElement
);
```
