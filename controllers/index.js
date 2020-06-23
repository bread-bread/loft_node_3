const sg = require('@sendgrid/mail');
const path = require('path');
const db = require('../models/data-base');
require('dotenv').config();

sg.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.get = (req, res) => {
  const skills = db.read('skills');
  const products = db.read('products');

  res.render('pages/index', { skills, products });
}
module.exports.post = (req, res, next) => {
  const skills = db.read('skills');
  const products = db.read('products');
  const { email, name, message } = req.body;
  const msg = {
    to: 'node.test.loft@gmail.com',
    from: email,
    subject: `Сообщение с сайта от: ${name}`,
    text: message,
  };

  try {
    sg.send(msg);
    res.render('pages/index', { skills, products, msgemail: 'Сообщение успешно отправлено!' });
  } catch (e) {
    res.render('pages/index', { skills, products, msgemail: e });
  }
}