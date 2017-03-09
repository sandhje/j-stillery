import { IPipeline, IStage } from ".";

class Pipeline<T> implements IPipeline<T>
{
    private current: number = -1;

    private stages: Array<IStage<T>> = [];

    protected incrementCurrent(): void
    {
        this.current++;
    }

    public getCurrent(): number
    {
        return this.current;
    }

    protected pushStage(stage: IStage<T>): void
    {
        this.stages.push(stage);
    }

    public getCurrentStage(): IStage<T>
    {
        if (this.current in this.stages) {
            return this.stages[this.current];
        }

        return null;
    }

    public getStages(): Array<IStage<T>>
    {
       return this.stages; 
    }

    public pipe(stage: IStage<T>): IPipeline<T>
    {
        this.pushStage(stage);

        return this;
    }

    public run(input: T): Promise<T>
    {
        this.reset();

        return this.next(input);
    }

    protected reset(): void
    {
        this.current = -1;
    }

    protected next = (input: T): Promise<T> => {
        let promiseCallback = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => {
            this.incrementCurrent();

            let currentStage = this.getCurrentStage();
            if (currentStage !== null) {
                // Go to next in filter chain                
                currentStage.invoke(input, this.next.bind(this), resolve, reject);
                return;
            }

            // End of Pipeline
            this.end(input, resolve, reject);
        };

        return new Promise<T>(promiseCallback.bind(this));
    }

    protected end(input: T, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        resolve(input);
    }
}

export { Pipeline };
