# amqplib-drain-event-test-project

Problem: when you call publish or sendToQueue in ampqlib, they return either true or false. If the returned value is false,
you should wait for the drain event before calling publish or sendToQueue again.

If you wrap publish or sendToQueue calls inside a Promise to wait for the drain event inside it if the returned value is false,
you must dynamically create a new event listener for the drain event (risking memory leak if there are many Promises like this) 
and also, when this drain event occurs, it might occur for a 100 other Promises you created... so if you call sendToQueue or publish again,
you might again, get false. And so on and so on.

My solution:

I have a module called sender.js. Inside this module there is a local queue variable. Every time my users call send function 
(this function is the only thing exposed to users), this function returns a Promise and then inside this Promise I push it's
executor resolve argument to the queue. Because this argument is not invoked, nothing happens yet. Somebody must take this 
resolve from the queue and invoke it to "end the Promise" :)

Every time drain event occurs, one element is taken from the queue and sendToQueue / publish is called. If it fails, I try again later.
If it fails 3 times, I resolve with false. If it passes, I resolve with true.

I don't know if this is the correct solution to this problem, but there is just something really simple about this code I really like.
For the outside world, sender.js is behaving like any other async function (no events, stream, generators or any other complex beasts...).

this project and readme is incomplete atm
