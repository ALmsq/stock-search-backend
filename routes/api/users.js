const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
// import UserSchema from '../../models/User'
// const UserSchema = require('../../models/User')
// const User = mongoose.model('users')
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../controllers/register");
const validateLoginInput = require("../../controllers/login");
// Load User model
// const User = require("../models/Users");

// const User = mongoose.model('users', UserSchema)
const User = require('../../models/User')

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) =>{
    //Form validation

    const { errors, isValid } = validateRegisterInput(req.body)

    //Check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

User.findOne({ username: req.body.username }).then(user =>{
        if(user) {
            return res.status(400).json({ username: "Username already exists" })
        }else{
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                stocks: req.body.stocks
            })

            //Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) =>{
                    if (err) throw err
                    newUser.password = hash
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err))
                })
            })
        }
    })
    
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post('/login', (req, res) => {
    //Form Validation

    const { errors, isValid } = validateLoginInput(req.body)

    //Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const username = req.body.username
        const password = req.body.password

    //Find user by username
    User.findOne({ username }).then(user => {
        //Check if user exists
        if(!user) {
            return res.status(404).json({ usernamenotfound: 'Username not found' })
        }

    //check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                //User matched
                //create JWT payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    username: username
                }
    //Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token,
                    username: username
                })
            }
        )    
    } else {
        return res
        .status(400)
        .json({ passwordincorrect: 'Password incorrect' })
            }
        })
    })
})

module.exports = router