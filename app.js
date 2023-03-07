var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
const bodyParser= require('body-parser');
const expressValidator= require('express-validator');
const flash= require('connect-flash');
const session=require('express-session');
const passport= require('passport');
const config= require('./config/database');
//const path = require('path');
const crypto = require('crypto');
//const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
mongoose.connect('mongodb://localhost/snehal');
//mongoose.connect('mongodb://srushti123:srushti123@ds245150.mlab.com:45150/dbsrushti');
//mongoose.connect('mongodb://pict:pict1234@ds161520.mlab.com:61520/activity_management');
let db=mongoose.connection;
// Init gfs
var gfs;

db.once('open', () => {
    // Init stream
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');

    console.log('connected to db')
});


    //app.set('config', config);




db.on('error',function (err) {
    console.log(err);
});
/*const storage = new GridFsStorage({
    url: 'mongodb://localhost/snehal',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage :storage});*/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/add');
//var adminRouter = require('./routes/admin');
var app = express();

let Article= require('./models/article');
let User= require('./models/user');
let Sysadmin= require('./models/sysadmin');

let Workshop= require('./models/workshop');
let Seminar= require('./models/seminar');
let Industryvisit= require('./models/industryvisit');
let Guest = require('./models/guest');
let Exam = require('./models/exam');
let Conference = require('./models/conference');

//app.set('gfs', gfs);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// bodyparser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));



// passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});


app.get('/openfile/:id/:file', (req, res) => {
    gfs.files.findOne({ filename: req.params.file }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        // if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        //} else {
        //     res.status(404).json({
        //         err: 'Not an image'
        //     });
        //}
    });
});
//app.use('/', indexRouter);

app.get('/',function (req,res) {
    Article.find({},function (err,articles) {
        if(err){
            console.log(err);
        }
        else{

            res.render('main', {
                title: 'login'
            });
        }


    });

});


app.get('/allarticle',ensureAuthenticated,function (req,res) {
    Article.find({},function (err,articles) {
        if(err){
            console.log(err);
        }
        else{

            res.render('index', {
                title: 'Articles',
                articles:articles
            });
        }


    });

});

app.get('/sidebar',ensureAuthenticated,function (req,res) {

            res.render('sidebar', {
                title: 'Sidebar',
            });

});
app.get('/sidebar2',ensureAuthenticated,function (req,res) {

    res.render('sidebar2', {

    });

});

app.get('/search',ensureAuthenticated,function (req,res) {
User.find({},function (err,users) {
    if(err){
        console.log(err);
    }
    else{

        res.render('search', {
            title: 'search',
            users:users
        });
    }


});


});


// for all workshops
/*
app.get('/allworkshopatt',function (req,res) {
    Workshop.find({},function (err,workshops) {
        if(err){
            console.log(err);
        }
        else{

            res.render('workshopindex', {
                title: 'Workshop',
                workshops:workshops
            });
        }


    });

});

app.get('/allworkshopcon',function (req,res) {
    Workshop.find({},function (err,workshops) {
        if(err){
            console.log(err);
        }
        else{

            res.render('workshopindexcon', {
                title: 'Workshop',
                workshops:workshops
            });
        }


    });

});
*/

// for all seminar
/*
app.get('/allseminaratt',function (req,res) {
    Seminar.find({},function (err,seminars) {
        if(err){
            console.log(err);
        }
        else{

            res.render('seminarindex', {
                title: 'Seminar',
                seminars:seminars
            });
        }


    });

});
*/

/*
app.get('/allseminarcon',function (req,res) {
    Seminar.find({},function (err,seminars) {
        if(err){
            console.log(err);
        }
        else{
            res.render('seminarindexcon', {
                writer:writer,
                title: 'Seminar',
                seminars:seminars
            });
        }


    });

});
*/

/*
app.get('/alliv',function (req,res) {
    Industryvisit.find({},function (err,industryvisits) {
        if(err){
            console.log(err);
        }
        else{

            res.render('industryvisitindex', {
                title: 'Industrial Visit',
                industryvisits:industryvisits
            });
        }


    });

});*/


/*
app.get('/allguestatt',function (req,res) {
    Guest.find({},function (err,guests) {
        if(err){
            console.log(err);
        }
        else{
            console.log('Guest rendering !!');
            res.render('guestindex', {
                title: 'guest lecture',
                guests:guests
            });
        }


    });

});

app.get('/allguestcon',function (req,res) {
    Guest.find({},function (err,guests) {
        if(err){
            console.log(err);
        }
        else{
            console.log('Guest rendering !!');
            res.render('guestindexcon', {
                title: 'guest lecture',
                guests:guests
            });
        }


    });

});
*/

/*
app.get('/allexam',function (req,res) {
    Exam.find({},function (err,exams) {
        if(err){
            console.log(err);
        }
        else{

            res.render('examindex', {
                title: 'exams conducted',
                exams:exams
            });
        }


    });

});


app.get('/allconference',function (req,res) {
    Conference.find({},function (err,conferences) {
        if(err){
            console.log(err);
        }
        else{

            res.render('conferenceindex', {
                title: 'conferences conducted',
                conferences:conferences
            });
        }


    });

});*/


let article= require('./routes/article');
let users= require('./routes/users');
let workshop= require('./routes/workshop');
let seminar= require('./routes/seminar');
let industryvisit=  require('./routes/industryvisit');
let guest= require('./routes/guest');
let exam= require('./routes/exam');
let conference= require('./routes/conference');
let adminRouter= require('./routes/admin');
let expo= require('./routes/expo');
let sysadmin= require('./routes/sysadmin');

app.use('/article',article);
app.use('/users',users);
app.use('/workshop',workshop);
app.use('/seminar',seminar);
app.use('/industryvisit',industryvisit);
app.use('/guest',guest);
app.use('/exam',exam);
app.use('/conference',conference);
app.use('/admin',adminRouter);
app.use('/expo',expo);
app.use('/sysadmin',sysadmin);


app.use('/add', usersRouter);

app.post('/add',ensureAuthenticated,function (req,res) {
    req.checkBody('title','Title is required !!').notEmpty();
    //req.checkBody('author','Author is required !!').notEmpty();
    req.checkBody('body','Body is required !!').notEmpty();

    let errors=req.validationErrors();
    if(errors){
        res.render('add',{
            title:'Add article',
            errors:errors
        });
    }
    else {

        let article= new Article();
        article.title=req.body.title;
        article.author=req.user._id;
        article.body=req.body.body;

        article.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Article Added');
                res.redirect('/allarticle');
            }
        });
    }


});

/*
app.get('/workshop/:id',function (req,res) {
    Workshop.findById(req.params.id,function (err,workshop) {
            res.render('workshop', {
                workshop:workshop
            });

    });
});
*/



function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('danger','Please login');
        res.redirect('/users/login');
    }
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
