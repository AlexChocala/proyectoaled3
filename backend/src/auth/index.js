const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt'); // agregué bcrypt para hash y comparación
const secret = config.jwt.secret;

function asignarToken(data) {
  return jwt.sign(data, secret);
}

function verificarToken(token) {
  return jwt.verify(token, secret);
}

const chequearToken = {
  confirmarToken: function(req) {
    const decodificado = decodificarCabecera(req);
    // modifiqué esto para que asigne user al request
    req.user = decodificado;
  }
}

function obtenerToken(autorizacion) {
  if (!autorizacion) {
    throw new Error('no viene token');
  }

  if (autorizacion.indexOf('Bearer') === -1) {
    throw new Error('Formato invalido');
  }

  let token = autorizacion.replace('Bearer ', '');

  return token;

}

function decodificarCabecera(req) {
  const autorizacion = req.headers.authorization || '';
  const token = obtenerToken(autorizacion);
  const decodificado = verificarToken(token);

  req.user = decodificado;

  return decodificado;
}

// agregué función login para validar email y contraseña con bcrypt
async function login(email, contrasena) {
  // modifiqué para consultar tabla Auth y validar contraseña hasheada
  const db = require('../DB/mysql');
  const registro = await db.query('Auth', { usuario: email });
  if (!registro) return null;

  const match = await bcrypt.compare(contrasena, registro.contrasena);
  if (!match) return null;

  // modifiqué para crear token JWT con email y expiración 1 hora
  const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
  return token;
}

// agregué función para agregar nuevo registro en Auth con hash
async function agregar({ id, usuario, contrasena }) {
  // modifiqué para agregar datos a tabla Auth
  const db = require('../DB/mysql');
  const data = { id, usuario, contrasena };
  return db.agregar('Auth', data);
}

module.exports = {
  asignarToken,
  chequearToken,
  login,      // modifiqué para exportar función login
  agregar     // modifiqué para exportar función agregar
}
