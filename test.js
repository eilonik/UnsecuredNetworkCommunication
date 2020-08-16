const challange = require('./rsa');

const test = challange()
    .then((ch) => {
        enc = ch.encrypt('hello world');
        console.log(ch.decrypt(enc).toString());
    })
    .catch((e) => {
            console.log(e);
        }
);