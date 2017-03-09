import { IStage } from ".";

/**
 * Generic pipeable interface
 * 
 * Defines a pipe method which allows for configuring the subject with stages
 * 
 * @author Sandhjé
 */
interface IPipeable<T>
{
    /**
     * Pipe a stage onto the subject
     * 
     * Configure the subject with stages, usually so the can be run
     * Return self to achieve a more fluent API
     * 
     * @param IStage<T> stage
     * @returns IPipeline<T>
     */
    pipe: (stage: IStage<T>) => IPipeable<T>;
}

export { IPipeable };
