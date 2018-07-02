class Song {
  constructor(url) {
    this.url = url;
  }
  getInfo() {
    return new Promise((resolve, reject) => {
      horizon.getInfo(this.url, async (err, info) => {
        console.log(info);
        this.info = info;
        this.name = this.info.videoName;
        this.thumbnailUrl = this.info.videoThumbList[0].url;
        this.pathVideo = `${CONFIG.SUBDIR_VIDEO}/${removeAccents(this.name)}.mp4`;
        this.pathAudio = `${CONFIG.SUBDIR_AUDIO}/${removeAccents(this.name)}.mp3`;
        resolve();
      });
    });
  }
  downloadVideo(progressHandler) {
    return new Promise(async (resolve, reject) => {
      //Ensure file exists
      await fse.ensureFile(this.pathVideo);

      //Get video with 144p
      let maxVideo;
      for(let video of this.info.videoFormats) {
        if(!maxVideo || [43, 251, 140].includes(video.itag)) {
          maxVideo = video;
        }
      }
      if(!maxVideo) {
        return reject('No video found');
      }

      //Download it
      progress(request(maxVideo.url), {
        throttle: 10
      })
      .on('progress', function (state) {

        progressHandler(state);
      })
      .on('error', function (err) {
        reject();
          // Do something with err
      })
      .on('end', function () {
        resolve();
          // Do something after request finishes
      })
      .pipe(fs.createWriteStream(this.pathVideo));
    });
  }
  convertVideoToAudio(progressHandler) {
    return new Promise(async (resolve, reject) => {
      // open input stream
      await fse.ensureFile(this.pathAudio);
      const infs = fs.createReadStream(this.pathVideo);
      console.log(infs);
      infs.on('error', function(err) {
        console.log(err);
      });

      const proc = ffmpeg(this.pathVideo)
        // setup event handlers
        .format('mp3')
        .on('progress', function(info) {
          info.percent = info.percent / 100;
          progressHandler(info);
        })
        .on('end', function() {
          console.log('done processing input stream');
          resolve();
        })
        .on('error', function(err) {
          console.log('an error happened: ' + err.message);
          reject();
        })
        .save(this.pathAudio);
    });

  }
}
