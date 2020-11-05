const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let citaSchema = new Schema({

    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'] },
    fecha: { type: String, required: [true, 'La fecha es necesaria'] },
    hora: { type: String, required: [true, 'La hora es necesaria'] },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    triaje: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    disponible: { type: Boolean, default: true },
    estado: { type: String, required: true }
});


module.exports = mongoose.model('Cita', citaSchema);