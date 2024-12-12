const { defineConfig } = require('@playwright/test')
require('dotenv').config()

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './test',
  /* Run tests in parallel */
  fullyParallel: true,
  timeout: 60000,
  expect: {
    timeout: 5000, // Same as 5 * 1000 for clarity
  },
  /* Prevent test.only from running on CI */
  forbidOnly: !!process.env.CI,
  /* Retry failed tests */
  retries: process.env.CI ? 0 : 3,
  /* Shared test settings */
  use: {
    viewport: null, // Allow fullscreen mode (overridden by project-specific options)
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }, // Video resolution
    },
    trace: 'retain-on-failure', // Trace retained for debugging failures
  },
  /* Adjust workers for CI or local runs */
  workers: process.env.CI ? 10 : undefined,
  /* Configure reporters */
  reporter: [
    ['./main/setup/utils/logReporter.js'],
    ['html'],
    [
      'allure-playwright',
      {
        detail: false,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],
  /* Define projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        launchOptions: {
          args: ['--start-maximized'], // Ensure fullscreen
          slowMo: 250, // Optional for debugging
        },
        headless: false, // Run in non-headless mode
        viewport: null, // Let the browser decide fullscreen size
      },
    },
    // Example additional browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], headless: false },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], headless: false },
    // },
  ],
})
