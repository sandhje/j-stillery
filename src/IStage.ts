interface IStage<T>
{
    invoke: (input: T, next: (T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => void
}

export { IStage };
