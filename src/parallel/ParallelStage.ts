import { IStage } from "../";

/**
 * Parallel stage wrapper
 *
 * This class serves as a wrapper for the stages piped onto the parallel stage. This allows the parallel stage to
 * execute the wrapped stages "up" and handing control back to the pipeline once all stages called next. When the
 * "next" stages in the pipeline return this wrapper will allow the parallel stage to execute the wrapped stages "down".
 *
 * @package j-stillery/ParallelStage
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ParallelStage<T> {

    private resolveNext: (value: T) => void;
    private rejectNext: (reason: any) => void;
    private resolveUp: (value: T) => void;
    private rejectUp: (reason: any) => void;

    /**
     * invokePromise stores the return value of the wrapped stage
     *
     * @var Promise<T>
     */
    private invokePromise: Promise<T>;

    /**
     * Constructor for the parallel stage wrapper
     *
     * Pass the stage to be wrapped as the first argument.
     *
     * @param IStage<T> stage
     */
    constructor(private stage: IStage<T>) { }

    /**
     * Execute the "up" process of the wrapped stage
     *
     * Returns a promise with the result of the "up" process. Internally defers the execution of the wrapped stage to
     * the "invokeStage" method on this class.
     *
     * @param T input
     * @returns Promise<T>
     */
    public executeUp(input: T): Promise<T> {
        // Invoke stage and hold next so "down" of stage does not get called
        return new Promise<T>((resolve, reject) => {
            this.resolveUp = resolve;
            this.rejectUp = reject;

            this.invokePromise = this.invokeStage(input);
        });
    }

    /**
     * Execute the "down" process of the wrapped stage
     *
     * Returns a promise with the result of the "down" process. Resolves the promise from "stageNext", which is passed
     * as the "next" argument to the wrapped stage, triggering the "down" process of the wrapped stage. When the "down"
     * process of the wrapped stage is finished (the stage resolved) the promise returned from this method will resolve.
     *
     * @param T output
     * @param Promise<T>
     */
    public executeDown(output: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.invokePromise.then((value: T) => {
                resolve(value);
            });

            // resolve next so "down" of stage gets called
            this.resolveNext(output);
        });
    }

    /**
     * Invoke the wrapped stage
     *
     * Pass the "stageNext" method of this class to the stage as its "next" parameter so we can resolve the "next" of
     * wrapped stage "on demand" by calling "executeDown". This will trigger the "down" process in the wrapped stage.
     *
     * @param T input
     * @returns Promise<T>
     */
    private invokeStage(input: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.stage.invoke(input, this.stageNext, resolve, reject);
        });
    }

    /**
     * The next callback for the wrapped stage
     * StageNext is being called from the wrapped stage on completion of it's "up" process. execute resolveUp here and
     * wait with resoving the returned promise untill executeDown is called, triggering the "down" process of the
     * wrapped stage.
     *
     * @callback (value: T) => Promise<T>
     */
    private stageNext = (value: T) => {
        return new Promise<T>((resolveNext, rejectNext) => {
            this.resolveNext = resolveNext;
            this.rejectNext = rejectNext;

            this.resolveUp(value);
        });
    }
}

export { ParallelStage }
