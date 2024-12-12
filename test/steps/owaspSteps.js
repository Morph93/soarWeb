const { test } = require('@playwright/test')
const { getPoManger: poManager } = require('../../main/setup/hooks')
const { OwaspLoginPage } = require('../../main/owaspJuiceShopUI/owaspLoginPage')
const { OwaspRegisterPage } = require('../../main/owaspJuiceShopUI/owaspRegisterPage')
const { OwaspNewAddressPage } = require('../../main/owaspJuiceShopUI/owaspNewAddressPage')

let homePage
let loginPage
let registerPage
let basketPage
let newAddressPage
let emailAddress
let totalPrice
let changedPrice

class OWASPSteps {

  static async closeWelcomePopUp (element) {
    return await test.step('Close welcome popUp', async () => {
      homePage = poManager().owaspHomePage
      await homePage.clickElementOnHomePage(element)
    })
  }

  static async increaseNumberOfItemsPerPage (element) {
    return await test.step('Increase number of items per page to maximum number.', async () => {
      await homePage.clickElementOnHomePage(element)
      await homePage.increaseNumberOfItemsOnPageToMax()
    })
  }

  static async verifyThatAllItemsArePresent () {
    return await test.step('Verify that all items are present on the page.', async () => {
      const items = [
        ' Apple Juice (1000ml) ',
        ' Apple Pomace ',
        ' Banana Juice (1000ml) ',
        ' Best Juice Shop Salesman Artwork ',
        ' Carrot Juice (1000ml) ',
        ' DSOMM & Juice Shop User Day Ticket ',
        ' Eggfruit Juice (500ml) ',
        ' Fruit Press ',
        ' Green Smoothie ',
        ' Juice Shop "Permafrost" 2020 Edition ',
        ' Lemon Juice (500ml) ',
        ' Melon Bike (Comeback-Product 2018 Edition) ',
        ' OWASP Juice Shop "King of the Hill" Facemask ',
        ' OWASP Juice Shop CTF Girlie-Shirt ',
        ' OWASP Juice Shop Card (non-foil) ',
        ' OWASP Juice Shop Coaster (10pcs) ',
        ' OWASP Juice Shop Holographic Sticker ',
        ' OWASP Juice Shop Hoodie ',
        ' OWASP Juice Shop Iron-Ons (16pcs) ',
        ' OWASP Juice Shop LEGO™ Tower ',
        ' OWASP Juice Shop Logo (3D-printed) ',
        ' OWASP Juice Shop Magnets (16pcs) ',
        ' OWASP Juice Shop Mug ',
        ' OWASP Juice Shop Sticker Page ',
        ' OWASP Juice Shop Sticker Single ',
        ' OWASP Juice Shop T-Shirt ',
        ' OWASP Juice Shop Temporary Tattoos (16pcs) ',
        ' OWASP Juice Shop-CTF Velcro Patch ',
        ' OWASP SSL Advanced Forensic Tool (O-Saft) ',
        ' OWASP Snakes and Ladders - Mobile Apps ',
        ' OWASP Snakes and Ladders - Web Applications ',
        ' Orange Juice (1000ml) ',
        ' Pwning OWASP Juice Shop ',
        ' Quince Juice (1000ml) ',
        ' Raspberry Juice (1000ml) ',
        ' Strawberry Juice (500ml) ',
        ' Woodruff Syrup "Forest Master X-Treme" '
      ]

      await homePage.verifyItemsOnPage(items)
    })
  }

  static async openAppleJuicePopUp (element) {
    return await test.step('Open apple juice product popUp.', async () => {
      await homePage.clickElementOnHomePage(element)
    })
  }

  static async checkIfProductPopUpIsDisplayed (element, element2) {
    return await test.step('Check if product popUp is displayed.', async () => {
      await homePage.checkIfElementIsPresentAndDisplayed(element)
      await homePage.sleep(3)
      await homePage.clickElementOnHomePage(element2)
    })
  }

  static async openRegistration () {
    return await test.step('Open registration page.', async () => {
      await homePage.clickElementOnHomePage(poManager().owaspHomePage.ACCOUNT_ICON)
      loginPage = await homePage.clickElementAndReturnNewPage(poManager().owaspHomePage.LOGIN, OwaspLoginPage)
      registerPage = await loginPage.clickElementAndReturnNewPage(poManager().owaspLoginPage.NOT_YET_A_CUSTOMER, OwaspRegisterPage)
    })
  }

