let mysql = require('mysql2');

let connection;

exports.createConnection = (autoConnect = true) =>
  new Promise((resolve, reject) => {
    try {
      connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'GiaMySql21__',
        database: 'opportunities'
      });

      if (autoConnect) {
        this.connect()
          .then(() => resolve(connection))
          .catch(console.log)
      } else {
        resolve(connection);
      }

    } catch (error) {
      reject(error.message);
    } 
  }) // new Promise()
  

exports.connect = () => new Promise((resolve, reject) => { 
  connection.connect((error) => {
    if (error) {
      reject(error.message);
    }

    resolve(true);

  }); // connection.connect()
}); // exports.connect()


exports.query = (query, values) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function (error, results) {
      if (error) {
        reject(error.message);
      }

      resolve(results);
    }); // connection.query()
  }); // return new Promise()
} // exports.query()
