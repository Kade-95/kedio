'use strict'
const fs = require('fs');
const { Server, Func, MongoLibrary} = require('../index');

const serverDetails = { name: 'kedio', local: true, port: '27017' };
global.db = new MongoLibrary(serverDetails);
global.server = new Server();
let func = new Func();

let { port, protocol } = server.getCommands('-');
if (!func.isset(port)) port = 8085;
if (!func.isset(protocol)) protocol = 'https';

server.createServer({
    port,
    protocol,
    allow: { origins: ['*'], methods: 'GET, POST, OPTIONS, PUT, DELETE' },
    httpsOptions: {
        key: fs.readFileSync('./permissions/server.key'),
        cert: fs.readFileSync('./permissions/server.crt')
    },
    response: params => {
        params.response.end('Hello world');
    }
});

server.methods.post = (req, res, form) => {
    res.end(JSON.stringify({ word: 'Hello' }));
}

server.recordSession({ period: 24 * 60 * 60 * 1000, remember: ['user'], server: serverDetails });

server.makeStatic('app/public');
