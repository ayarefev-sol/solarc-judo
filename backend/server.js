const express = require("express");
const cors = require("cors");

const initDb = require("./db/initDb");

const sessionsRoutes = require("./routes/sessions");
const randoriRoutes = require("./routes/randori");
const throwsRoutes = require("./routes/throws");

const app = express();

app.use(cors());
app.use(express.json());

// init DB
initDb();

// routes
app.use("/sessions", sessionsRoutes);
app.use("/randori", randoriRoutes);
app.use("/throws", throwsRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API running");
});

// PORT (ВАЖНО)
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});