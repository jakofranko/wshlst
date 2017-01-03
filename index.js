var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	path = require('path');

mongoose.connect('mongodb://localhost/wshlst');
var db = mongoose.connection;


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	maxAge: 1000 * 60 * 30, // half hour
	secret: 'secret, secret santa',
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	}),
	resave: true,
	saveUninitialized: false
}));

var index = require('./routes/index');
app.use('/', index);
var user = require('./routes/user');
app.use('/user', user);
var dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);

db.once('open', function() {
    app.listen(8080, function() {
    	console.log("WSHLST Opperational.");
    });
});