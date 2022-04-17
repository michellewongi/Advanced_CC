# Week 2: Iterative Pattern

Creating an iterative pattern using Pixi.js.

Here is a snippet of my code that I am proud of:

```typescript
for (let y = 50; y < window.innerHeight - 50; y += 120) {
  for (let x = 72; x < window.innerWidth - 130; x += 200) {
    draw.lineStyle(4, 0x72bab6);
    draw.beginFill(0xffffaa, 1);
    draw.drawRoundedRect(x, y, 95, 95, 35);
    draw.endFill();
  }
}
```
