// 放在文件最上方
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

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
  // 數字轉換成A,J,Q,K
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
    return `<div data-index="${index}" class="card back"></div>`
  },
  // 負責生成卡片內容，包括花色和數字
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)] //向下取整到最接近的整數
    return `
        <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
        `
  },
  // 負責選出 #cards 並抽換內容
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  // 翻牌
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        // 回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index)) // HTML回傳是字串，要改成數字
        return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  //改變已配對的卡片底色
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },
  //改變已配對的卡片底色
  renderScore(score) {
    document.querySelector(".score").textContent = `Score: ${score}`
  },
  //改變已配對的卡片底色
  renderTriedTimes(times) {
    document.querySelector(".tried").textContent = `You've tried: ${times} times`
  },
  //配對失敗 閃爍5次
  appendWrongAnimation(...cards) {
    cards.map(card => {
      //為卡片加入 .wrong 類別
      card.classList.add('wrong')
      //用事件監聽器來綁定動畫結束事件 (animationend)，一旦動畫跑完一輪，就把 .wrong 這個 class 拿掉
      card.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true }) //{ once: true }即要求在事件執行一次之後，就要卸載這個監聽器，因為同一張卡片可能會被點錯好幾次，每一次都需要動態地掛上一個新的監聽器，並且用完就要卸載
    })
  },
  //顯示遊戲結束畫面
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div) //display div in front of <header> element
  }
}

const model = {
  revealedCards: [], //revealedCards 是一個暫存牌組

  //檢查使用者翻開的兩張卡片是否相同
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  //增加資料屬性
  score: 0,
  triedTimes: 0
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,  // 加在第一行
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  //依照不同遊戲狀態，做不同的行為
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) { //不是牌背狀態的卡片，代表已被點擊／已配對，若點擊的卡為正面的卡，則跳出function
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:

        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷配對是否成功
        if (model.isRevealedCardsMatched()) {
          // 配對成功
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          // 遊戲是否全數配對完成
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 顯示結束畫面
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards) //配對失敗呼叫 view
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },

  //把 setTimeout() 裡的動作獨立成一個 resetCards 來管理
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
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

controller.generateCards() // 取代 view.displayCards()

// 為每一個 .card 產生監聽器，總共需要 52 個監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card) // 取代 view.flipCard()
  })
})


