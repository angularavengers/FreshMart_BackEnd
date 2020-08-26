/* Sending Token to Mail ... will keep code and will use later  */
    // // Create a verification token for this user
    // var token = new UserModel.Toekns({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    // // Save the verification token
    // token.save((err,token)=> {
    //     if (err) { return res.status(500).send({ msg: err.message }); }
                
    //     var transporter = nodemailer.createTransport({ 
    //         service: 'gmail',
    //         auth: {
    //             user: 'freshmartbpl@gmail.com' ,
    //             pass:'papaPhoneNumber'
    //         }
    //         // use SSL
    //     });
    //     var mailOptions = { from: 'freshmartbpl@gmail.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
    //     transporter.sendMail(mailOptions, function (err) {
    //        if (err) { return res.status(500).send({ msg: err.message }); }
    //        res.status(200).send('A verification email has been sent to ' + user.email + '.');
    //     });
    // });
/* End  */

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

