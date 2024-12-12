const { UIFunctions } = require('../setup/utils/ui_functions')

class OwaspBasketPage extends UIFunctions {
  constructor (page) {
    super(page)
    this.initElements()
  }

  initElements () {
    this.INCREASE_FIRST_ITEM_COUNT = '//mat-row[position()=1]//button[2]'
    this.DELETE_FIRST_ITEM_BUTTON = '//mat-row[position()=1]//mat-cell[contains(@class,\'mat-column-remove\')]//button'
    this.PRICE = '//div[contains(text(),\'Total Price:\')]'
    this.CHECKOUT = '//span[normalize-space()=\'Checkout\']'
    this.ADD_NEW_ADDRESS = '//span[normalize-space()=\'Add New Address\']'
  }

  clickElementOnBasketPage = async (element) => {
    await this.clickElement(element)
  }

  clickElementOnBasketPageAndReturnNewPage = async (element, page) => {
    return this.clickElementAndReturnNewPage(element, page)
  }

  increaseNumberOfFirstItem = async () => {
    for (let i = 0; i < 4; i++) {
      await this.clickElement(this.INCREASE_FIRST_ITEM_COUNT)
    }
  }

  deleteFirstItem = async () => {
    await this.clickElement(this.DELETE_FIRST_ITEM_BUTTON)
  }

  getPrice = async () => {
    return (await this.page.waitForSelector(this.PRICE)).textContent()
  }

  comparePriceChange = async (oldPrice, newPrice) => {
    if (oldPrice === newPrice) {
      throw new Error('The price didn\'t change after element was removed, there\'s some issue')
    }
  }

}

module.exports = { OwaspBasketPage }
