import { useEffect } from "react";

export const useEventListener = <E extends Element | Window | null>(
  target: E,
  eventType: keyof GlobalEventHandlersEventMap,
  callback: EventListenerOrEventListenerObject
) => {
  useEffect(() => {
    if (!target) return;
    target.addEventListener(eventType, callback);
    return () => target.removeEventListener(eventType, callback);
  }, [target, eventType, callback]);
};
