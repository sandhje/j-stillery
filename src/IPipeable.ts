import { IStage } from ".";

/**
 * Generic pipeable interface
 *
 * This interface is a subset of the broader IPipeline interface. It does not declare a "run" method, allowing for
 * modules to be "pipeable" but not having the overhead of implementing a full pipeline.
 *
 * @package j-stillery/IPipeable
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IPipeable<T> {
    /**
     * Pipe a stage onto the subject
     *
     * Configure the subject with stages which will be invoked when the subject's run method is called. Return self to
     * achieve a more fluent API.
     *
     * @param IStage<T> stage
     * @returns IPipeable<T>
     */
    pipe: (stage: IStage<T>) => IPipeable<T>;
}

export { IPipeable };
