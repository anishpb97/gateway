module.exports = function(app) {

    userController = require('./../controllers/user_controller.js');
    dashboard = require('./../controllers/dashboard_Controller.js');

    app.route('/dashboard').get(userController.loginRequired, dashboard.show);
    app.route('/logout').get(dashboard.logout);
    app.route('/register').post(userController.register);
    app.route('/login').post(userController.login);
    app.route('/checkusername/:name').get(userController.checkUser);
    app.route('/checkemail/:email').get(userController.checkEmail);
    app.route('/').get(userController.loggedIn,goToHome);
    app.route('/home').get(userController.loggedIn,goToHome);
    app.get('*',function(req,res){
        res.render('error',{err:'Sorry Invalid URL'}) });
    
    function goToHome(req,res){
            res.render('home');}
};
