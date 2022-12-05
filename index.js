let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    // io.sockets.emit('msg', socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //when the server gets the rolled dice object from the client, push it back out to all the other sockets
    socket.on('diceRolled', function(diceNums){
        console.log("update dice " + diceNums);
        io.sockets.emit('updateDice', diceNums);
    });

    socket.on('marks', function(id) {
        io.sockets.emit('updateMarks', id);
        console.log(id);
    });

    socket.on('unMarks', function(id) {
        io.sockets.emit('updateUnMarks',id);
        console.log("unmark me");
    });


    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});