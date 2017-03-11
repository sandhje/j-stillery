interface IExecuteStrategy<T> {
    /**
     * execute
     */
    execute(
        input: T,
        resolve: (output?: T | PromiseLike<T>) => void,
        reject: (reason: any) => void
    ): void;
};

export { IExecuteStrategy };
