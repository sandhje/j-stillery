interface IMergeStrategy<T> {
    /**
     * merge
     */
    merge(input: T, results: T[]): T;
};

export { IMergeStrategy };
