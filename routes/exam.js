
var express = require('express');
const path1 = require('path');
let Exam=require('../models/exam');
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

/* GET home page. */
router.get('/examform',function (req,res,next) {
    res.render('examform',{
        title: 'Certified Exam Conducted '
    });
});

router.get('/viewdetails',function(req,res){
    Exam.find({},function (err,exams) {
        if (err) {
            console.log(err);
        }
        else {

            res.render('examindex', {
                writer: req.user._id,
                title: 'exams conducted',
                exams: exams
            });
        }
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
router.post('/examform',upload.single('file'),function (req,res) {
//outer.post('/examform',cpUpload,function (req,res) {
    console.log(req.file);
    req.checkBody('organizer','Please enter name of Exam Conducted  !!').notEmpty();
    req.checkBody('subject','Please enter subject of Exam Conducted  !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Exam Conducted  !!').notEmpty();
    req.checkBody('count','Please enter number of student for Exam Conducted  !!').notEmpty();
    req.checkBody('class','Please enter Class for Exam Conducted  !!').notEmpty();

    //get errors

    let errors=req.validationErrors();

    if(errors)
    {
        res.render('examform',{
            errors:errors
        });
    }
    else
    {
        let exam = new Exam();
        exam.organizer=req.body.organizer;
        exam.conducted=req.user._id;
        exam.date=req.body.date;
        exam.subject=req.body.subject;
        exam.class=req.body.class;
        exam.po=req.body.po;
        exam.pso=req.body.pso;
        exam.count=req.body.count;
        exam.file=req.file.filename;
        exam.save(function (err) {
            if(err){
                console.log('its in save');
                console.log(err);
                return;
            }
            else
            {

                req.flash('success','Exam Conducted details submitted');
                console.log(req.files);
                //res.redirect('/sidebar');
                Exam.find({},function (err,exams) {
                    if (err) {
                        console.log(err);
                    }
                    else {

                        res.render('examindex', {
                            writer: req.user._id,
                            title: 'exams conducted',
                            exams: exams
                        });
                    }
                });
            }

        });
    }


});


router.get('/allexam',ensureAuthenticated,function (req,res) {
    Exam.find({},function (err,exams) {
        if(err){
            console.log(err);
        }
        else{

            res.render('examindex', {
                writer: req.user._id,
                title: 'exams conducted',
                exams: exams
            });
        }


    });

});



router.get('/:id',function (req,res) {
    Exam.findById(req.params.id,function (err,exam) {
        Exam.findById(exam.conducted,function (err,user) {
            res.render('exam', {
                exam:exam,
                attendee:user.name
            });

        });
    });
});




router.get('/edit/:id', ensureAuthenticated,function (req,res) {
    Exam.findById(req.params.id,function (err,exam) {
        if(exam.conducted != req.user._id){             // should be !=
            req.flash('danger','Not Autherised !!');
            res.redirect('/examform');
        }
        res.render('editexamform', {
            title:'Edit Exam',
            exam:exam
        });
    });
});



router.post('/edit/:id',function (req,res) {
    let exam= new Exam();
    exam.organizer=req.body.organizer;
    exam.conducted=req.user._id;
    exam.date=req.body.date;
    exam.subject=req.body.subject;
    exam.class=req.body.class;
    exam.po=req.body.po;
    exam.pso=req.body.pso;
    exam.count=req.body.count;
    exam.file=req.file.filename;

    let query={_id:req.params.id}

    Exam.update(query,exam,function (err) {
        if(err)
        {
            console.log(err);
            return;
        }
        else
        {
            req.flash('success','Article Updated');
            res.redirect('/allexam');
        }
    });
});




router.delete('/:id',function (req,res) {


    if(!req.user._id){
        res.status(500).send();
    }
    let query={_id:req.params.id};
    Exam.findById(req.params._id,function (err,exam) {
        if(exam.conducted !=req.user._id){
            res.status(500).send();
        }else{

            Exam.remove(query,function (err) {
                if(err)
                {
                    console.log(err);
                }
                res.send('SUCCESS');
            });
        }

    });


});








function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('danger','Please login');
        res.redirect('/users/login');
    }
}



module.exports = router;

































/*var express = require('express');
var router = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path1 = require('path');
const crypto = require('crypto');


// Workshop module
let Exam= require('../models/exam');
let User = require('../models/user');



var d=new Date();

var dd= d.getDate();
var mm=d.getMonth();
var yy=d.getFullYear();


const storage = new GridFsStorage({
    url: 'mongodb://localhost/snehal',
    file: (req, file) => {
        //console.log('its in thus');
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path1.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'new1'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage :storage});


router.get('/examform',function (req,res) {
    res.render('examform',{
        title: 'Certified Exam Conducted '
    });
});

/*
router.get('/industryvisitform',function (req,res) {
    res.render('industryvisitform',{
        dd:dd,
        mm:mm,
        yy:yy
    });
});
*/

/*router.post('/examform',upload.any(),function(req,res) {
    console.log(req.file);
    req.checkBody('organizer','Please enter name of Exam Conducted  !!').notEmpty();
    req.checkBody('subject','Please enter subject of Exam Conducted  !!').notEmpty();
    req.checkBody('date','Please enter starting date of the Exam Conducted  !!').notEmpty();
    req.checkBody('count','Please enter number of student for Exam Conducted  !!').notEmpty();
    req.checkBody('s4','Please enter Class for Exam Conducted  !!').notEmpty();


    let errors =req.validationErrors();

    if(errors)
    {
        res.render('examform',{
            errors:errors
        });
    }else
    {
        //console.log(req.file);
        let exam = new Exam();
        exam.organizer=req.body.organizer;
        exam.conducted=req.user._id;
        exam.date=req.body.date;
        exam.subject=req.body.subject;
        exam.class=req.body.s4;
        exam.po=req.body.po;
        exam.pso=req.body.pso;
        exam.count=req.body.count;
        exam.hey=req.body.hey;

        exam.save(function (err) {
            if(err)
            {
                console.log(err);
                return;
            }
            else
            {
                req.flash('success','Exam Conducted details submitted');
              //  res.redirect('/allexam');
                Exam.find({},function (err,exams) {
                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('examindex', {
                            writer: req.user._id,
                            title: 'exams conducted',
                            exams:exams
                        });
                    }


                });
            }
        });
    }


});


router.get('/:id',function (req,res) {
    Exam.findById(req.params.id,function (err,exam) {
        User.findById(exam.conducted,function (err,user) {
            res.render('exam', {
                exam:exam,
                attendee:user.name
            });

        });
    });
});


module.exports = router;*/