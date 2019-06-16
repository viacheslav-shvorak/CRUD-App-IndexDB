import productsdb, {
  bulkCreate,
  getData,
  createElem,
  sortObj
} from './Module.js';

let db = productsdb('Productsdb', {
  products: `++id, name, seller, price`
});

// Input Tags
const userId = document.getElementById('userid');
const productName = document.getElementById('productname');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

// Buttons
const btnCreate = document.getElementById('btn-create');
const btnRead = document.getElementById('btn-read');
const btnUpdate = document.getElementById('btn-update');
const btnDelete = document.getElementById('btn-delete');

//Not found records
const notFound = document.getElementById('notfound');

// Event listerner for create button
btnCreate.onclick = event => {
  // Insert values using create button
  let flag = bulkCreate(db.products, {
    name: productName.value,
    seller: seller.value,
    price: price.value
  })

  productName.value = seller.value = price.value = '';
  getData(db.products, data => {
    userId.value = data.id + 1 || 1;
  });

  readTable();

  let insertmsg = document.querySelector('.insertmsg');
  getMsg(flag, insertmsg);
}

// Event listerner for read button
btnRead.onclick = readTable;

//Update event for update button 
btnUpdate.onclick = () => {
  const id = parseInt(userId.value || 0);

  if (id) {
    db.products.update(id, {
      name: productName.value,
      seller: seller.value,
      price: price.value
    }).then(updated => {
      // let get = updated ? `Data updated!` : `Couldn't update data.`;
      let get = updated ? true : false;

      let updatemsg = document.querySelector('.updatemsg');
      getMsg(get, updatemsg);

      productName.value = seller.value = price.value = '';
    })
  }
}

// Delete event for delete button
btnDelete.onclick = () => {
  db.delete();
  db = productsdb('Productsdb', {
    products: `++id, name, seller, price`
  })
  db.open();
  readTable();
  textId(userId);

  let deletemsg = document.querySelector('.deletemsg');
  getMsg(true, deletemsg)
}

// Window onload event
window.onload = () => {
  textId(userId);
}

function textId(textBoxId) {
  getData(db.products, data => {
    textBoxId.value = data.id + 1 || 1;
  })
}

function readTable() {
  const tbody = document.getElementById('tbody');

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getData(db.products, data => {

    if (data) {
      createElem('tr', tbody, tr => {

        for (const value in data) {
          createElem('td', tr, td => {
            td.textContent = data.price === data[value] ? `$${data[value]}` : data[value];
          })
        }
        createElem('td', tr, td => {
          createElem('i', td, i => {
            i.className += 'fas fa-edit btnedit';
            i.setAttribute(`data-id`, data.id);
            i.onclick = editBtn;
          })
        })
        createElem('td', tr, td => {
          createElem('i', td, i => {
            i.className += 'fas fa-trash-alt btndelete';
            i.setAttribute(`data-id`, data.id);
            i.onclick = deleteBtn;
          })
        })
      })
    } else {
      notFound.textContent = 'No record found in the database!';
    }
  })
};

function editBtn(event) {
  let id = parseInt(event.target.dataset.id);
  // console.log(typeof id);
  db.products.get(id, data => {
    userId.value = data.id || 0;
    productName.value = data.name || '';
    seller.value = data.seller || '';
    price.value = data.price || '';
  })
}

function deleteBtn(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  readTable();
}

// Function message
function getMsg(flag, element) {
  if (flag) {
    element.className += ' movedown';

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}