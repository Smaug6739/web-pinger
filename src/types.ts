export interface IObject {
	[index: string]: any
}

export interface IOptions {
	interval?: number | string;
	retries?: number;
	timeout?: number;
}

export interface IOutage {
	type: string
	statusCode: (number | undefined),
	statusTexte: (string | undefined),
	ping: number | null
	url: string
	unavailability: number
}

export interface IUp {
	type: string
	statusCode: (number | undefined),
	statusTexte: (string | undefined),
	ping: number | null
	url: string
	uptime: number | null
}