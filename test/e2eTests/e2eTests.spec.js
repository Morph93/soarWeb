const { test, getPoManger } = require('../../main/setup/hooks')
const { OWASPSteps } = require('../steps/owaspSteps')
const { expect } = require('@playwright/test')

test(`[@UI] [test1] Scroll to the pagination and change items per page to maximum number and check if page displays all items.`, async () => {
  await OWASPSteps.closeWelcomePopUp(getPoManger().owaspHomePage.CLOSE_WELCOME_BANNER)
  await OWASPSteps.increaseNumberOfItemsPerPage(getPoManger().owaspHomePage.ITEMS_PER_PAGE_DROPDOWN)
  await OWASPSteps.verifyThatAllItemsArePresent()
})

test(`[@UI] [test2] Open Apple Juice product and check if popUp appeared.`, async () => {
  await OWASPSteps.closeWelcomePopUp(getPoManger().owaspHomePage.CLOSE_WELCOME_BANNER)
  await OWASPSteps.openAppleJuicePopUp(getPoManger().owaspHomePage.APPLE_JUICE_PRODUCT)
  await OWASPSteps.checkIfProductPopUpIsDisplayed(getPoManger().owaspHomePage.APPLE_JUICE_PRODUCT_POPUP, getPoManger().owaspHomePage.APPLE_JUICE_PRODUCT_POPUP_CLOSE_BUTTON)
})

test(`[@UI] [test3and4] Check registration input field validation and then create proper account and login with it and purchase items.`, async () => {
  await OWASPSteps.closeWelcomePopUp(getPoManger().owaspHomePage.CLOSE_WELCOME_BANNER)
  await OWASPSteps.openRegistration()
  await OWASPSteps.triggerValidationsOnRegistration()
  await OWASPSteps.validateValidationMessagesOnRegistrationPage()
  await OWASPSteps.registerNewUserWithValidData()
  await OWASPSteps.checkIfConfirmationMessageAppearedForAccountCreation()
  await OWASPSteps.login()
  await OWASPSteps.addFiveDifferentItemsToTheChart()
  await OWASPSteps.checkIfBasketHasNumberFive()
  await OWASPSteps.clickOnBasket()
  await OWASPSteps.increaseNumberOfFirstProductAndThenDeleteItAndVerifyBasketNumber()
  await OWASPSteps.deleteFirstItemFromTheBasket()
  await OWASPSteps.checkIfTotalPriceHasChanged()
  await OWASPSteps.clickElementOnBasketPage(getPoManger().owaspBasketPage.CHECKOUT)
  await OWASPSteps.clickElementOnBasketPageAndReturnNewPage(getPoManger().owaspBasketPage.ADD_NEW_ADDRESS)
  await OWASPSteps.createNewAddress()
  await OWASPSteps.selectNewAddress()
  await OWASPSteps.selectDeliveryOptionANdCheckIfBalanceIsZero()
  await OWASPSteps.addNewCardAndProceedToReview()
  await OWASPSteps.checkIfOrderSummaryPageIsShown()
  await OWASPSteps.placeTheOrderAndPayForTheItems()
})


