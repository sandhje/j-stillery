/**
 * Generic match callback interface
 *
 * This function will match the input with against a specified condition and will be called from the filter stage to
 * determine wether conditional stages piped onto the filter stage should be invoked or not.
 *
 * @param T input
 * @returns bool
 *
 * @package j-stillery/IMatchCallback
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IMatchCallback<T> {
    (input: T): boolean;
};

export { IMatchCallback };
