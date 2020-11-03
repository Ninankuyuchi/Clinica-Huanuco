const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;



let registroExternoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    dni: {
        type: String,
        unique: true,
        required: [true, 'El dni es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: false

    },
    telefono: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    dependencia: {
        type: String,
        requerid: [true, 'la dependencia con el registro de paciente es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('RegistroExterno', registroExternoSchema);
///////////////////////////////////////////////////