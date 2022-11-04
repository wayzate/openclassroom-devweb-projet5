const orderSubmitButton = document.getElementById('order')
orderSubmitButton.addEventListener('click', () => {
  const contact = craftContact()
  validateContact(contact)
})

const form = document.querySelector('form')
form.addEventListener('submit', async (event) => {
  event.preventDefault() // avoid annoying refresh on submit
  const contact = craftContact()

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const productIds = cart.map(({
    id,
  }) => id)
  if (validateContact(contact)) {
    const {
      orderId,
    } = await post('http://localhost:3000/api/products/order', {
      contact,
      products: productIds,
    })
    location.href = `./confirmation.html?orderId=${orderId}`
    console.log(orderId)
  }
})


const validateContact = ({
  firstName,
  lastName,
  address,
  city,
  email,
}) => {
  if (
    firstName && !hasNumber(firstName)
    && lastName && !hasNumber(lastName)
    && address
    && city && !hasNumber(city)
    && email && isEmail(email)
  ) {
    return true
  } else {
    document.getElementById('firstNameErrorMsg').innerHTML = firstName && !hasNumber(firstName) ? '' : 'Champ invalide'
    document.getElementById('lastNameErrorMsg').innerHTML = lastName && !hasNumber(lastName) ? '' : 'Champ invalide'
    document.getElementById('addressErrorMsg').innerHTML = address ? '' : 'Champ invalide'
    document.getElementById('cityErrorMsg').innerHTML = city && !hasNumber(city) ? '' : 'Champ invalide'
    document.getElementById('emailErrorMsg').innerHTML = (email && isEmail(email)) ? '' : 'Champ invalide'
    return false
  }
}

const craftContact = () => {
  const contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value,
  }
  return contact
}

const hasNumber = myString => {
  return /\d/.test(myString);
}

const isEmail = (email) => {
  // pasted from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  // then linted
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const post = async (url, payload) => {
  try {
    const response = await fetch(
      url,
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: "POST",
          body: JSON.stringify(payload),
      },
    )
    return response.json()
  } catch (e) {
    console.error(e)
  }
}
// const main = async () => {
//   const response = await post('http://localhost:3000/api/products/order', {
//     contact: {
//       firstName: 'toto',
//       lastName: 'toto',
//       address: 'toto',
//       city: 'toto',
//       email: 'toto@test.fr',
//     },
//     products: [],
//   })
//   console.log(response)
// }
// main()


const buildProducts = async ({ cart }) => {
  const products = await Promise.all(cart.map(async ({
    id,
    color,
    quantity,
  }) => {
    console.log('fetching')
    const product = await getProduct({ productId: id })

    return ({
      ...product,
      id,
      color,
      quantity,
    })
  }))

  return products
}