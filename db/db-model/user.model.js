
const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    fName: String,
    lName:String,
    phoneNumber: { type: String, unique: true, require:true
    },
    email: { type: String, unique: true,require:true},
    roles: [{ type: 'String' }],
    adress:[{
      isdefault:Boolean,
      adressDetails:{
        AdressLine1:String ,
		    Adess_Line2 : String,
		    LandMark:String,
		    City:String,
		    State:String,
		    PinCode:String 
      }
     }],
    isVerified: { type: Boolean, default: false },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date
  })

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const UserSchemaT= mongoose.model('users',UserSchema);
const tokenSchemaT= mongoose.model('tokens',tokenSchema);

module.exports = {
   users: UserSchemaT,
   Toekns: tokenSchemaT
}

