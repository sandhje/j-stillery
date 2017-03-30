import { IPipeline, IStage } from ".";

/**
 * Pipeline
 *
 * Pipeline class containing stages which will be executed in sequence. Stages need to implement the IStage interface
 * and are responsible for calling the "next" method of the pipeline to advance to the next stage. When a stage is
 * either resolved or rejected control is given back to the class that called next on the pipeline, triggering the
 * stage execution. When the first stage in the pipeline is resolved (it resolves last since it will wait for all other
 * stages in the pipeline to resolve first) the pipeline is resolved with the output from the first stage. Stages can
 * therefore modify output before and after the "next" call.
 *
 * @module j-stillery/Pipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class Pipeline<T> implements IPipeline<T> {
    /**
     * The position of the current stage being executed
     *
     * This counter will be incremented each time a "next" stage is being called. It will not decrement on stages being
     * resolved. Therefore, when the pipeline as fully run and resolves the "current" counter will equal the amount of
     * stages piped.
     *
     * @var number
     */
    private current: number = -1;

    /**
     * The stages registry containing all stages piped onto the pipeline
     *
     * @var Array<IStage<T>>
     */
    private stages: Array<IStage<T>> = [];

    /**
     * Get the position of the current stage being executed
     *
     * @returns number
     */
    public getCurrent(): number {
        return this.current;
    }

    /**
     * Get the current stage being executed
     *
     * @returns IStage<T>
     */
    public getCurrentStage(): IStage<T> {
        if (this.current in this.stages) {
            return this.stages[this.current];
        }

        return null;
    }

    /**
     * Get all stages piped onto the pipeline
     *
     * @returns Array<IStage<T>>
     */
    public getStages(): Array<IStage<T>> {
       return this.stages;
    }

    /**
     * @see IPipeline::pipe
     */
    public pipe(stage: IStage<T>): Pipeline<T> {
        this.pushStage(stage);

        return this;
    }

    /**
     * @see IPipeline::run
     */
    public run(input: T): Promise<T> {
        this.reset();

        return this.next(input);
    }

    /**
     * Increment the pipeline's internal active stage position
     *
     * @returns void
     */
    protected incrementCurrent(): void {
        this.current++;
    }

    /**
     * Add the passed stage to the internal stages "registry"
     *
     * @param IStage<T> stage
     * @returns void
     */
    protected pushStage(stage: IStage<T>): void {
        this.stages.push(stage);
    }

    /**
     * Reset the pipeline's internal active stage position to it's start value
     *
     * @returns void
     */
    protected reset(): void {
        this.current = -1;
    }

    /**
     * Call the next stage in the pipeline
     *
     * On invoking a stage pass this callback so the invoked stage has control over when to call the next
     * stage in the pipeline. The callback returns a promise with the output value of the next stage.
     *
     * @callback (input: T): Promise<T>
     */
    protected next = (input: T): Promise<T> => {
        let promiseCallback = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => {
            this.incrementCurrent();

            let currentStage = this.getCurrentStage();
            if (currentStage !== null) {
                // Go to next in filter chain
                // TODO: Get rid of "bind"
                currentStage.invoke(input, this.next.bind(this), resolve, reject);
                return;
            }

            // End of Pipeline
            this.end(input, resolve, reject);
        };

        // TODO: Get rid of bind
        return new Promise<T>(promiseCallback.bind(this));
    }

    /**
     * End the pipeline
     *
     * This method acts as a "null-stage" immediatly resolving with the input value. This triggers the then callbacks on
     * the "next" calls in all executed stages.
     *
     * @param T input
     * @param function resolve
     * @param function reject
     */
    protected end(input: T, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void {
        resolve(input);
    }
}

export { Pipeline };
