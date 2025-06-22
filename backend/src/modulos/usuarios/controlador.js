const TABLA = 'Usuarios';
const auth = require('../auth');

module.exports = function(dbInyectada) {

  let db = dbInyectada;

  if (!db) {
    db = require('../../DB/mysql');
  }

  function todos() {
    return db.todos(TABLA);
  }

  function uno(id) {
    return db.uno(TABLA, id);
  }

  async function agregar(body) {
    const usuario = {
      id: body.id,
      nombre: body.nombre,
      email: body.email,
      activo: body.activo
    }
    const respuesta = await db.agregar(TABLA, usuario);
    console.log(respuesta);
    var insertId = 0;

    if (body.id == 0) { //si es nuevo, devuelve el id de ese registro insertado
      insertId = respuesta.insertId;
    } else {
      insertId = body.id;
    }


    if (body.nombre || body.contrasena) {
      await auth.agregar({
        id: insertId,
        usuario: body.nombre,
        contrasena: body.contrasena
      });
    }

    return true;
  }

  function eliminar(body) {
    return db.eliminar(TABLA, body);
  }

  return {
    todos,
    uno,
    agregar,
    eliminar
  }

}
