import { IOptions, IOutage, IUp } from './types';
import { config } from './config'

import fetch from 'node-fetch';

import { EventEmitter } from 'events';

export class WebMonitor extends EventEmitter {
	public url: string;
	public interval: number = config.default.interval;
	public retries: number = config.default.retries;
	public timeout: number = config.default.timeout
	public headers: ({ [key: string]: string } | undefined) = config.default.headers;
	public catchAllErrors: boolean = config.default.catchAllErrors;
	public available: (boolean | null) = config.default.available;
	public uptime: (number | null) = config.default.uptime;
	public ping: (number | null) = config.default.ping;
	public unavailability: (number | null) = config.default.unavailability;

	private startTime: number = Date.now();;
	private lastSuccessCheck: number = Date.now();;
	private intervalFunction: any;
	private failures: (number) = config.default.failures
	constructor(url: string, options?: IOptions) {
		super()
		if (!url) throw new Error('URL must be provied')
		this.url = url
		if (options) {
			if (options.interval) {
				if (typeof options.interval !== 'number') throw new TypeError('INVALID_OPTION interval option must be a number')
				if (options.interval < config.minInterval) throw new RangeError(`INVALID_OPTION interval must be greater than ${config.minInterval}ms`)
				this.interval = options.interval
			}
			if (options.retries) {
				if (typeof options.interval !== 'number') throw new TypeError('INVALID_OPTION retries option must be a number')
				this.retries = options.retries
			}
			if (options.timeout) {
				if (typeof options.timeout !== 'number') throw new TypeError('INVALID_OPTION timeout option must be a number')
				this.timeout = options.timeout
			}
			if (options.headers) {
				if (typeof options.headers !== 'object') throw new TypeError('INVALID_OPTION headers option must be an object')
				this.headers = options.headers
			}
			if (options.catchAllErrors) {
				if (typeof options.catchAllErrors !== 'boolean') throw new TypeError('INVALID_OPTION catchAllErrors option must be a boolean')
				this.catchAllErrors = options.catchAllErrors
			}
		}
	}
	private fetchURL() {
		const startPing: number = Date.now()
		const timeout: Promise<Error> = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('timeout'))
			}, this.timeout)
		})
		const fetchFunction = new Promise((resolve, reject) => {
			fetch(this.url, { headers: this.headers })
				.then(res => {
					resolve({
						statusCode: res.status,
						statusText: res.statusText,
						ping: Date.now() - startPing
					})
				})
				.catch(err => reject(err))
		})
		Promise.race([fetchFunction, timeout])
			.then((result: any) => {
				this.ping = result.ping
				if (result.statusCode > 299) {
					this.failures++;
					console.log(`Failure : ${this.failures}`);
					if (this.failures > this.retries) {
						this.emitOutage(result.statusCode, result.statusText)
					}
				} else {
					this.failures = 0;
					this.available = true;
					this.uptime = Date.now() - this.startTime;
					this.lastSuccessCheck = Date.now()
					this.emitUp(result.statusCode, result.statusText)
				}
			})
			.catch((error) => {
				if (error.message.match('Only absolute URLs are supported')) return this.emit('error', TypeError('INVALID_PARAMETER Only absolute URLs are supported'))
				else if (this.catchAllErrors || error.message.match('timeout')) {
					this.failures++;
					console.log(`Failure : ${this.failures}`);
					if (this.failures > this.retries) {
						this.emitOutage(undefined, 'timeout')
					}
				}
				else {
					if (error.message.match('ECONNREFUSED')) return this.emit('error', TypeError(`INVALID_PARAMETER Unknown host ${this.url}`))
					this.emit('error', error)
				}
			})
	}
	private emitOutage(statusCode?: number, statusText?: string,) {
		this.available = false;
		this.unavailability = Date.now() - this.lastSuccessCheck
		const outage: IOutage = {
			type: 'outage',
			statusCode: statusCode || undefined,
			statusText: statusText || undefined,
			url: this.url,
			ping: this.ping,
			unavailability: this.unavailability
		}
		this.emit('outage', outage);
	}
	private emitUp(statusCode?: number, statusText?: string,) {
		this.available = false;
		this.unavailability = Date.now() - this.lastSuccessCheck
		const up: IUp = {
			type: 'up',
			statusCode: statusCode || undefined,
			statusText: statusText || undefined,
			url: this.url,
			ping: this.ping,
			uptime: this.uptime
		}
		this.emit('up', up);
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
	get infos() {
		return {
			"url": this.url,
			"interval": this.interval,
			"timeout": this.timeout,
			"available": this.available,
			"ping": this.ping,
			"uptime:": this.uptime,
			"unavailability": this.unavailability
		}
	}
}

