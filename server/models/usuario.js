const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
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
        required: [true, 'El dni es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//metodo que llamamos cuando intentamos imprimir mediante Json
usuarioSchema.methods.toJSON = function() {
    let user = this; // lo que sea que se tenga en ese momento
    let userObject = user.toObject(); //todas las propiedades y metodos
    delete userObject.password; // ahora se tiene un objeto sin la contrase;a

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })


module.exports = mongoose.model('Usuario', usuarioSchema);
///////////////////////////////////////////////////