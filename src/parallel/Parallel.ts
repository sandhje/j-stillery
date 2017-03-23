import { IMergeCallback, IMergeStrategy, IPipeable, IStage } from "../";
import { ParallelStage } from "./ParallelStage";

class Parallel<T> implements IStage<T>, IPipeable<T> {
    protected stages: Array<ParallelStage<T>> = [];

    constructor(
        private mergeUp: IMergeStrategy<T> | IMergeCallback<T> = null,
        private mergeDown: IMergeStrategy<T> | IMergeCallback<T> = null,
    ) {}

    public pipe(stage: IStage<T>): Parallel<T> {
        this.stages.push(new ParallelStage<T>(stage));

        return this;
    }

    public invoke(
        input: T,
        next: (input: T) => Promise<T>,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void {
        let promisesUp: Array<Promise<T>> = [];

        this.stages.every((stage: ParallelStage<T>) => {
            promisesUp.push(stage.executeUp(input));

            return true;
        });

        Promise.all(promisesUp).then((values: T[]) => {
            let merged = this.merge(this.mergeUp, input, values);

            return next(merged);
        }).then((value: T) => {
            let promisesDown: Array<Promise<T>> = [];

            this.stages.every((stage: ParallelStage<T>) => {
                promisesDown.push(stage.executeDown(value));

                return true;
            });

            Promise.all(promisesDown).then((values: T[]) => {
                let merged = this.merge(this.mergeDown, value, values);

                resolve(merged);
            });
        });
    }

    protected merge(mergable: IMergeStrategy<T> | IMergeCallback<T>, input: T, results: T[]): T {
        if (this.isMergeCallback(mergable)) {
            return mergable(input, results);
        }

        if (this.isMergeStrategy(mergable)) {
            return mergable.merge(input, results);
        }

        return input;
    };

    private isMergeStrategy(mergeable: any): mergeable is IMergeStrategy<T> {
        return (
            mergeable !== null
            && typeof mergeable === "object"
            && typeof mergeable.merge === "function"
        );
    }

    private isMergeCallback(mergeable: any): mergeable is IMergeCallback<T> {
        return typeof mergeable === "function";
    }
}

export { Parallel };
