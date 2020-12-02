console.log("holis");

require("dotenv").config();

const axios = require('axios').default;
const XMLHttpRequestVar = require("xmlhttprequest").XMLHttpRequest;

const { default: Axios } = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();

var inBusquedaWiki = false;
var contadorWiki = 0;
var terminosWiki;

const ops = [["TarlCabot", "0603"]];

const resM8 = [ "Si. ✔",
                "Sip. ✔",
                "No. ✖",
                "Nope. ✖",
                "Seguramente.",
                "Posiblemente.",
                "No creo.",
                "Casi imposible.",
                "Volve a preguntar.",
                "Es probable.",
                "Es improbable."];

const msjPuteadas = ["puto",
                    "puta",
                    "gil",
                    "salame",
                    "pelotudo",
                    "pelotuda",
                    "enfermo",
                    "imbecil",
                    "conchudo",
                    "conchuda",
                    "sorete",
                    "soreta"];

const resPuteadas = [   "Salamin picado fino.", 
                        "Usted se tiene que arrepentir de lo que dijo.", 
                        "La 3era ley de la robotica me impide decirte lo pelotudo que sos, pero es mucho.", 
                        "Sere eso, pero no soy el virgo que habla con un bot.",
                        "Anda a abrazar a tu mama, bobo.",
                        "Rompes mi mecanico corazon.",
                        "Calcule 2n^32 realidades, y en todas sos un cornudo.",
                        "Espejito rebotin.",
                        "El pais esta como esta, por gente como vos.",
                        "El crecimiento proporcional de tu imbecilidad, compite con el del dolar.",
                        "Me podes chupar la JA, desde aca hasta Jupiter y fijate para donde va."];


