const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./personal'));
app.use(require('./upload'));
app.use(require('./paciente'));
app.use(require('./cita'));
app.use(require('./registroExterno'));
app.use(require('./triaje'));
app.use(require('./especialidad'));


module.exports = app;