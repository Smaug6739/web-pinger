"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const node_fetch_1 = require("node-fetch");
const events_1 = require("events");
class WebPing extends events_1.EventEmitter {
    constructor(url, options, database) {
        super();
        this.interval = config_1.config.default.interval;
        this.retries = config_1.config.default.retries;
        this.available = config_1.config.default.available;
        this.uptime = config_1.config.default.uptime;
        this.ping = config_1.config.default.ping;
        this.unavailability = config_1.config.default.unavailability;
        this.startTime = Date.now();
        this.lastSuccessCheck = Date.now();
        if (!url)
            throw new Error('URL must be provied');
        this.url = url;
        if (options) {
            if (options.interval) {
                if (typeof options.interval !== 'number')
                    throw new TypeError('INVALID_OPTION interval option must be a number.');
                if (options.interval < config_1.config.minInterval)
                    throw new RangeError(`INVALID_OPTION interval must be greater than ${config_1.config.minInterval}ms`);
                this.interval = options.interval;
            }
            if (options.retries)
                this.retries = options.retries;
        }
        //this.database = database || false;
    }
    ;
    ;
    fetchURL() {
        const startPing = Date.now();
        node_fetch_1.default(this.url)
            .then(res => {
            const endPing = Date.now();
            if (res.status !== 200) {
                this.available = false;
                this.unavailability = Date.now() - this.lastSuccessCheck;
                const outage = {
                    statusCode: res.status,
                    url: this.url,
                    ping: endPing - startPing,
                    unavailability: this.unavailability
                };
                this.emit('outage', outage);
            }
            else {
                this.available = true;
                this.uptime = Date.now() - this.startTime;
                this.lastSuccessCheck = Date.now();
                const up = {
                    statusCode: res.status,
                    url: this.url,
                    ping: endPing - startPing,
                    uptime: this.uptime
                };
                this.emit('up', up);
            }
        });
    }
    setTinterval(newInterval) {
        if (!newInterval)
            throw new Error('Missing new interval param');
        if (newInterval < config_1.config.minInterval)
            throw new RangeError(`INVALID_OPTION interval must be greater than ${config_1.config.minInterval}ms`);
        this.interval = newInterval;
        return true;
    }
    start() {
        if (!this.url)
            throw new Error("Missing URL parameter.");
        this.intervalFunction = setInterval(() => {
            this.fetchURL();
        }, this.interval);
        return true;
    }
    restart() {
        clearInterval(this.intervalFunction);
        this.emit('restart');
        this.start();
        return true;
    }
    stop() {
        clearInterval(this.intervalFunction);
        this.emit('stopped', { reason: 'Stopped by client' });
        return true;
    }
}
exports.default = WebPing;
