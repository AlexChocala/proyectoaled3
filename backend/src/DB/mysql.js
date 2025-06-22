const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
}

let conexion;

function conMysql(){
  conexion = mysql.createConnection(dbconfig);
  conexion.connect( (err)=> {
    if(err){
      console.log(['db err'], err);
      setTimeout(conMysql(), 200);
    }else {
      console.log('db conectado');
    }
  } );

  conexion.on('error', err => {
    console.log('[db err]',err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST' ){
      conMysql();
    }else{
      throw err;
    }
  });
}


//TEST1
const prueba = {
  id: 5,
  nombre: 'juan',
  edad: 10
}




conMysql();

/*
* Trae todos los elementos de la base de datos de X tabla
*
*/
function todos(tabla){
  return new Promise( (resolve,reject) => {
    conexion.query(`SELECT * FROM ${tabla}`, (error,result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function uno(tabla, id){
    return new Promise( (resolve,reject) => {
    conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (error,result) => {
      return error ? reject(error) : resolve(result);
    });
  });

}

function agregar(tabla, data){}

function eliminar(tabla,id){}


module.exports ={
  todos,
  uno,
  agregar,
  eliminar
}
