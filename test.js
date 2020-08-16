const challange = require('./challenger');

const test = challange()
    .then((ch) => {
        enc = ch.encrypt('hello world');
        console.log(ch.decrypt(enc).toString())
    })
    .catch((e) => {
            console.log(e);
        }
);