// localStorage.removeItem('data');

const data = JSON.parse(localStorage.getItem('data')) || {
  score: 0,
  bought: {}
};

let perClick = 1
let clickInterval = 1000
let intervalID = false

const products = {
  autoscore: {
    text: 'Auto Score',
    price: 10,
    maxAmount: 1,
    func: function () {
      intervalID = setInterval(addScore, clickInterval);
    }
  },

  plusone: {
    text: '+1 Score Per Click',
    price: 50,
    maxAmount: 49,
    func: function () {
      perClick += 1;
    }
  },

  minusint: {
    text: '-50ms Auto Score Cooldown',
    price: 100,
    maxAmount: 19,
    func: function () {
      clickInterval -= 50;
      if (intervalID) {
        clearInterval(intervalID); intervalID = false;
        intervalID = setInterval(addScore, clickInterval);
      }
    }
  }
}

function updateScoreDisplay() {
  document.querySelector('p').textContent = `Your score: ${data.score}`;
}

function setScore(newScore) {
  data.score = newScore;
  saveData();
  updateScoreDisplay();
}

function saveData() {
  localStorage.setItem('data', JSON.stringify(data));
}

function addScore() {
  setScore(data.score + perClick);
}

function resetEverything() {
  if (intervalID) {
    clearInterval(intervalID);
    intervalID = false;
  };
  perClick = 1;
  clickInterval = 1000;
  intervalID = false;
  data.bought = {};
  setScore(0);
}

function openPopup() {
  document.querySelector('.popup').style.visibility = 'visible';
}

function closePopup() {
  document.querySelector('.popup').style.visibility = 'hidden';
}

function buyItem(itemName) {
  const product = products[itemName]
  if (data.bought[itemName] >= product.maxAmount) {
    return -1;
  }

  if (data.score < product.price) {
    return 0
  }
  setScore(data.score - product.price)

  data.bought[itemName] = data.bought[itemName] + 1 || 1
  product.func()

  saveData();
  return 1;
}

function handleButtonClick(itemName) {
  const element = document.querySelector('.' + itemName);

  if (element.classList.contains('cooldown')) {
    return;
  };

  const result = buyItem(itemName);
  element.classList.add('cooldown');

  if (result === -1) {
    element.textContent = 'Maximum amount'
  } else if (result === 0) {
    element.textContent = 'Not enough score'
  } else if (result === 1) {
    element.textContent = 'Success'
  } else {
    element.textContent = 'Unknown error'
  }

  setTimeout(function () {
    const product = products[itemName]
    element.textContent = `${product.text}: ${product.price}`
    element.classList.remove('cooldown');
  }, 500)
}

// Add products to sidebar
let html = ''
for (const itemName in products) {
  const product = products[itemName]

  html += `<button class='${itemName}' onclick="
    handleButtonClick('${itemName}')
  ">
  ${product.text}: ${product.price}
  </button>`
}
document.querySelector('.sidebar').innerHTML = html

// Do stuff according to local data
updateScoreDisplay();

for (const key in data.bought) {
  const amount = data.bought[key]
  const func = products[key].func
  for (let i = 0; i < amount; i++) {
    func()
  }
}