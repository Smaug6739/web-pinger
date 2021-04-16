import WebMonitor from '../index';

const Ping = new WebMonitor("https://api.french-gaming-family.com", {
	interval: 3000,
	timeout: 5000
})

Ping.start()
console.log(Ping.infos);

Ping.on('outage', (outage) => {
	console.log(outage);
})

Ping.on('up', (up) => {
	console.log(up);
})
Ping.on('error', (error) => {
	console.log(error);

})