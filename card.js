const value = {
  BLACK_JOKER: 0, // 小王
  RED_JOKER: 1, // 大王
};

// map
const typeMap = {
  0: 'Joker',
  1: 'Spade',
  2: 'Diamond',
  3: 'Heart',
  4: 'Club',
};

const valueMap = {
  0: 'Black',
  1: 'Red',
};

const winRates = {
  '5K': 750,
  RS: 250,
  SF: 150,
  '4K': 60,
  FH: 10,
  FL: 7,
  ST: 5,
  '3K': 3,
  '2P': 2,
  '1P': 1,
};

// type
const type = {
  JOKER: 0, // 王
  SPADE: 1, // 黑桃
  DIAMOND: 2, // 方片
  HEART: 3, // 红xin
  CLUB: 4, // 梅花
};

const pokersRate = [
  750, 250, 150, 60, 10, 7, 5, 3, 2, 1,
];


class Card {
  constructor(type, value) {
    this.setType(type);
    this.setValue(value);
    this.relativeURL();
  }

  setType(type) {
    if (type < 0 || type > 4) {
      console.log('卡牌类型不合法，设为默认值');
      this.type = 1;
      return;
    }
    this.type = type;
  }

  setValue(value) {
    if (this.type === 0 && (value < 0 || value > 1)) {
      console.log('面值输入不合法!改为默认值');
      this.value = 0;
      return;
    }
    if (this.type !== 0 && (value < 2 || value > 14)) {
      console.log('面值输入不合法!改为默认值');
      this.value = 2;
      return;
    }
    this.value = value;
  }

  relativeURL() {
    this.path = `./images/cards/${this.type}/${this.value}.png`;
  }
};

class CardGroup {
  constructor(cards) {
      this.cards = cards;
      this.jokersCount = this.countJokers();
      this.sameCardsCount = this.countSameCards();
      this.normalCards = this.getNormalCards();
      this.pairCount = this.getPairCount();
  }
  judge() {
      if (this.is5k()) {
          return '5K';
      }
      if (this.isRs()) {
          return 'RS';
      }
      if (this.isSf()) {
          return 'SF';
      }
      if (this.is4k()) {
          return '4K';
      }
      if (this.isFh()) {
          return 'FH';
      }
      if (this.isFl()) {
          return 'FL';
      }
      if (this.isSt()) {
          return 'ST';
      }
      if (this.is3k()) {
          return '3K';
      }
      if (this.is2p()) {
          return '2P';
      }
      if (this.is1p()) {
          return '1P';
      }
      return 'NONE';
  }
  is5k() {
      if (this.sameCardsCount + this.jokersCount === 5) {
          return true;
      }
      return false;
  }
  isRs() {
      if (!this.isSt()) {
          return false;
      }
      const normalArrValue = this.normalCards.map((e) => e.value);
      if (normalArrValue.includes(14)) {
          return true;
      }
      if (this.jokersCount !== 0) {
          let count = 0;
          for (let i = 10; i < 14; i += 1) {
              if (normalArrValue.includes(i)) {
                  count += 1;
              }
          }
          if (count + this.jokersCount === 5) {
              return true;
          }
          else {
              return false;
          }
      }
      else {
          return false;
      }
  }
  is4k() {
      if (this.sameCardsCount + this.jokersCount === 4) {
          return true;
      }
      return false;
  }
  isSf() {
      let bonus = false;
      if (this.isSt() && this.isFl()) {
          bonus = true;
      }
      return bonus;
  }
  isFh() {
      if (this.pairCount + this.jokersCount < 2 || this.sameCardsCount < 2) {
          return false;
      }
      if (this.jokersCount === 0) {
          if (this.sameCardsCount === 3) {
              return true;
          }
      }
      else if (this.jokersCount === 1) {
          if (this.sameCardsCount === 3 || this.pairCount === 2) {
              return true;
          }
      }
      else {
          return true;
      }
      return false;
  }
  isFl() {
      const type = this.normalCards[0].type;
      for (const card of this.normalCards) {
          if (card.type !== type) {
              return false;
          }
      }
      return true;
  }
  isSt() {
      let jokersNum = this.jokersCount;
      const normalCards = this.normalCards;
      if (normalCards[normalCards.length - 1].value - normalCards[0].value > 4) {
          return false;
      }
      let i = 1;
      for (i = 1; i < normalCards.length; i += 1) {
          if (normalCards[i].value === normalCards[i - 1].value + 1) {
              continue;
          }
          if (normalCards[i].value === normalCards[i - 1].value + 2 && jokersNum >= 1) {
              jokersNum -= 1;
          }
          else if (normalCards[i].value === normalCards[i - 1].value + 3 && jokersNum === 2) {
              jokersNum -= 2;
          }
          else {
              break;
          }
      }
      if (i === normalCards.length) {
          return true;
      }
      return false;
  }
  is3k() {
      if (this.sameCardsCount + this.jokersCount === 3) {
          return true;
      }
      return false;
  }
  is2p() {
      if (this.pairCount + this.jokersCount >= 2) {
          return true;
      }
      return false;
  }
  is1p() {
      if (this.pairCount + this.jokersCount === 1) {
          return true;
      }
      return false;
  }
  getPairCount() {
      const normalCards = this.normalCards;
      let count = 0;
      for (let i = 1; i < normalCards.length; i += 1) {
          if (normalCards[i].value === normalCards[i - 1].value) {
              count += 1;
              i += 1;
          }
      }
      return count;
  }
  countSameCards() {
      const normalCards = this.getNormalCards();
      let count = 0;
      let total = 0;
      for (let i = 0; i < normalCards.length; i += 1) {
          count = 0;
          const val = normalCards[i].value;
          for (let j = i; j < normalCards.length; j += 1) {
              if (normalCards[j].value === val) {
                  count += 1;
              }
              else {
                  break;
              }
          }
          if (total < count) {
              total = count;
          }
      }
      return total;
  }
  countJokers() {
      let count = 0;
      for (const card of this.cards) {
          if (card.type === 0) {
              count += 1;
          }
      }
      return count;
  }
  getNormalCards() {
      const normalCards = [];
      for (const card of this.cards) {
          if (card.type !== 0) {
              normalCards.push(card);
          }
      }
      normalCards.sort((a, b) => a.value - b.value);
      return normalCards;
  }
}

