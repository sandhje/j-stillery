import { IStage } from "../";

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
}

export { ParallelStage }
