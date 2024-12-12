const { test, expect, request } = require('@playwright/test')
const { faker } = require('@faker-js/faker')
const { LoadSteps } = require('../steps/loadSteps')

async function generateRandomData () {
  return {
    fullName: faker.person.fullName(),
    userName: faker.person.firstName() + Date.now(),
    email: faker.internet.email() + Date.now(),
    password: faker.internet.password(),
    phone: faker.phone.number()
  }
}


/**
 * Increase length to number of parallel executions you want to achieve
 */
Array.from({ length: 10 }).forEach((_, index) => {
  test(`[Load] [RegisterLoad] Register Load Test for /client_register - User ${index + 1}`, async () => {
    const registerData = await generateRandomData()
    await LoadSteps.doTheRegistration(registerData)
  })
})

/**
 * Increase length to number of parallel executions you want to achieve
 */
Array.from({ length: 10 }).forEach((_, index) => {
  test(`[Load] [LoginLoad] Register Load Test for /client_register - User ${index + 1}`, async () => {
    const loginData = await generateRandomData() // Generate data for the current user
    await LoadSteps.doLogin(loginData)

  })
})


/**
 * Increase length to number of parallel executions you want to achieve
 */
Array.from({ length: 10 }).forEach((_, index) => {
  test(`[Load] [RegisterAndLoginLoad] Register & Login Test for User ${index + 1}`, async () => {
    const registerData = await generateRandomData()
    await LoadSteps.doTheLoginIfRegistrationPassed(await LoadSteps.doTheRegistration(registerData), registerData)
  })
})

