import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { RegisterKeyboardShortcut } from "../../types";
import { useKeyboardShortcutsApi } from "../useKeyboardShortcutsApi";

describe("useKeyboardShorcutsApi", () => {
  let hook: RenderHookResult<Element | Window, RegisterKeyboardShortcut>;
  let element: HTMLDivElement;

  const render = (target: Element | Window) => {
    hook = renderHook(useKeyboardShortcutsApi, { initialProps: target });
  };

  beforeEach(() => {
    element = document.createElement("div");
  });

  describe.each([
    ["the window", () => window],
    ["an element", () => element],
  ])("when attached to %s", (_, getTarget) => {
    let callback: () => void;

    beforeEach(() => render(getTarget()));

    describe("when a keyboard shortcut is registered", () => {
      beforeEach(() => {
        callback = jest.fn();
        act(() => {
          hook.result.current("Ctrl+N", callback);
        });
      });

      it("does not fire the callback", () => {
        expect(callback).not.toHaveBeenCalled();
      });

      describe("when the keyboard shortcut is pressed", () => {
        beforeEach(() => {
          act(() => {
            getTarget().dispatchEvent(
              new KeyboardEvent("keydown", { key: "Ctrl" })
            );
          });
          act(() => {
            getTarget().dispatchEvent(
              new KeyboardEvent("keydown", { key: "N" })
            );
          });
        });

        it("fires the callback", () => {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
