import * as PIXI from "pixi.js";

const main = async () => {
  // Actual app
  let app = new PIXI.Application({
    backgroundColor: 0xe3efdc,
  });

  // Display application properly
  document.body.style.margin = "0";
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";

  // View size = windows
  app.renderer.resize(window.innerWidth, window.innerHeight);

  let draw = new PIXI.Graphics();

  for (let y = 20; y < window.innerHeight; y += 108) {
    for (let x = 30; x < window.innerWidth - 100; x += 100) {
      draw.beginFill(0x533e42, 1);
      draw.drawRect(x, y, 100, 15);
    }
  }

  for (let y = 35; y < window.innerHeight - 50; y += 120) {
    for (let x = 70; x < window.innerWidth - 130; x += 200) {
      draw.beginFill(0xffffaa, 1);
      draw.drawRect(x, y, 95, 95);
    }
  }

  for (let y = 60; y < window.innerHeight; y += 105) {
    for (let x = 180; x < window.innerWidth - 130; x += 200) {
      draw.beginFill(0x72bab6, 1);
      draw.drawRect(x, y, 75, 75);
    }
  }

  for (let y = 80; y < window.innerHeight; y += 120) {
    for (let x = 120; x < window.innerWidth - 100; x += 200) {
      draw.beginFill(0x72bab6, 1);
      draw.drawCircle(x, y, 35);
    }
  }

  for (let y = 97; y < window.innerHeight; y += 105) {
    for (let x = 217; x < window.innerWidth - 100; x += 200) {
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
