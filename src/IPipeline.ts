import { IPipeable, IRunnable, IStage } from ".";

/**
 * Generic pipeline interface
 * 
 * Implementors of the pipeline interface need to be both pipeable and runnable
 * 
 * @see ./IRunnable
 * @see ./IPipeable
 * @author Sandhjé
 */
interface IPipeline<T> extends IRunnable<T>, IPipeable<T> { }

export { IPipeline };
