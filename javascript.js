/*----------------------------------------VARIABLES GLOBALES------------------------------------------*/

var ladrillos;
var filas = 6;//6
var cols = 13;//13
var altoLadrillo = 25;
var anchoLadrillo = 61;
var miPelota;
var miRaqueta;
var mundoJuego;
var vidas = 3;
var puntos = 0;
var cantidadLadrillos = 0;
var bucleBola;
var bucleMundo;
var finPartida = false;

//Variables raqueta
var raqX = 353;
var raqY = 930;
var anchoRaq = 125;
var altoRaq = 28;

//Variables sprite bola
var bolaX = 409;
var bolaY = 870;
var diametroBola = 16;

//Variables pelota
var radio = 8;
var dx = 4;//direccion en x
var dy = -4;//direccion en y
var centroX = 417;
var centroY = 878;

//Canvas
var lienzo = document.getElementById("lienzo");
var ctx = lienzo.getContext("2d");

/*----------------------------------------VARIABLES GLOBALES------------------------------------------*/


/*-----------------------------------------------SPRITES----------------------------------------------*/
/*Generamos variables que contiene imágenes de los sprites*/

//Sprite bola
var bola = new Image();
bola.src = "./sprites/ball.png";

//Sprite raqueta
var raqueta = new Image();
raqueta.src = "./sprites/racket.png";

//Sprite borde izquierdo
var bordeIzq = new Image();
bordeIzq.src = "./sprites/border_left.png";

//Sprite borde derecho
var bordeDer = new Image();
bordeDer.src = "./sprites/border_right.png";

//Sprite borde arriba
var bordeTop = new Image();
bordeTop.src = "./sprites/border_top.png";

//Título Arkanoid
var tituloArkanoid = new Image();
tituloArkanoid.src = "./arkanoid.png";

//Borde título
var bordeTitulo = new Image();
bordeTitulo.src = "./sprites/border_top.png";

/*-----------------------------------------------SPRITES----------------------------------------------*/


/*-----------------------------------------------CLASES-----------------------------------------------*/

//Clase pelota
function constructorPelota(centroX, centroY, radio, dx, dy) {
    this.centroX = centroX;
    this.centroY = centroY;
    this.radio = radio;
    this.dx = dx;
    this.dy = dy;
}
//Clase raqueta
function constructorRaqueta(raqY, raqX, anchoRaq, altoRaq) {
    this.raqY = raqY;
    this.raqX = raqX;
    this.anchoRaq = anchoRaq;
    this.altoRaq = altoRaq;
}

//Clase ladrillo
function ladrillo(estado, ladX, ladY) {

    this.estado = estado;
    this.ladX = ladX;
    this.ladY = ladY;

    /*Función que pinta los ladrillos en el canvas variando la opacidad en función de su estado (golpes necesarios para destruir el ladrillo, de 1 a 4)*/
    this.pintaLadrillo = function () {
        if (this.estado == 1 || this.estado == 2 || this.estado == 3 || this.estado == 4) {//si todavía les quedan golpes los pinta, si no tienen golpes (estado == 0), no los pinta
            switch (this.estado) {
                case 1:
                    ctx.fillStyle = "hsla( 333 , 93%, 56%, .50)";
                    ctx.fillRect(this.ladX, this.ladY, anchoLadrillo, altoLadrillo);
                    break;

                case 2:
                    ctx.fillStyle = "hsla( 333 , 93%, 56%, .625)";
                    ctx.fillRect(this.ladX, this.ladY, anchoLadrillo, altoLadrillo);
                    break;

                case 3:
                    ctx.fillStyle = "hsla( 333 , 93%, 56%, .75)";
                    ctx.fillRect(this.ladX, this.ladY, anchoLadrillo, altoLadrillo);
                    break;

                case 4:
                    ctx.fillStyle = "hsla( 333 , 93%, 56%, 1)";
                    ctx.fillRect(this.ladX, this.ladY, anchoLadrillo, altoLadrillo);
                    break;

                default:
                    break;

            }
        }

    }
}

//Clase mundo
function mundo(vidas, puntos) {

    this.vidas = vidas;
    this.puntos = puntos;

    /*Función que crea el array de ladrillo y les asigna su estado aleatoriamente*/
    this.creaLadrillos = function () {
        ladrillos = new Array(cols);
        for (var i = 0; i < ladrillos.length; i++) {
            ladrillos[i] = new Array(filas);
        }

        for (var j = 0; j < filas; j++) {
            for (var k = 0; k < cols; k++) {
                ladrillos[k][j] = new ladrillo((Math.floor(Math.random() * 4) + 1), (k * anchoLadrillo + 22), (j * altoLadrillo + 370));
                cantidadLadrillos++;
            }
        }
    }
    /*Función que llama a la función pintaLadrillos() para cada uno*/
    this.dibujaLadrillos = function () {
        for (var j = 0; j < filas; j++) {
            for (var k = 0; k < cols; k++) {
                ladrillos[k][j].pintaLadrillo();
            }

        }

    }
}

