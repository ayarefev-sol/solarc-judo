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

router.get("/:id/full", (req,res)=>{

  const sessionId = req.params.id

  // 1. получить тренировку
  db.get(
    `SELECT * FROM sessions WHERE id = ?`,
    [sessionId],
    (err, session)=>{

      if(err){
        return res.status(500).json({error:err.message})
      }

      if(!session){
        return res.status(404).json({error:"Session not found"})
      }

      // 2. получить схватки
      db.all(
        `SELECT * FROM randori WHERE session_id = ?`,
        [sessionId],
        (err, randoriList)=>{

          if(err){
            return res.status(500).json({error:err.message})
          }

          if(randoriList.length === 0){
            return res.json({ ...session, randori: [] })
          }

          let completed = 0

          randoriList.forEach((randori, index)=>{

            // 3. получить спортсмена
            db.get(
              `SELECT * FROM judokas WHERE id = ?`,
              [randori.judoka_id],
              (err, judoka)=>{

                randori.judoka = judoka || null

                // 4. получить броски

                const sqlThrows = `
                   SELECT 
                   throws.id,
                   throws.result,
                   techniques.name as technique
                   FROM throws
                   LEFT JOIN techniques 
                   ON throws.technique_id = techniques.id
                   WHERE throws.randori_id = ?
                  `
                db.all(sqlThrows, [randori.id], (err, throwsList)=>{
                 
                    randori.throws = throwsList || []

                    completed++

                    if(completed === randoriList.length){
                      res.json({
                        ...session,
                        randori: randoriList
                      })
                    }

                  }
                )

              }
            )

          })

        }
      )

    }
  )

})

module.exports = router
