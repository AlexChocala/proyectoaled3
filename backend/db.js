const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initialize() {
  const connection = await pool.getConnection();

  // Crear base de datos si no existe
  await connection.query(`CREATE DATABASE IF NOT EXISTS pomelo`);
  await connection.query(`USE pomelo`);

  // Crear tabla usuarios
  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT PRIMARY KEY AUTO_INCREMENT,
      nombre VARCHAR(100),
      apellido VARCHAR(100),
      email VARCHAR(150) UNIQUE,
      contraseña VARCHAR(255),
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla productos
  await connection.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      nombre VARCHAR(150),
      descripcion TEXT,
      precio_ars DECIMAL(10,2),
      categoria VARCHAR(100),
      imagen VARCHAR(255),
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  connection.release();
  console.log('✅ Base de datos pomelo y tablas listas');
}

module.exports = { initialize, pool };