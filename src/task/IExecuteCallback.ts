interface IExecuteCallback<T> {
    (
        input: T,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void;
};

export { IExecuteCallback };
