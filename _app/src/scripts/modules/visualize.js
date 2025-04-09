import Settings from "../../data/settings.json";

const visualize = async (element) => {
  let texts = element.querySelectorAll(".text > span");
  console.log(texts);

  Array.prototype.shuffle = function () {
    var i = this.length;
    while (i) {
      var j = Math.floor(Math.random() * i);
      var t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }

    return this;
  };

  let randomArray = [];
  texts.forEach((text, i) => {
    randomArray.push(i);
  });

  randomArray.shuffle();

  texts.forEach((text, i) => {
    setTimeout(function () {
      text.classList.add("is-disp");
      text.classList.add("is-blink");
      setTimeout(function () {
        text.classList.remove("is-blink");
        setTimeout(function () {
          text.classList.add("is-glitch");
        }, 800);
      }, 800);
    }, 180 * randomArray[i]);
  });

  // Audio visualizer
  const canvas = element.querySelector("canvas");
  const context = canvas.getContext("2d");
  const audioPath = Settings.path.asset + Settings.path.audio + "/breakbot/mystery/mix.mp3";
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioAnalyser = audioContext.createAnalyser();
  let audioBuffer = new XMLHttpRequest();
  const fftSize = 980;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let startTime = Date.now();
  let duration = Math.random() * 800;
  let color;
  let fire = false;

  const colorPattern = [
    ["#000000", "#000000"],
    ["#A64E57", "#529AA8"],
    ["#23A7F3", "#F1EADC"],
    ["#A4C27B", "#284C50"],
    ["#E21E4F", "#F4CB06"],
    ["#72ECE5", "#F40F0D"],
    ["#F5F5F5", "#EA6B5F"],
    ["#EDFD1F", "#1291C6"],
    ["#002876", "#FFD30A"],
    ["#F6E7CD", "#B5978E"],
    ["#1ECADD", "#DA9CA5"],
    ["#2B3342", "#9E9570"],
  ];

  color = colorPattern[0];

  const init = function () {
    renderloop();
    resizeCanvas();
    initAudio();
    document.addEventListener("resize", () => {
      resizeCanvas();
    });
    document.addEventListener("click", () => {
      player.fetch().then(() => {
        player.play();
      });
    });
  };

  const initAudio = function () {
    audioAnalyser.fft_size = fftSize;
    audioAnalyser.connect(audioContext.destination);
    loadAudio();
  };

  const loadAudio = function () {
    const request = new XMLHttpRequest();

    request.open("GET", audioPath, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      audioContext.decodeAudioData(request.response, function (buffer) {
        audioBuffer = buffer;
        playAudio();
      });
    };
    request.send();
  };

  const playAudio = function () {
    const source = audioContext.createBufferSource();

    source.buffer = audioBuffer;
    source.connect(audioAnalyser);
    source.loop = true;
    source.start(0);
  };

  const drawSpectrums = function () {
    let spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
    let str = "";
    let length = 0;
    let lineWidth = 1;

    let now = Date.now();
    let current = now - startTime;
    let hThreshold = 0.609;

    let maxSpectrum = 0;
    let minSpectrum = 256;

    audioAnalyser.getByteTimeDomainData(spectrums);
    length = audioAnalyser.frequencyBinCount;

    for (let i = 0; i < length; i++) {
      if (maxSpectrum < spectrums[i]) {
        maxSpectrum = spectrums[i];
      }
      if (minSpectrum > spectrums[i]) {
        minSpectrum = spectrums[i];
      }
    }

    console.log((maxSpectrum - minSpectrum) * (100 / 256));

    if (Math.random() < 0.01) {
      const random = Math.random() * 0.1 + 0.3;

      if (Math.random() < 0.5) {
        hThreshold -= random;
      } else {
        hThreshold += random;
      }
    }

    if (current > duration) {
      if (Math.random() < 0.85) {
        color = colorPattern[0];
      } else {
        color = colorPattern[Math.floor(Math.random() * colorPattern.length)];
      }

      duration = Math.random() * 800;
      startTime = now;
    }

    context.fillStyle = color[0];
    context.rect(0, 0, width, height);
    context.fill();

    context.fillStyle = color[1];
    context.lineWidth = 1;
    context.strokeStyle = "#ffffff";
    context.beginPath();
    for (let i = 0; i < length; i++) {
      const x = (i / fftSize) * width;
      const y = (Math.log(256 - spectrums[i]) / Math.log(256)) * height * hThreshold;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.lineTo(width + lineWidth, height + lineWidth);
    context.lineTo(-lineWidth, height + lineWidth);
    context.fill();
    context.stroke();
  };

  const render = function () {
    context.clearRect(0, 0, width, height);
    drawSpectrums();
  };

  const renderloop = function () {
    requestAnimationFrame(renderloop);
    render();
  };

  const resizeCanvas = function () {
    width = window.innerWidth * 2;
    height = window.innerHeight * 2;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width / 2 + "px";
    canvas.style.height = height / 2 + "px";
  };

  document.addEventListener("click", () => {
    if (!fire) {
      fire = true;
      init();
    }
  });
};

export default visualize;
