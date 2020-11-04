const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Cita = require('../models/cita');


//middleware
//cuando se llama la funcion de fileUpload cae dentro del objeto "req.files"
//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //si no hay archivo hasta aqui llega
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                error: {
                    mensaje: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    //Validar Tipo
    let tiposValidos = ['usuarios', 'citas']; //para que haga match con las carpetas

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                mensaje: 'los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }


    //si viene un archivo o lo que sea que se suba va a caer en el request sampleFile
    //nombre a colocar cuando nosotros coloquemos un input

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];



    //Extensiones permitidas
    let extensionesValidas = ['docx', 'jpg', 'pdf', 'gif', 'png'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                mensaje: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}-${archivo.name}`


    //.mv te permite mover el archivo con el nombre que se quiera a donde se desee
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui ya se que la imagen se ha cargado
        imagenUsuario(id, res, nombreArchivo);

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

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
                    mensaje: 'Usuario no existe'
                }
            });
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });

}

function archivoCita() {

}


module.exports = app;