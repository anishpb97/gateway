var mysql = require('mysql');
var cookie = require('cookie');

var con = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    connectionLimit : 100,
    password: "",
    database: "test"
  });
  
exports.show = function(req, res) {
    var uname=req.user.username;
    var sql = "SELECT * FROM `users` WHERE username=?";
    //console.log(uname);
    var query = con.query(sql,[uname] ,function(err, result) {
        if(err){
            console.log(err);
            res.send('Summa oru O/P');
        } 
        else{
            if(result);
              {
                res.render('dashboard',
                 {
                     username:result[0].username,
                     name:result[0].name,
                     email:result[0].email
                });
            }
            
        }
    });
    
  };
  exports.logout = function(req, res) {
    var token = req.cookies.AuthToken;
    if(token){
        res.clearCookie('AuthToken');
    }
   res.redirect('/');
   };