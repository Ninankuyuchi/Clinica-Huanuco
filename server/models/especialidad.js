const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;



let especialidadSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    oferta: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Especialidad', especialidadSchema);
///////////////////////////////////////////////////