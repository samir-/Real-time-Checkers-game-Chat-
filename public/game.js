    
    var g=0;
        var a = 0,clic = 0;
        var xi = 0,yi = 0;
        var xf = 0,yf = 0;
        var temp = 0;
        var h = 60 , w = h ,isyourturn=1;
        var xz, yz;
        var number_8 = 8;
        var turn_of = 1;
        var player = 1;
        var turn =1;
        var myturn=0;
        var begin =0;
        var last_xf=-1,last_yf=-1;
        var corematrix = new Array(number_8);
        for (var i = 0; i < number_8; i++) {
            corematrix[i] = new Array(number_8);
        }
        //remplir la matrice initial
        for (var i = 0; i < number_8; i++) {
            for (var j = 0; j < number_8; j++) {
                if ((i % 2) ^ (j % 2) && (i < 3)) corematrix[i][j] = 1;
                else if ((i % 2) ^ (j % 2) && (i > 4)) corematrix[i][j] = 2;
                else corematrix[i][j] = 0;
            };
        };

        var socket = io.connect('http://localhost:8080');
        // On demande le pseudo au visiteur...
        var pseudo = prompt('Quel est votre pseudo ?');
        var motdepasse = prompt('Quel est votre mot de passe ?');

        // Et on l'envoie avec le signal "petit_nouveau" (pour le différencier de "message")
        socket.emit('petit_nouveau', pseudo);
        // On affiche une boîte de dialogue quand le serveur nous envoie un "message"
