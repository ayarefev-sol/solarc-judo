const express = require("express");
const router = express.Router();
const db = require("../db/db");

// GET all sessions
router.get("/", (req, res) => {
  db.all("SELECT * FROM sessions ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET one session
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM sessions WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });
});

// CREATE session
router.post("/", (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ error: "date required" });
  }

  db.run(
    "INSERT INTO sessions (date) VALUES (?)",
    [date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        date,
      });
    }
  );
});

module.exports = router;
