const TABLA = 'Usuarios';
const auth = require('../auth');

module.exports = function (dbInyectada) {

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
      id: body.id ?? 0,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      activo: body.activo !== undefined && body.activo !== null ? body.activo : 1
    }

    const respuesta = await db.agregar(TABLA, usuario);
    console.log(respuesta);

    let insertId;

    if (respuesta.insertId && respuesta.insertId !== 0) {
      // Se insertó nuevo registro
      insertId = respuesta.insertId;
    } else {
      // Se hizo update, usamos el id existente
      insertId = usuario.id;
    }

    if (!insertId) {
      console.error('ERROR: insertId es nulo o indefinido:', insertId);
      throw new Error('No se obtuvo insertId válido');
    }

    if (body.contrasena) {
      // modifiqué esto para dejar que auth.agregar() haga el hash de la contraseña
      try {
        // Para auth, si el usuario ya existe, actualizar, sino crear
        await auth.agregar({
          id: insertId,
          usuario: body.email,
          contrasena: body.contrasena // <-- PASO LA CONTRASEÑA SIN HASH
        });
      } catch (error) {
        console.error('Error insertando en Auth:', error);
        // Opcional: eliminar usuario creado para evitar inconsistencia
        if (respuesta.insertId && respuesta.insertId !== 0) {
          await db.eliminar(TABLA, { id: insertId });
        }
        throw error;
      }
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