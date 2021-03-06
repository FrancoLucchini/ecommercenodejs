const { Router } = require('express');
const router = Router();

const {isAuthenticated} = require('../helpers/helper');

const {renderIndex ,renderAdd, add, productView, deleted, 
    renderEdit, edit, addToCart, renderCart, renderCheckout, 
    checkout, renderProducts, search, category, reduceOne, remove} = require('../controllers/product.controller');


router.get('/', renderIndex);
router.get('/products/:page', renderProducts);
router.get('/search/:page', search);
router.get('/category/:category/:page', category);

router.get('/product/add', isAuthenticated, renderAdd);
router.post('/product/add', isAuthenticated, add);

router.get('/product/:id', productView);

router.get('/product/delete/:id', isAuthenticated, deleted);

router.get('/product/edit/:id', isAuthenticated, renderEdit);
router.put('/product/edit/:id', isAuthenticated, edit);


router.post('/add-to-cart/:id', isAuthenticated, addToCart);
router.get('/cart', isAuthenticated, renderCart);

router.get('/reduce/:id', isAuthenticated, reduceOne)
router.get('/remove/:id', isAuthenticated, remove);

router.get('/checkout', isAuthenticated,renderCheckout);
router.post('/checkout', isAuthenticated, checkout);




module.exports = router;