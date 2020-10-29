const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Cita = require('../models/cita');

// ==========================
// Obtener todas las citas
// ==========================
app.get('/citas', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Cita.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('especialidad')
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sexo fechaNacimiento tipoSangre estado')
        .exec((err, citas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({

                ok: true,
                citas
            });

        });

});


// ==========================
// Obtener una cita por id
// ==========================
app.get('/citas/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Cita.findById(id)
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, citaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID invalido'
                    }
                });
            }

            if (!citaDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        mensaje: 'No existe el ID'
                    }
                });
            }

            res.json({
                ok: true,
                cita: citaDB
            });

        });

});

// =================================
// Buscar una cita por idPaciente
// =================================
app.get('/citas/buscar/idPaciente/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    Cita.find({ paciente: termino })
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, citaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cita: citaDB
            });

        })

})

// ===================================
// Buscar una cita por especialidad
// ===================================
app.get('/citas/buscar/especialidad/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Cita.find({ especialidad: regex })
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, citaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cita: citaDB
            });

        })

})


// ==========================
// Crear una cita
// ==========================
app.post('/citas', verificaToken, (req, res) => {

    let body = req.body;

    let cita = new Cita({
        usuario: req.usuario._id,
        especialidad: body.especialidad,
        fecha: body.fecha,
        hora: body.hora,
        paciente: body.paciente,
        triaje: body.triaje,
        estado: body.estado,
    });

    cita.save((err, citaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            cita: citaDB
        });
    });


})

// ==========================
// Actualizar una cita
// ==========================
app.put('/citas/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['especialidad', 'fecha', 'hora', 'paciente', 'triaje', 'estado']);

    Cita.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, citaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!citaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cita: citaDB
        });

    });

});


// ==========================
// Borrar una cita
// ==========================
app.delete('/citas/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: 'false'
    };

    Cita.findByIdAndUpdate(id, cambiaDisponible, { new: true })
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, citaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID Invalido'
                    }
                });
            }

            if (!citaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cita: citaDB,
                mensaje: 'cita eliminadoa'
            });

        });

});


module.exports = app;