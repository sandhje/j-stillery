import { IStage } from ".";

/**
 * Generic pipeline interface
 *
 * @package j-stillery/IPipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IPipeline<T> {
    /**
     * Pipe a stage onto the subject
     *
     * Configure the subject with stages which will be invoked when the subject's run method is called. Return self to
     * achieve a more fluent API.
     *
     * @param IStage<T> stage
     * @returns IPipeline<T>
     */
    pipe: (stage: IStage<T>) => IPipeline<T>;

    /**
     * Run the subject
     *
     * Return a Promise which resolves with the output resulting from the subject being run with a given input
     *
     * @param T input
     * @returns Promise<T>
     */
    run: (input: T) => Promise<T>;
}

export { IPipeline };
