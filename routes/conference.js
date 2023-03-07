var express = require('express');
const path1 = require('path');
let Conference= require('../models/conference');
let User = require('../models/user');
const crypto=require('crypto');
const multer  = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
var router = express.Router();

//get in multer

//var upload = multer({ dest: 'public/uploads/' });

/*const storage=multer.diskStorage({
   destination:function (req,file,cb) {
       cb(null,'./uploads/');
   },
   filename:function (req,file,cb) {
       cb(null,new Date().toISOString()+file.originalname);

   }
});*///originalname
//const upload=multer({storage:storage});
//create storage engine
const storage = new GridFsStorage({
    url: 'mongodb://localhost/snehal',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path1.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
var upload = multer({ storage:storage });

router.get('/viewdetails',function(req,res){
    Conference.find({},function (err,conferences) {
        if(err){
            console.log(err);
        }
        else{

            res.render('conferenceindex', {
                writer: req.user._id,
                title: 'conferences conducted',
                conferences:conferences
            });
        }


    });

});
/* GET home page. */
router.get('/conferenceform',function (req,res) {
    res.render('conferenceform',{
        title: 'Conference Conducted '
    });
});
//var cpUpload = upload.fields([{ name: 'file' }, { name: 'file2'}]);
//app.post('/cool-profile', cpUpload, function (req, res, next) {
// req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//
// e.g.
//  req.files['avatar'][0] -> File
//  req.files['gallery'] -> Array
//
// req.body will contain the text fields, if there were any
//})
router.post('/conferenceform',upload.single('file'),function(req,res) {

    req.checkBody('organizer','Please enter name of conference Conducted  !!').notEmpty();
    req.checkBody('subject','Please enter subject of conference Conducted  !!').notEmpty();
    req.checkBody('date','Please enter starting date of the conference Conducted  !!').notEmpty();
    req.checkBody('count','Please enter number of student for conference Conducted  !!').notEmpty();

    //get errors

    let errors=req.validationErrors();

    if(errors)
    {
        res.render('conferenceform',{
            errors:errors
        });
    }else
    {
        let conference = new Conference();
        conference.organizer=req.body.organizer;
        conference.conducted=req.user._id;
        conference.date=req.body.date;
        conference.subject=req.body.subject;
        conference.po=req.body.po;
        conference.pso=req.body.pso;
        conference.count=req.body.count;
        conference.file=req.file.filename;

        conference.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','conference Conducted details submitted');
                //  res.redirect('/allconference');
                Conference.find({},function (err,conferences) {
                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('conferenceindex', {
                            writer: req.user._id,
                            title: 'conferences conducted',
                            conferences:conferences
                        });
                    }


                });
            }
        });
    }



});


router.get('/:id',function (req,res) {
    Conference.findById(req.params.id,function (err,conference) {
        User.findById(conference.conducted,function (err,user) {
            res.render('conference', {
                conference:conference,
                attendee:user.name
            });

        });
    });
});

module.exports = router;






















/*var express = require('express');
var router = express.Router();


// Workshop module
let Conference= require('../models/conference');
let User = require('../models/user');



var d=new Date();

var dd= d.getDate();
var mm=d.getMonth();
var yy=d.getFullYear();

router.get('/conferenceform',function (req,res) {
    res.render('conferenceform',{
        title: 'Conference Conducted '
    });
});
*/
/*
router.get('/industryvisitform',function (req,res) {
    res.render('industryvisitform',{
        dd:dd,
        mm:mm,
        yy:yy
    });
});
*/

/*router.post('/conferenceform',function(req,res) {

    req.checkBody('organizer','Please enter name of conference Conducted  !!').notEmpty();
    req.checkBody('subject','Please enter subject of conference Conducted  !!').notEmpty();
    req.checkBody('date','Please enter starting date of the conference Conducted  !!').notEmpty();
    req.checkBody('count','Please enter number of student for conference Conducted  !!').notEmpty();


    let errors =req.validationErrors();

    if(errors)
    {
        res.render('conferenceform',{
            errors:errors
        });
    }else
    {
        let conference = new Conference();
        conference.organizer=req.body.organizer;
        conference.conducted=req.user._id;
        conference.date=req.body.date;
        conference.subject=req.body.subject;
        conference.po=req.body.po;
        conference.pso=req.body.pso;
        conference.count=req.body.count;

        conference.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','conference Conducted details submitted');
              //  res.redirect('/allconference');
                Conference.find({},function (err,conferences) {
                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('conferenceindex', {
                            writer: req.user._id,
                            title: 'conferences conducted',
                            conferences:conferences
                        });
                    }


                });
            }
        });
    }


});


router.get('/:id',function (req,res) {
    Conference.findById(req.params.id,function (err,conference) {
        User.findById(conference.conducted,function (err,user) {
            res.render('conference', {
                conference:conference,
                attendee:user.name
            });

        });
    });
});


module.exports = router;*/