var  mongoose=require('mongoose');
var User=require('./user');

console.log('in studenet');

var student = mongoose.model('student1',{
    sno:{
        type:Number,
        default:null
    },
    sname:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    age:{
        type:Number,
        default:null
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId  ,
        ref:'User',
        required:true
    }
});

module.exports={
    student
};