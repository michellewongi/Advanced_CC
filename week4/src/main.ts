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

  for (let x = -300; x <= width + 300; x += 100) {
    let circle = new PIXI.Sprite(shapeTexture);
    circle.scale.set(0.15);
    app.stage.addChild(circle);

    gsap.to(circle, {
      rotation: -Math.cos(x),
      duration: 2,
      x: x,
      y: height / 2 - 100,
      repeat: -1,
      ease: "power2.out",
      yoyo: true,
    });
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

  // previous attempt
  // let circle = new PIXI.Graphics();
  // circle.beginFill(0xff7f01);
  // circle.drawCircle(50, 0, 15);
  // app.stage.addChild(circle);

  // gsap.to(circle, {
  //   duration: 3,
  //   y: height + 150,
  //   repeat: -1,
  // });

  // let circle2 = new PIXI.Graphics();
  // circle2.beginFill(0xff7f01);
  // circle2.drawCircle(150, 0, 15);
  // app.stage.addChild(circle2);

  // gsap.to(circle2, {
  //   duration: 3,
  //   delay: 0.2,
  //   y: height + 150,
  //   repeat: -1,
  // });

  // let circle3 = new PIXI.Graphics();
  // circle3.beginFill(0xff7f01);
  // circle3.drawCircle(250, 0, 15);
  // app.stage.addChild(circle3);

  // gsap.to(circle3, {
  //   duration: 3,
  //   delay: 0.4,
  //   y: height + 150,
  //   repeat: -1,
  // });

  // let circle4 = new PIXI.Graphics();
  // circle4.beginFill(0xff7f01);
  // circle4.drawCircle(350, 0, 15);
  // app.stage.addChild(circle4);

  // gsap.to(circle4, {
  //   duration: 3,
  //   delay: 0.6,
  //   y: height + 150,
  //   repeat: -1,
  // });

  document.body.appendChild(app.view);
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {}

main();
