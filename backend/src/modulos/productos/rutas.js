const express = require('express');

const respuesta = require('../../red/respuestas')
const controlador = require('./index');

const router = express.Router();

router.get('/',todos);
router.get('/:id',uno);
router.post('/',agregar);
router.put('/',eliminar); //TODO revisar funcionamiuento id

/*
*---- PETICIONES-----
*/

async function todos(req, res ,next) {
  try {
    const elementos = await controlador.todos();
    respuesta.success(req, res, elementos, 200);
  } catch(err) {
    next(err);
  }

};

 async function uno(req, res, next) {
  try {
    const elementos = await controlador.uno(req.params.id);
    respuesta.success(req, res, elementos, 200);
  } catch(err) {
    next(err);
  }
};


 async function agregar(req, res, next) {
  try {
    const elementos = await controlador.agregar(req.body);

    if(req.body.id == 0){
      mensaje = 'Elemento agregado exitosamente';
    }else {
      mensaje = 'Elemento modificado exitosamente';
    }
    respuesta.success(req, res, elementos, 200);
  } catch(err) {
    next(err);
  }
};


 async function eliminar(req, res, next) {
  try {
    const elementos = await controlador.eliminar(req.body);
    respuesta.success(req, res, 'elemento eliminado correctamete', 200);
  } catch(err) {
    next(err);
  }
};

module.exports = router;
