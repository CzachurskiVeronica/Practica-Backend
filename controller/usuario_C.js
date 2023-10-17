require('rootpath')();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var usuarioBd = require("model/usuario_M.js");

//----------------------------------------------------------------------------------------------------------------
app.get('/', (req, res) => { //GET

    usuarioBd.getAll((err, result) => {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(result);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
app.post('/', (req, res) =>{
    let usuario = req.body;

    usuarioBd.create(usuario, (err, result) =>  {
        if(err){
            res.status(500).send(err);
        } else{
            res.send(result);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
app.put('/:mail', (req, res) => {

    var mail = req.params.mail;
    var usuario = req.body;

    usuarioBd.update(usuario, mail, (err, result) => {
        if(err){
            res.status(500).send(err);
        } else{
            res.send(result);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
app.delete('/:mail', (req, res) =>{
    let mail = req.params.mail;

    usuarioBd.delete(mail, (err, result) => {
        if(err){
            res.status(500).json(err);
        } else{
            if (result.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result.message);
            }
        }
    });
});

//----------------------------------------------------------------------------------------------------------------
app.get('/:mail', (req, res) =>{
    let mail = req.params.mail;
    
    usuarioBd.getByEmail(mail, (err, result) =>{
        if(err){
            res.status(err.status).send(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = app;