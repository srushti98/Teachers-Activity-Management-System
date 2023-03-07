var express = require('express');
var router = express.Router();
const crypto=require('crypto');
const multer  = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const path1 = require('path');

// Workshop module
let Seminar= require('../models/seminar');
let User = require('../models/user');
var d=new Date();

var dd= d.getDate();
var mm=d.getMonth();
var yy=d.getFullYear();

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

/*

router.get('/seminarform',function (req,res) {
    res.render('seminarform',{
        dd:dd,
        mm:mm,
        yy:yy
    });
});*/

/*router.get('/seminarform',function (req,res) {
    res.render('seminarform',{
        title:'Seminar form'
    });
});*/
router.get('/seminarformatt',function (req,res) {
    res.render('seminaratt2',{
        title:'Seminar form'
    });
});
router.get('/seminarformcon',function (req,res) {
    res.render('seminarcon2',{
        title:'Seminar form'
    });
});
router.get('/viewdetailscon',function(req,res){
    Seminar.find({},function (err,seminars) {
        if(err){
            console.log(err);
        }
        else {
            res.render('seminarindexcon', {
                writer: req.user._id,
                title: 'Seminar',
                seminars: seminars
            });

        }

    });
});
router.get('/viewdetailsatt',function(req,res){
    Seminar.find({},function (err,seminars) {
        if(err){
            console.log(err);
        }
        else {
            res.render('seminarindex', {
                writer: req.user._id,
                title: 'Seminar',
                seminars: seminars
            });

        }

    });

});

router.post('/seminarformatt',upload.single('file'),function(req,res) {

    req.checkBody('organizer','Please enter name of Seminar !!').notEmpty();
    req.checkBody('subject','Please enter some discription about Seminar !!').notEmpty();
    req.checkBody('place','Please enter venue of the Seminar !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Seminar !!').notEmpty();
    req.checkBody('r1','Please enter Category of the Seminar !!').notEmpty();
    req.checkBody('day','Please enter duration of Seminar !!').notEmpty();
    req.checkBody('day','Please enter valid number !!').isNumeric();

    let errors =req.validationErrors();

    if(errors)
    {
        res.render('seminaratt2',{
            errors:errors
        });
    }else
    {
        let seminar = new Seminar();
        seminar.organizer=req.body.organizer;
        seminar.attendee=req.user._id;
        seminar.subject=req.body.subject;
        seminar.place=req.body.place;
        seminar.date=req.body.date;
        console.log(seminar.date);
        seminar.day=req.body.day;
        seminar.category=req.body.r1;
        seminar.po=req.body.po;
        seminar.pso=req.body.pso;
        seminar.file=req.file.filename;

        seminar.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Seminar details submitted');
               // res.redirect('/allseminaratt');
                Seminar.find({},function (err,seminars) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        res.render('seminarindex', {
                            writer: req.user._id,
                            title: 'Seminar',
                            seminars: seminars
                        });

                    }

                });

            }
        });
    }


});

router.get('/aa/:id',function (req,res) {
    Seminar.findById(req.params.id,function (err,seminar) {
        User.findById(seminar.attendee,function (err,user) {
            res.render('seminar', {
                seminar:seminar,
                attendee:user.name
            });

        });
    });
});

router.post('/seminarformcon',upload.single('file'),function(req,res) {

    req.checkBody('organizer','Please enter name of Seminar !!').notEmpty();
    req.checkBody('subject','Please enter some discription about Seminar !!').notEmpty();
    req.checkBody('place','Please enter venue of the Seminar !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Seminar !!').notEmpty();
    req.checkBody('r1','Please enter Category of the Seminar !!').notEmpty();
    req.checkBody('day','Please enter duration of Seminar !!').notEmpty();
    req.checkBody('day','Please enter valid number !!').isNumeric();

    let errors =req.validationErrors();

    if(errors)
    {
        res.render('seminarcon2',{
            errors:errors
        });
    }else
    {
        let seminar = new Seminar();
        seminar.organizer=req.body.organizer;
        seminar.conducted=req.user._id;
        seminar.subject=req.body.subject;
        seminar.place=req.body.place;
        //seminar.date=req.body.date;
        var ss=req.body.date;
        var sdate = new Date(ss);
        //console.log(seminar.date);
       /* Date al = new Date();
        format("mm/dd/yy");*/
        //let sdate=req.body.date;
     //  let sdate=new Date();
        var dd=sdate.getDate();
        var mm=sdate.getMonth()+1;
        var yy=sdate.getFullYear();
        console.log("date");
        console.log(dd);
        console.log("Month");
        console.log(mm);

        if (dd <10){
            dd= 0+dd;
        }

        if(mm< 10)
        {
            mm=0+mm;
        }

        var tt= dd+'/'+mm+'/'+yy;
        var pp= new Date(tt);
        console.log("full date");
        console.log(pp);

        seminar.date=pp;

        seminar.day=req.body.day;
        seminar.category=req.body.r1;
        seminar.po=req.body.po;
        seminar.pso=req.body.pso;
        seminar.file=req.file.filename;



        seminar.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Seminar details submitted');
               // res.redirect('/allseminarcon');
               // User.findById(req.user._id,function (err,user) {
                  //  res.redirect('/allseminarcon', {
                    //    writer:user.name
                    //});
            //});
                Seminar.find({},function (err,seminars) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        res.render('seminarindexcon', {
                            writer: req.user._id,
                            title: 'Seminar',
                            seminars: seminars
                        });

                    }

                });

    }

        });

    }

});

router.get('/cc/:id',function (req,res) {
    Seminar.findById(req.params.id,function (err,seminar) {
        User.findById(seminar.conducted,function (err,user) {
            res.render('seminar', {
                seminar:seminar,
                attendee:user.name
            });

        });
    });
});


module.exports = router;