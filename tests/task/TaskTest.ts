import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import { IExecuteCallback, IExecuteStrategy, Task } from "../../src";

@suite("Task tests")
class PipelineTest {

    @test("Should execute strategy on invoke")
    public assertStrategy(done) {
        // Arrange
        let calls: string[];
        let executeUpStub = <IExecuteStrategy<string>> {};
        let executeDownStub = <IExecuteStrategy<string>> {};
        executeUpStub.execute = (input, resolve, reject) => { resolve(input + "-up"); };
        executeDownStub.execute = (input, resolve, reject) => { resolve(input + "-down"); };

        let nextStub = (input: string) => {
            return Promise.resolve(input + "-next");
        };

        let resolveStub = (output) => {
            // Assert
            expect(output).to.equal("input-up-next-down");
            done();
         };
        let rejectStub = (reason) => { return; };

        let task = new Task<string>(executeUpStub, executeDownStub);

        // Act
        task.invoke("input", nextStub, resolveStub, rejectStub);
    }

    @test("Should execute callback on invoke")
    public assertCallback(done) {
        // Arrange
        let executeUpStub: IExecuteCallback<string> = (input, resolve, reject) => { resolve(input + "-up"); };
        let executeDownStub: IExecuteCallback<string> = (input, resolve, reject) => { resolve(input + "-down"); };

        let nextStub = (input: string) => {
            return Promise.resolve(input + "-next"); }
        ;

        let resolveStub = (output) => {
            // Assert
            expect(output).to.equal("input-up-next-down");
            done();
         };
        let rejectStub = (reason) => { return; };

        let task = new Task<string>(executeUpStub, executeDownStub);

        // Act
        task.invoke("input", nextStub, resolveStub, rejectStub);
    }

    @test("Should resolve with input if no strategy or callback passed")
    public assertResolve(done) {
        // Arrange
        let nextStub = (input: string) => {
            return Promise.resolve(input + "-next"); }
        ;

        let resolveStub = (output) => {
            // Assert
            expect(output).to.equal("input-next");
            done();
         };
        let rejectStub = (reason) => { return; };

        let task = new Task<string>();

        // Act
        task.invoke("input", nextStub, resolveStub, rejectStub);
    }
}
