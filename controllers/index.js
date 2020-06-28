const sg = require('@sendgrid/mail');
const db = require('../models/data-base');
require('dotenv').config();

const MESSAGE_KEY = 'msgemail';

sg.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.get = (req, res, data) => {
  const skills = db.read('skills');
  const products = db.read('products');
  const pageData = { skills, products };

  if (typeof data !== 'function') {
    pageData.msgemail = data.msgemail;
  }

  res.render('pages/index', { skills, products, msgemail: req.flash(MESSAGE_KEY)[0] });
}
module.exports.post = async (req, res, next) => {
  const { email, name, message } = req.body;
  const msg = {
    to: 'node.test.loft@gmail.com',
    from: email,
    subject: `Сообщение с сайта от: ${name}`,
    text: message,
  };

  try {
    await sg.send(msg);

    req.flash(MESSAGE_KEY, 'Сообщение успешно отправлено!');
  } catch (e) {
    const msg = e.response.body.errors.map(e => e.message).join('; ');

    req.flash(MESSAGE_KEY, msg);
  }

  res.redirect('/');
}