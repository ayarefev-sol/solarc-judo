const express = require('express')
const router = express.Router()
const db = require('../db')

/*
  SUMMARY
*/
router.get('/summary', (req, res) => {

  const { judoka_id } = req.query

  if (!judoka_id) {
    return res.status(400).json({ error: 'judoka_id required' })
  }

  const sql = `
    SELECT 
      COUNT(*) as fights,
      SUM(ippon) as ippon,
      SUM(throws_attempted) as attempts,
      SUM(throws_scored) as scored
    FROM randori
    WHERE judoka_id = ?
  `

  db.get(sql, [judoka_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const fights = row.fights || 0
    const ippon = row.ippon || 0
    const attempts = row.attempts || 0
    const scored = row.scored || 0

    res.json({
      fights,
      ippon,
      win_rate: fights > 0 ? Math.round((ippon / fights) * 100) : 0,
      throw_success: attempts > 0 ? Math.round((scored / attempts) * 100) : 0
    })
  })
})

/*
  RECOMMENDATIONS
*/
router.get('/recommendations', (req, res) => {

  const { judoka_id } = req.query

  if (!judoka_id) {
    return res.status(400).json({ error: 'judoka_id required' })
  }

  const sql = `
    SELECT 
      COUNT(*) as fights,
      SUM(ippon) as ippon,
      SUM(throws_attempted) as attempts,
      SUM(throws_scored) as scored
    FROM randori
    WHERE judoka_id = ?
  `

  db.get(sql, [judoka_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const fights = row.fights || 0
    const ippon = row.ippon || 0
    const attempts = row.attempts || 0
    const scored = row.scored || 0

    const win_rate = fights > 0 ? (ippon / fights) * 100 : 0
    const throw_success = attempts > 0 ? (scored / attempts) * 100 : 0

    let recommendations = []

    if (fights < 5) {
      recommendations.push("Мало схваток — набирай опыт")
    }

    if (throw_success < 40) {
      recommendations.push("Низкая эффективность бросков — работай над техникой")
    }

    if (win_rate < 50) {
      recommendations.push("Низкий процент побед — работай над тактикой")
    }

    if (recommendations.length === 0) {
      recommendations.push("Хороший уровень — продолжай")
    }

    res.json({
      fights,
      win_rate: Math.round(win_rate),
      throw_success: Math.round(throw_success),
      recommendations
    })
  })
})

/*
  INSIGHTS (ключевой endpoint)
*/
router.get('/techniques/insights', (req, res) => {

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

    const data = rows.map(r => ({
      technique: r.technique,
      success: r.attempts > 0 
        ? Math.round((r.success / r.attempts) * 100)
        : 0
    }))

    const sorted = data.sort((a, b) => b.success - a.success)

    res.json({
      best: sorted.slice(0, 3),
      worst: sorted.slice(-3)
    })
  })
})

module.exports = router