const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/:judokaId", (req,res)=>{

  const id = req.params.judokaId

  const sql = `
    SELECT
      COUNT(*) as total_fights,
      SUM(throws_attempted) as attempts,
      SUM(throws_scored) as scored,
      SUM(ippon) as ippons,
      SUM(waza_ari) as waza_aris,
      SUM(osaekomi_seconds) as osaekomi_time
    FROM randori
    WHERE judoka_id = ?
  `

  db.get(sql,[id],(err,row)=>{

    if(err){
      return res.status(500).json({error:err.message})
    }

    const attempts = row.attempts || 0
    const scored = row.scored || 0
    const ippons = row.ippons || 0

    const throw_success = attempts ? (scored/attempts) : 0
    const ippon_rate = row.total_fights ? (ippons/row.total_fights) : 0

    res.json({
      fights: row.total_fights,
      throw_attempts: attempts,
      throws_scored: scored,
      throw_success_rate: throw_success,
      ippons: ippons,
      ippon_rate: ippon_rate,
      waza_ari: row.waza_aris,
      osaekomi_seconds: row.osaekomi_time
    })

  })

})

module.exports = router
