const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

const SessionsManager = require('./SessionsManager');
const RequestsLibrary = require('../functions/RequestsLibrary');
const Func = require('./Func');
let func = new Func();

class Server {
    constructor() {
        this.request = new RequestsLibrary();
        this.sessionsManager = new SessionsManager();
        this.allowSessions = false;
        this.mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.mjs': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.ico': 'image/ico',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml',
            '.wasm': 'application/wasm'
        };
        this.appPages = [];
        this.methods = {
            post: () => {

            },
            delete: () => {

            },
            get: (request, response, filename, callback) => {
                if (this.static == true) {
                    if (this.allowSessions) {
                        if ((new Date().getTime() - this.sessionsManager.sessions[request.sessionId].time) > (this.sessionsManager.period / 10)) {
                            this.sessionsManager.store(request, response);
                        }
                    }

                    filename = filename.replace('./', this.staticPath);
                    if (filename == this.staticPath) {
                        response.writeHead(301, { 'Location': 'index.html' });
                        response.end();
                    }
                    else {
                        fs.stat(filename, (err, stats) => {
                            if (stats == undefined || !stats.isFile()) {
                                response.writeHead(404, { 'Content-Type': request.fileType });
                                response.end('404. Not Found');
                            }
                            else {
                                response.writeHead(200, { 'Content-Type': request.fileType });
                                fs.createReadStream(filename).pipe(response);
                            }
                        });
                    }
                }
                else {
                    if (this.allowSessions) {
                        if ((new Date().getTime() - this.sessionsManager.sessions[request.sessionId].time) > (this.sessionsManager.period / 10)) {
                            this.sessionsManager.store(request, response, filename, callback);
                        }
                    }
                    else {
                        callback({ request, response, filename });
                    }
                }
            }
        };
    }

    permit(res, allowed) {
        allowed = allowed || {};
        if (func.isset(allowed.origins)) {
            for (let origin of allowed.origins) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
        }

        if (func.isset(allowed.methods)) {
            res.setHeader('Access-Control-Allow-Methods', allowed.methods);
        }
    }

    resolveMethod(req, res, method) {
        if (typeof this.methods[method] === 'function') {
            req.sessionId = this.sessionsManager.createNODESSID(res);
            req.res = res;
            req.recoverdMethod = this.methods[method];
            req.recoveredMethodName = method;

            req.extract = this.request.extract;
            req.parseForm = this.request.parseForm;

            req.on('data', this.onPosting).on('end', this.onPosted);
        }
    }

    reply(req, res, callback, allowed) {
        // start http server
        this.q = url.parse(req.url);
        let filename = '.' + this.q.pathname;
        let tmp = filename.lastIndexOf('.');
        let ext = filename.slice(tmp).toLowerCase();
        let contentType = this.mimeTypes[ext];
        if (!func.isset(contentType)) {
            contentType = 'application/octet-stream';
        }

        this.permit(res, allowed);

        this.sessionsManager.getCookies(req);
        if (req.method.toLowerCase() == 'get') {
            req.sessionId = this.sessionsManager.createNODESSID(res, true);
            req.fileType = contentType;
            this.methods.get(req, res, filename, callback);
        }
        else if (req.method.toLowerCase() != 'options') {
            this.resolveMethod(req, res, req.method.toLowerCase());
        }
        else if (req.method.toLowerCase() == 'options') {//handle all other methods
            let methodPosition = req['rawHeaders'].indexOf('Access-Control-Request-Method') + 1;
            let method = req['rawHeaders'][methodPosition].toLowerCase();
            this.resolveMethod(req, res, method);
        }
    }

    createServer(params = { port: '', protocol: '', allow: [], httpsOptions: {}, response: () => { } }, callback = () => { }) {
        let server;
        if (params.protocol.toLowerCase() == 'https') {
            if (!func.isset(params.httpsOptions)) {
                console.log('HTTPS should have SSL options');
                return;
            }

            server = https.createServer(params.httpsOptions, (req, res) => {
                if (func.isset(params.response)) {
                    this.reply(req, res, params.response, params.allow);
                }
            });
        }
        else {
            server = http.createServer((req, res) => {
                if (func.isset(params.response)) {
                    this.reply(req, res, params.response, params.allow);
                }
            });
        }

        server.on('error', err => {
            console.log(`Port ${params.port} is in use`)
        }).listen(params.port, '0.0.0.0', () => {
            this.url = `${params.protocol}://localhost:${params.port}`;
            console.log(`${params.protocol} Server Running on Port : ${params.port}`);
            console.log('Url: ', this.url);
        });

        if (typeof callback === 'function') {
            callback(server);
        }
    }

    onPosting(data) {
        // get the post request data
        if (this.data) {
            this.data.fill(data, this.dataIndex);
            this.dataIndex += data.length;
        } else {
            var contentLength = +this.headers["content-length"];
            if (data.length === contentLength) {
                this.data = data;
            } else {
                this.data = Buffer.alloc(contentLength);
                this.data.fill(data)
                this.dataIndex = data.length;
            }
        }
    }

    onPosted() {
        // post the request
        var boundary = this.extract(this.headers['content-type'], ' boundary=');
        var form = this.parseForm(boundary, this.data);

        if (typeof this.recoverdMethod === 'function') {
            this.recoverdMethod(this, this.res, form);
        }
    }

    recordSession(params = { period: '', remember: '', server: { address: '', name: '', user: '', password: '', local: true } }) {
        this.allowSessions = true;

        func.runParallel({
            start: this.sessionsManager.startSessions(params),
            clear: this.sessionsManager.clearOldSessions()
        }, () => {
            console.log('Sessions are been recorded');
        });
    }

    deleteRecursive(path, callback) {
        let exists = fs.existsSync(path);
        if (exists) {
            if (fs.lstatSync(path).isDirectory()) {
                fs.readdirSync(path).forEach(file => {
                    let curPath = path + '/' + file;
                    this.deleteRecursive(curPath);
                });
                fs.rmdirSync(path);
            }
            else {
                fs.unlinkSync(path);
            }
        }

        if (func.isset(callback) && typeof callback == 'function') {
            callback(exists);
        }
    }

    getCommands(start) {
        let commands = {};
        let args = process.argv.slice(2);
        let arg;
        for (let i = 0; i < args.length; i++) {
            arg = args[i];
            if (arg[0] == start) {
                commands[arg.replace(start, '')] = args[i + 1];
            }
        }

        return commands;
    }

    timeLog(...data) {
        let time = `[${func.time()}]:`;
        console.log(time, ...data);
    }

    makeStatic(path = '') {
        this.static = true;
        this.staticPath = `./${path}/`;
    }
}

module.exports = Server;
