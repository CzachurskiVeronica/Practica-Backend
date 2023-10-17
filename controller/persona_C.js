require('rootpath')();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var personaBd = require("model/persona_M.js");

//--------------------------------------------------------------------------------------------------------
//Listar todas las personas
app.get('/', (req, res) => {
    
    personaBd.getAll((err, result) => {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(result);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
//Crear persona
app.post('/', (req, res) => {
    let persona = req.body;
    
    personaBd.create(persona, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    })
});
 
//----------------------------------------------------------------------------------------------------------------
//Actualizar persona
app.put('/:dni', (req, res) => {
    var persona = req.body;
    var dni = req.params.dni;

    personaBd.update(persona, dni, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
//Borrar persona
app.delete('/:dni', (req, res) => {
    let eliminar = req.params.dni;

    personaBd.delete(eliminar, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result.message);
            }
        }
    });
});

//---------------------------------------------------------------------------------------------------------------- 
//Listar usuario por DNI
app.get('/usuario/:dni', (req, res) => {

    personaBd.getUserByPersona(req.params.dni, (err, result) => {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.send(result);
        }
    });
}); 

//----------------------------------------------------------------------------------------------------------------
app.get('/:dni', (req, res) => {
    let id = req.params.dni;

    personaBd.getByDNI(id, (err, result) => {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = app;