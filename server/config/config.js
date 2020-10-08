process.env.PORT = process.env.PORT || 3000;

//=====================================
// Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
// Vencimiento del Token
//=====================================
//60segundos * 60minutos * 24horas * 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//=====================================
// SEED de autenticacion
//=====================================
//60segundos * 60minutos * 24horas * 30 dias
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//=====================================
// Base de datos
//=====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/clinica';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//urlDB = 'mongodb+srv://qantu:qantuqantu123@cluster0.o7wpo.mongodb.net/clinica'