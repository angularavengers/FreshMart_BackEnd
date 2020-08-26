const UserModel = require('../db/db-model/user.model');
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
    validateField(res.body.phoneNumber);

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
    validateField(res.body.phoneNumber);
    UserModel.users.findOne({ phoneNumber: req.body.phoneNumber }).then((user) => {
        if (user) {
            return res.status(200).send({ user });
        } else {
            return res.status(500).send({
                isUserRegisted: false,
                errorMessage: 'Mobile number you entered is not registered. Please sign up.'
            })
        }
    }).catch((error) => {
        return res.status(500).send({
            message: { error }
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

updateUserProfile=(req,res)=>{
    validateField(req.body.phoneNumber);
    userModel.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber}, 
            { $push: { adressDetails: {
                         AdressLine1:"sourabh",
                         Adess_Line2 : "Pallavi Nagar",
                         LandMark:"Oyo hotel bhopal",
                         City:"Bhopal",
                         State:"Madhya Predesh",
                         PinCode: 462016,
                         isdefault: true  
                    }
                }
            })
};


module.exports = {
    findAllUser: findAll,
    login: loginUser,
    signUp: createUser,
    verifyUser: verifyPasswordUser
}


// sendAuthyTokenForLogin = (req, res) => {
//     // Validate request
//     if (!req.body.phone) {
//         return res.status(400).send({
//             message: { test: 'aaa' }
//         });
//     }

//     User.findOne({ phone: req.body.phone }).then(user => {
//         if (user) {
//             smsClient(req, res)
//                 .then(function (response) {
//                     return res.status(400).send({
//                         message: { response }
//                     });
//                 })
//                 .catch(function (error) {
//                     return res.status(400).send({
//                         message: { error }
//                     });
//                 })
//         } else {
//             token = authenticator.generateSecret()
//             return res.status(200).send({
//                 message: { token}
//             });
//             // /* send OTP code will go here*/
//             // smsClient(req, res)
//             //     .then(function (response) {
//             //         secret = 4545;
//             //         token = authenticator.generate(secret);
//             //         return res.status(400).send({
//             //             message: { response }
//             //         });
//             //     })
//             //     .catch(function (error) {
//             //         return res.status(400).send({
//             //             message: { error }
//             //         });
//             //     })
//         }
//     })
// };

// VerifyTokenForLogin = (req, res) => {
//     // Validate request
//     if (!req.body.token) {
//         return res.status(400).send({
//             message: { error: 'No token provided' }
//         });
//     };
//     try {
//         clientToken = req.body.token;
//         const isValid = authenticator.totp.verify({token:clientToken}, secret);
//         console.log("token is " + isValid);
//         return res.status(200).send({
//             message: {isValid, secret, authenticator,clientToken}
//         })
//     } catch (err) {
//         console.log("token is 1234" );
//         return res.status(200).send({
//             message: { isVerified: 'false',err }
//         })
//     }
// };

