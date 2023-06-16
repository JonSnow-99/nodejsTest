var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql2 = require('mysql2');
var crypto = require('crypto');
const salt = crypto.randomBytes(128).toString('base64');


/* 데이터베이스 셋팅 */
var connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nbis2023',
    port: '3306,',
    database: 'mysql'
});

connection.connect();

router.get('/', async function (req, res){
    if(req.cookies.user){
        res.render('signUp.ejs', {cookie : req.cookies.user});
    }else{
        res.render('signUp.ejs', {cookie: "false"});
    }
})



router.post('/', async function (req, res, next){
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.pw;

    const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
    var query = "SELECT userid FROM member where userid='" + id + "';"; // 중복처리 쿼리
    connection.query(query, function (err, rows){
        if(rows.length == 0) { //연결완료 및 중복없는 경우
            var sql = {
                    email: email,
                    userid: id,
                    password: password,
                    salt: salt
            };
            
            var query = connection.query('insert into member set ?', sql, function (err, rows){
                if(err) throw err;
                else{
                    res.send("연결성공!!!");
                }
            });
        }else{
            // 중복알림
            res.send("중복ID 입니다.");
        }
    });
})
module.exports = router;