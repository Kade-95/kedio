'use strict'
const fs = require('fs');
const { Server, Func } = require('../index');

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

server.methods.delete = (req, res, form) => {
    res.end(JSON.stringify({ word: 'Hello' }));
}

server.makeStatic('app/public');
