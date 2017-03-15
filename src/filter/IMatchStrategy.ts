interface IMatchStrategy<T> {
    /**
     * match
     */
    match(input: T): boolean;
};

export { IMatchStrategy };
