const { Server } = require('socket.io');
const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync('/mnt/Repos/.certs/192.168.100.100-key.pem'),
    cert: fs.readFileSync('/mnt/Repos/.certs/192.168.100.100.pem')
}
const httpsServer = https.createServer(options, (req, res) => {
    res.writeHead('200');
    res.end('Servidor Socket.IO activo');
})
const io = new Server(httpsServer, {cors: {origin: '*'}});
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

httpsServer.listen(port, () => {
    console.log('Servidor HTTPS iniciado');
})
