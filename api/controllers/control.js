const
  { Worker } = require('worker_threads'),
  { io } = require('../../bin/www'),

  startStream = (cam, direction) => {
    const worker = new Worker('./api/detection/stream.js', { workerData: { cam: cam, direction: direction } });

    worker.on('message', data => {
      const imgData = Buffer.from(data).toString('base64');
      io.emit(`render${direction}`, `data:image/jpeg;base64,${imgData}`);
    });

    worker.on('error', err => {
      if (err) {
        console.log(err);
      };
    });

    worker.on('exit', (code) => {
      if (code !== 0)
        console.log(`Worker stopped with exit code ${code}`);
    });

  };

startStream(process.env.STREAM_IN, 'In');
startStream(process.env.STREAM_OUT, 'Out');