  static async triggerValidationsOnRegistration () {
    return await test.step('Trigger validation messages on registration page.', async () => {
      await registerPage.triggerFEValidationForRegister()
    })
  }

  static async validateValidationMessagesOnRegistrationPage () {
    return await test.step('Validate validation messages on registration page.', async () => {
      await registerPage.validateValidationMessages()
    })

  }

  static async registerNewUserWithValidData () {
    return await test.step('Register new user with valid data.', async () => {
      const now = new Date()
      const formattedTime = `${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`
      emailAddress = 'test' + formattedTime + '@mailinator.com'

      loginPage = await registerPage.fillDataForRegistration(emailAddress)
    })
  }

  static async checkIfConfirmationMessageAppearedForAccountCreation () {
    return await test.step('Validate confirmation messages when new account is created.', async () => {
      await registerPage.validateAccountCreation()
    })
  }

  static async login () {
    return await test.step('Login into the application.', async () => {
      homePage = await loginPage.logIn(emailAddress)
    })
  }

  static async addFiveDifferentItemsToTheChart () {
    return await test.step('Add 5 different products to the basket.', async () => {
      await homePage.addFiveDifferentProductsToTheBasket()
    })
  }

  static async checkIfBasketHasNumberFive () {
    return await test.step('Check if basket has number 5.', async () => {
      await homePage.checkIfBasketHasNumber5()
    })
  }

  static async clickOnBasket () {
    return await test.step('Open basket page.', async () => {
      basketPage = await homePage.openBasketPage()
      totalPrice = await basketPage.getPrice()
    })
  }

  static async increaseNumberOfFirstProductAndThenDeleteItAndVerifyBasketNumber () {
    return await test.step('Increase number of first product and then remove it, after that confirm that basket number changed.', async () => {
      await basketPage.increaseNumberOfFirstItem()
    })
  }

  static async deleteFirstItemFromTheBasket () {
    return await test.step('Delete first item in basket.', async () => {
      await basketPage.deleteFirstItem()
      changedPrice = await basketPage.getPrice()
    })
  }

  static async checkIfTotalPriceHasChanged () {
    return await test.step('Check if total price has changed.', async () => {
      await basketPage.comparePriceChange(totalPrice, changedPrice)
    })
  }

  static async clickElementOnBasketPage (element) {
    return await test.step('Click checkout', async () => {
      await basketPage.clickElementOnBasketPage(element)
    })
  }

  static async clickElementOnBasketPageAndReturnNewPage (element) {
    return await test.step('Click add new address', async () => {
      newAddressPage = await basketPage.clickElementOnBasketPageAndReturnNewPage(element, OwaspNewAddressPage)
    })
  }

  static async createNewAddress () {
    return await test.step('Fill new address fields with valid data.', async () => {
      await newAddressPage.fillNewAddressValues()
      await newAddressPage.submitNewAddress()
    })
  }

  static async selectNewAddress () {
    return await test.step('Select newly created address.', async () => {
      await newAddressPage.selectNewlyCreatedAddress()
    })
  }

  static async selectDeliveryOptionANdCheckIfBalanceIsZero () {
    return await test.step('Select delivery option and check if balance is zero.', async () => {
      await newAddressPage.selectDeliveryOption()
      await newAddressPage.checkIfWalletHasZeroBalance()
    })
  }

  static async addNewCardAndProceedToReview () {
    return await test.step('Add new card and proceed to review.', async () => {
      await newAddressPage.addNewCard()
      await newAddressPage.selectNewCard()
      await newAddressPage.proceedToReview()
    })
  }

  static async checkIfOrderSummaryPageIsShown () {
    return await test.step('Check if user gets redirected to summary page.', async () => {
      await newAddressPage.checkIfOrderSummaryAppeared()
    })
  }

  static async placeTheOrderAndPayForTheItems () {
    return await test.step('Place the order and pay for the items.', async () => {
      await newAddressPage.placeTheOrderAndPay()
    })
  }

}

module.exports = {
  OWASPSteps
}
