var express = require('express');
var router = express.Router();
var mongoXlsx = require('mongo-xlsx');
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const crypto=require('crypto');
const multer  = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const path1 = require('path');
//const fileSystem=require('file-system');
const fileSystem=require('fs');

let User = require('../models/user');
let Workshop= require('../models/workshop');
let Seminar= require('../models/seminar');
let Industryvisit= require('../models/industryvisit');
let Guest = require('../models/guest');
let Exam = require('../models/exam');
let Conference = require('../models/conference');

var dpath;



var confoptions ={
    save:true,
    sheetName:[],
    fileName:"conference"+new Date().getDay()+".xlsx",
    path:"./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName:"worksheet"
}

var examoptions ={
    save:true,
    sheetName:[],
    fileName:"certifiedexams"+new Date().getDay()+".xlsx",
    path:"./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName:"worksheet"
}

var guestoptions ={
    save:true,
    sheetName:[],
    fileName:"guestlecture"+new Date().getDay()+".xlsx",
    path:"./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName:"worksheet"
}


var semoptions ={
    save:true,
    sheetName:[],
    fileName:"seminarop"+new Date().getDay()+".xlsx",
    path:"./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName:"worksheet"
}


var industryoptions ={
    save:true,
    sheetName:[],
    fileName:"industryVisitop"+new Date().getDay()+".xlsx",
    path:"./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName:"worksheet"
}

var workoptions = {
    save: true,
    sheetName: [],
    fileName: "workshopop" + new Date().getDay() + ".xlsx",
    path: "./storing",
    //path:"C:\\Users\\HP\\Documents\\excelsheets",
    defaultSheetName: "worksheet"
}










router.get('/search',function (req,res,next) {
            res.render('modofiedadmin', {
                title: 'expo'
            });

});

router.get('/search/work',function (req,res,next) {
    res.render('workoption', {
        title: 'expo'
    });

});

router.get('/search/seminar',function (req,res,next) {
    res.render('seminaroption', {
        title: 'expo'
    });

});

router.get('/search/conference',function (req,res,next) {
    res.render('confoption', {
        title: 'expo'
    });

});

router.get('/search/guest',function (req,res,next) {
    res.render('guestoption', {
        title: 'expo'
    });

});



router.get('/search/ivs',function (req,res,next) {
    res.render('industryvisitoption', {
        title: 'expo'
    });

});


router.get('/search/exam',function (req,res,next) {
    res.render('examoption', {
        title: 'expo'
    });

});


router.get('/search/user',function (req,res,next) {
   /* res.render('search', {
        title: 'expo'
    });*/

    User.findById({},function (err,users) {
        res.render('search', {
            title: 'expo',
            users:users
        });
    });

});


router.get('/search/all',function (req,res,next) {
    res.render('alloptions', {
        title: 'expo'
    });

});



router.post('/search',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;
        var workres= [];
        var semres= [];
        var industryres= [];
        var guestres= [];

        var examres= [];
        var conres= [];

        console.log(activity);

            for (let i = 0; i < activity.length; i++) {
                console.log("ac",activity[i]);
                if(activity[i] == 1) {
                    Workshop.aggregate([
                        { $lookup:
                                {
                                    from: 'Seminar',
                                    localField: 'user._id',
                                    foreignField: 'user._id'
                                }
                        }
                    ]).toArray(function(err, res) {
                        if (err) throw err;
                        console.log(JSON.stringify(res));

                        console.log("two sheets");
                        console.log(res);
                    });



                }
                                if(activity[i] == 2) {
                                    Seminar.find({},function (err, seminars) {
                                        semres=seminars;
                                        console.log("seminar");
                                        console.log(semres);
                                    });
                                }
                                if(activity[i] == 3) {
                                    Industryvisit.find({}, function (err, ivs) {
                                        industryres=ivs;
                                        console.log("industria");
                                        console.log(industryres);
                                    });
                                }
                                if(activity[i] == 4) {
                                    Guest.find({}, function (err, guests) {
                                        guestres=guests;
                                        console.log("guests");
                                        console.log(guestres);
                                    });
                                }
                                if(activity[i] == 5) {
                                    Exam.find({},function (err, exams) {
                                        examres=exams;
                                        console.log("exmas");
                                        console.log(examres);
                                    });
                                }
                                if(activity[i] == 6) {
                                    Conference.find({},function (err, conferences) {
                                        conres=conferences;
                                        console.log("confers");
                                        console.log(conres);
                                    });
                                }

                            }
                        await sleep(30000);
                        console.log("outttt");
                        console.log(workres);


                        res.render('finalresult', {
                            workshops: workres,


                        });

              }

  });


