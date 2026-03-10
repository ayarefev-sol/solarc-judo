const express = require("express")
const cors = require("cors")

const db = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "SolArc API running" })
})

app.listen(5000, () => {
  console.log("Server started on port 5000")
})

db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS judokas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    belt TEXT,
    weight_class TEXT
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS randori(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judoka_id INTEGER,
    opponent TEXT,
    throws_attempted INTEGER,
    throws_scored INTEGER,
    ippon INTEGER,
    waza_ari INTEGER,
    shido INTEGER,
    osaekomi_seconds INTEGER
  )`)

})