const sender = require("./sender.js");

const init = async () => {

    for (let i = 0; i < 3; i++) {
        const msg = `#${i} / user1`;
        const status = await sender(msg);
        console.log(`Message "${msg}" was sent: ${status}`);
    }

};

init()
    .then(ok => {
        if (ok) {
            console.log(ok);
        }
    })
    .catch(err => {
        console.error(err);
    });