router.post('/search/workshopoptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    console.log(startd);
    let endd= req.body.enddate//.toISOString();
    console.log(endd);
    let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {


        console.log("subject");
        console.log(subjectname);
        if ( subjectname!==null && subjectname!=='' ) {

            Workshop.find({$and: [{'date': {$lte: endd, $gte: startd}}, {'subject': subjectname}]}, {
                "_id": 0,
                "date":0
            }, function (err, workshop) {

                console.log(workshop);
                var model = mongoXlsx.buildDynamicModel(workshop);

                mongoXlsx.mongoData2Xlsx(workshop, model, workoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    console.log("printing filenale");
                    console.log(user.fileName);
                    res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);

                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });

            });

        }
        else{

            Workshop.find({'date': {$lte: endd, $gte: startd}}, {
                "_id": 0,
                "date": 0
            }, function (err, workshop) {

                //console.log(workshop);
                var model = mongoXlsx.buildDynamicModel(workshop);
                mongoXlsx.mongoData2Xlsx(workshop, model, workoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);
                });
            });
        }
    }

    });





router.post('/search/ivsoptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    console.log(startd);
    let endd= req.body.enddate//.toISOString();
    console.log(endd);
    let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {
        /*var options ={
            save:true,
            sheetName:[],
            fileName:"industryVisitop"+new Date().getTime()+".xlsx",
            path:"./storing",
            //path:"C:\\Users\\HP\\Documents\\excelsheets",
            defaultSheetName:"worksheet"
        }*/

        if ( subjectname!==null && subjectname!=='' ) {

            Industryvisit.find({$and: [{'date': {$lte: endd, $gte: startd}}, {'subject': subjectname}]}, {
                "_id": 0,
                "date": 0
            }, function (err, ivs) {

                console.log(ivs);
                var model = mongoXlsx.buildDynamicModel(ivs);


                mongoXlsx.mongoData2Xlsx(ivs, model, industryoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);


                });

            });

        }else {
            Industryvisit.find({'date': {$lte: endd, $gte: startd}}, {
                "_id": 0,
                "date": 0
            }, function (err, ivs) {

                console.log(ivs);
                var model = mongoXlsx.buildDynamicModel(ivs);


                mongoXlsx.mongoData2Xlsx(ivs, model, industryoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);


                });

            });



        }
        //upload.single(Model);

    }

});





