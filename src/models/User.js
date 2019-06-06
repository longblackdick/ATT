const hash = require('hash.js');
// const crypto = require('crypto');
const connection = require('./MySql');

// const md5encode = (str) => {
//   const md5 = (crypto.createHash('md5'));
//   md5.update(str);
//   return md5.digest('hex');
// };

/**
 * model User
 */
class User {
  /**
   * set user data
   * @param {User} userData user data
   */
  constructor(userData) {
    this.uid = userData.uid;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.coin = userData.coin;
    this.portrait = userData.portrait;
    this.signature = userData.signature;
    this.state = userData.state;
    this.pwd_salt = userData.pwd_salt;
  }

  /**
   * update data
   * @param {object} userInfo user info
   */
  save() {
    return new Promise((resolve, reject) => {
      // this.find(); // 判断是否已经存在邮箱
      const sql = `update account set coin=${this.coin} where uid=${this.uid}`;
      // const sql = `update account set name='${this.name}', password='${this.password}'`+
      // `email='${this.email}', coin=${this.coin}, portrait='${this.portrait}',`+
      // `signature='${this.signature}', state='${this.state}' where uid=${this.uid}`;
      // 插入
      connection.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 1) {
          return resolve(result);
        }
        return reject(new Error('9955'));
      });
    });
  }

  /**
   * 移除用户
   * @param {number} uid 用户id
   */
  remove() {
    return new Promise(async (resolve) => {
      const delUser = `DELETE FROM account WHERE uid=${this.uid}`;
      connection.query(delUser, (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 1) {
          return resolve(true);
        }
        return resolve(false);
      });
    });
  }

  /**
   * 加密密码
   */
  static encryptPwd(salt, password) {
    const mixedPwd = salt + password;
    const encryptPwd = hash.sha256().update(mixedPwd).digest('hex');
    return encryptPwd;
  }

  /**
   * 返回随机获得的盐值，用于用户密码的组合加密
   * @param {Number} saltLength 盐值的长度
   * @return {String} 得到的字符串
   * @example 10 => afagdsgdsl
   */
  static getSalt(saltLength = 32) {
    let salt = Math.random().toString(32).substring(2);
    while (salt.length !== saltLength) {
      if (salt.length > saltLength) {
        salt = salt.slice(salt.length - saltLength);
      } else {
        salt += Math.random().toString(32).substring(2);
      }
    }
    return salt;
  }

  /**
   * 创建账号
   * @param {object} userInfo 用户信息
   */
  static create(userInfo, defaultCoin = 3000, defaultState = 0) {
    return new Promise((resolve, reject) => {
      if (!userInfo) return reject(new Error('9527'));
      if (!userInfo.name || !userInfo.email || !userInfo.password) return reject(new Error('9527'));
      const { name, email, password } = userInfo;

      const salt = User.getSalt(32);
      const mixedPwd = User.encryptPwd(salt, password);

      const insert = 'INSERT INTO account(name, email, password, coin, state, pwd_salt)'
        + `VALUES('${name}', '${email}', '${mixedPwd}', ${defaultCoin} , ${defaultState}, '${salt}')`;
      connection.query(insert, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 1) {
          return resolve(true);
        }
        return resolve(false);
      });
    });
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email 用户名
   */
  static find(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        return reject(new Error('9530'));
      }
      const sql = `select * from account where email='${email}' limit 1`;
      connection.query(sql, (err, result) => {
        if (err) {
          return reject(err); // 数据库查询错误
        }
        if (result.length === 0) {
          return reject(new Error('9528')); // 没找到
        }
        const user = new User(result[0]);
        return resolve(user);
      });
    });
  }

  /**
   * get user by uid
   * @param {int} uid user id
   */
  static get(uid) {
    return new Promise((resolve, reject) => {
      if (!uid) {
        return reject(new Error('9530'));
      }
      const sql = `select * from account where uid='${uid}' limit 1`;
      connection.query(sql, (err, result) => {
        if (err) {
          return reject(err); // 数据库查询错误
        }
        if (result.length === 0) {
          return reject(new Error('9528')); // 没有账号 // 之前的数据插入错误
        }
        const user = new User(result[0]);
        return resolve(user);
      });
    });
  }

  /**
   * find all
   */
  static findAll() {

  }
}
module.exports = User;
