const express = require('express');

const respuesta = require('../../red/respuestas')
const controlador = require('./index');

const router = express.Router();

//logearse
router.get('/login', login);

async function login(req, res, next) {
  try {
    const token = await controlador.login(req.body.nombre, req.body.contrasena);
    respuesta.success(req, res, token, 200);
  } catch (err) { next(err); }

}

module.exports = router;
