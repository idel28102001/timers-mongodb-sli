const {
  signupF,
  logoutF,
  loginF,
  statusTimes,
  getTimer,
  statusOldTimes,
  createTimer,
  stopTimer,
} = require("./connect");
const inquirer = require("inquirer");
const Table = require("cli-table");
const { checkSession, parseTimers } = require("./plugins");

const logTable = (array) => {
  const table = new Table({
    head: ["ID", "Task", "Time"],
  });
  for (const i of array) {
    table.push(i);
  }
  console.log(table.toString());
};

const questions = [
  { type: "input", name: "username", message: "Username:" },
  { type: "input", name: "password", message: "Password:", transformer: (word) => "*".repeat(word.length) },
];

const signup = async () => {
  if (checkSession()) {
    return console.log("You already logged in");
  }
  const { username, password } = await inquirer.prompt(questions);
  const sessionId = await signupF(username, password);
  if (sessionId) {
    console.log("Signed up successfully!");
  }
};

const login = async () => {
  if (checkSession()) {
    return console.log("You already logged in");
  }
  const { username, password } = await inquirer.prompt(questions);
  const sessionId = await loginF(username, password);
  if (sessionId) {
    console.log("Logged in successfully!");
  }
};

const logout = async () => {
  const sessionId = checkSession("logout");
  if (!sessionId) {
    return console.log("You was not logged in");
  }
  await logoutF(sessionId);
  console.log("Logged out successfully!");
};

const getOneTimer = async (id) => {
  if (!checkSession()) {
    return console.log("Log into your account to check your timer.");
  }
  const elem = await getTimer(id);
  if (elem._id) {
    return elem;
  }
};

const statusActive = async () => {
  if (!checkSession()) {
    return console.log("Log into your account to check your active timers.");
  }
  const actives = await statusTimes();
  if (actives.length) {
    logTable(parseTimers(actives));
    return;
  }
  console.log("You have no active timers");
};

const statusEtc = async (id) => {
  if (!checkSession()) {
    return console.log("Log into your account to check your timers.");
  }
  let actives;
  if (id === "old") {
    actives = await statusOldTimes();
    if (!actives.length) {
      return console.log("You have no old timers");
    }
  } else {
    actives = [await getOneTimer(String(id).trim())];
    if (!actives[0]) {
      return console.log(`Unknown timer ID ${id}`);
    }
  }
  return logTable(parseTimers(actives || [], id === "old" ? "stop" : null));
};

const createOneTimer = async (description) => {
  if (!checkSession()) {
    return console.log("Log into your account to start new timer.");
  }
  await createTimer(description);
};

const stopOneTimer = async (id) => {
  if (!checkSession()) {
    return console.log("Log into your account to stop your timer.");
  }
  const some = await stopTimer(id);
  if (some.error) {
    return console.log(some.error);
  }
  console.log(`Timer ${id} stopped.`);
};

module.exports = { signup, logout, login, statusActive, statusEtc, createOneTimer, stopOneTimer };
