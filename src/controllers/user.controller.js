const User = require('../models/user');
const passport = require('passport');

userCtrl = {}

userCtrl.renderSignUp = (req, res) => {
    res.render('users/signup');
}

userCtrl.signUp = async (req, res) => {
    const {name, surname, username, email, password, confirm} = req.body;
    const errors = [];
    const nameMatch = await User.findOne({username});
    const emailMatch = await User.findOne({email});
    if(nameMatch){
        errors.push({text: 'The username already exists'});
    }
    if(emailMatch){
        errors.push({text: 'The email already exists'});
    }
    if(!name || name.length < 2){
        errors.push({text: 'Insert a name with more than 2 letters'});
    }
    if(!surname || surname.length <= 1){
        errors.push({text: 'Insert a surname'});
    }
    if(!username || username.length < 3){
        errors.push({text: 'Insert a username with more than 2 letters'});
    }
    if(!email){
        errors.push({text: 'Insert a email'});
    }
    if(!password){
        errors.push({text: 'Insert a password'});
    }
    if(password != confirm){
        errors.push({text: 'The password not match'});
    }
    if(errors.length > 0){
        res.render('users/signup', {name, surname, username, email, errors});
    } else{
        const user = new User();
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        await user.save();
        req.flash('success_msg', 'User created');
        res.redirect('/user/signup');
    }
}

userCtrl.renderSignIn = (req, res) => {
    res.render('users/signin');
}

userCtrl.signIn = passport.authenticate('local', {
    failureRedirect: '/user/signin',
    successRedirect: '/',
    failureFlash: true
});

userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/');
}

userCtrl.renderAdmin = (req, res) => {
    if(req.user){
        if(req.user.role == 'admin'){
            res.render('users/admin');
        }else{
            req.flash('error_msg', 'Not authorized');
            res.redirect('/');
        }
    } else{
        res.redirect('/');
    }
}

module.exports = userCtrl;