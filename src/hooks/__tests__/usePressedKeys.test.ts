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

  const dispatchKeyboardEvent = (event: string, key: string) => {
    act(() => {
      window.dispatchEvent(new KeyboardEvent(event, { key }));
    });
  };

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
