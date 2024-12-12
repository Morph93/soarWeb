const { OwaspHomePage } = require('../../owaspJuiceShopUI/owaspHomePage')
const { OwaspLoginPage } = require('../../owaspJuiceShopUI/owaspLoginPage')
const { OwaspRegisterPage } = require('../../owaspJuiceShopUI/owaspRegisterPage')
const { OwaspBasketPage } = require('../../owaspJuiceShopUI/owaspBasketPage')

class POManager {

  constructor (page) {
    this.page = page
    this.owaspHomePage = new OwaspHomePage(this.page)
    this.owaspLoginPage = new OwaspLoginPage(this.page)
    this.owaspRegisterPage = new OwaspRegisterPage(this.page)
    this.owaspBasketPage = new OwaspBasketPage(this.page)
  }

}

module.exports = { POManager }

