import { createContext, PropsWithChildren, useReducer } from 'react';

export function createCtx<StateType, ActionType>(
  reducer: React.Reducer<StateType, ActionType>,
  initialState: StateType
) {
  const defaultDispatch: React.Dispatch<ActionType> = () => initialState;

  const ctx = createContext({
    state: initialState,
    dispatch: defaultDispatch,
  });

  const Provider = (props: PropsWithChildren<{ defaultState?: StateType }>) => {
    const [state, dispatch] = useReducer<React.Reducer<StateType, ActionType>>(
      reducer,
      props.defaultState || initialState
    );
    return <ctx.Provider value={{ state, dispatch }} {...props} />;
  };

  return [ctx, Provider] as const;
}
