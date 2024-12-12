const { UIFunctions } = require('../setup/utils/ui_functions')
const { OwaspLoginPage } = require('./owaspLoginPage')

class OwaspRegisterPage extends UIFunctions {
  constructor (page) {
    super(page)
    this.initElements()
  }

  initElements () {
    this.USER_REGISTRATION_TITLE = '//h1[normalize-space()=\'User Registration\']'
    this.EMAIL_INPUT_FIELD = '//input[@id=\'emailControl\']'
    this.PASSWORD_INPUT_FIELD = '//input[@id=\'passwordControl\']'
    this.REPEAT_PASSWORD_INPUT_FIELD = '//input[@id=\'repeatPasswordControl\']'
    this.SHOW_PASSWORD_ADVICE_TOGGLE = '//mat-slide-toggle[@id=\'mat-slide-toggle-1\']'
    this.SECURITY_QUESTION_DROPDOWN = '//mat-select[@name=\'securityQuestion\']'
    this.SECURITY_ANSWER_INPUT_FIELD = '//input[@id=\'securityAnswerControl\']'
    this.REGISTER_BUTTON = '//button[@id=\'registerButton\']'
  }

  clickElementOnRegisterPage = async (element) => {
    await this.clickElement(element)
  }

  triggerFEValidationForRegister = async () => {
    await this.clickElement(this.EMAIL_INPUT_FIELD)
    await this.clickElement(this.EMAIL_INPUT_FIELD)
    await this.clickElement(this.PASSWORD_INPUT_FIELD)
    await this.clickElement(this.PASSWORD_INPUT_FIELD)
    await this.clickElement(this.REPEAT_PASSWORD_INPUT_FIELD)
    await this.clickElement(this.REPEAT_PASSWORD_INPUT_FIELD)
    await this.clickElement(this.SECURITY_QUESTION_DROPDOWN)
    await this.pressKeyboardButton('Escape')
    await this.clickElement(this.SECURITY_ANSWER_INPUT_FIELD)
    await this.clickElement(this.USER_REGISTRATION_TITLE)
  }

  validateValidationMessages = async () => {
    const createElement = (locator, expectedText) => ({ locator, expectedText })

    const mapOfNameAndElements = new Map(Object.entries({
      emailAddress: createElement('//mat-error[.=\'Please provide an email address.\']', 'Please provide an email address.'),
      password: createElement('//mat-error[.=\'Please provide a password. \']', 'Please provide a password.'),
      repeatPassword: createElement('//mat-error[.=\' Please repeat your password. \']', 'Please repeat your password.'),
      securityQuestion: createElement('//mat-error[.=\' Please select a security question. \']', 'Please select a security question.'),
      answerToQuestion: createElement('//mat-error[.=\' Please provide an answer to your security question. \']', 'Please provide an answer to your security question.'),
    }))

    await this.checkElementsPresenceDisplayAndText(mapOfNameAndElements)
  }

  fillDataForRegistration = async (emailAddress) => {
    await this.inputTextIntoElement(this.EMAIL_INPUT_FIELD, emailAddress)
    await this.inputTextIntoElement(this.PASSWORD_INPUT_FIELD, 'Start123!')
    await this.inputTextIntoElement(this.REPEAT_PASSWORD_INPUT_FIELD, 'Start123!')
    await this.clickElement(this.SHOW_PASSWORD_ADVICE_TOGGLE)
    await this.clickElement(this.SECURITY_QUESTION_DROPDOWN)
    await this.clickElement('//span[.=\' Your eldest siblings middle name? \']')
    await this.inputTextIntoElement(this.SECURITY_ANSWER_INPUT_FIELD, 'test')
    return this.clickElementAndReturnNewPage(this.REGISTER_BUTTON, OwaspLoginPage)
  }

  validateAccountCreation = async () => {
    await this.checkIfElementIsPresentAndDisplayed('//span[normalize-space(text())=\'Registration completed successfully. You can now log in.\']')
  }
}

module.exports = { OwaspRegisterPage }
