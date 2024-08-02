const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: 'https://shopiishop.web.app/',
    methods: ['GET', 'POST', 'PUT','DELETE'],
    credentials : true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = { app, server, io };
