const { UIFunctions } = require('../setup/utils/ui_functions')
const { OwaspBasketPage } = require('./owaspBasketPage')

class OwaspHomePage extends UIFunctions {
  constructor (page) {
    super(page)
    this.initElements()
  }

  initElements () {
    this.CLOSE_WELCOME_BANNER = '//button[@aria-label=\'Close Welcome Banner\']'
    this.ACCOUNT_ICON = '//span[normalize-space()=\'Account\']'
    this.LOGIN = '//button[@id=\'navbarLoginButton\']//span[contains(text(),\'Login\')]'
    this.ITEMS_PER_PAGE_DROPDOWN = '//mat-select[@role=\'combobox\']'
    this.APPLE_JUICE_PRODUCT = '//div[normalize-space()=\'Apple Juice (1000ml)\']'
    this.APPLE_JUICE_PRODUCT_POPUP = '//mat-dialog-container[contains(.,\'Apple Juice (1000ml)\')]'
    this.APPLE_JUICE_PRODUCT_POPUP_CLOSE_BUTTON = '//span[normalize-space()=\'Close\']'
    this.BASKET_ICON = '//span[normalize-space()=\'Your Basket\']'
  }

  clickElementOnHomePage = async (element) => {
    await this.clickElement(element)
  }

  increaseNumberOfItemsOnPageToMax = async () => {
    const elements = await this.page.locator('//span[@class=\'mat-option-text\']').all()

    const values = await Promise.all(elements.map(async el => {
      const value = await el.textContent()
      return parseFloat(value.trim())
    }))

    const maxValue = Math.max(...values)
    const maxIndex = values.indexOf(maxValue)

    await elements[maxIndex].click()    // Click the element with the highest value
  }

  verifyItemsOnPage = async (items) => {
    const invisibleItems = await Promise.all(
      items.map(async (item) => {
        const isVisible = await this.page.locator(`text=${item.trim()}`).isVisible()
        return isVisible ? null : item.trim()
      })
    ).then(results => results.filter(Boolean))

    if (invisibleItems.length > 0) {
      throw new Error(`The following items were not found:\n${invisibleItems.join('\n')}`)
    } else {
      console.log('All items are present on the page.')
    }
  }

  addFiveDifferentProductsToTheBasket = async () => {
    for (let added = 0, pos = 1; added < 5; pos++) {
      const button = await this.page.$(`(//button[.='Add to Basket'])[${pos}]`);
      if (!button) continue;

      await button.click();
      const outOfStock = await this.page.$('//span[normalize-space()="We are out of stock! Sorry for the inconvenience."]');
      if (!outOfStock) added++;
    }
  };

  checkIfBasketHasNumber5 = async () => {
    await this.checkIfElementIsPresentAndDisplayed('//span[contains(@class,\'warn-notification\') and text()=\'5\']')
  }

  openBasketPage = async () => {
    return this.clickElementAndReturnNewPage(this.BASKET_ICON, OwaspBasketPage)
  }

}

module.exports = { OwaspHomePage }
