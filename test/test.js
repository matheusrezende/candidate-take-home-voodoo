const request = require("supertest");
const assert = require("assert");
const app = require("../index");

let iosGame = {
  publisherId: "1234567890",
  name: "Test App",
  platform: "ios",
  storeId: "1234",
  bundleId: "test.bundle.id",
  appVersion: "1.0.0",
  isPublished: true,
};

let androidGame = {
  publisherId: "1234567890",
  name: "Test App Android",
  platform: "android",
  storeId: "12345",
  bundleId: "test.bundle.id",
  appVersion: "1.0.0",
  isPublished: true,
};
/**
 * Testing create game endpoint
 */
describe("POST /api/games", () => {
  it("respond with 200 and an object that matches the creation of android game", async () => {
    const { body, status } = await request(app)
      .post("/api/games")
      .set("Accept", "application/json")
      .send(iosGame);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.publisherId, iosGame.publisherId);
    assert.strictEqual(body.name, iosGame.name);
    assert.strictEqual(body.platform, iosGame.platform);
    assert.strictEqual(body.storeId, iosGame.storeId);
    assert.strictEqual(body.bundleId, iosGame.bundleId);
    assert.strictEqual(body.appVersion, iosGame.appVersion);
    assert.strictEqual(body.isPublished, iosGame.isPublished);
  });

  it("respond with 200 and an object that matches the creation of android game", async () => {
    const { body, status } = await request(app)
      .post("/api/games")
      .set("Accept", "application/json")
      .send(androidGame);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.publisherId, androidGame.publisherId);
    assert.strictEqual(body.name, androidGame.name);
    assert.strictEqual(body.platform, androidGame.platform);
    assert.strictEqual(body.storeId, androidGame.storeId);
    assert.strictEqual(body.bundleId, androidGame.bundleId);
    assert.strictEqual(body.appVersion, androidGame.appVersion);
    assert.strictEqual(body.isPublished, androidGame.isPublished);
  });
});

/**
 * Testing get all games endpoint
 */
describe("GET /api/games", () => {
  it("respond with json containing a list that includes the game we just created", async () => {
    const { body, status } = await request(app)
      .get("/api/games")
      .set("Accept", "application/json");
    assert.strictEqual(status, 200);
    assert.strictEqual(body[0].publisherId, "1234567890");
    assert.strictEqual(body[0].name, "Test App");
    assert.strictEqual(body[0].platform, "ios");
    assert.strictEqual(body[0].storeId, "1234");
    assert.strictEqual(body[0].bundleId, "test.bundle.id");
    assert.strictEqual(body[0].appVersion, "1.0.0");
    assert.strictEqual(body[0].isPublished, true);
  });
});

/**
 * Testing search games endpoint
 */
