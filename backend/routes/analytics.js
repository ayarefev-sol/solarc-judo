const express = require('express')
const router = express.Router()
const db = require('../db')

/*
  Аналитика по техникам (универсальная)
  GET /analytics/techniques?judoka_id=1
*/
router.get('/techniques', (req, res) => {

  const { judoka_id } = req.query

  let sql = `
    SELECT 
      techniques.id,
      techniques.name as technique,
      COUNT(throws.id) as attempts,
      SUM(CASE WHEN throws.result = 'ippon' THEN 1 ELSE 0 END) as ippon
    FROM throws
    LEFT JOIN techniques 
      ON throws.technique_id = techniques.id
    LEFT JOIN randori 
      ON throws.randori_id = randori.id
  `

  let params = []

  if (judoka_id) {
    sql += ` WHERE randori.judoka_id = ?`
    params.push(judoka_id)
  }

  sql += `
    GROUP BY techniques.id, techniques.name
    ORDER BY attempts DESC
  `

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const result = rows.map(row => ({
      technique_id: row.id,
      technique: row.technique,
      attempts: row.attempts,
      ippon: row.ippon || 0,
      success_rate: row.attempts > 0
        ? Math.round((row.ippon / row.attempts) * 100)
        : 0
    }))

    res.json(result)
  })
})

/*
  Прогресс по датам
  GET /analytics/progress?judoka_id=1
*/
router.get('/progress', (req, res) => {

  const { judoka_id } = req.query

  if (!judoka_id) {
    return res.status(400).json({ error: 'judoka_id required' })
  }

  const sql = `
    SELECT 
      sessions.date,
      COUNT(randori.id) as fights,
      SUM(randori.ippon) as ippon
    FROM randori
    LEFT JOIN sessions 
      ON randori.session_id = sessions.id
    WHERE randori.judoka_id = ?
    GROUP BY sessions.date
    ORDER BY sessions.date ASC
  `

  db.all(sql, [judoka_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const result = rows.map(row => ({
      date: row.date,
      fights: row.fights,
      ippon: row.ippon || 0
    }))

    res.json(result)
  })
})

module.exports = router 