document.title = "Fake WB";
const root = document.getElementById("root");
const shopItemsHeader = createElement("div", root, "shop__itemsheader");
const header = createElement("span", shopItemsHeader, "h1", null, "Fake WB");
const searchBar = createElement("div", shopItemsHeader, "searchBar");
const inputSearch = createElement("input", searchBar, "input", [
  { name: "placeholder", value: "What should I search?.." },
]);
const btnSearch = createElement("button", searchBar, "btn__search", null, "🔍");
btnSearch.addEventListener("click", search);
const btnBasket = createElement(
  "button",
  shopItemsHeader,
  "btn__basket",
  null,
  "Basket"
);
btnBasket.addEventListener("click", basket);
const modalBasket = createElement("div", root, "modal");
const btnClose = createElement("button", modalBasket, "btn__close", null, "🗙");
btnClose.addEventListener("click", close);

const sliderContainer = createElement("div", root, "slider-container");
const slider = createElement("div", sliderContainer, "slider");
const pathsToImages = [
  "./img/balcony.jpg",
  "./img/bathroom.jpg",
  "./img/kitchen.jpg",
  "./img/livingroom.jpg",
];
const imageElements = pathsToImages.map((pathToImage) => {
  const img = createElement("img", slider, "img");
  img.src = pathToImage;
  return img;
});
const btnPrev = createElement(
  "button",
  sliderContainer,
  "prev-button",
  null,
  "⇐"
);
const btnNext = createElement(
  "button",
  sliderContainer,
  "next-button",
  null,
  "⇒"
);
const shopTitle = createElement("h2", root, "h2", null, "Bestsellers");
const shopProducts = createElement("div", root, "products__container");

let products = [];

fetch("https://661cf03fe7b95ad7fa6ba3aa.mockapi.io/api/fakefwproduct/product")
.then(res => res.json())
.then(productsFromApi => {
    products = productsFromApi;
    products.forEach((product) => {
        createCard(product);
    });
 });


const localStorageKey = "cart";

function createElement(tagName, parent, className, attributes, innerText) {
  const elem = document.createElement(tagName);

  if (className) {
    className.split(" ").forEach((x) => elem.classList.add(x));
  }

  if (attributes) {
    attributes.forEach((attribute) => {
      elem.setAttribute(attribute.name, attribute.value);
    });
  }

  if (innerText) {
    const text = document.createTextNode(innerText);
    elem.append(text);
  }

  if (parent) {
    parent.append(elem);
  }

  return elem;
}

function search() {
  if (!inputSearch.value) {
    return;
  }

  const searchValue = inputSearch.value.toLowerCase();

  const items = shopProducts.querySelectorAll(".shop__cart");

  items.forEach((x, index) => {
    if (!x.textContent.toLowerCase().includes(searchValue)) {
      items[index].classList.add("shop__hide");
    }
  });
}
inputSearch.addEventListener("keypress", function (e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    btnSearch.click();
  }
});
const slides = Array.from(slider.querySelectorAll("img"));
const slideCount = slides.length;
let slideIndex = 0;

btnPrev.addEventListener("click", showPreviousSlide);
btnNext.addEventListener("click", showNextSlide);

function showPreviousSlide() {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  updateSlider();
}

function showNextSlide() {
  slideIndex = (slideIndex + 1) % slideCount;
  updateSlider();
}

function updateSlider() {
  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
    }
  });
}

updateSlider();

function createCard(product) {
  const shopCart = createElement("div", shopProducts, "shop__cart", [
    { name: "id", value: product.id },
  ]);
  const imgCart = createElement("img", shopCart, "img__cart");
  imgCart.src = "./img/balcony.jpg";
  const cartView = createElement("div", shopCart, "cart__view");
  const discount = createElement(
    "span",
    cartView,
    "discount",
    null,
    `${product.discount}%`
  );
  const btnAdd = createElement("button", cartView, "btn__add", null, "🛒");
  btnAdd.addEventListener("click", add);
  const itemInfo = createElement("div", shopCart, "item__info");
  const itemCost = createElement(
    "span",
    itemInfo,
    "cost",
    null,
    createPriceStr(product.fullPrice, product.discount)
  );
  const itemName = createElement(
    "span",
    itemInfo,
    "item__name",
    null,
    product.title
  );
}
function createPriceStr(fullPrice, discount) {
  return `${fullPrice} - ${fullPrice - (fullPrice * discount) / 100}`;
}

const cart = [];

function getCartData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function setCartData(cart) {
  localStorage.setItem(localStorageKey, JSON.stringify(cart));
}

function add(event) {
  const cart = getCartData();

  const id = event.target.parentElement.parentElement.getAttribute("id");
  const elementInCart = cart.find((element) => {
    return element.id === id;
  });

  if (elementInCart) {
    elementInCart.count += 1;
  } else {
    cart.push({
      id: id,
      count: 1,
    });
  }

  setCartData(cart);
}
function basket(event) {
  const contents = getCartData();
  mapCartItemsToElements(contents, products);
  openModal();
}
function openModal() {
  const modal = document.getElementsByClassName("modal")?.[0];
  modal.classList.add("opened");
}
function close() {
  closeModal();
}

function closeModal() {
  const modal = document.getElementsByClassName("modal")?.[0];
  modal.classList.remove("opened");
}


function mapCartItemsToElements(contents, products) {
  const container = document.getElementsByClassName("modal")?.[0];

  let cartTotal = 0;
  const tr = createElement("tr", null, "item__list");
  contents.forEach((cartItem) => {
    const { id, count } = cartItem;
    // find appropriate product for the item in the cart by id
    const product = products.find((product) => id === product.id);

    if (product) {
      const price = calculatePrice(product.fullPrice, product.discount);
      const cartListItemData = {
        id: product.id,
        title: product.title,
        discount: product.discount,
        fullPrice: product.fullPrice,
        price,
        count,
      };
      createCartListItem(cartListItemData, tr);

      cartTotal += price * count;
    }
  });

  const totalDiv = createElement("div", null, "item__total", null, cartTotal);
  container.replaceChildren(...[btnClose, tr, totalDiv]);
}

function createCartListItem(data, parent) {
  const td = createElement("td", parent, "item__list", [
    { name: "id", value: data.id },
  ]);
  const itemTitle = createElement("span", td, "item__title", null, data.title);
  const itemPrice = createElement("span", td, "item__price", null, data.price);
  const itemCount = createElement("span", td, "item__count", null, data.count);
}

function calculatePrice(fullPrice, discount) {
  return fullPrice - (fullPrice * discount) / 100;
}
