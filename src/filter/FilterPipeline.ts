import { Pipeline } from "../Pipeline";

/**
 * Filter pipeline
 *
 * The filter pipeline is a "sub-pipeline" which can run as part of a filter stage in the "main" pipeline. Stages
 * can be piped onto the filter pipeline and when the pipeline run's it will hand control back to the "main" pipeline
 * once it completes its "up" process. When the next stage in the "main" pipeline resolves, this "sub-pipeline" will
 * resume with its "down" process.
 *
 * @package j-stillery/FilterPipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class FilterPipeline<T> extends Pipeline<T> {
    /**
     * Callback to trigger the next stage in the "main" pipeline
     *
     * @callback (input: T): Promise<T>
     */
    private parentNext: (input: T) => Promise<T>;

    /**
     * Parent next setter
     *
     * @param function parentNext
     * @returns void
     */
    public setParentNext(parentNext: (input: T) => Promise<T>): void {
        this.parentNext = parentNext;
    }

    /**
     * End override
     *
     * Override for the pipeline's end method. Allows to hand control back to the "main" pipeline once this "sub"
     * pipeline completes its "up" process. Once the next stage in the "main" pipeline resolves the "down" process
     * in this "sub" pipeline is executed.
     *
     * @param T input
     * @param function resolve
     * @param function reject
     */
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