/*----------------------------------------------CLASES------------------------------------------------*/


/*--------------------------------------------FUNCIONES-----------------------------------------------*/

/*Función que inicializa la base del juego.*/
function arkanoid() {

    /*Pinta los sprites continuamente para evitar borrados accidentales del clearRect()*/
    bucleMundo = setInterval(function () { cargaSprites(); }, 1000 / 30);

    /*Crea el mundo*/
    mundoJuego = new mundo(vidas, puntos);

    /*Muestra las vidas, puntos y estado del juego por pantalla*/
    document.getElementById("vidas").innerHTML = "&nbsp;&nbsp;" + mundoJuego.vidas + " vidas";
    document.getElementById("Estado").innerHTML = " ";
    document.getElementById("puntos").innerHTML = "&nbsp;&nbsp;" + mundoJuego.puntos + " puntos";

    /*Llama a los funciones de creación y pintado de los ladrillos*/
    mundoJuego.creaLadrillos();
    mundoJuego.dibujaLadrillos();

    /*Crea las hitbox de la raqueta y pelota*/
    miPelota = new constructorPelota(centroX, centroY, radio, dx, dy);
    miRaqueta = new constructorRaqueta(raqY, raqX, anchoRaq, altoRaq);

}

/*Pinta los sprites y el título del juego en el canvas*/
function cargaSprites() {
    ctx.drawImage(tituloArkanoid, 15, 0, 795, 249.7);

    ctx.drawImage(bola, bolaX, bolaY, diametroBola, diametroBola);
    ctx.drawImage(raqueta, miRaqueta.raqX, miRaqueta.raqY, miRaqueta.anchoRaq, miRaqueta.altoRaq);
    ctx.drawImage(bordeIzq, 0, 0, 22, 990);
    ctx.drawImage(bordeDer, 810, 0, 22, 990);
    ctx.drawImage(bordeTop, 0, 249, 832, 22);

    ctx.drawImage(bordeTitulo, 0, 0, 832, 22);
}

/*Función que mediante un evento de teclado onmousemove permite mover la raqueta con el ratón*/
function mueveRaqueta(e) {
    /*Borra el sprite con la antigua coordenada*/
    ctx.clearRect(miRaqueta.raqX, miRaqueta.raqY, miRaqueta.anchoRaq, miRaqueta.altoRaq);
    /*Cogemos la mitad para que el ratón se sitúe en la mitad de la raqueta*/
    miRaqueta.raqX = e.clientX - miRaqueta.anchoRaq / 2;
    if (miRaqueta.raqX <= 22) {
        miRaqueta.raqX = 23;
    } else if (miRaqueta.raqX + miRaqueta.anchoRaq >= 810) {
        miRaqueta.raqX = 685;
    }
    ctx.drawImage(raqueta, miRaqueta.raqX, miRaqueta.raqY, miRaqueta.anchoRaq, miRaqueta.altoRaq);////Pinta el sprite con la nueva coordenada
}

/*Activa la animación del movimiento de la bola y comprueba las colisiones de esta con los otros sprites*/
function mueveBola() {
    /*Si la partida a finalizado llama a restart() para resetear el juego*/
    if (finPartida == true) {
        restart();
    } else {
        /*Bucle de la animación*/
        bucleBola = requestAnimationFrame(mueveBola);
        /*Colisiones*/
        colisionRaquetaBola();
        colisionBolaBordes();
        colisionBolaLadrillos();
        ctx.clearRect(bolaX, bolaY, diametroBola, diametroBola);
        /*Calcula la siguiente posición del sprite y su hitbox*/
        miPelota.centroX += miPelota.dx;
        miPelota.centroY += miPelota.dy;
        bolaX += miPelota.dx;
        bolaY += miPelota.dy;
        ctx.drawImage(bola, bolaX, bolaY, diametroBola, diametroBola);
        /*Comprueba la condición de pérdida (colisión con el borde inferior)*/
        condicionPerder();
    }
}

