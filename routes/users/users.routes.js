var express = require('express');
var router = express.Router();

const user = require('../../controllers/user.controller');

router.get('/findAll', ((req, res)=> {
    user.findAllUser(req, res);
}));

router.post('/login', ((req, res)=> {
    user.login(req, res);
})
);

router.post('/signup', function(req, res) {
    user.signUp(req, res);
});

router.post('/verifyUser', function(req, res) {
    user.verifyUser(req, res);
});

module.exports = router;
