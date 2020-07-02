import { RenderHookResult, renderHook } from "@testing-library/react-hooks";
import { useEventListener } from "../useEventListener";

describe("useEventListener", () => {
  let listener: jest.Mock;
  let hook: RenderHookResult<void, void>;

  describe("when no target is provided", () => {
    beforeEach(() => {
      listener = jest.fn();
      jest.spyOn(window, "addEventListener");
      jest.spyOn(window, "removeEventListener");
      hook = renderHook(() => useEventListener(null, "keydown", listener));
    });

    it("does not attach an event listener", () => {
      expect(window.addEventListener).not.toHaveBeenCalledWith(
        "keydown",
        listener
      );
    });

    describe("when the target fires an event", () => {
      beforeEach(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", {}));
      });

      it("does not fire the callback", () => {
        expect(listener).not.toHaveBeenCalled();
      });
    });
  });

  describe("on mount", () => {
    beforeEach(() => {
      listener = jest.fn();
      jest.spyOn(window, "addEventListener");
      jest.spyOn(window, "removeEventListener");
      hook = renderHook(() => useEventListener(window, "keydown", listener));
    });

    it("attaches an event listener to the target element", () => {
      expect(window.addEventListener).toHaveBeenCalledWith("keydown", listener);
    });

    describe("when the target fires a matching event", () => {
      const event = new KeyboardEvent("keydown", {});
      beforeEach(() => {
        window.dispatchEvent(event);
      });

      it("fires the callback, passing it the event", () => {
        expect(listener).toHaveBeenCalledWith(event);
      });
    });

    describe("when the target fires a non-matching event", () => {
      const event = new KeyboardEvent("keyup", {});
      beforeEach(() => {
        window.dispatchEvent(event);
      });

      it("does not fire the callback", () => {
        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe("on unmount", () => {
      beforeEach(() => {
        hook.unmount();
      });
      it("removes the event listener from the target element", () => {
        expect(window.removeEventListener).toHaveBeenCalledWith(
          "keydown",
          listener
        );
      });
    });
  });
});
