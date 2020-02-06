import { Action } from './Action';

export interface ActionSchema<TState> {
    [a: string]: Action<TState, unknown>;
}
