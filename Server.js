const net = require('net');
const Socket = require('./Socket');
const Events = require("./Events");
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
        const guid = function(){return 'xxxxxxyxxxxxx4xxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
    }
    destroy(){
        this.server.close();
    }
    emit(ev, ...args) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            client.emit(ev, ...args);
        }
    }
}