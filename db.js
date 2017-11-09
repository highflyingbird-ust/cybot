const mysql = require('mysql2');
var pool = mysql.createPool(
{
    host: 'cybot-ust.mysql.database.azure.com',
    user: 'cybot.admin@cybot-ust',
    password: 'Bot@1234',
    database: 'cybotdb',
    port: 3306,
    ssl: true
});

exports.insert = (session,a) => {
    pool.getConnection(function(err, connection) {
        //session.userData.idqnum = session.userData.idqnum+1; 
        var post  = {name: a};
        connection.query('INSERT INTO stud SET ?',post,function (err, result) {
          if (err) throw err;
          //console.log(JSON.stringify(result));
          connection.release();
        });
    });
} 
exports.select = (session,table) => {
    pool.getConnection(function(err, connection) {
        //session.userData.idqnum = session.userData.idqnum+1; 
        var sql = 'SELECT * FROM'+table;
        connection.query(sql,function (err, result) {
          if (err) throw err;
          //console.log(JSON.stringify(result));
          session.userData.question = result[0].question;
          session.userData.answer = result[0].answer;
          session.userData.options = result[0].options;
          connection.release();
        });
    });
} 