const mysql = require('mysql2');
var pool = mysql.createPool(
{
    host: 'aditi-admin.mysql.database.azure.com',
    user: 'aditi.admin@aditi-admin',
    password: 'Bot@1234',
    database: 'aditi_dashboard',
    port: 3306,
    ssl: true
});

exports.insert = (session,q,a) => {
    pool.getConnection(function(err, connection) {
        //session.userData.idqnum = session.userData.idqnum+1; 
        var post  = {id: session.userData.id+session.userData.idqnum, question: q,answer: a };
        connection.query('INSERT INTO client_questions SET ?',post,function (err, result) {
          if (err) throw err;
          //console.log(JSON.stringify(result));
          connection.release();
        });
    });
} 
exports.select = (session,table) => {
    var sql = "SELECT * FROM "+table;
    pool.query(sql,function (err, result) {
      if (err) throw err;
      console.log(JSON.stringify(result));
    });
} 