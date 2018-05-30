const express = require('express');
const authRoutes = express.Router();
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const {validateUser} = require('../middleware/middleware.js');

const User = require('../models/user.js');

authRoutes.get('/register', (req, res) => {
  res.render('register');
})

authRoutes.get('/home', validateUser, (req, res) => {
  console.log('userId:', req.session.userId);
  res.render('home');
})

authRoutes.post('/register', [
  body('email')
    .isEmail()
    .withMessage('Invalid e-mail address'),
  body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contains at least one digit')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(obj => {
        return {message: obj.msg};
      });
      req.flash('errorMessages', errorMessages);
      return res.redirect('/register');
    }
    const userData = matchedData(req);
    const user = new User(userData);
    user.save()
      .then(user => {
        req.flash('successMessage', {message: "Sign up successful!"});
        res.redirect('/login');
      }).catch(e => {
        if(e.code === 11000) {
          req.flash('errorMessages', {message: "Duplicate email"});
        }
        res.redirect('/register');
      })
})

authRoutes.get('/login', (req, res) => {
  res.render('login');
})

authRoutes.post('/login', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash('errorMessages', {message: 'This email does not exist'});
        res.redirect('/login');
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(passwordIsValid => {
            if(passwordIsValid) {
              req.session.userId = user._id;
              res.redirect('/home');
            } else {
              req.flash('errorMessages', {message: 'Invalid Password'});
              res.redirect('/login');
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    })
    .catch(e => {
      req.flash('errorMessages', {message: 'This email does not exist'});
      res.redirect('/login');
    })
})

authRoutes.post('/logout', (req, res) => {
  req.session.userId = undefined;
  res.redirect('/login');
})


module.exports = authRoutes;