router.post('/search/alloptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    console.log(startd);
    let endd= req.body.enddate//.toISOString();
    console.log(endd);
    //let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {


        Industryvisit.find({'date': {$lte: endd, $gte: startd}}, {
                "_id": 0,
                "date": 0
            }, function (err, ivs) {

                console.log(ivs);
                var model = mongoXlsx.buildDynamicModel(ivs);



                mongoXlsx.mongoData2Xlsx(ivs, model, industryoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);


                });

            });

        Workshop.find({'date': {$lte: endd, $gte: startd}}, {
            "_id": 0,
            "date": 0
        }, function (err, workshop) {

            console.log(workshop);
            var model = mongoXlsx.buildDynamicModel(workshop);


            mongoXlsx.mongoData2Xlsx(workshop, model, workoptions, function (err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);
            });
        });

        Seminar.find({$and: [{'date': {$lte: endd, $gte: startd}, 'subject': subjectname}]}, {
            "_id": 0,
            "date": 0
        }, function (err, seminar) {


            console.log(seminar);
            /* Generate automatic model for processing (A static model should be used) */
            //dpath=options;
            /* Generate Excel */
            var model = mongoXlsx.buildDynamicModel(seminar);

           /* var options = {
                save: true,
                sheetName: [],
                fileName: "seminarop" + new Date().getTime() + ".xlsx",
                path: "./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName: "worksheet"
            }*/

            mongoXlsx.mongoData2Xlsx(seminar, model, semoptions, function (err, user) {
                console.log('File saved at:', user.fullPath);


                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function (err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });

        Guest.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,guest) {

            console.log(guest);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(guest);

           /* var options ={
                save:true,
                sheetName:[],
                fileName:"guestlecture"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(guest, model,guestoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });



        Conference.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,conference) {

            console.log(conference);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(conference);

            /*var options ={
                save:true,
                sheetName:[],
                fileName:"conference"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(conference, model,confoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });

        Exam.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,exam) {

            console.log(exam);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(exam);

          /*  var options ={
                save:true,
                sheetName:[],
                fileName:"certifiedexams"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(exam, model,examoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });







    }


});










router.post('/search/seminaroptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
        let endd= req.body.enddate//.toISOString();
     let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {
        var model = mongoXlsx.buildDynamicModel(seminar);

        /*var options = {
            save: true,
            sheetName: [],
            fileName: "seminarop" + new Date().getTime() + ".xlsx",
            path: "./storing",
            //path:"C:\\Users\\HP\\Documents\\excelsheets",
            defaultSheetName: "worksheet"
        }*/


        if (subjectname !== null && subjectname !== '') {


            Seminar.find({$and: [{'date': {$lte: endd, $gte: startd}, 'subject': subjectname}]}, {
                "_id": 0,
                "date": 0
            }, function (err, seminar) {

                console.log(seminar);
                /* Generate automatic model for processing (A static model should be used) */
                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(seminar, model, semoptions, function (err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);


                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function (err, mongoData) {
                    console.log('Mongo data:', mongoData);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });

            });
        }
    }

});



router.post('/search/guestoptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    let endd= req.body.enddate//.toISOString();
    let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {


        Guest.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,guest) {

            console.log(guest);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(guest);

          /*  var options ={
                save:true,
                sheetName:[],
                fileName:"guestlecture"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(guest, model,guestoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });
    }

});



router.post('/search/conferenoptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    let endd= req.body.enddate//.toISOString();
    let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {


        Conference.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,conference) {

            console.log(conference);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(conference);

          /*  var options ={
                save:true,
                sheetName:[],
                fileName:"conference"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(conference, model,confoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });
    }

});




router.post('/search/examoptions',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {


    let errors = req.validationErrors();
    let startd= req.body.startdate//toISOString();
    let endd= req.body.enddate//.toISOString();
    let subjectname =req.body.wsubject;



    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {


        Exam.find({$and:[{'date': {$lte : endd , $gte :startd},'subject':subjectname}]},{"_id":0,"date":0},function (err,exam) {

            console.log(exam);
            /* Generate automatic model for processing (A static model should be used) */
            var model = mongoXlsx.buildDynamicModel(exam);

            /*var options ={
                save:true,
                sheetName:[],
                fileName:"certifiedexams"+new Date().getTime()+".xlsx",
                path:"./storing",
                //path:"C:\\Users\\HP\\Documents\\excelsheets",
                defaultSheetName:"worksheet"
            }*/
            //dpath=options;
            /* Generate Excel */
            mongoXlsx.mongoData2Xlsx(exam, model,examoptions, function(err, user) {
                console.log('File saved at:', user.fullPath);
                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const readstream = fileSystem.createReadStream(user.fullPath);
                readstream.pipe(res);

                fileSystem.unlinkSync(user.fullPath);


            });
            /* Read Excel */
            mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                console.log('Mongo data:', mongoData);
            });

        });
    }
    await sleep(10000);



});




