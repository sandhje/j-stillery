/**
 * Generic merge strategy interface
 *
 * @package j-stillery/IMergeStrategy
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IMergeStrategy<T> {
    /**
     * Merge the result of various stages into one
     *
     * This method will be called by the "parallel stage" after all stages piped onto the stage completed their "up" or
     * "down" processes. The first parameter of this method contains the original input fed into all "sub-stages" of the
     * parallel stage. The second parameter contains all results from these "sub-stages".
     *
     * @param T input
     * @param Array<T> results
     * @returns T
     */
    merge(input: T, results: T[]): T;
};

export { IMergeStrategy };
