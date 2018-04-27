var {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/STUDENT',(err, client)=>{
    if(err){
        return console.log('unable to connect',err);
    }
    console.log('Connected to mongodb');
    var db=client.db('STUDENT');

 db.collection('student').deleteOne({sname:'yash'}).then((result)=>{
     console.log(result);
 })
    
    // client.close();
})