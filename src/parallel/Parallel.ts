import { IMergeCallback, IMergeStrategy, IPipeable, IStage } from "../";
import { ParallelStage } from "./ParallelStage";

/**
 * Parallel stage: run "sub-stages" in parallel
 *
 * The parallel stage is a "wrapper" stage implementing the IPipeable interface. Other stages can be piped onto the
 * parallel stage. These stages will then be run in parallel instead of in sequence. All these stages will be invoked
 * with the same initial input. After being run the outcome of the stages piped onto the parallel stage need te be
 * merged.
 *
 * @package j-stillery/Parallel
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class Parallel<T> implements IStage<T>, IPipeable<T> {
    /**
     * Container for all stages piped onto the parallel stage
     *
     * Stages in this container are already wrapped by the parallel stage class.
     *
     * @var Array<ParallelStage<T>>
     */
    protected stages: Array<ParallelStage<T>> = [];

    /**
     * Parallel constructor
     *
     * The passed merge strategies or callbacks will be executed after the up process (mergeUp) and down process
     * (mergeDown) for all the stages piped onto the parallel stage were executed, giving the consumer the ability
     * to merge the outputs from all stages for both processes. If the "up" or "down" parameters are not supplied the
     * parallel stage will resolve its up or down processes immediatly with its input, ignoring the results from the
     * piped stages.
     *
     * @param IMergeStrategy<T>|IMergeCallback<T> up
     * @param IMergeStrategy<T>|IMergeCallback<T> down
     */
    constructor(
        private mergeUp: IMergeStrategy<T> | IMergeCallback<T> = null,
        private mergeDown: IMergeStrategy<T> | IMergeCallback<T> = null,
    ) {}

    /**
     * Pipe stages to be executed in parallel onto the parallel stage
     *
     * This method wraps all passed stages with the parallelStage class to enable full control over execution of its
     * "up" and "down" processes.
     *
     * @param Stage<T> stage
     * @returns Parallel<T>
     */
    public pipe(stage: IStage<T>): Parallel<T> {
        this.stages.push(new ParallelStage<T>(stage));

        return this;
    }

    /**
     * Invoke the parallel stage
     *
     * Calling this method invokes all stages piped onto this stage in parallel. Once all of these "sub-stages" have
     * completed their "up" process the merge strategy or callback will be executed with the result of all "sub-stages".
     * After merging, the "up" process for this parallel stage is complete and the next stage in the pipeline is called.
     * When the next stage in the pipeline is resolved, the "down" process of the "sub-stages" will be started and the
     * results will once again be merged by the merge strategy or callback. Once done merging the result from all "down"
     * processes the parallel stage itself is done with its "down" process and resolves with the merged output, handing
     * control back over to the pipeline, which will call the preceding stage or resolve.
     *
     * @param T input
     * @param function next
     * @param function resolve
     * @param function reject
     * @returns void
     */
    public invoke(
        input: T,
        next: (input: T) => Promise<T>,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void {
        let promisesUp: Array<Promise<T>> = [];

        this.stages.every((stage: ParallelStage<T>) => {
            promisesUp.push(stage.executeUp(input));

            return true;
        });

        Promise.all(promisesUp).then((values: T[]) => {
            let merged = this.merge(this.mergeUp, input, values);

            return next(merged);
        }).then((value: T) => {
            let promisesDown: Array<Promise<T>> = [];

            this.stages.every((stage: ParallelStage<T>) => {
                promisesDown.push(stage.executeDown(value));

                return true;
            });

            Promise.all(promisesDown).then((values: T[]) => {
                let merged = this.merge(this.mergeDown, value, values);

                resolve(merged);
            });
        });
    }

    /**
     * Merge an array of, in parallel executed stage results, into one result
     *
     * @param IMergeStrategy<T>|IMergeCallback<T> mergable
     * @param T input
     * @param Array<T> results
     * @returns T
     */
    protected merge(mergable: IMergeStrategy<T> | IMergeCallback<T>, input: T, results: T[]): T {
        if (this.isMergeCallback(mergable)) {
            return mergable(input, results);
        }

        if (this.isMergeStrategy(mergable)) {
            return mergable.merge(input, results);
        }

        return input;
    };

    /**
     * Mergable strategy type guard
     *
     * Check wether the mergable adheres to the interface of an IMergableStrategy.
     *
     * @param any mergeable
     * @returns bool
     */
    private isMergeStrategy(mergeable: any): mergeable is IMergeStrategy<T> {
        return (
            mergeable !== null
            && typeof mergeable === "object"
            && typeof mergeable.merge === "function"
        );
    }

    /**
     * Mergable callback type guard
     *
     * Check wether the mergable adheres to the interface of an IMergableCallback.
     *
     * @param any mergeable
     * @returns bool
     */
    private isMergeCallback(mergeable: any): mergeable is IMergeCallback<T> {
        return typeof mergeable === "function";
    }
}

export { Parallel };
