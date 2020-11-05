const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let triajeSchema = new Schema({

    peso: { type: String, required: [true, 'El peso es obligatorio'] },
    talla: { type: String, required: [true, 'La talla es necesaria'] },
    presionArterial: { type: String, required: [true, 'La presion arterial es necesaria'] },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    temperatura: { type: String, required: [true, 'La temperatura es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    frecuenciaCardiaca: { type: String, required: [true, 'La frecuencia cardiaca es necesaria'] },
    frecuenciaRespiratoria: { type: String, required: [true, 'La frecuencia respiratoria es necesaria'] },
    saturacionDeOxigeno: { type: String, required: [true, 'La saturación de oxígeno es necesaria'] },
    perimetroDePantorrilla: { type: String, required: [true, 'El perímetro de pantorrilla es necesario'] },
    fuerzaDePresion: { type: String, required: [true, 'La fuerza de presión es necesaria'] },
    velocidadDeMarcha: { type: String, required: [true, 'La velocidad de marcha es necesaria'] },
    lawton: { type: String, required: [true, 'La información de lawton es necesaria'] },
    barthel: { type: String, required: [true, 'La información de barthel es necesaria'] },
    escalaDelDolor: { type: String, required: [true, 'La escala del dolor es necesaria'] },
    ram: { type: String, required: [true, 'La información de ram es necesaria'] },
    enfermedadesPrevias: { type: String, required: [true, 'La información de enfermedades previas son necesaria'] },
    estado: { type: Boolean, default: true },
});


module.exports = mongoose.model('Triaje', triajeSchema);