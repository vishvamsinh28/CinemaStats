const express = require('express')
const bcrypt = require("bcrypt")
const Joi = require('joi');
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../models/user');
const session = require('express-session');
const { schema } = require('../models/user');

const validate_schema = Joi.object({
    firstname: Joi.string().max(20).required(),
    lastname: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(8).max(20).required(),
    password: Joi.string().max(20)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'))
    .required()
})

router.get('/login',(req,res)=>{
    res.render('login.ejs' ,{message : req.flash('message')});
})
  
router.get('/register',(req,res)=>{
    res.render('register.ejs',{message : req.flash('message')});
})

router.post('/register', async (req,res)=>{
    try{
        const {email , firstname , lastname , password , username } = req.body;
        const { error } = validate_schema.validate({ firstname, lastname, email, username, password });
        if (error) {
          req.flash('message', error.details[0].message);
          res.redirect('/register');
        } else {
          const user = new User({firstname,lastname,email,username,password})
          const findUser = await User.findOne({username:username})
          if(findUser){
              req.flash('message' , 'User already exists try again')
              res.redirect('/register')
          }else{
              req.flash("message","Account created please login to continue")
              await user.save()
              res.redirect("/login")
          }
        }
    }catch (err){
        res.render("error.ejs",{err})
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username})
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword){
                req.session.user_id = user._id;
                req.session.username = user.username;
                res.redirect('/')
            }else{
                req.flash('message',"Wrong Password!")
                res.redirect('/login')
            }
        }else{
            req.flash("message","No user found create new")
            res.redirect('/register')
        }
    }catch(err){
        res.render('error',{err})
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;