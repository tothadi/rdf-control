const options = {
    host: process.env.rdfIp,
    port: process.env.BARRIER_PORT,
    path: [
        `/api2.cgi?p=${process.env.BARRIER_PASS}&t0=1&sw=1&v=1`,//belső nyitás
        `/api2.cgi?p=${process.env.BARRIER_PASS}&t0=1&sw=2&v=1`,//belső zárás
        `/api2.cgi?p=${process.env.BARRIER_PASS}&t0=1&sw=3&v=1`,//külső nyitás
        `/api2.cgi?p=${process.env.BARRIER_PASS}&t0=1&sw=4&v=1`//külső zárás
    ]
}

console.log(options[0])