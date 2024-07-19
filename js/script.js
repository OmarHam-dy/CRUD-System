'use strict';

const inputName = document.querySelector('input[id=name]');
const inputCategory = document.querySelector('input[id=category]');
const inputPrice = document.querySelector('input[id=price]');
const inputDescription = document.querySelector('textarea[id=description]');
const inputSearch = document.getElementById('search');
const inputs = [inputName, inputCategory, inputPrice, inputDescription];

const buttonAddUpdate = document.querySelector('button.add-update');
const buttonClear = document.querySelector('button.clear');

const alert = document.querySelector('.alert');
const tableBody = document.querySelector('tbody');
const table = document.querySelector('table');

class Product {
  constructor(
    name = 'Not Defined',
    category = 'Not Defined',
    price = 'Not Defined',
    description = 'Not Defined'
  ) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
  }

  set name(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }

  set category(category) {
    this._category = category;
  }
  get category() {
    return this._category;
  }

  set price(price) {
    this._price = price;
  }
  get price() {
    return this._price;
  }

  set description(description) {
    this._description = description;
  }
  get description() {
    return this._description;
  }
}

const products = [
  new Product('Apple', 'Fruits', '$1', 'Red and delicious'),
  new Product('Carrot', 'Vegetables', '$2', 'Fresh and healthy'),
];

let addStatus;
let currentUpdatedProduct;

// ////////////////////////////////////////////////////////////////////////////////////
// functions

const inputsEmpty = () => inputs.some(input => input.value.trim() == '');

const toggleButtonStatus = function () {
  addStatus = !addStatus;
  buttonAddUpdate.textContent = addStatus ? 'Add' : 'Update';
};

const clearInputs = function () {
  inputs.forEach(input => (input.value = ''));
};

const displayProduct = function (id) {
  currentUpdatedProduct = id;

  // Update table (disable all delete buttons)
  updateTable(products);

  // Display product info
  inputName.value = products[id].name;
  inputCategory.value = products[id].category;
  inputPrice.value = products[id].price;
  inputDescription.value = products[id].description;

  // Change add button label and status
  toggleButtonStatus();
};

const updateAlert = function () {
  if (products.length) {
    alert.style.display = 'none';
    table.style.display = 'table';
    inputSearch.style.display = 'block';
  } else {
    alert.style.display = 'block';
    table.style.display = 'none';
    inputSearch.style.display = 'none';
  }
};

const updateTable = function (products) {
  // Clear the exitsting products
  tableBody.textContent = '';

  products.map(function (product, i) {
    // console.log(currentUpdatedProduct);
    // Create HTML element
    const rowElement = `
    <tr class="border-bottom ${
      currentUpdatedProduct == i ? 'bg-primary-subtle' : ''
    }" data-id='${i}'>
        <td>${i + 1}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td>
          <button type="button" class="update-button btn btn-outline-success" ${
            currentUpdatedProduct != -1 ? 'disabled' : ''
          }>
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
        <td>
          <button type="button" class="delete-button btn btn-outline-danger" ${
            currentUpdatedProduct != -1 ? 'disabled' : ''
          }>
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
    </tr>`;
    // insert the HTML Element
    tableBody.insertAdjacentHTML('beforeend', rowElement);
  });
};

const updateUI = function () {
  updateTable(products);
  updateAlert();
};

const init = function () {
  currentUpdatedProduct = -1;
  addStatus = true;
  updateUI();
};
init();

/* CURD functions */

const readInputs = function () {
  return new Product(
    inputName.value,
    inputCategory.value,
    inputPrice.value,
    inputDescription.value
  );
};

const addProduct = function () {
  if (inputsEmpty()) {
    window.alert('Empty data cannot be added');
    return;
  }

  products.push(readInputs());

  updateUI();
  clearInputs();
};

const updateProduct = function () {
  if (inputsEmpty()) {
    window.alert('Empty data cannot be updated');
    return;
  }
  products[currentUpdatedProduct] = readInputs();
  currentUpdatedProduct = -1;
  updateTable(products);
  toggleButtonStatus();
  clearInputs();
};

const deleteProduct = function (id) {
  swal({
    title: 'Are you sure?',
    text: `Once deleted, you will not be able to recover this product)`,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then(ok => {
    if (ok) {
      swal('The product successfully deleted', {
        icon: 'success',
      });
      products.splice(id, 1);
      updateUI();
    }
  });
};

// Event Listeners

buttonClear.addEventListener('click', clearInputs);

buttonAddUpdate.addEventListener('click', () =>
  addStatus ? addProduct() : updateProduct()
);

tableBody.addEventListener('click', function (e) {
  if (e.target.closest('.update-button')) {
    displayProduct(e.target.closest('tr').dataset.id);
    e.target.closest('tr').classList.add('bg-primary-subtle');
  } else if (e.target.closest('.delete-button')) {
    deleteProduct(e.target.closest('tr').dataset.id);
  }
});

const updateDisplayedProducts = function (e) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(this.value.toLowerCase())
  );
  updateTable(filteredProducts);
};

inputSearch.addEventListener('keyup', updateDisplayedProducts);
