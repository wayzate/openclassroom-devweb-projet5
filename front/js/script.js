// +++++++++++ MAIN +++++++++++
document.addEventListener('DOMContentLoaded', async () => {
  const allProducts = await getAllProducts()

  allProducts.forEach(domRenderProduct)
})

// +++++++++++ HELPERS +++++++++++
const getAllProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products')
  return response.json()
}

// +++++++++++ DOM +++++++++++
const domRenderProduct = (product) => {
  const domItems = document.getElementById('items')
  domItems.appendChild(
    domCreateProduct(product),
  )
}

// Generated automatically here https://html2js.esstudio.site
const domCreateProduct = ({
  colors,
  _id,
  name,
  price,
  imageUrl,
  description,
  altTxt,
}) => {
// EXAMPLE
//   <a href="./product.html?id=42">
//    <article>
//      <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//      <h3 class="productName">Kanap name1</h3>
//      <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//    </article>
//  </a> 
var container = document.createDocumentFragment();
var e_1 = document.createElement("a");
e_1.setAttribute("href", `./product.html?id=${_id}`);
var e_2 = document.createElement("article");
var e_3 = document.createElement("img");
e_3.setAttribute("src", imageUrl);
e_3.setAttribute("alt", altTxt);
e_2.appendChild(e_3);
var e_4 = document.createElement("h3");
e_4.setAttribute("class", "productName");
e_4.appendChild(document.createTextNode(name));
e_2.appendChild(e_4);
var e_5 = document.createElement("p");
e_5.setAttribute("class", "productDescription");
e_5.appendChild(document.createTextNode(description));
e_2.appendChild(e_5);
e_1.appendChild(e_2);
container.appendChild(e_1);
return container;
}
