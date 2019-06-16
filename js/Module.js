const productsdb = (dbname, table) => {
  // Create DB
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  return db;
}

// Insert function
const bulkCreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log('Data inserted successfully!');
  } else {
    console.log('Please provide data!');
  }
  return flag;
};

// Check textbox validation
const empty = object => {
  let flag = false;

  for (const value in object) {
    if (object[value] != '' && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }

  return flag;
};

// Get data from DB
const getData = (dbname, fn) => {
  let index = 0;
  let obj = {};

  dbname.count(count => {
    if (count) {
      dbname.each(table => {
        // console.log(table);

        obj = sortObj(table);
        // console.log(obj);
        fn(obj, index++)
      })
    } else {
      fn(0);
    }
  })
}

// Sort object
const sortObj = sortobj => {
  let obj = {};
  obj = {
    id: sortobj.id,
    name: sortobj.name,
    seller: sortobj.seller,
    price: sortobj.price
  }

  return obj;
}

//Create dynamic elements
const createElem = (tagName, appendTo, fn) => {
  const element = document.createElement(tagName);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
}

export default productsdb;
export {
  bulkCreate,
  getData,
  createElem,
  sortObj
};