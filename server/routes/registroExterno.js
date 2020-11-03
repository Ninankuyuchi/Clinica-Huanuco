const express = require('express');
const _ = require('underscore');

let app = express();

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let RegistroExterno = require('../models/registroExterno');


// =========================================
// Muestra todo el registro externo
// =========================================
app.get('/registroExterno', verificaToken, (req, res) => {

    RegistroExterno.find({})
        .exec((err, registros) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                registros
            });

        });


});


// =========================================
// Muestra un registro por ID
// =========================================
app.get('/registroExterno/:id', (req, res) => {

    let id = req.params.id;

    RegistroExterno.findById(id, (err, registroExternoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!registroExternoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            registroExterno: registroExternoDB
        });

    });

});



// =========================================
// Realiza Busqueda por nombre
// =========================================
app.get('/registroExterno/buscar/nombre/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    RegistroExterno.find({ nombre: regex })
        .exec((err, registros) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                registros
            });

        });

})

// =========================================
// Realiza Busqueda por DNI
// =========================================
app.get('/registroExterno/buscar/dni/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    RegistroExterno.find({ dni: regex })
        .exec((err, registros) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                registros
            });

        });

})


// =========================================
// Crea un nuevo registro
// =========================================
app.post('/registroExterno', (req, res) => {

    let body = req.body;

    let registroExterno = new RegistroExterno({
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        correo: body.correo,
        telefono: body.telefono,
        password: body.password,
        dependencia: body.dependencia,
    });

    registroExterno.save((err, registroExternoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!registroExternoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            registroExterno: registroExternoDB
        });
    });

});


// =========================================
// Actualiza un nuevo registro
// =========================================
app.put('/registroExterno/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'dni', 'correo', 'telefono', 'password', 'dependencia']);

    RegistroExterno.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, registroExternoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!registroExternoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            registroExterno: registroExternoDB
        });

    });

});


// =========================================
// Borrado logico de un registro
// =========================================
app.delete('/registroExterno/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: 'false'
    };

    RegistroExterno.findByIdAndUpdate(id, cambiaEstado, { new: true })
        .exec((err, registroExternoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        mensaje: 'ID Invalido'
                    }
                });
            }

            if (!registroExternoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                registroExterno: registroExternoDB,
                mensaje: 'registro eliminado'
            });

        });
});

module.exports = app;