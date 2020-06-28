const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/assets/img/products/' });
const { get, postSkills, postUpload } = require('../controllers/admin');

router.get('/', get);

router.post('/skills', postSkills);

router.post('/upload', upload.single('photo'), postUpload);

module.exports = router;
