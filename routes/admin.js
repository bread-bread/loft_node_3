const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/assets/img/products/' });
const { get, post } = require('../controllers/admin');

router.get('/', get);

router.post('/:type', upload.single('photo'), post);

module.exports = router;
