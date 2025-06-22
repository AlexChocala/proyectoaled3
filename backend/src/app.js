const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const app = express();

//ruta de los productos
const productos = require('./modulos/productos/rutas.js');

//MiddleWare
app.use(morgan('dev'));

// configuracion del puerto
app.set('port', config.app.port);

//rutas de la api Producto
app.use('/api/productos', productos);


//exportacion
module.exports = app;
