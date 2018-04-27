var {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/STUDENT',(err, client)=>{
    if(err){
        return console.log('unable to connect',err);
    }
    console.log('Connected to mongodb');
    // var db=client.db('STUDENT');

    // db.collection('student').insertOne({
    //     // _id:'12',
    //     sno:1,
    //     sname:'yash',
    //     age:21
    // },(err,result)=>{
    //     if(err){
    //         return console.log('unable to insert',err);
    //     }   
    //     console.log(JSON.stringify(result.ops[0]._id, undefined ,2));
    // });

    client.close();
})