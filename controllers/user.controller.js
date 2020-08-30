const UserModel = require('../db/db-model/user.model');
const unirest = require('unirest');
var common = require('../common');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var config = common.config();
var ObjectId = require('mongodb').ObjectID;


// Find All Users
findAll = (req, res) => {
    UserModel.users.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

// Creat New User
createUser = (req, res) => {
    validateField(req.body.phoneNumber);
    UserModel.users.findOne({ phoneNumber: req.body.phoneNumber }).then((user) => {
        if (user) {
            return res.status(500).send({ userExist: true });
        }
    });
    /* Checking if token is already exist... */
    verifyOTPUser(req.body.phoneNumber).then(token => {
        console.log(token);
        if (token._userId) {
            saveNewUser(req,res,true,true);
            //res.send({ OptVerified: true,isVerified:true });
        } else {
                res.status(500).send({
                    isVerified: false,
                    OptVerified: false,
                    errorMessage: 'OTP expired.'
                });
            }
        })
    .catch(err => {
        res.status(500).send({ error: "Please try after sometime, we are unable to sign up."});
    });
};

saveNewUser=(req,res, OptVerified, isVerified)=>{
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        // Now we can store the password hash in db.
        const UserModelForSignUp = new UserModel.users({
            fName: req.body.fName,
            lName: req.body.lName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            roles: req.body.roles,
            isVerified: isVerified,
            password: hash,
            passwordResetToken: req.body.passwordResetToken,
            passwordResetExpires: req.body.passwordResetExpires
        });
    
        // Save Note in the database
        UserModelForSignUp.save()
            .then(data => {
                return res.status(200).send({data,OptVerified});
            }).catch(err => {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });

      });
   });
}

loginUser = (req, res) => {
    validateField(req.body.phoneNumber);
    UserModel.users.findOne({ phoneNumber: req.body.phoneNumber }).then((user) => {
        if (user) {
            return res.status(200).send({ user,isUserRegisted: true });
        } else {
            /* Token will expire in 2 min */
            verifyOTPUser(req.body.phoneNumber).then((token)=>{
            if(token==null){
                let token = getOtpForUser(); 
                let tokenModel = new UserModel.token({ _userId: req.body.phoneNumber, 
                token: token });
                tokenModel.save().then((tokenId)=>{
                      getOneTimeOTP(tokenId._userId,tokenId.token).then((response) => {
                        res.status(200).send({response, isUserRegisted: false});
                     }).catch((error)=>{
                       res.status(500).send({error:`Token is already sent to you if you don't got please try with resend OTP.`})
                    })
            })
           }else{
            res.status(200).send({response: "Token is already sent to you please check or click on resent OTP.",
             isUserRegisted: false});
           } 
            }).catch((error)=>{
                /* If already have OTP sent to record will not send other record. */
                return res.status(500).send({error:'Unable to send OTP please try again.' + error})
            })
        }
    }).catch((error) => {
        return res.status(500).send({
            message: { error:'Unable to login please try again.' + error,isUserRegisted: false }
        });
    })
};

verifyPasswordUser = (req, res) => {
    var newUser = {};
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.password = req.body.password;
    UserModel.users.findOne({ phoneNumber: newUser.phoneNumber })
        .then(user => {
            if (!user) {
               return res.send({ isUserExist: false });
            } else {
                // Load hash from the db, which was preivously stored 
                bcrypt.compare(req.body.password, user.password, function(err, response) {
                if (response == true){
                    return res.status(200).send({ isUserExist: true, authenticated: true });
                }else{
                    return res.status(500).send({
                        isUserExist: true,
                        authenticated: false,
                        errorMessage: 'Password you entered is incorrect. Please try again.'
                    });
                } 
              });
            }
        })
        .catch(err => {
            return res.send({ error: err });
        });
}

validateField=(fieldName)=>{
    if (!fieldName) {
        return res.status(400).send({ error:  fieldName + "is required." })
    }
}

