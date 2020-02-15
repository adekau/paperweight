import { merge, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { FormDraftService } from './form-draft.service';
import { FormInteractionExpressionQuery } from './queries/form-interaction-expression.query';
import { FormInteractionExpressionStore } from './stores/form-interaction-expression.store';

export type ActionFn = () => Observable<any>;

interface ActionFns {
    setDisabled: (formName: string, path: string | string[], disabled: boolean) => ActionFn;
    setValue: <T>(formName: string, path: string | string[], value: T) => ActionFn;
}

export class FormInteractionExpression {
    private _store: FormInteractionExpressionStore;
    private _query: FormInteractionExpressionQuery;

    constructor(
        private _formDraftService: FormDraftService
    ) {
        this._store = new FormInteractionExpressionStore();
        this._query = new FormInteractionExpressionQuery(this._store);
    }

    public when(
        formName: string,
        path: string | string[],
        predicate: (value: any) => boolean,
        action: (action: ActionFns) => ActionFn | ActionFn[]
    ): this {
        const controlVc$ = this._formDraftService.getControlValueChanges(formName, path);
        const actions = action(this._actionFns());
        const obs$ = controlVc$.pipe(
            flatMap(v => predicate(v)
                ? Array.isArray(actions)
                    ? merge(...(actions.map(ac => ac())))
                    : actions()
                : of(v))
        );

        this._store.update(state => ({
            observers: {
                ...(state.observers || {}),
                [this._transformKey(formName, path)]: obs$
            }
        }));

        return this;
    }

    public compile(): Observable<any> {
        const observers = this._query.getObserversSync();
        return merge(...Object.values(observers));
    }

    private _actionFns(): ActionFns {
        return {
            setDisabled: (formName: string, path: string | string[], disabled: boolean) => () => {
                const control = this._formDraftService.getFormControl(formName, path);

                return control.pipe(
                    flatMap(c => this._formDraftService.setDisabled(c, disabled))
                );
            },

            setValue: <T>(formName: string, path: string | string[], value: T) => () => {
                const control = this._formDraftService.getFormControl(formName, path);

                return control.pipe(
                    flatMap(c => this._formDraftService.setValue(c, value))
                );
            }
        };
    }

    private _transformKey(formName: string, path: string | string[]) {
        const p = Array.isArray(path) ? path.join('.') : path;
        return `${formName}:${p}`;
    }
}
