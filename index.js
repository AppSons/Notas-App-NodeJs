const express = require('express');
const {dbConnection} = require('./src/config/database');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// Initializations
const app = express();


require('./database');
require('./src/config/passport');

dbConnection();

// Settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    runtimeOptions: {                           
        allowProtoPropertiesByDefault: true,
        // allowProtoMethodsByDefault: true
    },
    extname:'.hbs'
}));
app.set('view engine', '.hbs');
// Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');  
    res.locals.error = req.flash('error');
    res.locals.user = req.user  || null;    
    next();
});

// Routes
app.use(require('./src/routes/index'));
app.use(require('./src/routes/notes'));
app.use(require('./src/routes/users'));

// Static Files

app.use(express.static(path.join(__dirname, 'public')));

// Server is Listenning
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});

