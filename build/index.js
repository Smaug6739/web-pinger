"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const node_fetch_1 = require("node-fetch");
const events_1 = require("events");
class WebPing extends events_1.EventEmitter {
    constructor(url, interval, retries, database) {
        super();
        this.url = url;
        this.interval = interval || 3000;
        this.retries = retries || 3;
        this.database = database || false;
        this.available = false;
        this.uptime = 0;
        this.unavailability = 0;
        this.startTime = Date.now();
        this.lastSuccessCheck = Date.now();
    }
    ping() {
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
            throw new Error(`Minimal time of interval check is ${config_1.config.minInterval}`);
        this.interval = newInterval;
        return true;
    }
    start() {
        if (!this.url)
            return new Error("Missing URL parameter.");
        this.Finterval = setInterval(() => {
            this.ping();
        }, this.interval);
    }
    restart() {
        clearInterval(this.Finterval);
        this.emit('restart');
        this.start();
    }
    stop() {
        clearInterval(this.Finterval);
        this.emit('stopped', { reason: 'Stopped by client' });
    }
}
exports.default = WebPing;
