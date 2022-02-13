"use strict";
exports.__esModule = true;
var myString = "Hello, TypeScript";
var x = 10;
var phrase = "this is a string";
var isRaining;
isRaining = false;
var arr = [];
arr.push(5);
var obj = {
    a: 10,
    b: "Michelle"
};
var tup = [10, "michelle"];
function combine(a, b) {
    return a + b;
}
var result = combine(10, 2);
var USCoin;
(function (USCoin) {
    USCoin[USCoin["penny"] = 0.01] = "penny";
    USCoin[USCoin["nickle"] = 0.05] = "nickle";
    USCoin[USCoin["dime"] = 0.1] = "dime";
    USCoin[USCoin["quarter"] = 0.25] = "quarter";
})(USCoin || (USCoin = {}));
var myLuckyPenny = USCoin.penny;
var Point2D = /** @class */ (function () {
    function Point2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point2D;
}());
function plotPoint(point) {
    console.log("x: ".concat(point.x, ", y: ").concat(point.y));
}
var myPoint = new Point2D(100, 100);
plotPoint(myPoint);
console.log(myLuckyPenny);
