"use client";

/**
 * useMediaQuery is a custom React hook that listens for changes to a CSS media query.
 *
 * @param {string} query - The CSS media query to listen for changes to.
 *
 * @returns {boolean} - A boolean value that indicates whether the media query currently matches.
 *
 * @example
 * const isWideScreen = useMediaQuery('(min-width: 800px)');
 *
 * @throws {Error} - Throws an error if attempted to be used on the server-side, as it's a client-only hook.
 */
import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: (event: MediaQueryListEvent) => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = (): boolean => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = (): never => {
    throw Error("useMediaQuery is a client-only hook");
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
