import { Pipeline } from "../Pipeline";

class FilterPipeline<T> extends Pipeline<T> {
    private parentNext: (input: T) => Promise<T>;

    public setParentNext(parentNext: (input: T) => Promise<T>): void {
        this.parentNext = parentNext;
    }

    protected end(input: T, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void {
        // On end of the "filter" pipeline, continue with parent
        // Once parent comes back, continue back down the "filter"
        this.parentNext(input).then((output: T) => {
            resolve(output);
        }).catch((reason: any) => {
            reject(reason);
        });
    }
}

export { FilterPipeline };
