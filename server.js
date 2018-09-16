const express = require('express'); // Só para rota
const path = require('path'); // Padrão do Node

const app = express();

/* Informar a porta/protocolo para o websocket(protocolo)  */
const server = require('http').createServer(app);
const io = require('socket.io')(server);

/* Dizendo aonde ficará os arquivo(views)*/
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* Renderizando para index */
app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
 console.log(`Socket conectado: ${socket.id}`);

 socket.emit('previousMessages', messages);

 socket.on('sendMessage', data => {
   messages.push(data);
   socket.broadcast.emit('receivedMessage', data);
 });
});

server.listen(3000);
