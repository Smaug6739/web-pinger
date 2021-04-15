import { IObject } from './types';
import { config } from './config'

import fetch from 'node-fetch';

import { EventEmitter } from 'events';

export default class WebPing extends EventEmitter {
	public url: string;
	public interval: number;
	public retries: number;
	public available: Boolean;
	public uptime: number;
	public unavailability: number;
	private startTime: number;
	private lastSuccessCheck: number;
	private database?: (IObject | Boolean);

	private Finterval: any
	constructor(url: string, interval?: number, retries?: number, database?: IObject) {
		super()
		this.url = url
		this.interval = interval || 3000
		this.retries = retries || 3
		this.database = database || false
		this.available = false;
		this.uptime = 0;
		this.unavailability = 0;
		this.startTime = Date.now();
		this.lastSuccessCheck = Date.now();
	}
	private ping() {
		const startPing: number = Date.now()
		fetch(this.url)
			.then(res => {
				const endPing: number = Date.now()
				if (res.status !== 200) {
					this.available = false;
					this.unavailability = Date.now() - this.lastSuccessCheck
					const outage: IObject = {
						statusCode: res.status,
						url: this.url,
						ping: endPing - startPing,
						unavailability: this.unavailability
					}
					this.emit('outage', outage);
				} else {
					this.available = true;
					this.uptime = Date.now() - this.startTime;
					this.lastSuccessCheck = Date.now()
					const up: IObject = {
						statusCode: res.status,
						url: this.url,
						ping: endPing - startPing,
						uptime: this.uptime
					}
					this.emit('up', up);
				}
			})
	}
	setTinterval(newInterval: number): (Error | Boolean) {
		if (!newInterval) throw new Error('Missing new interval param');
		if (newInterval < config.minInterval) throw new Error(`Minimal time of interval check is ${config.minInterval}`)
		this.interval = newInterval
		return true;
	}
	start() {
		if (!this.url) return new Error("Missing URL parameter.")
		this.Finterval = setInterval(() => {
			this.ping()
		}, this.interval)
	}
	restart() {
		clearInterval(this.Finterval)
		this.emit('restart')
		this.start()
	}
	stop() {
		clearInterval(this.Finterval)
		this.emit('stopped', { reason: 'Stopped by client' })
	}
}