const UserModel = require('../db/db-model/user.model');
const unirest = require('unirest');
var common = require('../common');
var config = common.config();
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
    })
    const UserModelForSignUp = new UserModel.users({
        fName: req.body.fName,
        lName: req.body.lName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        roles: req.body.roles,
        isVerified: req.body.isVerified,
        password: req.body.password,
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires: req.body.passwordResetExpires
    });

    // Save Note in the database
    UserModelForSignUp.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

loginUser = (req, res) => {
    validateField(req.body.phoneNumber);
    UserModel.users.findOne({ phoneNumber: req.body.phoneNumber }).then((user) => {
        if (user) {
            return res.status(200).send({ user });
        } else {
            /* Token will expire in 1 min */
            let token = getOtpForUser(); 
            let tokenModel = new UserModel.toeken({ _userId: req.body.phoneNumber, 
            token: token });
            tokenModel.save().then((tokenId)=>{
                getOneTimeOTP(tokenId._userId,tokenId.token).then((response) => {
                    res.status(200).send({response, isUserRegisted: false});
                 }).catch((error)=>{
                    res.status(500).send({error:`Token is already sent to you if you don't got please try with resend OTP.`})
                  })
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
                res.send({ isUserExist: false });
            } else {
                if (user.password == newUser.password) {
                    res.send({ isUserExist: true, authenticated: true });
                } else {
                    res.status(500).send({
                        isUserExist: true,
                        authenticated: false,
                        errorMessage: 'Password you entered is incorrect. Please try again.'
                    });
                }
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
            res.send({ error: err });
        });
}

validateField=(fieldName)=>{
    if (!fieldName) {
        return res.status(400).send({ error: "Phone Number required." })
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
verifyPasswordUser = (req, res) => {
    var newUser = {};
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.password = req.body.password;
    UserModel.users.findOne({ phoneNumber: newUser.phoneNumber })
        .then(user => {
            if (!user) {
                res.send({ isUserExist: false });
            } else {
                if (user.password == newUser.password) {
                    res.send({ isUserExist: true, authenticated: true });
                } else {
                    res.status(500).send({
                        isUserExist: true,
                        authenticated: false,
                        errorMessage: 'Password you entered is incorrect. Please try again.'
                    });
                }
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
            res.send({ error: err });
        });
}



updateUserAdress=(req,res)=>{
    validateField(req.body.phoneNumber);
    UserModel.users.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber}, 
            { $push: {  adress:{
                         AdressLine1:"sourabh",
                         Adess_Line2 : "Nehru Nagar",
                         LandMark:"Oyo hotel bhopal",
                         City:"Bhopal",
                         State:"Madhya Predesh",
                         PinCode: 462016  
                    }
                },
            },
            {new: true}  
            ).then((updatedrecord)=>{
                if(req.body.isdefault){
                    var setDefaultAdressForUser = new UserModel.usersAdress
                    ({ _userId: updatedrecord._id, defaultAdressId:updatedrecord.adress[updatedrecord.adress.length-1]._id});
                     setDefaultAdressForUser.save()
                     .then((defaultAdress)=>{
                              return res.send({updatedrecord: updatedrecord, defaultAdressId: defaultAdress });
                      }).catch((err)=>{
                        return res.status(500).send({err});
                      });
                }else{
                    return res.send({ updatedrecord });
                }

            }).catch((err)=>{
              return res.status(500).send({err});
            })
};

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
    edituserAdress:updateUserAdress,
    //edituserProfile:updateUserProfle 
}
