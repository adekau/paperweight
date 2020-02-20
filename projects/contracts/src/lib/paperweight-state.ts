import { SubscriptionLike } from 'rxjs';

import { AbstractFormGroup } from './abstract-form-group';

export interface IPaperweightState {
    forms: {
        [k: string]: AbstractFormGroup;
    };

    subscriptions: {
        [k: string]: SubscriptionLike
    };
}
