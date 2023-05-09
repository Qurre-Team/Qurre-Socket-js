const net = require('net');
const Events = require('./Events');

const RESERVED_EVENTS = new Set([
    'connect',
    'connect_error',
    'disconnect',
    'disconnecting',
    'newListener',
    'removeListener',
]);

/**
 * @class Socket client
 */
module.exports = class Client extends Events {
    /**
     * Constructs the object.
     *
     * @param      {string}  host     Socket host IP address
     * @param      {number}  port     Socket host port
     */
    constructor (port, host = '127.0.0.1') {
        super();
        if(host == null || host == undefined || host.toLowerCase() == 'localhost') host = '127.0.0.1';
        const client = new net.Socket();
        this.connected = false;
        this.destroyed = false;
        const ths = this;
        Connect();
        setInterval(() => {
            if(client.destroyed && !ths.destroyed) Connect();
        }, 1000);
        this.client = client;
        function Connect() {
            client.removeAllListeners();
            client.on('data', function(data) {
                data.toString().split('⋠').forEach(dojson => {
                    if(dojson == '') return;
                    try{
                        const array = JSON.parse(dojson);
                        if (RESERVED_EVENTS.has(array.ev)) return;
                        if (array.args == null || array.args == undefined) array.args = [];
                        ths.emitReserved(array.ev, array.args);
                    }catch{}
                });
            });
            client.on('close', () => {
                ths.connected = false;
                ths.emitReserved('disconnect');
            });
            client.on('error', () => {
                ths.connected = false;
                ths.emitReserved('disconnect');
            });
            client.connect(port, host, () => {
                ths.connected = true;
                ths.emitReserved('connect');
            });
        }
    }
    emit(ev, ...args) {
        if (RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        const data = {ev, args}
        this.client.write(JSON.stringify(data) + '⋠');
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.client.end();
        this.client.destroy();
        this.client.unref();
        this.client.removeAllListeners();
        this.removeAllListeners();
    }
}