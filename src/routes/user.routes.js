const {Router} = require('express');
const router = Router();

const {renderSignUp, signUp, renderSignIn, signIn, logout, renderAdmin} = require('../controllers/user.controller');
const {} = require('../helpers/helper');


router.get('/signup', renderSignUp);
router.post('/signup', signUp);

router.get('/signin', renderSignIn);
router.post('/signin', signIn);

router.get('/logout', logout);

router.get('/admin', renderAdmin);

module.exports = router;
