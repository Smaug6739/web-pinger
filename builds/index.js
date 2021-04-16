"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const node_fetch_1 = require("node-fetch");
const events_1 = require("events");
class WebPing extends events_1.EventEmitter {
    constructor(url, options) {
        super();
        this.interval = config_1.config.default.interval;
        this.retries = config_1.config.default.retries;
        this.timeout = config_1.config.default.timeout;
        this.available = config_1.config.default.available;
        this.uptime = config_1.config.default.uptime;
        this.ping = config_1.config.default.ping;
        this.unavailability = config_1.config.default.unavailability;
        this.startTime = Date.now();
        this.lastSuccessCheck = Date.now();
        this.failures = config_1.config.default.failures;
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
            if (options.retries) {
                if (typeof options.interval !== 'number')
                    throw new TypeError('INVALID_OPTION retries option must be a number.');
                this.retries = options.retries;
            }
            if (options.timeout) {
                if (typeof options.timeout !== 'number')
                    throw new TypeError('INVALID_OPTION timeout option must be a number.');
                this.timeout = options.timeout;
            }
        }
    }
    ;
    ;
    fetchURL() {
        const startPing = Date.now();
        const timeout = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('timeout'));
            }, this.timeout);
        });
        const fetchFunction = new Promise((resolve, reject) => {
            node_fetch_1.default(this.url)
                .then(res => {
                resolve({
                    statusCode: res.status,
                    statusText: res.statusText,
                    ping: Date.now() - startPing
                });
            })
                .catch(err => reject(err));
        });
        Promise.race([fetchFunction, timeout])
            .then((result) => {
            this.ping = result.ping;
            if (result.statusCode !== 200) {
                this.failures++;
                console.log(`Failure : ${this.failures}`);
                if (this.failures > this.retries) {
                    this.emitOutage(result.statusCode, result.statusText);
                }
            }
            else {
                this.failures = 0;
                this.available = true;
                this.uptime = Date.now() - this.startTime;
                this.lastSuccessCheck = Date.now();
                this.emitUp(result.statusCode, result.statusText);
            }
        })
            .catch((error) => {
            if (error.message.match('timeout')) {
                this.failures++;
                console.log(`Failure : ${this.failures}`);
                if (this.failures > this.retries) {
                    this.emitOutage(undefined, 'timeout');
                }
            }
            else
                console.log(`Erreur : ${error}`);
        });
    }
    emitOutage(statusCode, statusText) {
        this.available = false;
        this.unavailability = Date.now() - this.lastSuccessCheck;
        const outage = {
            type: 'outage',
            statusCode: statusCode || undefined,
            statusTexte: statusText || undefined,
            url: this.url,
            ping: this.ping,
            unavailability: this.unavailability
        };
        this.emit('outage', outage);
    }
    emitUp(statusCode, statusText) {
        this.available = false;
        this.unavailability = Date.now() - this.lastSuccessCheck;
        const up = {
            type: 'up',
            statusCode: statusCode || undefined,
            statusTexte: statusText || undefined,
            url: this.url,
            ping: this.ping,
            uptime: this.uptime
        };
        this.emit('up', up);
    }
    setTinterval(newInterval) {
        if (!newInterval)
            throw new Error('New interval parameter must be provied.');
        if (newInterval < config_1.config.minInterval)
            throw new RangeError(`INVALID_PARAMETER interval must be greater than ${config_1.config.minInterval}ms`);
        this.interval = newInterval;
        return true;
    }
    setURL(newURL) {
        if (!newURL)
            throw new Error('MISSING_PARAMETER newURL must be provied');
        if (typeof newURL !== 'string')
            throw new TypeError('INVALID_PARAMETER newURL must be a string.');
        this.url = newURL;
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
