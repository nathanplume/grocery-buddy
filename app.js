// select items \\
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.querySelector('#grocery')
const submit = document.querySelector('.grocery-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

//edit option \\
let editElement
let editFlag = false
let editId = ''

// event listeners \\
// submit item to form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
// load items - local storage
window.addEventListener('DOMContentLoaded', setupItems)

// functions \\
function addItem(e) {
  e.preventDefault()
  const value = grocery.value
  // generating unique number for id
  const id = new Date().getTime().toString()
  //   console.log(id)
  if (value && !editFlag) {
    // creates and appends list item to dom
    createListItem(id, value)
    // alert
    displayAlert('item added to the list', 'success')
    // add to local storage
    addtoLocalStorage(id, value)
    setBackToDefault()
  } else if (value && editFlag) {
    console.log('editing')
    editElement.innerHTML = value
    displayAlert('Item edited', 'success')
    // edit local storage
    editLocalStorage(editId, value)
    setBackToDefault()
  } else {
    displayAlert('Please enter a value', 'danger')
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(() => {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1000)
}

// delete ALL function
function clearItems() {
  const items = document.querySelectorAll('.grocery-item')
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item)
    })
  }
  displayAlert('Items removed from the list', 'danger')
  setBackToDefault()
  localStorage.removeItem('list')
}

// delete single item function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  // console.log(e.currentTarget.parentElement.parentElement)
  list.removeChild(element)
  displayAlert('item removed', 'danger')
  setBackToDefault()
  // remove from local storage
  removeFromLocalStorage(id)
}

// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling
  // set form value
  grocery.value = editElement.innerHTML
  editFlag = true
  editId = element.dataset.id
}

// set back to default
function setBackToDefault() {
  grocery.value = ''
  editFlag = false
  editId = ''
}

// local storage \\
function addtoLocalStorage(id, value) {
  const grocery = { id, value }
  let items = getLocalStorage()
  // console.log(items)
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage()
  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStorage(id, value) {
  let items = getLocalStorage()
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function setupItems() {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value)
    })
  }
}

function createListItem(id, value) {
  const element = document.createElement('article')
  element.classList.add('grocery-item')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fa-solid fa-pen"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`
  // delete & edit button event listeners
  const deleteBtn = element.querySelector('.delete-btn')
  const editBtn = element.querySelector('.edit-btn')
  deleteBtn.addEventListener('click', deleteItem)
  editBtn.addEventListener('click', editItem)

  list.appendChild(element)
}
