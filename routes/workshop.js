var express = require('express');
var router = express.Router();
const crypto=require('crypto');
const multer  = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const path1 = require('path');

// Workshop module
let Workshop= require('../models/workshop');
let User = require('../models/user');

const storage = new GridFsStorage({
    url: 'mongodb://localhost/snehal',
    //url: 'mongodb://pict:pict1234@ds161520.mlab.com:61520/activity_management',
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

router.get('/aa/:id',function (req,res) {
    Workshop.findById(req.params.id,function (err,workshop) {
        User.findById(workshop.attendee,function (err,user) {

            res.render('workshop', {
                workshop:workshop,
                attendee:user.name
            });

        });
    });
});

router.get('/cc/:id',function (req,res) {
    Workshop.findById(req.params.id,function (err,workshop) {
        User.findById(workshop.conducted,function (err,user) {
            res.render('workshop', {
                workshop:workshop,
                attendee:user.name
            });

        });
    });
});




var d=new Date();

var dd= d.getDate();
var mm=d.getMonth();
var yy=d.getFullYear();


/*router.get('/verticleb',function (req,res) {

    res.render('verticleb', {
        title: 'Workshops ',
    });

});*/

router.get('/workshopconform',function (req,res) {
    res.render('workshopcon2',{

   });
});
router.get('/workshopattform',function (req,res) {
    res.render('workshopatt2',{

    });
});
router.get('/viewdetailscon',function(req,res){
    Workshop.find({},function (err,workshops) {
        if(err){
            console.log(err);
        }
        else{

            res.render('workshopindexcon', {
                writer: req.user._id,
                title: 'Workshop',
                workshops:workshops
            });
        }


    });

});
router.get('/viewdetailsatt',function(req,res){
    Workshop.find({},function (err,workshops) {
        if(err){
            console.log(err);
        }
        else{

            res.render('workshopindex', {
                writer: req.user._id,
                title: 'Workshop',
                workshops:workshops
            });
        }


    });

});

router.post('/workshopconform',upload.single('file'),function(req,res) {

    req.checkBody('organizer','Please enter name of Workshop !!').notEmpty();
    req.checkBody('subject','Please enter some discription about SeWorkshopminar !!').notEmpty();
    req.checkBody('place','Please enter venue of the Workshop !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Workshop !!').notEmpty();
    req.checkBody('count','Please enter Category of the Workshop !!').notEmpty();
    req.checkBody('r2','Please enter Category of the Workshop !!').notEmpty();
    req.checkBody('day','Please enter duration of Workshop !!').notEmpty();
    req.checkBody('day','Please enter valid number !!').isNumeric();


    let errors =req.validationErrors();

    if(errors)
    {
        res.render('workshopcon2',{
            errors:errors
         });
    }else
    {
        let workshop = new Workshop();
        workshop.organizer=req.body.organizer;
        workshop.conducted=req.user._id;
        workshop.subject=req.body.subject;
        workshop.count=req.body.count;
        workshop.place=req.body.place;
      //  workshop.date=req.body.date;
        /*let vdate=req.body.date;
        //vdate.setTime(req.body.date);
        workshop.date= vdate.toLocaleString();*/
        let ccdate= req.body.date;
        workshop.date = ccdate.Date;
        console.log('DATE :');
        console.log(workshop.date);
        workshop.day=req.body.day;
        workshop.category=req.body.r2;
        workshop.class=req.body.s1;
        workshop.po=req.body.po;
        workshop.pso=req.body.pso;
        workshop.file=req.file.filename;

        workshop.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Workshop details submitted');
               // res.redirect('/allworkshopcon');
                Workshop.find({},function (err,workshops) {
                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('workshopindexcon', {
                            writer: req.user._id,
                            title: 'Workshop',
                            workshops:workshops
                        });
                    }


                });
            }
        });
    }


});


// for attended one

router.post('/workshopattform',upload.single('file'),function(req,res) {

    //let newdate=req.body.date.getDate()+"-"+req.body.date.getMonth()+"-"+req.body.date.getFullYear();
    req.checkBody('organizer','Please enter name of Workshop !!').notEmpty();
    req.checkBody('subject','Please enter some discription about Workshop !!').notEmpty();
    req.checkBody('place','Please enter venue of the Workshop !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Workshop !!').notEmpty();
    req.checkBody('r2','Please enter Category of the Workshop !!').notEmpty();
    req.checkBody('day','Please enter duration of Workshop !!').notEmpty();
    req.checkBody('day','Please enter valid number !!').isNumeric();


    let errors =req.validationErrors();

    if(errors)
    {
        res.render('workshopatt2',{
            errors:errors
        });
    }else
    {
        let workshop = new Workshop();
        workshop.organizer=req.body.organizer;
        workshop.attendee=req.user._id;
        workshop.subject=req.body.subject;
        workshop.place=req.body.place;
        workshop.date=req.body.date;
        //workshop.date=newdate;
        workshop.day=req.body.day;
        workshop.category=req.body.r2;
        workshop.po=req.body.po;
        workshop.pso=req.body.pso;
        workshop.file=req.file.filename;
        console.log(workshop.date);


        workshop.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Workshop details submitted');
                //res.redirect('/allworkshopatt');
                Workshop.find({},function (err,workshops) {
                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('workshopindex', {
                            writer: req.user._id,
                            title: 'Workshop',
                            workshops:workshops
                        });
                    }


                });
            }
        });
    }


});



module.exports = router ;