const db = require('../models/data-base');
const { authSchema } = require('../utils/validation');
const { validPassword } = require('../utils/password');

module.exports.get = (req, res) => {
  if (req.session.isAuth) {
    res.redirect('/admin');
  } else {
    res.render('pages/login');
  }
}

module.exports.post = (req, res) => {
  const { email } = db.read('user');
  const { error } = authSchema.validate(req.body);

  if (error) {
    const msglogin = error.details.map(item => item.message).join('; ');

    res.status(400).render('pages/login', { msglogin });
  }

  if (req.body.email === email && validPassword(req.body.password)) {
    req.session.isAuth = true;
    res.redirect('/admin');
  } else {
    res.status(401).render('pages/login', { msglogin: 'Email или пароль не верны.' })
  }
}

module.exports.isAuthorized = (req, res, next) => {
  req.session.isAuth ? next() : res.redirect('/login');
}
