require('rootpath')();
var personaBd = {};

const mysql = require('mysql');
const configuracion = require("configuracion.json");

//Conexión a la base de datos.
var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("La conexión a la tabla 'Persona' se ha logrado con éxito.");
    }
});

//----------------------------------------------------------------------------------------------------------------
//Ruta persona y metodo para listar personas
//R = READ
personaBd.getAll = function (funCallback) {

    var consulta = 'SELECT * FROM persona';

    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado.",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
//Ruta persona y metodo para crear persona
// C = CREATE
personaBd.create = function (persona, funCallback) {

    consulta = 'INSERT INTO persona (dni, nombre, apellido) VALUES (?, ?, ?)';
    params = [persona.dni, persona.nombre, persona.apellido];

    connection.query(consulta, params, (err, rows) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "La persona ya fue registrada anteriormente",
                    detail: err
                });
            } else {
                funCallback({
                    message: `Error de servidor.`,
                    detalle: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `Se creó la persona ${persona.nombre} ${persona.apellido}.`,
                detalle: rows
            });
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
//Ruta persona y metodo para modificar persona por DNI
// U = UPDATE
personaBd.update = function (persona, dni, funCallback) {

    consulta = 'UPDATE persona SET dni = ?, nombre = ?, apellido = ? WHERE dni = ?';
    params = [persona.dni, persona.nombre, persona.apellido, dni];

    connection.query(consulta, params, (err, result) => {

        if (err) {
            if (err.code == "ER_DUP_ENTRY") { //dni duplicado
                funCallback({
                    message: "Los datos a insertar generan una persona duplicada",
                    detail: err
                });
            } else { //algun otro codigo de error
                funCallback({
                    message: "Error. Analizar codigo error",
                    detail: err
                }); 
            }
        } else if (result.affectedRows == 0) { //persona a actualizar no encontrada
            funCallback({
                message: `No se puede actualizar. Ha ingresado valores incorrectos o 
                        la persona no se encuentra registrad@ en la base de datos.`,
                detalle: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó la persona ${persona.apellido} ${persona.nombre}.`,
                detalle: result
            });
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
//Ruta persona y metodo para eliminar persona
// D = DELETE
personaBd.delete = function (id, funCallback) {

    consulta = 'DELETE FROM persona WHERE dni = ?';

    connection.query(consulta, id, (err, result) => {
        if (err) {
            funCallback({ 
                menssage: err.code,
                detail: err
            });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: `La persona no se encuentra registrad@ en la base de datos.`,
                        detalle: result
                    });
            } else {
                funCallback(undefined, { 
                    message: `La persona con el DNI ${id} ha sido eliminad@ correctamente.`,
                    detalle: result
                });
            }
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
//Ruta persona y metodo para listar personas por apellido
personaBd.getByDNI = function (dni, funCallback) {
    
    connection.query('SELECT * FROM persona WHERE dni = ?', dni, (err, result) => {
        if (err) {
            funCallback({
                menssage: "Ha ocurrido un error inesperado al buscar la persona",
                detail: err
            });
        } else if (result.length == 0) { //consulta no impacta en nada dentro de la BD
            funCallback(undefined, {
                message: `No se encontraron personas con este apellido ${parametros}`,
                detalle: result.code
            });
        } else {

            funCallback(undefined, {
                message: `Hay un total de ${result.lenght} personas con el apellido ${parametros} buscado.`,
                detalle: result
            });
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
personaBd.getUserByPersona = function (persona, funcallback) {

    connection.query("SELECT * FROM persona WHERE dni = ?", persona, (err, result) => {
        if (err) {
            funcallback({
                menssage: "Ha ocurrido un error, posiblemente de sintaxis en buscar la persona",
                detail: err.code
            });
        } else if (result.length == 0) { //consulta no impacta en nada dentro de la BD
            funcallback(undefined, {
                message: `No se encontro la persona buscada`,
                detalle: result
            });
        } else {
            consulta = "SELECT nickname FROM usuario INNER JOIN persona ON usuario.persona = persona.dni AND usuario.persona = ?";
            connection.query(consulta, persona, (err, result) => {
                if (err) {
                    funcallback({
                        menssage: "Ha ocurrido un error, posiblemente de sintaxis en buscar el nickname",
                        detail: err
                    });
                } else if (result.length == 0) { //array vacio
                    funcallback(undefined, {
                        menssage: "La persona seleccionada no posee usuario registrado en la base de datos",
                        detail: result
                    });
                } else {
                    funcallback(undefined, { // consulta impacta bien, y el array no esta vacio 
                        menssage: `El nikname de la persona seleccionada es ${result[0]['nickname']}`,
                        detail: result
                    });
                }
            });
        }
    });
}

module.exports = personaBd;
  