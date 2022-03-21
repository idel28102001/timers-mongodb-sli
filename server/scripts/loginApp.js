const logs = require("./logs");
const express = require("express");
const addTimerEvents = require("./userApp");
const app = express();
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const clientPromise = MongoClient.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

app.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db("users");
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json());
addTimerEvents(app);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await logs.findUserByUserName(req.db, username, res);
  if (!user) {
    return res.status(203).json({ error: "Wrong username or password!" });
  }
  if (!(await logs.bcrypt.compare(password, user.password))) {
    return res.status(203).json({ error: "Wrong username or password!" });
  }
  const sessionId = await logs.createSession(req.db, user._id);
  res.json({ sessionId });
});

app.get("/logout", logs.auth(), async (req, res) => {
  if (!req.sessionId) {
    return res.status(203).json({ error: "You was not logged in" });
  }
  await logs.deleteSession(req.db, req.sessionId, res);
  fs.writeFileSync(path.join(__dirname, "../sb-timers-session/db.json"), JSON.stringify({}));
  res.json({});
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  logs.updateUsers(req.db, username, password, res);
});

module.exports = app;
