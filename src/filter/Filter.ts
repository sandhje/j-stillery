import { IMatchCallback, IMatchStrategy, IPipeable, IPipeline, IStage, Pipeline } from "../";
import { FilterPipeline } from "./FilterPipeline";

/**
 * Filter stage: run "sub-stages" conditionally
 *
 * The filter stage is a "wrapper" stage implementing the IPipeable interface. Other stages can be piped onto the
 * filter stage. These stages will then be run conditionally based on the result of a "matcher". All these stages
 * will be invoked as part of the normal flow of the pipeline.
 *
 * @package j-stillery/Filter
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class Filter<T> implements IStage<T>, IPipeable<T> {
    /**
     * Filter pipeline
     *
     * The "sub-pipeline" which will be executed conditionally as part of the main pipeline if the matcher for this
     * filter matches.
     *
     * @var FilterPipeline<T>
     */
    private _filterPipeline: FilterPipeline<T> = null;

    /**
     * Filter pipeline getter
     *
     * @returns FilterPipeline<T>
     */
    protected get filterPipeline(): FilterPipeline<T>
    {
        if (this._filterPipeline === null) {
            this._filterPipeline = new FilterPipeline<T>();
        }

        return this._filterPipeline;
    }

    /**
     * Filter stage constructor
     *
     * The passed match strategies or callbacks will be executed before invoking the "sub-stages" piped onto this
     * stage. If the matcher returns boolean true the "sub-pipeline" with the "sub-stages" will be run for both "up"
     * and "down" processes. If no matcher it will default to false, not executing the "sub-pipeline".
     *
     * @param IMatchStrategy<T>|IMatchCallback<T> match
     */
    constructor(
        private match: IMatchStrategy<T> | IMatchCallback<T> = null,
    ) {}

    /**
     * Pipe stages to be executed conditionally onto the filter stage
     *
     * @param IStage<T> stage
     * @returns Filter<T>
     */
    public pipe(stage: IStage<T>): Filter<T> {
        this.filterPipeline.pipe(stage);

        return this;
    }

    /**
     * Invoke the filter stage
     *
     * Calling this method will trigger evaluations of the matcher with the passed input. If the matcher returns boolean
     * true the "sub-stages" will be invoked for both "up" and "down" processes.
     *
     * @param T input
     * @param function next
     * @param function resolve
     * @param function reject
     */
    public invoke(
        input: T,
        next: (input: T) => Promise<T>,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void {
        if (this.matches(input)) {
            // Set the parent next of the "filter" pipeline
            this.filterPipeline.setParentNext(next);

            // Run "filter" pipeline and resolve once done
            this.filterPipeline.run(input).then((value: T) => {
                resolve(value);
            }).catch((reason: any) => {
                reject(reason);
            });
        } else {
            // Skip the filter pipeline
            next(input).then((value: T) => {
                resolve(value);
            }).catch((reason: any) => {
                reject(reason);
            });
        }
    }

    /**
     * Execute the injected matcher with the passed input
     *
     * @param T input
     * @returns bool
     */
    protected matches(input: T): boolean {
        if (this.isMatchCallback(this.match)) {
            return this.match(input);
        }

        if (this.isMatchStrategy(this.match)) {
            return this.match.match(input);
        }

        return false;
    }

    /**
     * Match strategy type guard
     *
     * Check wether the matcher adheres to the interface of an IMatchStrategy.
     *
     * @param any matcher
     * @returns bool
     */
    private isMatchStrategy(matcher: any): matcher is IMatchStrategy<T> {
        return (
            matcher !== null
            && typeof matcher === "object"
            && typeof matcher.match === "function"
        );
    }

    /**
     * Match callback type guard
     *
     * Check wether the matcher adheres to the interface of an IMatchCallback.
     *
     * @param any matcher
     * @returns bool
     */
    private isMatchCallback(match: any): match is IMatchCallback<T> {
        return typeof match === "function";
    }
}

export { Filter };
