export default class SoundPlayer {
  static AudioContext = window.AudioContext || window.webkitAudioContext;

  constructor(path) {
    this.path = path;
    this.context = new SoundPlayer.AudioContext();
  }

  fetch() {
    return fetch(this.path)
      .then((response) => response.arrayBuffer())
      .then((data) => this.context.decodeAudioData(data))
      .then((buffer) => {
        this.buffer = buffer;
      });
  }

  play() {
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.start(0);
  }
}
