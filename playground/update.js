var {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/STUDENT',(err, client)=>{
    if(err){
        return console.log('unable to connect',err);
    }
    console.log('Connected to mongodb');
    var db=client.db('STUDENT');

 db.collection('student').findOneAndUpdate({
     sno:1
 },{
     $set:{
         sname:'vipul roy',
         place:'pune'
    },
     $inc:{age:1}
 },{
     returnOriginal:false
 }).then((result)=>{
     console.log("*****",result);
 })
    
    // client.close();
})