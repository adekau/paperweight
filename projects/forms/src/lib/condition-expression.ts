import { AbstractFormControl } from 'projects/contracts/src/public-api';
import { combineLatest, identity, Observable, of } from 'rxjs';
import { filter, flatMap, switchMap, takeWhile } from 'rxjs/operators';

import { PaperweightService } from './paperweight.service';
import { ConditionExpressionQuery } from './queries/condition-expression.query';
import { ConditionExpressionStore } from './stores/condition-expression.store';
import { FormNames, PaperweightSchema } from './types';

export type EventPredicate<TSource> = (
    val: TSource
) => boolean;

export type FormPredicate<TSource> = (
    val: any,
    control?: [TSource] extends [never]
        ? AbstractFormControl
        : undefined
) => boolean;

export class ConditionExpression<RegisteredForms extends PaperweightSchema, TSource = never> {

    constructor(
        private _store: ConditionExpressionStore,
        private _query: ConditionExpressionQuery,
        private _paperweightService: PaperweightService<RegisteredForms>
    ) { }

    public if(
        predicate: [TSource] extends [never]
            ? FormPredicate<TSource>
            : EventPredicate<TSource>
    ): this {
        this._store.update({ predicate });

        return this;
    }

    public once(): this {
        this._store.update({ once: true });

        return this;
    }

    public from<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[]
    ): this {
        const control = this._paperweightService.getFormControl(formName, path);
        this._store.update({
            source$: this._paperweightService.getControlValueChanges(control),
            key: this._transformKey(formName, path),
            control
        });

        return this;
    }

    public onEmit<T>(source: Observable<T>): ConditionExpression<RegisteredForms, T> {
        this._store.update({ source$: source });

        return new ConditionExpression<RegisteredForms, T>(this._store, this._query, this._paperweightService);
    }

    public compile(): Observable<[TSource] extends [never]
        ? [any, AbstractFormControl]
        : [TSource, undefined]
    > {
        const val = this._query.getValue();

        return this._query.select()
            .pipe(
                switchMap(state => state.source$),
                flatMap(value => combineLatest([of(value), val.control || of(undefined)])),
                filter(
                    ([value, control]: [TSource] extends [never] ? [any, AbstractFormControl] : [TSource, undefined]) =>
                        val.predicate(value, control)
                ),
                (val.once
                    ? takeWhile(([value, control]: [TSource] extends [never] ? [any, AbstractFormControl] : [TSource, undefined]) =>
                        !val.predicate(value, control), true)
                    : identity)
            );
    }

    public getKey(): string {
        return this._query.getValue().key;
    }

    private _transformKey<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[]
    ) {
        const p = Array.isArray(path)
            ? path.join('.')
            : path;
        return `${formName}:${p}`;
    }
}
