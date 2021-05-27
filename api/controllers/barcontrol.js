const http = require('https')

module.exports.bar = sw => {

    http.request({
        host: process.env.RDF_IP,
        port: process.env.BARRIER_PORT,
        path: `/api2.cgi?p=${process.env.BARRIER_PASS}&t0=1&sw=${sw}&v=1`
    }, response => {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            console.log(str)
        })

    }).end()

}