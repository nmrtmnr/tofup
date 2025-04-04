const audio = (element) => {
  const play = document.querySelector(".play");

  play.addEventListener("click", () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = element;
    const track = audioContext.createMediaElementSource(audioElement);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    console.log("frequencies", frequencies);

    analyser.getByteTimeDomainData(frequencies);

    track.connect(audioContext.destination);
    // audioElement.volume = 0;
    audioElement.play();
  });

  console.log(play);
};

export default audio;
