Install dependencies:
	- npm install
	- npm install @playwright/test
	- npx playwright install

======================================================================================================

### EXECUTION:

## In order to execute using playwright runner you have to run the command from the terminal:
    * npx playwright test --grep "@UI" (this will target all tests that have tag @UI
        , if you wish to target some other tag just change it to desired one).

    * to do the load test send following command:
      npx playwright test --grep "RegisterAndLoginLoad" --workers=10 --trace on
      If you wish to trigger:
        just 'Registration' change to --grep "RegisterLoad"
        just 'Login' change to --grep "LoginLoad"


   * Or you can go to the spec.js module and directly execute from there by clicking play button next to the test
        Modules are:
            - e2eTest.spec.JS
            - loadTest.spec.js
### REPORTING:

* The report is automatically generated when line above is executed, it doesn't start in case everything passes run: 'npx playwright show-report'
* If you want to generate Allure report run following commands after the execution:
    - allure generate --clean
    - allure serve allure-results

###Helpfull things:

* VSC Extension for debugging: https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright
