import { Subject, SubscriptionLike } from 'rxjs';

import { AbstractFormGroup } from './abstract-form-group';
import { IDraftSaveEvent } from './draft-save-event';

export interface IPaperweightState {
    forms: {
        [k: string]: AbstractFormGroup;
    };

    subscriptions: {
        [k: string]: SubscriptionLike
    };

    draftSave$: Subject<IDraftSaveEvent>;
}
