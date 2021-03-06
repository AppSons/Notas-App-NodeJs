const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) =>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup', (req, res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
   
    if (name.length <= 0 || email.length <= 0 || password.length <= 0 || confirm_password.length <= 0) {
        errors.push({text: 'Complete los campos solicitados'});
    }
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (password.length < 6 ) {
        errors.push({text: 'La contraseña debe tener al menos 6 caracteres'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'El email ya existe en BD');
            res.redirect('/users/signup');
        }
        const newUser = User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Se ha registrado correctamente');
        res.redirect('/users/signin');
    }
    
});
router.get('/users/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
});



module.exports = router;