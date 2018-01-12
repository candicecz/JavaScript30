//Get our elements
const player = document.querySelector('.player');
const vid = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const fullscreen = player.querySelector('.fullscreen');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

//plays video if  paused and vice versa
function togglePlay() {
  const method = vid.paused ? 'play' : 'pause';
  vid[method]();
  method === 'play' ? (toggle.innerHTML = `❚ ❚`) : (toggle.innerHTML = '►');
  handleProgress();
}
// handle the skipping ahead and go back buttons
function handleSkip() {
  vid.currentTime += parseFloat(this.dataset.skip);
}
//handles the volume and speed ranges
function handleRange() {
  vid[this.name] = this.value;
}
//handles the progress bar completion
function handleProgress() {
  const percent_completed = vid.currentTime / vid.duration * 100;
  progressBar.style.flexBasis = `${percent_completed}%`;
}
//handles the progress bar completion if manually moved by user
function handleProgressClick(e) {
  const percent_completed = e.offsetX / progress.offsetWidth * vid.duration;
  vid.currentTime = percent_completed;
}

let fs = false;
//handles fullscreen
function handleScreen(e) {
  fs = !fs;
  fs ? player.webkitRequestFullScreen() : document.webkitExitFullscreen();
}
//hook up the event listeners
let mousedown = false;
vid.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
vid.addEventListener('timeupdate', handleProgress);
skipButtons.forEach(button => button.addEventListener('click', handleSkip));
ranges.forEach(range => range.addEventListener('change', handleRange));
progress.addEventListener('click', handleProgressClick);
progress.addEventListener('mousemove', e => {
  mousedown && handleProgressClick(e);
});
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
fullscreen.addEventListener('click', handleScreen);
