export interface StateChange<TState> {
    actionName: string;
    oldState: TState;
    newState: TState;
}
