require('rootpath')();
const mysql = require('mysql');
const configuracion = require("configuracion.json");

var usuarioBd = {};

//----------------------------------------------------------------------------------------------------------------
//Conexión a la base de datos.
var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("La conexión a la tabla 'Usuario' se ha logrado con éxito.");
    }
});


//----------------------------------------------------------------------------------------------------------------
//Ruta usuario y metodo para listar usuarios
usuarioBd.getAll = function (funCallback) {

    let consulta = 'SELECT * FROM usuario';

    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado.",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        };
    });
};

//----------------------------------------------------------------------------------------------------------------
//Ruta usuario y metodo para crear usuario
usuarioBd.create = function (usuario, funCallback) {

    params = [usuario.mail, usuario.nickname, usuario.password, usuario.persona];
    consulta = 'INSERT INTO usuario (mail, nickname, password, persona) VALUES (?, ?, ?, ?)';

    connection.query(consulta, params, function (err, result) {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El usuario ya fue registrada anteriormente",
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
                message: `Se creó el usuario ${usuario.nickname} ${usuario.mail}.`,
                detalle: result
            });
        }
    });
}

//----------------------------------------------------------------------------------------------------------------
//Ruta usuario y metodo para modificar usuario
usuarioBd.update = function (usuario, mail, funCallback) {

    params = [usuario.mail, usuario.nickname, usuario.password, usuario.persona, mail];
    consulta = 'UPDATE usuario SET mail = ?, nickname = ?, password = ?, persona = ? WHERE mail = ?';

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_TRUNCATED_WRONG_VALUE") { //dni duplicado
                funCallback({
                    message: "Los datos a insertar generan un usuario duplicado",
                    detail: err
                });
            } else { //algun otro codigo de error
                funCallback({
                    message: "Error. Analizar codigo error.",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { //persona a actualizar no encontrada
            funCallback({
                message: `No se puede actualizar. Ha ingresado valores incorrectos o 
                        el usuario no se encuentra registrad@ en la base de datos.`,
                detalle: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó el usuario ${usuario.nickname}.`,
                detalle: result
            });
        }
    });
};

//----------------------------------------------------------------------------------------------------------------
//Ruta usuario y metodo para eliminar usuario
usuarioBd.delete = function (mail, funCallback) {

    consulta = 'DELETE FROM usuario WHERE mail = ?';

    connection.query(consulta, mail, (err, result) => {
        if (err) {
            funCallback({
                menssage: err.code,
                detail: err
            });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: `El usuario no se encuentra registrad@ en la base de datos.`,
                        detalle: result
                    });
            } else {
                funCallback(undefined, {
                    message: `El usuario con el mail ${mail} ha sido eliminad@ correctamente.`,
                    detalle: result
                });
            }
        }
    });
};

//----------------------------------------------------------------------------------------------------------------
//Ruta usuario y metodo para listar usuarios por apellido
usuarioBd.getByEmail = function (nickname, funCallback) {

    var consulta = 'SELECT usuario.*, rol.nombre FROM usuario INNER JOIN rol ON usuario.rol_id = rol.rol_id AND usuario.nickname = ?';
    connection.query(consulta, nickname, function (err, result) {
        if (err) {
            funCallback(err);
            return;
        } else {
            if (result.length > 0) {
                funCallback(undefined, {
                    message: `Usuario encontrado`,
                    detail: result[0]
                });
            } else {
                funCallback({
                    message: "No existe un usuario que coincida con el criterio de busqueda",
                    detail: result
                });
            }
        }
    });
}

module.exports = usuarioBd;