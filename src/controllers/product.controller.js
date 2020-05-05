const Product = require('../models/product');
const Cart = require('../models/cart.js');
const Order = require('../models/order');

const {unlink} = require('fs-extra');
const path = require('path');
const stripe = require('stripe')('sk_test_iHmNAmCjmIrKpzkcqC5gWBPA00RSFYzDyI');


productCtrl = {}

productCtrl.renderIndex = async(req, res) => {
    let perPage = 12;
    let page = req.params.page || 1;

    await Product
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, products) => {
        Product.countDocuments((err, count) => {
            if(err) return next(err);
            res.render('index', {products, current: page, pages: Math.ceil(count / perPage)});
        })
    });
}
productCtrl.renderProducts = async(req, res) => {
    let perPage = 12;
    let page = req.params.page || 1;

    await Product
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, products) => {
        Product.countDocuments((err, count) => {
            if(err) return next(err);
            res.render('products/products', {products, pagination: {page: page, pageCount: Math.ceil(count / perPage)}});
        })
    });
}

productCtrl.renderAdd = (req, res) => {
    if(req.user.role == 'admin'){
        res.render('products/add');
    } else{
        req.flash('error_msg', 'Not authorized');
        res.redirect('/');
    }
}

productCtrl.add = async (req, res) => {
    const {title, description, category, price} = req.body;
    const errors = [];
        if(req.user.role == 'admin'){
            if(!title){
                errors.push({text: 'Insert title'});
            }
            if(!description){
                errors.push({text: 'Insert description'});
            }
            if(!category || category == 'Choose option'){
                errors.push({text: 'Insert a valid category'});
            }
            if(!price || price == 0){
                errors.push({text: 'Insert a price'});
            }
            if(!req.file){
                    errors.push({text: 'Insert image'});
            }
            if(errors.length > 0){
                res.render('products/add', {errors, title, description, category, price});
            } else{
                const product = new Product();
                product.title = title;
                product.description = description;
                product.category = category;
                product.path = '/img/' + req.file.filename;
                product.price = price;
                await product.save();
                req.flash('success_msg', 'Product added successfully');
                res.redirect('/');
            }
        } else{
            req.flash('error_msg', 'Not authorized');
            res.redirect('/');
        }
}

productCtrl.productView = async(req, res) => {
    const {id} = req.params;
    if(id){
        const product = await Product.findById(id);
        res.render('products/view', product);
    } else{
        req.flash('error_msg', "The product doesn't exist");
        res.redirect('/');
    }
    
}

productCtrl.deleted = async(req, res) => {
    const {id} = req.params;
    if(req.user.role == 'admin'){
        const productDeleted = await Product.findByIdAndRemove(id);
        await unlink(path.resolve('./src/public' + productDeleted.path));
        req.flash('success_msg', 'Product deleted');
        res.redirect('/');
    }
}

productCtrl.renderEdit = async(req, res) => {
    const {id} = req.params;
    if(req.user.role == 'admin'){
        const product = await Product.findById(id);
        res.render('products/edit', {product});
    } else{
        req.flash('error_msg', 'Not Authorized');
        res.redirect(`/product/${req.params.id}`);
    }
}

productCtrl.edit = async(req, res) => {
    const {title, description, category, price} = req.body;
    const errors = [];
        if(req.user.role == 'admin'){
            if(!title){
                errors.push({text: 'Insert title'});
            }
            if(!description){
                errors.push({text: 'Insert description'});
            }
            if(!category || category == 'Choose option'){
                errors.push({text: 'Insert a valid category'});
            }
            if(!price || price == 0){
                errors.push({text: 'Insert a price'});
            }
            if(errors.length > 0){
                res.render('products/add', {errors, title, description, category, price});
            } else if(req.file){
                const product = {
                    title: title,
                    description: description,
                    category: category,
                    price: price,
                    path: '/img/' + req.file.filename
                } 
                await Product.findByIdAndUpdate(req.params.id, {$set: product});
            }else{
                await Product.findByIdAndUpdate(req.params.id, {title, description, category, price});
            }
            req.flash('success_msg', 'Product updated');
            res.redirect(`/product/${req.params.id}`);
    } else{
        req.flash('error_msg', 'Not authorized');
        res.redirect(`/product/${req.params.id}`);
    }
}

productCtrl.addToCart = async (req, res) => {
    const {id} = req.params;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    const product = await Product.findById(id);
    if(product){
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    }
};

productCtrl.renderCart = (req, res) => {
    if(!req.session.cart){
        return res.render('shop/shop', {products: null});
    }

    var cart = new Cart(req.session.cart);
    res.render('shop/shop', {products: cart.generateArray(), totalPrice: cart.totalPrice});
}

productCtrl.renderCheckout = (req, res) => {
    if(!req.session.cart){
        res.redirect('error_msg', "You don't have items in the cart");
        res.redirect('/');
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/checkout', {total: cart.totalPrice})
}

productCtrl.checkout = async (req, res) =>{

    if(!req.session.cart){
        res.redirect('/');
    }

    var cart = new Cart(req.session.cart);
    
    const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        address: {
            line1: req.body.address,
            line2: req.body.number
        },
        source: req.body.stripeToken,
    });

    const charge = await stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        customer: customer.id
    });

    const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        numberAddress: req.body.number,
        name: req.body.name,
        paymentId: charge.id
    });
    await order.save();

    req.flash('success_msg', 'Successfully bought products');
    req.session.cart = [];
    res.redirect('/');
}



module.exports = productCtrl;