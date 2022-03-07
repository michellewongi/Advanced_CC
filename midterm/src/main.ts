import * as PIXI from "pixi.js";
import gsap from "gsap";
import { GlitchFilter } from "@pixi/filter-glitch";

let wavesCon = new PIXI.Container();
let cloudsCon = new PIXI.Container();
let moonCon = new PIXI.Container();
let frameCon = new PIXI.Container();
let bgCon = new PIXI.Container();
let width = window.innerWidth;
let height = window.innerHeight;

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader
      .add("filter", "assets/filter.png")
      .add("moon", "assets/moon.png")
      .add("cloud", "assets/cloud.png")
      .add("bg", "assets/bg.jpg")
      .add("bg2", "assets/bg2.jpg")
      .add("sun", "assets/sun.png")
      .add("frame", "assets/frame.png")
      .load(() => {
        resolve();
      });
  });
};

const main = async () => {
  // Actual app
  let app = new PIXI.Application({
    antialias: true,
  });
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

  scene();
  app.stage.addChild(bgCon);
  app.stage.addChild(moonCon);
  app.stage.addChild(cloudsCon);
  app.stage.addChild(wavesCon);
  app.stage.addChild(frameCon);

  // scene one
  function scene() {
    // add frames
    const frame = PIXI.Sprite.from("assets/frame.png");
    frame.scale.set(0.6);
    frame.anchor.set(0.5);
    frame.x = width / 2;
    frame.y = height / 2;

    const shot = new PIXI.Graphics();
    shot.beginFill(0x000000);
    shot.drawCircle(0, 0, 130);
    frameCon.addChild(shot);
    app.stage.interactive = true;
    app.stage.mask = shot;
    app.stage.on("pointermove", moveFrame);
    app.stage.on("pointerdown", switchFrames);

    // function for switching view frames
    function switchFrames() {
      if (frameCon.children.includes(shot)) {
        frameCon.removeChild(shot);
        frameCon.addChild(frame);
        moonCon.removeChild(sun);
        moonCon.addChild(moon);
        bgCon.removeChild(bg2);
        bgCon.addChild(bg);
        app.stage.mask = null;
      } else {
        frameCon.removeChild(frame);
        frameCon.addChild(shot);
        moonCon.removeChild(moon);
        moonCon.addChild(sun);
        bgCon.removeChild(bg);
        bgCon.addChild(bg2);
        app.stage.mask = shot;
      }
    }

    // function to move frame with mouse
    function moveFrame(e: any) {
      let pos = e.data.global;
      shot.x = pos.x;
      shot.y = pos.y;
      frame.x = pos.x;
      frame.y = pos.y;
    }

    // add background
    const bg = PIXI.Sprite.from("assets/bg.jpg");
    bg.anchor.set(0.5);
    bg.position.set(app.screen.width / 2, app.screen.height / 2);
    bg.scale.set(0.3);

    const bg2 = PIXI.Sprite.from("assets/bg2.jpg");
    bg2.anchor.set(0.5);
    bg2.position.set(app.screen.width / 2, app.screen.height / 2);
    bg2.scale.set(2);
    bgCon.addChild(bg2);

    // add filters
    const filterTexture = PIXI.Sprite.from("assets/filter.png");
    moonCon.addChild(filterTexture);
    filterTexture.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacement = new PIXI.filters.DisplacementFilter(filterTexture);
    const glitch = new GlitchFilter();
    glitch.slices = 30;
    glitch.fillMode = 1;
    moonCon.filters = [glitch];

    // timer for displacement filter
    app.ticker.add(function () {
      filterTexture.x += 3;
      filterTexture.y += 3;
    });

    // add moon and sun
    let moon = PIXI.Sprite.from("assets/moon.png");
    moon.scale.set(0.3);
    moon.x = width / 2 - 300;
    moon.y = height / 2 + 500;
    moon.interactive = true;
    moon.on("pointerover", function () {
      glitch.refresh();
    });

    let sun = PIXI.Sprite.from("assets/sun.png");
    sun.scale.set(0.06);
    sun.x = width / 2 - 250;
    sun.y = height / 2 + 500;
    sun.interactive = true;
    sun.on("pointerover", function () {
      glitch.refresh();
    });
    moonCon.addChild(sun);

    gsap.to(moon, {
      y: 140,
      duration: 4,
    });

    gsap.to(sun, {
      y: 200,
      duration: 4,
    });

    // add clouds
    let cloud = PIXI.Sprite.from("assets/cloud.png");
    cloud.scale.set(0.2);
    cloud.x = width / 2 - 720;
    cloud.y = 130;
    cloudsCon.addChild(cloud);

    let cloud2 = PIXI.Sprite.from("assets/cloud.png");
    cloud2.scale.set(0.2);
    cloud2.x = width / 2 - 180;
    cloud2.y = 100;
    cloudsCon.addChild(cloud2);

    let cloud3 = PIXI.Sprite.from("assets/cloud.png");
    cloud3.scale.set(0.2);
    cloud3.x = width / 2 - 450;
    cloud3.y = 10;
    cloudsCon.addChild(cloud3);

    let cloud4 = PIXI.Sprite.from("assets/cloud.png");
    cloud4.scale.set(0.2);
    cloud4.x = width / 2 + 200;
    cloud4.y = 20;
    cloudsCon.addChild(cloud4);

    let cloud5 = PIXI.Sprite.from("assets/cloud.png");
    cloud5.scale.set(0.2);
    cloud5.x = width / 2 + 400;
    cloud5.y = 120;
    cloudsCon.addChild(cloud5);
    cloudsCon.filters = [displacement];

    // add waves
    for (let x = 0; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 180, 100);
      wave.drawCircle(x, height / 2 + 180, 70);
      wave.drawCircle(x, height / 2 + 180, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
      });
    }

    for (let x = 50; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 250, 100);
      wave.drawCircle(x, height / 2 + 250, 70);
      wave.drawCircle(x, height / 2 + 250, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: 1,
      });
    }

    for (let x = 0; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 330, 100);
      wave.drawCircle(x, height / 2 + 330, 70);
      wave.drawCircle(x, height / 2 + 330, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: 2,
      });
    }

    for (let x = 50; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 400, 100);
      wave.drawCircle(x, height / 2 + 400, 70);
      wave.drawCircle(x, height / 2 + 400, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: 1,
      });
    }

    for (let x = 0; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 470, 100);
      wave.drawCircle(x, height / 2 + 470, 70);
      wave.drawCircle(x, height / 2 + 470, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: 2,
      });
    }

    for (let x = 50; x < width + 200; x += 200) {
      let wave = new PIXI.Graphics();
      wave.lineStyle(6, 0xffffff);
      wave.beginFill(0x2c4b8d);
      wave.drawCircle(x, height / 2 + 540, 100);
      wave.drawCircle(x, height / 2 + 540, 70);
      wave.drawCircle(x, height / 2 + 540, 40);
      wavesCon.addChild(wave);

      gsap.to(wave, {
        y: -20,
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: 1,
      });
    }
  }

  document.body.appendChild(app.view);

  let context = {};

  app.ticker.add(update, context);
};

function update(this: any, delta: number) {}

main();
