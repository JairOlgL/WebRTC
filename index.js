const { Server } = require('socket.io');

const io = new Server({cors: {origin: '*'}});
const port = 6532;

io.on('connection', socket => {
    console.log(`Usuario ${socket.id} conectado.`);
    io.to(socket.id).emit('getID', socket.id);
    socket.on('video1', video => {
        io.emit('video2', video)
    })
    socket.on('signal', ({offer, answer, idEmisor, idReceptor, candidate}) => {
        if(offer && idReceptor) io.to(idReceptor).emit('signal', {offer, idEmisor: socket.id})
        if(answer && idEmisor) io.to(idEmisor).emit('signal', {answer});
        if(candidate && idReceptor) io.to(idReceptor).emit('signal', {candidate});
    })
})

io.listen(port);