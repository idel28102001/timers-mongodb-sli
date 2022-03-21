const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const findSession = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../sb-timers-session/db.json"), {
      encoding: "utf8",
      flag: "r",
    })
  );
};

const findUserByUserName = async (db, username, res) => {
  try {
    return await db.collection("users").findOne({ username });
  } catch (err) {
    console.error(err.message);
    return res.redirect("/?authError=true");
  }
};

const createSessionF = (sessionId) => {
  fs.writeFileSync(path.join(__dirname, "../sb-timers-session/db.json"), JSON.stringify({ sessionId }));
};

const findUserBySessionId = async (db, sessionId) => {
  const session = await db.collection("sessions").findOne({ sessionId }, { projection: { userId: 1 } });
  if (session) {
    if (session.userId.insertedId) {
      return db.collection("users").findOne({ _id: session.userId.insertedId });
    }
    return db.collection("users").findOne({ _id: session.userId });
  }
};

const createSession = async (db, userId) => {
  const sessionId = nanoid();
  await db.collection("sessions").insertOne({ userId, sessionId });
  createSessionF(sessionId);
  return sessionId;
};

const deleteSession = async (db, sessionId, res) => {
  try {
    await db.collection("sessions").deleteOne({ sessionId });
  } catch (err) {
    console.error(err);
    return res.redirect("/");
  }
};

const createUser = async (username, password) => {
  const pass = await bcrypt.hash(password, 10);
  return { username, password: pass };
};

const updateUsers = async (db, username1, password1, res) => {
  const { username, password } = await createUser(username1, password1);
  const user = await db.collection("users").findOne({ username }, { projection: { username: 1 } });
  if (!user) {
    const userId = await db.collection("users").insertOne({ username, password });
    const sessionId = await createSession(db, userId);
    createSessionF(sessionId);
    res.json({ sessionId });
  } else {
    res.status(203).json({ error: "That username has already taken" });
  }
};

const getTimers = async (db, userId) => {
  let isActive = await db
    .collection("timers")
    .find({ userId: ObjectId(userId), isActive: true })
    .toArray();
  let notActive = await db
    .collection("timers")
    .find({ userId: ObjectId(userId), isActive: false })
    .toArray();
  return { isActive, notActive };
};
const auth = () => async (req, res, next) => {
  const sessionId = findSession();
  if (!sessionId.sessionId) {
    return next();
  }
  const user = await findUserBySessionId(req.db, sessionId.sessionId);
  if (!user) {
    return next();
  }
  req.user = user;
  req.sessionId = sessionId.sessionId;
  next();
};

const getAll = () => async (req, res, next) => {
  const sessionId = findSession();
  if (!sessionId.sessionId) {
    return next();
  }
  const user = await findUserBySessionId(req.db, sessionId.sessionId);
  if (user) {
    req.userId = user._id;
    req.timers = await getTimers(req.db, user._id);
  }
  next();
};

const getTimer = async (db, timerId) => {
  try {
    const elem = (await db.collection("timers").findOne({ _id: ObjectId(timerId) })) || [];
    return elem;
  } catch (err) {
    return [];
  }
};

module.exports = {
  findUserByUserName,
  findUserBySessionId,
  createSession,
  deleteSession,
  auth,
  updateUsers,
  getAll,
  bcrypt,
  getTimer,
};
