const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Triaje = require('../models/triaje');
const paciente = require('../models/paciente');

// =================================
// Obtener todas la lista de triaje
// =================================
app.get('/triajes', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Triaje.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sexo fechaNacimiento tipoSangre estado')
        .exec((err, triajes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({

                ok: true,
                triajes
            });

        });

});


// ============================
// Obtener una triaje por id
// ============================
app.get('/triajes/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Triajes.findById(id)
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, triajeDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID invalido'
                    }
                });
            }

            if (!triajeDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        mensaje: 'No existe el ID'
                    }
                });
            }

            res.json({
                ok: true,
                cita: triajeDB
            });

        });

});

// =================================
// Buscar una cita por idPaciente
// =================================
app.get('/triajes/buscar/idPaciente/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    Triaje.find({ paciente: termino })
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, triajeDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                triaje: triajeDB
            });

        });

});



// ==========================
// Crear una triaje
// ==========================

app.post('/triajes', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let triaje = new Triaje({
        usuario: req.usuario._id,
        peso: body.peso,
        talla: body.talla,
        presionArterial: body.presionArterial,
        paciente: body.paciente,
        temperatura: body.temperatura,
        frecuenciaCardiaca: body.frecuenciaCardiaca,
        frecuenciaRespiratoria: body.frecuenciaRespiratoria,
        saturacionDeOxigeno: body.saturacionDeOxigeno,
        perimetroDePantorrilla: body.perimetroDePantorrilla,
        fuerzaDePresion: body.fuerzaDePresion,
        velocidadDeMarcha: body.velocidadDeMarcha,
        lawton: body.lawton,
        barthel: body.barthel,
        escalaDelDolor: body.escalaDelDolor,
        ram: body.ram,
        enfermedadesPrevias: body.enfermedadesPrevias
    });

    triaje.save((err, triajeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            triaje: triajeDB
        });
    });


})

// ==========================
// Actualizar una triaje
// ==========================
app.put('/triajes/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['talla', 'presionArterial', 'temperatura', 'frecuenciaCardiaca', 'frecuenciaRespiratoria', 'saturaionDeOxigeno', 'perimetroDePantorrilla', 'velocidadDeMarcha', 'lawton', 'barthel', 'escalaDelDolor', 'ram', 'enfermedadesPrevias', 'cita']);

    Triaje.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, triajeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!triajeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            triaje: triajeDB
        });

    });

});


// ==========================
// Borrar un triaje
// ==========================
app.delete('/triajes/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambioEstado = {
        estado: 'false'
    };

    Triaje.findByIdAndUpdate(id, cambioEstado, { new: true })
        .populate('usuario', 'nombre dni correo')
        .populate('paciente', 'nombre apellidos dni sxo fechaNacimiento tipoSangre estado')
        .exec((err, triajeDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID Invalido'
                    }
                });
            }

            if (!triajeDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                triaje: triajeDB,
                mensaje: 'cita eliminadoa'
            });

        });

});

module.exports = app;