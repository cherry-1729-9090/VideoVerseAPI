const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');
    db.run(`CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      path TEXT,
      duration INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;