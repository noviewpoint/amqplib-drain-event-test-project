// queue only available locally in this module
const queue = [];

class QueueElement {
    constructor(methodToExecute, resolve, tries = 3) {
        this.methodToExecute = methodToExecute;
        this.resolve = resolve;
        this.tries = tries;
    }
}

// fake drain events from channel here

setInterval(() => {
    
    const element = queue[0];
    if (!element) {
        return;
    }

    const { methodToExecute, resolve } = element;

    element.tries--;

    const sent = methodToExecute();
    if (sent || element.tries < 1) {
        // all ok, message was sent
        // OR
        // after many tries with no success

        // remove first element from queue in both cases
        queue.shift();

        // successfully resolve with true or false (depends on the case)
        return resolve(sent);
    }

}, 10);

const sendMessage = (msg) => {
    console.log(`Trying to send message "${msg}"`);
    return Math.random() >= 0.5;
};

module.exports = (x) => new Promise(resolve => {
    console.log(`Processing message "${x}"`);
    const methodToExecute = sendMessage.bind(null, x); // must bind this from channel here!
    return queue.push(new QueueElement(methodToExecute, resolve));
    // this promise resolve is now available in queue Array
});