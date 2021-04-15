export interface IObject {
	[index: string]: any
}

export interface IOptions {
	interval?: number | string;
	retries?: number;
}