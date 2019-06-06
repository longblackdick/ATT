/**
 * model User: 仅仅是把操作函数包装起来，并没有真正使用类的其他东西
 * 使用class而不是对象的方式仅仅是因为我更喜欢
 */
const mysql = require('mysql');
const dbConfig = require('../config/database');
// const dbConfig = require('config').get('app.dbConfig');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;
