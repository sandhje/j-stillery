interface IMergeCallback<T> {
    (input: T, results: T[]): T;
};

export { IMergeCallback };
