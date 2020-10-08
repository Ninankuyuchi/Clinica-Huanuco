const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID); //CLIENT_ID cambiante


const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {

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
                    mensaje: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        //regresa true o false si hace match
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});

//Configuraciones de Google
//retorna promesa "assync"
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    /*
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    */
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.staus(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ correo: googleUser.correo }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el ususario no existe en la Base de Datos

            let usuario = new Usuario();

            let nombreUser = "";
            let apellidoUser = "";
            if (googleUser.nombre.split(" ").length < 3) {

                nombreUser = googleUser.nombre.split(" ")[0];
                apellidoUser = googleUser.nombre.split(" ")[1];
            } else {

                nombreUser = googleUser.nombre.split(" ")[0].concat(" ", googleUser.nombre.split(" ")[1]);
                apellidoUser = "";

                var limite = googleUser.nombre.split(" ").length - 2;
                for (var i = 0; i < limite; i++) {
                    apellidoUser = apellidoUser.concat(" ", googleUser.nombre.split(" ")[i + 2]);
                }


            }

            usuario.nombre = nombreUser;
            usuario.apellido = apellidoUser;
            usuario.dni = "XXXXXXXX";
            usuario.correo = googleUser.correo;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })

        }

    });
    /*
    res.json({
        usuario: googleUser
    });
    */
});


module.exports = app;