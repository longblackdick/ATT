
module.exports = class CardGroup {
  /**
   * initialize the variables
   * @param {Array} cards an array of five card objects
   */
  constructor(cards) {
    // initialize the variable 'cards' firstly
    this.cards = cards;
    this.jokersCount = this.countJokers();
    this.sameCardsCount = this.countSameCards(); // excludes jokers
    this.normalCards = this.getNormalCards();
    this.pairCount = this.getPairCount(); // excludes jokers
  }

  /**
   * @return {string}
   */
  judge() {
    // the order is not allowed to be changed
    if (this.is5k()) return '5K';
    if (this.isRs()) return 'RS';
    if (this.isSf()) return 'SF';
    if (this.is4k()) return '4K';
    if (this.isFh()) return 'FH';
    if (this.isFl()) return 'FL';
    if (this.isSt()) return 'ST';
    if (this.is3k()) return '3K';
    if (this.is2p()) return '2P';
    if (this.is1p()) return '1P';
    return 'NONE';
  }

  /**
   * is five of a kind ?
   * @return {bool}
   */
  is5k() {
    if (this.sameCardsCount + this.jokersCount === 5) {
      return true;
    }
    return false;
  }

  /**
   * is Royal Straight ?
   * @return {bool}
   */
  isRs() {
    if (!this.isSt()) {
      return false;
    }
    const normalArrValue = this.normalCards.map(e => e.value);
    if (normalArrValue.includes(14)) {
      return true;
    } // if Ace is included in array 'this.normalCards'
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
      return false;
    }
    return false;
  }

  /**
   * is four of a kind ?
   * @return {bool}
   */
  is4k() {
    if (this.sameCardsCount + this.jokersCount === 4) {
      return true;
    }
    return false;
  }

  /**
   * is straight flush ?
   * @return {bool}
   */
  isSf() {
    let bonus = false;
    if (this.isSt() && this.isFl()) {
      bonus = true;
    }
    return bonus;
  }

  /**
   * is full house ?
   * @return {bool}
   */
  isFh() {
    if (this.pairCount + this.jokersCount < 2 || this.sameCardsCount < 2) {
      return false;
    }
    if (this.jokersCount === 0) {
      if (this.sameCardsCount === 3) {
        return true;
      }
    } else if (this.jokersCount === 1) {
      if (this.sameCardsCount === 3 || this.pairCount === 2) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  /**
   * is flush ?
   * @return {boolean} is flush ?
   */
  isFl() {
    const { type } = this.normalCards[0];
    for (const card of this.normalCards) {
      if (card.type !== type) {
        return false;
      }
    }
    return true;
  }

  /**
   * is straight ?
   * @return {bool}
   */
  isSt() {
    // TODO
    let jokersNum = this.jokersCount;
    const { normalCards } = this;
    if (normalCards[normalCards.length - 1].value - normalCards[0].value > 4) {
      return false;
    }
    let i = 1;
    for (i = 1; i < normalCards.length; i += 1) {
      if (normalCards[i].value !== normalCards[i - 1].value + 1) {
        // If the value of the current card !== the value of the previous card + 1
        if (normalCards[i].value === normalCards[i - 1].value + 2 && jokersNum >= 1) {
          jokersNum -= 1;
        } else if (normalCards[i].value === normalCards[i - 1].value + 3 && jokersNum === 2) {
          jokersNum -= 2;
        } else {
          break;
        }
      }
    }
    if (i === normalCards.length) {
      return true;
    }
    return false;
  }

  /**
   * is three of a kind ?
   * @return {bool}
   */
  is3k() {
    if (this.sameCardsCount + this.jokersCount === 3) {
      return true;
    }
    return false;
  }

  /**
   * is two pairs ?
   * @return {bool}
   */
  is2p() {
    if (this.pairCount + this.jokersCount >= 2) {
      return true;
    }
    return false;
  }

  /**
   * is one pair ?
   * @return {bool}
   */
  is1p() {
    if (this.pairCount + this.jokersCount === 1) {
      return true;
    }
    return false;
  }

  /**
   * return the number of 'one pair', excludes jokers
   * @return {number}
   */
  getPairCount() {
    const { normalCards } = this;
    let count = 0; // 0 | 1 | 2
    for (let i = 1; i < normalCards.length; i += 1) {
      if (normalCards[i].value === normalCards[i - 1].value) {
        count += 1;
        i += 1;
      }
    }
    return count;
  }

  /**
   * return the number of the cards which have same value, excludes jokers
   * @return {number}
   */
  countSameCards() {
    const normalCards = this.getNormalCards();
    let count = 0; // counter
    let total = 0; // the number of same cards
    for (let i = 0; i < normalCards.length; i += 1) {
      count = 0;
      const val = normalCards[i].value;
      for (let j = i; j < normalCards.length; j += 1) {
        if (normalCards[j].value === val) {
          count += 1;
        } else {
          break;
        }
      }
      if (total < count) {
        total = count;
      }
    }
    return total;
  }

  /**
   * return the number of jokers
   * @return {number}
   */
  countJokers() {
    let count = 0;
    for (const card of this.cards) {
      if (card.type === 0) {
        count += 1;
      }
    }
    return count;
  }

  /**
   * return a array which include all the normal cards
   * @return {array}
   */
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
};
