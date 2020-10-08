//libreria que trae un codigo para recuperar la informacion directamente 
//para ello se requieren 3 argumentows
//token recibido, SEED string creado para mayor seguridad, callback con el error e informacion codificada
const jwt = require('jsonwebtoken');



// ===============================
// Verificar Token
// ===============================
let verificaToken = (req, res, next) => {

    let token = req.get('token'); //obtengo el header

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    mensaje: "Token no válido"
                }
            });
        }

        req.usuario = decoded.usuario; //peticion acceso a la informacion del usuario, objeto encriptado viene usuario
        next();
    });

    //console.log(token);
    //next();
}

// ===============================
// Verificar AdminRole
// ===============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                mensaje: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}