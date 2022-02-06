import * as PIXI from "pixi.js";

const main = async () => {
  // Actual app
  let app = new PIXI.Application();

  // Display application properly
  document.body.style.margin = "0";
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";

  // View size = windows
  app.renderer.resize(window.innerWidth, window.innerHeight + 30);

  let draw = new PIXI.Graphics();

  for (let y = 40; y < window.innerHeight; y += 120) {
    for (let x = 40; x < window.innerWidth - 130; x += 200) {
      draw.lineStyle(4, 0x72bab6);
      draw.beginFill(0xffffaa, 1);
      draw.drawRoundedRect(x, y, 95, 95, 35);
      draw.endFill();
    }
  }

  for (let y = 70; y < window.innerHeight; y += 105) {
    for (let x = 150; x < window.innerWidth - 130; x += 200) {
      draw.lineStyle(4, 0xffffaa);
      draw.beginFill(0x72bab6, 1);
      draw.drawRect(x, y, 75, 75);
    }
  }

  for (let y = 88; y < window.innerHeight; y += 120) {
    for (let x = 88; x < window.innerWidth - 100; x += 200) {
      draw.lineStyle(3, 0x72bab6);
      draw.beginFill(0x72bab6, 1);
      draw.drawCircle(x, y, 35);
    }
  }

  for (let y = 108; y < window.innerHeight; y += 105) {
    for (let x = 189; x < window.innerWidth - 100; x += 200) {
      draw.beginFill(0xffffaa, 1);
      draw.drawCircle(x, y, 20);
    }
  }

  for (let y = 50; y < window.innerHeight; y += 65) {
    for (let x = 50; x < window.innerWidth; x += 60) {
      draw.endFill();
      draw.lineStyle(3, 0xffffff);
      draw.drawRect(60, 60, y - 50, y - 40);
      draw.drawRect(760, 70, y - 50, y - 40);
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
