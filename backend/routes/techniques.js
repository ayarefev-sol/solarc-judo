const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", (req,res)=>{

  const { name, category } = req.body

  const sql = `
    INSERT INTO techniques (name, category)
    VALUES (?, ?)
  `

  db.run(sql,[name,category],function(err){

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json({id:this.lastID})

  })

})

router.get("/",(req,res)=>{

  const sql = `SELECT * FROM techniques`

  db.all(sql,[],(err,rows)=>{

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json(rows)

  })

})

module.exports = router