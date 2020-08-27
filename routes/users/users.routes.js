var express = require('express');
var router = express.Router();

const user = require('../../controllers/user.controller');

/* To get all record  */
router.get('/findAll', ((req, res)=> {
    user.findAllUser(req, res);
}));

/* To initial Login when user enter mobile number this will send OTP if not registed */
router.post('/login', ((req, res)=> {
    user.login(req, res);
})
);

/* Create user and verify too */
router.post('/signup', function(req, res) {
    user.signUp(req, res);
});

/* If Registed user will redirec to login and ask password 
This method will verify user password
*/
router.post('/verifyUser', function(req, res) {
    user.verifyUser(req, res);
    //user.getOTP(req,res);
});
/* This will user for ADD NEW DELIVEY ADDress for user */
router.post('/edituserAdress', function(req, res) {
    user.editProfile(req, res);
});
/* TODO */
router.post('/edituserProfile', function(req, res) {
    user.edituserProfile(req, res);
});


module.exports = router;
