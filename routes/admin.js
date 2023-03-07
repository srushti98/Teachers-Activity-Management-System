var express = require('express');
var router = express.Router();
var ArrayList=require('arraylist');
//var sleep= require('sleep');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

//let Article= require('../models/article');
let User= require('../models/user');

let Workshop= require('../models/workshop');
let Seminar= require('../models/seminar');
let Industryvisit= require('../models/industryvisit');
let Guest = require('../models/guest');
let Exam = require('../models/exam');
let Conference = require('../models/conference');

router.get('/search',function (req,res,next) {
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

        /* res.render('search',{
             title: 'searching '
         });*/
    });
});


router.post('/search',async(req,res)=> {
//outer.post('/examform',cpUpload,function (req,res) {
    var count = 0;
    if (req.checkBody('username').notEmpty()) {
        count++;
    }
    else if (req.checkBody('activity').notEmpty()) {
        count++;
    }
    console.log(count);


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
                    Workshop.find({attendee: user._id}, function (err, workshops) {
                        workres=workshops;
                        console.log("workshop");
                        console.log(workres);
                    });
                }
                if(activity[i] == 2) {
                    Seminar.find({conducted: user._id},function (err, seminars) {
                        semres=seminars;
                        console.log("seminar");
                        console.log(semres);
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
                    Guest.find({attendee: user._id}, function (err, guests) {
                        guestres=guests;
                        console.log("guests");
                        console.log(guestres);
                    });
                }
                if(activity[i] == 5) {
                    Exam.find({"conducted": user._id},function (err, exams) {
                        examres=exams;
                        console.log("exmas");
                        console.log(examres);
                    });
                }
                if(activity[i] == 6) {
                    Conference.find({"conducted": user._id},function (err, conferences) {
                        conres=conferences;
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



});
module.exports = router ;