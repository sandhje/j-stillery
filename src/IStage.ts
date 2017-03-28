/**
 * Generic pipeline stage interface
 *
 * @package j-stillery/IPipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IStage<T> {
    /**
     * Invoke method for the stage
     *
     * This method will be executed by the pipeline when the stage should "run". The input parameter can be modified
     * during the execution of the invoke method. When all actions of this stage are complete the stage should call
     * the "resolve" callback with the desired output. This will hand back control to the pipeline which will further
     * handle the output.
     *
     * This method SHOULD always call "next" callback somewhere in it's body to trigger the pipeline to execute the
     * next stage. This method SHOULD only resolve after the next stage resolves.
     *
     * If an error occurs during the execution of this method, the "reject" callback SHOULD be called with the reason
     * for the failure. This will then be returned to the user by the pipeline.
     *
     * @param T input
     * @param function next
     * @param function resolve
     * @param function reject
     */
    invoke: (
        input: T,
        next: (input: T) => Promise<T>,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ) => void;
}

export { IStage };
