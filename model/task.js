const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    task:{
        type:String,
        require:true
    },
    user:{
        type:String,
        default:null
    }
},{timestamps: true, versionkey: false})

module.exports=mongoose.model('TaskData',taskSchema)