const config = require('../config/attgame');
const Card = require('../models/Card');
const CardGroup = require('../models/CardGroup');

/**
 * @description 创建一个扑克牌组，存放所有扑克
 */
const pokers = [];
for (let i = 0; i < 5; i += 1) {
  if (i === config.type.JOKER) {
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
 * 把牌组的指数数组，从要保留的随机转换为完整的
 * @param {number[]} origin 保留的牌组
 * @return {Card[]} 完整牌组的指数数组
 * @example origin[12, undefined, 24, 34, undefined] => result[12, 35, 24, 34, 51]
 */
const randomCards = (origin = new Array(5).fill(undefined)) => {
  const result = [];
  for (let i = 0; i < origin.length; i += 1) {
    let id = origin[i];
    if (id) {
      // 如果id不为空，直接赋值
      result[i] = id;
    } else {
      // 如果id为空，摇号 -> 判断是否在origin中 -> 赋值
      while (!id) {
        id = Math.floor(Math.random() * 54);
        if (origin.includes(id) || result.includes(id)) {
          id = undefined;
        } else {
          result[i] = id;
        }
      }
    }
  }
  return result;
};

/**
 * 将卡组指数数组转为CardGroup类型
 * @param {Number[]} indexes 卡组的下标
 * @return {CardGroup} cardGroup 中存放了cards和 result
 */
const getCardGroup = (indexes) => {
  const cards = [];
  indexes.forEach((id) => {
    cards.push(pokers[id]);
  });
  const cardGroup = new CardGroup(cards);
  return cardGroup;
};

/**
 * 计算赢得的金币
 * @param {number} coin 下注金额
 * @param {string} result 随机牌的结果
 * @return {number}
 */
const settlement = (coin, result) => {
  let winCoin = 0;
  switch (result) {
    case '5K':
      winCoin = coin * config.winRates['5K'];
      break;
    case 'RS':
      winCoin = coin * config.winRates.RS;
      break;
    case 'SF':
      winCoin = coin * config.winRates.SF;
      break;
    case '4K':
      winCoin = coin * config.winRates['4K'];
      break;
    case 'FH':
      winCoin = coin * config.winRates.FH;
      break;
    case 'FL':
      winCoin = coin * config.winRates.FL;
      break;
    case 'ST':
      winCoin = coin * config.winRates.ST;
      break;
    case '3K':
      winCoin = coin * config.winRates['3K'];
      break;
    case '2P':
      winCoin = coin * config.winRates['2P'];
      break;
    case '1P':
      winCoin = coin * config.winRates['1P'];
      break;
    default:
      winCoin = 0;
  }
  return winCoin;
};


/**
 * 获取牌组的指数数组
 * @param {Number[]} pourCardsIndex 牌组的指数数组
 * @param {Number[]} keep 要保留牌的指数
 * @return {Number[]} 新获得的牌组的指数数组
 * @example [11,15,25,34,46], [1, 2, 4] => [3,15,25,30,46]
 */
const getCardsIndex = (pourCardsIndex = [], keep = []) => {
  // 换牌
  if (pourCardsIndex.length === 0) {
    return randomCards();
  }
  let tempKeep = keep;
  if (!tempKeep) {
    tempKeep = [];
  }
  const temp = []; // 暂存卡牌的编号
  for (let i = 0; i < 5; i += 1) {
    if (keep.includes(i)) {
      temp.push(pourCardsIndex[i]);
    } else {
      temp.push(undefined);
    }
  }
  return randomCards(temp);
};

/**
 * 由开组的指数数组，得到卡组的数据，包括牌组和结果
 * @param {Number[]} cardsIndex 牌组的指数数据
 * @return 卡牌和结果 {cards, result}
 * @example [3,15,25,30,46] => {cards, result}
 */
const getCards = (cardsIndex) => {
  const cardGroup = getCardGroup(cardsIndex);
  const { cards } = cardGroup;
  const result = cardGroup.judge();
  return {
    cards,
    result,
  };
};

module.exports = {
  getCardsIndex,
  getCards,
  settlement,
};
