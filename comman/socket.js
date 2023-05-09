module.exports = function (server) {
    global.io = require("socket.io")(server)

    io.on("connection", (socket) => {
        // socket.emit("hello", "world")
        socket.join(socket.handshake.query.userId);
        io.to(socket.handshake.query.userId).emit("hello", "worcsdvsdcvdfcvvvld");
    });
}