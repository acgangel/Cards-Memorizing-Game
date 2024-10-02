// 將變數首字母大寫以表示資料不會變動
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
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
  // 負責生成卡片內容，包括花色和數字
  getCardElement(index) {
    const number = (index % 13) + 1
    const symbol = Symbols[Math.floor(index / 13)]
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
    rootElement.innerHTML = this.getCardElement()
  }
}
view.displayCards()