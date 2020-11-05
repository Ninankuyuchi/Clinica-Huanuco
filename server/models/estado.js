const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


let estadosValidos = {
    values: ['confirmado', 'cancelado'],
    message: '{VALUE} no es un rol válido'
}

let estadoSchema = new Schema({
    descripcion: {
        enum: estadosValidos,
        type: String,
        required: [true, 'El estado es obligatorio']

    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);