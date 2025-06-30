const mysql = require('mysql2/promise');

async function init() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  // crea la base de datos si no existe
  await connection.query(`CREATE DATABASE IF NOT EXISTS afterstreet;`);
  
  // selecciona la base de datos
  await connection.query(`USE afterstreet;`);

  // crea tabla usuarios
  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      activo BOOLEAN DEFAULT TRUE,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // crea tabla auth
  await connection.query(`
    CREATE TABLE IF NOT EXISTS auth (
      id INT PRIMARY KEY,
      usuario VARCHAR(254) NOT NULL UNIQUE,
      contrasena VARCHAR(100) NOT NULL,
      FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  // crea tabla productos
  await connection.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10,2) NOT NULL,
      categoria VARCHAR(50),
      stock INT DEFAULT 0,
      imagen VARCHAR(255)
    );
  `);

  // crea tabla facturas
  await connection.query(`
    CREATE TABLE IF NOT EXISTS facturas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      totalARS DECIMAL(12,2) NOT NULL,
      totalUSD DECIMAL(12,2) NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  // crea tabla detalle_factura
  await connection.query(`
    CREATE TABLE IF NOT EXISTS detalle_factura (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_factura INT NOT NULL,
      id_producto INT NOT NULL,
      cantidad INT NOT NULL,
      precioUnitarioARS DECIMAL(10,2) NOT NULL,
      precioUnitarioUSD DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (id_factura) REFERENCES facturas(id) ON DELETE CASCADE,
      FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
    );
  `);

  console.log('Base de datos y tablas creadas o verificadas correctamente.');

  await connection.end();
}

init();