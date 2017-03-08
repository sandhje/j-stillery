import IStage from "./IStage";
import IPipeable from "./IPipeable";

abstract class AbstractParallel<T> implements IStage<T>, IPipeable<T>
{
    protected stages: Array<ParallelStage<T>> = [];

    public pipe(stage: IStage<T>): AbstractParallel<T>
    {
        this.stages.push(new ParallelStage<T>(stage));

        return this;
    }

    public invoke(input: T, next: (T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        let promisesUp: Array<Promise<T>> = [];

        this.stages.every((stage: ParallelStage<T>) => {
            promisesUp.push(stage.executeUp(input));

            return true;
        });

        Promise.all(promisesUp).then((values: Array<T>) => {
            let merged = this.mergeUp(input, values);

            return next(merged);
        }).then((value: T) => {
            let promisesDown: Array<Promise<T>> = [];

            this.stages.every((stage: ParallelStage<T>) => {
                promisesDown.push(stage.executeDown(value));

                return true;
            }); 

            Promise.all(promisesDown).then((values: Array<T>) => {
                let merged = this.mergeDown(value, values);

                resolve(merged);
            })
        });
    }

    protected abstract mergeUp(input: T, results: Array<T>): T;

    protected abstract mergeDown(output: T, results: Array<T>) : T;
}

class ParallelStage<T>
{
    private resolveNext: (value: T) => void;
    private rejectNext: (reason: any) => void;
    private resolveUp: (value: T) => void;
    private rejectUp: (reason: any) => void;
    private invokePromise: Promise<T>;

    constructor(private stage: IStage<T>) { }

    public executeUp(input: T): Promise<T>
    {
        // Invoke stage and hold next so "down" of stage does not get called
        return new Promise<T>((resolve, reject) => {
            this.resolveUp = resolve;
            this.rejectUp = reject;

            this.invokePromise = this.invokeStage(input);
        });
    }

    public executeDown(output: T): Promise<T>
    {
        return new Promise<T>((resolve, reject) => {
            this.invokePromise.then((value: T) => {
                resolve(value);
            });

            // resolve next so "down" of stage gets called
            this.resolveNext(output);
        });
    }

    private invokeStage(input: T): Promise<T>
    {
        return new Promise<T>((resolve, reject) => {
            this.stage.invoke(input, this.stageNext, resolve, reject);
        });
    }

    // StageNext is being called from this stage on completion of it's "up"
    // execute resolveUp here and wait with resoving the returned promise untill executeDown is called
    private stageNext = (value: T) => {
        return new Promise<T>((resolveNext, rejectNext) => {
            this.resolveNext = resolveNext;
            this.rejectNext = rejectNext;

            this.resolveUp(value);
        });
    }

    // stage.invoke(input, stageNext, resolveStage, rejectStage); // Call stage with empty next
}

export default AbstractParallel;