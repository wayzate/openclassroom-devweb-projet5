// +++++++++++ MAIN +++++++++++
document.addEventListener('DOMContentLoaded', async () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const products = await craftProducts({ cart })

  products.forEach(domRenderItem)
  domAddEventListeners(cart)

  domPrintTotals(products)
})

// +++++++++++ HANDLERS +++++++++++
const onDeleteItemPress = async (item) => {
  // console.log('clicked on delete item')
  const cart = removeItemFromCart(item)

  domRemoveItem(item)
  domPrintTotals(await craftProducts({ cart }))
}

const onEditItemPress = async ({ id, color }) => {
  const newQuantity = +(document.getElementById(`editItem-${JSON.stringify({ id, color })}`).value)
  removeItemFromCart({ id, color })
  const cart = addItemToCart({ id, color, quantity: newQuantity })

  domPrintTotals(await craftProducts({ cart }))
}

// +++++++++++ HELPERS +++++++++++
const removeItemFromCart = (item) => {
  const oldCart = JSON.parse(localStorage.getItem('cart') || '[]')
  const newCart = _.reject(oldCart, item)

  localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}
// from product.js, do not touch here
const addItemToCart = ({
  id,
  color,
  quantity,
}) => {
  let newCart = []
  const oldCart = JSON.parse(localStorage.getItem('cart') || '[]')
  const alreadyAddedItem = _.find(oldCart, { id, color })

  if (!quantity) {
    newCart = oldCart
  }
  if (alreadyAddedItem) {
    newCart = ([
      ..._.reject(oldCart, alreadyAddedItem),
      {
        id,
        color,
        quantity: +quantity + +alreadyAddedItem.quantity
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

const craftProducts = async ({ cart }) => {
  const products = await Promise.all(cart.map(async ({
    id,
    color,
    quantity,
  }) => {
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
const calculateTotalQuantity = (products) => products.reduce(
  (accu, { quantity }) => accu + +quantity,
  0,
)
const calculateTotalPrice = (products) => products.reduce(
  (accu, { quantity, price }) => accu + (+price * +quantity),
  0,
)

const getProduct = async ({ productId }) => {
  const response = await fetch(`http://localhost:3000/api/products/${productId}`)
  return response.json()
}

// +++++++++++ DOM +++++++++++
const domRenderItem = (populatedItem) => {
  const domcart__items = document.getElementById('cart__items')
  domcart__items.appendChild(
    domCreateProduct(populatedItem)
  )
}

const domPrintTotals = (products) => {
  domPrint('totalQuantity', calculateTotalQuantity(products))
  domPrint('totalPrice', calculateTotalPrice(products))
}

const domPrint = (domElementId, innerHTMLString) => {
  const domElement = document.getElementById(domElementId)
  domElement.innerHTML = innerHTMLString
}

const domRemoveItem = ({ id, color }) => {
  const domArticle = document.getElementById(`article-${JSON.stringify({ id, color })}`)
  domArticle.remove()
}

const domAddEventListeners = (cart) => {
  cart.forEach(({
    id,
    color,
    quantity,
  }) => {
    const domDeleteItem = document.getElementById(`deleteItem-${JSON.stringify({ id, color })}`)
    domDeleteItem.addEventListener('click', () => onDeleteItemPress({ id, color }))

    const domEditItem = document.getElementById(`editItem-${JSON.stringify({ id, color })}`)
    domEditItem.addEventListener('click', () => onEditItemPress({ id, color, quantity }))
  })
}


// Generates this :
// <article class="cart__item" data-id="{product-ID}" data-color="{product-color}" id=${JSON.stringify({ id, color })}>
//   <div class="cart__item__img">
//     <img src="../images/product01.jpg" alt="Photographie d'un canapé">
//   </div>
//   <div class="cart__item__content">
//     <div class="cart__item__content__description">
//       <h2>Nom du produit</h2>
//       <p>Vert</p>
//       <p>42,00 €</p>
//     </div>
//     <div class="cart__item__content__settings">
//       <div class="cart__item__content__settings__quantity">
//         <p>Qté : </p>
//         <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
//       </div>
//       <div class="cart__item__content__settings__delete">
//         <p class="deleteItem" id="deleteItem">Supprimer</p>
//       </div>
//     </div>
//   </div>
// </article>
const domCreateProduct = ({
  colors,
  _id,
  name,
  price,
  imageUrl,
  description,
  altTxt,
  id,
  color,
  quantity,
} = {}) => {
var e_0 = document.createElement("article");
e_0.setAttribute("class", "cart__item");
e_0.setAttribute("data-id", id);
e_0.setAttribute("data-color", color);
e_0.setAttribute("id", `article-${JSON.stringify({ id, color })}`);
var e_1 = document.createElement("div");
e_1.setAttribute("class", "cart__item__img");
var e_2 = document.createElement("img");
e_2.setAttribute("src", imageUrl);
e_2.setAttribute("alt", altTxt);
e_1.appendChild(e_2);
e_0.appendChild(e_1);
var e_3 = document.createElement("div");
e_3.setAttribute("class", "cart__item__content");
var e_4 = document.createElement("div");
e_4.setAttribute("class", "cart__item__content__description");
var e_5 = document.createElement("h2");
e_5.appendChild(document.createTextNode(name));
e_4.appendChild(e_5);
var e_6 = document.createElement("p");
e_6.appendChild(document.createTextNode(color));
e_4.appendChild(e_6);
var e_7 = document.createElement("p");
e_7.appendChild(document.createTextNode(price));
e_4.appendChild(e_7);
e_3.appendChild(e_4);
var e_8 = document.createElement("div");
e_8.setAttribute("class", "cart__item__content__settings");
var e_9 = document.createElement("div");
e_9.setAttribute("class", "cart__item__content__settings__quantity");
var e_10 = document.createElement("p");
e_10.appendChild(document.createTextNode("Qté : "));
e_9.appendChild(e_10);
var e_11 = document.createElement("input");
e_11.setAttribute("id", `editItem-${JSON.stringify({ id, color })}`);
e_11.setAttribute("type", "number");
e_11.setAttribute("class", "itemQuantity");
e_11.setAttribute("name", "itemQuantity");
e_11.setAttribute("min", "1");
e_11.setAttribute("max", "100");
e_11.setAttribute("value", quantity);
e_9.appendChild(e_11);
e_8.appendChild(e_9);
var e_12 = document.createElement("div");
e_12.setAttribute("class", "cart__item__content__settings__delete");
var e_13 = document.createElement("p");
e_13.setAttribute("class", "deleteItem");
e_13.setAttribute("id", `deleteItem-${JSON.stringify({ id, color })}`);
e_13.appendChild(document.createTextNode("Supprimer"));
e_12.appendChild(e_13);
e_8.appendChild(e_12);
e_3.appendChild(e_8);
e_0.appendChild(e_3);
return e_0;
}

// ++++ TO PASTE IN CONSOLE TO MIGRATE localStorage when developing in local
// const localStorageCart = JSON.parse(localStorage.getItem('cart'))
// if (!localStorageCart.length) {
//   newCart = [{"id":"77711f0e466b4ddf953f677d30b0efc9","color":"Navy","quantity":14},{"id":"77711f0e466b4ddf953f677d30b0efc9","color":"Grey","quantity":15},{"id":"a557292fe5814ea2b15c6ef4bd73ed83","color":"Pink","quantity":"1"}]
//   localStorage.setItem('cart', JSON.stringify(newCart))
// }
// THEN REFRESH