/*
router.post('/search/user',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;
        var workres= [];
        var semres= [];
        var industryres= [];
        var guestres= [];

        var examres= [];
        var conres= [];

        console.log(activity);




        User.find({name : req.body.username},function (err, user) {
            console.log(user);

            for (let i = 0; i < activity.length; i++) {
                console.log("ac",activity[i]);
                if(activity[i] == 1) {
                    Workshop.find({attendee: user._id},{"_id":0,"date":0},function (err,workshop) {

                        console.log(workshop);
                        /* Generate automatic model for processing (A static model should be used) */
                       /* var model = mongoXlsx.buildDynamicModel(workshop);

                        var options ={
                            save:true,
                            sheetName:[],
                            fileName:"workshopop"+new Date().getTime()+".xlsx",
                            path:"./storing",
                            //path:"C:\\Users\\HP\\Documents\\excelsheets",
                            defaultSheetName:"worksheet"
                        }
                        //dpath=options;
                        /* Generate Excel */
                        /*mongoXlsx.mongoData2Xlsx(workshop, model,options, function(err, user) {
                            console.log('File saved at:', user.fullPath);

                        });
                        /* Read Excel */
                        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                            console.log('Mongo data:', mongoData);
                        });
                        //upload.single("Model");

                    });

                }
                if(activity[i] == 2) {
                    Seminar.find({conducted: user._id},{"_id":0,"date":0},function (err,seminar) {

                        console.log(seminar);

                        var model = mongoXlsx.buildDynamicModel(seminar);

                        var options ={
                            save:true,
                            sheetName:[],
                            fileName:"seminarop"+new Date().getTime()+".xlsx",
                            path:"./storing",
                            //path:"C:\\Users\\HP\\Documents\\excelsheets",
                            defaultSheetName:"worksheet"
                        }

                        mongoXlsx.mongoData2Xlsx(seminar, model,options, function(err, user) {
                            console.log('File saved at:', user.fullPath);

                        });
                        /* Read Excel */
                        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                            console.log('Mongo data:', mongoData);
                        });

                    });
                }
                if(activity[i] == 3) {
                    Industryvisit.find({attendee: user._id}, function (err, ivs) {
                        industryres=ivs;
                        console.log("industria");
                        console.log(industryres);
                    });
                }
                if(activity[i] == 4) {
                    /* Guest.find({attendee: user._id},{"_id":0,"date":0},function (err,guest) {

                        console.log(guest);
                        var model = mongoXlsx.buildDynamicModel(guest);

                        var options ={
                            save:true,
                            sheetName:[],
                            fileName:"guestlecture"+new Date().getTime()+".xlsx",
                            path:"./storing",
                            //path:"C:\\Users\\HP\\Documents\\excelsheets",
                            defaultSheetName:"worksheet"
                        }
                        //dpath=options;
                        /* Generate Excel */
                       /* mongoXlsx.mongoData2Xlsx(guest, model,options, function(err, user) {
                            console.log('File saved at:', user.fullPath);

                        });
                        /* Read Excel */
                        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                            console.log('Mongo data:', mongoData);
                        });

                    });
                }
                if(activity[i] == 5) {
                    Exam.find({"conducted": user._id},{"_id":0,"date":0},function (err,exam) {

                        console.log(exam);
                        /* Generate automatic model for processing (A static model should be used) */
                        /*var model = mongoXlsx.buildDynamicModel(exam);

                        var options ={
                            save:true,
                            sheetName:[],
                            fileName:"certifiedexams"+new Date().getTime()+".xlsx",
                            path:"./storing",
                            //path:"C:\\Users\\HP\\Documents\\excelsheets",
                            defaultSheetName:"worksheet"
                        }
                        //dpath=options;
                        /* Generate Excel */
                        /*mongoXlsx.mongoData2Xlsx(exam, model,options, function(err, user) {
                            console.log('File saved at:', user.fullPath);

                        });
                        /* Read Excel */
                        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                            console.log('Mongo data:', mongoData);
                        });

                    });
                }
                if(activity[i] == 6) {
                    Conference.find({"conducted": user._id},{"_id":0,"date":0},function (err,conference) {

                        console.log(conference);
                        /* Generate automatic model for processing (A static model should be used) */
                        /*var model = mongoXlsx.buildDynamicModel(conference);

                        var options ={
                            save:true,
                            sheetName:[],
                            fileName:"conference"+new Date().getTime()+".xlsx",
                            path:"./storing",
                            //path:"C:\\Users\\HP\\Documents\\excelsheets",
                            defaultSheetName:"worksheet"
                        }
                        //dpath=options;
                        /* Generate Excel */
                        /*mongoXlsx.mongoData2Xlsx(conference, model,options, function(err, user) {
                            console.log('File saved at:', user.fullPath);

                        });
                        /* Read Excel */
                        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                            console.log('Mongo data:', mongoData);
                        });

                    });
                }

            }




        });

        await sleep(100000)
        console.log("outttt");
        console.log(workres);

        res.render('finalresult', {
            workshops: workres,
            seminars: semres,
            ivs: industryres,
            conferences: conres,
            exams: examres,
            guests: guestres,

        });

        }

});


