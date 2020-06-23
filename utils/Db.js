const fs = require('fs').promises;
const { readFileSync } = require('fs');

class Db {
  static instance;

  constructor(source) {
    if (Db.instance) {
      throw Error('Can create only one instance of Db.')
    } else {
      Db.instance = this;

      this.source = source;
      this.db = this._readDb(source);
    }
  }

  static init(source) {
    if (!Db.instance) {
      Db.instance = new Db(source);
    }

    return Db.instance;
  }

  write = (path, data) => {
    this._readByPath(path, data);

    return fs.writeFile(this.source, JSON.stringify(this.db));
  }

  read = (path) => this._readByPath(path);

  delete = () => {}

  _readDb(path) {
    try {
      const file = readFileSync(path, { encoding: 'utf-8' });

      return JSON.parse(file.toString() || '{}');
    } catch (e) {
      console.log('Db error:', e);

      process.exit(1);
    }
  }

  _readByPath(path, value) {
    if (/[^A-Za-z0-9\.]|\.{2,}/.test(path)) {
      console.log('Invalid path format. Correct format is: "key.key1.key2"');

      process.exit(1);
    }

    const parts = this._normalizePath(path).split('.');
    const length = parts.length;

    let ndx = 0;
    let data = this.db;

    while (ndx < length) {
      const part = parts[ndx];

      if (value && ndx === length - 1) {
        data[part] = value;

        return;
      } else if (value && !data[part]) {
        data[part] = {};
      }

      data = data[part];

      if (!data) {
        ndx = length;

        console.log('Data on this path does not exist.');
      }

      ndx++;
    }

    return data;
  }

  _normalizePath(path) {
    let p = path.trim();

    const lastNdx = p.length - 1;
    const firstChar = p[0];
    const lastChar = p[lastNdx];

    if (firstChar === '.') {
      p = p.slice(1);
    }

    if (lastChar === '.') {
      p = p.slice(0, -1);
    }

    return p;
  }
}

module.exports = Db;
