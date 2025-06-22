const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
//rutas de la api-rest
const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
//mensaje error
const error = require('./red/errors');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}


//MiddleWare
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuracion del puerto
app.set('port', config.app.port);

//rutas de la api-rest
app.use('/api/productos', productos);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);

app.use(error);

//exportacion
module.exports = app;
