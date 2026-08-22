import { useCallback, useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const idleState = { data: null, loading: false, error: null } as const;

/**
 * Shared fetch/loading/error/refetch plumbing so every feature hook
 * doesn't reimplement it. Pass `null` as fetcher to skip fetching (e.g.
 * while the authenticated user id isn't known yet) — the idle state is
 * derived at render time rather than pushed from the effect, since it's
 * fully determined by `fetcher` itself.
 */
export function useAsyncData<T>(
  fetcher: (() => Promise<T>) | null,
  deps: unknown[]
) {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!fetcher) return;
    let cancelled = false;
    // Signals "refetch in flight" before the async call starts — the
    // documented React data-fetching pattern, not props-mirroring.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAsyncState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (!cancelled) setAsyncState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        console.error(error);
        if (!cancelled) setAsyncState({ data: null, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  if (!fetcher) return { ...idleState, refetch };
  return { ...asyncState, refetch };
}
