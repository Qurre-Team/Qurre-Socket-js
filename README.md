<img src="https://cdn.scpsl.store/qurre.store/img/payments.png" align="right" />

# Qurre-Socket
## Using
### **Create socket Server**

```js
const {Server} = require('qurre-socket');
const _server = new Server(port, host = '127.0.0.1');
_server.on('connection', (socket) => {...});
_server.initialize();
```
**Send message to all clients**

```js
_server.emit(event, data);
```
**Receiving a message from a client on a socket**

```js
socket.on(event, ([args1, args2]) => {...});
```
**Send message to socket client**

```js
socket.emit(event, args1, args2);
```

### **Create socket Client**

```js
const {Client} = require('qurre-socket');
const _client = new Client(port, host = '127.0.0.1');
```
**Receiving a message from the server**

```js
_client.on(event, ([args1, args2]) => {...});
```
**Send message to server**

```js
_client.emit(event, args1, args2);
```
**Example**

```js
const {Server, Client} = require('qurre-socket');
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
```
