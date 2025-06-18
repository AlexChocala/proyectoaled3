// Router para Productos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta productos funcionando correctamente' });
});

module.exports = router; // Exporta el router para usarlo en index.js