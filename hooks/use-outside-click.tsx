
import { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  callback: () => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
