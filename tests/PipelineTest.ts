import { expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
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
    public assertRun() {
        // Arrange
        // Set spies on up and down in tasks

        // Act

        // Assert
    }
}
