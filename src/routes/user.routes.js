const {Router} = require('express');
const router = Router();

const {renderSignUp, signUp, renderSignIn, signIn, logout, 
    profile, adminOrders, viewOrder, finishOrder, adminOrdersFinish, inProccessOrder} = require('../controllers/user.controller');
const {isAuthenticated} = require('../helpers/helper');


router.get('/signup', renderSignUp);
router.post('/signup', signUp);

router.get('/signin', renderSignIn);
router.post('/signin', signIn);

router.get('/logout', isAuthenticated, logout);

router.get('/profile/:id', isAuthenticated, profile);

router.get('/admin/orders', isAuthenticated, adminOrders);
router.get('/admin/orders-finished', isAuthenticated, adminOrdersFinish);
router.get('/order/:id', isAuthenticated, viewOrder);


router.put('/admin/order/:id/finish', isAuthenticated, finishOrder);
router.put('/admin/order/:id/inproccess', isAuthenticated, inProccessOrder);


module.exports = router;
