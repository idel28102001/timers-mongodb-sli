require("dotenv").config();
const axios = require("axios");
const signupF = async (username, password) => {
  const sessionId = await axios
    .post(`${process.env.SERVER}/signup`, {
      username,
      password,
    })
    .then((res) => {
      switch (res.status) {
        case 200:
          return res.data.sessionId;
        case 203:
          console.error(res.data.error);
      }
    });
  return sessionId;
};

const loginF = async (username, password) => {
  const sessionId = await axios
    .post(`${process.env.SERVER}/login`, {
      username,
      password,
    })
    .then((res) => {
      switch (res.status) {
        case 200:
          return res.data.sessionId;
        case 203:
          console.error(res.data.error);
      }
    });
  return sessionId;
};

const logoutF = async () => {
  return await axios.get(`${process.env.SERVER}/logout/`).then((res) => {
    switch (res.status) {
      case 200:
        return res.data.sessionId;
      case 203:
        console.error(res.data.error, 123);
    }
  });
};

const statusTimes = async () => {
  return await axios.get(`${process.env.SERVER}/api/timers?isActive=true`).then((e) => {
    return e.data;
  });
};
const statusOldTimes = async () => {
  return await axios.get(`${process.env.SERVER}/api/timers?isActive=false`).then((e) => {
    return e.data;
  });
};

const getTimer = async (id) => {
  const elem = await axios
    .get(`${process.env.SERVER}/api/timers/${id}`)
    .then((e) => {
      return e.data;
    })
    .catch((e) => {
      console.log(e);
    });
  return elem;
};

const createTimer = async (description) => {
  const elem = await axios.post(`${process.env.SERVER}/api/timers`, {
    description,
  });
  console.log(`Started timer "${description}", ID: ${elem.data._id}.`);
};

const stopTimer = async (id) => {
  const elem = await axios
    .post(`${process.env.SERVER}/api/timers/${id}/stop`)
    .then((e) => {
      return e.data;
    })
    .catch((e) => {
      console.error(e);
    });
  return elem;
};

module.exports = { signupF, logoutF, loginF, statusTimes, getTimer, statusOldTimes, createTimer, stopTimer };
