import {createContext,useContext,useLayoutEffect} from "react";
export const StartupContext = createContext(false);
/** Runs only when the home screen or a resolved route has actually committed. */
export function StartupReady() {
  const ready = useContext(StartupContext);
  useLayoutEffect(() => {
    if (ready) document.dispatchEvent(new Event("abb:ready"));
  }, [ready]);
  return null;
}
