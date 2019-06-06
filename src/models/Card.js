
module.exports = class Card {
  /**
     *
     * @param {number} type
     * @param {number} value
     */
  constructor(type, value) {
    this.setType(type);
    this.setValue(value);
    this.relativeURL();
  }

  /**
   *
   * @param {number} type
   */
  setType(type) {
    if (type < 0 || type > 4) {
      // console.log('卡牌类型不合法，设为默认值');
      // throw new Error('the type of card is invalid');
      this.type = 1;
      return;
    }
    this.type = type;
  }

  /**
   *
   * @param {number} value
   */
  setValue(value) {
    if (this.type === 0 && (value < 0 || value > 1)) {
      // console.log('面值输入不合法!改为默认值');
      // throw new Error('the value of card is invalid');
      this.value = 0;
      return;
    }
    if (this.type !== 0 && (value < 2 || value > 14)) {
      // console.log('面值输入不合法!改为默认值');
      // throw new Error('the value of card is invalid');
      this.value = 2;
      return;
    }
    this.value = value;
  }

  /**
   * set relative url
   */
  relativeURL() {
    this.path = `/images/cards/${this.type}/${this.value}.png`;
  }
};
