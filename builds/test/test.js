"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Ping = new index_1.default("https://api.french-gaming-family.com", {
    interval: 3000,
    timeout: 3000
});
Ping.start();
Ping.on('outage', (outage) => {
    console.log(outage);
});
Ping.on('up', (up) => {
    console.log(up);
});
