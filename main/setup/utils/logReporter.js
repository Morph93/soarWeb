require('@playwright/test')

/** @implements {import('@playwright/test/reporter').Reporter} */
class LogReporter {
  constructor (options) {
    // console.log(`my-awesome-reporter setup with customOption set to ${options.customOption}`)
  }

  onBegin (config, suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests\n`)
  }

  onTestBegin (test) {
    console.log(`${test.title}`)
  }

  onStepBegin (test, result, step) {
    if (step.category === 'test.step') console.log(`${step.title}`)
  }

  onError (error) {
    console.log(error)
  }

  onStdOut (chunk, test, result) {
    console.log(chunk.trim())
  }

  // onStepEnd (test, result, currentStep) {
  //   const currentStepResult = result.steps.find(stepResult => stepResult.title === currentStep.title)
  //   if (currentStepResult && currentStepResult.error) console.log(`\x1B[31mERROR:\x1B[39m ${currentStepResult.error.message}`)
  // }

  onTestEnd (test, result) {
    console.log(`Finished test ${test.title}: ${result.status}\n`)
    result.errors.forEach(err => console.log(err.stack))
  }

  onEnd (result) {
    console.log(`Finished the run: ${result.status}\n`)
  }
}

module.exports = LogReporter
