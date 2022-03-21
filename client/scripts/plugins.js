const path = require("path");
const fs = require("fs");

const formatDuration = (d) => {
  d = Math.floor(d / 1000);
  const s = d % 60;
  d = Math.floor(d / 60);
  const m = d % 60;
  const h = Math.floor(d / 60);
  return [h > 0 ? h : null, m, s]
    .filter((x) => x !== null)
    .map((x) => (x < 10 ? "0" : "") + x)
    .join(":");
};

const checkSession = () => {
  const sessionId = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../server/sb-timers-session/db.json"), {
      encoding: "utf8",
      flag: "r",
    })
  );
  if (sessionId.sessionId) {
    return sessionId.sessionId;
  }
};

const parseTimers = (array, word) =>
  array.map((e) => [e._id, e.description, formatDuration((word ? e.end : Date.now()) - e.start)]);

module.exports = { checkSession, formatDuration, parseTimers };
