const { test, expect, request } = require('@playwright/test')

class LoadSteps {

  static async doTheRegistration (registrationData) {
    await test.step(`Do the registration`, async () => {
      // const registerData = await generateRandomData()
      const contextRequest = await request.newContext()

      const formData = new URLSearchParams()
      formData.append('fullName', registrationData.fullName)
      formData.append('userName', registrationData.userName)
      formData.append('email', registrationData.email)
      formData.append('password', registrationData.password)
      formData.append('phone', registrationData.phone)

      const response = await contextRequest.post('http://localhost:8000/client_registeration', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData.toString(),
      })

      expect(response.status()).toBe(200)

      if (!response.ok()) {
        console.error('Registration failed:', await response.text())
      } else {
        const responseData = await response.json()
        console.log('Registration Response:', responseData)
        return response.ok()
      }

    })
  }

  static async doTheLoginIfRegistrationPassed (registration, registrationData) {

    await test.step(`Do the login when registration passes.`, async () => {
      const contextRequest = await request.newContext()

      const formData = new URLSearchParams()
      formData.append('userName', registrationData.userName)
      formData.append('email', registrationData.email)
      formData.append('password', registrationData.password)

      const response = await contextRequest.post('http://localhost:8000/client_login', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData.toString(),
      })

      expect(response.status()).toBe(200)

      if (!response.ok()) {
        console.error('Login failed:', await response.text())
      } else {
        const responseData = await response.json()
        console.log('Login Response:', responseData)
      }
    })
  }

  static async doLogin ( loginData) {

    await test.step(`Do the login.`, async () => {
      const contextRequest = await request.newContext()

      const formData = new URLSearchParams()
      formData.append('userName', loginData.userName)
      formData.append('email', loginData.email)
      formData.append('password', loginData.password)

      const response = await contextRequest.post('http://localhost:8000/client_login', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData.toString(),
      })

      expect(response.status()).toBe(200)

      if (!response.ok()) {
        console.error('Login failed:', await response.text())
      } else {
        const responseData = await response.json()
        console.log('Login Response:', responseData)
      }
    })
  }

}

module.exports = { LoadSteps }
