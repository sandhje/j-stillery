/**
 * J-Stillery main module
 *
 * Re-exports all individual public modules inside the J-Stillery package. This package allows the consumer to create
 * fully configurable pipeline's with various types of stages.
 *
 * See github.com/sandhje/j-stillery for full documentation and instructions on how to contribute code or report bugs.
 *
 * @package j-stillery
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */

export * from "./filter/Filter";
export * from "./filter/IMatchCallback";
export * from "./filter/IMatchStrategy";
export * from "./parallel/Parallel";
export * from "./parallel/IMergeCallback";
export * from "./parallel/IMergeStrategy";
export * from "./task/IExecuteCallback";
export * from "./task/IExecuteStrategy";
export * from "./IPipeable";
export * from "./IPipeline";
export * from "./IStage";
export * from "./Pipeline";
export * from "./task/Task";
