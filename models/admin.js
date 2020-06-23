const db = require('./data-base');

const initialSkills = [
  {
    "number": "13",
    "text": "Возраст начала занятий на скрипке",
    "key": "age"
  },
  {
    "number": "35",
    "text": "Концертов отыграл",
    "key": "concerts"
  },
  {
    "number": "21",
    "text": "Максимальное число городов в туре",
    "key": "cities"
  },
  {
    "number": "10",
    "text": "Лет на сцене в качестве скрипача",
    "key": "years"
  }
];

const _skillIterator = (data) => (skill) => {
  if (data[skill.key]) {
    return ({ ...skill, number: data[skill.key] })
  }

  return skill;
};

function setSkills(data) {
  const initial = db.read('skills');

  let newSkills;

  if (initial && Array.isArray(initial)) {
    newSkills = initial.map(_skillIterator(data));
  } else {
    newSkills = initialSkills.map(_skillIterator(data));
  }

  db.write('skills', newSkills);
}

function setProduct(src, name, price) {
  const products = db.read('products');

  products.push({ src, name, price });

  db.write('products', products)
}

module.exports = {
  setSkills,
  setProduct
};
