import { IObject, IOptions } from './types';
import { config } from './config'

import fetch from 'node-fetch';

import { EventEmitter } from 'events';

export default class WebPing extends EventEmitter {
	public url: string;
	public interval: number = config.default.interval;
	public retries: number = config.default.retries;
	public available: boolean = config.default.available;
	public uptime: number = config.default.uptime;
	public ping: number = config.default.ping;
	public unavailability: number = config.default.unavailability;

	private startTime: number = Date.now();;
	private lastSuccessCheck: number = Date.now();;
	private intervalFunction: any;
	private failures: number = config.default.failures
	constructor(url: string, options?: IOptions, database?: IObject) {
		super()
		if (!url) throw new Error('URL must be provied')
		this.url = url
		if (options) {
			if (options.interval) {
				if (typeof options.interval !== 'number') throw new TypeError('INVALID_OPTION interval option must be a number.')
				if (options.interval < config.minInterval) throw new RangeError(`INVALID_OPTION interval must be greater than ${config.minInterval}ms`)
				this.interval = options.interval
			}
			if (options.retries) this.retries = options.retries
		}
	}
	private fetchURL() {
		const startPing: number = Date.now()
		fetch(this.url)
			.then(res => {
				const endPing: number = Date.now()
				this.ping = endPing - startPing
				if (res.status !== 200) {
					this.failures++;
					if (this.failures > this.retries) {
						this.available = false;
						this.unavailability = Date.now() - this.lastSuccessCheck
						const outage: IObject = {
							statusCode: res.status,
							url: this.url,
							ping: this.ping,
							unavailability: this.unavailability
						}
						this.emit('outage', outage);
					}
				} else {
					this.failures = 0;
					this.available = true;
					this.uptime = Date.now() - this.startTime;
					this.lastSuccessCheck = Date.now()
					const up: IObject = {
						statusCode: res.status,
						url: this.url,
						ping: this.ping,
						uptime: this.uptime
					}
					this.emit('up', up);
				}
			})
	}
	setTinterval(newInterval: number): (boolean) {
		if (!newInterval) throw new Error('New interval parameter must be provied.');
		if (newInterval < config.minInterval) throw new RangeError(`INVALID_PARAMETER interval must be greater than ${config.minInterval}ms`)
		this.interval = newInterval
		return true;
	}
	setURL(newURL: string | number): (boolean) {
		if (!newURL) throw new Error('MISSING_PARAMETER newURL must be provied')
		if (typeof newURL !== 'string') throw new TypeError('INVALID_PARAMETER newURL must be a string.')
		this.url = newURL
		return true
	}
	start(): boolean {
		if (!this.url) throw new Error("Missing URL parameter.")
		this.intervalFunction = setInterval(() => {
			this.fetchURL()
		}, this.interval)
		return true;
	}
	restart(): boolean {
		clearInterval(this.intervalFunction)
		this.emit('restart')
		this.start()
		return true;
	}
	stop(): boolean {
		clearInterval(this.intervalFunction)
		this.emit('stopped', { reason: 'Stopped by client' })
		return true;
	}
}