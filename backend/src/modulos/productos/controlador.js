const TABLA = 'Productos';

module.exports = function(dbInyectada) {

  let db = dbInyectada;

  if(!db){
    db = require('../../DB/mysql');
  }

  function todos() {
    return db.todos(TABLA);
  }

  function uno(id) {
    return db.uno(TABLA, id);
  }

  function agregar(body) {
    return db.agregar(TABLA, body);
  }

  function eliminar(body) {
    return db.eliminar(TABLA, body);
  }

  // 🆕 Función para obtener categorías únicas desde la tabla productos
  async function obtenerCategorias() {
    // Aquí hacemos query directo para traer las categorías únicas
    const query = `SELECT DISTINCT categoria FROM ${TABLA} ORDER BY categoria`;
    const [rows] = await db.query(query);
    return rows.map(r => r.categoria);
  }

  return {
    todos,
    uno,
    agregar,
    eliminar,
    obtenerCategorias // agregué esto para que exista la función
  }

}
