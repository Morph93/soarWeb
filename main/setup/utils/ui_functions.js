const console = require('node:console')

class UIFunctions {
  page

  constructor (page) {
    this.page = page
  }

  /**
   * This function is used to get the name of the element you're interacting with, out of list of elements that was initiated for page object.
   * It will take the list of elements(object), then convert it into a map with reversed order and then extract the name based on the xpath.
   * We do it like this because of efficiency: Lookups are O(1) due to the nature of the Map data structure.
   * @param xpath - locator of the element you're interacting with
   * @returns {Promise<string>} - returns the name of the element
   */
  async getElementName (xpath) {
    const listOfElements = Object.entries(this).filter(([key, value]) => typeof value === 'string')
    const map = new Map(listOfElements.map(([name, expression]) => [expression, name]))
    return map.get(xpath)
  }

  /**
   * If you wish to check presence and visibility of single element you can call this function.
   * @param locator - parameter as custom xPath locator is passed in order to locate desired element on the page.
   */
  async checkIfElementIsPresentAndDisplayed (locator) {
    let element
    try {
      element = await this.page.waitForSelector(locator, { timeout: 5000 })
    } catch (e) {
      throw new Error('Element: ' + await this.getElementName(locator) + ' with locator: ' + locator + ' was not found on the page.')
    }
    try {
      await element.isVisible()
    } catch (e) {
      throw new Error('Element: ' + await this.getElementName(locator) + ' with locator: ' + locator + ' is not visible on the page.')
    }
  }

  /**
   * If you wish to check presence, visibility and text of multiple elements, you can call this function.
   * @param mapOfPageElements - this parameter should contain map of elements that you wish to verify
   *                            , map should contain elementName and object that should have locator and expectedText.
   *                             example: mapOfNameAndElements.set("element", {locator: "//xpath", expectedText: "textThatYouExpect"});
   */
  async checkElementsPresenceDisplayAndText (mapOfPageElements) {
    const notPresent = new Set()
    const notDisplayed = new Set()
    const incorrectText = new Set()

    const checkPromises = Array.from(mapOfPageElements).map(async ([elementName, { locator, expectedText }]) => {
      try {
        const element = await this.page.waitForSelector(locator, { timeout: 3000 })

        if (!await element.isVisible()) {
          notDisplayed.add(`Element: "${elementName}" with locator: "${locator}" is not displayed`)
        } else if (expectedText != null) {
          const elementText = await element.textContent()
          const elementTrimmedText = elementText.replace(/(\r\n|\n|\r)/gm, '').trim()
          if (elementTrimmedText !== expectedText) {
            incorrectText.add(`Element: "${elementName}" has incorrect text. Expected text should be: "${expectedText}", but actual is: "${elementTrimmedText}"`)
          }
        }
      } catch (error) {
        notPresent.add(`${elementName} with locator: ${locator} is not present`)
      }
    })

    await Promise.all(checkPromises)

    const errorMessage = [
      notPresent.size > 0 && `The following elements are not present:\n${Array.from(notPresent).join('\n')}`,
      notDisplayed.size > 0 && `The following elements are not displayed:\n${Array.from(notDisplayed).join('\n')}`,
      incorrectText.size > 0 && `The following elements have incorrect text:\n${Array.from(incorrectText).join('\n')}`
    ].filter(Boolean).join('\n\n')

    if (errorMessage) {
      throw new Error(errorMessage)
    }
  }

