/**
 * Generic match strategy interface
 *
 * @package j-stillery/IMatchStrategy
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IMatchStrategy<T> {
    /**
     * Match the input with against a specified condition
     *
     * This method will be called from the filter stage to determine wether conditional stages piped onto the filter
     * stage should be invoked or not.
     *
     * @param T input
     * @returns bool
     */
    match(input: T): boolean;
};

export { IMatchStrategy };
