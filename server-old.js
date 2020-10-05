const express = require('express');
const app = express();

//bloque de codigo HTML para poder utilizar-- Parciales
//folder que contiene todos los parciales
const hbs = require('hbs');
require('./hbs/helpers');

const port = process.env.PORT || 3000;

//middleware para llamar a la pagina web index por defecto
app.use(express.static(__dirname + '/public'));

//Express HBS engine- renderizar paginas
hbs.registerPartials(__dirname + '/views/parciales');
app.set('view engine', 'hbs');




app.get('/', (req, res) => {


    //renderiza el archivo home.hbs con sus variables dinamicas
    res.render('home', {
        nombre: 'Wilder Rojas',
    });
});

app.get('/about', (req, res) => {


    //renderiza el archivo home.hbs con sus variables dinamicas
    res.render('about', {});
});


app.listen(port, () => {
    console.log(`Escuchando peticiones en el puerto ${port}`);
});