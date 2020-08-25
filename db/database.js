// Configuring the database
//const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var common = require('../common');
var config = common.config();

mongoose.Promise = global.Promise;

module.exports.dbStart=()=>{
  mongoose.connect(config.dbconfig, {
        useNewUrlParser: true
    }).then(() => {
        console.log("Successfully connected to the database");    
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
}