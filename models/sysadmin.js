const mongoose=require('mongoose');

const AdminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    code:{
        type:Number,
        required:true
    }

});

const Sysadmin=module.exports=mongoose.model('Sysadmin',AdminSchema);