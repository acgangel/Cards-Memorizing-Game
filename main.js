// 將變數首字母大寫以表示資料不會變動
const Symbols = [
  './assets/club.png', // 黑桃
  './assets/heart.png', // 愛心
  './assets/diamonds.png', // 方塊
  './assets/club.png' // 梅花
]
// 0 - 12：黑桃 1 - 13
// 13 - 25：愛心 1 - 13
// 26 - 38：方塊 1 - 13
// 39 - 51：梅花 1 - 13

// 注意這裡的語法，當物件的屬性與函式/變數名稱相同時，可以省略不寫：
// // 原本的寫法
// const view = {
//   displayCards: function displayCards() { ...  }
// }
// // 省略後的寫法
// const view = {
//   displayCards() { ...  }
// }

const view = {
  // 數字轉換成AJOK
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  // 渲染牌背
  getCardElement(index) {
    return `<div class="card back"></div>`
  },
  // 負責生成卡片內容，包括花色和數字
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)] //向下取整到最接近的整數
    return `
      <div class="card">
        <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
      </div>`
  },
  // 負責選出 #cards 並抽換內容
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join('')
  },
  // 翻牌
  flipCard(card) {
    console.log(card)
    if (card.classList.contains('back')) {
      // 回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(10) // 暫時給定 10
      return
    }
    // 回傳背面
    card.classList.add('back')
    card.innerHTML = null
  }
}

// 建立utility模組來存放專案的工具函式
const utility = {
  // Fisher-Yates Shuffle 洗牌演算法，又名 Knuth-Shuffle
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    // index = number.length - 1 取出最後一項
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        // ES6 的解構賦值語法：交換陣列元素。加上分號是為了把執行語句隔開，避免讀成 Math.floor()[]
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

view.displayCards()

// 為每一個 .card 產生監聽器，總共需要 52 個監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})


