module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('joinRoom', function(room) {
      socket.join(room);
      console.log(socket.id + ' joined ' + room);
    });
  });
};