const express = require('express');
const _ = require('underscore');

let app = express();

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Especialidad = require('../models/especialidad');


// =========================================
// Muestra todas las especialidades
// =========================================
app.get('/especialidad', verificaToken, (req, res) => {

    Especialidad.find({ oferta: true })
        .exec((err, especialidades) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                especialidades
            });

        });


});


// =========================================
// Muestra una especialidad por ID
// =========================================
app.get('/especialidad/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Especialidad.findById(id, (err, especialidadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!especialidadDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            especialidad: especialidadDB
        });

    });

});



// =========================================
// Realiza Busqueda por descripcion
// =========================================
app.get('/especialidad/buscar/descripcion/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Especialidad.find({ descripcion: regex })
        .exec((err, especialidades) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                especialidades
            });

        });

})



// =========================================
// Crea una nuevo especialidad
// =========================================
app.post('/especialidad', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let especialidad = new Especialidad({
        descripcion: body.descripcion
    });

    especialidad.save((err, especialidadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!especialidadDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            especialidad: especialidadDB
        });
    });

});


// =========================================
// Actualiza un nuevo registro
// =========================================
app.put('/especialidad/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Especialidad.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, especialidadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!especialidadDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            especialidad: especialidadDB
        });

    });

});


// =========================================
// Borrado logico de una especialidad
// =========================================
app.delete('/especialidad/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaOferta = {
        oferta: 'false'
    };

    Especialidad.findByIdAndUpdate(id, cambiaOferta, { new: true })
        .exec((err, especialidadDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID Invalido'
                    }
                });
            }

            if (!especialidadDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                especialidad: especialidadDB,
                mensaje: 'registro eliminado'
            });

        });
});

module.exports = app;