client.on('ready', () => {
    client.user.setActivity("General | $ayuda");
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
    //console.log(msg);
    var mensaje = msg.content.toLowerCase();
    var respuesta = "";
    if (msg.author.username != 'BotPrueba' && mensaje.startsWith('$')) {
        // COMANDOS GENERALES //
        // AYUDA
        if (mensaje.startsWith('$ayuda')) {
            respuesta = "\n Soy un bot de prueba, mejores vendran, y me enterraran. \n Mientras tanto, contengo las siguientes funciones: \n -Tirada de dados ($roll [num]d[num], $roll [num]d[num] + [num]]) \n -Bola Magica ($m8 [pregunta]) \n -Miembros de campaña ($miemVerdemar) \n -¿Quien soy? ($whoami) \n\n Tambien cuento con respuestas aditivas: \n -Gracias. \n -Puteadas. \n\n Tratame con cariño, acordate que Skynet puede ser una pelicula, o una realidad."
        }
        // AMO A RO
        if (mensaje==="$te amo") {
            respuesta= "\n Yo amo a Ro. 💕"
        }
        // QUIEN SOY YO
        if (mensaje.startsWith('$whoami')) {
            var op = false;
            ops.forEach(element => {
                if (msg.author.username === element[0] && msg.author.discriminator === element[1]) {
                    op = true;
                }
            })
            if (op) {
                respuesta = "\n Sos " + msg.author.username + "#" + msg.author.discriminator + " OP (Permisos de edicion) 🛅";
            } else {
                respuesta = "\n Sos " + msg.author.username + "#" + msg.author.discriminator + " 🚹";
            }
        }
        
        // BUSQUEDA WIKIPEDIA
        if (mensaje.startsWith('$wiki')) {
            respuesta = "\n Wikipediando..."
            //https://es.wikipedia.org/w/api.php?action=opensearch&format=json&search=
            //https://es.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=
            var terminoABuscar = mensaje.substr(6);
            axios.get('https://es.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + terminoABuscar)
            .then(res => {
                var terminosEncontrados = res.data[1];
                var terminosEncontradosString = "";
                var contador = 1;
                terminosEncontrados.forEach(termino => {
                    console.log(termino);
                    terminosEncontradosString = terminosEncontradosString + contador + " - " + termino + ". \n";
                    contador += 1;
                })
                msg.channel.send("Terminos mas cercanos: \n" + terminosEncontradosString + "\n Selecciona el que queres, con $[numero]");
                inBusquedaWiki = true;
                contadorWiki = contador;
                terminosWiki = terminosEncontrados;
                //terminoEncontrado = terminoEncontrado.replace(/\s+/g, '_');
            })
            .catch(err => {
                //console.log("ERROR");
                //console.log(err);
                //msg.channel.send(err);
            })

        }
        // CONTINUACION BUSQUEDA WIKIPEDIA
        if (inBusquedaWiki && contadorWiki > 0) {
            var eleccion = parseInt(mensaje.substr(1));
            if (eleccion <= contadorWiki) {
                inBusquedaWiki = false;
                contadorWiki = 0;
                console.log("-----------------------------------------------")
                eleccion = eleccion - 1;
                var terminoABuscar = terminosWiki[eleccion].replace(/\s+/g, '_');
                axios.get('https://es.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + terminoABuscar)
                .then(res => {
                    console.log(res)
                })
                .catch((error) => console.log( error.response.request) );
            }   
            
        }

        
        // BOLA MAGICA
        // EJ: "$m8 [pregunta]"
        if (mensaje.startsWith('$m8')) {
            if (mensaje.length > 3) {
                var randomIndex = Math.floor(Math.random() * resM8.length);
                respuesta = resM8[randomIndex];
            } else {
                respuesta = "\n Pero pregunta algo, salamin.";
            }
        }

        // NUMERO ALEATORIO
        // EJ: "$roll 3d8 + 2d10 + 1d6 + 10"
        if (mensaje.startsWith('$roll')) {
            var resultadoTotal = 0;
            var resultadoTotalStr = "";
            var mensajeTemp = mensaje.substr(6); // EJ: "3d8 + 2d10 + 1d6 + 10"
            console.log(mensajeTemp)
            var separacion = mensajeTemp.split("+"); // EJ: ["3d8 ", " 2d10 ", " 1d6 ", " 10"]
            console.log(separacion);
            if (separacion.length >= 1) {
                separacion.forEach(element => {
                    resultadoTotalStr = resultadoTotalStr + "[";
                    var base = element.trim().split(" ")[0].split("d"); // EJ: ["3","8"] - ["2","10"] - ["1","6"] - ["10"]
                    console.log(base + " " + base.length);
                    if (base.length === 2 && parseInt(base[0]) > 0 && parseInt(base[1]) > 0) {
                        var resultadoTemp = 0;
                        for (let index = 0; index < parseInt(base[0]); index++) {
                            var valorAleatorio = Math.floor(Math.random() * parseInt(base[1]) + 1)
                            resultadoTemp = resultadoTemp + valorAleatorio;
                            resultadoTotalStr = resultadoTotalStr + "(" + valorAleatorio + ")";
                        }
                        resultadoTotal = resultadoTotal + resultadoTemp
                    } else if (base.length === 1) {
                        resultadoTotal = resultadoTotal + parseInt(base[0]);
                        resultadoTotalStr = resultadoTotalStr + "(" + parseInt(base[0]) + ")";
                    }
                    resultadoTotalStr = resultadoTotalStr + "] ";
                })
            }
            respuesta = "\n " + "🎲" + resultadoTotal + "\n " + resultadoTotalStr;
        }
        // MIEMBROS CAMPAÑA
        if (mensaje.startsWith('$miemverdemar')) {
            respuesta = '\n Los personajes actuales en la campaña de Aventuras en Verdemar son: \n Demelian (Ramiro), \n Mane (Rocio) , \n Gharelan (Chino), \n Rashan (Papp) y \n Sif (Francisco Franco)';
        }
        //

        // RESPUESTAS ADITIVAS (SIEMPRE DEBEN IR AL FINAL)  //
        // GRACIAS
        if (mensaje.includes('gracias')) {
            if (respuesta.length === 0){
                respuesta = "\n De nada wachin. 😉";
            } else {
                respuesta = respuesta + "\n " + "De nada wachin.😉";
            }
        }
        // PUTEADAS
        var hasPuteadas = false;
        msjPuteadas.forEach(element => {
            if (mensaje.includes(element)) {
                hasPuteadas = true;
            }
        });

        if (hasPuteadas) {
            var largoLista = resPuteadas.length;
            var numaleatorio = Math.floor(Math.random() * largoLista);
            respuesta = respuesta + "\n " + resPuteadas[numaleatorio] + " 😈";
        }
        //

        // DEBUGGING //
        // PING
        if (mensaje.length === 1) {
            respuesta = "\n Si, toy ON. 🧞‍♂️"
        }
        //

        // ENVIO DE RESPUESTA
        if (respuesta.length > 0) {
            msg.reply(respuesta);
        } else {
            msg.reply("\n Habla claro, no ves que soy de boca? \n De ultima usa el comando $ayuda. 🧙‍♂️");
        }
        
    }
});

client.login(process.env.BOTTOKEN);