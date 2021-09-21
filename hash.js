const bcrypt = require("bcrypt");

async function encrypt(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

module.exports = encrypt;
