const TABLA = 'Auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth');

module.exports = function(dbInyectada) {

  let db = dbInyectada;

  if (!db) {
    db = require('../../DB/mysql');
  }


  async function login(email, contrasena) {
    const data = await db.query(TABLA, { usuario: email });
    return bcrypt.compare(contrasena, data.contrasena)
      .then(resultado => {
        if (resultado === true) {
          //generar token
          return auth.asignarToken({ ...data });
        } else {
          throw new Error('informacion invalida');
        }
      })
  }

  async function agregar(data) {

    const authData = {
      id: data.id,
    }

    if (data.usuario) {
      authData.usuario = data.usuario;
    }

    if (data.contrasena) {
      authData.contrasena = await bcrypt.hash(data.contrasena.toString(), 5);
    }

    return db.agregar(TABLA, authData);
  }

  return {
    agregar,
    login
  }

}
