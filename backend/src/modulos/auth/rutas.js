const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

//Logearse
router.post('/login', login);

//Registrar
router.post('/register', register);

async function login(req, res, next) {
  const { email, contrasena } = req.body;

  try {
    const resultado = await controlador.login(email, contrasena);

    res.json({
      success: true,
      token: resultado,
      usuario: { nombre: resultado.nombre }
    });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const resultado = await controlador.register(req.body);
    respuesta.success(req, res, resultado, 201);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
