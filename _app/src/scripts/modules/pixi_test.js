import Settings from "../../data/settings.json";
import { Application, Graphics } from "pixi.js";
import SoundPlayer from "../classes/sound-player";

const PixiTest = async (element) => {
  // play audio
  const audioPath = Settings.path.asset + Settings.path.audio;
  const player = new SoundPlayer(`${audioPath}/breakbot/mystery/mix.mp3`);

  document.addEventListener("click", () => {
    player.fetch().then(() => {
      player.play();
    });
  });

  // color pattern
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

  // pixi
  const backGraphics = new Graphics();
  const frontGraphics = new Graphics();
  const app = new Application();
  await app.init({ antialias: true, resizeTo: window, view: document.createElement("canvas") });

  await element.appendChild(app.canvas);

  app.ticker.add(() => {
    // colorTimer += app.ticker.deltaMS; // 前フレームからの経過ミリ秒
    // if (colorTimer > colorInterval) {
    //   hsv.h = Math.random() * 360;
    //   complementaryHsv = rgb2hsv(getComplementaryRgbColor(hsv2rgb(hsv)));
    //   colorTimer = 0;
    // }

    // visualize
    backGraphics.clear();
    frontGraphics.clear();

    // background
    backGraphics.rect(0, 0, window.innerWidth, window.innerHeight);
    backGraphics.fill("#000000");

    // front layer
    frontGraphics.moveTo(-1, -1);
    frontGraphics.lineTo(-1, window.innerHeight / 2);

    for (let i = 1; i < 256; i++) {
      frontGraphics.lineTo(
        Math.round((window.innerWidth / 256) * i),
        window.innerHeight / 2 + Math.random() * 100,
      );
    }

    frontGraphics.lineTo(window.innerWidth + 1, window.innerHeight / 2);
    frontGraphics.lineTo(window.innerWidth + 1, -1);
    frontGraphics.lineTo(-1, -1);

    frontGraphics.fill("#ff0000");
    frontGraphics.stroke({ width: 1, color: "#ffffff" });
  });

  app.stage.addChild(backGraphics);
  app.stage.addChild(frontGraphics);
  app.start();
};

export default PixiTest;
