const express = require('express');

const respuesta = require('../../red/respuestas')
const controlador = require('./controlador');

const router = express.Router();

/*
*---- PETICIONES-----
*/

router.get('/', async function(req, res) {
  try {
    const elementos = await controlador.todos();
    respuesta.success(req, res, elementos, 200);
  } catch {
    respuesta.error(req, res, err, 500);
  }

});

router.get('/:id', async function(req, res) {
  try {
    const elementos = await controlador.uno(req.params.id);
    respuesta.success(req, res, elementos, 200);
  } catch {
    respuesta.error(req, res, err, 500);
  }
});

module.exports = router;
