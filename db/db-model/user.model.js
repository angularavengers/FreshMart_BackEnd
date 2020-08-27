
const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    phoneNumber: { type: String, unique: true, require:true
    },
    email: { type: String, unique: true,require:true},
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: false },
    adress:[{
        AdressLine1:String ,
		    Adess_Line2 : String,
		    LandMark:String,
		    City:String,
		    State:String,
        PinCode:String ,
        isdefault:Boolean
     }],
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date
  })
var UserAdress = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  defaultAdressId: {type: mongoose.Schema.Types.ObjectId},
});  

const tokenSchema = new mongoose.Schema({
    _userId: { type: String , required: true, unique: true,index: true
    },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 150}
},{strict: true});

const UserSchemaT= mongoose.model('users',UserSchema);
const tokenSchemaT= mongoose.model('tokens',tokenSchema);
const UserAdressT= mongoose.model('userAdress',UserAdress);

module.exports = {
   users: UserSchemaT,
   token: tokenSchemaT,
   usersAdress: UserAdressT
}


