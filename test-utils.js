// Test framework helpers
import { logError, tryCatch } from "./src/helpers";
const SIMULATE_INPUT_ERR = `An error occurred while simulating inputs when testing a <Machine/> component!`;

function mock(sinonAPI, effectHandlers, mocks, inputSequence) {
  const effects = Object.keys(effectHandlers);
  return effects.reduce((acc, effect) => {
    acc[effect] = sinonAPI.spy(mocks[effect](inputSequence));
    return acc;
  }, {});
}

function forEachOutput(expectedOutput, fn) {
  if (!expectedOutput) return void 0;

  expectedOutput.forEach((output, index) => {
    if (output === NO_OUTPUT) return void 0;
    fn(output, index);
  });
}

function checkOutputs(testHarness, testCase, imageGallery, container, expectedOutput) {
  return forEachOutput(expectedOutput, output => {
    const {then} = testCase;
    const {command, params} = output;
    const matcher = then[command];

    if (matcher === undefined) {
      console.error(
        new Error(
          `test case > ${
            testCase.eventName
            } :: did not find matcher for command ${command}. Please review the 'then' object:`
        ),
        then
      );
      throw `test case > ${testCase.eventName} :: did not find matcher for command ${command}.`;
    } else {
      matcher(testHarness, testCase, imageGallery, container, output);
    }
  });
}

export function testMachineComponent(testAPI, testScenario, machineDef) {
  const {testCases, mocks, when, then, container, mockedMachineFactory} = testScenario;
  const {sinonAPI, test, rtl, debug} = testAPI;

  // TODO : add some contracts here : like same size for input sequence and output sequence
  testCases.forEach(testCase => {
    test(`${testCase.controlStateSequence.join(" -> ")}`, function exec_test(assert) {
      const inputSequence = testCase.inputSequence;
      // NOTE : by construction of the machine, length of input and output sequence are the same!!
      const expectedFsmOutputSequence = testCase.outputSequence;
      const expectedOutputSequence = expectedFsmOutputSequence;
      const mockedEffectHandlers = mock(sinonAPI, machineDef.effectHandlers, mocks, inputSequence);
      const mockedFsm = mockedMachineFactory(machineDef, mockedEffectHandlers);
      const done = assert.async(inputSequence.length);

      inputSequence.reduce((acc, input, index) => {
        const eventName = Object.keys(input)[0];
        const eventData = input[eventName];
        const testHarness = {assert, rtl};
        const testCase = {
          eventName,
          eventData,
          expectedOutput: expectedOutputSequence[index],
          inputSequence,
          expectedOutputSequence,
          mockedEffectHandlers,
          when,
          then,
          mocks
        };
        const simulateInput = when[eventName];

        return acc
          .then(() => {
            if (!simulateInput) throw `Cannot find what to do to simulate event ${eventName}!`;
            if (typeof simulateInput !== "function") {
              console.error(
                new Error(`Simulation for event ${eventName} must be defined through a function! Review received ::`),
                simulateInput
              );
              throw `Simulation for event ${eventName} must be defined through a function!`;
            }

            const simulatedInput = tryCatch(simulateInput, logError(debug, SIMULATE_INPUT_ERR))(
              testHarness,
              testCase,
              mockedFsm,
              container
            );
            if (simulatedInput instanceof Promise) {
              return simulatedInput.then(() =>
                checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index])
              );
            } else {
              checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]);
            }
          })
          .then(done)
          .catch(e => {
            console.log(`Error`, e);
            assert.ok(false, e);
            done(e);
          });
      }, Promise.resolve());
    });
  });
}

