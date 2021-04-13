var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password : 'Cde34rfc',
    database : 'EdgeEmulator'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('MySQL Connected!');
});

module.exports = connection;