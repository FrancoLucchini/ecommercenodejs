if(process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');



require('./middleware/passport');

const productsRoutes = require('./routes/products.routes');
const userRoutes = require('./routes/user.routes');

//helpers
const helpers = require('./helpers/helper');

//initializations
const app = express();

//settings
app.set(cors());
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: helpers,
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');


//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.errors = []
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img'),
    filename: (req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

app.use(multer({storage}).single('image'));

//statics
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(productsRoutes);
app.use('/user', userRoutes);

module.exports = app;