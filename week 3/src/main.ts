import * as PIXI from "pixi.js";

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader
      .add("dog", "assets/dog.png")
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

  // draw frame for calender
  const frame = new PIXI.Graphics();
  frame.beginFill(0xffffff);
  frame.drawRect(
    window.innerWidth / 2 - 300,
    window.innerHeight / 2 - 30,
    600,
    60
  );
  app.stage.addChild(frame);

  // square representing seconds passed
  const square = new PIXI.Graphics();
  square.beginFill(0x00aaaa);
  square.drawRect(
    window.innerWidth / 2 - 300,
    window.innerHeight / 2 - 30,
    10,
    10
  );
  app.stage.addChild(square);

  // container for dog sprites
  const dogContainer = new PIXI.Container();
  app.stage.addChild(dogContainer);

  const catContainer = new PIXI.Container();
  app.stage.addChild(catContainer);

  // function to add a dog sprite to dogContainer
  function addDog() {
    const dog = PIXI.Sprite.from("assets/dog.png");
    dog.scale.set(0.4);
    dog.position.x = Math.random() * window.innerWidth;
    dog.position.y = Math.random() * window.innerHeight;
    dog.anchor.set(0.5);
    dogContainer.addChild(dog);
  }

  // function to add a cat sprite to window
  function addCat() {
    const cat = PIXI.Sprite.from("assets/cat.png");
    cat.scale.set(0.5);
    cat.position.x = Math.random() * window.innerWidth;
    cat.position.y = Math.random() * window.innerHeight;
    cat.anchor.set(0.5);
    catContainer.addChild(cat);

    // every hour refreshes
    if (catContainer.children.length >= 60) {
      catContainer.removeChildren();
    }
  }

  // timer for callback function
  app.ticker.add(() => {
    if (square.x === 590 && square.y < 60) {
      addDog();
      square.x = 0;
      square.y += 10;
    } else if (square.y < 60 && square.x < 590) {
      square.x += 1;
    } else if (square.y === 60) {
      square.y = 0;
      dogContainer.removeChildren();
      addCat();
    }
  });
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {}

main();
