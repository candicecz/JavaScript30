const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`User did not accept webcam access:`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  // Show camera output on canvas
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // Get pixels from video
    let pixels = ctx.getImageData(0, 0, width, height);
    // Apply red effect on individual pixels
    //pixels = redEffect(pixels);
    // Appy red green and blue filter
    //pixels = rgbSplit(pixels);
    // ghost effect
    //ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    // Return pixels to image form
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  // Snap sound for when photo is taken
  snap.play();
  // Base64 encoded
  const data = canvas.toDataURL('image/jpeg');
  // Creates a tags
  const link = document.createElement('a');
  // a.href = base 64 image
  link.href = data;
  // allow link for download under the name 'handsome'
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src = "${data}" alt = 'Download Image'/>`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // Looping over each pixel and applying the red effect. Incrementing by 4 for rgba
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  // Looping over each pixel and applying the red effect. Incrementing by 4 for rgba
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
getVideo();

// When the video starts to play(function getVideo) it will emit a 'canplay' event.
video.addEventListener('canplay', paintToCanvas);
