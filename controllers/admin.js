const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { setSkills, setProduct } = require('../models/admin');
const { productSchema, skillsSchema } = require('../utils/validation');

module.exports.get = (req, res) => {
  res.render('pages/admin');
}

module.exports.post = async (req, res) => {
  const { type } = req.params;

  if (type === 'skills') {
    const { error } = skillsSchema.validate(req.body);
    const msgskill = error.details.map(item => item.message).join('; ');

    if (error) {
      res.status(400).render('pages/admin', { msgskill });
    }

    try {
      setSkills(req.body);
  
      res.render('pages/admin', { msgskill: 'Счетчики успешно сохранены' })
    } catch (e) {
      res.render('pages/admin', { msgskill: 'Ошибка. Что-то пошло не так...' })
    }
  } else if (type === 'upload') {
    if (req.file) {
      const { name, price } = req.body;
      const { error } = productSchema.validate({ file: req.file, name, price });

      if (error) {
        const msgfile = error.details.map(item => item.message).join('; ');

        await fs.promises.unlink(req.file.path);

        res.status(400).render('pages/admin', { msgfile });
      }

      const { mimetype, path: src, destination } = req.file;
      const ext = mime.extension(mimetype);
      const filename = `${name}.${ext}`;
      const dbPath = destination.replace('./public', '.') + filename;
      const newPath = path.join(destination, filename);

      setProduct(dbPath, name, price);
  
      fs.rename(src, newPath, err => {
        if (!err) {
          res.render('pages/admin', { msgfile: 'File upload success' });
        }
      });
    } else {
      res.status(400).render('pages/admin', { msgfile: 'Upload error, file is required' });
    }
  }
}