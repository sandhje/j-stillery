import { IMatchCallback, IMatchStrategy, IPipeable, IPipeline, IStage, Pipeline } from "../";
import { FilterPipeline } from "./FilterPipeline";

class Filter<T> implements IStage<T>, IPipeable<T> {
    private _filterPipeline: FilterPipeline<T> = null;
    protected get filterPipeline(): FilterPipeline<T>
    {
        if (this._filterPipeline === null) {
            this._filterPipeline = new FilterPipeline<T>();
        }

        return this._filterPipeline;
    }

    constructor(
        private match: IMatchStrategy<T> | IMatchCallback<T> = null,
    ) {}

    public pipe(stage: IStage<T>): IPipeable<T>
    {
        this.filterPipeline.pipe(stage);

        return this;
    }

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

    protected matches(input: T): boolean {
        if (this.isMatchCallback(this.match)) {
            return this.match(input);
        }

        if (this.isMatchStrategy(this.match)) {
            return this.match.match(input);
        }

        return false;
    }

    private isMatchStrategy(match: any): match is IMatchStrategy<T> {
        return (
            match !== null
            && typeof match === "object"
            && typeof match.match === "function"
        );
    }

    private isMatchCallback(match: any): match is IMatchCallback<T> {
        return typeof match === "function";
    }
}

export { Filter };
