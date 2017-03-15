interface IStage<T>
{
    invoke: (input: T, next: (input: T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => void
}

export { IStage };
