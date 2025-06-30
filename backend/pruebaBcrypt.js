const bcrypt = require('bcrypt');

const nuevaContrasena = '.CR7cristiano';

bcrypt.hash(nuevaContrasena, 10, (err, hash) => {
  if (err) throw err;
  console.log('Nuevo hash:', hash);
});