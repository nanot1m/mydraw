import { useState, useEffect } from "react";
import { StateHistory } from "./state-history";

export function useStateHistory<T>(state: T) {
  const [history] = useState(() => StateHistory.of(state));
  const [hasNext, setHasNext] = useState(history.hasNext());
  const [hasPrev, setHasPrev] = useState(history.hasPrev());

  useEffect(() => {
    if (history.get() !== state) {
      history.push(state);
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
    }
  }, [history, state]);

  return {
    hasPrev,
    hasNext,
    goBack() {
      history.goBack();
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
      return history.get();
    },
    goForward() {
      history.goForward();
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
      return history.get();
    },
  };
}
