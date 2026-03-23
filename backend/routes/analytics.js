const express = require('express')
const router = express.Router()
const db = require('../db')

/*
  TECHNIQUE RECOMMENDATIONS
*/
router.get('/techniques/recommendations', (req, res) => {

  const { judoka_id } = req.query

  if (!judoka_id) {
    return res.status(400).json({ error: 'judoka_id required' })
  }

  const sql = `
    SELECT 
      techniques.name as technique,
      COUNT(throws.id) as attempts,
      SUM(CASE WHEN throws.result = 'ippon' THEN 1 ELSE 0 END) as success
    FROM throws
    LEFT JOIN techniques 
      ON throws.technique_id = techniques.id
    LEFT JOIN randori 
      ON throws.randori_id = randori.id
    WHERE randori.judoka_id = ?
    GROUP BY techniques.name
  `

  db.all(sql, [judoka_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const result = rows.map(r => {

      const successRate = r.attempts > 0 
        ? Math.round((r.success / r.attempts) * 100)
        : 0

      let advice = ""

      if (successRate < 30) {
        advice = "Слабая техника — проработать базу и увеличить повторения"
      } else if (successRate < 60) {
        advice = "Средний уровень — улучшить тайминг и вход"
      } else {
        advice = "Сильная техника — использовать чаще в схватках"
      }

      return {
        technique: r.technique,
        attempts: r.attempts,
        success: successRate,
        advice
      }
    })

    res.json(result)
  })
})

module.exports = router 