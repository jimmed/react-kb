import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { usePressedKeys } from "../usePressedKeys";

type Arguments = Parameters<typeof usePressedKeys>;
type HookType = ReturnType<typeof usePressedKeys>;

describe("usePressedKeys", () => {
  let hook: RenderHookResult<Arguments, HookType>;

  const render = (...args: Arguments) => {
    hook = renderHook((args: Arguments) => usePressedKeys(...args), {
      initialProps: args,
    });
  };

  const dispatchKeyboardEvent = (
    eventName: string,
    key: string,
    target: Window | HTMLElement = window,
    preventDefault = false
  ) => {
    act(() => {
      const event = new KeyboardEvent(eventName, { key });
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      target.dispatchEvent(event);
    });
  };

  describe("when called with no parameters", () => {
    beforeEach(() => render());

    it("is initially empty", () => {
      expect(hook.result.current.toArray()).toEqual([]);
    });

    describe("when any keys are pressed", () => {
      beforeEach(() => {
        dispatchKeyboardEvent("keydown", "X");
        dispatchKeyboardEvent("keydown", "F");
      });

      it("watches all key presses", () => {
        expect(hook.result.current.toArray()).toEqual(["X", "F"]);
      });
    });
  });

  describe("when called with a target element", () => {
    let element: HTMLDivElement;
    beforeEach(() => {
      element = document.createElement("div");
      render(element);
    });

    it("is empty initially", () => {
      expect(hook.result.current.toArray()).toEqual([]);
    });

    describe("when the window fires a keyboard event", () => {
      beforeEach(() => dispatchKeyboardEvent("keydown", "X"));

      it("does not capture the keypress", () => {
        expect(hook.result.current.toArray()).toEqual([]);
      });
    });

    describe("when the target element fires a keyboard event", () => {
      beforeEach(() => dispatchKeyboardEvent("keydown", "X", element));

      it("captures the keypress", () => {
        expect(hook.result.current.toArray()).toEqual(["X"]);
      });
    });
  });

  describe("when called with a target element and watched keys", () => {
    beforeEach(() => render(window, ["Ctrl", "Shift"]));

    it("is empty initially", () => {
      expect(hook.result.current.toArray()).toEqual([]);
    });

    describe("when an ignored key is pressed", () => {
      beforeEach(() => dispatchKeyboardEvent("keydown", "X"));
      it("remains empty", () => {
        expect(hook.result.current.toArray()).toEqual([]);
      });
    });

    describe("when one key is pressed down", () => {
      describe("if the event's default is prevented", () => {
        beforeEach(() =>
          dispatchKeyboardEvent("keydown", "Ctrl", window, true)
        );
        it("does not add the key to the set", () => {
          expect(hook.result.current.toArray()).toEqual([]);
        });
      });

      describe("if the event's default is not prevented", () => {
        beforeEach(() => dispatchKeyboardEvent("keydown", "Ctrl"));

        it("adds the key to the set", () => {
          expect(hook.result.current.toArray()).toEqual(["Ctrl"]);
        });

        describe("when another key is pressed down", () => {
          beforeEach(() => dispatchKeyboardEvent("keydown", "Shift"));

          it("adds the key to the set", () => {
            expect(hook.result.current.toArray()).toEqual(["Ctrl", "Shift"]);
          });

          describe("when the first key is released", () => {
            describe("if the event's default is prevented", () => {
              beforeEach(() =>
                dispatchKeyboardEvent("keyup", "Ctrl", window, true)
              );

              it("does not remove the key from the set", () => {
                expect(hook.result.current.toArray()).toEqual([
                  "Ctrl",
                  "Shift",
                ]);
              });
            });

            describe("if the event's default is not prevented", () => {
              beforeEach(() => dispatchKeyboardEvent("keyup", "Ctrl"));
              it("removes the key from the set", () => {
                expect(hook.result.current.toArray()).toEqual(["Shift"]);
              });

              describe("when the second key is released", () => {
                beforeEach(() => dispatchKeyboardEvent("keyup", "Shift"));
                it("removes the key from the set", () => {
                  expect(hook.result.current.toArray()).toEqual([]);
                });
              });
            });
          });
        });
      });
    });
  });
});
