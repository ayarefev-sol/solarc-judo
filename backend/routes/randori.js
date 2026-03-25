const express = require("express");
const router = express.Router();
const db = require("../db/db");

// CREATE randori
router.post("/", (req, res) => {
  const { session_id, judoka_a_id, judoka_b_id, winner_id } = req.body;

  if (!session_id || !judoka_a_id || !judoka_b_id) {
    return res.status(400).json({ error: "missing fields" });
  }

  db.run(
    `INSERT INTO randori (session_id, judoka_a_id, judoka_b_id, winner_id)
     VALUES (?, ?, ?, ?)`,
    [session_id, judoka_a_id, judoka_b_id, winner_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        session_id,
        judoka_a_id,
        judoka_b_id,
        winner_id,
      });
    }
  );
});

// GET randori by session
router.get("/session/:session_id", (req, res) => {
  db.all(
    "SELECT * FROM randori WHERE session_id = ?",
    [req.params.session_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.
        message });
      res.json(rows);
    }
  );
});

module.exports = router;
