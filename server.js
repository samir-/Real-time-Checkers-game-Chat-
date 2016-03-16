var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');
var http = require('http'); //the variable doesn't necessarily have to be named http
// Chargement du fichier index.html affiché au client
var port = process.env.PORT || 8080;

var server = http.createServer(function (req, res) {
console.log(req.url);

      fs.readFile(__dirname + '/public'+req.url, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

}).listen(port, 'localhost');
console.log('Server running at http://localhost/index.html');

var pseudos = ["--", "--"];
var s = "room";
var counter = 1;
var turn = 0;
var player = 0;
// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    // Quand on client se connecte, on lui envoie un message
    socket.emit('message', 'Vous êtes bien connecté ! ');
    //(counter-1)%2 + 1 ) : est une fonction surjective qui donne f(x)=1 si x impaire  , f(x)=2 si x paire 
    socket.emit('player', (counter - 1) % 2 + 1);

    // On signale aux autres clients qu'il y a un nouveau venu
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        counter++;
        s += parseInt((counter) / 2);
        socket.join(s);
        socket.broadcast.to(s).emit('nouveau_client', pseudo);
        socket.broadcast.to(s).emit('me', 'Un autre client ' + pseudo + ' vient de se connecter ! ');
        console.log(s + "+++++++++++++");
        pseudos.push(pseudo);
        s = "room";
    });
    ///recevoir la matrice 
    socket.on('matrix', function(corematrix, pseudo) {
        var number_8 = 8
        var sortie = " ";
        var indice1=0,indice2=0;
        for (var i = 0; i < number_8; i++) {
            for (var j = 0; j < number_8; j++) {
              if(Math.abs(corematrix[i][j])==1||Math.abs(corematrix[i][j])==3) indice1++;
              if(Math.abs(corematrix[i][j])==2||Math.abs(corematrix[i][j])==4) indice2++;
            }


        }
        console.log("///////////////////////////////");
        console.log("///////////////////////////////");
        console.log("///////////////////////////////");

        var d = parseInt((pseudos.indexOf(pseudo)) / 2);
        console.log("room" + d);
        socket.broadcast.to("room" + d).emit('matrix', corematrix);
console.log(indice1+" "+indice2);
                if(indice1*indice2==0){

if(indice1==0){
        socket.broadcast.to("room" + d).emit('gameover', player);
        socket.emit('win', player);

}
if(indice2==0){
        socket.broadcast.to("room" + d).emit('win', player);
        socket.emit('gameover', player);

}

        }


    });
    socket.on('next', function(pseudo,i) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        var d = parseInt((pseudos.indexOf(pseudo)) / 2);
        console.log("next " + pseudo+" "+i);
        socket.broadcast.to("room" + d).emit('next', pseudo);

    });
 socket.on('chat', function(string_chat,pseudo) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        var d = parseInt((pseudos.indexOf(pseudo)) / 2);
        socket.broadcast.to("room" + d).emit('chat',string_chat,pseudo);
    });
 
});
