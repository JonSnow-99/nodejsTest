var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql2 = require('mysql2');
var crypto = require('crypto');
var cookie = require('cookie-parser');
//const { has } = require('cheerio/lib/api/traversing');




// DB셋팅
var connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nbis2023',
    port: '3306',
    database: 'testnodejs'
});


router.get('/', function(req, res) {
    if (req.cookies.user){
        res.render('login.ejs', {cookie : req.cookies.user});
    } else {
        res.render('login.ejs', {cookie: "false"});
    }
});


router.post('/', function (req, res, next){
    var id = req.body.id;
    var pw = req.body.pw;

    var query = "select password from member where userid='" + id + "';"
    console.log(query);
    connection.query(query, function (err, rows){
        console.log('xxxxxx', rows)
        if(err) throw err;
        else{
            if(rows.length == 0) {
                console.log("아이디가 틀렸습니다.");
                res.redirect("/login");
            } else{

//                var salt = rows[0].salt;
                var password = rows[0].password;

                const salt = crypto.randomBytes(128).toString('base64');
                const hashPassword = crypto.createHash('sha512').update(pw).digest('hex');

                console.log(hashPassword, rows[0].password, hashPassword === rows[0].password)
                if(password === hashPassword) {
                    console.log("로그인 성공");
                    res.cookie("user", id, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: true
                    });
                    res.redirect("/");
                } else {
                    console.log("로그인 실패 비밀번호가 다릅니다!!");
                    res.redirect("/login");
                }
            }
        }

    })
})

module.exports = router;
