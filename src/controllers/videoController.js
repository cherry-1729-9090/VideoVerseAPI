const ffmpeg = require('fluent-ffmpeg');
const db = require('../config/database');
const moment = require('moment');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

exports.uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const { path: videoPath, filename } = req.file;
    let videoId = 0;

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
            console.error('FFprobe error:', err);
            return res.status(500).send('Error processing video');
        }

        const duration = metadata.format.duration;

        db.run('INSERT INTO videos (filename, path, duration) VALUES (?, ?, ?)',
            [filename, videoPath, duration], function (err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Error saving to database');
                }
                
                const { start, end } = req.body;
                if (start && end) {
                    const startSeconds = moment.duration(start).asSeconds();
                    const endSeconds = moment.duration(end).asSeconds();
                    trimVideo2(videoId, startSeconds, endSeconds, res);
                }

                res.status(200).json({
                    message: 'Video uploaded successfully',
                    videoId: this.lastID
                });

            });
    });


};

exports.trimVideo = (req, res) => {
    const { videoId, start, end } = req.body;
    
    const startSeconds = moment.duration(start).asSeconds();
    const endSeconds = moment.duration(end).asSeconds();
    trimVideo2(videoId, startSeconds, endSeconds, res);

};

const trimVideo2 = (videoId, startSeconds, endSeconds, res) => {
    
    db.get('SELECT path FROM videos WHERE id = ?', [videoId], (err, row) => {
        if (err || !row) {
            return res.status(404).send('Video not found');
        }

        const inputPath = row.path;
        const outputPath = `uploads/trimmed_${Date.now()}_${videoId}.mp4`;

        ffmpeg(inputPath)
            .setStartTime(startSeconds)
            .setDuration(endSeconds - startSeconds)
            .output(outputPath)
            .on('end', () => {
                res.status(200).send('Video trimmed successfully');
            })
            .on('error', (err) => {
                console.error('Error:', err);
                res.status(500).send('Error trimming video');
            })
            .run();
    });
};

exports.concatenateVideos = (req, res) => {
    const { videoIds } = req.body;

    db.all('SELECT path FROM videos WHERE id IN (' + videoIds.join(',') + ')', [], (err, rows) => {
        if (err || rows.length !== videoIds.length) {
            return res.status(404).send('One or more videos not found');
        }

        const inputPaths = rows.map(row => row.path);
        const outputPath = `uploads/concatenated_${Date.now()}.mp4`;

        const command = ffmpeg();
        inputPaths.forEach(path => {
            command.input(path);
        });

        command.mergeToFile(outputPath, './temp')
            .on('end', () => {
                res.status(200).send('Videos concatenated successfully');
            })
            .on('error', (err) => {
                console.error('Error:', err);
                res.status(500).send('Error concatenating videos');
            });
    });
};