const db = require("./db");

const initDb = () => {
  db.serialize(() => {
    // sessions
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL
      )
    `);

    // randori (ИСПРАВЛЕНО)
    db.run(`
      CREATE TABLE IF NOT EXISTS randori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        judoka_a_id INTEGER,
        judoka_b_id INTEGER,
        winner_id INTEGER,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      )
    `);

    // throws
    db.run(`
      CREATE TABLE IF NOT EXISTS throws (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        randori_id INTEGER,
        judoka_id INTEGER,
        technique TEXT,
        result TEXT CHECK(result IN ('attempt','score')),
        FOREIGN KEY(randori_id) REFERENCES randori(id)
      )
    `);

    // индексы (важно)
    db.run(`CREATE INDEX IF NOT EXISTS idx_randori_session ON randori(session_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_throws_randori ON throws(randori_id)`);
  });
};

module.exports = initDb;