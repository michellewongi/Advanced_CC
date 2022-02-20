# Week 4 Process

Creating a wave animation

```typescript
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
```
