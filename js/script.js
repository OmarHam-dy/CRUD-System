'use strict';

const inputName = document.querySelector('input[id=name]');
const inputCategory = document.querySelector('input[id=category]');
const inputPrice = document.querySelector('input[id=price]');
const inputDescription = document.querySelector('textarea[id=description]');
const inputs = [inputName, inputCategory, inputPrice, inputDescription];

const buttonAddUpdate = document.querySelector('button.add-update');
const buttonClear = document.querySelector('button.clear');

const alert = document.querySelector('.alert');
const tableBody = document.querySelector('tbody');
const table = document.querySelector('table');

const products = [
  {
    name: 'Apple',
    category: 'Fruits',
    price: '$1',
    description: 'Red and delicious',
  },
  {
    name: 'Carrot',
    category: 'Vegetables',
    price: '$2',
    description: 'Fresh and healthy',
  },
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
  updateTable();

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
  } else {
    alert.style.display = 'block';
    table.style.display = 'none';
  }
};

const updateTable = function () {
  // Clear the exitsting products
  tableBody.textContent = '';

  products.map(function (product, i) {
    console.log(currentUpdatedProduct);
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
  updateTable();
  updateAlert();
};

const init = function () {
  updateUI();
  addStatus = true;
  currentUpdatedProduct = -1;
};
init();

/* CURD functions */

const readInputs = function () {
  return {
    name: inputName.value,
    category: inputCategory.value,
    price: inputPrice.value,
    description: inputDescription.value,
  };
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
  updateTable();
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
