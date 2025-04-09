import Settings from "../../data/settings.json";

const RootFontSize = (element) => {
  console.log(":", Settings);

  const set = () => {
    const v = {
      clientWidth: document.documentElement.clientWidth,
    };

    if (!window.matchMedia(`(min-width: ${Settings.breakpoint.lv1 + 1}px)`).matches) {
      // sp
      document.documentElement.style.fontSize = v.clientWidth / Settings.design.sp.size + "px";
    } else {
      // pc
      document.documentElement.style.fontSize = v.clientWidth / Settings.breakpoint.lv2 + "px";
    }
  };

  const bindEvents = () => {
    window.addEventListener("resize", () => {
      set();
    });
  };

  set();
  bindEvents();
};

export default RootFontSize;
