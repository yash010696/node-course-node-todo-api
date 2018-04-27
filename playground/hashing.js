var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    console.log('////////////////');
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});


var hashpasswrod = '$2a$10$EbcCUdfULb/OZ1Sy0J9RPOSTxVE4mIXzgPZwcg1gcpKKMLl3NmLUe';


// It returns the boolean value true or false
bcrypt.compare(password, hashpasswrod, (err, res) => {
    console.log(res);
});




// var data={
//     id:10
// }

// var token=jwt.sign(data,'123abc');
// console.log(token);

// var decoded=jwt.verify(token,'123abc');
// console.log('decoded:',decoded);