*/




                    /*const storage = new GridFsStorage({
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
                    });*/
//var upload = multer({ storage:storage });






/*router.post('/search',function (req,res,next) {

    let Model;


    User.find({},{"name":1,"username":1,"email":1,"_id":0},function (err,user) {

        console.log(user);
        /* Generate automatic model for processing (A static model should be used) */
        /*var model = mongoXlsx.buildDynamicModel(user);

        var options ={
            save:true,
            sheetName:[],
            fileName:"useractivity"+new Date().getTime()+".xlsx",
            path:"./storing",
            //path:"C:\\Users\\HP\\Documents\\excelsheets",
            defaultSheetName:"worksheet"
        }
        //dpath=options;
        /* Generate Excel */
       /* mongoXlsx.mongoData2Xlsx(user, model,options, function(err, user) {
            console.log('File saved at:', user.fullPath);
           console.log("user::"+user);
            console.log("model::"+model);
            Model=user;
            dpath= user.fullPath;
            //upload.single(model);
            console.log("options"+options);
            //console.log(multer(user));
            multer({ user:storage });
            console.log(multer(user));
        });
        /* Read Excel */
        /*mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
            console.log('Mongo data:', mongoData);
        });
        //upload.single("Model");
        console.log("Model::"+Model);
    });
    //upload.single(Model);
    console.log("Model_out::"+Model);

    res.render('download', {
        title: 'download-file',
        //link: dpath.fileName
        link1: dpath
    });

});
*/

