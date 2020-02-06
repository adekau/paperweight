import { Subject } from 'rxjs';

import { Action } from './Action';
import { ActionSchema } from './ActionSchema';
import { StateChange } from './StateChange';

export interface StateObserver<TState> {
    actions: ActionSchema<TState>;
    handlers: { [h: string]: Action<TState, unknown> }
    actionObservers: { [h: string]: Subject<StateChange<TState>> };
}
