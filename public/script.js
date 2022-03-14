let dataFormat = '';
let title = '';
let formatVideo = '';
const spinner = document.querySelector('.loader');
spinner.style.display = 'none';
const host = `https://downloadsaja.vercel.app/`

document
  .querySelector('#get-video-info-btn')
  .addEventListener('click', async () => {
    let videoURL = document.querySelector('#videoUrl').value.trim();
    const configAxios = {
        url: `${host}videoInfo?videoURL=${videoURL}`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    if (videoURL.length == 0) {
      alert('Masukkan link');
      return;
    }

    try {
      
      spinner.style.display = 'block';
      const { data } = await axios(configAxios);
      spinner.style.display = 'none';
      let detailNodes = {
        thumbnail: document.querySelector('.video-data .thumbnail img'),
        title: document.querySelector('.video-data .info h2'),
        description: document.querySelector('.video-data .info p'),
        videoURL: document.querySelector('.video-data .controls #video-url'),
        downloadOptions: document.querySelector('.video-data .controls select'),
      };
      let html = '';
      html = data.formats
        .filter((index) => {
          return index.hasAudio === true && index.container == 'mp4';
        })
        .map((data) => {
          return `<option id="pilihVideo"
              data-quality="${data.qualityLabel}"
              value="${data.itag}"
            >
              ${data.container} - ${data.qualityLabel}
            </option>`;
        });
      title = data.videoDetails.title;
      detailNodes.thumbnail.src =
        data.videoDetails.thumbnails[
          data.videoDetails.thumbnails.length - 1
        ].url;
      detailNodes.title.innerText = data.videoDetails.title;
      detailNodes.title.innerHTML = data.videoDetails.description;
      detailNodes.videoURL.value = videoURL;
      detailNodes.downloadOptions.innerHTML = html;
      document.querySelector('.video-data').style.display = 'block';
      document.querySelector('.video-data').scrollIntoView({
        behavior: 'smooth',
      });
    } catch (error) {
      spinner.style.display = 'none';
      alert(error.response.statusText);
       console.log(error.response.statusText);
    }
  });

document.querySelector('#download-btn').addEventListener('click', () => {
  let videoURL = document.querySelector('#video-url').value.trim();
  let itag = document.querySelector('#download-options').value;

  window.open(
    host + 'download?videoURL=' + videoURL + '&itag=' + itag + '&title=' + title
  );
});
