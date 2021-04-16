export interface IObject {
	[index: string]: any
}

export interface IOptions {
	interval?: number | string;
	retries?: number;
	timeout?: number;
}

export interface IResponce {
	statusCode: number,
	statusTexte: string,
	ping: number
}