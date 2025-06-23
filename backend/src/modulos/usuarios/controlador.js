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

  async function register(body) {
    try {
      const usuario = {
        id: body.id,
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        contrasena: body.contrasena
      }
      const respuesta = await db.agregar(TABLA, usuario);
      console.log(respuesta);
      var insertId = 0;

      if (body.id == 0) {
        insertId = respuesta.insertId;
      } else {
        insertId = body.id;
      }

      return true;
    } catch (error) {
      console.error('error en register:', error);
      throw error;
    }
  }

  function eliminar(body) {
    return db.eliminar(TABLA, body);
  }

  return {
    todos,
    uno,
    register,
    eliminar
  }

}
