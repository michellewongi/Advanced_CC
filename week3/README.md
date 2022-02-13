# Week 3 process

Creating an abstract clock

```typescript
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
  dogContainer.addChild(dog);
}
```
