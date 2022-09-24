// +++++++++++ MAIN +++++++++++
const domAddToCart = document.getElementById('addToCart')
domAddToCart.addEventListener('click', () => onAddItemToCartPress())

document.addEventListener('DOMContentLoaded', async () => {
  const product = await getProduct({
    productId: parseGETParams(window.location.href).id,
  })
  const {
    description,
    name,
    price,
  } = product

  domRenderImg(product)
  domPrint('description', description)
  domPrint('title', name)
  domPrint('price', price)
  domRenderColors(product)
})

// +++++++++++ HANDLERS +++++++++++
const onAddItemToCartPress = () => {
  const newCart = addItemToCart({
    id: parseGETParams(window.location.href).id,
    color: document.getElementById('colors').value,
    quantity: document.getElementById('quantity').value,
  })

  // console.log(JSON.stringify(newCart))
}

// +++++++++++ HELPERS +++++++++++
const addItemToCart = ({
  id,
  color,
  quantity,
}) => {
  let newCart = []
  const oldCart = JSON.parse(localStorage.getItem('cart') || '[]')
  const alreadyAddedProduct = _.find(oldCart, { id, color })

  if (!quantity) {
    newCart = oldCart
  }
  if (alreadyAddedProduct) {
    newCart = ([
      ..._.reject(oldCart, alreadyAddedProduct),
      {
        id,
        color,
        quantity: +quantity + +alreadyAddedProduct.quantity
      }
    ])
  } else {
    newCart = ([
      ...oldCart,
      {
        id,
        color,
        quantity,
      },
    ])
  }

  localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

// ========== getProduct
const getProduct = async ({ productId }) => {
  const response = await fetch(`http://localhost:3000/api/products/${productId}`)
  return response.json()
}

// ========== parseGETParams
// Inspiration: https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
const parseGETParams = (url = '') => {
  const query = url
    // Replace + by ' '
    .split('+').join(' ')
    // Remove before '?'
    .slice(url.indexOf('?'))

  const params = {}
  let tokens
  const re = /[?&]?([^=]+)=([^&]*)/g
  // eslint-disable-next-line
  while (tokens = re.exec(query)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}

// +++++++++++ DOM +++++++++++
// ========== domRenderImg
const domPrint = (domElementId, innerHTMLString) => {
  const domElement = document.getElementById(domElementId)
  domElement.innerHTML = innerHTMLString
}

const domRenderColors = ({ colors }) => {
  const domColors = document.getElementById('colors')
  colors.forEach(color => {
    domColors.appendChild(
      domCreateColorOption(color),
    )
  })
}

// ========== domRenderImg
const domRenderImg = (product) => {
  const domItem__Img = document.getElementById('item__img')
  domItem__Img.appendChild(
    domCreateImg(product),
  )
}

// ========== domCreateColorOption
// Generated automatically here https://html2js.esstudio.site
// <option value="vert">vert</option>
function domCreateColorOption(color) {
var e_0 = document.createElement("option");
e_0.setAttribute("value", color);
e_0.appendChild(document.createTextNode(color));
return e_0;
}

// ========== domCreateImg
// Generated automatically here https://html2js.esstudio.site
// <img src="../images/logo.png" alt="Photographie d'un canapé">
function domCreateImg({
  imageUrl,
  altTxt,
}) {
var e_0 = document.createElement("img");
e_0.setAttribute("src", imageUrl);
e_0.setAttribute("alt", altTxt);
return e_0;
}

