import IPipeline from "./IPipeline";
import Pipeline from "./Pipeline";
import IStage from "./IStage";
import IPipeable from "./IPipeable";

abstract class AbstractFilter<T> implements IStage<T>, IPipeable<T>
{
    private _filterPipeline: FilterPipeline<T> = null;

    protected get filterPipeline(): FilterPipeline<T>
    {
        if (this._filterPipeline === null) {
            this._filterPipeline = new FilterPipeline<T>();
        }

        return this._filterPipeline;
    }

    public pipe(stage: IStage<T>): AbstractFilter<T>
    {
        this.filterPipeline.pipe(stage);

        return this;
    }

    public invoke(input: T, next: (T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
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

    public abstract matches(input: T): boolean;
}

class FilterPipeline<T> extends Pipeline<T>
{
    private parentNext: (T) => Promise<T>;

    public setParentNext(parentNext: (T) => Promise<T>)
    {
        this.parentNext = parentNext;
    }

    protected end(input: T, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        // On end of the "filter" pipeline, continue with parent
        // Once parent comes back, continue back down the "filter"
        this.parentNext(input).then((output: T) => {
            resolve(output);
        }).catch((reason: any) => {
            reject(reason);
        })
    }
}

export default AbstractFilter;