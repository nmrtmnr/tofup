document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";
      document.documentElement.style.height = "100%";
      document.documentElement.style.width = "100%";

      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";
      document.body.style.background = "#FFF";

      const IMAGE_SRC = "/assets/image/ascii/flower_01.png";
      let isAnimating = false;

      const toggleFn = createInteractivePixelImage(IMAGE_SRC);

      document.body.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        toggleFn(() => {
          isAnimating = false;
        }, 15);
      });
//色
      const IMAGE_COLOR_MAP = [
  { src: "flower_01.png", r: 80, g: 150, b: 90 },
  { src: "flower_02.png", r: 85, g: 160, b: 100 },
  { src: "flower_03.png", r: 90, g: 140, b: 70 },
  { src: "flower_04.png", r: 200, g: 190, b: 80 },
  { src: "flower_05.png", r: 220, g: 160, b: 60 },
  { src: "flower_06.png", r: 240, g: 130, b: 50 },
  { src: "flower_07.png", r: 255, g: 110, b: 30 },
  { src: "flower_08.png", r: 240, g: 70,  b: 70 },
  { src: "flower_09.png", r: 200, g: 60,  b: 120 },
  { src: "flower_10.png", r: 170, g: 50,  b: 150 },
  { src: "flower_11.png", r: 130, g: 60,  b: 170 },
  { src: "flower_12.png", r: 90,  g: 70,  b: 180 },
  { src: "flower_13.png", r: 60,  g: 90,  b: 200 },
  { src: "flower_14.png", r: 30,  g: 100, b: 220 }
];

let hoveredColor = null;

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

function findClosestImage(color) {
  return IMAGE_COLOR_MAP.reduce((closest, current) => {
    const dist = colorDistance(current, color);
    return dist < closest.dist ? { dist, src: current.src } : closest;
  }, { dist: Infinity, src: IMAGE_SRC }).src;
}

function createInteractivePixelImage(IMAGE_SRC) {
        let isPixelated = false;
        let pixels = [];
        let maxDelay = 0;

        const canvas = document.createElement("canvas");
        canvas.width = 30;
        canvas.height = 30;
        canvas.style.display = "none";
        const ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = IMAGE_SRC;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 30, 30);
          setupInitialImage();
        };

        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.width = "300px";
        container.style.height = "300px";
        document.body.appendChild(container);

        const originalImage = document.createElement("div");
        originalImage.style.width = "100%";
        originalImage.style.height = "100%";
        originalImage.style.backgroundImage = `url(${IMAGE_SRC})`;
        originalImage.style.backgroundSize = "300px 300px";
        originalImage.style.backgroundPosition = "center";
        originalImage.style.position = "absolute";
        originalImage.style.top = "0";
        originalImage.style.left = "0";
        originalImage.style.zIndex = "1";
        container.appendChild(originalImage);

        const pixelContainer = document.createElement("div");
        pixelContainer.style.position = "absolute";
        pixelContainer.style.top = "0";
        pixelContainer.style.left = "0";
        pixelContainer.style.width = "300px";
        pixelContainer.style.height = "300px";
        pixelContainer.style.zIndex = "2";
        container.appendChild(pixelContainer);

        const hoverLayer = document.createElement("div");
        hoverLayer.style.position = "absolute";
        hoverLayer.style.top = "0";
        hoverLayer.style.left = "0";
        hoverLayer.style.width = "300px";
        hoverLayer.style.height = "300px";
        hoverLayer.style.zIndex = "3";
        container.appendChild(hoverLayer);

        function setupInitialImage() {
          pixelContainer.innerHTML = "";
          hoverLayer.innerHTML = "";
          pixels = [];
          maxDelay = 0;

          const imageData = ctx.getImageData(0, 0, 30, 30).data;

          for (let y = 0; y < 30; y++) {
            for (let x = 0; x < 30; x++) {
              const idx = (y * 30 + x) * 4;
              const r = imageData[idx];
              const g = imageData[idx + 1];
              const b = imageData[idx + 2];
              const a = imageData[idx + 3] / 255;
///ここから
              const pixel = document.createElement("div");
              pixel.style.position = "absolute";
              pixel.style.width = "10px";
              pixel.style.height = "10px";
              pixel.style.left = `${x * 10}px`;
              pixel.style.top = `${y * 10}px`;
              pixel.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
              pixel.style.opacity = "0";
              pixel.style.transform = "scale(0)";
              pixel.style.transition = "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), z-index 0s";
              pixel.style.pointerEvents = "none";
              pixel.style.zIndex = "2";

              pixelContainer.appendChild(pixel);

              const hoverTarget = document.createElement("div");
              hoverTarget.style.position = "absolute";
              hoverTarget.style.width = "10px";
              hoverTarget.style.height = "10px";
              hoverTarget.style.left = `${x * 10}px`;
              hoverTarget.style.top = `${y * 10}px`;
              hoverTarget.style.zIndex = "4";

              hoverTarget.addEventListener("mouseenter", () => {
                pixel.style.zIndex = "9999";
                pixel.style.transform = "scale(4.5)";
                pixel.style.opacity = "1";
                hoveredColor = { r, g, b };
              });

              hoverTarget.addEventListener("mouseleave", () => {
                // 他のピクセルが優先されるように、zIndex を一旦保留して条件付きで戻す
                const currentZ = pixel.style.zIndex;
                setTimeout(() => {
                  if (pixel.style.transform !== "scale(4.5)") {
                    pixel.style.zIndex = "2";
                  }
                }, 400);
                pixel.style.transform = isPixelated ? "scale(1)" : "scale(0)";
                if (!isPixelated) pixel.style.opacity = "0";
              });

              hoverTarget.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!hoveredColor) return;
                const closestSrc = findClosestImage(hoveredColor);
                const newPath = `/assets/image/ascii/${closestSrc}`;
                ctx.clearRect(0, 0, 30, 30);
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, 30, 30);
                  const imageData = ctx.getImageData(0, 0, 30, 30).data;
                  pixels.forEach(({ el }, index) => {
                    const x = index % 30;
                    const y = Math.floor(index / 30);
                    const idx = (y * 30 + x) * 4;
                    const r = imageData[idx];
                    const g = imageData[idx + 1];
                    const b = imageData[idx + 2];
                    const a = imageData[idx + 3] / 255;
                    el.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
                    el.style.opacity = "0";
                    el.style.transform = "scale(0)";
                    setTimeout(() => {
                      el.style.opacity = "1";
                      el.style.transform = "scale(1)";
                    }, (x * 30) + Math.floor(Math.random() * 150));
                  });
                };
                img.src = newPath;
                originalImage.style.backgroundImage = `url(${newPath})`;
              });

              hoverLayer.appendChild(hoverTarget);

              const baseDelay = x * 30;
              const randomOffset = Math.floor(Math.random() * 200);
              const delay = baseDelay + randomOffset;
              pixels.push({ el: pixel, delay });
              maxDelay = Math.max(maxDelay, delay);
            }
          }
        }
///
        function animatePixelation(showPixels, onComplete) {
          pixels.forEach(({ el, delay }) => {
            setTimeout(() => {
              el.style.opacity = showPixels ? "1" : "0";
              el.style.transform = showPixels ? "scale(1)" : "scale(0)";
            }, delay);
          });
          setTimeout(onComplete, maxDelay + 300);
        }

        function togglePixelation(onComplete) {
          animatePixelation(!isPixelated, onComplete);
          isPixelated = !isPixelated;
        }

        return togglePixelation;
      }