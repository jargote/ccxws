const Bitfinex = require("./bitfinex-client");
jest.mock("winston", () => ({ info: jest.fn() }));

let client;
let market = {
  id: "BTCUSD",
  base: "BTC",
  quote: "USD",
};

beforeAll(() => {
  client = new Bitfinex();
});

test(
  "should subscribe and emit trade events",
  done => {
    client.subscribeTrades(market);
    client.on("trade", trade => {
      expect(trade.fullId).toMatch("Bitfinex:BTC/USD");
      expect(trade.exchange).toMatch("Bitfinex");
      expect(trade.base).toMatch("BTC");
      expect(trade.quote).toMatch("USD");
      expect(trade.tradeId).toBeGreaterThan(0);
      expect(trade.unix).toBeGreaterThan(1522540800);
      expect(trade.price).toBeGreaterThan(0);
      expect(trade.amount).toBeDefined();
      done();
    });
  },
  30000
);

test("should subscribe and emit level2 snapshot and updates", done => {
  let hasSnapshot = false;
  client.subscribeLevel2Updates(market);
  client.on("l2snapshot", snapshot => {
    hasSnapshot = true;
    expect(snapshot.fullId).toMatch("Bitfinex:BTC/USD");
    expect(snapshot.exchange).toMatch("Bitfinex");
    expect(snapshot.base).toMatch("BTC");
    expect(snapshot.quote).toMatch("USD");
    expect(snapshot.sequenceId).toBeUndefined();
    expect(snapshot.timestampMs).toBeUndefined();
    expect(parseFloat(snapshot.asks[0].price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.asks[0].size)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.asks[0].count)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.bids[0].price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.bids[0].size)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.bids[0].count)).toBeGreaterThanOrEqual(0);
  });
  client.on("l2update", update => {
    expect(hasSnapshot).toBeTruthy();
    expect(update.fullId).toMatch("Bitfinex:BTC/USD");
    expect(update.exchange).toMatch("Bitfinex");
    expect(update.base).toMatch("BTC");
    expect(update.quote).toMatch("USD");
    expect(update.sequenceId).toBeUndefined();
    expect(update.timestampMs).toBeUndefined();
    let point = update.asks[0] || update.bids[0];
    expect(parseFloat(point.price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(point.size)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(point.count)).toBeGreaterThanOrEqual(0);
    done();
  });
});

test("should subscribe and emit level3 snapshot and updates", done => {
  let hasSnapshot = false;
  client.subscribeLevel3Updates(market);
  client.on("l3snapshot", snapshot => {
    hasSnapshot = true;
    expect(snapshot.fullId).toMatch("Bitfinex:BTC/USD");
    expect(snapshot.exchange).toMatch("Bitfinex");
    expect(snapshot.base).toMatch("BTC");
    expect(snapshot.quote).toMatch("USD");
    expect(snapshot.sequenceId).toBeUndefined();
    expect(snapshot.timestampMs).toBeUndefined();
    expect(snapshot.asks[0].orderId).toBeGreaterThan(0);
    expect(parseFloat(snapshot.asks[0].price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.asks[0].size)).toBeGreaterThanOrEqual(0);
    expect(snapshot.bids[0].orderId).toBeGreaterThan(0);
    expect(parseFloat(snapshot.bids[0].price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(snapshot.bids[0].size)).toBeGreaterThanOrEqual(0);
  });
  client.on("l3update", update => {
    expect(hasSnapshot).toBeTruthy();
    expect(update.fullId).toMatch("Bitfinex:BTC/USD");
    expect(update.exchange).toMatch("Bitfinex");
    expect(update.base).toMatch("BTC");
    expect(update.quote).toMatch("USD");
    expect(update.sequenceId).toBeUndefined();
    expect(update.timestampMs).toBeUndefined();
    let point = update.asks[0] || update.bids[0];
    expect(point.orderId).toBeGreaterThanOrEqual(0);
    expect(parseFloat(point.price)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(point.size)).toBeGreaterThanOrEqual(0);
    done();
  });
});

test("should unsubscribe from trades", () => {
  client.unsubscribeTrades(market);
});

test("should unsubscribe from level2 updates", () => {
  client.unsubscribeLevel2Updates(market);
});

test("should unsubscribe from level3 updates", () => {
  client.unsubscribeLevel3Updates(market);
});

test("should close connections", done => {
  client.on("closed", done);
  client.close();
});