  /**
   * In case you need to force wait before any action you can call this sleep function.
   * @param seconds - parameter that amount of time that the execution will sleep before continuing the execution.
   */
  async sleep (seconds) {
    const milliseconds = seconds * 1000 // Convert seconds to milliseconds
    await new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  /**
   * Call this function if you want to input any text into some input field element.
   * @param locator - parameter as custom xPath locator is passed in order to locate desired element on the page.
   * @param text - text that you wish to input into desired element.
   */
  async inputTextIntoElement (locator, text) {
    try {
      /**
       * The first line will clear the element of any input text before filling it with the value you want.
       */
      await this.page.waitForSelector(locator, { timeout: 5000 })?.then(el => el.fill(''))
      await this.page.waitForSelector(locator, { timeout: 5000 })?.then(el => el.fill(text))
    } catch (e) {
      throw new Error('Element: ' + await this.getElementName(locator) + ' with locator: ' + locator + ' was not found on the page and couldn\'t be filled with: ' + text)
    }
  }

  /**
   * Selects an option from a native dropdown element on a webpage.
   *
   * This function attempts to select an option using two methods:
   * 1. Directly using the `selectOption` method.
   * 2. By interacting with the dropdown and option elements using clicks.
   *
   * If the `selectOption` method fails, it falls back to clicking the dropdown and the desired option.
   * If both methods fail, an error is thrown.
   *
   * @param {string} locator - The XPath or CSS selector for the dropdown element.
   * @param {string} optionValue - The value attribute of the option to be selected.
   * @throws {Error} Throws an error if both methods fail to select the desired option.
   */
  selectNativeDropdown = async (locator, optionValue) => {
    try {
      await this.page.selectOption(locator, optionValue)
    } catch {
      try {
        await this.page.click(locator)
        await this.page.click(`${locator}/option[@value="${optionValue}"]`)
      } catch (error) {
        throw new Error(`Failed to select option ${optionValue}. ${error.message}`)
      }
    }
  }

  /**
   * Call this function if you wish to click on any element on the page. This function will wait for specified amount of time for element to be present and then execute click action.
   * @param locator - parameter as custom xPath locator is passed in order to locate desired element on the page.
   * @param timeout - parameter is passed in order to set desired timeout before exception is thrown else the default timeout will be 1s.
   */
  clickElement = async (locator, timeout) => {
    if (timeout === undefined || timeout === null) {
      timeout = 5000
    }
    try {
      await this.page.waitForSelector(await locator, { timeout: timeout })?.then(el => el.click())
    } catch (e) {
      await this.sleep(2)
      try {
        await this.page.waitForSelector(await locator, { timeout: timeout })?.then(el => el.click({ force: true }))
      } catch (e) {
        throw new Error('Element: ' + await this.getElementName(locator) + ' was not found on the page and couldn\'t be clicked.')
      }
    }
  }

  /**
   * Call this function if you wish to click on any element on the page. This function will wait for specified amount of time for element to be present and then execute click action.
   * It will return a new object of the given page in a state that's passed as a parameter.
   * @param locator - parameter as custom xPath locator is passed in order to locate desired element on the page.
   * @param page - send a class of the page you wish to return. example: IQHomePage.
   * @param state - in case the page have multiple states, you have to pass the state parameter as well in order to get a new instance of that page.
   * @param timeout - parameter is passed in order to set desired timeout before exception is thrown else the default timeout will be 1s.
   * @returns {Promise<*>}
   */
  clickElementAndReturnNewPage = async (locator, page, state, timeout) => {
    if (timeout === undefined || timeout === null) {
      timeout = 5000
    }
    try {
      await this.page.waitForSelector(await locator, { timeout: timeout })?.then(el => el.click())
      if (page) {
        return new page(this.page, state)
      }
    } catch (e) {
      await this.sleep(2)
      try {
        await this.page.waitForSelector(await locator, { timeout: timeout })?.then(el => el.click())
        if (page) {
          return new page(this.page, state)
        }
      } catch (e) {
        throw new Error('Element: ' + await this.getElementName(locator) + ' was not found on the page and couldn\'t be clicked.')
      }
    }
  }

  /**
   * In case you want to simulate pressing of any keyboard key you can use this function.
   * @param button - Key on the keyboard you wish to simulate clicking. Example pressKeyboardButton('Enter');
   */
  async pressKeyboardButton (button) {
    await this.page.keyboard.press(button)
  }

  /**
   * If you wish to compare text in the element with the expectedText you can use this function.
   * @param locator - parameter as custom xPath locator is passed in order to locate desired element on the page.
   * @param expectedText - text that is expected for specified element.
   */
  async compareText (locator, expectedText) {
    const element = await this.page.waitForSelector(locator, { timeout: 5000 })
    const elementText = await element.textContent()
    const elementTrimmedText = elementText.replace(/(\r\n|\n|\r)/gm, '').trim()
    if (await elementTrimmedText !== expectedText.replace(/(\r\n|\n|\r)/gm, '').trim()) {
      throw new Error(`Element with locator ${locator} doesn't contain expected: ${await expectedText} text, it has ${await elementTrimmedText}`)
    }
  }
}

module
  .exports = { UIFunctions: UIFunctions }
