export {};

let myString = "Hello, TypeScript";

let x: number = 10;

let phrase = "this is a string";

let isRaining: boolean;
isRaining = false;

let arr: number[] = [];
arr.push(5);
// arr.push(false);

interface myInterface {
  a: number;
  b: string;
}

let obj: myInterface = {
  a: 10,
  b: "Michelle",
};

let tup: [number, string] = [10, "michelle"];

// function combine(a: number | string, b: number | string): number | string {
//   if (typeof a === Number && typeof b === Number) {
//     return a + b;
//   }
// }

// function combineStr(a: string, b: string): string {
//   return a + b;
// }

// const result = combine(10, 2);

enum USCoin {
  penny = 0.01,
  nickle = 0.05,
  dime = 0.1,
  quarter = 0.25,
}

let myLuckyPenny = USCoin.penny;

// interface declarations are a way of naming object types
// interface Point {
//   x: number;
//   y: number;
// }

// class Point3D {
//   x: number;
//   y: number;
//   z: number;
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//     this.z = 0;
//   }
// }

function plotPoint(point: Point) {
  console.log(`x: ${point.x}, y: ${point.y}`);
}

// let myPoint = new Point3D(100, 100);
// plotPoint(myPoint);

interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// union type
type GenericPoint = Point2D | Point3D;

let myPoint: GenericPoint = {
  x: 100,
  y: 100,
  z: 0,
};

console.log(myPoint);
