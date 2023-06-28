const express = require("express");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const db = require("./models");
const { fetchFiles } = require("./helpers/http");
const { getTop100, gameMapper } = require("./helpers/gamesHelpers");

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get("/api/games", async (req, res) => {
  try {
    const games = await db.Game.findAll();
    return res.send(games);
  } catch (err) {
    console.error("There was an error querying games", err);
    return res.send(err);
  }
});

app.post("/api/games", async (req, res) => {
  const {
    publisherId,
    name,
    platform,
    storeId,
    bundleId,
    appVersion,
    isPublished,
  } = req.body;
  try {
    const game = await db.Game.create({
      publisherId,
      name,
      platform,
      storeId,
      bundleId,
      appVersion,
      isPublished,
    });
    return res.send(game);
  } catch (err) {
    console.error("***There was an error creating a game", err);
    return res.status(400).send(err);
  }
});

app.delete("/api/games/:id", async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id));
    await game.destroy({ force: true });
    return res.send({ id: game.id });
  } catch (err) {
    console.error("***Error deleting game", err);
    return res.status(400).send(err);
  }
});

app.put("/api/games/:id", async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const {
    publisherId,
    name,
    platform,
    storeId,
    bundleId,
    appVersion,
    isPublished,
  } = req.body;
  try {
    const game = await db.Game.findByPk(id);
    await game.update({
      publisherId,
      name,
      platform,
      storeId,
      bundleId,
      appVersion,
      isPublished,
    });
    return res.send(game);
  } catch (err) {
    console.error("***Error updating game", err);
    return res.status(400).send(err);
  }
});

app.post("/api/games/search", async (req, res) => {
  const { name, platform } = req.body;

  let nameQueryObj = {};
  let platformQueryObj = {};
  if (name && typeof name === "string") {
    nameQueryObj = {
      name: {
        [Op.like]: `%${name}%`,
      },
    };
  }

  if (platform && typeof platform === "string") {
    platformQueryObj = {
      platform: {
        [Op.eq]: platform,
      },
    };
  }

  let queryObject = {};
  if (platform || name) {
    queryObject = {
      where: {
        ...nameQueryObj,
        ...platformQueryObj,
      },
    };
  }

  try {
    const games = await db.Game.findAll(queryObject);

    return res.send(games);
  } catch (err) {
    console.error("***Error searching games", err);
    return res.status(400).send(err);
  }
});

app.post("/api/games/populate", async (_, res) => {
  try {
    const [iosData, androidData] = await fetchFiles();

    const iosTop100 = getTop100(iosData);
    const androidTop100 = getTop100(androidData);

    const data = iosTop100
      .concat(androidTop100)
      .map((item) => gameMapper(item));

    await db.Game.bulkCreate(data, {
      updateOnDuplicate: [
        "publisherId",
        "name",
        "appVersion",
        "isPublished",
        "platform",
        "bundleId",
      ],
    });

    return res.status(204).end();
  } catch (err) {
    console.error("***Error searching games", err);
    return res.status(400).send(err);
  }
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

module.exports = app;
