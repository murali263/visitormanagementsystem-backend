const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../utilits/token');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();

router.post('/reset', async (req, res) => {

  if (!req.body.email) {
    return res.status(500).json({ message: 'please insert the email' });
  }
  let user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return res.status(400).json({ message: 'Email does not exist' });
  }

  var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

  token.save(function (err) {
    if (err) { return res.status(500).send({ msg: err.message }); }
    Token.findOne({ _userId: user._id, token: { $ne: token.token } }).remove().exec();
    res.status(200).json({ message: 'Reset Password successfully sent to' + req.body.email });
  });
  transporter = nodemailer.createTransport({
    host: "webmail.prospectatech.com",
    port: 587,
    secure: false,
    auth: { user: 'cloudi_mailer@prospectatech.com', pass: 'Welc0me@cloudi21' },
    tls: { rejectUnauthorized: false }
  })

  var mailOptions = {
    to: user.email,
    from: 'cloudi_mailer@prospectatech.com',
    subject: 'VMS Reset Password',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://localhost:4200/resetpassword/' + token.token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (!err) {
      console.log("Forgot Password send successfully");
    }
  })
});

router.post('/valid-token', async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: 'Token is not Exist' });
  }
  var token = await Token.findOne({
    token: req.body.token
  });
  if (token == '') {
    return res.status(400).json({ message: 'Please check the URL!!' });
  }
  User.findOneAndUpdate({ id: token._userId.toString() }).then(() => {

    res.status(200).json({ message: 'Please change your password' });
  }).catch((err) => {
    return res.status(500).send({ msg: err.message });
  });
});


router.post('/new-password', async (req, res) => {

  Token.findOne({ token: req.body.token }, function (err, userToken, next) {
    if (userToken) {
      User.findOne({
        _id: userToken._userId
      }, function (err, userEmail, next) {

        if (userEmail) {
            userEmail.password = req.body.password;
                userEmail.save(function (err) {
                  if (err) {
                    return res.status(400).json({ message: 'Password can not reset.' });
                  } else {
                    userToken.remove();
                    return res.status(200).json({ message: 'Password reseted Successfully' });
                  }
                });    
               
            }else {
              return res.status(400).json({ message: 'User does not exist' });
            }

      });
    } else {
      return res.status(400).json({ message: 'Token has expired!!try later' });
    }
  });


});


module.exports = router;