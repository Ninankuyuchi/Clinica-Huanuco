require('./config/config')

const express = require('express');

//declarar la constante mongoose   
const mongoose = require('mongoose');

//se importa el path como ayuda para que inspeccione la direccion de google singin dentro de la carpeta public
//const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando Puerto: ", process.env.PORT);
});