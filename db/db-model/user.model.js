
const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    phoneNumber: { type: String, unique: true, require:true
    },
    email: { type: String, unique: true,require:true},
    roles: [{ type: 'String' }],
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
   toekns: tokenSchemaT
}

