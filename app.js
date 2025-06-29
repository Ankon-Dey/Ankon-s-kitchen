const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;

// Passport config
require('./config/passport')(passport);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(cookieParser('CookingBlogSecure'));

app.use(session({
  secret: 'CookingBlogSecretSession',
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.title = 'Cooking Blog - Made with Node.js';
  res.locals.infoErrorsObj = req.flash('infoErrors');
  res.locals.infoSubmitObj = req.flash('infoSubmit');
  res.locals.user = req.user || null;
  next();
});


// File uploads
app.use(fileUpload());

// View engine
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
const recipeRoutes = require('./server/routes/recipeRoutes');
const profileRoutes = require('./server/routes/profileRoutes');

app.use('/', recipeRoutes);
app.use('/', profileRoutes);

// Start server
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
