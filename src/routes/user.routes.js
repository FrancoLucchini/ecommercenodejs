const {Router} = require('express');
const router = Router();

const {renderSignUp, signUp, renderSignIn, signIn, logout, profile} = require('../controllers/user.controller');
const {isAuthenticated} = require('../helpers/helper');


router.get('/signup', renderSignUp);
router.post('/signup', signUp);

router.get('/signin', renderSignIn);
router.post('/signin', signIn);

router.get('/logout', isAuthenticated, logout);

router.get('/profile/:id', isAuthenticated, profile)

module.exports = router;
