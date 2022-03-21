const timers = require("./timers");
const { getAll, getTimer } = require("./logs");

const { ObjectId } = require("mongodb");

const addTimerEvents = (app) => {
  app.get("/api/timers", getAll(), (req, res) => {
    if (req.query.isActive === "true") {
      const allElems = req.timers.isActive;
      timers.changeTic(req.db, allElems);
      res.send(allElems);
    } else {
      res.send(req.timers.notActive);
    }
  });
  app.get("/api/timers/:id", getAll(), async (req, res) => {
    res.send(await getTimer(req.db, req.params.id));
  });

  app.post(`/api/timers/:id/stop`, getAll(), async (req, res) => {
    const elem = await req.db
      .collection("timers")
      .findOne({ _id: ObjectId(req.params.id) }, { projection: { progress: 1, isActive: 1 } });
    if (!elem) {
      return res.json({ error: `Unknown timer ID ${req.params.id}` });
    }
    if (elem.isActive) {
      await req.db.collection("timers").findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        {
          $set: { isActive: false, end: Date.now(), duration: elem.progress },
        }
      );
      return res.json({});
    }
    res.json({ error: `Timer ${req.params.id} has already stopped` });
  });

  app.post("/api/timers", getAll(), async (req, res) => {
    if (req.db) {
      const elem = timers.createTimer(req.body.description);
      elem.userId = req.userId;
      const someElem = await req.db.collection("timers").insertOne(elem);
      res.send({ _id: someElem.insertedId });
    }
  });
};

module.exports = addTimerEvents;
