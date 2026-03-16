const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", (req,res)=>{

  const { date, focus, notes } = req.body

  const sql = `
    INSERT INTO sessions (date, focus, notes)
    VALUES (?, ?, ?)
  `

  db.run(sql,[date,focus,notes],function(err){

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json({id:this.lastID})

  })

})

router.get("/",(req,res)=>{

  const sql = `SELECT * FROM sessions`

  db.all(sql,[],(err,rows)=>{

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json(rows)

  })

})

router.get("/:id",(req,res)=>{

  const id = req.params.id

  const sql = `
    SELECT * FROM sessions
    WHERE id = ?
  `

  db.get(sql,[id],(err,row)=>{

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json(row)

  })

})

module.exports = router
