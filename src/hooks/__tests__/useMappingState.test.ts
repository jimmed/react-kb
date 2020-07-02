import { useMappingState, normalizeSequence } from "../useMappingState";
import {
  renderHook,
  RenderHookResult,
  act,
} from "@testing-library/react-hooks";

describe("useMappingState", () => {
  let hook: RenderHookResult<void, ReturnType<typeof useMappingState>>;

  beforeEach(() => {
    hook = renderHook(useMappingState);
  });

  it("is empty initially", () => {
    expect(hook.result.current.mappings).toEqual([]);
  });

  describe("when register is called", () => {
    let callback: jest.Mock;
    let unregister: () => void;

    describe.each([
      [true, true],
      [false, false],
      [undefined, true],
    ])(
      "when preventDefault is %s",
      (inputPreventDefault, expectedPreventDefault) => {
        beforeEach(() => {
          callback = jest.fn();
          act(() => {
            unregister = hook.result.current.registerShortcut(
              "Alt+N",
              callback,
              inputPreventDefault
            );
          });
        });

        it("adds an item", () => {
          expect(hook.result.current.mappings).toEqual([
            {
              sequence: ["Alt", "N"],
              callback,
              preventDefault: expectedPreventDefault,
            },
          ]);
        });

        describe("when the returned unregister function is called", () => {
          beforeEach(() => {
            act(unregister);
          });

          it("removes the item", () => {
            expect(hook.result.current.mappings).toEqual([]);
          });
        });
      }
    );
  });
});

describe("normalizeSequence", () => {
  describe.each([
    ["a string", "Ctrl+Shift+N"],
    ["an array", ["Ctrl", "Shift", "N"]],
  ])("when called with %s", (_, input) => {
    expect(normalizeSequence(input)).toEqual(["Ctrl", "Shift", "N"]);
  });
});
