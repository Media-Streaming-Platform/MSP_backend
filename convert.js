const { spawn } = require('child_process');
const path = require('path');

function convertToHLS(inputPath, outputDir, playlistName = 'playlist') {
  return new Promise((resolve, reject) => {
    // Example FFmpeg args: produce HLS segments and playlist
    const args = [
      '-i', inputPath,
      '-codec:v', 'libx264',
      '-codec:a', 'aac',
      '-hls_time', '10',                      // segment length (seconds)
      '-hls_playlist_type', 'vod',            // VOD playlist
      '-hls_segment_filename', path.join(outputDir, 'segment%03d.ts'),
      '-start_number', '0',
      path.join(outputDir, `${playlistName}.m3u8`)
    ];

    const ff = spawn('ffmpeg', args);

    ff.stderr.on('data', (data) => {
      // ffmpeg writes progress to stderr
      console.log(`ffmpeg: ${data.toString()}`);
    });

    ff.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}

module.exports = { convertToHLS };
