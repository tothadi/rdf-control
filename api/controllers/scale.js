//require('events').defaultMaxListeners = 20
const net = require('net'),
    io = require('../../bin/www').io,
    port = process.env.SCALE_PORT,
    host = process.env.RDF_IP,
    socket = new net.Socket(),
    stats = require("stats-lite"),
    http = require('http'),
    { bar } = require('./barcontrol');

socket.setEncoding('utf8');
let weightBuffer = [];

//socket.on('data', (data)=>{console.log(data)})

const
    startComm = () => {
        socket.connect(port, host, () => {
            socket.on('timeout', timeoutEventHandler);
            socket.on('readable', onReadable);
            socket.on('end', endEventHandler);
            socket.on('close', closeEventHandler);
        })
    },
    stopComm = () => {
        socket.destroy();
        socket.removeAllListeners();
    },
    endEventHandler = () => {
        console.log('end');
    },
    timeoutEventHandler = () => {
        console.log(`Timeout - reconnection in 3 seconds...`);
        socket.removeAllListeners();
        setTimeout(() => {
            startComm();
        }, 3000);
    },
    errorEventHandler = err => {
        console.log(`error: ${err.message}`);
    },
    closeEventHandler = () => {
        socket.removeAllListeners();
        console.log('connection closed');
    },
    onReadable = () => {
        let chunk;
        try {
            while (null !== (chunk = socket.read())) {
                let d_index = chunk.indexOf('KG');
                let weight = parseInt(chunk.substring((d_index - 5), d_index));
                if (weight !== undefined && typeof (weight) === 'number' && !isNaN(weight)) {
                    //console.log(weight)
                    weightBuffer.push(weight);
                }
            }
        } catch (err) {
            console.log(`error: ${err.message}`);
        }

        if (weightBuffer.length > 5) {
            let avgWeight = stats.mode(weightBuffer);
            weightBuffer.length = 0;
            //console.log(avgWeight)
            io.emit('weight', avgWeight);
        }
    };

module.exports.weigh = (status) => {

    socket.on('error', errorEventHandler);

    switch (status) {
        case true:
            startComm();
            break;
        case false:
            stopComm();
            break;
        case 1://külső nyit, belső zár
            bar(3);
            bar(2);
            startComm();
            break;
        case 2://külső zár, belső nyit
            bar(1);
            bar(4);
            startComm();
            break;
        case 3://mindkettő zár
            bar(2);
            bar(4);
            stopComm();
            break;
        case 4://mindkettő nyit
            bar(1);
            bar(3);
            stopComm();
            break;
        default:
            bar(1);
            bar(3);
            stopComm();
            break;
    }
}