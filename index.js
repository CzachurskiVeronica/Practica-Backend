require('rootpath')();
const express = require('express');
const morgan = require('morgan'); //Para saber si los mensajes enviados/recibidos
const app = express();

app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

app.use(express.json()); //Utilizacion en metodo post
app.use(express.urlencoded({ extended: true }));

const configuracion = require("configuracion.json");

const controlador_person = require("controller/persona_C.js");
const controlador_user = require("controller/usuario_C.js");

app.use('/api/persona', controlador_person);
app.use('/api/usuario', controlador_user);

//Conexion al servidor
app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log(`Conexión exitosa al puerto ${configuracion.server.port}`);
    }
});
