/**
 *    {
 *    "u":400900217,     // order book updateId
 *    "s":"BNBUSDT",     // symbol
 *    "b":"25.35190000", // best bid price
 *    "B":"31.21000000", // best bid qty
 *    "a":"25.36520000", // best ask price
 *    "A":"40.66000000"  // best ask qty
 *  }
 *
 * @class BookTicker
 */
export class BookTicker {
    public exchange: string;
    public base: string;
    public quote: string;
    public bid: string;
    public bidVolume: string;
    public ask: string;
    public askVolume: string;
    public uId: string;
    public hrtime: [number, number];

    constructor({ exchange, base, quote, bid, bidVolume, ask, askVolume, uId, hrtime }: {exchange: string, base: string, quote: string, bid: string, bidVolume: string, ask: string, askVolume: string, uId: string, hrtime: [number, number]}) {
        this.exchange = exchange;
        this.base = base;
        this.quote = quote;
        this.bid = bid;
        this.bidVolume = bidVolume;
        this.ask = ask;
        this.askVolume = askVolume;
        this.hrtime = hrtime;
        this.uId = uId;
    }

    /**
     * @deprecated use Market object (second argument to each event) to determine exchange and trade pair
     */
    get fullId() {
        return `${this.exchange}:${this.base}/${this.quote}`;
    }
}
