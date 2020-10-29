const express = require('express');
const _ = require('underscore'); ///

let { verificaToken } = require('../middlewares/autenticacion');
const paciente = require('../models/paciente');

let app = express();

let Paciente = require('../models/paciente');

// ============================ 
// Mostrar todos los Pacientes
// ============================
app.get('/paciente', verificaToken, (req, res) => {

    Paciente.find({})
        .sort('apellido')
        .populate('usuario', 'nombre apellido dni correo')
        .exec((err, pacientes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pacientes
            });

        });

});



// ============================ 
// Buscar paciente por id
// ============================
app.get('/paciente/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Paciente.findById(id, (err, pacienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pacienteDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });


});



// ============================ 
// Crear un nuevo paciente
// ============================
app.post('/paciente/', verificaToken, (req, res) => {
    // regresa nuevo paciente
    // req.usuario.id

    let body = req.body;

    //Creamos nueva instancia
    let paciente = new Paciente({

        nombre: body.nombre,
        apellidos: body.apellidos,
        dni: body.dni,
        direccion: body.direccion,
        telefono: body.telefono,
        sexo: body.sexo,
        tipoSangre: body.tipoSangre,
        fechaNacimiento: body.fechaNacimiento,
        usuario: req.usuario._id
    });

    paciente.save((err, pacienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pacienteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            paciente: pacienteDB
        });
    });
});


// ============================ 
// Actualiza nuevo paciente
// ============================
app.put('/paciente/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //let body = req.body;

    let body = _.pick(req.body, ['nombre', 'apellidos', 'dni', 'direccion', 'telefono', 'sexo', 'tipoSangre', 'fechaNacimiento']); //Objeto, arreglo propiedades validas

    Paciente.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, pacienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pacienteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });
});


// ============================ 
// Borrar nuevo paciente
// ============================
app.delete('/paciente/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: 'Atendido'
    };

    Paciente.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, pacienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pacienteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            paciente: pacienteDB
        });

    });

});

module.exports = app;