/**
 * @description 创建一个扑克牌组，存放所有扑克
 */
const pokers = [];
for (let i = 0; i < 5; i += 1) {
  if (i === type.JOKER) {
    pokers.push(new Card(i, 0));
    pokers.push(new Card(i, 1));
  } else {
    for (let j = 2; j < 15; j += 1) {
      const card = new Card(i, j);
      pokers.push(card);
    }
  }
}

/**
 * @description 随机返回一组卡牌的编号
 * @param {array} origin 保留的牌 undefined or null, [1,null,2,3,null]
 * @return {CardGroup} resultObjects 得到的牌
 */
const randomCards = (origin = new Array(5).fill(undefined)) => {
  const result = [];
  for (let i = 0; i < origin.length; i += 1) {
      let id = origin[i];
      if (id) {
          result[i] = id;
      }
      else {
          while (!id) {
              id = Math.floor(Math.random() * 54);
              if (origin.includes(id) || result.includes(id)) {
                  id = undefined;
              }
              else {
                  result[i] = id;
              }
          }
      }
  }
  return result;
};

/**
 * @description 将卡组下标转为CardGroup类型
 * @param {array} indexes 卡组的下标
 */
function getCardGroup(indexes) {
  const cards = [];
  indexes.forEach((id) => {
    cards.push(pokers[id]);
  });
  // const cards = new CardGroup();
  const cardGroup = new CardGroup(cards);
  return cardGroup;
}

/**
 * @description 结算金币
 * @param {number} pourCoin 下注金额
 * @param {string} result 随机牌的结果
 */
const settlement = (pourCoin, result) => {
  let winCoin = 0;
  switch (result) {
    case '5K':
      winCoin = pourCoin * winRates['5K'];
      break;
    case 'RS':
      winCoin = pourCoin * winRates.RS;
      break;
    case 'SF':
      winCoin = pourCoin * winRates.SF;
      break;
    case '4K':
      winCoin = pourCoin * winRates['4K'];
      break;
    case 'FH':
      winCoin = pourCoin * winRates.FH;
      break;
    case 'FL':
      winCoin = pourCoin * winRates.FL;
      break;
    case 'ST':
      winCoin = pourCoin * winRates.ST;
      break;
    case '3K':
      winCoin = pourCoin * winRates['3K'];
      break;
    case '2P':
      winCoin = pourCoin * winRates['2P'];
      break;
    case '1P':
      winCoin = pourCoin * winRates['1P'];
      break;
    default:
      winCoin = 0;
  }
  return winCoin;
};

module.exports = {
  VALUE: value,
  VALUE_MAP: valueMap,
  TYPE_MAP: typeMap,
  TYPE: type,
  winRates,
  pokersRate,
  getCardGroup,
  settlement,
  randomCards,
  pokers,
};