const Events = require("./Events");
const RESERVED_EVENTS = new Set([
    'connect',
    'connect_error',
    'disconnect',
    'disconnecting',
    'newListener',
    'removeListener',
]);
module.exports = class Socket extends Events {
    constructor (uid, net_sock) {
        super();
        this.id = uid;
        this.sock = net_sock;
        const ths = this;
        this.sock.on('data', function(data) {
            data.toString().split('⋠').forEach(dojson => {
                if(dojson == '') return;
                try{
                    const array = JSON.parse(dojson);
                    if (RESERVED_EVENTS.has(array.ev)) return;
                    ths.emitReserved(array.ev, array.args);
                }catch{}
            });
        });
        this.sock.on('close', () => ths.emitReserved('disconnect'));
        this.sock.on('error', () => {});
    }
    emit(ev, ...args) {
        if (RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        const data = {ev, args}
        this.sock.write(JSON.stringify(data) + '⋠');
        return true;
    }
}