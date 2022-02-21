import * as PIXI from "pixi.js";
import { gsap } from "gsap";

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader.add("shape", "assets/shape.png").load(() => {
      resolve();
    });
  });
};

const main = async () => {
  // Actual app
  let app = new PIXI.Application({ antialias: true });

  // Display application properly
  document.body.style.margin = "0";
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";

  // View size = windows
  app.renderer.resize(window.innerWidth, window.innerHeight);

  // Load assets
  await load(app);

  // Handle window resizing
  window.addEventListener("resize", (_e) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  let width = window.innerWidth;
  let height = window.innerHeight;
  let shapeTexture = app.loader.resources["shape"].texture;

  for (let x = 0; x <= width + 300; x += 120) {
    let circle = new PIXI.Sprite(shapeTexture);
    circle.x = 0;
    circle.y = x;
    circle.scale.set(0.05);
    app.stage.addChild(circle);

    gsap.to(circle, {
      x: width,
      rotation: 10,
      ease: "ease-in",
      repeat: -1,
      duration: 3,
      yoyo: true,
    });
  }

  for (let x = -350; x <= width + 300; x += 50) {
    for (let y = -350; y <= height + 300; y += 50) {
      let circle = new PIXI.Graphics();
      circle.lineStyle(2, 0xffffff);
      circle.drawCircle(x + 10, y + 100, 10);
      app.stage.addChild(circle);

      gsap.to(circle, {
        rotation: -Math.cos(y + x / 2),
        repeat: -1,
        duration: 2,
        yoyo: true,
      });
    }
  }

  for (let x = -150; x <= width + 100; x += 50) {
    for (let y = -150; y <= height + 100; y += 100) {
      let rect = new PIXI.Graphics();
      rect.lineStyle(2, 0xffffff);
      rect.drawRect(x, y, 100, 10);
      app.stage.addChild(rect);

      gsap.to(rect, {
        rotation: -Math.cos(y + x / 2),
        repeat: -1,
        duration: 2,
        yoyo: true,
      });
    }
  }

  document.body.appendChild(app.view);
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {}

main();
