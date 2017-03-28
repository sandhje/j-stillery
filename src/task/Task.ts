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

    constructor(
        private up: IExecuteStrategy<T> | IExecuteCallback<T> = null,
        private down: IExecuteStrategy<T> | IExecuteCallback<T> = null,
    ) {}

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

    private isExecuteStrategy(executable: any): executable is IExecuteStrategy<T> {
        return (
            executable !== null
            && typeof executable === "object"
            && typeof executable.execute === "function"
        );
    }

    private isExecuteCallback(executable: any): executable is IExecuteCallback<T> {
        return typeof executable === "function";
    }
}

export { Task };
