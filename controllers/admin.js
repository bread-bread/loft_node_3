const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { setSkills, setProduct } = require('../models/admin');
const { productSchema, skillsSchema } = require('../utils/validation');

const MSGSKILL_KEY = 'msgskill';
const MSGFILE_KEY = 'msgfile';

module.exports.get = (req, res, pageData) => {
  res.render(
    'pages/admin',
    {
      msgskill: req.flash(MSGSKILL_KEY)[0],
      msgfile: req.flash(MSGFILE_KEY)[0]
    }
  );
}

module.exports.postSkills = async (req, res) => {
  const { error } = skillsSchema.validate(req.body);
  const msgskill = error.details.map(item => item.message).join('; ');

  if (error) {
    res.status(400);
    exports.get(req, res, { msgskill });
  }

  try {
    setSkills(req.body);

    req.flash(MSGSKILL_KEY, 'Счетчики успешно сохранены');
  } catch (e) {
    res.status(400);
    req.flash(MSGSKILL_KEY, 'Ошибка. Что-то пошло не так...');
  }

  res.redirect('/admin');
}

module.exports.postUpload = async (req, res) => {
  if (req.file) {
    const { name, price } = req.body;
    const { error } = productSchema.validate({ file: req.file, name, price });

    if (error) {
      const msgfile = error.details.map(item => item.message).join('; ');
      
      await fs.promises.unlink(req.file.path);

      res.status(400);
      req.flash(MSGFILE_KEY, msgfile);

      return res.redirect('/admin');
    }

    const { mimetype, path: src, destination } = req.file;
    const ext = mime.extension(mimetype);
    const filename = `${name}.${ext}`;
    const dbPath = destination.replace('./public', '.') + filename;
    const newPath = path.join(destination, filename);

    fs.rename(src, newPath, err => {
      if (err) {
        req.flash(MSGFILE_KEY, 'Upload error');
      } else {
        setProduct(dbPath, name, price);

        req.flash(MSGFILE_KEY, 'File upload success');
      }

      res.redirect('/admin');
      
    });
  } else {
    res.status(400);
    req.flash(MSGFILE_KEY, 'Upload error');
    res.redirect('/admin');
  }
}
