var {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/STUDENT',(err, client)=>{
    if(err){
        return console.log('unable to connect',err);
    }
    console.log('Connected to mongodb');
    var db=client.db('STUDENT');

    db.collection('student').find().toArray().then((docs)=>{
        console.log("Student:",docs.length);
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('unable to fetch data',err);
    })
    
    
    // client.close();
})