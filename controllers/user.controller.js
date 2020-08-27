const UserModel = require('../db/db-model/user.model');
const axios = require('axios');


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
    if (!req.body.phoneNumber){
        return res.status(400).send({error:"Phone Number required."})
    }

    UserModel.users.findOne({phoneNumber:req.body.phoneNumber}).then((user)=>{
        if (user)  {
            return res.status(200).send({userExist:true});
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
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

loginUser = (req,res)=>{
    if (!req.body.phoneNumber){
        return res.status(400).send({error:"Phone Number required."})
    }    
    UserModel.users.findOne({phoneNumber:req.body.phoneNumber}).then((user)=>{
        if (user)  {
            //return res.status(200).send({user});
            const headers = {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache",
                "authorization": "y9F4vRPqYG0MJj7w3koe8mgLH5hQuUOrztfXDn6dVli1ECaWBco5I9TcMipw0xZ6ueY48navWKfVDhqr"
              }
            axios.post('https://www.fast2sms.com/dev/bulk', {
                "sender_id": "IMPSMS",
                "language": "english",
                "route": "qt",
                "numbers": "9573603051",
                "message": "34794",
                "variables": "{AA}",
                "variables_values": "12345"
              },{headers:headers})
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
            
            }else{
            return  res.status(200).send({ isUserRegisted: false})
        }
        }).catch((error)=> {
        return res.status(500).send({
            message: { error }
        });
        })     
};

verifyPasswordUser=(req,res)=>{
    if (!req.body.phoneNumber){
        return res.status(400).send({error:"Phone Number required."})
    } 
    var newUser = {};
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.password = req.body.password;
    console.log(newUser);
    UserModel.users.findOne({ phoneNumber: newUser.phoneNumber })
    .then(user => {
      if (!user) {
        res.send({isUserExist:false});
      } else {
        if (user.password == newUser.password) {
          res.send({isUserExist:true,authenticated:true});
        } else {
          res.send({isUserExist:true,authenticated:false});
        }
      }
    })
    .catch(err => {
      console.log("Error is ", err.message);
      res.send({error:err});
    });
}

// updateUserProfile=(req,res)=>{
//     userModel.findOneAndUpdate(
//         //     { _id: "5c4c6d0b9f7534365ca53f53"}, 
//         //     { $push: { surveyDetails: {
//         //                     suerveyId:00002,
//         //                     surveyQuestion:[
//         //                         {question:"Question changed",options:["HTML1","Javascript2","Angular2","Java"]}
//         //                 ]
//         //             }
//         //         } }
//}


module.exports = {
    findAllUser: findAll,
    login: loginUser,
    signUp: createUser,
    verifyUser: verifyPasswordUser
}


