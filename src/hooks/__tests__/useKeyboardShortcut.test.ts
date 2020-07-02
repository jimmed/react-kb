import {
  renderHook,
  RenderHookResult,
  act,
} from "@testing-library/react-hooks";
import { useKeyboardShortcut } from "../useKeyboardShortcut";
import { KeyboardShortcutsProvider } from "../../context";
import { createElement } from "react";

describe("useKeyboardShortcut", () => {
  describe("when rendered outside of a KeyboardShortcutProvider", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockReturnValue();
    });
    it("throws an error", () => {
      expect(() =>
        renderHook(() => useKeyboardShortcut("X", () => {}))
      ).toThrowError(
        "Tried to add keyboard shortcut for [X], but no KeyboardShortcutProvider context was found"
      );
    });
  });

  describe("when rendered inside of a KeyboardShortcutProvider", () => {
    let element: HTMLDivElement;
    beforeEach(() => {
      element = document.createElement("div");
    });

    describe.each([
      ["undefined", () => undefined],
      ["the window", () => window],
      ["a DOM element", () => element],
    ])("when target is %s", (_, getTarget) => {
      describe.each([
        [true, true],
        [false, false],
        [undefined, true],
      ])(
        "when preventDefault = %s",
        (inputPreventDefault, expectedPreventDefault) => {
          let callback: jest.Mock;
          beforeEach(() => {
            callback = jest.fn();
            renderHook(
              () => useKeyboardShortcut("X", callback, inputPreventDefault),
              {
                wrapper: ({ children }) =>
                  createElement(
                    KeyboardShortcutsProvider,
                    { target: getTarget() },
                    children
                  ),
              }
            );
          });

          describe("when the key is pressed", () => {
            let event: KeyboardEvent;
            beforeEach(() => {
              event = new KeyboardEvent("keydown", { key: "X" });
              jest.spyOn(event, "preventDefault");
              act(() => {
                (getTarget() ?? window).dispatchEvent(event);
              });
            });
            it("fires the callback when the key is pressed", () => {
              expect(callback).toHaveBeenCalledTimes(1);
            });

            it.skip(`${
              expectedPreventDefault ? "prevents" : "does not prevent"
            } default on the event`, () => {
              expect(event.preventDefault).toHaveBeenCalledTimes(
                expectedPreventDefault ? 1 : 0
              );
            });
          });
        }
      );
    });
  });
});