/*Calcula la colsión entre la raqueta y la bola y cambia en función de ello la velocidad de la bola (rebote)*/
function colisionRaquetaBola() {
    /*Comprobamos por dónde se aproxima la pelota*/

    /*lateral derecho*/
    if ((miPelota.centroX) > (miRaqueta.raqX + miRaqueta.anchoRaq)) {

        if ((miPelota.centroX - miPelota.radio) < (miRaqueta.raqX + miRaqueta.anchoRaq) && (miRaqueta.raqY + miRaqueta.altoRaq) > (miPelota.centroY) && (miRaqueta.raqY) < (miPelota.centroY)) {//condición de colisión
            miPelota.dx = -miPelota.dx;

        }
        /*lateral izquierdo*/
    } else if ((miPelota.centroX) < (miRaqueta.raqX)) {
        if ((miPelota.centroX + miPelota.radio) > (miRaqueta.raqX) && (miRaqueta.raqY + miRaqueta.altoRaq) > (miPelota.centroY) && (miRaqueta.raqY < miPelota.centroY)) {//condición de colisión
            miPelota.dx = -miPelota.dx;
        }
        /*Parte de arriba*/
    } else if ((miPelota.centroX) > (miRaqueta.raqX) && (miPelota.centroX) < (miRaqueta.raqX + miRaqueta.anchoRaq)) {
        if ((miPelota.centroY + miPelota.radio) > (miRaqueta.raqY) && (miPelota.centroX + miPelota.radio) < (miRaqueta.raqX + miRaqueta.anchoRaq) && (miRaqueta.raqX) < (miPelota.centroX - miPelota.radio)) {//condición de colisión
            miPelota.dy = -miPelota.dy;
        }
    }
}

/*Calcula la colsión entre llos bordes y la bola*/
function colisionBolaBordes() {
    /*Si un extremo de la bola sobrepasa el borde correspondiente esta rebota*/
    if (miPelota.centroX - miPelota.radio <= 25) {
        miPelota.dx = -miPelota.dx;
    } else if (miPelota.centroX + miPelota.radio >= 808) {
        miPelota.dx = -miPelota.dx;
    } else if (miPelota.centroY - miPelota.radio <= 271) {
        miPelota.dy = -miPelota.dy;
    }
}

/*Calcula la colsión entre los ladrillos y la bola*/
function colisionBolaLadrillos() {
    /*Calcula, en cada iteración, las posibles colisiones entre todos los ladrillos y la bola*/
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < filas; j++) {
            var l = ladrillos[i][j];
            /*Las colisiones se clasifican en función del estado de los ladrillos (golpes para romperse)*/
            if (l.estado == 1) {
                if ((miPelota.centroX) > (l.ladX) - 11 && (miPelota.centroX) < (l.ladX + anchoLadrillo) + 11 && (miPelota.centroY) > (l.ladY) - 11 && (miPelota.centroY) < (l.ladY + altoLadrillo) + 11) {//Condición de colisión
                    /*Suma los puntos por acertar y pinta la puntuación tras la colisión*/
                    mundoJuego.puntos += 400;
                    document.getElementById("puntos").innerHTML = "&nbsp;&nbsp;" + mundoJuego.puntos + " puntos";
                    /*Se cambia la dirección de la bola dependiendo de si la pelota se encunetra en un lateral o por encima o por debajo*/
                    if ((miPelota.centroX) < (l.ladX) || (miPelota.centroX) > (l.ladX + l.anchoLadrillo)) {
                        miPelota.dx = -miPelota.dx;
                    } else {
                        miPelota.dy = -miPelota.dy;
                    }
                    l.estado = 0;
                    /*En este caso, al ser el último toque, se borra el ladrillo, se baja el número de ladrillos totales y se comprueba si se ha ganado*/
                    ctx.clearRect(l.ladX, l.ladY, anchoLadrillo, altoLadrillo);
                    cantidadLadrillos--;
                    condicionGanar();
                }
            } else if (l.estado == 2) {
                if ((miPelota.centroX) > (l.ladX) - 11 && (miPelota.centroX) < (l.ladX + anchoLadrillo) + 11 && (miPelota.centroY) > (l.ladY) - 11 && (miPelota.centroY) < (l.ladY + altoLadrillo) + 11) {//Condición de colisión
                    mundoJuego.puntos += 300;
                    document.getElementById("puntos").innerHTML = "&nbsp;&nbsp;" + mundoJuego.puntos + " puntos";
                    if ((miPelota.centroX) < (l.ladX) || (miPelota.centroX) > (l.ladX + l.anchoLadrillo)) {
                        miPelota.dx = -miPelota.dx;
                    } else {
                        miPelota.dy = -miPelota.dy;
                    }
                    l.estado = 1;
                    ctx.clearRect(l.ladX, l.ladY, anchoLadrillo, altoLadrillo);
                    l.pintaLadrillo();
                }
            } else if (l.estado == 3) {
                if ((miPelota.centroX) > (l.ladX) - 11 && (miPelota.centroX) < (l.ladX + anchoLadrillo) + 11 && (miPelota.centroY) > (l.ladY) - 11 && (miPelota.centroY) < (l.ladY + altoLadrillo) + 11) {//Condición de colisión
                    mundoJuego.puntos += 200;
                    document.getElementById("puntos").innerHTML = "&nbsp;&nbsp;" + mundoJuego.puntos + " puntos";
                    if ((miPelota.centroX) < (l.ladX) || (miPelota.centroX) > (l.ladX + l.anchoLadrillo)) {
                        miPelota.dx = -miPelota.dx;
                    } else {
                        miPelota.dy = -miPelota.dy;
                    }
                    l.estado = 2;
                    ctx.clearRect(l.ladX, l.ladY, anchoLadrillo, altoLadrillo);
                    l.pintaLadrillo();

                }
            } else if (l.estado == 4) {
                if ((miPelota.centroX) > (l.ladX) - 11 && (miPelota.centroX) < (l.ladX + anchoLadrillo) + 11 && (miPelota.centroY) > (l.ladY) - 11 && (miPelota.centroY) < (l.ladY + altoLadrillo) + 11) {//Condición de colisión
                    mundoJuego.puntos += 100;
                    document.getElementById("puntos").innerHTML = "&nbsp;&nbsp;" + mundoJuego.puntos + " puntos";
                    if ((miPelota.centroX) < (l.ladX) || (miPelota.centroX) > (l.ladX + l.anchoLadrillo)) {
                        miPelota.dx = -miPelota.dx;
                    } else {
                        miPelota.dy = -miPelota.dy;
                    }
                    l.estado = 3;
                    ctx.clearRect(l.ladX, l.ladY, anchoLadrillo, altoLadrillo);
                    l.pintaLadrillo();

                }
            }

        }
    }
}

