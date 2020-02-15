import { identity, Observable } from 'rxjs';
import { filter, switchMap, takeWhile, tap } from 'rxjs/operators';

import { FormDraftService } from './form-draft.service';
import { ConditionExpressionQuery } from './queries/condition-expression.query';
import { ConditionExpressionStore } from './stores/condition-expression.store';

export class ConditionExpression {
    private _store: ConditionExpressionStore;
    private _query: ConditionExpressionQuery;

    constructor(
        private _formDraftService: FormDraftService
    ) {
        this._store = new ConditionExpressionStore();
        this._query = new ConditionExpressionQuery(this._store);
    }

    public if(predicate: (val: any) => boolean): this {
        this._store.update({ predicate });

        return this;
    }

    public once(): this {
        this._store.update({ once: true });

        return this;
    }

    public from(formName: string, path: string | string[]): this {
        this._store.update({
            source$: this._formDraftService.getControlValueChanges(formName, path),
            key: this._transformKey(formName, path)
        });

        return this;
    }

    public onEmit<T>(source: Observable<T>): this {
        this._store.update({ source$: source });

        return this;
    }

    public compile(): Observable<any> {
        const val = this._query.getValue();

        return this._query.select()
            .pipe(
                switchMap(state => state.source$),
                filter(value => val.predicate(value)),
                (
                    val.once
                        ? takeWhile(value => !val.predicate(value), true)
                        : identity
                )
            );
    }

    public getKey(): string {
        return this._query.getValue().key;
    }

    private _transformKey(formName: string, path: string | string[]) {
        const p = Array.isArray(path) ? path.join('.') : path;
        return `${formName}:${p}`;
    }
}
