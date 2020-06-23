const crypto = require('crypto');
const db = require('../models/data-base');

module.exports.setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex')
  return { hash, salt };
}

module.exports.validPassword = (password) => {
  const user = db.read('user');
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 512, 'sha512')
    .toString('hex')
  return hash === user.hash;
}