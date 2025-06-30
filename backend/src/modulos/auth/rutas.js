const express = require('express');
const router = express.Router();
const controlador = require('./controlador')();

router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  const resultado = await controlador.login(email, contrasena);

  if (resultado.error) {
    const mensaje = resultado.message || 'Error';
    const status = mensaje.includes('contraseña') || mensaje.includes('Usuario') ? 401 : 500;
    return res.status(status).json({ error: true, message: mensaje });
  }

  return res.json({ token: resultado.token });
});

module.exports = router;