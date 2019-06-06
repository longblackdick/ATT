const connection = require('./MySql');


class Rooms {
  /**
   * get rooms (id, name, max_user_coin, min_user_coin, max_pour_coin, min_pour_coin)
   */
  static getRooms(id) {
    return new Promise((resolve, reject) => {
      let sql = 'select * from rooms';
      if (id) {
        sql += ` where id=${id}`;
      }
      connection.query(sql, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}

module.exports = Rooms;