describe("POST /api/games/search", () => {
  it("respond with json containing a list that includes IOS games", async () => {
    const { body, status } = await request(app)
      .post("/api/games/search")
      .set("Accept", "application/json")
      .send({ platform: "ios" });
    assert.strictEqual(status, 200);
    assert.strictEqual(body[0].publisherId, "1234567890");
    assert.strictEqual(body[0].name, "Test App");
    assert.strictEqual(body[0].platform, "ios");
    assert.strictEqual(body[0].storeId, "1234");
    assert.strictEqual(body[0].bundleId, "test.bundle.id");
    assert.strictEqual(body[0].appVersion, "1.0.0");
    assert.strictEqual(body[0].isPublished, true);
  });

  it("respond with json containing a list that includes Android games", async () => {
    const { body, status } = await request(app)
      .post("/api/games/search")
      .set("Accept", "application/json")
      .send({ platform: "android" });
    assert.strictEqual(status, 200);
    assert.strictEqual(body[0].publisherId, androidGame.publisherId);
    assert.strictEqual(body[0].name, androidGame.name);
    assert.strictEqual(body[0].platform, androidGame.platform);
    assert.strictEqual(body[0].storeId, androidGame.storeId);
    assert.strictEqual(body[0].bundleId, androidGame.bundleId);
    assert.strictEqual(body[0].appVersion, androidGame.appVersion);
    assert.strictEqual(body[0].isPublished, androidGame.isPublished);
  });

  it("respond with json containing a list that includes games with 'Android' in the name", async () => {
    const { body, status } = await request(app)
      .post("/api/games/search")
      .set("Accept", "application/json")
      .send({ name: "Android" });
    assert.strictEqual(status, 200);
    assert.strictEqual(body[0].publisherId, androidGame.publisherId);
    assert.strictEqual(body[0].name, androidGame.name);
    assert.strictEqual(body[0].platform, androidGame.platform);
    assert.strictEqual(body[0].storeId, androidGame.storeId);
    assert.strictEqual(body[0].bundleId, androidGame.bundleId);
    assert.strictEqual(body[0].appVersion, androidGame.appVersion);
    assert.strictEqual(body[0].isPublished, androidGame.isPublished);
  });

  it("respond with json containing a list that includes games with 'Test' in the name", async () => {
    const { body, status } = await request(app)
      .post("/api/games/search")
      .set("Accept", "application/json")
      .send({ name: "Test" });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.length, 2);
    assert.strictEqual(body[0].publisherId, iosGame.publisherId);
    assert.strictEqual(body[0].name, iosGame.name);
    assert.strictEqual(body[0].platform, iosGame.platform);
    assert.strictEqual(body[0].storeId, iosGame.storeId);
    assert.strictEqual(body[0].bundleId, iosGame.bundleId);
    assert.strictEqual(body[0].appVersion, iosGame.appVersion);
    assert.strictEqual(body[0].isPublished, iosGame.isPublished);

    assert.strictEqual(body[1].publisherId, androidGame.publisherId);
    assert.strictEqual(body[1].name, androidGame.name);
    assert.strictEqual(body[1].platform, androidGame.platform);
    assert.strictEqual(body[1].storeId, androidGame.storeId);
    assert.strictEqual(body[1].bundleId, androidGame.bundleId);
    assert.strictEqual(body[1].appVersion, androidGame.appVersion);
    assert.strictEqual(body[1].isPublished, androidGame.isPublished);
  });

  it("respond with json containing the full list of games", async () => {
    const { body, status } = await request(app)
      .post("/api/games/search")
      .set("Accept", "application/json")
      .send({});
    assert.strictEqual(status, 200);
    assert.strictEqual(body.length, 2);
    assert.strictEqual(body[0].publisherId, iosGame.publisherId);
    assert.strictEqual(body[0].name, iosGame.name);
    assert.strictEqual(body[0].platform, iosGame.platform);
    assert.strictEqual(body[0].storeId, iosGame.storeId);
    assert.strictEqual(body[0].bundleId, iosGame.bundleId);
    assert.strictEqual(body[0].appVersion, iosGame.appVersion);
    assert.strictEqual(body[0].isPublished, iosGame.isPublished);

    assert.strictEqual(body[1].publisherId, androidGame.publisherId);
    assert.strictEqual(body[1].name, androidGame.name);
    assert.strictEqual(body[1].platform, androidGame.platform);
    assert.strictEqual(body[1].storeId, androidGame.storeId);
    assert.strictEqual(body[1].bundleId, androidGame.bundleId);
    assert.strictEqual(body[1].appVersion, androidGame.appVersion);
    assert.strictEqual(body[1].isPublished, androidGame.isPublished);
  });
});

/**
 * Testing update game endpoint
 */
describe("PUT /api/games/1", () => {
  let data = {
    id: 1,
    publisherId: "999000999",
    name: "Test App Updated",
    platform: "android",
    storeId: "5678",
    bundleId: "test.newBundle.id",
    appVersion: "1.0.1",
    isPublished: false,
  };
  it("respond with 200 and an updated object", async () => {
    const { body, status } = await request(app)
      .put("/api/games/1")
      .set("Accept", "application/json")
      .send(data);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.publisherId, "999000999");
    assert.strictEqual(body.name, "Test App Updated");
    assert.strictEqual(body.platform, "android");
    assert.strictEqual(body.storeId, "5678");
    assert.strictEqual(body.bundleId, "test.newBundle.id");
    assert.strictEqual(body.appVersion, "1.0.1");
    assert.strictEqual(body.isPublished, false);
  });
});

/**
 * Testing update game endpoint
 */
describe("DELETE /api/games/1", () => {
  it("respond with 200", async () => {
    const { body, status } = await request(app)
      .delete("/api/games/1")
      .set("Accept", "application/json");
    assert.strictEqual(status, 200);
    assert.strictEqual(body.id, 1);
  });
});

/**
 * Testing get all games endpoint
 */
describe("GET /api/games", () => {
  it("respond with json containing a single game with id 2", async () => {
    const { body, status } = await request(app)
      .get("/api/games")
      .set("Accept", "application/json");
    assert.strictEqual(status, 200);
    assert.strictEqual(body.length, 1);
    assert.strictEqual(body[0].id, 2);
  });
});
