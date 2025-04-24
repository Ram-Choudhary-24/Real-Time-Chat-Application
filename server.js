const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users = {};

// Serve static files from the "public" folder
app.use(express.static('public'));

io.on('connection', socket => {
    console.log("New connection:", socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = 8000;
http.listen(PORT, () => {
    console.log(`🚀 Server running at ip-address:${PORT}`);
});
