const express = require('express');

const seguridad = require('./seguridad');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const auth = require('../../auth'); // modifiqué para usar funciones de auth

const router = express.Router();

router.get('/', todos);
router.get('/:id', uno);

// rutas para usuarios
router.post('/', agregar);
router.put('/', eliminar);

// modifiqué para agregar ruta login
router.post('/login', login);

/*
*---- PETICIONES-----
*/

async function todos(req, res, next) {
  try {
    const elementos = await controlador.todos();
    respuesta.success(req, res, elementos, 200);
  } catch (err) {
    next(err);
  }
}

async function uno(req, res, next) {
  try {
    const elementos = await controlador.uno(req.params.id);
    respuesta.success(req, res, elementos, 200);
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
  try {
    const elementos = await controlador.agregar(req.body);

    let mensaje = '';
    if (req.body.id == 0) {
      mensaje = 'Elemento agregado exitosamente';
    } else {
      mensaje = 'Elemento modificado exitosamente';
    }

    respuesta.success(req, res, mensaje, 200);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const elementos = await controlador.eliminar(req.body);
    respuesta.success(req, res, 'elemento eliminado correctamente', 200);
  } catch (err) {
    next(err);
  }
}

// agregué función login para validar usuario y password
async function login(req, res, next) {
  try {
    const { email, contrasena } = req.body;
    const token = await auth.login(email, contrasena);
    if (!token) {
      return respuesta.error(req, res, 'Email o contraseña incorrectos.', 401);
    }
    respuesta.success(req, res, { token }, 200);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
