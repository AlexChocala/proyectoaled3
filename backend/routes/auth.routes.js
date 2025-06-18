const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../db');

/*
 * Autenticación de usuarios:
 * - API REST en Node.js para autenticación (registro y login)
 * - Gestión segura de usuarios en MySQL con contraseña encriptada
 * - Validaciones para evitar registros duplicados y manejo de errores
 */

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;

  try {
    // Encriptar la contraseña antes de guardar
    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en la base de datos
    await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, contraseña, creado_en) VALUES (?, ?, ?, ?, NOW())',
      [nombre, apellido, email, contraseñaEncriptada]
    );

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Buscar usuario por email
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Correo electrónico o contraseña incorrectos.' });
    }

    const usuario = rows[0];

    // Comparar contraseña ingresada con la almacenada
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Correo electrónico o contraseña incorrectos.' });
    }

    // Usuario autenticado correctamente
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión' });
  }
});

module.exports = router;