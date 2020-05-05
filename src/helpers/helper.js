const helpers = {};


var paginate = require('handlebars-paginate');

helpers.paginate = paginate;

helpers.admin = (user) => {
    if(user.role == 'admin'){
        return true;
    }
}

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'To use this function you must be logged in');
    res.redirect('/user/signin');
}

module.exports = helpers;