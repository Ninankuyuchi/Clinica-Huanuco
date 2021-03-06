const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const usuario = require('../models/usuario');

const app = express();

const personal = require('../models/personal');
const categoria = require('../models/categoria');


app.get('/', (req, res) => {
    res.json({
        mensaje: "Hola Mundo"
    });
});


app.get('/usuario', verificaToken, (req, res) => {

    /*
        return res.json({
            usuario: req.usuario,
            nombre: req.usuario.nombre,
            apellido: req.usuario.apellido,
            correo: req.usuario.correo
        });
    */
    //parametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre apellido dni correo role estado google img')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('personal', 'descripcion')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })
        });
});

// =============================
// Obtener un usuario por ID
// =============================

app.get('/usuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findById(id)
        .populate('categoria', 'descripcion')
        .populate('personal', 'descripcion')
        .exec((err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        mensaje: 'El Id no existe'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });

        });

});

// =================================
// Buscar usuario por termino
// ==================================
app.get('/usuario/buscarNombre/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Usuario.find({ nombre: regex })
        .populate('categoria', '')
        .populate('personal', '')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            });
        })
});

app.get('/usuario/buscarDNI/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Usuario.find({ dni: regex })
        .populate('categoria', '')
        .populate('personal', '')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            });
        })
});

app.get('/usuario/buscarCorreo/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Usuario.find({ correo: regex })
        .populate('categoria', '')
        .populate('personal', '')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            });
        })
});


app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        correo: body.correo,
        categoria: body.categoria,
        personal: body.personal,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'dni', 'correo', 'categoria', 'personal', 'img', 'role', 'estado']); //Objeto, arreglo propiedades validas

    //id, objeto a modificar, 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario no encontrado'
                }
            });
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;