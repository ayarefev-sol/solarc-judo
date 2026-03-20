const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", (req,res)=>{

  const { randori_id, technique_id, result } = req.body

  const sql = `
    INSERT INTO throws (randori_id, technique_id, result)
VALUES (?, ?, ?)
  `

  db.run(sql,[randori_id, technique_id, result], function(err){

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json({id:this.lastID})

  })

router.get("/:randoriId",(req,res)=>{

  const id = req.params.randoriId

  const sql = `
    SELECT * FROM throws
    WHERE randori_id = ?
  `

  db.all(sql,[id],(err,rows)=>{

    if(err){
      return res.status(500).json({error:err.message})
    }

    res.json(rows)
  })
})

})

module.exports = router