const express = require("express")
const cors = require("cors")

const db = require("./db")

const judokaRoutes = require("./routes/judokas")

const app = express()

const randoriRoutes = require("./routes/randori")

const analyticsRoutes = require("./routes/analytics")

const throwsRoutes = require("./routes/throws")

const techniquesRoutes = require("./routes/techniques")

const sessionsRoutes = require("./routes/sessions")

app.use(cors())
app.use(express.json())

app.use("/randori", randoriRoutes)

app.get("/", (req, res) => {
  res.json({ message: "SolArc API running" })
})

app.use("/judokas", judokaRoutes)

app.use("/analytics", analyticsRoutes)

app.use("/throws", throwsRoutes)

app.use("/techniques", techniquesRoutes)

app.use("/sessions", sessionsRoutes)

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
  session_id INTEGER,
  judoka_id INTEGER,
  opponent TEXT,
  throws_attempted INTEGER,
  throws_scored INTEGER,
  ippon INTEGER,
  waza_ari INTEGER,
  shido INTEGER,
  osaekomi_seconds INTEGER
)`)

db.run(`CREATE TABLE IF NOT EXISTS throws(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  randori_id INTEGER,
  technique_id INTEGER,
  result TEXT
)`)

db.run(`CREATE TABLE IF NOT EXISTS techniques(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT
)`)

db.run(`CREATE TABLE IF NOT EXISTS sessions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  focus TEXT,
  notes TEXT
)`)

})