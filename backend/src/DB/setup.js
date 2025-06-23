const mysql = require('mysql');
const config = require('../config');

const conexion = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password
});

conexion.connect((err) => {
  if (err) {
    console.error('[setup error]', err);
    return;
  }

  console.log('conectado para inicialización');

  // crear base de datos si no existe
  conexion.query(`CREATE DATABASE IF NOT EXISTS ${config.mysql.database}`, (err) => {
    if (err) throw err;
    console.log(`base de datos '${config.mysql.database}' lista`);

    // usar base de datos
    conexion.query(`USE ${config.mysql.database}`, (err) => {
      if (err) throw err;

      // crear tabla usuarios
      const crearTablaUsuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          apellido VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // crear tabla productos
      const crearTablaProductos = `
        CREATE TABLE IF NOT EXISTS productos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(150) NOT NULL,
          descripcion TEXT,
          precio_ars DECIMAL(10,2) NOT NULL,
          categoria VARCHAR(100),
          imagen VARCHAR(255),
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

      // crear tabla facturas
      const crearTablaFacturas = `
        CREATE TABLE IF NOT EXISTS facturas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuario_id INT NOT NULL,
          fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_ars DECIMAL(10,2) NOT NULL,
          total_usd DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
      `;

      // crear tabla detalle_facturas
      const crearTablaDetalleFacturas = `
        CREATE TABLE IF NOT EXISTS detalle_facturas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          factura_id INT NOT NULL,
          producto_id INT NOT NULL,
          cantidad INT NOT NULL,
          precio_unitario_ars DECIMAL(10,2) NOT NULL,
          precio_unitario_usd DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (factura_id) REFERENCES facturas(id),
          FOREIGN KEY (producto_id) REFERENCES productos(id)
        )
      `;

      conexion.query(crearTablaUsuarios, (err) => {
        if (err) throw err;
        console.log('tabla usuarios lista');

        conexion.query(crearTablaProductos, (err) => {
          if (err) throw err;
          console.log('tabla productos lista');

          conexion.query(crearTablaFacturas, (err) => {
            if (err) throw err;
            console.log('tabla facturas lista');

            conexion.query(crearTablaDetalleFacturas, (err) => {
              if (err) throw err;
              console.log('tabla detalle_facturas lista');

              conexion.end();
              console.log('setup completo');
            });
          });
        });
      });
    });
  });
});

const db = require('./mysql');

async function test() {
  try {
    const resultado = await db.agregar('usuarios', {
      nombre: 'Test',
      apellido: 'Tester',
      email: 'test@test.com',
      contrasena: '123456'
    });
    console.log('Resultado de insertar:', resultado);
  } catch (error) {
    console.error('Error en insert:', error);
  }
}

test();