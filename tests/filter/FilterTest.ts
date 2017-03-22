import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import { Filter, IMatchCallback, IMatchStrategy, IStage, Pipeline } from "../../src";

@suite("Filter tests")
class FilterTest {

    @test("Should invoke configured stages if match strategy succeeded")
    public assertMatchStrategySuccess(done) {
        // Arrange
        let filterStage = <IStage<string>> {};
        filterStage.invoke = (input, next, resolve, reject) => {
            input = input + "-filterStageUp";
            next(input).then((output) => {
                resolve(output + "-filterStageDown");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let matchStrategy = <IMatchStrategy<string>> {};
        matchStrategy.match = (input) => { return true; };

        let filterStrategy = new Filter<string>(matchStrategy);
        filterStrategy.pipe(filterStage);

        let pipelineStrategy = new Pipeline<string>();
        pipelineStrategy.pipe(filterStrategy).pipe(regularStage);

        // Act
        pipelineStrategy.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-filterStageUp-regularStage-filterStageDown");
            done();
        });
    }

    @test("Should invoke configured stages if match callback succeeded")
    public assertMatchCallbackSuccess(done) {
        // Arrange
        let filterStage = <IStage<string>> {};
        filterStage.invoke = (input, next, resolve, reject) => {
            input = input + "-filterStageUp";
            next(input).then((output) => {
                resolve(output + "-filterStageDown");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let matchCallback: IMatchCallback<string> = (input) => { return true; };

        let filterCallback = new Filter<string>(matchCallback);
        filterCallback.pipe(filterStage);

        let pipelineCallback = new Pipeline<string>();
        pipelineCallback.pipe(filterCallback).pipe(regularStage);

        // Act
        pipelineCallback.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-filterStageUp-regularStage-filterStageDown");
            done();
        });
    }

    @test("Should not invoke configured stages if match strategy failed")
    public assertMatchStrategyFail(done) {
        // Arrange
        let filterStage = <IStage<string>> {};
        filterStage.invoke = (input, next, resolve, reject) => {
            input = input + "-filterStageUp";
            next(input).then((output) => {
                resolve(output + "-filterStageDown");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let matchStrategy = <IMatchStrategy<string>> {};
        matchStrategy.match = (input) => { return false; };

        let filterStrategy = new Filter<string>(matchStrategy);
        filterStrategy.pipe(filterStage);

        let pipelineStrategy = new Pipeline<string>();
        pipelineStrategy.pipe(filterStrategy).pipe(regularStage);

        // Act
        pipelineStrategy.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-regularStage");
            done();
        });
    }

    @test("Should not invoke configured stages if match callback failed")
    public assertMatchCallbackFail(done) {
        // Arrange
        let filterStage = <IStage<string>> {};
        filterStage.invoke = (input, next, resolve, reject) => {
            input = input + "-filterStageUp";
            next(input).then((output) => {
                resolve(output + "-filterStageDown");
            });
        };

        let regularStage = <IStage<string>> {};
        regularStage.invoke = (input, next, resolve, reject) => {
            resolve(input + "-regularStage");
        };

        let matchCallback: IMatchCallback<string> = (input) => { return false; };

        let filterCallback = new Filter<string>(matchCallback);
        filterCallback.pipe(filterStage);

        let pipelineCallback = new Pipeline<string>();
        pipelineCallback.pipe(filterCallback).pipe(regularStage);

        // Act
        pipelineCallback.run("input").then((output) => {
            // Assert
            expect(output).to.equal("input-regularStage");
            done();
        });
    }
}
