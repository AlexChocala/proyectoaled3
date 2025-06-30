const TABLA = 'auth'; // Tabla de usuarios en la BD
const bcrypt = require('bcrypt'); // Para encriptar y comparar contraseñas
const jwtLib = require('jsonwebtoken'); // Para generar tokens JWT
const { jwt } = require('../../config'); // Importa configuración JWT
const SECRET_KEY = jwt.secret; // Clave secreta para firmar tokens

module.exports = function (dbInyectada) {
  let db = dbInyectada || require('../../DB/mysql'); // Conexión a la BD (inyectada o por defecto)

  async function login(email, contrasena) {
    console.log('📩 Contraseña recibida (raw):', JSON.stringify(contrasena));
    console.log('📦 Buffer de contraseña:', Buffer.from(contrasena));

    try {
      const data = await db.query(TABLA, { usuario: email }); // Buscar usuario por email

      if (!data || data.length === 0) {
        console.log('❌ Usuario no encontrado');
        return { error: true, message: 'Usuario no encontrado' };
      }

      const usuario = data[0];
      console.log('📩 Contraseña ingresada:', contrasena);
      console.log('🔐 Hash en base de datos:', usuario.contrasena);

      // modifiqué esto para eliminar comillas dobles, simples, y espacios invisibles
      const contrasenaLimpia = contrasena
        .replace(/['"]/g, '')       // elimina TODAS las comillas dobles y simples
        .replace(/\u200B/g, '')     // elimina caracteres invisibles (como zero-width space)
        .trim();

      console.log('📩 Contraseña limpia para comparar:', JSON.stringify(contrasenaLimpia));

      const esValido = await bcrypt.compare(contrasenaLimpia, usuario.contrasena);
      console.log('🔑 ¿Contraseña válida?:', esValido);

      if (!esValido) {
        console.log('❌ Contraseña incorrecta');
        return { error: true, message: 'Contraseña incorrecta' };
      }

      const token = jwtLib.sign(
        { id: usuario.id, email: usuario.usuario },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      console.log(`✅ Usuario: ${usuario.usuario} inició sesión con éxito`);
      return { token };

    } catch (error) {
      console.error('🔥 Error inesperado en login:', error.message);
      return { error: true, message: 'Error interno del servidor' };
    }
  }

  async function agregar({ id, usuario, contrasena }) {
    const hash = await bcrypt.hash(contrasena, 10); // Encripta la contraseña antes de guardar
    return db.agregar(TABLA, { id, usuario, contrasena: hash }); // Guarda usuario con hash en BD
  }

  return {
    login,
    agregar
  };
};