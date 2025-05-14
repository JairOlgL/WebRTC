const { Server } = require('socket.io');

const io = new Server({cors: {origin: '*'}});
const port = 6532;

io.on('connection', socket => {
    console.log(`Usuario ${socket.id} conectado.`);
    io.to(socket.id).emit('getID', socket.id);
    socket.on('video1', video => {
        io.emit('video2', video)
    })
})

io.listen(port);