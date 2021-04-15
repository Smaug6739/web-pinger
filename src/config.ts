interface Iconfig {
	minInterval: number
	default: {
		interval: number
		retries: number
		available: boolean
		uptime: 0
		ping: number
		unavailability: number
	}
}

export const config: Iconfig = {
	minInterval: 3000,
	default: {
		interval: 3000,
		retries: 3,
		available: false,
		uptime: 0,
		ping: 0,
		unavailability: 0,
	}
}