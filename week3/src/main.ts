import * as PIXI from "pixi.js";

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader
      .add("dog", "assets/dog.png")
      .add("cat", "assets/cat.png")
      .add("shader", "assets/shader.frag")
      .load(() => {
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

  document.body.appendChild(app.view);

  let hour = new Date().getHours();

  function addDog() {
    const dog = PIXI.Sprite.from("assets/dog.png");
    dog.interactive = true;
    dog.buttonMode = true;
    // event listeners
    dog.on("pointerover", function () {
      dog.scale.set(1);
    });
    dog.on("pointerout", function () {
      dog.scale.set(0.4);
    });
    dog.scale.set(0.4);
    dog.position.x = Math.random() * window.innerWidth;
    dog.position.y = Math.random() * window.innerHeight;
    dog.anchor.set(0.5);
    app.stage.addChild(dog);
  }

  function addCat() {
    const cat = PIXI.Sprite.from("assets/cat.png");
    cat.interactive = true;
    cat.buttonMode = true;

    // event listeners
    cat.on("pointerover", function () {
      cat.scale.set(0.3);
    });
    cat.on("pointerout", function () {
      cat.scale.set(0.5);
    });

    cat.scale.set(0.5);
    cat.position.x = Math.random() * window.innerWidth;
    cat.position.y = Math.random() * window.innerHeight;
    cat.anchor.set(0.5);
    app.stage.addChild(cat);
  }

  if (hour % 2 === 0) {
    for (let x = 0; x < window.innerWidth + 100; x += 60) {
      for (let y = 0; y < window.innerHeight + 100; y += 100) {
        const line = new PIXI.Graphics();
        line.lineStyle(3, 0xffffff);
        line.moveTo(x, y);
        line.lineTo(window.innerWidth, x);
        app.stage.addChild(line);
      }
    }

    if (hour === 2 || hour === 14) {
      addDog();
      addDog();
    } else if (hour === 4 || hour === 16) {
      addDog();
      addDog();
      addDog();
      addDog();
    } else if (hour === 6 || hour === 18) {
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
    } else if (hour === 8 || hour === 10) {
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
    } else if (hour === 10 || hour === 22) {
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
    } else {
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
      addDog();
    }
  } else {
    // draw loops of circles in the background
    for (let x = 20; x < window.innerWidth; x += 30) {
      const circle = new PIXI.Graphics();
      circle.lineStyle(10, 0xffffff);
      circle.drawCircle(x, x, x * 1.5);
      app.stage.addChild(circle);
    }
    if (hour === 1 || hour === 13) {
      addCat();
    } else if (hour === 3 || hour === 15) {
      addCat();
      addCat();
      addCat();
    } else if (hour === 5 || hour === 17) {
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
    } else if (hour === 7 || hour === 19) {
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
    } else if (hour === 9 || hour === 21) {
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
    } else {
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
      addCat();
    }
  }
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {}

main();
