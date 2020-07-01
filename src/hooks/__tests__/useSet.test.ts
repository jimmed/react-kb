import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { makeSetImmutable, ProxiedSet, useSet } from "../useSet";

describe("makeSetImmutable", () => {
  const initialValues = ["a", "b", "c"];

  let set: Set<string>;
  let setSet: jest.Mock<void, [Set<string>]>;
  let proxiedSet: ProxiedSet<string>;

  beforeEach(() => {
    set = new Set(initialValues);
    setSet = jest.fn();
    proxiedSet = makeSetImmutable(set, setSet);
  });

  it("returns a proxy over a Set", () => {
    expect(proxiedSet).toBeInstanceOf(Set);
  });

  describe("toArray", () => {
    it("returns an array of values", () => {
      expect(proxiedSet.toArray()).toEqual(initialValues);
    });
  });

  describe("add", () => {
    beforeEach(() => {
      jest.spyOn(set, "add");
      proxiedSet.add("d");
    });

    it("does not call the underlying add method", () => {
      expect(set.add).not.toHaveBeenCalled();
    });

    it("calls the setSet method with an updated set", () => {
      expect(setSet).toHaveBeenCalledWith(expect.any(Set));
      expect(setSet).toHaveBeenCalledTimes(1);
      expect(Array.from(setSet.mock.calls[0][0].values())).toEqual([
        "a",
        "b",
        "c",
        "d",
      ]);
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      jest.spyOn(set, "delete");
      proxiedSet.delete("b");
    });

    it("does not call the underlying delete method", () => {
      expect(set.delete).not.toHaveBeenCalled();
    });

    it("calls the setSet method with an updated set", () => {
      expect(setSet).toHaveBeenCalledWith(expect.any(Set));
      expect(setSet).toHaveBeenCalledTimes(1);
      expect(Array.from(setSet.mock.calls[0][0].values())).toEqual(["a", "c"]);
    });
  });

  describe("clear", () => {
    beforeEach(() => {
      jest.spyOn(set, "clear");
      proxiedSet.clear();
    });

    it("does not call the underlying clear method", () => {
      expect(set.clear).not.toHaveBeenCalled();
    });

    it("calls the setSet method with an updated set", () => {
      expect(setSet).toHaveBeenCalledWith(expect.any(Set));
      expect(setSet).toHaveBeenCalledTimes(1);
      expect(Array.from(setSet.mock.calls[0][0].values())).toEqual([]);
    });
  });
});

describe("useSet", () => {
  let hook: RenderHookResult<
    Parameters<typeof useSet>,
    ReturnType<typeof useSet>
  >;

  const render = (...args: any[]) => {
    hook = renderHook((args: any[]) => useSet(...args), {
      initialProps: args,
    });
  };

  describe("when called with no arguments", () => {
    beforeEach(() => render());
    it("it is initialised empty", () => {
      expect(hook.result.current.toArray()).toEqual([]);
    });
  });

  describe("when called with an array of values", () => {
    beforeEach(() => render([1, 2, 3]));
    it("it is initialised with the values of the array", () => {
      expect(hook.result.current.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe("when called with an initialiser function", () => {
    let initialiser: jest.Mock;
    beforeEach(() => {
      initialiser = jest.fn().mockReturnValueOnce([3, 2, 1]);
      render(initialiser, "x", "f");
    });

    it("it is initialised with the result of the initialiser", () => {
      expect(hook.result.current.toArray()).toEqual([3, 2, 1]);
    });

    it("passes any extra arguments to the initialiser", () => {
      expect(initialiser).toHaveBeenCalledTimes(1);
      expect(initialiser).toHaveBeenCalledWith("x", "f");
    });
  });

  describe("add", () => {
    beforeEach(() => render());

    it("adds an item to the set", () => {
      act(() => {
        hook.result.current.add(1);
      });
      expect(hook.result.current.toArray()).toEqual([1]);
      act(() => {
        hook.result.current.add(2);
      });
      expect(hook.result.current.toArray()).toEqual([1, 2]);
      act(() => {
        hook.result.current.add(3);
      });
      expect(hook.result.current.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe("delete", () => {
    beforeEach(() => render([3, 2, 1]));

    it("deletes an item from the set", () => {
      act(() => {
        hook.result.current.delete(2);
      });
      expect(hook.result.current.toArray()).toEqual([3, 1]);
      act(() => {
        hook.result.current.delete(3);
      });
      expect(hook.result.current.toArray()).toEqual([1]);
      act(() => {
        hook.result.current.delete(1);
      });
      expect(hook.result.current.toArray()).toEqual([]);
    });
  });

  describe("clear", () => {
    beforeEach(() => render([1, 2, 3]));

    it("clears the set", () => {
      act(() => {
        hook.result.current.clear();
      });
      expect(hook.result.current.toArray()).toEqual([]);
    });
  });
});
