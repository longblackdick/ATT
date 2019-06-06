const User = require('../models/User');

/**
 * check
 * @param {string} email
 */
function checkEmail(email) {
  const regexp = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!regexp.test(email)) {
    return false;
  }
  return true;
}

/**
 * check
 * @param {string} user
 */
function checkUser(user) {
  const pattern = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
  if (!pattern.test(user)) {
    return false;
  }
  return true;
}

/**
 * check
 * @param {string} password
 */
function checkPassword(password) {
  const pattern = /^\w{6,16}$/;
  if (!pattern.test(password)) {
    return false;
  }
  return true;
}

const checkForm = (email, name, password) => {
  if (!checkEmail(email) || !checkUser(name) || !checkPassword(password)) return false;
  return true;
};

/**
 * 筛选器，过滤掉没有登录的用户
 * @param {Request} req request
 * @param {Response} res response
 * @param {Function} next callback
 */
const filter = (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect('/user/signin');
  } else {
    next();
  }
};

/**
 * 获得 user 对象并包含userData所有数据
 * @param {User} userData user
 * @return {User} user 对象
 */
const exchange = (userData) => {
  const user = new User(userData);
  user.gameStart = userData.gameStart;
  user.gameCards = userData.gameCards; // 游戏分配的卡牌
  user.pourCoin = userData.pourCoin; // 当前下注金币
  return user;
};

/**
 * 包装返回数据
 * @param {Number} code status code
 * @param {String | Object} data data or description
 */
const wrapResData = (code, data) => {
  if (code === 0) return { code, data };
  return { code, desc: data };
};


/**
 * handle error
 * @param {Promise} promise promise对象
 * @return {Array}
 */
const handleError = promise => promise.then(res => [null, res]).catch(err => [err, null]);

module.exports = {
  checkForm,
  filter,
  exchange,
  wrapResData,
  handleError,
};
