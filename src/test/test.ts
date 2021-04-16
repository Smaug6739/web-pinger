import WebPing from '../index';

const Ping = new WebPing("https://api.french-gaming-family.com", {
	interval: 3000,
	timeout: 3000
})

Ping.start()

Ping.on('outage', (outage) => {
	console.log(outage);
})

Ping.on('up', (up) => {
	console.log(up);
})
