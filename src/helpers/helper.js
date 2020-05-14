const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'To use this function you must be logged in');
    res.redirect('/user/signin');
}



//HBS
helpers.admin = (user) => {
    if(user.role == 'admin'){
        return true;
    }
}

helpers.adminpanel = (boolean, next) => {
    if(boolean){
        return next();
    } else{
        return false;
    }
}

module.exports = helpers;