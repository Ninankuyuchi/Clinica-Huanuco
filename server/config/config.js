process.env.PORT = process.env.PORT || 3000;

//=====================================
// Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
// Base de datos
//=====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/clinica';
} else {
    urlDB = 'mongodb+srv://qantu:qantuqantu123@cluster0.o7wpo.mongodb.net/clinica';
}

process.env.URLDB = urlDB;