const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//middleware
//cuando se llama la funcion de fileUpload cae dentro del objeto "req.files"
//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', function(req, res) {

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

    //si viene un archivo o lo que sea que se suba va a caer en el request sampleFile
    //nombre a colocar cuando nosotros coloquemos un input

    let archivo = req.files.archivo;

    //.mv te permite mover el archivo con el nombre que se quiera a donde se desee
    archivo.mv('uploads/filename.jpg', (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            mensaje: 'Imagen subida correctamente'
        });
    });

});




module.exports = app;