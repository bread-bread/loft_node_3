const path = require('path');
const Db = require('../utils/Db');

const dbPath = path.resolve('./models/db.json');
const db = Db.init(dbPath);

module.exports = db;
