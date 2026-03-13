const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", (req, res) => {

  const {
    judoka_id,
    opponent,
    throws_attempted,
    throws_scored,
    ippon,
    waza_ari,
    shido,
    osaekomi_seconds
  } = req.body

  const sql = `
    INSERT INTO randori
    (judoka_id, opponent, throws_attempted, throws_scored, ippon, waza_ari, shido, osaekomi_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.run(sql,
    [judoka_id, opponent, throws_attempted, throws_scored, ippon, waza_ari, shido, osaekomi_seconds],
    function(err){

      if(err){
        return res.status(500).json({ error: err.message })
      }

      res.json({ id: this.lastID })

    })

})

router.get("/", (req,res)=>{

  const sql = `SELECT * FROM randori`

  db.all(sql, [], (err, rows)=>{

    if(err){
      return res.status(500).json({ error: err.message })
    }

    res.json(rows)

  })

})

router.get("/:judokaId", (req,res)=>{

  const id = req.params.judokaId

  const sql = `
    SELECT * FROM randori
    WHERE judoka_id = ?
  `

  db.all(sql, [id], (err, rows)=>{

    if(err){
      return res.status(500).json({ error: err.message })
    }

    res.json(rows)

  })

})

module.exports = router
