window.addEventListener("DOMContentLoaded", () => {
  const moduleTarget = document.querySelectorAll("[data-module]");
  const moduleOptions = JSON.parse(document.querySelector("#m-props").textContent);
  for (const target of moduleTarget) {
    const key = target.getAttribute("data-module")?.split(" ");
    if (key) {
      for (const names of key) {
        let fileName = names.split("_m_")[0];
        fileName = fileName.charAt(0).toLowerCase() + fileName.slice(1);
        import(`./modules/${fileName}.js`).then((m) => {
          m.default(target, moduleOptions[names]);
        });
      }
    }
  }
});
