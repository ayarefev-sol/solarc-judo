const express = require("express")
const router = express.Router()
const db = require("../db")

// создать дзюдоиста
router.post("/", (req, res) => {

  const { name, belt, weight_class } = req.body

  const sql = `
    INSERT INTO judokas (name, belt, weight_class)
    VALUES (?, ?, ?)
  `

  db.run(sql, [name, belt, weight_class], function(err) {

    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json({
      id: this.lastID,
      name,
      belt,
      weight_class
    })

  })

})

// получить всех дзюдоистов
router.get("/", (req, res) => {

  const sql = `SELECT * FROM judokas`

  db.all(sql, [], (err, rows) => {

    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(rows)

  })

})

module.exports = router