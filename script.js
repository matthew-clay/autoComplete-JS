const autoCompleteInputTag = document.querySelector(".autoCompleteInput");
const resultContainerTag = document.querySelector(".resultContainer");
const cartContainerTag = document.querySelector(".cartContainer");

let products; // []products from fetched-api
const url = "https://fakestoreapi.com/products";

const fetchProductFromAPI = async () => {
  const responseData = await fetch(url);
  const returnedProductData = await responseData.json();
  products = returnedProductData;
  autoCompleteInputTag.disabled = false;
};

fetchProductFromAPI().catch((err) => {
  console.error("ERROR:", err);
});

autoCompleteInputTag.value = "";
let filteredProducts = [];
const upArrow = "ArrowUp";
const downArrow = "ArrowDown";
const enterKey = "Enter";

autoCompleteInputTag.addEventListener("keyup", (event) => {
  // keyup event => keyboard က key တွေကို click လိုက်တိုင်း event ကို fire လုပ်ပေးနေမှာပါ အဲ့ဒီ keyboard ကနှိပ်တာကိုရဖို့ event.key နဲ့ရယူနိုင်ပါတယ်။

  const key = event.key;

  if (key === upArrow || key === downArrow || key === enterKey) {
    return navigateAndSelectProduct(key);
  }

  resultContainerTag.innerHTML = "";
  const searchText = event.target.value.toLowerCase();
  if (searchText.length === 0) return;

  filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchText)
  );

  const hasProductsToShow = filteredProducts.length > 0;
  if (hasProductsToShow) {
    return showFilteredProduct();
  }
});

const showFilteredProduct = () => {
  filteredProducts.forEach((filteredProduct) => {
    const filteredProductId = filteredProduct.id;
    const title = filteredProduct.title;
    const image = filteredProduct.image;

    const resultProductTag = `
    <div class="productItemContainer" id="${filteredProductId}">
      <div class="productName">${title}</div>
      <img class="productImage" src=${image}>
    </div>`;

    resultContainerTag.innerHTML += resultProductTag;
  });
};

let indexToSelect = -1; // let -1 as there is no selectedItem.
const navigateAndSelectProduct = (key) => {
  if (key === upArrow) {
    // ArrowUp => Deselect => current selected product/ select -1 index product
    if (indexToSelect === -1) {
      indexToSelect = filteredProducts.length - 1;
      return selectProduct(indexToSelect);
    }
    if (indexToSelect === 0) {
      deselectProduct();
      indexToSelect = filteredProducts.length - 1;
      return selectProduct(indexToSelect);
    }

    indexToSelect -= 1;
    deselectProduct();
    const productItemContainerToSelect = selectProduct(indexToSelect);
    productItemContainerToSelect.classList.add("selected");
  } else if (key === downArrow) {
    // ArrowDown => Select +1 index of product/ Deselect previous product
    if (indexToSelect === filteredProducts.length - 1) {
      indexToSelect = -1;
      return deselectProduct();
    }
    indexToSelect += 1;
    const productItemContainerToSelect = selectProduct(indexToSelect);
    if (indexToSelect > 0) {
      return deselectProduct();
    }

    productItemContainerToSelect.classList.add("selected");
  } else {
    // else => EnterKey => removeTheProductFromResultContainer/ show in cartContainer.
    if (indexToSelect === -1) {
      return console.log(indexToSelect);
    }

    const currentProductItemContainer = filteredProducts[indexToSelect];

    if (currentProductItemContainer === undefined) return;

    enteredProductImage = currentProductItemContainer.image;
    enteredProductTitle = currentProductItemContainer.title;
    enteredProductPrice = currentProductItemContainer.price;

    const removeEnteredProduct = selectProduct(indexToSelect);
    removeEnteredProduct.remove();
    filteredProducts.splice(indexToSelect, 1);

    if (indexToSelect === 0) {
      indexToSelect = -1;
      createEnteredProduct(
        enteredProductImage,
        enteredProductTitle,
        enteredProductPrice
      );

      return;
    }
    indexToSelect -= 1;
    selectProduct(indexToSelect);
    createEnteredProduct(
      enteredProductImage,
      enteredProductTitle,
      enteredProductPrice
    );
  }
};

const selectProduct = (index) => {
  const productIdToSelect = filteredProducts[index].id.toString();

  const productItemContainerToSelect =
    document.getElementById(productIdToSelect);
  productItemContainerToSelect.classList.add("selected");

  return productItemContainerToSelect;
};

const deselectProduct = () => {
  const productToDeselect = document.querySelector(".selected");

  if (productToDeselect) {
    return productToDeselect.classList.remove("selected");
  }
};

const createEnteredProduct = (image, title, price) => {
  const productCartTag = `
  <div class="enteredProductContainer">
    <img class="cartImg" src=${image}>
    <div class="cartInfo">
      <div class="cartTitle">${title}</div>
      <div class="cartPrice">Price: ${price}$</div>
    </div>
  </div>`;

  cartContainerTag.innerHTML += productCartTag;
};