/*Función que comprueba si se ha ganado o no*/
function condicionGanar() {
    /*Si no quedan más ladrillos se para la animación de la bola y se escribe por pantalla el estado*/
    if (cantidadLadrillos === 0) {
        pararBola();
        document.getElementById("Estado").innerHTML = "YOU WON!";
        finPartida = true;
    }
}

/*Función que comprueba si has perdido o no*/
function condicionPerder() {
    /*Si la pelota toca el suelo, se pierde la partida, se consume una vida y se reinicia la pelota. Al quedarte sin vidas se muestra el estado por pantalla*/
    if (miPelota.centroY + miPelota.radio >= 990) {
        if (mundoJuego.vidas === 1) {
            pararBola();
            ctx.clearRect(bolaX, bolaY, diametroBola, diametroBola);
            mundoJuego.vidas--;
            document.getElementById("vidas").innerHTML = "&nbsp;&nbsp;" + mundoJuego.vidas + " vidas";
            document.getElementById("Estado").innerHTML = "GAME OVER";
            finPartida = true;
        } else {
            pararBola();
            ctx.clearRect(bolaX, bolaY, diametroBola, diametroBola);
            mundoJuego.vidas--;
            document.getElementById("vidas").innerHTML = "&nbsp;&nbsp;" + mundoJuego.vidas + " vidas";
            miPelota.centroX = centroX;
            miPelota.centroY = centroY;
            bolaX = 409;
            bolaY = 870;
            miPelota.dx = dx;
            miPelota.dy = dy;
        }
    }
}

/*Función que para la animación de la bola*/
function pararBola() {
    cancelAnimationFrame(bucleBola);
}

/*Función que al mover el puntero fuera del canvas devuelve la raqueta y su hitbox al medio*/
function resetRaqueta() {
    ctx.clearRect(miRaqueta.raqX, miRaqueta.raqY, miRaqueta.anchoRaq, miRaqueta.altoRaq);
    miRaqueta.raqX = raqX;
    miRaqueta.raqY = raqY;
    ctx.drawImage(raqueta, miRaqueta.raqX, miRaqueta.raqY, miRaqueta.anchoRaq, miRaqueta.altoRaq);
}

/*Cambia finPartida a false, a continuación borra todos los elementos del canvas, resetea la posición del sprite de la bola y llama a la función arkanoid()*/
function restart() {
    finPartida = false;
    ctx.clearRect(0, 0, 832, 990);
    bolaX = 409;
    bolaY = 870;
    arkanoid();
}

/*--------------------------------------------FUNCIONES-----------------------------------------------*/