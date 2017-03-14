import { expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { Pipeline, Task } from "../src";

@suite("Pipeline tests")
class PipelineTest {
    @test("Should allow pipeline to be configured by piping stages")
    public assertPipe() {
        // Arrange
        let nullTask1 = new Task<null>();
        let nullTask2 = new Task<null>();
        let nullTask3 = new Task<null>();
        let pipeline = new Pipeline<null>();

        // Act
        pipeline.pipe(nullTask1).pipe(nullTask2).pipe(nullTask3);

        // Assert
        // Assert that no. of stages matches configuration
        expect(pipeline.getStages().length).to.equal(3);
        // Assert that order of stages matches configuration
        expect(pipeline.getStages()[0]).to.equal(nullTask1);
        expect(pipeline.getStages()[1]).to.equal(nullTask2);
        expect(pipeline.getStages()[2]).to.equal(nullTask3);
    }

    @test("Should run the stages in the pipeline")
    public assertRun(done) {
        // Arrange
        let input = "test";
        let nullTask1 = new Task<string>();
        let nullTask2 = new Task<string>();
        let invoke1 = sinon.spy(nullTask1, "invoke");
        let invoke2 = sinon.spy(nullTask2, "invoke");

        let pipeline = (new Pipeline<string>()).pipe(nullTask1).pipe(nullTask2);

        // Act
        pipeline.run(input).then(() => {
            // Assert
            // Assert all spies are called exactly once
            expect(invoke1.calledOnce).to.be.true;
            expect(invoke2.calledOnce).to.be.true;
            expect(invoke1.calledBefore(invoke2)).to.be.true;
            expect(invoke1.calledWith(input)).to.be.true;
            expect(invoke2.calledWith(input)).to.be.true;
            done();
        });
    }
}
