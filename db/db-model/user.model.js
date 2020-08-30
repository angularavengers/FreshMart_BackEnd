
const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    phoneNumber: { type: String, unique: true, require:true
    },
    email: { type: String, unique: true,require:true},
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: false },
    address:[{
      firstName: String,
      lastName: String,
      addressLine1: String,
      addressLine2: String,
      landMark:String,
      city: String,
      state: String,
      pincode: String,
      phoneNumber:String,
      isDefault: Boolean
     }],
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date
  })
var UserAddress = new mongoose.Schema({
  _userId: { type: String, required: true, ref: 'users' },
  defaultAdressId: {type: mongoose.Schema.Types.ObjectId},
});  

const tokenSchema = new mongoose.Schema({
    _userId: { type: String , required: true, unique: true,index: true
    },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 240}
},{strict: true});

const UserSchemaT= mongoose.model('users',UserSchema);
const tokenSchemaT= mongoose.model('tokens',tokenSchema);
const UserAdressT= mongoose.model('UserAddress',UserAddress);

module.exports = {
   users: UserSchemaT,
   token: tokenSchemaT,
   usersAdress: UserAdressT
}


