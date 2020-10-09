const express = require('express');

const { verificaAdmin_Role, verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Personal = require('../models/personal');
const categoria = require('../models/categoria');
const personal = require('../models/personal');

// =============================
// Obtener todo el personal
// =============================

app.get('/personal', verificaToken, (req, res) => {
    //trae todo el personal
    //populate: usuario categoria

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 30;
    limite = Number(limite);

    Personal.find({})
        .skip(desde)
        .sort('descripcion')
        .limit(limite)
        .populate('usuario', 'nombre apellido correo')
        .populate('categoria', 'descripcion')
        .exec((err, personalLista) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personalLista
            });
        });

});

// =============================
// Obtener un personal por ID
// =============================

app.get('/personal/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Personal.findById(id)
        .populate('usuario', 'nombre apellido correo')
        .populate('categoria', 'descripcion')
        .exec((err, personalDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!personalDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        mensaje: 'El Id no existe'
                    }
                });
            }

            res.json({
                ok: true,
                personal: personalDB
            });

        });

});

// =============================
// Buscar Personal
// =============================
app.get('/personal/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Personal.find({ descripcion: regex })
        .populate('categoria', '')
        .exec((err, personalLista) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personalLista
            });
        })
});

// =============================
// Crear un personal
// =============================
app.post('/personal', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let personal = new Personal({
        usuario: req.usuario._id,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    personal.save((err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            personal: personalDB
        });


    });

});

// =============================
// Actualizar personal
// =============================
app.put('/personal/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    //verificar si hay un error
    Personal.findById(id, (err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!personalDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no existe'
                }
            });
        }

        personalDB.descripcion = body.descripcion;
        personalDB.categoria = body.categoria;

        personalDB.save((err, personalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal: personalGuardado
            });
        });

    });

});

// =============================
// Borrar un personal
// =============================

/*
let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Categoria borrada'
        });
    })
*/

app.delete('/personal/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Personal.findByIdAndRemove(id, (err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personalDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Personal borrado'
        });
    });
});


module.exports = app;