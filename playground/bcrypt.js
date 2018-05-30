const bcrypt = require('bcryptjs');

const password = 'abc';
console.log('Password:', password);
bcrypt.hash(password, 10)
  .then((hash) => {
    console.log('Hashed password', hash);
  })
  .catch(e => {
    console.log(e);
  })

// const hashedPassword = '$2a$10$atkTih6luNvd3tvlplMSkuhpErBtq7gYESSxgfgNcv74iyvNzEmCm';
//
// bcrypt.compare(password, hashedPassword, (err, result) => {
//   console.log('Password is valid:', result);
// })
