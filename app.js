var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var path = require('path');
var db = require('./config/keys').MongoURI;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var app = express();

require('./config/passport')(passport);

mongoose.connect(db, { useNewUrlParser: true })
	.then(() =>console.log('MongoDB Connected...'))
	.catch(err => console.log(err));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req,res,next) {
	res.locals.success_msg = req.flash('sucess_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.use(expressLayouts);

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(3000,()=>console.log('Server started on port 3000'));

module.exports = app;