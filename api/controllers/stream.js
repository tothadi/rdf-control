const
    { workerData, parentPort } = require('worker_threads'),
    child_process = require('child_process'),
    streamer = () => {
        const ffmpeg = child_process.spawn('ffmpeg', [
            '-loglevel', 'fatal',
            '-an',
            //'-fflags', 'discardcorrupt',
            '-rtsp_transport', 'tcp',
            //'-use_wallclock_as_timestamps', '1',
            //'-re',
            '-i', workerData.cam,
            //'-vf', `scale=w=1536:h=864:force_original_aspect_ratio=decrease`,
            '-filter:v', 'fps=fps=20',
            //'-qscale:v', '30',
            //'-copytb', '1',
            //'-fflags', 'nobuffer',
            '-an',
            //'-c:v', 'libx264',
            //'-crf', '21',
            //'-preset', 'ultrafast',
            '-g', '20',
            '-r', '20',
            //'-sc_threshold', '0',
            //'-vcodec', 'libx264',
            //'-vprofile', 'baseline',
            //'-tune', 'zerolatency',
            //'-pix_fmt', 'yuvj420p',
            //'-f', 'webm',
            '-f', 'mjpeg',
            //'-codec:v', 'mpeg1video',
            //'-movflags', '+frag_keyframe+empty_moov+default_base_moof',
            //'-flush_packets', '1',
            //'-b:v', '1000k',
            //'-bf', '0',
            'pipe:1'
        ])

        ffmpeg.on('error', function (err) {
            console.log(`ffmpeg ${workerData.direction} err: ${err.message}`)
        })

        ffmpeg.on('close', function (code) {
            console.log(`ffmpeg ${workerData.direction} exited with code ${code}`)
            streamer()
        })

        ffmpeg.stderr.on('data', function (data) {
            console.log(`ffmpeg ${workerData.direction} stderr: ${data}`)
        })

        ffmpeg.stdout.on('data', function (data) {
            parentPort.postMessage(data)
        })

    }

streamer()