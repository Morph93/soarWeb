const { test: base } = require('@playwright/test')
const { POManager } = require('./utils/POManager')

let poManager

const test = base.extend({
  poManager: [async ({ page }, use, testInfo) => {
    const title = testInfo.title
    console.log(`Running custom fixture for test: ${title}`)

    if (title.includes('@UI')) {
      poManager = new POManager(page)
      await page.goto('https://juice-shop.herokuapp.com/#/')
      console.log('Navigated to home page.')
    } else {
      console.log('Skipped custom fixture for non-UI test')
    }

    await use(poManager) // Provide poManager to the test
  }, { auto: true }]
})

module.exports = {
  test,
  getPoManger: () => poManager
}