socket.on('message',function(s){

    swal(s+" et votre ADVERSAIRE est pret ! "," ","success");
});
        socket.on('player', function(x) {
            player = x;
                  if(player == 2 ) {initial_dama();isyourturn=2;myturn=false;  }
            if (player == 1 )     swal("CONNECTED , waiting for opponent  :) "," " , "success");
            //alert("your turn is : " + turn);º
        })
        socket.on('me', function(message) {
            swal({   title: message ,   text: "---",   imageUrl: "imagee.jpg" });
                initial_dama();
                begin=0;
                myturn=true;

            })
        socket.on('next',function(x){
            myturn=true;
            document.getElementById("turni").innerHTML="your turn ";
            if(gamefinished()){alert("gameover");}

        }
        )
        // Lorsqu'on clique sur le bouton, on envoie un "message" au serveur

        socket.on('matrix', function(socketmatrix) {
                var sortie = " ";
                for (var i = 0; i < number_8; i++) {
                    for (var j = 0; j < number_8; j++) {
                        sortie += " " + socketmatrix[i][j] + " ";

                        //logic 

                        if (socketmatrix[i][j] != corematrix[i][j]) {
                            corematrix[i][j] = socketmatrix[i][j];
                          draw_from_data(i , j, socketmatrix);

                        }

                    }
                    console.log(sortie);
                    sortie = " ";
                }
                console.log("///////////////////////////////");
                console.log("///////////////////////////////");
                console.log("///////////////////////////////");
            })
            //initialisation des matrices

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var x = 0,
            y = 0;

        function valid_cell(i, j) {
            if (((i % 2) ^ (j % 2))) return 1;
            return 0;
        }

        function draw_arenacell(j, i) {
            ctx.fillStyle = ((i % 2) ^ (j % 2)) ? "#000000" : "#AAB5B4";
            ctx.fillRect(w * i, w * j, w, w);
        }

        //draw the base arena
        for (var i = 0; i < number_8; i++) {
            for (var j = 0; j < number_8; j++) {
                draw_arenacell(i, j)
            }
        }
        //init the checkers in the arena 
        function initial_dama() {

            for (var i = 0; i < number_8; i++) {
                for (var j = 0; j < number_8; j++) {
                    if (i < 3) draw_circle(i, j, 1, 1);
                    if (i > 4) draw_circle(i, j, 1, 2);
                };
            }
            ctx.font = "60px Arial bold";
            ctx.fillText("YOU ", 850, 150);
            //drawing the logo of AI 
            var context = canvas.getContext('2d');
            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(imageObj, 800, 600);
            };

        }

        ////////////////////////////////


        function draw_black(i, j) {
                var canvas = document.getElementById("myCanvas");
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = ((i % 2) ^ (j % 2)) ? "#000000" : "#AAB5B4";
                ctx.fillRect(w * i, w * j, w, w);
            }
            //
        function draw_circle(j, i, k, player) {

            if (i % 2 != j % 2) {
                draw_void(j, i);
                ctx.fillStyle = "black";
                ctx.fillRect(w * i, w * j, w, w);

                var context = canvas.getContext('2d');
                var centerX = w * i;
                var centerY = w * j;
                var radius = 22;
                context.beginPath();
                context.arc(centerX + 30, centerY + 30, radius, 0, 2 * Math.PI, false);
                if (Math.abs(corematrix[j][i]) == 1) {context.fillStyle = "#3D83EF";
                                                        context.fill();
            }
                if (Math.abs(corematrix[j][i]) == 2) {context.fillStyle = "#DF3A42";          context.fill();
            }
                if (Math.abs(corematrix[j][i]) == 3) {context.fillStyle = "#0074D9";     

                                context.fill();
                context.fillStyle = "black";
context.font="30px Georgia";
context.fillText("K",centerX +22, centerY + 40);
            }
                if (Math.abs(corematrix[j][i]) == 4) {
                                        context.fillStyle = "#85144b";
                                                        context.fill();


                    context.fillStyle = "black";
context.font="20px Georgia";
context.fillText("K",centerX + 25, centerY + 40);

            }
                context.lineWidth = 4;
                if (k == 1 ) {
                    context.strokeStyle = '#3D9970';
                } else context.strokeStyle = '#FFD300';
                context.stroke();

            }

        }

        function draw_void(j, i) {
            var centerX = w * i;
            var centerY = w * j;
            ctx.clearRect(centerX, centerY, h, w);
        }

        ////////////////////////////////////////////////////////////////
        //for mouse listener 
        document.addEventListener("DOMContentLoaded", init, false);

        function init() {
            var canvas = document.getElementById("myCanvas");
            canvas.addEventListener("mousedown", getPosition, false);
        }

        function getPosition(event) {
                var x = event.x;
                var y = event.y;
                var canvas = document.getElementById("myCanvas");
                x -= canvas.offsetLeft;
                y -= canvas.offsetTop;
                //this line is for swapping two variables 
                x = Math.floor(x / 60);
                y = Math.floor(y / 60);
                //x et y sont en entier
                var f = x;
                x = y;
                y = f;
                //x et y 
                
                if ((corematrix[x][y]%2 == player%2||corematrix[x][y]==0) && myturn) {
                    proceed(x, y);

                    //temp sert a sauvegarder la derniere cell clique valide 
                    if (!temp) {
                        xi = x;
                        yi = y;
                    } else {
                        xi = xz;
                        yi = yz;
                    }

                }

            }
            ////////////////////////////////////////////////////////////////////////////////////////
            //defin the core matrix 
            //the 1 is for player 1 , the 2 is for player 2 , 0 is for empty cell ////////
        function alt_circle(i, j) {
            //tirer l'etat precesente du ckecker 
            var state = 0;
            state = Math.abs(corematrix[i][j]) / -corematrix[i][j];
            draw_circle(i, j, state, Math.abs(corematrix[i][j]));
            corematrix[i][j] *= -1;

        }

        function reset_circle(i, j) {
            //tirer l'etat precesente du ckecker 
            var state = 1;
            draw_circle(i, j, state, Math.abs(corematrix[i][j]));
            corematrix[i][j] = Math.abs(corematrix[i][j]);
        }

        function proceed(i, j) {

            temp = 0;
            xf = i;
            yf = j;
            //console.log(xi + "..." + yi + "..." + "..." + corematrix[xi][yi] + "..." + xf + "..." + yf + "..." + corematrix[xf][yf] + "is valid " + is_valid_move(xi, yi, xf, yf));
            //if we click on a cell 
            if (xi == xf && yi == yf && corematrix[xi][yi] != 0 && g==0) {
                alt_circle(xf, yf);
            } else if (corematrix[xf][yf] != 0 && corematrix[xi][yi] == 0&&g==0) {
                alt_circle(xf, yf);
            } else if (corematrix[xf][yf] != 0 && corematrix[xi][yi] != 0&&g==0) {
                alt_circle(xf, yf);
                if (corematrix[xi][yi] < 0) alt_circle(xi, yi);
            } else if (corematrix[xf][yf] == 0 && corematrix[xi][yi] != 0) {
                if (is_valid_move(xi, yi, xf, yf)&&g==0) {

                    if ((xf == number_8 - 1 && Math.abs(corematrix[xi][yi]) == 1) || (xf == 0 && Math.abs(corematrix[xi][yi]) == 2)) {
                        if (corematrix[xi][yi] > 0) {
                            corematrix[xf][yf] = corematrix[xi][yi] - 2;
                        } else {
                            corematrix[xf][yf] = corematrix[xi][yi] - 2;
                        }
                    } else {
                        corematrix[xf][yf] = corematrix[xi][yi];
                    }
                    draw_arenacell(xi, yi);
                    draw_circle(xf, yf, -1, Math.abs(corematrix[xi][yi]));
                    corematrix[xi][yi] = 0;
                         socket.emit('next',pseudo,'1');
                                     last_xf=-1;last_yf=-1;g=0;
                                     document.getElementById("turni").innerHTML="oppenent turn ";


                         myturn =false;
                } else if (is_valid_eat(xi, yi, xf, yf)) {
                        console.log("?????????????????????"+last_xf+"  "+xi+" "+last_yf+" "+yi+"???????????????");
                    if((last_xf!=xi||last_yf!=yi)&&last_xf!=-1&&last_yf!=-1){
                         socket.emit('next',pseudo,'2');g=0;
                                                              document.getElementById("turni").innerHTML="oppenent turn ";

                         myturn=false;
                         last_xf=-1;last_yf=-1;
                    }
                    else {
                    last_xf=xf;last_yf=yf;
                    if ((xf == number_8 - 1 && Math.abs(corematrix[xi][yi]) == 1) || (xf == 0 && Math.abs(corematrix[xi][yi]) == 2)) {
                        if (corematrix[xi][yi] > 0) {
                            corematrix[xf][yf] = corematrix[xi][yi] - 2;
                        } else {
                            corematrix[xf][yf] = corematrix[xi][yi] - 2;
                        }
                    } else {
                        corematrix[xf][yf] = corematrix[xi][yi];
                    }
                    corematrix[(xi + xf) / 2][(yi + yf) / 2] = 0;
                    corematrix[xi][yi] = 0;
                    draw_arenacell(xi, yi);
                    draw_arenacell((xi + xf) / 2, (yi + yf) / 2);
                    draw_circle(xf, yf, -1, Math.abs(corematrix[xi][yi]));
                    if(!possible_eat(last_xf,last_yf)) { socket.emit('next',pseudo,'3');
                                                         document.getElementById("turni").innerHTML="oppenent turn ";

                         myturn =false;
                         g=0;
                                                  last_xf=-1;last_yf=-1;

                     }
                     else g=0;
                } 

            


            }


        else {
                    temp = 1;
                    xz = xi;
                    yz = yi;
                }
            }
            var sortie = " ";
            for (var i = 0; i < number_8; i++) {
                for (var j = 0; j < number_8; j++) {
                    sortie += " " + corematrix[i][j] + " ";
                }
                console.log(sortie);
                sortie = " ";
            }

            console.log("///////////////////////////////");
            console.log("///////////////////////////////");
            console.log("///////////////////////////////");
                            socket.emit('matrix', corematrix, pseudo);


        }


        function is_valid_move(xi, yi, xf, yf) {
            if (Math.abs(corematrix[xi][yi]) == 3 || Math.abs(corematrix[xi][yi]) == 4) {

                return (Math.abs(xi - xf) == 1 && Math.abs(yi - yf) == 1)
            }
            if (Math.abs(corematrix[xi][yi]) == 1) {

                return (xi + 1 == xf && Math.abs(yi - yf) == 1)
            }
            if (Math.abs(corematrix[xi][yi]) == 2) {
                return (xi - 1 == xf && Math.abs(yi - yf) == 1);
            }

        }

        function is_valid_eat(xi, yi, xf, yf) {

            if (Math.abs(corematrix[xi][yi]) == 4) {
              
                return  Math.abs(corematrix[(xi + xf)/2][(yi + yf) / 2]) % 2 == 1 ;

            }

            if (Math.abs(corematrix[xi][yi]) == 3) {
                return  Math.abs(corematrix[(xi + xf)/2][(yi + yf) / 2]) % 2 == 0 && Math.abs(corematrix[(xi + xf)/2][(yi + yf) / 2]) !=0 ;

            }

            if (Math.abs(corematrix[xi][yi]) == 1) {
                console.log()
                return (xi + 2 == xf && Math.abs(yi - yf) == 2 && Math.abs(corematrix[xi + 1][(yi + yf) / 2]) % 2 == 0&&corematrix[xi + 1][(yi + yf) / 2]!=0);
            }
            if (Math.abs(corematrix[xi][yi]) == 2) {

                return (xi - 2 == xf && Math.abs(yi - yf) == 2 && Math.abs(corematrix[xi - 1][(yi + yf) / 2]) % 2 == 1);
            }
            return false;
        }

        function can_eat(x, y, player) { //Détecte si un pion en x,y a un truc a manger
            for (var i = 0; i < number_8; i++) {
                for (var j = 0; j < number_8; j++) {
                    if (is_valid_eat(x, y, i, j)) {
                        return (true);
                    }
                }
            }
            return (false);
        }

        function there_is_valid_eat(player) { //Détecte si le joueur player a quelquechose a manger
            var i = 0;
            var j = 0;
            for (var i = 0; i < number_8; i++) {
                for (var j = 0; j < number_8; j++) {
                    if (i % 2 == j % 2) {
                        return (can_eat(x, y, player));
                    }
                }
            }
            return (false);
        }

        function eat_animation(player) { //Animation écrite
            if (player == 1) {
                ctx.font = "60px Arial bold";
                ctx.fillText("Great", 850, 300);
                setTimeout(function() {
                    ctx.clearRect(850, 240, 150, 100);
                }, 2000);
            }
        }

        function draw_from_data(i, j, matrix) {
            if (matrix[i][j] != 0) {
                var stat = Math.abs(matrix[i][j]) / matrix[i][j];
                draw_circle(i, j, stat, Math.abs(matrix[i][j]));
            } else {
                draw_black(j, i);
            }
        }
         function possible_eat(i, j) {
            console.log("hgvjbcvfjdvb fejdnv fekdjnvljednvljhrebnlhbevkrbev");
            //
            var xxf, yff;
            xxf = i + 2;
            yyf = j + 2;
            var a1=false ; a2=a1;a3=a1;a4=a1;
           console.log("avant : "+a1+" "+a2+" "+a3+" "+a4);

            if (-1 < xxf && xxf < number_8 && -1 < yyf && yyf < number_8 && corematrix[xxf][yyf]==0) {
                 a1 = is_valid_eat(i, j, xxf, yyf);
            }
            xxf = i - 2;
            yyf = j + 2;
            if (-1 < xxf && xxf < number_8 && -1 < yyf && yyf < number_8 && corematrix[xxf][yyf]==0) {
                 a2 = is_valid_eat(i, j, xxf, yyf);
            }
            xxf = i - 2;
            yyf = j - 2;
            if (-1 < xxf && xxf < number_8 && -1 < yyf && yyf < number_8 && corematrix[xxf][yyf]==0) {
                 a3 = is_valid_eat(i, j, xxf, yyf);
            }
            xxf = i + 2;
            yyf = j - 2;
            if (-1 < xxf && xxf < number_8 && -1 < yyf && yyf < number_8 && corematrix[xxf][yyf]==0) {
                 a4 = is_valid_eat(i, j, xxf, yyf);
            }
                        console.log("HOLAAAAAA    "+ ( a1 | a2 | a3 | a4) );
                        console.log("apres : "+a1+" "+a2+" "+a3+" "+a4);
                        console.log("x  :"+i+"  y :"+j);

            return (a1 | a2 | a3 | a4);
        }
        //player 1 , player 2

