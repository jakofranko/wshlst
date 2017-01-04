var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	path = require('path'),
	fs = require('fs');

// mongoose.connect('mongodb://localhost/wshlst');
var contents = fs.readFileSync('a_road_less_traveled.txt', {encoding: 'utf8'}).split("\n"),
	a = contents[0],
	road = contents[1],
	less = contents[2],
	traveled = contents[3];

mongoose.connect('mongodb://' + a + ':' + road + '@ds151028.mlab.com:51028/' + less);
var db = mongoose.connection;


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	maxAge: 1000 * 60 * 30, // half hour
	secret: traveled,
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
var wishlist = require('./routes/wishlist');
app.use('/wishlist', wishlist);

db.once('open', function() {
    app.listen(8080, function() {
    	console.log("WSHLST Opperational.");
    });
});