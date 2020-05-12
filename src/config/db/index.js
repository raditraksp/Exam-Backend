const mySql = require('mysql')

const conn = mySql.createConnection({
    user: "mysql_radit",
    password: "Mysql123",
    host: "localhost",
    database: "review_backend",
    port: 3306
})

module.exports = conn