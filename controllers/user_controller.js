var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var con = mysql.createPool({
  host: "127.0.0.1",
  connectionLimit : 100,
  user: "root",
  password: "",
  database: "test"
});

exports.login=function(req,res){
    if(req.method == "POST"){
      var uname = req.body.username;
      var pass= req.body.password;
      var uname_err,pass_err;
          var sql = "SELECT * FROM `users` WHERE username=?";
          var query = con.query(sql,[uname] ,function(err, result) {
            if(err)
              res.send("Error");
            else if(result){
                console.log('Login la \n'+result);
                var db_pass=result[0].password;
                bcrypt.compare(pass,db_pass,function(err,same){
                  var jwt_id=result[0].id+""+Date.now();
                  if(same)
                  {
                    res.cookie('AuthToken',jwt.sign({id:jwt_id ,username: result[0].username,name: result[0].name,}, "MySuperSecretKey"), { maxAge: 900000, httpOnly: true })
                    res.redirect('/dashboard')
                  }
                  else
                  {
                    res.render('home',{log_err:'Wrong Password'});
                  }

                });
                
            }
            else
            {
              res.render('home',{log_err:'Username Invalid'});
            }
        
            });
  }
};
exports.register=function(req , res){
        if(req.method == "POST"){
            var name  = req.body.name;
            var uname = req.body.username;
            var pass= req.body.password;
            var conpass= req.body.repassword;
            var email  = req.body.email;
            var name_err,uname_err,pass_err,conpass_err,email_err;
            var letters = /^[A-Za-z]+$/;
            if(!(letters.test(name)&&(name.length>4)))
              name_err="Invalid or short name";
            chkUsr(name,function(exists){
              if(exists==true)
                uname_err="Username already exists";
            });
            if(pass.length<8)
              pass_err="Small Password";
            if(pass!=conpass)
              conpass_err="Passwords not matched";
              if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
                email_err="Invalid email";
            if(name_err==undefined && uname_err==undefined && pass_err==undefined && conpass_err==undefined && email_err==undefined )   
            {
              bcrypt.hash(pass, 5, function( err, bcryptedPassword){
              var sql = "INSERT INTO `users`(`name`,`username`, `password`,`email` ) VALUES (?,?,?,?)";
              var query = con.query(sql, [name,uname,bcryptedPassword,email],function(err, result) {
                if(!err)
                res.render('home',{message:'You are successfully registered!'});
                else
                {
                  res.send('Error');
                  console.log(err);
                }
                });   
              });
            }
            else
            {
              res.render('home',{name_err:name_err,
                uname_err:uname_err,
                pass_err:pass_err,
                conpass_err:conpass_err,
                email_err:email_err
              });
              
            }
            }
    }; 

exports.loginRequired=function(req,res, next){
  if(req.user)
    return next()
  
  return res.redirect('/home')
    
};
exports.loggedIn=function(req,res, next){
  if(req.user)
    return res.redirect('/home')
  
    return next()
  
    
};
function chkUsr(name, fn)
{
    var reslt;
    var sql = "SELECT * FROM `users` WHERE username = ?";
    var query = con.query(sql, [name], function(err, result,fields) {
      if(!err)
      {  if(result.length>0)
          reslt=true;
        else
        reslt=false
      }
      else
      {
        console.log(err);
      } 
    fn(reslt)
    });
    
}
function chkEmail(email, fn)
{
    var reslt;
    var sql = "SELECT * FROM `users` WHERE email = ?";
  
    var query = con.query(sql, [email], function(err, result,fields) {
      if(!err)
      {  if(result.length>0)
         {
             reslt=true;
  
         }
        else
        {
        reslt=false
  
      }
      }
      else
      {
        console.log(err);
      } 
    fn(reslt)
    });
    
}

exports.checkUser=function(req,res){ 
    var name=req.params.name;
    chkUsr(name,function(exists){
      res.json({exists: exists})
    });
          };

exports.checkEmail=function(req,res){ 
  var email=req.params.email;
  chkEmail(email,function(exists){    
    res.json({exists: exists})
  });
    };
