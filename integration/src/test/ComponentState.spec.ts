import { async } from '@angular/core/testing';

import { Action, ActionSchema, ComponentState, StateChange } from '../../../packages/state/lib';

interface MyState {
    count: number;
};

const initial: MyState = { count: 5 };

interface MySchema extends ActionSchema<MyState> {
    increment: Action<MyState>;
    add: Action<MyState, number>;
}

const actions: MySchema = {
    increment: (state) => ({
        count: state.count + 1
    }),
    add: (state, payload) => ({
        count: state.count + payload
    })
};

describe('ComponentState', () => {
    it('should create a state', () => {
        const st = new ComponentState(initial, actions);

        expect(st.get('count')).toEqual(5);
    });

    it('should execute an action', () => {
        const st = new ComponentState(initial, actions);
        st.execute('increment');
        expect(st.get('count')).toEqual(6);
    });

    it('should observe actions', async(() => {
        const st = new ComponentState(initial, actions);
        const incr$ = st.observe('increment');
        const add$ = st.observe('add');

        incr$.subscribe({
            next: (ev: StateChange<MyState>) => {
                expect(ev.newState.count).toEqual(6);
                expect(ev.oldState.count).toEqual(5);
            }
        });

        add$.subscribe({
            next: (ev) => {
                // incr finishes first
                expect(ev.newState.count).toEqual(71);
                expect(ev.oldState.count).toEqual(6);
            }
        });

        st.execute('increment');
        st.execute('add', 65);
    }));

    it('should observe all actions', async(() => {
        const st = new ComponentState(initial, actions);
        const all$ = st.observeAll();

        const called = [];
        all$.subscribe({
            next: (ev) => {
                called.push(ev.actionName);
            }
        });
        st.execute('increment');
        st.execute('increment');
        st.execute('add', 5);
        st.execute('increment');
        expect(called).toEqual(['increment', 'increment', 'add', 'increment']);
        expect(st.get('count')).toEqual(13);
    }));
});
