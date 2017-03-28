import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import { IMergeCallback, IMergeStrategy, IStage, Parallel, Pipeline } from "../../src";

@suite("Parallel tests")
class ParallelTest {

    @test("Should invoke configured stages and merge results with strategy")
    public assertMergeStrategy(done) {
        // Arrange
        let parallelStage1 = <IStage<string>> {};
        parallelStage1.invoke = (input, next, resolve, reject) => {
            input = "-up1";
            next(input).then((output) => {
                resolve("-down1");
            });
        };
        let parallelStage2 = <IStage<string>> {};
        parallelStage2.invoke = (input, next, resolve, reject) => {
            input = "-up2";
            next(input).then((output) => {
                resolve("-down2");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let mergeUpStrategy = <IMergeStrategy<string>> {};
        mergeUpStrategy.merge = (input, results) => {
            return input + results[0] + results[1];
        };

        let mergeDownStrategy = <IMergeStrategy<string>> {};
        mergeDownStrategy.merge = (input, results) => {
            return input + results[0] + results[1];
        };

        let pipeline = (new Pipeline<string>())
            .pipe((new Parallel<string>(mergeUpStrategy, mergeDownStrategy))
                .pipe(parallelStage1)
                .pipe(parallelStage2)
            )
            .pipe(regularStage);

        // Act
        pipeline.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-up1-up2-regularStage-down1-down2");
            done();
        });
    }

    @test("Should invoke configured stages and merge results with callback")
    public assertMergeCallback(done) {
        // Arrange
        let parallelStage1 = <IStage<string>> {};
        parallelStage1.invoke = (input, next, resolve, reject) => {
            input = "-up1";
            next(input).then((output) => {
                resolve("-down1");
            });
        };
        let parallelStage2 = <IStage<string>> {};
        parallelStage2.invoke = (input, next, resolve, reject) => {
            input = "-up2";
            next(input).then((output) => {
                resolve("-down2");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let mergeUpCallback: IMergeCallback<string> = (input, results) => {
            return input + results[0] + results[1];
        };

        let mergeDownCallback: IMergeCallback<string> = (input, results) => {
            return input + results[0] + results[1];
        };

        let pipeline = (new Pipeline<string>())
            .pipe((new Parallel<string>(mergeUpCallback, mergeDownCallback))
                .pipe(parallelStage1)
                .pipe(parallelStage2)
            )
            .pipe(regularStage);

        // Act
        pipeline.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-up1-up2-regularStage-down1-down2");
            done();
        });
    }

    @test("Should return original input if no merge strategy or callback configured")
    public assertNoMerge(done) {
        // Arrange
        let parallelStage1 = <IStage<string>> {};
        parallelStage1.invoke = (input, next, resolve, reject) => {
            input = "-up1";
            next(input).then((output) => {
                resolve("-down1");
            });
        };
        let parallelStage2 = <IStage<string>> {};
        parallelStage2.invoke = (input, next, resolve, reject) => {
            input = "-up2";
            next(input).then((output) => {
                resolve("-down2");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let mergeDownCallback: IMergeCallback<string> = (input, results) => {
            return input + results[0] + results[1];
        };

        let pipeline = (new Pipeline<string>())
            .pipe((new Parallel<string>(null, mergeDownCallback))
                .pipe(parallelStage1)
                .pipe(parallelStage2)
            )
            .pipe(regularStage);

        // Act
        pipeline.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-regularStage-down1-down2");
            done();
        });
    }
}
