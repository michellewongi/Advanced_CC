import * as PIXI from "pixi.js";

const main = async () => {
  // Actual app
  let app = new PIXI.Application();

  // Display application properly
  document.body.style.margin = "0";
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";

  // View size = windows
  app.renderer.resize(window.innerWidth, window.innerHeight);

  let draw = new PIXI.Graphics();

  for (let y = 0; y < window.innerHeight; y += 120) {
    for (let x = 0; x < window.innerWidth - 100; x += 200) {
      draw.lineStyle(4, 0x72bab6);
      draw.beginFill(0xffffaa, 1);
      draw.drawRoundedRect(x, y, 95, 95, 35);
      draw.endFill();
    }
  }

  for (let y = 70; y < window.innerHeight; y += 105) {
    for (let x = 110; x < window.innerWidth; x += 200) {
      draw.lineStyle(4, 0xffffaa);
      draw.beginFill(0x72bab6, 1);
      draw.drawRect(x, y, 75, 75);
    }
  }

  for (let y = 48; y < window.innerHeight; y += 120) {
    for (let x = 48; x < window.innerWidth; x += 200) {
      draw.lineStyle(3, 0x72bab6);
      draw.beginFill(0x72bab6, 1);
      draw.drawCircle(x, y, 35);
    }
  }

  for (let y = 108; y < window.innerHeight; y += 105) {
    for (let x = 148; x < window.innerWidth; x += 200) {
      draw.beginFill(0xffffaa, 1);
      draw.drawCircle(x, y, 20);
    }
  }

  app.stage.addChild(draw);

  // Handle window resizing
  window.addEventListener("resize", (_e) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  document.body.appendChild(app.view);
};

main();
