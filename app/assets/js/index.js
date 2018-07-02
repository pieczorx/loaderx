const request = require('request');
const horizon = require('horizon-youtube-mp3');
const fs = require('fs');
const fse = require('fs-extra');
const progress = require('request-progress');
const ffbinaries = require('ffbinaries');
const ffmpeg = require('fluent-ffmpeg');
const removeAccents = require('remove-accents');

const output = __dirname + '/test/test.mp4';
const outputAudio = __dirname + '/test/audio.mp3'

let songs = [];
$(window).ready(() => {
  const app = new appClass();
  app.ensureFfBinaries();
  $(document).on('click', `[data-role='btnxd']`, function() {
    const url = $('input').val();
    app.addSong(url);
  });
});

class appClass {
  constructor() {
    ffmpeg.setFfmpegPath(`${CONFIG.DIR_LOCAL}/binaries/ffmpeg.exe`);
  }
  async ensureFfBinaries() {
    //return new Promise() {

    //}
    const dest = `${CONFIG.DIR_LOCAL}/binaries`;
    await fse.ensureDir(dest);
    console.log('downloading binaries...');
    try {

      function tickerFn (data) {
        console.log('\x1b[2m' + data.filename + ': Downloading ' + (data.progress*100).toFixed(1) + '%' + '\x1b[0m');
      }

      ffbinaries.downloadFiles(['ffmpeg', 'ffprobe'], {platform: ffbinaries.detectPlatform(), quiet: true, destination: dest, tickerFn: tickerFn}, function (err, data) {
        console.log('Downloading ffmpeg binary for win-64 to ' + dest + '.');
        console.log('err', err);
        console.log('data', data);


      });
    } catch(e) {
      console.warn(e)
    }

  }

  downloadYouTubeVideo(url) {

  }

  async addSong(url) {
    console.log('Adding song');
    const song = new Song(url);

    await song.getInfo();
    console.log('Got info about song', song.name);
    const id = songs.length;
    songs[id] = song;

    $(`[data-role='song_list']`).append(html.songListElement({
      id: id,
      thumbnailUrl: song.thumbnailUrl,
      title: song.name
    }));

    let progress = 0;
    const updateProgress = function () {
      console.log('finalny progress', progress);
      $(`[data-role='song_list_e'][data-id='${id}'] .progress .bar`).css('width', `${progress * 100}%`);
    }

    await song.downloadVideo(partProgress => {
      progress = partProgress.percent * 0.5;
      updateProgress();
    });
    console.log('Song video downloaded');
    await song.convertVideoToAudio(partProgress => {
      progress = 0.5 + partProgress.percent * 0.5;
      updateProgress();
    });
    console.log('Song converted to mp3');
  }


}
