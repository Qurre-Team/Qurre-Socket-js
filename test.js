const {Server, Client} = require('./Qurre');
async function Init() {
    const _server = new Server();
    _server.on('connection', (sock)=>{
        sock.emit('return', 'yes, yes', 'no, no')
        sock.on('msg', ([data])=> console.log(data));
    });
    await _server.initialize();
    const _client = new Client(_server.port);
    _client.on('return', ([args1, args2]) => {
        console.log(args1)
        console.log(args2)
        _client.emit('msg', 'hello, my friend')
    });
}
Init();