router.post('/search/user',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;
        let viewd= req.body.viewdownload;

        var workres= [];
        var semres= [];
        var industryres= [];
        var guestres= [];

        var examres= [];
        var conres= [];

        console.log(activity);


          if(viewd == 1) {

              User.find({name: req.body.username}, function (err, user) {
                  console.log(user);

                  for (let i = 0; i < activity.length; i++) {
                      console.log("ac", activity[i]);
                      if (activity[i] == 1) {
                          Workshop.find({attendee: user._id}, function (err, workshops) {
                              workres = workshops;
                              console.log("workshop");
                              console.log(workres);
                          });
                      }
                      if (activity[i] == 2) {
                          Seminar.find({conducted: user._id}, function (err, seminars) {
                              semres = seminars;
                              console.log("seminar");
                              console.log(semres);
                          });
                      }
                      if (activity[i] == 3) {
                          Industryvisit.find({attendee: user._id}, function (err, ivs) {
                              industryres = ivs;
                              console.log("industria");
                              console.log(industryres);
                          });
                      }
                      if (activity[i] == 4) {
                          Guest.find({attendee: user._id}, function (err, guests) {
                              guestres = guests;
                              console.log("guests");
                              console.log(guestres);
                          });
                      }
                      if (activity[i] == 5) {
                          Exam.find({"conducted": user._id}, function (err, exams) {
                              examres = exams;
                              console.log("exmas");
                              console.log(examres);
                          });
                      }
                      if (activity[i] == 6) {
                          Conference.find({"conducted": user._id}, function (err, conferences) {
                              conres = conferences;
                              console.log("confers");
                              console.log(conres);
                          });
                      }

                  }


              });

              await sleep(30000)
              console.log("outttt");
              console.log(workres);


              res.render('finalresult', {
                  workshops: workres,

                  seminars: semres,
                  ivs: industryres,
                  conferences: conres,
                  exams: examres,
                  guests: guestres,

              });

          }
          else if(viewd == 2){

              User.find({name : req.body.username},function (err, user) {
                  console.log(user);

                  for (let i = 0; i < activity.length; i++) {
                      console.log("ac",activity[i]);
                      if(activity[i] == 1) {
                          Workshop.find({attendee: user._id},{"_id":0,"date":0},function (err,workshop) {

                              console.log(workshop);
/* Generate automatic model for processing (A static model should be used) */
                var model = mongoXlsx.buildDynamicModel(workshop);

                 //dpath=options;
                 /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(workshop, model,workoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);


                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });
                //upload.single("Model");

                });

                }
                if(activity[i] == 2) {
                Seminar.find({conducted: user._id},{"_id":0,"date":0},function (err,seminar) {

                console.log(seminar);

                var model = mongoXlsx.buildDynamicModel(seminar);


                mongoXlsx.mongoData2Xlsx(seminar, model,semoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

                });
                }
                if(activity[i] == 3) {
                Industryvisit.find({attendee: user._id}, function (err, ivs) {
                industryres=ivs;
                console.log("industria");
                console.log(industryres);


                    Industryvisit.find({$and: [{'date': {$lte: endd, $gte: startd}}, {'subject': subjectname}]}, {
                        "_id": 0,
                        "date": 0
                    }, function (err, ivs) {

                        console.log(ivs);
                        var model = mongoXlsx.buildDynamicModel(ivs);


                        mongoXlsx.mongoData2Xlsx(ivs, model, industryoptions, function (err, user) {
                            console.log('File saved at:', user.fullPath);
                            res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                            const readstream = fileSystem.createReadStream(user.fullPath);
                            readstream.pipe(res);

                            fileSystem.unlinkSync(user.fullPath);

                        });

                    });


                });
                }
                if(activity[i] == 4) {
                 Guest.find({attendee: user._id},{"_id":0,"date":0},function (err,guest) {

                console.log(guest);
                var model = mongoXlsx.buildDynamicModel(guest);


                //dpath=options;
                /* Generate Excel */
                 mongoXlsx.mongoData2Xlsx(guest, model,guestoptions, function(err, user) {
                     console.log('File saved at:', user.fullPath);
                     res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                     const readstream = fileSystem.createReadStream(user.fullPath);
                     readstream.pipe(res);

                     fileSystem.unlinkSync(user.fullPath);

                 });
                 /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

                });
                }
                if(activity[i] == 5) {
                Exam.find({"conducted": user._id},{"_id":0,"date":0},function (err,exam) {

                console.log(exam);
                /* Generate automatic model for processing (A static model should be used) */
                var model = mongoXlsx.buildDynamicModel(exam);


                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(exam, model,examoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

                });
                }
                if(activity[i] == 6) {
                Conference.find({"conducted": user._id},{"_id":0,"date":0},function (err,conference) {

                console.log(conference);
                /* Generate automatic model for processing (A static model should be used) */
                var model = mongoXlsx.buildDynamicModel(conference);


                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(conference, model,confoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

                });
                }

}




        });

            await sleep(30000)
            console.log("outttt");
            console.log(workres);

            res.render('modifiedadmin', {
                        title: 'Admin_activity'
            });


}

}



});




