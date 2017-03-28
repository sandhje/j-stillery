/**
 * Generic execute task callback interface
 *
 * This method will be called by the "task" when the stage is invoked by the pipeline. Call the "resolve" or
 * "reject" callbacks to complete the execution logic with it's result.
 *
 * @param T input
 * @param function resolve
 * @param function reject
 * @returns void
 *
 * @package j-stillery/Task
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
/**
     * Execute the strategy
     *
     *
     * @param T input
     * @param function resolve
     * @param function reject
     */
interface IExecuteCallback<T> {
    (
        input: T,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void;
};

export { IExecuteCallback };
