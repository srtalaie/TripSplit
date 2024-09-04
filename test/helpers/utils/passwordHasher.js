const bcrypt = require('bcrypt')

const passwordHasher = async (password) => {
  const saltRounds = 10
  const password_hash = await bcrypt.hash(password, saltRounds)
  return password_hash
}

module.exports = { passwordHasher }