function wintest(){
    if(gamefinished()){document.getElementById("winstat").innerHTML="over";}
}

function can_move(i,j){
            if(corematrix[i][j]==(player+2)){
                if(is_valid_move(i,j,i-1,j+1)){return(true);}
                if(is_valid_move(i,j,i+1,j+1)){return(true);}
                if(is_valid_move(i,j,i-1,j-1)){return(true);}
                if(is_valid_move(i,j,i+1,j-1)){return(true);}
            }
            if(corematrix[i][j]==player){
                if(is_valid_move(i,j,i-1,j+1)){return(true);}
                if(is_valid_move(i,j,i+1,j+1)){return(true);}
            }
            return(false);
        }

function gamefinished(){
            var indice=0;
            for (var i = 0; i < number_8; i++) {
                for (var j = 0; j < number_8; j++) {
                                
            console.log(Math.abs(corematrix[i][j]) + "  " + player);

                    if((Math.abs(corematrix[i][j])==player)||(Math.abs(corematrix[i][j])==(player+2))){indice++;}
                }
           
        } 
                    console.log("*******"+indice);

        if(indice==0){return(true);}
            else{return(false);}
            }

var xx=0;
function chaat(str){
    xx=0;
        socket.emit('chat',str,pseudo);xx=1;
    chatup(pseudo+" : "+str);
    xx=0;
}
function chatup(str){
    var n=9;
    var vari;
    var varn;
    var id="chatzone";
    var varid;
    var nxtvarid;
    for(var i=1;i<=n;i++)
        {
        varid=id.concat(i.toString());
        vari=i+1;
        nxtvarid=id.concat(vari.toString());
        console.log(varid);
        console.log(nxtvarid);
        document.getElementById(varid).innerHTML = document.getElementById(nxtvarid).innerHTML;
        document.getElementById(varid).className = document.getElementById(nxtvarid).className;

        }
    varn=n+1;
    varid=id.concat(varn.toString());
    document.getElementById(varid).innerHTML = str;
    if(xx==1){
      if(player==1) document.getElementById(varid).className="chat1";
      else  document.getElementById(varid).className="chat2";
    }
    else {
         if(player==2) document.getElementById(varid).className="chat1";
      else  document.getElementById(varid).className="chat2";
    }
}
socket.on('chat', function(string_chat,pseudo) {
                chatup(pseudo+"  : "+string_chat);    
            });
socket.on('win', function(playere) {
alert("vous avez gagner");
            });
socket.on('gameover', function(playere) {
alert("vous avez perdu ");
            });
    