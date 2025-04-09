const asciiChars = ["8", "7", "S", "%", "?", "*", "+", ";", ":", ",", "."];

const images = document.querySelectorAll(".ascii-art-img");
images.forEach((image, index) => {
  image.crossOrigin = "Anonymous";
  image.onload = function () {
    processImage(image, index + 1);
  };
});

const distance = [[]];
function processImage(img, imageIndex) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  distance[imageIndex] = [];
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let asciiArt = "";
  for (let y = 0; y < canvas.height; y += 20) {
    for (let x = 0; x < canvas.width; x += 14) {
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const brightness = (r + g + b) / 3;
      const charIndex = Math.floor(brightness / 50);
      const color = `rgb(${r}, ${g}, ${b})`;
      asciiArt += `<span style="color: ${color}">${asciiChars[charIndex]}</span>`;
    }
    asciiArt += "<br>";
  }
  const asciiArtEl = document.createElement("div");
  asciiArtEl.classList.add(`ascii-art-${imageIndex}`);
  const activeLetters = new Set();
  const base = document.getElementById(`ascii-art-${imageIndex}`);

  asciiArtEl.addEventListener("mouseover", (event) => {
    const asciiLetters = asciiArtEl.querySelectorAll(`span`);
    asciiLetters.forEach((letter, letterIndex) => {
      if (activeLetters.has(letter)) {
        return;
      }
      const letterPos = letter.getBoundingClientRect();
      const distanceX = event.clientX - (letterPos.left + letterPos.width / 2);
      const distanceY = event.clientY - (letterPos.top + letterPos.height / 2);

      distance[imageIndex].push([Infinity]);
      distance[imageIndex][letterIndex][0] = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY,
      );
      if (distance[imageIndex][letterIndex][0] < 40) {
        startScramble(letter, distance);
        activeLetters.add(letter);
      }
    });
  });

  asciiArtEl.innerHTML = asciiArt;
  img.parentNode.insertBefore(asciiArtEl, img.nextSibling);

  function startScramble(letter, distance) {
    let scrambledText = "";
    let letterIndex = 0;
    let letterSave = "";
    const letterText = letter.innerHTML;

    const delay = Math.random() * 200;

    setTimeout(() => {
      let lastTime = null;
      const scramble = (time) => {
        if (!lastTime) {
          lastTime = time;
        }
        const deltaTime = time - lastTime;
        if (deltaTime >= 30) {
          lastTime = time;
          letterSave = letterText;
          if (letterIndex >= 5) {
            scrambledText = letterSave;
          } else {
            scrambledText = getRandomChar(distance);
          }
          letter.innerHTML = scrambledText;
          if (letterIndex >= 5) {
            activeLetters.delete(letter);
            return;
          }
          letterIndex++;
        }
        requestAnimationFrame(scramble);
      };
      requestAnimationFrame(scramble);
    }, delay);
  }

  function getRandomChar(distance) {
    const emojis = [
      0x1f600, // 😀
      0x1f601, // 😁
      0x1f602, // 😂
      0x1f603, // 😃
      0x1f604, // 😄
      0x1f605, // 😅
      0x1f606, // 😆
      0x1f607, // 😇
      0x1f608, // 😈
    ];

    const emojiIndex = Math.floor(Math.random() * emojis.length);
    return String.fromCodePoint(emojis[emojiIndex]);
  }
}
