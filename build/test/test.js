"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Ping = new index_1.default("https://french-gaming-family.com");
Ping.start();
Ping.on('outage', (outage) => {
    console.log(`Outage\nStatus code : ${outage.statusCode}\nURL: ${outage.url}\nPing: ${outage.ping}\nUptime: ${Ping.uptime}\nUnavailability: ${outage.unavailability}\n\n`);
});
Ping.on('up', (up) => {
    console.log(`UP\nStatus code : ${up.statusCode}\nURL: ${up.url}\nPing: ${up.ping}\nUptime: ${Ping.uptime}\n\n`);
});
Ping.setTinterval(10000);
setTimeout(() => {
    Ping.restart();
    console.log('restarting');
}, 5000);