router.post('/search/user/sem',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


        User.find({name : req.body.username},function (err, user) {
            console.log(user);
            Seminar.find({conducted: user._id},{"_id":0,"date":0},function (err,seminar) {

                console.log(seminar);

                var model = mongoXlsx.buildDynamicModel(seminar);


                mongoXlsx.mongoData2Xlsx(seminar, model,semoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });


            });


        });

        await sleep(30000)

    }


});





router.post('/search/user/ww',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


            User.find({name : req.body.username},function (err, user) {
                console.log(user);

                        Workshop.find({attendee: user._id},{"_id":0,"date":0},function (err,workshop) {

                            console.log(workshop);
                            /* Generate automatic model for processing (A static model should be used) */
                            var model = mongoXlsx.buildDynamicModel(workshop);

                            //dpath=options;
                            /* Generate Excel */
                            mongoXlsx.mongoData2Xlsx(workshop, model,workoptions, function(err, user) {
                                console.log('File saved at:', user.fullPath);

                                res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                                const readstream = fileSystem.createReadStream(user.fullPath);
                                readstream.pipe(res);

                                fileSystem.unlinkSync(user.fullPath);


                            });


                        });


            });

            await sleep(30000)

        }


});




router.post('/search/user/ex',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


        User.find({name : req.body.username},function (err, user) {
            console.log(user);

            Exam.find({"conducted": user._id},{"_id":0,"date":0},function (err,exam) {

                console.log(exam);
                /* Generate automatic model for processing (A static model should be used) */
                var model = mongoXlsx.buildDynamicModel(exam);


                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(exam, model,examoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

            });


        });

        await sleep(30000)

    }


});




router.post('/search/user/guest',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


        User.find({name : req.body.username},function (err, user) {
            console.log(user);


            Guest.find({attendee: user._id},{"_id":0,"date":0},function (err,guest) {

                console.log(guest);
                var model = mongoXlsx.buildDynamicModel(guest);


                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(guest, model,guestoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

            });
        });

        await sleep(30000)

    }


});




router.post('/search/user/conf',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


        User.find({name : req.body.username},function (err, user) {
            console.log(user);

            Conference.find({"conducted": user._id},{"_id":0,"date":0},function (err,conference) {

                console.log(conference);
                /* Generate automatic model for processing (A static model should be used) */
                var model = mongoXlsx.buildDynamicModel(conference);


                //dpath=options;
                /* Generate Excel */
                mongoXlsx.mongoData2Xlsx(conference, model,confoptions, function(err, user) {
                    console.log('File saved at:', user.fullPath);
                    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                    const readstream = fileSystem.createReadStream(user.fullPath);
                    readstream.pipe(res);

                    fileSystem.unlinkSync(user.fullPath);

                });
                /* Read Excel */
                mongoXlsx.xlsx2MongoData("./file.xlsx", model, function(err, mongoData) {
                    console.log('Mongo data:', mongoData);
                });

            });

        });

        await sleep(30000)

    }


});


router.post('/search/user/iv',async(req,res)=> {

    let errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            errors: errors
        });
    }
    else {

        //let uname = req.body.username;
        let activity=req.body.activity;


        console.log(activity);


        User.find({name : req.body.username},function (err, user) {
            console.log(user);

            Industryvisit.find({attendee: user._id}, function (err, ivs) {
                industryres=ivs;
                console.log("industria");
                console.log(industryres);


                Industryvisit.find({$and: [{'date': {$lte: endd, $gte: startd}}, {'subject': subjectname}]}, {
                    "_id": 0,
                    "date": 0
                }, function (err, ivs) {

                    console.log(ivs);
                    var model = mongoXlsx.buildDynamicModel(ivs);


                    mongoXlsx.mongoData2Xlsx(ivs, model, industryoptions, function (err, user) {
                        console.log('File saved at:', user.fullPath);
                        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader("Content-Disposition","attachment;filename="+user.fullPath);

                        const readstream = fileSystem.createReadStream(user.fullPath);
                        readstream.pipe(res);

                        fileSystem.unlinkSync(user.fullPath);

                    });

                });


            });

        });

        await sleep(30000)

    }


});



module.exports = router ;