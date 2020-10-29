const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let pacienteSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    dni: {
        type: String,
        unique: true,
        required: [true, 'El DNI es necesario']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es necesaria']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es necesario']
    },
    sexo: {
        type: String,
        required: [true, 'El sexo es necesario']
    },
    tipoSangre: {
        type: String,
        required: false
    },
    fechaNacimiento: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: 'Proceso'
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Paciente', pacienteSchema);