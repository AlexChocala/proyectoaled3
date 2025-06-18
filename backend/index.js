const express = require('express');
const cors = require('cors');
const { initialize } = require('./db');
const authRoutes = require('./routes/auth.routes');       // Rutas para autenticación (login, registro)
const productosRoutes = require('./routes/productos.routes');      // Rutas para productos 

const app = express();
const PORT = 3000;

// Permite peticiones desde frontend (CORS)
app.use(cors());   
// Para parsear JSON en las peticiones          
app.use(express.json());     

(async () => {
    // Inicializo conexión a BD
  const dbConnection = await initialize();  

  // Registro las rutas de la API REST
  app.use('/api/auth', authRoutes);           // Ruta base para auth: /api/auth
  app.use('/api/productos', productosRoutes); // Ruta base para productos

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
})();