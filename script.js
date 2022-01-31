const autoCompleteInputTag = document.querySelector(".autoCompleteInput");
const resultContainerTag = document.querySelector(".resultContainer");
const cartContainerTag = document.querySelector(".cartContainer");

let products; // []products from fetched-api
const url = "https://fakestoreapi.com/products";
fetch(url)
  .then((response) => {
    const responseData = response.json();
    return responseData;
  })
  .then((fetchedProducts) => {
    products = fetchedProducts;
    autoCompleteInputTag.disabled = false;
  })
  .catch((err) => {
    console.error("ERROR:", err); // error string
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
    const enteredProduct = selectProduct(indexToSelect);
    console.log("Entered product: ", enteredProduct);
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
  const productToDeselect = document.getElementsByClassName("selected")[0];
  if (productToDeselect) {
    return productToDeselect.classList.remove("selected");
  }
};

const createEnteredProduct = () => {
  products.forEach((product) => {
    // const productId = product.id;
    const title = product.title;
    const image = product.image;

    const productCartTag = `
  <div class="enteredProductContainer">
    <img class="cartImg" src=${image}>
    <div class="cartInfo">
      <div class="cartTitle">${title}</div>
    </div>
  </div>`;

    cartContainerTag.innerHTML += productCartTag;
  });
};
