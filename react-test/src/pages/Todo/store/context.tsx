import { createContext, PropsWithChildren } from "react";
import { useStore } from "./index";
import { StoreState } from "../types";
import { defaultState } from "./constants";

export const StoreContext = createContext<StoreState>(defaultState);

export const StoreWrapper: React.FC<PropsWithChildren> = (props) => {
  const state = useStore();

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};
