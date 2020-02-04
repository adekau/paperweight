/**
 * A message either sent from a thread or to a thread.
 * @type result – a task completed succesfully on the child thread and has a result.
 * @type error – a task failed and has an error message.
 * @type run – A request to run a task on the thread.
 */
export declare type Message = ({
    type: 'result';
    result: unknown;
} | {
    type: 'error';
    error: unknown;
} | {
    type: 'run';
    func: string;
    [k: string]: any;
}) & {
    id: number;
};
//# sourceMappingURL=Message.d.ts.map