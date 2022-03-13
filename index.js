const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.use(express.json());
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server up`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/videoInfo', async (req, res) => {
  try {
    const videoUrl = req.query.videoURL;
    const info = await ytdl.getInfo(videoUrl);
    res.send(info);
  } catch (error) {
    res.send(error);
  }
});

app.get('/download', async (req, res) => {
  const videoURL = req.query.videoURL;
  const itag = req.query.itag;
  const title = req.query.title;

  res.header('Content-Disposition', `attachment; filename=${title}.mp4`);
  ytdl(videoURL, {
    filter: (format) => format.itag == itag,
  }).pipe(res);
});
