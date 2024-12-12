const { UIFunctions } = require('../setup/utils/ui_functions')

class OwaspNewAddressPage extends UIFunctions {
  constructor (page) {
    super(page)
    this.initElements()
  }

  initElements () {
    this.COUNTRY_INPUT_FIELD = '//input[@placeholder=\'Please provide a country.\']'
    this.NAME_INPUT_FIELD = '//input[@data-placeholder=\'Please provide a name.\']'
    this.MOBILE_NUMBER_INPUT_FIELD = '//input[@data-placeholder=\'Please provide a mobile number.\']'
    this.ZIP_INPUT_FIELD = '//input[@data-placeholder=\'Please provide a ZIP code.\']'
    this.ADDRESS_INPUT_FIELD = '//textarea[@id=\'address\']'
    this.CITY_INPUT_FIELD = '//input[@placeholder=\'Please provide a city.\']'
    this.STATE_INPUT_FIELD = '//input[@data-placeholder=\'Please provide a state.\']'
    this.SUBMIT_BUTTON = '//button[@id=\'submitButton\']'
  }

  fillNewAddressValues = async () => {
    const generateRandomString = () =>
      Math.random().toString(36).substring(2, 10)

    const generateRandomNumber = () =>
      Math.floor(1e7 + Math.random() * 9e7).toString()

    for (const key in this) {
      if (key.endsWith('_INPUT_FIELD')) {
        const locator = this[key]
        const randomValue = key === 'MOBILE_NUMBER_INPUT_FIELD'
          ? generateRandomNumber()
          : generateRandomString()
        await this.inputTextIntoElement(locator, randomValue)
      }
    }
  }

  submitNewAddress = async () => {
    await this.clickElement(this.SUBMIT_BUTTON)
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

  selectNewlyCreatedAddress = async () => {
    await this.clickElement('//mat-radio-button[contains(@id,\'mat-radio\')]')
    await this.clickElement('//button[@aria-label=\'Proceed to payment selection\']')
  }

  selectDeliveryOption = async () => {
    await this.clickElement('//mat-cell[.=\' One Day Delivery\']//ancestor::mat-row//span[@class=\'mat-radio-container\']')
    await this.clickElement('//button[@aria-label=\'Proceed to delivery method selection\']')
  }

  checkIfWalletHasZeroBalance = async () => {
    await this.compareText('//span[@class=\'confirmation card-title\']', ' 0.00')
  }

  addNewCard = async () => {
    await this.clickElement('//mat-panel-description[.=\' Add a credit or debit card \']')
    await this.inputTextIntoElement('//mat-form-field[.=\'Name *\']//input', 'Test')
    await this.inputTextIntoElement('//mat-form-field[contains(.,\'Card Number *\')]//input', '1111111111111111')
    await this.selectNativeDropdown('//mat-label[.=\'Expiry Month\']', '3')
    await this.selectNativeDropdown('//mat-label[.=\'Expiry Year\']', '2080')
    await this.clickElement('//button[@id=\'submitButton\']')
  }

  selectNewCard = async () => {
    await this.clickElement('//mat-radio-button[contains(@id,\'mat-radio\')]')
  }

  proceedToReview = async () => {
    await this.clickElement('//button[@aria-label=\'Proceed to review\']')
  }

  checkIfOrderSummaryAppeared = async () => {
    await this.checkIfElementIsPresentAndDisplayed('//div[@class=\'order-summary\']')
  }

  placeTheOrderAndPay = async () => {
    await this.clickElement('//span[normalize-space()=\'Place your order and pay\']')
    await this.compareText('//h1[@class=\'confirmation\']', 'Thank you for your purchase!')
  }

}

module.exports = { OwaspNewAddressPage }
