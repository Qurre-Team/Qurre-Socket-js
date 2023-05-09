const net = require('net');
const Socket = require('./Socket');
const Events = require('./Events');

const guid = () => 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random()*32|0).toString(32));

/**
 * @class Socket server
 */
module.exports = class Server extends Events {
    /**
     * Constructs the object.
     *
     * @param      {string}  host     Socket IP address
     * @param      {number}  port     Socket port
     */
    constructor (port = 0, host = '127.0.0.1') {
        super();
        if(host == null || host == undefined || host.toLowerCase() == 'localhost') host = '127.0.0.1';
        this.host = host;
        this.port = port;
        this.clients = [];
        this.initialized = false;
        this.server = {};
    }

    async initialize(){
        if(this.initialized) return;
        this.initialized = true;
        const ths = this;
        const server = net.createServer(function(sock) {
            const _socket = new Socket(guid(), sock);
            ths.clients.push(_socket);
            ths.emitReserved('connection', _socket);
        })
        await listen(server);
        function listen(server) {
            return new Promise(resolve => server.listen(ths.port, ths.host, () => resolve()));
        }
        this.port = server.address().port;
        this.server = server;
    }
    destroy(){
        this.server.close(() => {
            this.server.unref();
            this.server.removeAllListeners();
            this.removeAllListeners();
        });
    }
    emit(ev, ...args) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            client.emit(ev, ...args);
        }
    }
}