/* ToDo for testing - Sourabh  */
getOneTimeOTP=(phoneNumber,token)=>{
  return  unirest
  .post(config.OTPGateWay.clientURL)
  .headers({'authorization': config.OTPGateWay.authToken})
  .send({ 
    "sender_id": "IMPSMS",
    "language": "english",
    "route": "qt",
    "numbers": phoneNumber,
    "message": config.OTPGateWay.templateId,
    "variables": "{AA}",
    "variables_values": token
   })
}
getOtpForUser=()=>{
    // Function to generate OTP 
    /* we can also changes this with alphanumeric or 5-6 digit code -Sourabh */
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

//VerifyOTP...
verifyOTPUser = (phoneNumber) => {
    return UserModel.token.findOne({ _userId: phoneNumber});
}



addUserAddress=(req,res)=>{
    validateField(req.body.phoneNumber);
    UserModel.users.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber}, 
            { $push: {  address:{
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        addressLine1: req.body.addressLine1,
                        addressLine2: req.body.addressLine2,
                        landMark:req.body.landMark,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        phoneNumber:req.body.phoneNumber
                    }
                },
            },
            {new: true}  
            ).then((updatedrecord)=>{
                /* if only first record setting that as a default record*/
                if(updatedrecord.address.length==1){
                    console.log("inside adress");
                        setDefaultAddress = new UserModel.usersAdress({
                            _userId: updatedrecord.phoneNumber,
                            defaultAdressId: updatedrecord.address[updatedrecord.address.length-1]._id 
                        })
                        setDefaultAddress.save().then((updatedItem)=>{
                            return res.status(200).send({updatedItem,updatedrecord})
                        }).catch((err)=>{
                            return res.status(500).send(err);
                        })
                    }
                else{
                    if (req.body.isDefault=="true"){
                        console.log("inside adress method");
                        UserModel.usersAdress.findOneAndUpdate({
                            _userId: updatedrecord.phoneNumber},
                            {$set:{"defaultAdressId":updatedrecord.address[updatedrecord.address.length-1]._id}},
                        {new:true})
                         .then((defaultAdress)=>{
                            return res.send({updatedrecord: updatedrecord, 
                            defaultAdressId: defaultAdress });
                          }).catch((err)=>{
                            return res.status(500).send({err});
                          });
                    }else{
                        console.log("inside result");
                        return res.send({ updatedrecord });
                    }
                }  
            }).catch((err)=>{
              return res.status(500).send({err});
            })
};

updateUserAddress = (req,res)=>{
    validateField(req.body.phoneNumber);
    validateField(req.body.addressId);
    UserModel.users.findOneAndUpdate(
       { phoneNumber: req.body.phoneNumber,
        "address._id": req.body.addressId},
        {$set: {
        "address.$.firstName": req.body.firstName, 
        "address.$.lastName": req.body.lastName,
        "address.$.addressLine1": req.body.addressLine1,
        "address.$.addressLine2": req.body.addressLine2,
        "address.$.landMark": req.body.landMark,
        "address.$.city": req.body.city,
        "address.$.state": req.body.state,
        "address.$.pincode": req.body.pincode,
        "address.$.phoneNumber": req.body.phoneNumber
    }},{new: true}).then((updatedrecord)=>{
        if (req.body.isDefault=="true"){
            console.log(updatedrecord.phoneNumber,req.body.addressId);
                UserModel.usersAdress.findOneAndUpdate({
                    _userId: updatedrecord.phoneNumber
                },
                {$set:{"defaultAdressId":ObjectId(req.body.addressId)}},
                {new:true}
                )
                 .then((defaultAdress)=>{
                          return res.send({updatedrecord: updatedrecord, defaultAddressId: defaultAdress });
                  }).catch((err)=>{
                    return res.status(500).send({err});
                  });
            }else{
                return res.send({ updatedrecord });
            }

        }).catch((err)=>{
          return res.status(500).send({err});
        })
     
}

/* Todo -- Sourabh Will update this when we have UI */
// updateUserProfile=(req,res)=>{
//     validateField(req.body.phoneNumber);
//     updatedUserProfile ={};
//     if(req.body.)
//     UserModel.users.findOneAndUpdate(
//             { phoneNumber: req.body.phoneNumber}, 
//             {$set:},
//             {new: true}  
//             ).then((updatedProfile)=>{
//                 return res.status(200).send({updatedProfile});      
//             }).catch((err)=>{
//               return res.status(500).send({err});
//             })
// };  


module.exports = {
    findAllUser: findAll,
    login: loginUser,
    signUp: createUser,
    verifyUser: verifyPasswordUser,
    addUserAddress:addUserAddress,
    updateUserAddress: updateUserAddress
    //edituserProfile:updateUserProfle 
}
