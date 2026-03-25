const express = require("express");
const router = express.Router();
const db = require("../db/db");

// CREATE throw
router.post("/", (req, res) => {
  const { randori_id, judoka_id, technique, result } = req.body;

  if (!randori_id || !judoka_id || !technique || !result) {
    return res.status(400).json({ error: "missing fields" });
  }

  db.run(
    `INSERT INTO throws (randori_id, judoka_id, technique, result)
     VALUES (?, ?, ?, ?)`,
    [randori_id, judoka_id, technique, result],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        randori_id,
        judoka_id,
        technique,
        result,
      });
    }
  );
});

// GET throws by randori
router.get("/randori/:randori_id", (req, res) => {
  db.all(
    "SELECT * FROM throws WHERE randori_id = ?",
    [req.params.randori_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

module.exports = router;