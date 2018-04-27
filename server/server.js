require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { student } = require('./models/student');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');


var app = express();

app.use(bodyParser.json());

app.post('/student', authenticate, (req, res) => {
    console.log('in post');
    console.log(req.body);

    req.body._creator = req.user._id;

    var Student = new student(req.body);

    Student.save().then((doc) => {
        console.log('res frm db');
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/student', authenticate, (req, res) => {
    student.find({
        _creator: req.user._id
    }).then((doc) => {
        res.send({ doc });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/student/:id', authenticate, (req, res) => {
    var id = req.params.id;
    console.log("*********", id);
    // if(!ObjectID.isValid(id)){
    //     return res.status(404).send('Invalid id')
    // }

    student.findOne({
        _id: id,
        _creator: req.user._id
    }).then((Student) => {
        if (!Student) {
            res.status(404).send('No Student');
        }

        res.send({ Student });
    }).catch((e) => {
        res.status(400).send();
    })

});

app.delete('/student/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid Id");
    }
    student.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((Student) => {
        if (!Student) {
            res.status(404).send('No Student');
        }
        res.send(Student);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/student/:id', authenticate, (req, res) => {
    var id = req.params.id;
    // var body=_.pick(req.body,['sno','sname','age']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid Id");
    }

    student.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    },
        { $set: req.body },
        { new: true }).then((Student) => {
            if (!Student) {
                res.status(404).send('No Student');
            }
            res.send(Student);

        }).catch((err) => {
            res.status(400).send();
        })
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//POST/USERS
app.post('/user', (req, res) => {
    // var body = _.pick(req.body, ['email', 'password']);
    console.log("/////////", req.body);
    var user = new User(req.body);

    user.save().then((user) => {
        // res.send(user);
        return user.generateAutoToken().then((token) => {
            console.log("//////", token);
            res.header('x-auth', token).send(user);
        })
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/user/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.get('/user', (req, res) => {
    console.log("in userrr");
    User.find().then((user) => {
        res.send({ user });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/user/login', (req, res) => {
    // var body = _.pick(req.body, ['email', 'password']);
    // res.send(req.body);

    User.findByCrediantials(req.body.email, req.body.password).then((user) => {
        console.log("***************", user.email, '*********************');
        return user.generateAutoToken().then((token) => {
            console.log("1111111111111111", token);
            res.header('x-auth', token).send(user);
        })

    }).catch((err) => {
        res.status(400).send(err);
    })

});

app.delete('/user/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(3000, () => {
    console.log("Server Started at port 3000");
});