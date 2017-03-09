/**
 * Generic runnable interface
 * 
 * Defines a run method which allows for "running" the subject
 * 
 * @author Sandhjé
 */
interface IRunnable<T>
{
    /**
     * Run the subject
     * 
     * Return a Promise which resolves with the output resulting 
     * from the subject being run with a given input
     * 
     * @param T input
     * @returns Promise<T>
     */
    run: (input: T) => Promise<T>;
}

export { IRunnable };
