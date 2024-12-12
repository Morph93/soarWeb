const { UIFunctions } = require('../setup/utils/ui_functions')
const { OwaspHomePage } = require('./owaspHomePage')

class OwaspLoginPage extends UIFunctions {
  constructor (page) {
    super(page)
    this.initElements()
  }

  initElements () {
    this.EMAIL_INPUT_FIELD = '//input[@id=\'email\']'
    this.PASSWORD_INPUT_FIELD = '//input[@id=\'password\']'
    this.LOGIN_BUTTON = '//span[text()=\' Log in \']'
    this.NOT_YET_A_CUSTOMER = '//a[.=\'Not yet a customer?\']'
  }

  clickElementOnLoginPage = async (element) => {
    await this.clickElement(element)
  }

  logIn = async (email) => {
    await this.inputTextIntoElement(this.EMAIL_INPUT_FIELD, email)
    await this.inputTextIntoElement(this.PASSWORD_INPUT_FIELD, 'Start123!')
    return  this.clickElementAndReturnNewPage(this.LOGIN_BUTTON, OwaspHomePage)
  }

}

module.exports = { OwaspLoginPage }
