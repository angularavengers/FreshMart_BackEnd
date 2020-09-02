var express = require('express');
var router = express.Router();

/* GET home page. Testing */
router.get('/', function(req, res, next) {
  res.status(200).json("Loadded application..")
});

module.exports = router;
