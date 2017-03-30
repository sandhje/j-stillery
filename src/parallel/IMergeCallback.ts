/**
 * Generic merge callback interface
 *
 * This function will merge the result of various stages into one and will be called by the "parallel stage" after all
 * stages piped onto the stage completed their "up" or "down" processes. The first parameter of this function contains
 * the original input fed into all "sub-stages" of the parallel stage. The second parameter contains all results from
 * these "sub-stages".
 *
 * @param T input
 * @param Array<T> results
 * @returns T
 *
 * @package j-stillery/IMergeCallback
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IMergeCallback<T> {
    (input: T, results: T[]): T;
};

export { IMergeCallback };
