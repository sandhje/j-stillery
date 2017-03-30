import { IExecuteCallback, IExecuteStrategy, IStage } from "../";

/**
 * Generic "task" stage
 *
 * The task stage is a stage that can be configured with execute strategies or callbacks. These strategies will be
 * called on the appropriate times in the IStage::invoke method, eliminating the need for the consumer to write their
 * own implementation of this interface while retaining all flexibility.
 *
 * The up and down strategies (or callbacks) are called before (up) and after (down) the next stage in the pipeline is
 * invoked.
 *
 * @package j-stillery/Task
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class Task<T> implements IStage<T> {
    /**
     * Task constructor
     *
     * The passed execute strategies or callbacks will be executed before (up) and after (down) the next stage in the
     * pipeline is invoked, giving the consumer two moments to modify the input. If the "up" or "down" parameters are
     * not supplied the task will resolve the up or down action immediatly with it's input.
     *
     * @param IExecuteStrategy<T>|IExecuteCallback<T> up
     * @param IExecuteStrategy<T>|IExecuteCallback<T> down
     */
    constructor(
        private up: IExecuteStrategy<T> | IExecuteCallback<T> = null,
        private down: IExecuteStrategy<T> | IExecuteCallback<T> = null,
    ) {}

    /**
     * @see IStage::invoke
     */
    public invoke(
        input: T,
        next: (input: T) => Promise<T>,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void {
        let promiseIn: Promise<T> = new Promise<T>(
            (resolveIn: (output?: T | PromiseLike<T>) => void,
            rejectIn: (reason: any) => void
        ) => {
            this.execute(this.up, input, resolveIn, rejectIn);
        });

        promiseIn.then((value: T) => {
            return next(value);
        }).then((value: T) => {
            return new Promise<T>(
                (resolveOut: (output?: T | PromiseLike<T>) => void,
                rejectOut: (reason: any) => void
            ) => {
                this.execute(this.down, value, resolveOut, rejectOut);
            });
        }).then((value: T) => {
            resolve(value);
        }).catch((reason: any) => {
            reject(reason);
        });
    }

    /**
     * Run the passed executable
     *
     * If the passed executable is neither a IExecuteStrategy not a IExecuteCallback this method will call the resolve
     * argument with unmodified input.
     *
     * @param IExecuteStrategy<T>|IExecuteCallback<T> executable
     * @param T input
     * @param function resolve
     * @param function reject
     * @returns void
     */
    protected execute(
        executable: IExecuteStrategy<T> | IExecuteCallback<T>,
        input: T,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void {
        if (this.isExecuteStrategy(executable)) {
            return executable.execute(input, resolve, reject);
        }

        if (this.isExecuteCallback(executable)) {
            return executable(input, resolve, reject);
        }

        resolve(input); // Resolve with input if no execute strategy or callback passed
    }

    /**
     * Executable strategy type guard
     *
     * Check wether the executable adheres to the interface of an IExecutableStrategy.
     *
     * @param any executable
     * @returns bool
     */
    private isExecuteStrategy(executable: any): executable is IExecuteStrategy<T> {
        return (
            executable !== null
            && typeof executable === "object"
            && typeof executable.execute === "function"
        );
    }

    /**
     * Executable callback type guard
     *
     * Check wether the executable adheres to the interface of an IExecutableCallback.
     *
     * @param any executable
     * @returns bool
     */
    private isExecuteCallback(executable: any): executable is IExecuteCallback<T> {
        return typeof executable === "function";
    }
}

export { Task };
