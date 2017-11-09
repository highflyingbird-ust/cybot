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

exports.insert = (session,n,a,s) => {
    pool.getConnection(function(err, connection) {
        var post = {name: n,age: a, score: s};
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
        console.log(table);
        console.log(session.userData.qid);
        var sql = 'SELECT * FROM '+table;
        connection.query(sql,function (err, result,next) {
          if (err) throw err;
          console.log(JSON.stringify(result));
          session.userData.question = result[session.userData.qid].question;
          session.userData.answer = result[session.userData.qid].answer;
          session.userData.options = result[session.userData.qid].options;
          console.log(session.userData.question);
          connection.release();
          session.endDialog();
        });
    });
} 