import { deepCopy } from '@paperweight/utility';
import { merge, Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

import { Action } from './Action';
import { ActionSchema } from './ActionSchema';
import { StateChange } from './StateChange';
import { StateObserver } from './StateObserver';
import { KnownKeys, PayloadType, SecondParamOrEmpty } from './Types';

export class ComponentState<TState, TSchema extends ActionSchema<TState>> {
    private _observer: StateObserver<TState>;
    private _state: TState;

    constructor(initialState: TState, actions: TSchema) {
        this._state = initialState;

        this._observer = {
            actions: {},
            handlers: {},
            actionObservers: {}
        };

        this._initActions(actions);
    }

    private _initActions<A extends TSchema>(actions: A) {
        this._observer = {
            actions,
            ...this._observer
        };
        this._observer.handlers = this._getHandlers(actions);
    }

    public get<K extends keyof TState>(x: K): TState[K] {
        // do not expose modifiable reference to state
        return deepCopy(this._state[x]);
    }

    public observe<K extends KnownKeys<TSchema>>(actionName: K): Observable<StateChange<TState>> {
        const obs$ = this._observer.actionObservers[actionName as string];
        if (!obs$)
            throw new Error(`No action associated with ${actionName}.`);

        return obs$.asObservable()
            .pipe(share());
    }

    public observeAll(): Observable<StateChange<TState>> {
        return merge(
            ...Object.keys(this._observer.actionObservers)
                .map(key => this._observer.actionObservers[key].asObservable())
        )
            .pipe(share());
    }

    public execute<K extends KnownKeys<TSchema>>(
        actionName: K,
        ...payload: K extends string ? SecondParamOrEmpty<Parameters<TSchema[K]>> : never
    ): void {
        const handler = this._observer.handlers[actionName as string];

        if (!handler)
            throw new Error(`No handler for ${actionName}`)

        let newState: TState | undefined = undefined;
        try {
            newState = handler.apply(this, [this._state, payload[0]]);
        } finally {
            this._state = newState ?? this._state;
        }
    }

    private _getHandlers<T extends TSchema>(actions: T): StateObserver<TState>['handlers'] {
        const tmpHandlers: StateObserver<TState>['handlers'] = {};

        Object.keys(actions).forEach((actionKey: keyof T) => {
            const action: Action<TState, unknown> = actions[actionKey];
            if (!tmpHandlers[actionKey as string])
                tmpHandlers[actionKey as string] = this._wrapAction(actionKey as KnownKeys<TSchema>, action);
        });

        return tmpHandlers;
    }

    private _wrapAction<K extends KnownKeys<TSchema>, A extends Action<TState, unknown>, P extends PayloadType<A>>(
        actionName: K,
        action: A
    ): (state: TState, payload?: P) => TState {
        const subj = this._getActionObs(actionName);

        return (state: TState, payload?: P) => {
            const newState = action.apply(null, [deepCopy(state), payload]);
            subj.next({
                actionName: actionName as string,
                newState,
                oldState: state
            });
            return newState;
        }
    }

    private _getActionObs<K extends KnownKeys<TSchema>>(actionName: K): Subject<StateChange<TState>> {
        return this._observer.actionObservers[actionName as string]
            ?? this._createActionObs(actionName);
    }

    private _createActionObs<K extends KnownKeys<TSchema>>(actionName: K): Subject<StateChange<TState>> {
        return this._observer.actionObservers[actionName as string] = new Subject();
    }
}
