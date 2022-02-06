function oh(t) {
  var r = this.constructor;
  return this.then(
    function (e) {
      return r.resolve(t()).then(function () {
        return e;
      });
    },
    function (e) {
      return r.resolve(t()).then(function () {
        return r.reject(e);
      });
    }
  );
}
function hh(t) {
  var r = this;
  return new r(function (e, i) {
    if (!(t && typeof t.length != "undefined"))
      return i(
        new TypeError(
          typeof t +
            " " +
            t +
            " is not iterable(cannot read property Symbol(Symbol.iterator))"
        )
      );
    var n = Array.prototype.slice.call(t);
    if (n.length === 0) return e([]);
    var s = n.length;
    function a(h, u) {
      if (u && (typeof u == "object" || typeof u == "function")) {
        var f = u.then;
        if (typeof f == "function") {
          f.call(
            u,
            function (c) {
              a(h, c);
            },
            function (c) {
              (n[h] = { status: "rejected", reason: c }), --s == 0 && e(n);
            }
          );
          return;
        }
      }
      (n[h] = { status: "fulfilled", value: u }), --s == 0 && e(n);
    }
    for (var o = 0; o < n.length; o++) a(o, n[o]);
  });
}
var uh = setTimeout,
  An = typeof setImmediate != "undefined" ? setImmediate : null;
function Nn(t) {
  return Boolean(t && typeof t.length != "undefined");
}
function fh() {}
function lh(t, r) {
  return function () {
    t.apply(r, arguments);
  };
}
function nt(t) {
  if (!(this instanceof nt))
    throw new TypeError("Promises must be constructed via new");
  if (typeof t != "function") throw new TypeError("not a function");
  (this._state = 0),
    (this._handled = !1),
    (this._value = void 0),
    (this._deferreds = []),
    Sn(t, this);
}
function On(t, r) {
  for (; t._state === 3; ) t = t._value;
  if (t._state === 0) {
    t._deferreds.push(r);
    return;
  }
  (t._handled = !0),
    nt._immediateFn(function () {
      var e = t._state === 1 ? r.onFulfilled : r.onRejected;
      if (e === null) {
        (t._state === 1 ? Vr : Oe)(r.promise, t._value);
        return;
      }
      var i;
      try {
        i = e(t._value);
      } catch (n) {
        Oe(r.promise, n);
        return;
      }
      Vr(r.promise, i);
    });
}
function Vr(t, r) {
  try {
    if (r === t)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (r && (typeof r == "object" || typeof r == "function")) {
      var e = r.then;
      if (r instanceof nt) {
        (t._state = 3), (t._value = r), jr(t);
        return;
      } else if (typeof e == "function") {
        Sn(lh(e, r), t);
        return;
      }
    }
    (t._state = 1), (t._value = r), jr(t);
  } catch (i) {
    Oe(t, i);
  }
}
function Oe(t, r) {
  (t._state = 2), (t._value = r), jr(t);
}
function jr(t) {
  t._state === 2 &&
    t._deferreds.length === 0 &&
    nt._immediateFn(function () {
      t._handled || nt._unhandledRejectionFn(t._value);
    });
  for (var r = 0, e = t._deferreds.length; r < e; r++) On(t, t._deferreds[r]);
  t._deferreds = null;
}
function ch(t, r, e) {
  (this.onFulfilled = typeof t == "function" ? t : null),
    (this.onRejected = typeof r == "function" ? r : null),
    (this.promise = e);
}
function Sn(t, r) {
  var e = !1;
  try {
    t(
      function (i) {
        e || ((e = !0), Vr(r, i));
      },
      function (i) {
        e || ((e = !0), Oe(r, i));
      }
    );
  } catch (i) {
    if (e) return;
    (e = !0), Oe(r, i);
  }
}
nt.prototype.catch = function (t) {
  return this.then(null, t);
};
nt.prototype.then = function (t, r) {
  var e = new this.constructor(fh);
  return On(this, new ch(t, r, e)), e;
};
nt.prototype.finally = oh;
nt.all = function (t) {
  return new nt(function (r, e) {
    if (!Nn(t)) return e(new TypeError("Promise.all accepts an array"));
    var i = Array.prototype.slice.call(t);
    if (i.length === 0) return r([]);
    var n = i.length;
    function s(o, h) {
      try {
        if (h && (typeof h == "object" || typeof h == "function")) {
          var u = h.then;
          if (typeof u == "function") {
            u.call(
              h,
              function (f) {
                s(o, f);
              },
              e
            );
            return;
          }
        }
        (i[o] = h), --n == 0 && r(i);
      } catch (f) {
        e(f);
      }
    }
    for (var a = 0; a < i.length; a++) s(a, i[a]);
  });
};
nt.allSettled = hh;
nt.resolve = function (t) {
  return t && typeof t == "object" && t.constructor === nt
    ? t
    : new nt(function (r) {
        r(t);
      });
};
nt.reject = function (t) {
  return new nt(function (r, e) {
    e(t);
  });
};
nt.race = function (t) {
  return new nt(function (r, e) {
    if (!Nn(t)) return e(new TypeError("Promise.race accepts an array"));
    for (var i = 0, n = t.length; i < n; i++) nt.resolve(t[i]).then(r, e);
  });
};
nt._immediateFn =
  (typeof An == "function" &&
    function (t) {
      An(t);
    }) ||
  function (t) {
    uh(t, 0);
  };
nt._unhandledRejectionFn = function (r) {
  typeof console != "undefined" &&
    console &&
    console.warn("Possible Unhandled Promise Rejection:", r);
};
var zr =
  typeof globalThis != "undefined"
    ? globalThis
    : typeof window != "undefined"
    ? window
    : typeof global != "undefined"
    ? global
    : typeof self != "undefined"
    ? self
    : {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var Un = Object.getOwnPropertySymbols,
  dh = Object.prototype.hasOwnProperty,
  ph = Object.prototype.propertyIsEnumerable;
function vh(t) {
  if (t == null)
    throw new TypeError(
      "Object.assign cannot be called with null or undefined"
    );
  return Object(t);
}
function _h() {
  try {
    if (!Object.assign) return !1;
    var t = new String("abc");
    if (((t[5] = "de"), Object.getOwnPropertyNames(t)[0] === "5")) return !1;
    for (var r = {}, e = 0; e < 10; e++) r["_" + String.fromCharCode(e)] = e;
    var i = Object.getOwnPropertyNames(r).map(function (s) {
      return r[s];
    });
    if (i.join("") !== "0123456789") return !1;
    var n = {};
    return (
      "abcdefghijklmnopqrst".split("").forEach(function (s) {
        n[s] = s;
      }),
      Object.keys(Object.assign({}, n)).join("") === "abcdefghijklmnopqrst"
    );
  } catch {
    return !1;
  }
}
var mh = _h()
  ? Object.assign
  : function (t, r) {
      for (var e, i = vh(t), n, s = 1; s < arguments.length; s++) {
        e = Object(arguments[s]);
        for (var a in e) dh.call(e, a) && (i[a] = e[a]);
        if (Un) {
          n = Un(e);
          for (var o = 0; o < n.length; o++)
            ph.call(e, n[o]) && (i[n[o]] = e[n[o]]);
        }
      }
      return i;
    };
/*!
 * @pixi/polyfill - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/polyfill is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ self.Promise || (self.Promise = nt);
Object.assign || (Object.assign = mh);
var yh = 16;
(Date.now && Date.prototype.getTime) ||
  (Date.now = function () {
    return new Date().getTime();
  });
if (!(self.performance && self.performance.now)) {
  var gh = Date.now();
  self.performance || (self.performance = {}),
    (self.performance.now = function () {
      return Date.now() - gh;
    });
}
var Wr = Date.now(),
  Fn = ["ms", "moz", "webkit", "o"];
for (var Yr = 0; Yr < Fn.length && !self.requestAnimationFrame; ++Yr) {
  var $r = Fn[Yr];
  (self.requestAnimationFrame = self[$r + "RequestAnimationFrame"]),
    (self.cancelAnimationFrame =
      self[$r + "CancelAnimationFrame"] ||
      self[$r + "CancelRequestAnimationFrame"]);
}
self.requestAnimationFrame ||
  (self.requestAnimationFrame = function (t) {
    if (typeof t != "function") throw new TypeError(t + "is not a function");
    var r = Date.now(),
      e = yh + Wr - r;
    return (
      e < 0 && (e = 0),
      (Wr = r),
      self.setTimeout(function () {
        (Wr = Date.now()), t(performance.now());
      }, e)
    );
  });
self.cancelAnimationFrame ||
  (self.cancelAnimationFrame = function (t) {
    return clearTimeout(t);
  });
Math.sign ||
  (Math.sign = function (r) {
    return (r = Number(r)), r === 0 || isNaN(r) ? r : r > 0 ? 1 : -1;
  });
Number.isInteger ||
  (Number.isInteger = function (r) {
    return typeof r == "number" && isFinite(r) && Math.floor(r) === r;
  });
self.ArrayBuffer || (self.ArrayBuffer = Array);
self.Float32Array || (self.Float32Array = Array);
self.Uint32Array || (self.Uint32Array = Array);
self.Uint16Array || (self.Uint16Array = Array);
self.Uint8Array || (self.Uint8Array = Array);
self.Int32Array || (self.Int32Array = Array);
var qr = /iPhone/i,
  Ln = /iPod/i,
  Gn = /iPad/i,
  Bn = /\biOS-universal(?:.+)Mac\b/i,
  Zr = /\bAndroid(?:.+)Mobile\b/i,
  Mn = /Android/i,
  pe = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,
  nr = /Silk/i,
  Gt = /Windows Phone/i,
  Dn = /\bWindows(?:.+)ARM\b/i,
  kn = /BlackBerry/i,
  Xn = /BB10/i,
  Hn = /Opera Mini/i,
  Vn = /\b(CriOS|Chrome)(?:.+)Mobile/i,
  jn = /Mobile(?:.+)Firefox\b/i,
  zn = function (t) {
    return (
      typeof t != "undefined" &&
      t.platform === "MacIntel" &&
      typeof t.maxTouchPoints == "number" &&
      t.maxTouchPoints > 1 &&
      typeof MSStream == "undefined"
    );
  };
function xh(t) {
  return function (r) {
    return r.test(t);
  };
}
function Th(t) {
  var r = { userAgent: "", platform: "", maxTouchPoints: 0 };
  !t && typeof navigator != "undefined"
    ? (r = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0,
      })
    : typeof t == "string"
    ? (r.userAgent = t)
    : t &&
      t.userAgent &&
      (r = {
        userAgent: t.userAgent,
        platform: t.platform,
        maxTouchPoints: t.maxTouchPoints || 0,
      });
  var e = r.userAgent,
    i = e.split("[FBAN");
  typeof i[1] != "undefined" && (e = i[0]),
    (i = e.split("Twitter")),
    typeof i[1] != "undefined" && (e = i[0]);
  var n = xh(e),
    s = {
      apple: {
        phone: n(qr) && !n(Gt),
        ipod: n(Ln),
        tablet: !n(qr) && (n(Gn) || zn(r)) && !n(Gt),
        universal: n(Bn),
        device: (n(qr) || n(Ln) || n(Gn) || n(Bn) || zn(r)) && !n(Gt),
      },
      amazon: { phone: n(pe), tablet: !n(pe) && n(nr), device: n(pe) || n(nr) },
      android: {
        phone: (!n(Gt) && n(pe)) || (!n(Gt) && n(Zr)),
        tablet: !n(Gt) && !n(pe) && !n(Zr) && (n(nr) || n(Mn)),
        device:
          (!n(Gt) && (n(pe) || n(nr) || n(Zr) || n(Mn))) || n(/\bokhttp\b/i),
      },
      windows: { phone: n(Gt), tablet: n(Dn), device: n(Gt) || n(Dn) },
      other: {
        blackberry: n(kn),
        blackberry10: n(Xn),
        opera: n(Hn),
        firefox: n(jn),
        chrome: n(Vn),
        device: n(kn) || n(Xn) || n(Hn) || n(jn) || n(Vn),
      },
      any: !1,
      phone: !1,
      tablet: !1,
    };
  return (
    (s.any =
      s.apple.device || s.android.device || s.windows.device || s.other.device),
    (s.phone = s.apple.phone || s.android.phone || s.windows.phone),
    (s.tablet = s.apple.tablet || s.android.tablet || s.windows.tablet),
    s
  );
}
/*!
 * @pixi/settings - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var At = Th(self.navigator);
function bh(t) {
  var r = !0;
  if (At.tablet || At.phone) {
    if (At.apple.device) {
      var e = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      if (e) {
        var i = parseInt(e[1], 10);
        i < 11 && (r = !1);
      }
    }
    if (At.android.device) {
      var e = navigator.userAgent.match(/Android\s([0-9.]*)/);
      if (e) {
        var i = parseInt(e[1], 10);
        i < 7 && (r = !1);
      }
    }
  }
  return r ? t : 4;
}
function Eh() {
  return !At.apple.device;
}
/*!
 * @pixi/constants - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Wn;
(function (t) {
  (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.WEBGL2 = 2)] = "WEBGL2");
})(Wn || (Wn = {}));
var Yn;
(function (t) {
  (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.CANVAS = 2)] = "CANVAS");
})(Yn || (Yn = {}));
var $n;
(function (t) {
  (t[(t.COLOR = 16384)] = "COLOR"),
    (t[(t.DEPTH = 256)] = "DEPTH"),
    (t[(t.STENCIL = 1024)] = "STENCIL");
})($n || ($n = {}));
var qn;
(function (t) {
  (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.ADD = 1)] = "ADD"),
    (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
    (t[(t.SCREEN = 3)] = "SCREEN"),
    (t[(t.OVERLAY = 4)] = "OVERLAY"),
    (t[(t.DARKEN = 5)] = "DARKEN"),
    (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
    (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
    (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
    (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
    (t[(t.HUE = 13)] = "HUE"),
    (t[(t.SATURATION = 14)] = "SATURATION"),
    (t[(t.COLOR = 15)] = "COLOR"),
    (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
    (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
    (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (t[(t.NONE = 20)] = "NONE"),
    (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
    (t[(t.SRC_IN = 21)] = "SRC_IN"),
    (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
    (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
    (t[(t.DST_OVER = 24)] = "DST_OVER"),
    (t[(t.DST_IN = 25)] = "DST_IN"),
    (t[(t.DST_OUT = 26)] = "DST_OUT"),
    (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
    (t[(t.ERASE = 26)] = "ERASE"),
    (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
    (t[(t.XOR = 29)] = "XOR");
})(qn || (qn = {}));
var Zn;
(function (t) {
  (t[(t.POINTS = 0)] = "POINTS"),
    (t[(t.LINES = 1)] = "LINES"),
    (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
    (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
    (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
    (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
})(Zn || (Zn = {}));
var Kn;
(function (t) {
  (t[(t.RGBA = 6408)] = "RGBA"),
    (t[(t.RGB = 6407)] = "RGB"),
    (t[(t.RG = 33319)] = "RG"),
    (t[(t.RED = 6403)] = "RED"),
    (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (t[(t.ALPHA = 6406)] = "ALPHA"),
    (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
    (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
})(Kn || (Kn = {}));
var Jn;
(function (t) {
  (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z");
})(Jn || (Jn = {}));
var Qn;
(function (t) {
  (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (t[(t.BYTE = 5120)] = "BYTE"),
    (t[(t.SHORT = 5122)] = "SHORT"),
    (t[(t.INT = 5124)] = "INT"),
    (t[(t.FLOAT = 5126)] = "FLOAT"),
    (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
})(Qn || (Qn = {}));
var ts;
(function (t) {
  (t[(t.FLOAT = 0)] = "FLOAT"),
    (t[(t.INT = 1)] = "INT"),
    (t[(t.UINT = 2)] = "UINT");
})(ts || (ts = {}));
var Kr;
(function (t) {
  (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
})(Kr || (Kr = {}));
var Jr;
(function (t) {
  (t[(t.CLAMP = 33071)] = "CLAMP"),
    (t[(t.REPEAT = 10497)] = "REPEAT"),
    (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
})(Jr || (Jr = {}));
var Qr;
(function (t) {
  (t[(t.OFF = 0)] = "OFF"),
    (t[(t.POW2 = 1)] = "POW2"),
    (t[(t.ON = 2)] = "ON"),
    (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
})(Qr || (Qr = {}));
var es;
(function (t) {
  (t[(t.NPM = 0)] = "NPM"),
    (t[(t.UNPACK = 1)] = "UNPACK"),
    (t[(t.PMA = 2)] = "PMA"),
    (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
})(es || (es = {}));
var rs;
(function (t) {
  (t[(t.NO = 0)] = "NO"),
    (t[(t.YES = 1)] = "YES"),
    (t[(t.AUTO = 2)] = "AUTO"),
    (t[(t.BLEND = 0)] = "BLEND"),
    (t[(t.CLEAR = 1)] = "CLEAR"),
    (t[(t.BLIT = 2)] = "BLIT");
})(rs || (rs = {}));
var ti;
(function (t) {
  (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
})(ti || (ti = {}));
var Se;
(function (t) {
  (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
})(Se || (Se = {}));
var is;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.SCISSOR = 1)] = "SCISSOR"),
    (t[(t.STENCIL = 2)] = "STENCIL"),
    (t[(t.SPRITE = 3)] = "SPRITE");
})(is || (is = {}));
var ei;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LOW = 2)] = "LOW"),
    (t[(t.MEDIUM = 4)] = "MEDIUM"),
    (t[(t.HIGH = 8)] = "HIGH");
})(ei || (ei = {}));
var ns;
(function (t) {
  (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
    (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
})(ns || (ns = {}));
var S = {
    MIPMAP_TEXTURES: Qr.POW2,
    ANISOTROPIC_LEVEL: 0,
    RESOLUTION: 1,
    FILTER_RESOLUTION: 1,
    FILTER_MULTISAMPLE: ei.NONE,
    SPRITE_MAX_TEXTURES: bh(32),
    SPRITE_BATCH_SIZE: 4096,
    RENDER_OPTIONS: {
      view: null,
      antialias: !1,
      autoDensity: !1,
      backgroundColor: 0,
      backgroundAlpha: 1,
      useContextAlpha: !0,
      clearBeforeRender: !0,
      preserveDrawingBuffer: !1,
      width: 800,
      height: 600,
      legacy: !1,
    },
    GC_MODE: ti.AUTO,
    GC_MAX_IDLE: 60 * 60,
    GC_MAX_CHECK_COUNT: 60 * 10,
    WRAP_MODE: Jr.CLAMP,
    SCALE_MODE: Kr.LINEAR,
    PRECISION_VERTEX: Se.HIGH,
    PRECISION_FRAGMENT: At.apple.device ? Se.HIGH : Se.MEDIUM,
    CAN_UPLOAD_SAME_BUFFER: Eh(),
    CREATE_IMAGE_BITMAP: !1,
    ROUND_PIXELS: !1,
  },
  ss = { exports: {} };
(function (t) {
  var r = Object.prototype.hasOwnProperty,
    e = "~";
  function i() {}
  Object.create &&
    ((i.prototype = Object.create(null)), new i().__proto__ || (e = !1));
  function n(h, u, f) {
    (this.fn = h), (this.context = u), (this.once = f || !1);
  }
  function s(h, u, f, c, l) {
    if (typeof f != "function")
      throw new TypeError("The listener must be a function");
    var d = new n(f, c || h, l),
      p = e ? e + u : u;
    return (
      h._events[p]
        ? h._events[p].fn
          ? (h._events[p] = [h._events[p], d])
          : h._events[p].push(d)
        : ((h._events[p] = d), h._eventsCount++),
      h
    );
  }
  function a(h, u) {
    --h._eventsCount == 0 ? (h._events = new i()) : delete h._events[u];
  }
  function o() {
    (this._events = new i()), (this._eventsCount = 0);
  }
  (o.prototype.eventNames = function () {
    var u = [],
      f,
      c;
    if (this._eventsCount === 0) return u;
    for (c in (f = this._events)) r.call(f, c) && u.push(e ? c.slice(1) : c);
    return Object.getOwnPropertySymbols
      ? u.concat(Object.getOwnPropertySymbols(f))
      : u;
  }),
    (o.prototype.listeners = function (u) {
      var f = e ? e + u : u,
        c = this._events[f];
      if (!c) return [];
      if (c.fn) return [c.fn];
      for (var l = 0, d = c.length, p = new Array(d); l < d; l++)
        p[l] = c[l].fn;
      return p;
    }),
    (o.prototype.listenerCount = function (u) {
      var f = e ? e + u : u,
        c = this._events[f];
      return c ? (c.fn ? 1 : c.length) : 0;
    }),
    (o.prototype.emit = function (u, f, c, l, d, p) {
      var _ = e ? e + u : u;
      if (!this._events[_]) return !1;
      var v = this._events[_],
        m = arguments.length,
        g,
        T;
      if (v.fn) {
        switch ((v.once && this.removeListener(u, v.fn, void 0, !0), m)) {
          case 1:
            return v.fn.call(v.context), !0;
          case 2:
            return v.fn.call(v.context, f), !0;
          case 3:
            return v.fn.call(v.context, f, c), !0;
          case 4:
            return v.fn.call(v.context, f, c, l), !0;
          case 5:
            return v.fn.call(v.context, f, c, l, d), !0;
          case 6:
            return v.fn.call(v.context, f, c, l, d, p), !0;
        }
        for (T = 1, g = new Array(m - 1); T < m; T++) g[T - 1] = arguments[T];
        v.fn.apply(v.context, g);
      } else {
        var I = v.length,
          x;
        for (T = 0; T < I; T++)
          switch (
            (v[T].once && this.removeListener(u, v[T].fn, void 0, !0), m)
          ) {
            case 1:
              v[T].fn.call(v[T].context);
              break;
            case 2:
              v[T].fn.call(v[T].context, f);
              break;
            case 3:
              v[T].fn.call(v[T].context, f, c);
              break;
            case 4:
              v[T].fn.call(v[T].context, f, c, l);
              break;
            default:
              if (!g)
                for (x = 1, g = new Array(m - 1); x < m; x++)
                  g[x - 1] = arguments[x];
              v[T].fn.apply(v[T].context, g);
          }
      }
      return !0;
    }),
    (o.prototype.on = function (u, f, c) {
      return s(this, u, f, c, !1);
    }),
    (o.prototype.once = function (u, f, c) {
      return s(this, u, f, c, !0);
    }),
    (o.prototype.removeListener = function (u, f, c, l) {
      var d = e ? e + u : u;
      if (!this._events[d]) return this;
      if (!f) return a(this, d), this;
      var p = this._events[d];
      if (p.fn)
        p.fn === f && (!l || p.once) && (!c || p.context === c) && a(this, d);
      else {
        for (var _ = 0, v = [], m = p.length; _ < m; _++)
          (p[_].fn !== f || (l && !p[_].once) || (c && p[_].context !== c)) &&
            v.push(p[_]);
        v.length ? (this._events[d] = v.length === 1 ? v[0] : v) : a(this, d);
      }
      return this;
    }),
    (o.prototype.removeAllListeners = function (u) {
      var f;
      return (
        u
          ? ((f = e ? e + u : u), this._events[f] && a(this, f))
          : ((this._events = new i()), (this._eventsCount = 0)),
        this
      );
    }),
    (o.prototype.off = o.prototype.removeListener),
    (o.prototype.addListener = o.prototype.on),
    (o.prefixed = e),
    (o.EventEmitter = o),
    (t.exports = o);
})(ss);
var Ue = ss.exports,
  ri = { exports: {} };
ri.exports = sr;
ri.exports.default = sr;
function sr(t, r, e) {
  e = e || 2;
  var i = r && r.length,
    n = i ? r[0] * e : t.length,
    s = as(t, 0, n, e, !0),
    a = [];
  if (!s || s.next === s.prev) return a;
  var o, h, u, f, c, l, d;
  if ((i && (s = Ph(t, r, s, e)), t.length > 80 * e)) {
    (o = u = t[0]), (h = f = t[1]);
    for (var p = e; p < n; p += e)
      (c = t[p]),
        (l = t[p + 1]),
        c < o && (o = c),
        l < h && (h = l),
        c > u && (u = c),
        l > f && (f = l);
    (d = Math.max(u - o, f - h)), (d = d !== 0 ? 1 / d : 0);
  }
  return Fe(s, a, e, o, h, d), a;
}
function as(t, r, e, i, n) {
  var s, a;
  if (n === si(t, r, e, i) > 0)
    for (s = r; s < e; s += i) a = us(s, t[s], t[s + 1], a);
  else for (s = e - i; s >= r; s -= i) a = us(s, t[s], t[s + 1], a);
  return a && ar(a, a.next) && (Ge(a), (a = a.next)), a;
}
function jt(t, r) {
  if (!t) return t;
  r || (r = t);
  var e = t,
    i;
  do
    if (
      ((i = !1), !e.steiner && (ar(e, e.next) || tt(e.prev, e, e.next) === 0))
    ) {
      if ((Ge(e), (e = r = e.prev), e === e.next)) break;
      i = !0;
    } else e = e.next;
  while (i || e !== r);
  return r;
}
function Fe(t, r, e, i, n, s, a) {
  if (!!t) {
    !a && s && Uh(t, i, n, s);
    for (var o = t, h, u; t.prev !== t.next; ) {
      if (((h = t.prev), (u = t.next), s ? Rh(t, i, n, s) : Ih(t))) {
        r.push(h.i / e),
          r.push(t.i / e),
          r.push(u.i / e),
          Ge(t),
          (t = u.next),
          (o = u.next);
        continue;
      }
      if (((t = u), t === o)) {
        a
          ? a === 1
            ? ((t = wh(jt(t), r, e)), Fe(t, r, e, i, n, s, 2))
            : a === 2 && Ch(t, r, e, i, n, s)
          : Fe(jt(t), r, e, i, n, s, 1);
        break;
      }
    }
  }
}
function Ih(t) {
  var r = t.prev,
    e = t,
    i = t.next;
  if (tt(r, e, i) >= 0) return !1;
  for (var n = t.next.next; n !== t.prev; ) {
    if (
      ve(r.x, r.y, e.x, e.y, i.x, i.y, n.x, n.y) &&
      tt(n.prev, n, n.next) >= 0
    )
      return !1;
    n = n.next;
  }
  return !0;
}
function Rh(t, r, e, i) {
  var n = t.prev,
    s = t,
    a = t.next;
  if (tt(n, s, a) >= 0) return !1;
  for (
    var o = n.x < s.x ? (n.x < a.x ? n.x : a.x) : s.x < a.x ? s.x : a.x,
      h = n.y < s.y ? (n.y < a.y ? n.y : a.y) : s.y < a.y ? s.y : a.y,
      u = n.x > s.x ? (n.x > a.x ? n.x : a.x) : s.x > a.x ? s.x : a.x,
      f = n.y > s.y ? (n.y > a.y ? n.y : a.y) : s.y > a.y ? s.y : a.y,
      c = ii(o, h, r, e, i),
      l = ii(u, f, r, e, i),
      d = t.prevZ,
      p = t.nextZ;
    d && d.z >= c && p && p.z <= l;

  ) {
    if (
      (d !== t.prev &&
        d !== t.next &&
        ve(n.x, n.y, s.x, s.y, a.x, a.y, d.x, d.y) &&
        tt(d.prev, d, d.next) >= 0) ||
      ((d = d.prevZ),
      p !== t.prev &&
        p !== t.next &&
        ve(n.x, n.y, s.x, s.y, a.x, a.y, p.x, p.y) &&
        tt(p.prev, p, p.next) >= 0)
    )
      return !1;
    p = p.nextZ;
  }
  for (; d && d.z >= c; ) {
    if (
      d !== t.prev &&
      d !== t.next &&
      ve(n.x, n.y, s.x, s.y, a.x, a.y, d.x, d.y) &&
      tt(d.prev, d, d.next) >= 0
    )
      return !1;
    d = d.prevZ;
  }
  for (; p && p.z <= l; ) {
    if (
      p !== t.prev &&
      p !== t.next &&
      ve(n.x, n.y, s.x, s.y, a.x, a.y, p.x, p.y) &&
      tt(p.prev, p, p.next) >= 0
    )
      return !1;
    p = p.nextZ;
  }
  return !0;
}
function wh(t, r, e) {
  var i = t;
  do {
    var n = i.prev,
      s = i.next.next;
    !ar(n, s) &&
      os(n, i, i.next, s) &&
      Le(n, s) &&
      Le(s, n) &&
      (r.push(n.i / e),
      r.push(i.i / e),
      r.push(s.i / e),
      Ge(i),
      Ge(i.next),
      (i = t = s)),
      (i = i.next);
  } while (i !== t);
  return jt(i);
}
function Ch(t, r, e, i, n, s) {
  var a = t;
  do {
    for (var o = a.next.next; o !== a.prev; ) {
      if (a.i !== o.i && Gh(a, o)) {
        var h = hs(a, o);
        (a = jt(a, a.next)),
          (h = jt(h, h.next)),
          Fe(a, r, e, i, n, s),
          Fe(h, r, e, i, n, s);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== t);
}
function Ph(t, r, e, i) {
  var n = [],
    s,
    a,
    o,
    h,
    u;
  for (s = 0, a = r.length; s < a; s++)
    (o = r[s] * i),
      (h = s < a - 1 ? r[s + 1] * i : t.length),
      (u = as(t, o, h, i, !1)),
      u === u.next && (u.steiner = !0),
      n.push(Lh(u));
  for (n.sort(Ah), s = 0; s < n.length; s++)
    (e = Nh(n[s], e)), (e = jt(e, e.next));
  return e;
}
function Ah(t, r) {
  return t.x - r.x;
}
function Nh(t, r) {
  var e = Oh(t, r);
  if (!e) return r;
  var i = hs(e, t),
    n = jt(e, e.next);
  return jt(i, i.next), r === e ? n : r;
}
function Oh(t, r) {
  var e = r,
    i = t.x,
    n = t.y,
    s = -1 / 0,
    a;
  do {
    if (n <= e.y && n >= e.next.y && e.next.y !== e.y) {
      var o = e.x + ((n - e.y) * (e.next.x - e.x)) / (e.next.y - e.y);
      if (o <= i && o > s) {
        if (((s = o), o === i)) {
          if (n === e.y) return e;
          if (n === e.next.y) return e.next;
        }
        a = e.x < e.next.x ? e : e.next;
      }
    }
    e = e.next;
  } while (e !== r);
  if (!a) return null;
  if (i === s) return a;
  var h = a,
    u = a.x,
    f = a.y,
    c = 1 / 0,
    l;
  e = a;
  do
    i >= e.x &&
      e.x >= u &&
      i !== e.x &&
      ve(n < f ? i : s, n, u, f, n < f ? s : i, n, e.x, e.y) &&
      ((l = Math.abs(n - e.y) / (i - e.x)),
      Le(e, t) &&
        (l < c || (l === c && (e.x > a.x || (e.x === a.x && Sh(a, e))))) &&
        ((a = e), (c = l))),
      (e = e.next);
  while (e !== h);
  return a;
}
function Sh(t, r) {
  return tt(t.prev, t, r.prev) < 0 && tt(r.next, t, t.next) < 0;
}
function Uh(t, r, e, i) {
  var n = t;
  do
    n.z === null && (n.z = ii(n.x, n.y, r, e, i)),
      (n.prevZ = n.prev),
      (n.nextZ = n.next),
      (n = n.next);
  while (n !== t);
  (n.prevZ.nextZ = null), (n.prevZ = null), Fh(n);
}
function Fh(t) {
  var r,
    e,
    i,
    n,
    s,
    a,
    o,
    h,
    u = 1;
  do {
    for (e = t, t = null, s = null, a = 0; e; ) {
      for (a++, i = e, o = 0, r = 0; r < u && (o++, (i = i.nextZ), !!i); r++);
      for (h = u; o > 0 || (h > 0 && i); )
        o !== 0 && (h === 0 || !i || e.z <= i.z)
          ? ((n = e), (e = e.nextZ), o--)
          : ((n = i), (i = i.nextZ), h--),
          s ? (s.nextZ = n) : (t = n),
          (n.prevZ = s),
          (s = n);
      e = i;
    }
    (s.nextZ = null), (u *= 2);
  } while (a > 1);
  return t;
}
function ii(t, r, e, i, n) {
  return (
    (t = 32767 * (t - e) * n),
    (r = 32767 * (r - i) * n),
    (t = (t | (t << 8)) & 16711935),
    (t = (t | (t << 4)) & 252645135),
    (t = (t | (t << 2)) & 858993459),
    (t = (t | (t << 1)) & 1431655765),
    (r = (r | (r << 8)) & 16711935),
    (r = (r | (r << 4)) & 252645135),
    (r = (r | (r << 2)) & 858993459),
    (r = (r | (r << 1)) & 1431655765),
    t | (r << 1)
  );
}
function Lh(t) {
  var r = t,
    e = t;
  do (r.x < e.x || (r.x === e.x && r.y < e.y)) && (e = r), (r = r.next);
  while (r !== t);
  return e;
}
function ve(t, r, e, i, n, s, a, o) {
  return (
    (n - a) * (r - o) - (t - a) * (s - o) >= 0 &&
    (t - a) * (i - o) - (e - a) * (r - o) >= 0 &&
    (e - a) * (s - o) - (n - a) * (i - o) >= 0
  );
}
function Gh(t, r) {
  return (
    t.next.i !== r.i &&
    t.prev.i !== r.i &&
    !Bh(t, r) &&
    ((Le(t, r) &&
      Le(r, t) &&
      Mh(t, r) &&
      (tt(t.prev, t, r.prev) || tt(t, r.prev, r))) ||
      (ar(t, r) && tt(t.prev, t, t.next) > 0 && tt(r.prev, r, r.next) > 0))
  );
}
function tt(t, r, e) {
  return (r.y - t.y) * (e.x - r.x) - (r.x - t.x) * (e.y - r.y);
}
function ar(t, r) {
  return t.x === r.x && t.y === r.y;
}
function os(t, r, e, i) {
  var n = hr(tt(t, r, e)),
    s = hr(tt(t, r, i)),
    a = hr(tt(e, i, t)),
    o = hr(tt(e, i, r));
  return !!(
    (n !== s && a !== o) ||
    (n === 0 && or(t, e, r)) ||
    (s === 0 && or(t, i, r)) ||
    (a === 0 && or(e, t, i)) ||
    (o === 0 && or(e, r, i))
  );
}
function or(t, r, e) {
  return (
    r.x <= Math.max(t.x, e.x) &&
    r.x >= Math.min(t.x, e.x) &&
    r.y <= Math.max(t.y, e.y) &&
    r.y >= Math.min(t.y, e.y)
  );
}
function hr(t) {
  return t > 0 ? 1 : t < 0 ? -1 : 0;
}
function Bh(t, r) {
  var e = t;
  do {
    if (
      e.i !== t.i &&
      e.next.i !== t.i &&
      e.i !== r.i &&
      e.next.i !== r.i &&
      os(e, e.next, t, r)
    )
      return !0;
    e = e.next;
  } while (e !== t);
  return !1;
}
function Le(t, r) {
  return tt(t.prev, t, t.next) < 0
    ? tt(t, r, t.next) >= 0 && tt(t, t.prev, r) >= 0
    : tt(t, r, t.prev) < 0 || tt(t, t.next, r) < 0;
}
function Mh(t, r) {
  var e = t,
    i = !1,
    n = (t.x + r.x) / 2,
    s = (t.y + r.y) / 2;
  do
    e.y > s != e.next.y > s &&
      e.next.y !== e.y &&
      n < ((e.next.x - e.x) * (s - e.y)) / (e.next.y - e.y) + e.x &&
      (i = !i),
      (e = e.next);
  while (e !== t);
  return i;
}
function hs(t, r) {
  var e = new ni(t.i, t.x, t.y),
    i = new ni(r.i, r.x, r.y),
    n = t.next,
    s = r.prev;
  return (
    (t.next = r),
    (r.prev = t),
    (e.next = n),
    (n.prev = e),
    (i.next = e),
    (e.prev = i),
    (s.next = i),
    (i.prev = s),
    i
  );
}
function us(t, r, e, i) {
  var n = new ni(t, r, e);
  return (
    i
      ? ((n.next = i.next), (n.prev = i), (i.next.prev = n), (i.next = n))
      : ((n.prev = n), (n.next = n)),
    n
  );
}
function Ge(t) {
  (t.next.prev = t.prev),
    (t.prev.next = t.next),
    t.prevZ && (t.prevZ.nextZ = t.nextZ),
    t.nextZ && (t.nextZ.prevZ = t.prevZ);
}
function ni(t, r, e) {
  (this.i = t),
    (this.x = r),
    (this.y = e),
    (this.prev = null),
    (this.next = null),
    (this.z = null),
    (this.prevZ = null),
    (this.nextZ = null),
    (this.steiner = !1);
}
sr.deviation = function (t, r, e, i) {
  var n = r && r.length,
    s = n ? r[0] * e : t.length,
    a = Math.abs(si(t, 0, s, e));
  if (n)
    for (var o = 0, h = r.length; o < h; o++) {
      var u = r[o] * e,
        f = o < h - 1 ? r[o + 1] * e : t.length;
      a -= Math.abs(si(t, u, f, e));
    }
  var c = 0;
  for (o = 0; o < i.length; o += 3) {
    var l = i[o] * e,
      d = i[o + 1] * e,
      p = i[o + 2] * e;
    c += Math.abs(
      (t[l] - t[p]) * (t[d + 1] - t[l + 1]) -
        (t[l] - t[d]) * (t[p + 1] - t[l + 1])
    );
  }
  return a === 0 && c === 0 ? 0 : Math.abs((c - a) / a);
};
function si(t, r, e, i) {
  for (var n = 0, s = r, a = e - i; s < e; s += i)
    (n += (t[a] - t[s]) * (t[s + 1] + t[a + 1])), (a = s);
  return n;
}
sr.flatten = function (t) {
  for (
    var r = t[0][0].length,
      e = { vertices: [], holes: [], dimensions: r },
      i = 0,
      n = 0;
    n < t.length;
    n++
  ) {
    for (var s = 0; s < t[n].length; s++)
      for (var a = 0; a < r; a++) e.vertices.push(t[n][s][a]);
    n > 0 && ((i += t[n - 1].length), e.holes.push(i));
  }
  return e;
};
var fs = ri.exports,
  ai = { exports: {} };
/*! https://mths.be/punycode v1.3.2 by @mathias */ (function (t, r) {
  (function (e) {
    var i = r && !r.nodeType && r,
      n = t && !t.nodeType && t,
      s = typeof zr == "object" && zr;
    (s.global === s || s.window === s || s.self === s) && (e = s);
    var a,
      o = 2147483647,
      h = 36,
      u = 1,
      f = 26,
      c = 38,
      l = 700,
      d = 72,
      p = 128,
      _ = "-",
      v = /^xn--/,
      m = /[^\x20-\x7E]/,
      g = /[\x2E\u3002\uFF0E\uFF61]/g,
      T = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input",
      },
      I = h - u,
      x = Math.floor,
      y = String.fromCharCode,
      C;
    function N(E) {
      throw RangeError(T[E]);
    }
    function b(E, L) {
      for (var M = E.length, j = []; M--; ) j[M] = L(E[M]);
      return j;
    }
    function R(E, L) {
      var M = E.split("@"),
        j = "";
      M.length > 1 && ((j = M[0] + "@"), (E = M[1])), (E = E.replace(g, "."));
      var Z = E.split("."),
        rt = b(Z, L).join(".");
      return j + rt;
    }
    function F(E) {
      for (var L = [], M = 0, j = E.length, Z, rt; M < j; )
        (Z = E.charCodeAt(M++)),
          Z >= 55296 && Z <= 56319 && M < j
            ? ((rt = E.charCodeAt(M++)),
              (rt & 64512) == 56320
                ? L.push(((Z & 1023) << 10) + (rt & 1023) + 65536)
                : (L.push(Z), M--))
            : L.push(Z);
      return L;
    }
    function O(E) {
      return b(E, function (L) {
        var M = "";
        return (
          L > 65535 &&
            ((L -= 65536),
            (M += y(((L >>> 10) & 1023) | 55296)),
            (L = 56320 | (L & 1023))),
          (M += y(L)),
          M
        );
      }).join("");
    }
    function k(E) {
      return E - 48 < 10
        ? E - 22
        : E - 65 < 26
        ? E - 65
        : E - 97 < 26
        ? E - 97
        : h;
    }
    function Q(E, L) {
      return E + 22 + 75 * (E < 26) - ((L != 0) << 5);
    }
    function A(E, L, M) {
      var j = 0;
      for (E = M ? x(E / l) : E >> 1, E += x(E / L); E > (I * f) >> 1; j += h)
        E = x(E / I);
      return x(j + ((I + 1) * E) / (E + c));
    }
    function P(E) {
      var L = [],
        M = E.length,
        j,
        Z = 0,
        rt = p,
        $ = d,
        lt,
        vt,
        it,
        at,
        Y,
        J,
        H,
        gt,
        _t;
      for (lt = E.lastIndexOf(_), lt < 0 && (lt = 0), vt = 0; vt < lt; ++vt)
        E.charCodeAt(vt) >= 128 && N("not-basic"), L.push(E.charCodeAt(vt));
      for (it = lt > 0 ? lt + 1 : 0; it < M; ) {
        for (
          at = Z, Y = 1, J = h;
          it >= M && N("invalid-input"),
            (H = k(E.charCodeAt(it++))),
            (H >= h || H > x((o - Z) / Y)) && N("overflow"),
            (Z += H * Y),
            (gt = J <= $ ? u : J >= $ + f ? f : J - $),
            !(H < gt);
          J += h
        )
          (_t = h - gt), Y > x(o / _t) && N("overflow"), (Y *= _t);
        (j = L.length + 1),
          ($ = A(Z - at, j, at == 0)),
          x(Z / j) > o - rt && N("overflow"),
          (rt += x(Z / j)),
          (Z %= j),
          L.splice(Z++, 0, rt);
      }
      return O(L);
    }
    function X(E) {
      var L,
        M,
        j,
        Z,
        rt,
        $,
        lt,
        vt,
        it,
        at,
        Y,
        J = [],
        H,
        gt,
        _t,
        V;
      for (E = F(E), H = E.length, L = p, M = 0, rt = d, $ = 0; $ < H; ++$)
        (Y = E[$]), Y < 128 && J.push(y(Y));
      for (j = Z = J.length, Z && J.push(_); j < H; ) {
        for (lt = o, $ = 0; $ < H; ++$)
          (Y = E[$]), Y >= L && Y < lt && (lt = Y);
        for (
          gt = j + 1,
            lt - L > x((o - M) / gt) && N("overflow"),
            M += (lt - L) * gt,
            L = lt,
            $ = 0;
          $ < H;
          ++$
        )
          if (((Y = E[$]), Y < L && ++M > o && N("overflow"), Y == L)) {
            for (
              vt = M, it = h;
              (at = it <= rt ? u : it >= rt + f ? f : it - rt), !(vt < at);
              it += h
            )
              (V = vt - at),
                (_t = h - at),
                J.push(y(Q(at + (V % _t), 0))),
                (vt = x(V / _t));
            J.push(y(Q(vt, 0))), (rt = A(M, gt, j == Z)), (M = 0), ++j;
          }
        ++M, ++L;
      }
      return J.join("");
    }
    function pt(E) {
      return R(E, function (L) {
        return v.test(L) ? P(L.slice(4).toLowerCase()) : L;
      });
    }
    function yt(E) {
      return R(E, function (L) {
        return m.test(L) ? "xn--" + X(L) : L;
      });
    }
    if (
      ((a = {
        version: "1.3.2",
        ucs2: { decode: F, encode: O },
        decode: P,
        encode: X,
        toASCII: yt,
        toUnicode: pt,
      }),
      i && n)
    )
      if (t.exports == i) n.exports = a;
      else for (C in a) a.hasOwnProperty(C) && (i[C] = a[C]);
    else e.punycode = a;
  })(zr);
})(ai, ai.exports);
var Dh = {
    isString: function (t) {
      return typeof t == "string";
    },
    isObject: function (t) {
      return typeof t == "object" && t !== null;
    },
    isNull: function (t) {
      return t === null;
    },
    isNullOrUndefined: function (t) {
      return t == null;
    },
  },
  Be = {};
function kh(t, r) {
  return Object.prototype.hasOwnProperty.call(t, r);
}
var Xh = function (t, r, e, i) {
    (r = r || "&"), (e = e || "=");
    var n = {};
    if (typeof t != "string" || t.length === 0) return n;
    var s = /\+/g;
    t = t.split(r);
    var a = 1e3;
    i && typeof i.maxKeys == "number" && (a = i.maxKeys);
    var o = t.length;
    a > 0 && o > a && (o = a);
    for (var h = 0; h < o; ++h) {
      var u = t[h].replace(s, "%20"),
        f = u.indexOf(e),
        c,
        l,
        d,
        p;
      f >= 0
        ? ((c = u.substr(0, f)), (l = u.substr(f + 1)))
        : ((c = u), (l = "")),
        (d = decodeURIComponent(c)),
        (p = decodeURIComponent(l)),
        kh(n, d)
          ? Array.isArray(n[d])
            ? n[d].push(p)
            : (n[d] = [n[d], p])
          : (n[d] = p);
    }
    return n;
  },
  Me = function (t) {
    switch (typeof t) {
      case "string":
        return t;
      case "boolean":
        return t ? "true" : "false";
      case "number":
        return isFinite(t) ? t : "";
      default:
        return "";
    }
  },
  Hh = function (t, r, e, i) {
    return (
      (r = r || "&"),
      (e = e || "="),
      t === null && (t = void 0),
      typeof t == "object"
        ? Object.keys(t)
            .map(function (n) {
              var s = encodeURIComponent(Me(n)) + e;
              return Array.isArray(t[n])
                ? t[n]
                    .map(function (a) {
                      return s + encodeURIComponent(Me(a));
                    })
                    .join(r)
                : s + encodeURIComponent(Me(t[n]));
            })
            .join(r)
        : i
        ? encodeURIComponent(Me(i)) + e + encodeURIComponent(Me(t))
        : ""
    );
  };
Be.decode = Be.parse = Xh;
Be.encode = Be.stringify = Hh;
var Vh = ai.exports,
  Nt = Dh,
  jh = ur,
  zh = ru,
  Wh = eu;
function Et() {
  (this.protocol = null),
    (this.slashes = null),
    (this.auth = null),
    (this.host = null),
    (this.port = null),
    (this.hostname = null),
    (this.hash = null),
    (this.search = null),
    (this.query = null),
    (this.pathname = null),
    (this.path = null),
    (this.href = null);
}
var Yh = /^([a-z0-9.+-]+:)/i,
  $h = /:[0-9]*$/,
  qh = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
  Zh = [
    "<",
    ">",
    '"',
    "`",
    " ",
    "\r",
    `
`,
    "	",
  ],
  Kh = ["{", "}", "|", "\\", "^", "`"].concat(Zh),
  oi = ["'"].concat(Kh),
  ls = ["%", "/", "?", ";", "#"].concat(oi),
  cs = ["/", "?", "#"],
  Jh = 255,
  ds = /^[+a-z0-9A-Z_-]{0,63}$/,
  Qh = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  tu = { javascript: !0, "javascript:": !0 },
  hi = { javascript: !0, "javascript:": !0 },
  _e = {
    http: !0,
    https: !0,
    ftp: !0,
    gopher: !0,
    file: !0,
    "http:": !0,
    "https:": !0,
    "ftp:": !0,
    "gopher:": !0,
    "file:": !0,
  },
  ui = Be;
function ur(t, r, e) {
  if (t && Nt.isObject(t) && t instanceof Et) return t;
  var i = new Et();
  return i.parse(t, r, e), i;
}
Et.prototype.parse = function (t, r, e) {
  if (!Nt.isString(t))
    throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
  var i = t.indexOf("?"),
    n = i !== -1 && i < t.indexOf("#") ? "?" : "#",
    s = t.split(n),
    a = /\\/g;
  (s[0] = s[0].replace(a, "/")), (t = s.join(n));
  var o = t;
  if (((o = o.trim()), !e && t.split("#").length === 1)) {
    var h = qh.exec(o);
    if (h)
      return (
        (this.path = o),
        (this.href = o),
        (this.pathname = h[1]),
        h[2]
          ? ((this.search = h[2]),
            r
              ? (this.query = ui.parse(this.search.substr(1)))
              : (this.query = this.search.substr(1)))
          : r && ((this.search = ""), (this.query = {})),
        this
      );
  }
  var u = Yh.exec(o);
  if (u) {
    u = u[0];
    var f = u.toLowerCase();
    (this.protocol = f), (o = o.substr(u.length));
  }
  if (e || u || o.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var c = o.substr(0, 2) === "//";
    c && !(u && hi[u]) && ((o = o.substr(2)), (this.slashes = !0));
  }
  if (!hi[u] && (c || (u && !_e[u]))) {
    for (var l = -1, d = 0; d < cs.length; d++) {
      var p = o.indexOf(cs[d]);
      p !== -1 && (l === -1 || p < l) && (l = p);
    }
    var _, v;
    l === -1 ? (v = o.lastIndexOf("@")) : (v = o.lastIndexOf("@", l)),
      v !== -1 &&
        ((_ = o.slice(0, v)),
        (o = o.slice(v + 1)),
        (this.auth = decodeURIComponent(_))),
      (l = -1);
    for (var d = 0; d < ls.length; d++) {
      var p = o.indexOf(ls[d]);
      p !== -1 && (l === -1 || p < l) && (l = p);
    }
    l === -1 && (l = o.length),
      (this.host = o.slice(0, l)),
      (o = o.slice(l)),
      this.parseHost(),
      (this.hostname = this.hostname || "");
    var m =
      this.hostname[0] === "[" &&
      this.hostname[this.hostname.length - 1] === "]";
    if (!m)
      for (var g = this.hostname.split(/\./), d = 0, T = g.length; d < T; d++) {
        var I = g[d];
        if (!!I && !I.match(ds)) {
          for (var x = "", y = 0, C = I.length; y < C; y++)
            I.charCodeAt(y) > 127 ? (x += "x") : (x += I[y]);
          if (!x.match(ds)) {
            var N = g.slice(0, d),
              b = g.slice(d + 1),
              R = I.match(Qh);
            R && (N.push(R[1]), b.unshift(R[2])),
              b.length && (o = "/" + b.join(".") + o),
              (this.hostname = N.join("."));
            break;
          }
        }
      }
    this.hostname.length > Jh
      ? (this.hostname = "")
      : (this.hostname = this.hostname.toLowerCase()),
      m || (this.hostname = Vh.toASCII(this.hostname));
    var F = this.port ? ":" + this.port : "",
      O = this.hostname || "";
    (this.host = O + F),
      (this.href += this.host),
      m &&
        ((this.hostname = this.hostname.substr(1, this.hostname.length - 2)),
        o[0] !== "/" && (o = "/" + o));
  }
  if (!tu[f])
    for (var d = 0, T = oi.length; d < T; d++) {
      var k = oi[d];
      if (o.indexOf(k) !== -1) {
        var Q = encodeURIComponent(k);
        Q === k && (Q = escape(k)), (o = o.split(k).join(Q));
      }
    }
  var A = o.indexOf("#");
  A !== -1 && ((this.hash = o.substr(A)), (o = o.slice(0, A)));
  var P = o.indexOf("?");
  if (
    (P !== -1
      ? ((this.search = o.substr(P)),
        (this.query = o.substr(P + 1)),
        r && (this.query = ui.parse(this.query)),
        (o = o.slice(0, P)))
      : r && ((this.search = ""), (this.query = {})),
    o && (this.pathname = o),
    _e[f] && this.hostname && !this.pathname && (this.pathname = "/"),
    this.pathname || this.search)
  ) {
    var F = this.pathname || "",
      X = this.search || "";
    this.path = F + X;
  }
  return (this.href = this.format()), this;
};
function eu(t) {
  return (
    Nt.isString(t) && (t = ur(t)),
    t instanceof Et ? t.format() : Et.prototype.format.call(t)
  );
}
Et.prototype.format = function () {
  var t = this.auth || "";
  t && ((t = encodeURIComponent(t)), (t = t.replace(/%3A/i, ":")), (t += "@"));
  var r = this.protocol || "",
    e = this.pathname || "",
    i = this.hash || "",
    n = !1,
    s = "";
  this.host
    ? (n = t + this.host)
    : this.hostname &&
      ((n =
        t +
        (this.hostname.indexOf(":") === -1
          ? this.hostname
          : "[" + this.hostname + "]")),
      this.port && (n += ":" + this.port)),
    this.query &&
      Nt.isObject(this.query) &&
      Object.keys(this.query).length &&
      (s = ui.stringify(this.query));
  var a = this.search || (s && "?" + s) || "";
  return (
    r && r.substr(-1) !== ":" && (r += ":"),
    this.slashes || ((!r || _e[r]) && n !== !1)
      ? ((n = "//" + (n || "")), e && e.charAt(0) !== "/" && (e = "/" + e))
      : n || (n = ""),
    i && i.charAt(0) !== "#" && (i = "#" + i),
    a && a.charAt(0) !== "?" && (a = "?" + a),
    (e = e.replace(/[?#]/g, function (o) {
      return encodeURIComponent(o);
    })),
    (a = a.replace("#", "%23")),
    r + n + e + a + i
  );
};
function ru(t, r) {
  return ur(t, !1, !0).resolve(r);
}
Et.prototype.resolve = function (t) {
  return this.resolveObject(ur(t, !1, !0)).format();
};
Et.prototype.resolveObject = function (t) {
  if (Nt.isString(t)) {
    var r = new Et();
    r.parse(t, !1, !0), (t = r);
  }
  for (var e = new Et(), i = Object.keys(this), n = 0; n < i.length; n++) {
    var s = i[n];
    e[s] = this[s];
  }
  if (((e.hash = t.hash), t.href === "")) return (e.href = e.format()), e;
  if (t.slashes && !t.protocol) {
    for (var a = Object.keys(t), o = 0; o < a.length; o++) {
      var h = a[o];
      h !== "protocol" && (e[h] = t[h]);
    }
    return (
      _e[e.protocol] &&
        e.hostname &&
        !e.pathname &&
        (e.path = e.pathname = "/"),
      (e.href = e.format()),
      e
    );
  }
  if (t.protocol && t.protocol !== e.protocol) {
    if (!_e[t.protocol]) {
      for (var u = Object.keys(t), f = 0; f < u.length; f++) {
        var c = u[f];
        e[c] = t[c];
      }
      return (e.href = e.format()), e;
    }
    if (((e.protocol = t.protocol), !t.host && !hi[t.protocol])) {
      for (
        var T = (t.pathname || "").split("/");
        T.length && !(t.host = T.shift());

      );
      t.host || (t.host = ""),
        t.hostname || (t.hostname = ""),
        T[0] !== "" && T.unshift(""),
        T.length < 2 && T.unshift(""),
        (e.pathname = T.join("/"));
    } else e.pathname = t.pathname;
    if (
      ((e.search = t.search),
      (e.query = t.query),
      (e.host = t.host || ""),
      (e.auth = t.auth),
      (e.hostname = t.hostname || t.host),
      (e.port = t.port),
      e.pathname || e.search)
    ) {
      var l = e.pathname || "",
        d = e.search || "";
      e.path = l + d;
    }
    return (e.slashes = e.slashes || t.slashes), (e.href = e.format()), e;
  }
  var p = e.pathname && e.pathname.charAt(0) === "/",
    _ = t.host || (t.pathname && t.pathname.charAt(0) === "/"),
    v = _ || p || (e.host && t.pathname),
    m = v,
    g = (e.pathname && e.pathname.split("/")) || [],
    T = (t.pathname && t.pathname.split("/")) || [],
    I = e.protocol && !_e[e.protocol];
  if (
    (I &&
      ((e.hostname = ""),
      (e.port = null),
      e.host && (g[0] === "" ? (g[0] = e.host) : g.unshift(e.host)),
      (e.host = ""),
      t.protocol &&
        ((t.hostname = null),
        (t.port = null),
        t.host && (T[0] === "" ? (T[0] = t.host) : T.unshift(t.host)),
        (t.host = null)),
      (v = v && (T[0] === "" || g[0] === ""))),
    _)
  )
    (e.host = t.host || t.host === "" ? t.host : e.host),
      (e.hostname = t.hostname || t.hostname === "" ? t.hostname : e.hostname),
      (e.search = t.search),
      (e.query = t.query),
      (g = T);
  else if (T.length)
    g || (g = []),
      g.pop(),
      (g = g.concat(T)),
      (e.search = t.search),
      (e.query = t.query);
  else if (!Nt.isNullOrUndefined(t.search)) {
    if (I) {
      e.hostname = e.host = g.shift();
      var x = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
      x && ((e.auth = x.shift()), (e.host = e.hostname = x.shift()));
    }
    return (
      (e.search = t.search),
      (e.query = t.query),
      (!Nt.isNull(e.pathname) || !Nt.isNull(e.search)) &&
        (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")),
      (e.href = e.format()),
      e
    );
  }
  if (!g.length)
    return (
      (e.pathname = null),
      e.search ? (e.path = "/" + e.search) : (e.path = null),
      (e.href = e.format()),
      e
    );
  for (
    var y = g.slice(-1)[0],
      C =
        ((e.host || t.host || g.length > 1) && (y === "." || y === "..")) ||
        y === "",
      N = 0,
      b = g.length;
    b >= 0;
    b--
  )
    (y = g[b]),
      y === "."
        ? g.splice(b, 1)
        : y === ".."
        ? (g.splice(b, 1), N++)
        : N && (g.splice(b, 1), N--);
  if (!v && !m) for (; N--; N) g.unshift("..");
  v && g[0] !== "" && (!g[0] || g[0].charAt(0) !== "/") && g.unshift(""),
    C && g.join("/").substr(-1) !== "/" && g.push("");
  var R = g[0] === "" || (g[0] && g[0].charAt(0) === "/");
  if (I) {
    e.hostname = e.host = R ? "" : g.length ? g.shift() : "";
    var x = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
    x && ((e.auth = x.shift()), (e.host = e.hostname = x.shift()));
  }
  return (
    (v = v || (e.host && g.length)),
    v && !R && g.unshift(""),
    g.length
      ? (e.pathname = g.join("/"))
      : ((e.pathname = null), (e.path = null)),
    (!Nt.isNull(e.pathname) || !Nt.isNull(e.search)) &&
      (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")),
    (e.auth = t.auth || e.auth),
    (e.slashes = e.slashes || t.slashes),
    (e.href = e.format()),
    e
  );
};
Et.prototype.parseHost = function () {
  var t = this.host,
    r = $h.exec(t);
  r &&
    ((r = r[0]),
    r !== ":" && (this.port = r.substr(1)),
    (t = t.substr(0, t.length - r.length))),
    t && (this.hostname = t);
};
/*!
 * @pixi/constants - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Bt;
(function (t) {
  (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.WEBGL2 = 2)] = "WEBGL2");
})(Bt || (Bt = {}));
var De;
(function (t) {
  (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.CANVAS = 2)] = "CANVAS");
})(De || (De = {}));
var fr;
(function (t) {
  (t[(t.COLOR = 16384)] = "COLOR"),
    (t[(t.DEPTH = 256)] = "DEPTH"),
    (t[(t.STENCIL = 1024)] = "STENCIL");
})(fr || (fr = {}));
var U;
(function (t) {
  (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.ADD = 1)] = "ADD"),
    (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
    (t[(t.SCREEN = 3)] = "SCREEN"),
    (t[(t.OVERLAY = 4)] = "OVERLAY"),
    (t[(t.DARKEN = 5)] = "DARKEN"),
    (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
    (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
    (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
    (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
    (t[(t.HUE = 13)] = "HUE"),
    (t[(t.SATURATION = 14)] = "SATURATION"),
    (t[(t.COLOR = 15)] = "COLOR"),
    (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
    (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
    (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (t[(t.NONE = 20)] = "NONE"),
    (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
    (t[(t.SRC_IN = 21)] = "SRC_IN"),
    (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
    (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
    (t[(t.DST_OVER = 24)] = "DST_OVER"),
    (t[(t.DST_IN = 25)] = "DST_IN"),
    (t[(t.DST_OUT = 26)] = "DST_OUT"),
    (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
    (t[(t.ERASE = 26)] = "ERASE"),
    (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
    (t[(t.XOR = 29)] = "XOR");
})(U || (U = {}));
var It;
(function (t) {
  (t[(t.POINTS = 0)] = "POINTS"),
    (t[(t.LINES = 1)] = "LINES"),
    (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
    (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
    (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
    (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
})(It || (It = {}));
var w;
(function (t) {
  (t[(t.RGBA = 6408)] = "RGBA"),
    (t[(t.RGB = 6407)] = "RGB"),
    (t[(t.RG = 33319)] = "RG"),
    (t[(t.RED = 6403)] = "RED"),
    (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (t[(t.ALPHA = 6406)] = "ALPHA"),
    (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
    (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
})(w || (w = {}));
var Jt;
(function (t) {
  (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z");
})(Jt || (Jt = {}));
var G;
(function (t) {
  (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (t[(t.BYTE = 5120)] = "BYTE"),
    (t[(t.SHORT = 5122)] = "SHORT"),
    (t[(t.INT = 5124)] = "INT"),
    (t[(t.FLOAT = 5126)] = "FLOAT"),
    (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
})(G || (G = {}));
var lr;
(function (t) {
  (t[(t.FLOAT = 0)] = "FLOAT"),
    (t[(t.INT = 1)] = "INT"),
    (t[(t.UINT = 2)] = "UINT");
})(lr || (lr = {}));
var Mt;
(function (t) {
  (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
})(Mt || (Mt = {}));
var Dt;
(function (t) {
  (t[(t.CLAMP = 33071)] = "CLAMP"),
    (t[(t.REPEAT = 10497)] = "REPEAT"),
    (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
})(Dt || (Dt = {}));
var zt;
(function (t) {
  (t[(t.OFF = 0)] = "OFF"),
    (t[(t.POW2 = 1)] = "POW2"),
    (t[(t.ON = 2)] = "ON"),
    (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
})(zt || (zt = {}));
var Ot;
(function (t) {
  (t[(t.NPM = 0)] = "NPM"),
    (t[(t.UNPACK = 1)] = "UNPACK"),
    (t[(t.PMA = 2)] = "PMA"),
    (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
})(Ot || (Ot = {}));
var Wt;
(function (t) {
  (t[(t.NO = 0)] = "NO"),
    (t[(t.YES = 1)] = "YES"),
    (t[(t.AUTO = 2)] = "AUTO"),
    (t[(t.BLEND = 0)] = "BLEND"),
    (t[(t.CLEAR = 1)] = "CLEAR"),
    (t[(t.BLIT = 2)] = "BLIT");
})(Wt || (Wt = {}));
var fi;
(function (t) {
  (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
})(fi || (fi = {}));
var St;
(function (t) {
  (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
})(St || (St = {}));
var xt;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.SCISSOR = 1)] = "SCISSOR"),
    (t[(t.STENCIL = 2)] = "STENCIL"),
    (t[(t.SPRITE = 3)] = "SPRITE");
})(xt || (xt = {}));
var ct;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LOW = 2)] = "LOW"),
    (t[(t.MEDIUM = 4)] = "MEDIUM"),
    (t[(t.HIGH = 8)] = "HIGH");
})(ct || (ct = {}));
var Ut;
(function (t) {
  (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
    (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
})(Ut || (Ut = {}));
/*!
 * @pixi/utils - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var me = { parse: jh, format: Wh, resolve: zh };
S.RETINA_PREFIX = /@([0-9\.]+)x/;
S.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var ps = !1,
  vs = "6.2.2";
function iu(t) {
  var r;
  if (!ps) {
    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
      var e = [
        `
 %c %c %c PixiJS ` +
          vs +
          " - \u2730 " +
          t +
          ` \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 

`,
        "background: #ff66a5; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff66a5; background: #030307; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "background: #ffc3dc; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
      ];
      (r = self.console).log.apply(r, e);
    } else
      self.console &&
        self.console.log(
          "PixiJS " + vs + " - " + t + " - http://www.pixijs.com/"
        );
    ps = !0;
  }
}
var li;
function nu() {
  return (
    typeof li == "undefined" &&
      (li = (function () {
        var r = {
          stencil: !0,
          failIfMajorPerformanceCaveat: S.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
        };
        try {
          if (!self.WebGLRenderingContext) return !1;
          var e = document.createElement("canvas"),
            i =
              e.getContext("webgl", r) || e.getContext("experimental-webgl", r),
            n = !!(i && i.getContextAttributes().stencil);
          if (i) {
            var s = i.getExtension("WEBGL_lose_context");
            s && s.loseContext();
          }
          return (i = null), n;
        } catch {
          return !1;
        }
      })()),
    li
  );
}
var su = "#f0f8ff",
  au = "#faebd7",
  ou = "#00ffff",
  hu = "#7fffd4",
  uu = "#f0ffff",
  fu = "#f5f5dc",
  lu = "#ffe4c4",
  cu = "#000000",
  du = "#ffebcd",
  pu = "#0000ff",
  vu = "#8a2be2",
  _u = "#a52a2a",
  mu = "#deb887",
  yu = "#5f9ea0",
  gu = "#7fff00",
  xu = "#d2691e",
  Tu = "#ff7f50",
  bu = "#6495ed",
  Eu = "#fff8dc",
  Iu = "#dc143c",
  Ru = "#00ffff",
  wu = "#00008b",
  Cu = "#008b8b",
  Pu = "#b8860b",
  Au = "#a9a9a9",
  Nu = "#006400",
  Ou = "#a9a9a9",
  Su = "#bdb76b",
  Uu = "#8b008b",
  Fu = "#556b2f",
  Lu = "#ff8c00",
  Gu = "#9932cc",
  Bu = "#8b0000",
  Mu = "#e9967a",
  Du = "#8fbc8f",
  ku = "#483d8b",
  Xu = "#2f4f4f",
  Hu = "#2f4f4f",
  Vu = "#00ced1",
  ju = "#9400d3",
  zu = "#ff1493",
  Wu = "#00bfff",
  Yu = "#696969",
  $u = "#696969",
  qu = "#1e90ff",
  Zu = "#b22222",
  Ku = "#fffaf0",
  Ju = "#228b22",
  Qu = "#ff00ff",
  tf = "#dcdcdc",
  ef = "#f8f8ff",
  rf = "#daa520",
  nf = "#ffd700",
  sf = "#808080",
  af = "#008000",
  of = "#adff2f",
  hf = "#808080",
  uf = "#f0fff0",
  ff = "#ff69b4",
  lf = "#cd5c5c",
  cf = "#4b0082",
  df = "#fffff0",
  pf = "#f0e68c",
  vf = "#fff0f5",
  _f = "#e6e6fa",
  mf = "#7cfc00",
  yf = "#fffacd",
  gf = "#add8e6",
  xf = "#f08080",
  Tf = "#e0ffff",
  bf = "#fafad2",
  Ef = "#d3d3d3",
  If = "#90ee90",
  Rf = "#d3d3d3",
  wf = "#ffb6c1",
  Cf = "#ffa07a",
  Pf = "#20b2aa",
  Af = "#87cefa",
  Nf = "#778899",
  Of = "#778899",
  Sf = "#b0c4de",
  Uf = "#ffffe0",
  Ff = "#00ff00",
  Lf = "#32cd32",
  Gf = "#faf0e6",
  Bf = "#ff00ff",
  Mf = "#800000",
  Df = "#66cdaa",
  kf = "#0000cd",
  Xf = "#ba55d3",
  Hf = "#9370db",
  Vf = "#3cb371",
  jf = "#7b68ee",
  zf = "#00fa9a",
  Wf = "#48d1cc",
  Yf = "#c71585",
  $f = "#191970",
  qf = "#f5fffa",
  Zf = "#ffe4e1",
  Kf = "#ffe4b5",
  Jf = "#ffdead",
  Qf = "#000080",
  tl = "#fdf5e6",
  el = "#808000",
  rl = "#6b8e23",
  il = "#ffa500",
  nl = "#ff4500",
  sl = "#da70d6",
  al = "#eee8aa",
  ol = "#98fb98",
  hl = "#afeeee",
  ul = "#db7093",
  fl = "#ffefd5",
  ll = "#ffdab9",
  cl = "#cd853f",
  dl = "#ffc0cb",
  pl = "#dda0dd",
  vl = "#b0e0e6",
  _l = "#800080",
  ml = "#663399",
  yl = "#ff0000",
  gl = "#bc8f8f",
  xl = "#4169e1",
  Tl = "#8b4513",
  bl = "#fa8072",
  El = "#f4a460",
  Il = "#2e8b57",
  Rl = "#fff5ee",
  wl = "#a0522d",
  Cl = "#c0c0c0",
  Pl = "#87ceeb",
  Al = "#6a5acd",
  Nl = "#708090",
  Ol = "#708090",
  Sl = "#fffafa",
  Ul = "#00ff7f",
  Fl = "#4682b4",
  Ll = "#d2b48c",
  Gl = "#008080",
  Bl = "#d8bfd8",
  Ml = "#ff6347",
  Dl = "#40e0d0",
  kl = "#ee82ee",
  Xl = "#f5deb3",
  Hl = "#ffffff",
  Vl = "#f5f5f5",
  jl = "#ffff00",
  zl = "#9acd32",
  Wl = {
    aliceblue: su,
    antiquewhite: au,
    aqua: ou,
    aquamarine: hu,
    azure: uu,
    beige: fu,
    bisque: lu,
    black: cu,
    blanchedalmond: du,
    blue: pu,
    blueviolet: vu,
    brown: _u,
    burlywood: mu,
    cadetblue: yu,
    chartreuse: gu,
    chocolate: xu,
    coral: Tu,
    cornflowerblue: bu,
    cornsilk: Eu,
    crimson: Iu,
    cyan: Ru,
    darkblue: wu,
    darkcyan: Cu,
    darkgoldenrod: Pu,
    darkgray: Au,
    darkgreen: Nu,
    darkgrey: Ou,
    darkkhaki: Su,
    darkmagenta: Uu,
    darkolivegreen: Fu,
    darkorange: Lu,
    darkorchid: Gu,
    darkred: Bu,
    darksalmon: Mu,
    darkseagreen: Du,
    darkslateblue: ku,
    darkslategray: Xu,
    darkslategrey: Hu,
    darkturquoise: Vu,
    darkviolet: ju,
    deeppink: zu,
    deepskyblue: Wu,
    dimgray: Yu,
    dimgrey: $u,
    dodgerblue: qu,
    firebrick: Zu,
    floralwhite: Ku,
    forestgreen: Ju,
    fuchsia: Qu,
    gainsboro: tf,
    ghostwhite: ef,
    goldenrod: rf,
    gold: nf,
    gray: sf,
    green: af,
    greenyellow: of,
    grey: hf,
    honeydew: uf,
    hotpink: ff,
    indianred: lf,
    indigo: cf,
    ivory: df,
    khaki: pf,
    lavenderblush: vf,
    lavender: _f,
    lawngreen: mf,
    lemonchiffon: yf,
    lightblue: gf,
    lightcoral: xf,
    lightcyan: Tf,
    lightgoldenrodyellow: bf,
    lightgray: Ef,
    lightgreen: If,
    lightgrey: Rf,
    lightpink: wf,
    lightsalmon: Cf,
    lightseagreen: Pf,
    lightskyblue: Af,
    lightslategray: Nf,
    lightslategrey: Of,
    lightsteelblue: Sf,
    lightyellow: Uf,
    lime: Ff,
    limegreen: Lf,
    linen: Gf,
    magenta: Bf,
    maroon: Mf,
    mediumaquamarine: Df,
    mediumblue: kf,
    mediumorchid: Xf,
    mediumpurple: Hf,
    mediumseagreen: Vf,
    mediumslateblue: jf,
    mediumspringgreen: zf,
    mediumturquoise: Wf,
    mediumvioletred: Yf,
    midnightblue: $f,
    mintcream: qf,
    mistyrose: Zf,
    moccasin: Kf,
    navajowhite: Jf,
    navy: Qf,
    oldlace: tl,
    olive: el,
    olivedrab: rl,
    orange: il,
    orangered: nl,
    orchid: sl,
    palegoldenrod: al,
    palegreen: ol,
    paleturquoise: hl,
    palevioletred: ul,
    papayawhip: fl,
    peachpuff: ll,
    peru: cl,
    pink: dl,
    plum: pl,
    powderblue: vl,
    purple: _l,
    rebeccapurple: ml,
    red: yl,
    rosybrown: gl,
    royalblue: xl,
    saddlebrown: Tl,
    salmon: bl,
    sandybrown: El,
    seagreen: Il,
    seashell: Rl,
    sienna: wl,
    silver: Cl,
    skyblue: Pl,
    slateblue: Al,
    slategray: Nl,
    slategrey: Ol,
    snow: Sl,
    springgreen: Ul,
    steelblue: Fl,
    tan: Ll,
    teal: Gl,
    thistle: Bl,
    tomato: Ml,
    turquoise: Dl,
    violet: kl,
    wheat: Xl,
    white: Hl,
    whitesmoke: Vl,
    yellow: jl,
    yellowgreen: zl,
  };
function ye(t, r) {
  return (
    r === void 0 && (r = []),
    (r[0] = ((t >> 16) & 255) / 255),
    (r[1] = ((t >> 8) & 255) / 255),
    (r[2] = (t & 255) / 255),
    r
  );
}
function _s(t) {
  var r = t.toString(16);
  return (r = "000000".substr(0, 6 - r.length) + r), "#" + r;
}
function ms(t) {
  return (
    typeof t == "string" &&
      ((t = Wl[t.toLowerCase()] || t), t[0] === "#" && (t = t.substr(1))),
    parseInt(t, 16)
  );
}
function Yl() {
  for (var t = [], r = [], e = 0; e < 32; e++) (t[e] = e), (r[e] = e);
  (t[U.NORMAL_NPM] = U.NORMAL),
    (t[U.ADD_NPM] = U.ADD),
    (t[U.SCREEN_NPM] = U.SCREEN),
    (r[U.NORMAL] = U.NORMAL_NPM),
    (r[U.ADD] = U.ADD_NPM),
    (r[U.SCREEN] = U.SCREEN_NPM);
  var i = [];
  return i.push(r), i.push(t), i;
}
var ys = Yl();
function gs(t, r) {
  return ys[r ? 1 : 0][t];
}
function $l(t, r, e, i) {
  return (
    (e = e || new Float32Array(4)),
    i || i === void 0
      ? ((e[0] = t[0] * r), (e[1] = t[1] * r), (e[2] = t[2] * r))
      : ((e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2])),
    (e[3] = r),
    e
  );
}
function ci(t, r) {
  if (r === 1) return ((r * 255) << 24) + t;
  if (r === 0) return 0;
  var e = (t >> 16) & 255,
    i = (t >> 8) & 255,
    n = t & 255;
  return (
    (e = (e * r + 0.5) | 0),
    (i = (i * r + 0.5) | 0),
    (n = (n * r + 0.5) | 0),
    ((r * 255) << 24) + (e << 16) + (i << 8) + n
  );
}
function xs(t, r, e, i) {
  return (
    (e = e || new Float32Array(4)),
    (e[0] = ((t >> 16) & 255) / 255),
    (e[1] = ((t >> 8) & 255) / 255),
    (e[2] = (t & 255) / 255),
    (i || i === void 0) && ((e[0] *= r), (e[1] *= r), (e[2] *= r)),
    (e[3] = r),
    e
  );
}
function ql(t, r) {
  r === void 0 && (r = null);
  var e = t * 6;
  if (((r = r || new Uint16Array(e)), r.length !== e))
    throw new Error(
      "Out buffer length is incorrect, got " + r.length + " and expected " + e
    );
  for (var i = 0, n = 0; i < e; i += 6, n += 4)
    (r[i + 0] = n + 0),
      (r[i + 1] = n + 1),
      (r[i + 2] = n + 2),
      (r[i + 3] = n + 0),
      (r[i + 4] = n + 2),
      (r[i + 5] = n + 3);
  return r;
}
function Ts(t) {
  if (t.BYTES_PER_ELEMENT === 4)
    return t instanceof Float32Array
      ? "Float32Array"
      : t instanceof Uint32Array
      ? "Uint32Array"
      : "Int32Array";
  if (t.BYTES_PER_ELEMENT === 2) {
    if (t instanceof Uint16Array) return "Uint16Array";
  } else if (t.BYTES_PER_ELEMENT === 1 && t instanceof Uint8Array)
    return "Uint8Array";
  return null;
}
function cr(t) {
  return (
    (t += t === 0 ? 1 : 0),
    --t,
    (t |= t >>> 1),
    (t |= t >>> 2),
    (t |= t >>> 4),
    (t |= t >>> 8),
    (t |= t >>> 16),
    t + 1
  );
}
function bs(t) {
  return !(t & (t - 1)) && !!t;
}
function Es(t) {
  var r = (t > 65535 ? 1 : 0) << 4;
  t >>>= r;
  var e = (t > 255 ? 1 : 0) << 3;
  return (
    (t >>>= e),
    (r |= e),
    (e = (t > 15 ? 1 : 0) << 2),
    (t >>>= e),
    (r |= e),
    (e = (t > 3 ? 1 : 0) << 1),
    (t >>>= e),
    (r |= e),
    r | (t >> 1)
  );
}
function ge(t, r, e) {
  var i = t.length,
    n;
  if (!(r >= i || e === 0)) {
    e = r + e > i ? i - r : e;
    var s = i - e;
    for (n = r; n < s; ++n) t[n] = t[n + e];
    t.length = s;
  }
}
function xe(t) {
  return t === 0 ? 0 : t < 0 ? -1 : 1;
}
var Zl = 0;
function Qt() {
  return ++Zl;
}
var Is = {};
function te(t, r, e) {
  if ((e === void 0 && (e = 3), !Is[r])) {
    var i = new Error().stack;
    typeof i == "undefined"
      ? console.warn(
          "PixiJS Deprecation Warning: ",
          r +
            `
Deprecated since v` +
            t
        )
      : ((i = i
          .split(
            `
`
          )
          .splice(e).join(`
`)),
        console.groupCollapsed
          ? (console.groupCollapsed(
              "%cPixiJS Deprecation Warning: %c%s",
              "color:#614108;background:#fffbe6",
              "font-weight:normal;color:#614108;background:#fffbe6",
              r +
                `
Deprecated since v` +
                t
            ),
            console.warn(i),
            console.groupEnd())
          : (console.warn(
              "PixiJS Deprecation Warning: ",
              r +
                `
Deprecated since v` +
                t
            ),
            console.warn(i))),
      (Is[r] = !0);
  }
}
var Rs = {},
  kt = Object.create(null),
  ee = Object.create(null),
  ws = (function () {
    function t(r, e, i) {
      (this.canvas = document.createElement("canvas")),
        (this.context = this.canvas.getContext("2d")),
        (this.resolution = i || S.RESOLUTION),
        this.resize(r, e);
    }
    return (
      (t.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }),
      (t.prototype.resize = function (r, e) {
        (this.canvas.width = Math.round(r * this.resolution)),
          (this.canvas.height = Math.round(e * this.resolution));
      }),
      (t.prototype.destroy = function () {
        (this.context = null), (this.canvas = null);
      }),
      Object.defineProperty(t.prototype, "width", {
        get: function () {
          return this.canvas.width;
        },
        set: function (r) {
          this.canvas.width = Math.round(r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "height", {
        get: function () {
          return this.canvas.height;
        },
        set: function (r) {
          this.canvas.height = Math.round(r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })();
function Kl(t) {
  var r = t.width,
    e = t.height,
    i = t.getContext("2d"),
    n = i.getImageData(0, 0, r, e),
    s = n.data,
    a = s.length,
    o = { top: null, left: null, right: null, bottom: null },
    h = null,
    u,
    f,
    c;
  for (u = 0; u < a; u += 4)
    s[u + 3] !== 0 &&
      ((f = (u / 4) % r),
      (c = ~~(u / 4 / r)),
      o.top === null && (o.top = c),
      (o.left === null || f < o.left) && (o.left = f),
      (o.right === null || o.right < f) && (o.right = f + 1),
      (o.bottom === null || o.bottom < c) && (o.bottom = c));
  return (
    o.top !== null &&
      ((r = o.right - o.left),
      (e = o.bottom - o.top + 1),
      (h = i.getImageData(o.left, o.top, r, e))),
    { height: e, width: r, data: h }
  );
}
var dr;
function Jl(t, r) {
  if ((r === void 0 && (r = self.location), t.indexOf("data:") === 0))
    return "";
  (r = r || self.location),
    dr || (dr = document.createElement("a")),
    (dr.href = t);
  var e = me.parse(dr.href),
    i = (!e.port && r.port === "") || e.port === r.port;
  return e.hostname !== r.hostname || !i || e.protocol !== r.protocol
    ? "anonymous"
    : "";
}
function pr(t, r) {
  var e = S.RETINA_PREFIX.exec(t);
  return e ? parseFloat(e[1]) : r !== void 0 ? r : 1;
}
/*!
 * @pixi/math - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/math is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var vr = Math.PI * 2,
  Ql = 180 / Math.PI,
  tc = Math.PI / 180,
  ot;
(function (t) {
  (t[(t.POLY = 0)] = "POLY"),
    (t[(t.RECT = 1)] = "RECT"),
    (t[(t.CIRC = 2)] = "CIRC"),
    (t[(t.ELIP = 3)] = "ELIP"),
    (t[(t.RREC = 4)] = "RREC");
})(ot || (ot = {}));
var z = (function () {
    function t(r, e, i, n) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        i === void 0 && (i = 0),
        n === void 0 && (n = 0),
        (this.x = Number(r)),
        (this.y = Number(e)),
        (this.width = Number(i)),
        (this.height = Number(n)),
        (this.type = ot.RECT);
    }
    return (
      Object.defineProperty(t.prototype, "left", {
        get: function () {
          return this.x;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "right", {
        get: function () {
          return this.x + this.width;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "top", {
        get: function () {
          return this.y;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "bottom", {
        get: function () {
          return this.y + this.height;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "EMPTY", {
        get: function () {
          return new t(0, 0, 0, 0);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.clone = function () {
        return new t(this.x, this.y, this.width, this.height);
      }),
      (t.prototype.copyFrom = function (r) {
        return (
          (this.x = r.x),
          (this.y = r.y),
          (this.width = r.width),
          (this.height = r.height),
          this
        );
      }),
      (t.prototype.copyTo = function (r) {
        return (
          (r.x = this.x),
          (r.y = this.y),
          (r.width = this.width),
          (r.height = this.height),
          r
        );
      }),
      (t.prototype.contains = function (r, e) {
        return this.width <= 0 || this.height <= 0
          ? !1
          : r >= this.x &&
              r < this.x + this.width &&
              e >= this.y &&
              e < this.y + this.height;
      }),
      (t.prototype.pad = function (r, e) {
        return (
          r === void 0 && (r = 0),
          e === void 0 && (e = r),
          (this.x -= r),
          (this.y -= e),
          (this.width += r * 2),
          (this.height += e * 2),
          this
        );
      }),
      (t.prototype.fit = function (r) {
        var e = Math.max(this.x, r.x),
          i = Math.min(this.x + this.width, r.x + r.width),
          n = Math.max(this.y, r.y),
          s = Math.min(this.y + this.height, r.y + r.height);
        return (
          (this.x = e),
          (this.width = Math.max(i - e, 0)),
          (this.y = n),
          (this.height = Math.max(s - n, 0)),
          this
        );
      }),
      (t.prototype.ceil = function (r, e) {
        r === void 0 && (r = 1), e === void 0 && (e = 0.001);
        var i = Math.ceil((this.x + this.width - e) * r) / r,
          n = Math.ceil((this.y + this.height - e) * r) / r;
        return (
          (this.x = Math.floor((this.x + e) * r) / r),
          (this.y = Math.floor((this.y + e) * r) / r),
          (this.width = i - this.x),
          (this.height = n - this.y),
          this
        );
      }),
      (t.prototype.enlarge = function (r) {
        var e = Math.min(this.x, r.x),
          i = Math.max(this.x + this.width, r.x + r.width),
          n = Math.min(this.y, r.y),
          s = Math.max(this.y + this.height, r.y + r.height);
        return (
          (this.x = e),
          (this.width = i - e),
          (this.y = n),
          (this.height = s - n),
          this
        );
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Rectangle x=" +
          this.x +
          " y=" +
          this.y +
          " width=" +
          this.width +
          " height=" +
          this.height +
          "]"
        );
      }),
      t
    );
  })(),
  ec = (function () {
    function t(r, e, i) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        i === void 0 && (i = 0),
        (this.x = r),
        (this.y = e),
        (this.radius = i),
        (this.type = ot.CIRC);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.x, this.y, this.radius);
      }),
      (t.prototype.contains = function (r, e) {
        if (this.radius <= 0) return !1;
        var i = this.radius * this.radius,
          n = this.x - r,
          s = this.y - e;
        return (n *= n), (s *= s), n + s <= i;
      }),
      (t.prototype.getBounds = function () {
        return new z(
          this.x - this.radius,
          this.y - this.radius,
          this.radius * 2,
          this.radius * 2
        );
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Circle x=" +
          this.x +
          " y=" +
          this.y +
          " radius=" +
          this.radius +
          "]"
        );
      }),
      t
    );
  })(),
  rc = (function () {
    function t(r, e, i, n) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        i === void 0 && (i = 0),
        n === void 0 && (n = 0),
        (this.x = r),
        (this.y = e),
        (this.width = i),
        (this.height = n),
        (this.type = ot.ELIP);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.x, this.y, this.width, this.height);
      }),
      (t.prototype.contains = function (r, e) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var i = (r - this.x) / this.width,
          n = (e - this.y) / this.height;
        return (i *= i), (n *= n), i + n <= 1;
      }),
      (t.prototype.getBounds = function () {
        return new z(
          this.x - this.width,
          this.y - this.height,
          this.width,
          this.height
        );
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Ellipse x=" +
          this.x +
          " y=" +
          this.y +
          " width=" +
          this.width +
          " height=" +
          this.height +
          "]"
        );
      }),
      t
    );
  })(),
  _r = (function () {
    function t() {
      for (var r = arguments, e = [], i = 0; i < arguments.length; i++)
        e[i] = r[i];
      var n = Array.isArray(e[0]) ? e[0] : e;
      if (typeof n[0] != "number") {
        for (var s = [], a = 0, o = n.length; a < o; a++)
          s.push(n[a].x, n[a].y);
        n = s;
      }
      (this.points = n), (this.type = ot.POLY), (this.closeStroke = !0);
    }
    return (
      (t.prototype.clone = function () {
        var r = this.points.slice(),
          e = new t(r);
        return (e.closeStroke = this.closeStroke), e;
      }),
      (t.prototype.contains = function (r, e) {
        for (
          var i = !1, n = this.points.length / 2, s = 0, a = n - 1;
          s < n;
          a = s++
        ) {
          var o = this.points[s * 2],
            h = this.points[s * 2 + 1],
            u = this.points[a * 2],
            f = this.points[a * 2 + 1],
            c = h > e != f > e && r < (u - o) * ((e - h) / (f - h)) + o;
          c && (i = !i);
        }
        return i;
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Polygon" +
          ("closeStroke=" + this.closeStroke) +
          ("points=" +
            this.points.reduce(function (r, e) {
              return r + ", " + e;
            }, "") +
            "]")
        );
      }),
      t
    );
  })(),
  ic = (function () {
    function t(r, e, i, n, s) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        i === void 0 && (i = 0),
        n === void 0 && (n = 0),
        s === void 0 && (s = 20),
        (this.x = r),
        (this.y = e),
        (this.width = i),
        (this.height = n),
        (this.radius = s),
        (this.type = ot.RREC);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.x, this.y, this.width, this.height, this.radius);
      }),
      (t.prototype.contains = function (r, e) {
        if (this.width <= 0 || this.height <= 0) return !1;
        if (
          r >= this.x &&
          r <= this.x + this.width &&
          e >= this.y &&
          e <= this.y + this.height
        ) {
          var i = Math.max(
            0,
            Math.min(this.radius, Math.min(this.width, this.height) / 2)
          );
          if (
            (e >= this.y + i && e <= this.y + this.height - i) ||
            (r >= this.x + i && r <= this.x + this.width - i)
          )
            return !0;
          var n = r - (this.x + i),
            s = e - (this.y + i),
            a = i * i;
          if (
            n * n + s * s <= a ||
            ((n = r - (this.x + this.width - i)), n * n + s * s <= a) ||
            ((s = e - (this.y + this.height - i)), n * n + s * s <= a) ||
            ((n = r - (this.x + i)), n * n + s * s <= a)
          )
            return !0;
        }
        return !1;
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:RoundedRectangle x=" +
          this.x +
          " y=" +
          this.y +
          ("width=" +
            this.width +
            " height=" +
            this.height +
            " radius=" +
            this.radius +
            "]")
        );
      }),
      t
    );
  })(),
  ht = (function () {
    function t(r, e) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        (this.x = 0),
        (this.y = 0),
        (this.x = r),
        (this.y = e);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.x, this.y);
      }),
      (t.prototype.copyFrom = function (r) {
        return this.set(r.x, r.y), this;
      }),
      (t.prototype.copyTo = function (r) {
        return r.set(this.x, this.y), r;
      }),
      (t.prototype.equals = function (r) {
        return r.x === this.x && r.y === this.y;
      }),
      (t.prototype.set = function (r, e) {
        return (
          r === void 0 && (r = 0),
          e === void 0 && (e = r),
          (this.x = r),
          (this.y = e),
          this
        );
      }),
      (t.prototype.toString = function () {
        return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
      }),
      t
    );
  })(),
  Te = (function () {
    function t(r, e, i, n) {
      i === void 0 && (i = 0),
        n === void 0 && (n = 0),
        (this._x = i),
        (this._y = n),
        (this.cb = r),
        (this.scope = e);
    }
    return (
      (t.prototype.clone = function (r, e) {
        return (
          r === void 0 && (r = this.cb),
          e === void 0 && (e = this.scope),
          new t(r, e, this._x, this._y)
        );
      }),
      (t.prototype.set = function (r, e) {
        return (
          r === void 0 && (r = 0),
          e === void 0 && (e = r),
          (this._x !== r || this._y !== e) &&
            ((this._x = r), (this._y = e), this.cb.call(this.scope)),
          this
        );
      }),
      (t.prototype.copyFrom = function (r) {
        return (
          (this._x !== r.x || this._y !== r.y) &&
            ((this._x = r.x), (this._y = r.y), this.cb.call(this.scope)),
          this
        );
      }),
      (t.prototype.copyTo = function (r) {
        return r.set(this._x, this._y), r;
      }),
      (t.prototype.equals = function (r) {
        return r.x === this._x && r.y === this._y;
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:ObservablePoint x=" +
          0 +
          " y=" +
          0 +
          " scope=" +
          this.scope +
          "]"
        );
      }),
      Object.defineProperty(t.prototype, "x", {
        get: function () {
          return this._x;
        },
        set: function (r) {
          this._x !== r && ((this._x = r), this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "y", {
        get: function () {
          return this._y;
        },
        set: function (r) {
          this._y !== r && ((this._y = r), this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })(),
  ut = (function () {
    function t(r, e, i, n, s, a) {
      r === void 0 && (r = 1),
        e === void 0 && (e = 0),
        i === void 0 && (i = 0),
        n === void 0 && (n = 1),
        s === void 0 && (s = 0),
        a === void 0 && (a = 0),
        (this.array = null),
        (this.a = r),
        (this.b = e),
        (this.c = i),
        (this.d = n),
        (this.tx = s),
        (this.ty = a);
    }
    return (
      (t.prototype.fromArray = function (r) {
        (this.a = r[0]),
          (this.b = r[1]),
          (this.c = r[3]),
          (this.d = r[4]),
          (this.tx = r[2]),
          (this.ty = r[5]);
      }),
      (t.prototype.set = function (r, e, i, n, s, a) {
        return (
          (this.a = r),
          (this.b = e),
          (this.c = i),
          (this.d = n),
          (this.tx = s),
          (this.ty = a),
          this
        );
      }),
      (t.prototype.toArray = function (r, e) {
        this.array || (this.array = new Float32Array(9));
        var i = e || this.array;
        return (
          r
            ? ((i[0] = this.a),
              (i[1] = this.b),
              (i[2] = 0),
              (i[3] = this.c),
              (i[4] = this.d),
              (i[5] = 0),
              (i[6] = this.tx),
              (i[7] = this.ty),
              (i[8] = 1))
            : ((i[0] = this.a),
              (i[1] = this.c),
              (i[2] = this.tx),
              (i[3] = this.b),
              (i[4] = this.d),
              (i[5] = this.ty),
              (i[6] = 0),
              (i[7] = 0),
              (i[8] = 1)),
          i
        );
      }),
      (t.prototype.apply = function (r, e) {
        e = e || new ht();
        var i = r.x,
          n = r.y;
        return (
          (e.x = this.a * i + this.c * n + this.tx),
          (e.y = this.b * i + this.d * n + this.ty),
          e
        );
      }),
      (t.prototype.applyInverse = function (r, e) {
        e = e || new ht();
        var i = 1 / (this.a * this.d + this.c * -this.b),
          n = r.x,
          s = r.y;
        return (
          (e.x =
            this.d * i * n +
            -this.c * i * s +
            (this.ty * this.c - this.tx * this.d) * i),
          (e.y =
            this.a * i * s +
            -this.b * i * n +
            (-this.ty * this.a + this.tx * this.b) * i),
          e
        );
      }),
      (t.prototype.translate = function (r, e) {
        return (this.tx += r), (this.ty += e), this;
      }),
      (t.prototype.scale = function (r, e) {
        return (
          (this.a *= r),
          (this.d *= e),
          (this.c *= r),
          (this.b *= e),
          (this.tx *= r),
          (this.ty *= e),
          this
        );
      }),
      (t.prototype.rotate = function (r) {
        var e = Math.cos(r),
          i = Math.sin(r),
          n = this.a,
          s = this.c,
          a = this.tx;
        return (
          (this.a = n * e - this.b * i),
          (this.b = n * i + this.b * e),
          (this.c = s * e - this.d * i),
          (this.d = s * i + this.d * e),
          (this.tx = a * e - this.ty * i),
          (this.ty = a * i + this.ty * e),
          this
        );
      }),
      (t.prototype.append = function (r) {
        var e = this.a,
          i = this.b,
          n = this.c,
          s = this.d;
        return (
          (this.a = r.a * e + r.b * n),
          (this.b = r.a * i + r.b * s),
          (this.c = r.c * e + r.d * n),
          (this.d = r.c * i + r.d * s),
          (this.tx = r.tx * e + r.ty * n + this.tx),
          (this.ty = r.tx * i + r.ty * s + this.ty),
          this
        );
      }),
      (t.prototype.setTransform = function (r, e, i, n, s, a, o, h, u) {
        return (
          (this.a = Math.cos(o + u) * s),
          (this.b = Math.sin(o + u) * s),
          (this.c = -Math.sin(o - h) * a),
          (this.d = Math.cos(o - h) * a),
          (this.tx = r - (i * this.a + n * this.c)),
          (this.ty = e - (i * this.b + n * this.d)),
          this
        );
      }),
      (t.prototype.prepend = function (r) {
        var e = this.tx;
        if (r.a !== 1 || r.b !== 0 || r.c !== 0 || r.d !== 1) {
          var i = this.a,
            n = this.c;
          (this.a = i * r.a + this.b * r.c),
            (this.b = i * r.b + this.b * r.d),
            (this.c = n * r.a + this.d * r.c),
            (this.d = n * r.b + this.d * r.d);
        }
        return (
          (this.tx = e * r.a + this.ty * r.c + r.tx),
          (this.ty = e * r.b + this.ty * r.d + r.ty),
          this
        );
      }),
      (t.prototype.decompose = function (r) {
        var e = this.a,
          i = this.b,
          n = this.c,
          s = this.d,
          a = r.pivot,
          o = -Math.atan2(-n, s),
          h = Math.atan2(i, e),
          u = Math.abs(o + h);
        return (
          u < 1e-5 || Math.abs(vr - u) < 1e-5
            ? ((r.rotation = h), (r.skew.x = r.skew.y = 0))
            : ((r.rotation = 0), (r.skew.x = o), (r.skew.y = h)),
          (r.scale.x = Math.sqrt(e * e + i * i)),
          (r.scale.y = Math.sqrt(n * n + s * s)),
          (r.position.x = this.tx + (a.x * e + a.y * n)),
          (r.position.y = this.ty + (a.x * i + a.y * s)),
          r
        );
      }),
      (t.prototype.invert = function () {
        var r = this.a,
          e = this.b,
          i = this.c,
          n = this.d,
          s = this.tx,
          a = r * n - e * i;
        return (
          (this.a = n / a),
          (this.b = -e / a),
          (this.c = -i / a),
          (this.d = r / a),
          (this.tx = (i * this.ty - n * s) / a),
          (this.ty = -(r * this.ty - e * s) / a),
          this
        );
      }),
      (t.prototype.identity = function () {
        return (
          (this.a = 1),
          (this.b = 0),
          (this.c = 0),
          (this.d = 1),
          (this.tx = 0),
          (this.ty = 0),
          this
        );
      }),
      (t.prototype.clone = function () {
        var r = new t();
        return (
          (r.a = this.a),
          (r.b = this.b),
          (r.c = this.c),
          (r.d = this.d),
          (r.tx = this.tx),
          (r.ty = this.ty),
          r
        );
      }),
      (t.prototype.copyTo = function (r) {
        return (
          (r.a = this.a),
          (r.b = this.b),
          (r.c = this.c),
          (r.d = this.d),
          (r.tx = this.tx),
          (r.ty = this.ty),
          r
        );
      }),
      (t.prototype.copyFrom = function (r) {
        return (
          (this.a = r.a),
          (this.b = r.b),
          (this.c = r.c),
          (this.d = r.d),
          (this.tx = r.tx),
          (this.ty = r.ty),
          this
        );
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Matrix a=" +
          this.a +
          " b=" +
          this.b +
          " c=" +
          this.c +
          " d=" +
          this.d +
          " tx=" +
          this.tx +
          " ty=" +
          this.ty +
          "]"
        );
      }),
      Object.defineProperty(t, "IDENTITY", {
        get: function () {
          return new t();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "TEMP_MATRIX", {
        get: function () {
          return new t();
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })(),
  re = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1],
  ie = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1],
  ne = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1],
  se = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1],
  di = [],
  Cs = [],
  mr = Math.sign;
function nc() {
  for (var t = 0; t < 16; t++) {
    var r = [];
    di.push(r);
    for (var e = 0; e < 16; e++)
      for (
        var i = mr(re[t] * re[e] + ne[t] * ie[e]),
          n = mr(ie[t] * re[e] + se[t] * ie[e]),
          s = mr(re[t] * ne[e] + ne[t] * se[e]),
          a = mr(ie[t] * ne[e] + se[t] * se[e]),
          o = 0;
        o < 16;
        o++
      )
        if (re[o] === i && ie[o] === n && ne[o] === s && se[o] === a) {
          r.push(o);
          break;
        }
  }
  for (var t = 0; t < 16; t++) {
    var h = new ut();
    h.set(re[t], ie[t], ne[t], se[t], 0, 0), Cs.push(h);
  }
}
nc();
var et = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MAIN_DIAGONAL: 10,
    MIRROR_HORIZONTAL: 12,
    REVERSE_DIAGONAL: 14,
    uX: function (t) {
      return re[t];
    },
    uY: function (t) {
      return ie[t];
    },
    vX: function (t) {
      return ne[t];
    },
    vY: function (t) {
      return se[t];
    },
    inv: function (t) {
      return t & 8 ? t & 15 : -t & 7;
    },
    add: function (t, r) {
      return di[t][r];
    },
    sub: function (t, r) {
      return di[t][et.inv(r)];
    },
    rotate180: function (t) {
      return t ^ 4;
    },
    isVertical: function (t) {
      return (t & 3) == 2;
    },
    byDirection: function (t, r) {
      return Math.abs(t) * 2 <= Math.abs(r)
        ? r >= 0
          ? et.S
          : et.N
        : Math.abs(r) * 2 <= Math.abs(t)
        ? t > 0
          ? et.E
          : et.W
        : r > 0
        ? t > 0
          ? et.SE
          : et.SW
        : t > 0
        ? et.NE
        : et.NW;
    },
    matrixAppendRotationInv: function (t, r, e, i) {
      e === void 0 && (e = 0), i === void 0 && (i = 0);
      var n = Cs[et.inv(r)];
      (n.tx = e), (n.ty = i), t.append(n);
    },
  },
  Ps = (function () {
    function t() {
      (this.worldTransform = new ut()),
        (this.localTransform = new ut()),
        (this.position = new Te(this.onChange, this, 0, 0)),
        (this.scale = new Te(this.onChange, this, 1, 1)),
        (this.pivot = new Te(this.onChange, this, 0, 0)),
        (this.skew = new Te(this.updateSkew, this, 0, 0)),
        (this._rotation = 0),
        (this._cx = 1),
        (this._sx = 0),
        (this._cy = 0),
        (this._sy = 1),
        (this._localID = 0),
        (this._currentLocalID = 0),
        (this._worldID = 0),
        (this._parentID = 0);
    }
    return (
      (t.prototype.onChange = function () {
        this._localID++;
      }),
      (t.prototype.updateSkew = function () {
        (this._cx = Math.cos(this._rotation + this.skew.y)),
          (this._sx = Math.sin(this._rotation + this.skew.y)),
          (this._cy = -Math.sin(this._rotation - this.skew.x)),
          (this._sy = Math.cos(this._rotation - this.skew.x)),
          this._localID++;
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/math:Transform " +
          ("position=(" + this.position.x + ", " + this.position.y + ") ") +
          ("rotation=" + this.rotation + " ") +
          ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") +
          ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") +
          "]"
        );
      }),
      (t.prototype.updateLocalTransform = function () {
        var r = this.localTransform;
        this._localID !== this._currentLocalID &&
          ((r.a = this._cx * this.scale.x),
          (r.b = this._sx * this.scale.x),
          (r.c = this._cy * this.scale.y),
          (r.d = this._sy * this.scale.y),
          (r.tx = this.position.x - (this.pivot.x * r.a + this.pivot.y * r.c)),
          (r.ty = this.position.y - (this.pivot.x * r.b + this.pivot.y * r.d)),
          (this._currentLocalID = this._localID),
          (this._parentID = -1));
      }),
      (t.prototype.updateTransform = function (r) {
        var e = this.localTransform;
        if (
          (this._localID !== this._currentLocalID &&
            ((e.a = this._cx * this.scale.x),
            (e.b = this._sx * this.scale.x),
            (e.c = this._cy * this.scale.y),
            (e.d = this._sy * this.scale.y),
            (e.tx =
              this.position.x - (this.pivot.x * e.a + this.pivot.y * e.c)),
            (e.ty =
              this.position.y - (this.pivot.x * e.b + this.pivot.y * e.d)),
            (this._currentLocalID = this._localID),
            (this._parentID = -1)),
          this._parentID !== r._worldID)
        ) {
          var i = r.worldTransform,
            n = this.worldTransform;
          (n.a = e.a * i.a + e.b * i.c),
            (n.b = e.a * i.b + e.b * i.d),
            (n.c = e.c * i.a + e.d * i.c),
            (n.d = e.c * i.b + e.d * i.d),
            (n.tx = e.tx * i.a + e.ty * i.c + i.tx),
            (n.ty = e.tx * i.b + e.ty * i.d + i.ty),
            (this._parentID = r._worldID),
            this._worldID++;
        }
      }),
      (t.prototype.setFromMatrix = function (r) {
        r.decompose(this), this._localID++;
      }),
      Object.defineProperty(t.prototype, "rotation", {
        get: function () {
          return this._rotation;
        },
        set: function (r) {
          this._rotation !== r && ((this._rotation = r), this.updateSkew());
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.IDENTITY = new t()),
      t
    );
  })();
/*!
 * @pixi/display - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/display is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ S.SORTABLE_CHILDREN = !1;
var ke = (function () {
  function t() {
    (this.minX = 1 / 0),
      (this.minY = 1 / 0),
      (this.maxX = -1 / 0),
      (this.maxY = -1 / 0),
      (this.rect = null),
      (this.updateID = -1);
  }
  return (
    (t.prototype.isEmpty = function () {
      return this.minX > this.maxX || this.minY > this.maxY;
    }),
    (t.prototype.clear = function () {
      (this.minX = 1 / 0),
        (this.minY = 1 / 0),
        (this.maxX = -1 / 0),
        (this.maxY = -1 / 0);
    }),
    (t.prototype.getRectangle = function (r) {
      return this.minX > this.maxX || this.minY > this.maxY
        ? z.EMPTY
        : ((r = r || new z(0, 0, 1, 1)),
          (r.x = this.minX),
          (r.y = this.minY),
          (r.width = this.maxX - this.minX),
          (r.height = this.maxY - this.minY),
          r);
    }),
    (t.prototype.addPoint = function (r) {
      (this.minX = Math.min(this.minX, r.x)),
        (this.maxX = Math.max(this.maxX, r.x)),
        (this.minY = Math.min(this.minY, r.y)),
        (this.maxY = Math.max(this.maxY, r.y));
    }),
    (t.prototype.addPointMatrix = function (r, e) {
      var i = r.a,
        n = r.b,
        s = r.c,
        a = r.d,
        o = r.tx,
        h = r.ty,
        u = i * e.x + s * e.y + o,
        f = n * e.x + a * e.y + h;
      (this.minX = Math.min(this.minX, u)),
        (this.maxX = Math.max(this.maxX, u)),
        (this.minY = Math.min(this.minY, f)),
        (this.maxY = Math.max(this.maxY, f));
    }),
    (t.prototype.addQuad = function (r) {
      var e = this.minX,
        i = this.minY,
        n = this.maxX,
        s = this.maxY,
        a = r[0],
        o = r[1];
      (e = a < e ? a : e),
        (i = o < i ? o : i),
        (n = a > n ? a : n),
        (s = o > s ? o : s),
        (a = r[2]),
        (o = r[3]),
        (e = a < e ? a : e),
        (i = o < i ? o : i),
        (n = a > n ? a : n),
        (s = o > s ? o : s),
        (a = r[4]),
        (o = r[5]),
        (e = a < e ? a : e),
        (i = o < i ? o : i),
        (n = a > n ? a : n),
        (s = o > s ? o : s),
        (a = r[6]),
        (o = r[7]),
        (e = a < e ? a : e),
        (i = o < i ? o : i),
        (n = a > n ? a : n),
        (s = o > s ? o : s),
        (this.minX = e),
        (this.minY = i),
        (this.maxX = n),
        (this.maxY = s);
    }),
    (t.prototype.addFrame = function (r, e, i, n, s) {
      this.addFrameMatrix(r.worldTransform, e, i, n, s);
    }),
    (t.prototype.addFrameMatrix = function (r, e, i, n, s) {
      var a = r.a,
        o = r.b,
        h = r.c,
        u = r.d,
        f = r.tx,
        c = r.ty,
        l = this.minX,
        d = this.minY,
        p = this.maxX,
        _ = this.maxY,
        v = a * e + h * i + f,
        m = o * e + u * i + c;
      (l = v < l ? v : l),
        (d = m < d ? m : d),
        (p = v > p ? v : p),
        (_ = m > _ ? m : _),
        (v = a * n + h * i + f),
        (m = o * n + u * i + c),
        (l = v < l ? v : l),
        (d = m < d ? m : d),
        (p = v > p ? v : p),
        (_ = m > _ ? m : _),
        (v = a * e + h * s + f),
        (m = o * e + u * s + c),
        (l = v < l ? v : l),
        (d = m < d ? m : d),
        (p = v > p ? v : p),
        (_ = m > _ ? m : _),
        (v = a * n + h * s + f),
        (m = o * n + u * s + c),
        (l = v < l ? v : l),
        (d = m < d ? m : d),
        (p = v > p ? v : p),
        (_ = m > _ ? m : _),
        (this.minX = l),
        (this.minY = d),
        (this.maxX = p),
        (this.maxY = _);
    }),
    (t.prototype.addVertexData = function (r, e, i) {
      for (
        var n = this.minX, s = this.minY, a = this.maxX, o = this.maxY, h = e;
        h < i;
        h += 2
      ) {
        var u = r[h],
          f = r[h + 1];
        (n = u < n ? u : n),
          (s = f < s ? f : s),
          (a = u > a ? u : a),
          (o = f > o ? f : o);
      }
      (this.minX = n), (this.minY = s), (this.maxX = a), (this.maxY = o);
    }),
    (t.prototype.addVertices = function (r, e, i, n) {
      this.addVerticesMatrix(r.worldTransform, e, i, n);
    }),
    (t.prototype.addVerticesMatrix = function (r, e, i, n, s, a) {
      s === void 0 && (s = 0), a === void 0 && (a = s);
      for (
        var o = r.a,
          h = r.b,
          u = r.c,
          f = r.d,
          c = r.tx,
          l = r.ty,
          d = this.minX,
          p = this.minY,
          _ = this.maxX,
          v = this.maxY,
          m = i;
        m < n;
        m += 2
      ) {
        var g = e[m],
          T = e[m + 1],
          I = o * g + u * T + c,
          x = f * T + h * g + l;
        (d = Math.min(d, I - s)),
          (_ = Math.max(_, I + s)),
          (p = Math.min(p, x - a)),
          (v = Math.max(v, x + a));
      }
      (this.minX = d), (this.minY = p), (this.maxX = _), (this.maxY = v);
    }),
    (t.prototype.addBounds = function (r) {
      var e = this.minX,
        i = this.minY,
        n = this.maxX,
        s = this.maxY;
      (this.minX = r.minX < e ? r.minX : e),
        (this.minY = r.minY < i ? r.minY : i),
        (this.maxX = r.maxX > n ? r.maxX : n),
        (this.maxY = r.maxY > s ? r.maxY : s);
    }),
    (t.prototype.addBoundsMask = function (r, e) {
      var i = r.minX > e.minX ? r.minX : e.minX,
        n = r.minY > e.minY ? r.minY : e.minY,
        s = r.maxX < e.maxX ? r.maxX : e.maxX,
        a = r.maxY < e.maxY ? r.maxY : e.maxY;
      if (i <= s && n <= a) {
        var o = this.minX,
          h = this.minY,
          u = this.maxX,
          f = this.maxY;
        (this.minX = i < o ? i : o),
          (this.minY = n < h ? n : h),
          (this.maxX = s > u ? s : u),
          (this.maxY = a > f ? a : f);
      }
    }),
    (t.prototype.addBoundsMatrix = function (r, e) {
      this.addFrameMatrix(e, r.minX, r.minY, r.maxX, r.maxY);
    }),
    (t.prototype.addBoundsArea = function (r, e) {
      var i = r.minX > e.x ? r.minX : e.x,
        n = r.minY > e.y ? r.minY : e.y,
        s = r.maxX < e.x + e.width ? r.maxX : e.x + e.width,
        a = r.maxY < e.y + e.height ? r.maxY : e.y + e.height;
      if (i <= s && n <= a) {
        var o = this.minX,
          h = this.minY,
          u = this.maxX,
          f = this.maxY;
        (this.minX = i < o ? i : o),
          (this.minY = n < h ? n : h),
          (this.maxX = s > u ? s : u),
          (this.maxY = a > f ? a : f);
      }
    }),
    (t.prototype.pad = function (r, e) {
      r === void 0 && (r = 0),
        e === void 0 && (e = r),
        this.isEmpty() ||
          ((this.minX -= r),
          (this.maxX += r),
          (this.minY -= e),
          (this.maxY += e));
    }),
    (t.prototype.addFramePad = function (r, e, i, n, s, a) {
      (r -= s),
        (e -= a),
        (i += s),
        (n += a),
        (this.minX = this.minX < r ? this.minX : r),
        (this.maxX = this.maxX > i ? this.maxX : i),
        (this.minY = this.minY < e ? this.minY : e),
        (this.maxY = this.maxY > n ? this.maxY : n);
    }),
    t
  );
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var pi =
  function (t, r) {
    return (
      (pi =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      pi(t, r)
    );
  };
function vi(t, r) {
  pi(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var ft = (function (t) {
    vi(r, t);
    function r() {
      var e = t.call(this) || this;
      return (
        (e.tempDisplayObjectParent = null),
        (e.transform = new Ps()),
        (e.alpha = 1),
        (e.visible = !0),
        (e.renderable = !0),
        (e.parent = null),
        (e.worldAlpha = 1),
        (e._lastSortedIndex = 0),
        (e._zIndex = 0),
        (e.filterArea = null),
        (e.filters = null),
        (e._enabledFilters = null),
        (e._bounds = new ke()),
        (e._localBounds = null),
        (e._boundsID = 0),
        (e._boundsRect = null),
        (e._localBoundsRect = null),
        (e._mask = null),
        (e._maskRefCount = 0),
        (e._destroyed = !1),
        (e.isSprite = !1),
        (e.isMask = !1),
        e
      );
    }
    return (
      (r.mixin = function (e) {
        for (var i = Object.keys(e), n = 0; n < i.length; ++n) {
          var s = i[n];
          Object.defineProperty(
            r.prototype,
            s,
            Object.getOwnPropertyDescriptor(e, s)
          );
        }
      }),
      Object.defineProperty(r.prototype, "destroyed", {
        get: function () {
          return this._destroyed;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype._recursivePostUpdateTransform = function () {
        this.parent
          ? (this.parent._recursivePostUpdateTransform(),
            this.transform.updateTransform(this.parent.transform))
          : this.transform.updateTransform(
              this._tempDisplayObjectParent.transform
            );
      }),
      (r.prototype.updateTransform = function () {
        this._boundsID++,
          this.transform.updateTransform(this.parent.transform),
          (this.worldAlpha = this.alpha * this.parent.worldAlpha);
      }),
      (r.prototype.getBounds = function (e, i) {
        return (
          e ||
            (this.parent
              ? (this._recursivePostUpdateTransform(), this.updateTransform())
              : ((this.parent = this._tempDisplayObjectParent),
                this.updateTransform(),
                (this.parent = null))),
          this._bounds.updateID !== this._boundsID &&
            (this.calculateBounds(), (this._bounds.updateID = this._boundsID)),
          i ||
            (this._boundsRect || (this._boundsRect = new z()),
            (i = this._boundsRect)),
          this._bounds.getRectangle(i)
        );
      }),
      (r.prototype.getLocalBounds = function (e) {
        e ||
          (this._localBoundsRect || (this._localBoundsRect = new z()),
          (e = this._localBoundsRect)),
          this._localBounds || (this._localBounds = new ke());
        var i = this.transform,
          n = this.parent;
        (this.parent = null),
          (this.transform = this._tempDisplayObjectParent.transform);
        var s = this._bounds,
          a = this._boundsID;
        this._bounds = this._localBounds;
        var o = this.getBounds(!1, e);
        return (
          (this.parent = n),
          (this.transform = i),
          (this._bounds = s),
          (this._bounds.updateID += this._boundsID - a),
          o
        );
      }),
      (r.prototype.toGlobal = function (e, i, n) {
        return (
          n === void 0 && (n = !1),
          n ||
            (this._recursivePostUpdateTransform(),
            this.parent
              ? this.displayObjectUpdateTransform()
              : ((this.parent = this._tempDisplayObjectParent),
                this.displayObjectUpdateTransform(),
                (this.parent = null))),
          this.worldTransform.apply(e, i)
        );
      }),
      (r.prototype.toLocal = function (e, i, n, s) {
        return (
          i && (e = i.toGlobal(e, n, s)),
          s ||
            (this._recursivePostUpdateTransform(),
            this.parent
              ? this.displayObjectUpdateTransform()
              : ((this.parent = this._tempDisplayObjectParent),
                this.displayObjectUpdateTransform(),
                (this.parent = null))),
          this.worldTransform.applyInverse(e, n)
        );
      }),
      (r.prototype.setParent = function (e) {
        if (!e || !e.addChild)
          throw new Error("setParent: Argument must be a Container");
        return e.addChild(this), e;
      }),
      (r.prototype.setTransform = function (e, i, n, s, a, o, h, u, f) {
        return (
          e === void 0 && (e = 0),
          i === void 0 && (i = 0),
          n === void 0 && (n = 1),
          s === void 0 && (s = 1),
          a === void 0 && (a = 0),
          o === void 0 && (o = 0),
          h === void 0 && (h = 0),
          u === void 0 && (u = 0),
          f === void 0 && (f = 0),
          (this.position.x = e),
          (this.position.y = i),
          (this.scale.x = n || 1),
          (this.scale.y = s || 1),
          (this.rotation = a),
          (this.skew.x = o),
          (this.skew.y = h),
          (this.pivot.x = u),
          (this.pivot.y = f),
          this
        );
      }),
      (r.prototype.destroy = function (e) {
        this.parent && this.parent.removeChild(this),
          this.emit("destroyed"),
          this.removeAllListeners(),
          (this.transform = null),
          (this.parent = null),
          (this._bounds = null),
          (this.mask = null),
          (this.filters = null),
          (this.filterArea = null),
          (this.hitArea = null),
          (this.interactive = !1),
          (this.interactiveChildren = !1),
          (this._destroyed = !0);
      }),
      Object.defineProperty(r.prototype, "_tempDisplayObjectParent", {
        get: function () {
          return (
            this.tempDisplayObjectParent === null &&
              (this.tempDisplayObjectParent = new As()),
            this.tempDisplayObjectParent
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.enableTempParent = function () {
        var e = this.parent;
        return (this.parent = this._tempDisplayObjectParent), e;
      }),
      (r.prototype.disableTempParent = function (e) {
        this.parent = e;
      }),
      Object.defineProperty(r.prototype, "x", {
        get: function () {
          return this.position.x;
        },
        set: function (e) {
          this.transform.position.x = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "y", {
        get: function () {
          return this.position.y;
        },
        set: function (e) {
          this.transform.position.y = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "worldTransform", {
        get: function () {
          return this.transform.worldTransform;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "localTransform", {
        get: function () {
          return this.transform.localTransform;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "position", {
        get: function () {
          return this.transform.position;
        },
        set: function (e) {
          this.transform.position.copyFrom(e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "scale", {
        get: function () {
          return this.transform.scale;
        },
        set: function (e) {
          this.transform.scale.copyFrom(e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "pivot", {
        get: function () {
          return this.transform.pivot;
        },
        set: function (e) {
          this.transform.pivot.copyFrom(e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "skew", {
        get: function () {
          return this.transform.skew;
        },
        set: function (e) {
          this.transform.skew.copyFrom(e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "rotation", {
        get: function () {
          return this.transform.rotation;
        },
        set: function (e) {
          this.transform.rotation = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "angle", {
        get: function () {
          return this.transform.rotation * Ql;
        },
        set: function (e) {
          this.transform.rotation = e * tc;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "zIndex", {
        get: function () {
          return this._zIndex;
        },
        set: function (e) {
          (this._zIndex = e), this.parent && (this.parent.sortDirty = !0);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "worldVisible", {
        get: function () {
          var e = this;
          do {
            if (!e.visible) return !1;
            e = e.parent;
          } while (e);
          return !0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "mask", {
        get: function () {
          return this._mask;
        },
        set: function (e) {
          if (this._mask !== e) {
            if (this._mask) {
              var i = this._mask.maskObject || this._mask;
              i._maskRefCount--,
                i._maskRefCount === 0 && ((i.renderable = !0), (i.isMask = !1));
            }
            if (((this._mask = e), this._mask)) {
              var i = this._mask.maskObject || this._mask;
              i._maskRefCount === 0 && ((i.renderable = !1), (i.isMask = !0)),
                i._maskRefCount++;
            }
          }
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(Ue),
  As = (function (t) {
    vi(r, t);
    function r() {
      var e = (t !== null && t.apply(this, arguments)) || this;
      return (e.sortDirty = null), e;
    }
    return r;
  })(ft);
ft.prototype.displayObjectUpdateTransform = ft.prototype.updateTransform;
/*!
 * @pixi/constants - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Ns;
(function (t) {
  (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.WEBGL2 = 2)] = "WEBGL2");
})(Ns || (Ns = {}));
var Os;
(function (t) {
  (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.CANVAS = 2)] = "CANVAS");
})(Os || (Os = {}));
var Ss;
(function (t) {
  (t[(t.COLOR = 16384)] = "COLOR"),
    (t[(t.DEPTH = 256)] = "DEPTH"),
    (t[(t.STENCIL = 1024)] = "STENCIL");
})(Ss || (Ss = {}));
var Us;
(function (t) {
  (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.ADD = 1)] = "ADD"),
    (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
    (t[(t.SCREEN = 3)] = "SCREEN"),
    (t[(t.OVERLAY = 4)] = "OVERLAY"),
    (t[(t.DARKEN = 5)] = "DARKEN"),
    (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
    (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
    (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
    (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
    (t[(t.HUE = 13)] = "HUE"),
    (t[(t.SATURATION = 14)] = "SATURATION"),
    (t[(t.COLOR = 15)] = "COLOR"),
    (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
    (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
    (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (t[(t.NONE = 20)] = "NONE"),
    (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
    (t[(t.SRC_IN = 21)] = "SRC_IN"),
    (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
    (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
    (t[(t.DST_OVER = 24)] = "DST_OVER"),
    (t[(t.DST_IN = 25)] = "DST_IN"),
    (t[(t.DST_OUT = 26)] = "DST_OUT"),
    (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
    (t[(t.ERASE = 26)] = "ERASE"),
    (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
    (t[(t.XOR = 29)] = "XOR");
})(Us || (Us = {}));
var Fs;
(function (t) {
  (t[(t.POINTS = 0)] = "POINTS"),
    (t[(t.LINES = 1)] = "LINES"),
    (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
    (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
    (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
    (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
})(Fs || (Fs = {}));
var Ls;
(function (t) {
  (t[(t.RGBA = 6408)] = "RGBA"),
    (t[(t.RGB = 6407)] = "RGB"),
    (t[(t.RG = 33319)] = "RG"),
    (t[(t.RED = 6403)] = "RED"),
    (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (t[(t.ALPHA = 6406)] = "ALPHA"),
    (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
    (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
})(Ls || (Ls = {}));
var Gs;
(function (t) {
  (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z");
})(Gs || (Gs = {}));
var Bs;
(function (t) {
  (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (t[(t.BYTE = 5120)] = "BYTE"),
    (t[(t.SHORT = 5122)] = "SHORT"),
    (t[(t.INT = 5124)] = "INT"),
    (t[(t.FLOAT = 5126)] = "FLOAT"),
    (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
})(Bs || (Bs = {}));
var Ms;
(function (t) {
  (t[(t.FLOAT = 0)] = "FLOAT"),
    (t[(t.INT = 1)] = "INT"),
    (t[(t.UINT = 2)] = "UINT");
})(Ms || (Ms = {}));
var Ds;
(function (t) {
  (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
})(Ds || (Ds = {}));
var ks;
(function (t) {
  (t[(t.CLAMP = 33071)] = "CLAMP"),
    (t[(t.REPEAT = 10497)] = "REPEAT"),
    (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
})(ks || (ks = {}));
var Xs;
(function (t) {
  (t[(t.OFF = 0)] = "OFF"),
    (t[(t.POW2 = 1)] = "POW2"),
    (t[(t.ON = 2)] = "ON"),
    (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
})(Xs || (Xs = {}));
var Hs;
(function (t) {
  (t[(t.NPM = 0)] = "NPM"),
    (t[(t.UNPACK = 1)] = "UNPACK"),
    (t[(t.PMA = 2)] = "PMA"),
    (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
})(Hs || (Hs = {}));
var Vs;
(function (t) {
  (t[(t.NO = 0)] = "NO"),
    (t[(t.YES = 1)] = "YES"),
    (t[(t.AUTO = 2)] = "AUTO"),
    (t[(t.BLEND = 0)] = "BLEND"),
    (t[(t.CLEAR = 1)] = "CLEAR"),
    (t[(t.BLIT = 2)] = "BLIT");
})(Vs || (Vs = {}));
var js;
(function (t) {
  (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
})(js || (js = {}));
var zs;
(function (t) {
  (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
})(zs || (zs = {}));
var _i;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.SCISSOR = 1)] = "SCISSOR"),
    (t[(t.STENCIL = 2)] = "STENCIL"),
    (t[(t.SPRITE = 3)] = "SPRITE");
})(_i || (_i = {}));
var Ws;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LOW = 2)] = "LOW"),
    (t[(t.MEDIUM = 4)] = "MEDIUM"),
    (t[(t.HIGH = 8)] = "HIGH");
})(Ws || (Ws = {}));
var Ys;
(function (t) {
  (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
    (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
})(Ys || (Ys = {}));
function sc(t, r) {
  return t.zIndex === r.zIndex
    ? t._lastSortedIndex - r._lastSortedIndex
    : t.zIndex - r.zIndex;
}
var Ft = (function (t) {
  vi(r, t);
  function r() {
    var e = t.call(this) || this;
    return (
      (e.children = []),
      (e.sortableChildren = S.SORTABLE_CHILDREN),
      (e.sortDirty = !1),
      e
    );
  }
  return (
    (r.prototype.onChildrenChange = function (e) {}),
    (r.prototype.addChild = function () {
      for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = e[n];
      if (i.length > 1) for (var s = 0; s < i.length; s++) this.addChild(i[s]);
      else {
        var a = i[0];
        a.parent && a.parent.removeChild(a),
          (a.parent = this),
          (this.sortDirty = !0),
          (a.transform._parentID = -1),
          this.children.push(a),
          this._boundsID++,
          this.onChildrenChange(this.children.length - 1),
          this.emit("childAdded", a, this, this.children.length - 1),
          a.emit("added", this);
      }
      return i[0];
    }),
    (r.prototype.addChildAt = function (e, i) {
      if (i < 0 || i > this.children.length)
        throw new Error(
          e +
            "addChildAt: The index " +
            i +
            " supplied is out of bounds " +
            this.children.length
        );
      return (
        e.parent && e.parent.removeChild(e),
        (e.parent = this),
        (this.sortDirty = !0),
        (e.transform._parentID = -1),
        this.children.splice(i, 0, e),
        this._boundsID++,
        this.onChildrenChange(i),
        e.emit("added", this),
        this.emit("childAdded", e, this, i),
        e
      );
    }),
    (r.prototype.swapChildren = function (e, i) {
      if (e !== i) {
        var n = this.getChildIndex(e),
          s = this.getChildIndex(i);
        (this.children[n] = i),
          (this.children[s] = e),
          this.onChildrenChange(n < s ? n : s);
      }
    }),
    (r.prototype.getChildIndex = function (e) {
      var i = this.children.indexOf(e);
      if (i === -1)
        throw new Error(
          "The supplied DisplayObject must be a child of the caller"
        );
      return i;
    }),
    (r.prototype.setChildIndex = function (e, i) {
      if (i < 0 || i >= this.children.length)
        throw new Error(
          "The index " +
            i +
            " supplied is out of bounds " +
            this.children.length
        );
      var n = this.getChildIndex(e);
      ge(this.children, n, 1),
        this.children.splice(i, 0, e),
        this.onChildrenChange(i);
    }),
    (r.prototype.getChildAt = function (e) {
      if (e < 0 || e >= this.children.length)
        throw new Error("getChildAt: Index (" + e + ") does not exist.");
      return this.children[e];
    }),
    (r.prototype.removeChild = function () {
      for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = e[n];
      if (i.length > 1)
        for (var s = 0; s < i.length; s++) this.removeChild(i[s]);
      else {
        var a = i[0],
          o = this.children.indexOf(a);
        if (o === -1) return null;
        (a.parent = null),
          (a.transform._parentID = -1),
          ge(this.children, o, 1),
          this._boundsID++,
          this.onChildrenChange(o),
          a.emit("removed", this),
          this.emit("childRemoved", a, this, o);
      }
      return i[0];
    }),
    (r.prototype.removeChildAt = function (e) {
      var i = this.getChildAt(e);
      return (
        (i.parent = null),
        (i.transform._parentID = -1),
        ge(this.children, e, 1),
        this._boundsID++,
        this.onChildrenChange(e),
        i.emit("removed", this),
        this.emit("childRemoved", i, this, e),
        i
      );
    }),
    (r.prototype.removeChildren = function (e, i) {
      e === void 0 && (e = 0), i === void 0 && (i = this.children.length);
      var n = e,
        s = i,
        a = s - n,
        o;
      if (a > 0 && a <= s) {
        o = this.children.splice(n, a);
        for (var h = 0; h < o.length; ++h)
          (o[h].parent = null),
            o[h].transform && (o[h].transform._parentID = -1);
        this._boundsID++, this.onChildrenChange(e);
        for (var h = 0; h < o.length; ++h)
          o[h].emit("removed", this), this.emit("childRemoved", o[h], this, h);
        return o;
      } else if (a === 0 && this.children.length === 0) return [];
      throw new RangeError(
        "removeChildren: numeric values are outside the acceptable range."
      );
    }),
    (r.prototype.sortChildren = function () {
      for (var e = !1, i = 0, n = this.children.length; i < n; ++i) {
        var s = this.children[i];
        (s._lastSortedIndex = i), !e && s.zIndex !== 0 && (e = !0);
      }
      e && this.children.length > 1 && this.children.sort(sc),
        (this.sortDirty = !1);
    }),
    (r.prototype.updateTransform = function () {
      this.sortableChildren && this.sortDirty && this.sortChildren(),
        this._boundsID++,
        this.transform.updateTransform(this.parent.transform),
        (this.worldAlpha = this.alpha * this.parent.worldAlpha);
      for (var e = 0, i = this.children.length; e < i; ++e) {
        var n = this.children[e];
        n.visible && n.updateTransform();
      }
    }),
    (r.prototype.calculateBounds = function () {
      this._bounds.clear(), this._calculateBounds();
      for (var e = 0; e < this.children.length; e++) {
        var i = this.children[e];
        if (!(!i.visible || !i.renderable))
          if ((i.calculateBounds(), i._mask)) {
            var n = i._mask.maskObject || i._mask;
            n.calculateBounds(),
              this._bounds.addBoundsMask(i._bounds, n._bounds);
          } else
            i.filterArea
              ? this._bounds.addBoundsArea(i._bounds, i.filterArea)
              : this._bounds.addBounds(i._bounds);
      }
      this._bounds.updateID = this._boundsID;
    }),
    (r.prototype.getLocalBounds = function (e, i) {
      i === void 0 && (i = !1);
      var n = t.prototype.getLocalBounds.call(this, e);
      if (!i)
        for (var s = 0, a = this.children.length; s < a; ++s) {
          var o = this.children[s];
          o.visible && o.updateTransform();
        }
      return n;
    }),
    (r.prototype._calculateBounds = function () {}),
    (r.prototype.render = function (e) {
      if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
        if (this._mask || (this.filters && this.filters.length))
          this.renderAdvanced(e);
        else {
          this._render(e);
          for (var i = 0, n = this.children.length; i < n; ++i)
            this.children[i].render(e);
        }
    }),
    (r.prototype.renderAdvanced = function (e) {
      var i = this.filters,
        n = this._mask;
      if (i) {
        this._enabledFilters || (this._enabledFilters = []),
          (this._enabledFilters.length = 0);
        for (var s = 0; s < i.length; s++)
          i[s].enabled && this._enabledFilters.push(i[s]);
      }
      var a =
        (i && this._enabledFilters && this._enabledFilters.length) ||
        (n &&
          (!n.isMaskData ||
            (n.enabled && (n.autoDetect || n.type !== _i.NONE))));
      a && e.batch.flush(),
        i &&
          this._enabledFilters &&
          this._enabledFilters.length &&
          e.filter.push(this, this._enabledFilters),
        n && e.mask.push(this, this._mask),
        this._render(e);
      for (var s = 0, o = this.children.length; s < o; s++)
        this.children[s].render(e);
      a && e.batch.flush(),
        n && e.mask.pop(this),
        i &&
          this._enabledFilters &&
          this._enabledFilters.length &&
          e.filter.pop();
    }),
    (r.prototype._render = function (e) {}),
    (r.prototype.destroy = function (e) {
      t.prototype.destroy.call(this), (this.sortDirty = !1);
      var i = typeof e == "boolean" ? e : e && e.children,
        n = this.removeChildren(0, this.children.length);
      if (i) for (var s = 0; s < n.length; ++s) n[s].destroy(e);
    }),
    Object.defineProperty(r.prototype, "width", {
      get: function () {
        return this.scale.x * this.getLocalBounds().width;
      },
      set: function (e) {
        var i = this.getLocalBounds().width;
        i !== 0 ? (this.scale.x = e / i) : (this.scale.x = 1),
          (this._width = e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "height", {
      get: function () {
        return this.scale.y * this.getLocalBounds().height;
      },
      set: function (e) {
        var i = this.getLocalBounds().height;
        i !== 0 ? (this.scale.y = e / i) : (this.scale.y = 1),
          (this._height = e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})(ft);
Ft.prototype.containerUpdateTransform = Ft.prototype.updateTransform;
/*!
 * @pixi/accessibility - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/accessibility is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var ac = {
  accessible: !1,
  accessibleTitle: null,
  accessibleHint: null,
  tabIndex: 0,
  _accessibleActive: !1,
  _accessibleDiv: null,
  accessibleType: "button",
  accessiblePointerEvents: "auto",
  accessibleChildren: !0,
  renderId: -1,
};
ft.mixin(ac);
var oc = 9,
  yr = 100,
  hc = 0,
  uc = 0,
  $s = 2,
  qs = 1,
  fc = -1e3,
  lc = -1e3,
  cc = 2,
  dc = (function () {
    function t(r) {
      (this.debug = !1),
        (this._isActive = !1),
        (this._isMobileAccessibility = !1),
        (this.pool = []),
        (this.renderId = 0),
        (this.children = []),
        (this.androidUpdateCount = 0),
        (this.androidUpdateFrequency = 500),
        (this._hookDiv = null),
        (At.tablet || At.phone) && this.createTouchHook();
      var e = document.createElement("div");
      (e.style.width = yr + "px"),
        (e.style.height = yr + "px"),
        (e.style.position = "absolute"),
        (e.style.top = hc + "px"),
        (e.style.left = uc + "px"),
        (e.style.zIndex = $s.toString()),
        (this.div = e),
        (this.renderer = r),
        (this._onKeyDown = this._onKeyDown.bind(this)),
        (this._onMouseMove = this._onMouseMove.bind(this)),
        self.addEventListener("keydown", this._onKeyDown, !1);
    }
    return (
      Object.defineProperty(t.prototype, "isActive", {
        get: function () {
          return this._isActive;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "isMobileAccessibility", {
        get: function () {
          return this._isMobileAccessibility;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.createTouchHook = function () {
        var r = this,
          e = document.createElement("button");
        (e.style.width = qs + "px"),
          (e.style.height = qs + "px"),
          (e.style.position = "absolute"),
          (e.style.top = fc + "px"),
          (e.style.left = lc + "px"),
          (e.style.zIndex = cc.toString()),
          (e.style.backgroundColor = "#FF0000"),
          (e.title = "select to enable accessibility for this content"),
          e.addEventListener("focus", function () {
            (r._isMobileAccessibility = !0), r.activate(), r.destroyTouchHook();
          }),
          document.body.appendChild(e),
          (this._hookDiv = e);
      }),
      (t.prototype.destroyTouchHook = function () {
        !this._hookDiv ||
          (document.body.removeChild(this._hookDiv), (this._hookDiv = null));
      }),
      (t.prototype.activate = function () {
        var r;
        this._isActive ||
          ((this._isActive = !0),
          self.document.addEventListener("mousemove", this._onMouseMove, !0),
          self.removeEventListener("keydown", this._onKeyDown, !1),
          this.renderer.on("postrender", this.update, this),
          (r = this.renderer.view.parentNode) === null ||
            r === void 0 ||
            r.appendChild(this.div));
      }),
      (t.prototype.deactivate = function () {
        var r;
        !this._isActive ||
          this._isMobileAccessibility ||
          ((this._isActive = !1),
          self.document.removeEventListener("mousemove", this._onMouseMove, !0),
          self.addEventListener("keydown", this._onKeyDown, !1),
          this.renderer.off("postrender", this.update),
          (r = this.div.parentNode) === null ||
            r === void 0 ||
            r.removeChild(this.div));
      }),
      (t.prototype.updateAccessibleObjects = function (r) {
        if (!(!r.visible || !r.accessibleChildren)) {
          r.accessible &&
            r.interactive &&
            (r._accessibleActive || this.addChild(r),
            (r.renderId = this.renderId));
          var e = r.children;
          if (e)
            for (var i = 0; i < e.length; i++)
              this.updateAccessibleObjects(e[i]);
        }
      }),
      (t.prototype.update = function () {
        var r = performance.now();
        if (
          !(At.android.device && r < this.androidUpdateCount) &&
          ((this.androidUpdateCount = r + this.androidUpdateFrequency),
          !!this.renderer.renderingToScreen)
        ) {
          this.renderer._lastObjectRendered &&
            this.updateAccessibleObjects(this.renderer._lastObjectRendered);
          var e = this.renderer.view.getBoundingClientRect(),
            i = e.left,
            n = e.top,
            s = e.width,
            a = e.height,
            o = this.renderer,
            h = o.width,
            u = o.height,
            f = o.resolution,
            c = (s / h) * f,
            l = (a / u) * f,
            d = this.div;
          (d.style.left = i + "px"),
            (d.style.top = n + "px"),
            (d.style.width = h + "px"),
            (d.style.height = u + "px");
          for (var p = 0; p < this.children.length; p++) {
            var _ = this.children[p];
            if (_.renderId !== this.renderId)
              (_._accessibleActive = !1),
                ge(this.children, p, 1),
                this.div.removeChild(_._accessibleDiv),
                this.pool.push(_._accessibleDiv),
                (_._accessibleDiv = null),
                p--;
            else {
              d = _._accessibleDiv;
              var v = _.hitArea,
                m = _.worldTransform;
              _.hitArea
                ? ((d.style.left = (m.tx + v.x * m.a) * c + "px"),
                  (d.style.top = (m.ty + v.y * m.d) * l + "px"),
                  (d.style.width = v.width * m.a * c + "px"),
                  (d.style.height = v.height * m.d * l + "px"))
                : ((v = _.getBounds()),
                  this.capHitArea(v),
                  (d.style.left = v.x * c + "px"),
                  (d.style.top = v.y * l + "px"),
                  (d.style.width = v.width * c + "px"),
                  (d.style.height = v.height * l + "px"),
                  d.title !== _.accessibleTitle &&
                    _.accessibleTitle !== null &&
                    (d.title = _.accessibleTitle),
                  d.getAttribute("aria-label") !== _.accessibleHint &&
                    _.accessibleHint !== null &&
                    d.setAttribute("aria-label", _.accessibleHint)),
                (_.accessibleTitle !== d.title || _.tabIndex !== d.tabIndex) &&
                  ((d.title = _.accessibleTitle),
                  (d.tabIndex = _.tabIndex),
                  this.debug && this.updateDebugHTML(d));
            }
          }
          this.renderId++;
        }
      }),
      (t.prototype.updateDebugHTML = function (r) {
        r.innerHTML =
          "type: " +
          r.type +
          "</br> title : " +
          r.title +
          "</br> tabIndex: " +
          r.tabIndex;
      }),
      (t.prototype.capHitArea = function (r) {
        r.x < 0 && ((r.width += r.x), (r.x = 0)),
          r.y < 0 && ((r.height += r.y), (r.y = 0));
        var e = this.renderer,
          i = e.width,
          n = e.height;
        r.x + r.width > i && (r.width = i - r.x),
          r.y + r.height > n && (r.height = n - r.y);
      }),
      (t.prototype.addChild = function (r) {
        var e = this.pool.pop();
        e ||
          ((e = document.createElement("button")),
          (e.style.width = yr + "px"),
          (e.style.height = yr + "px"),
          (e.style.backgroundColor = this.debug
            ? "rgba(255,255,255,0.5)"
            : "transparent"),
          (e.style.position = "absolute"),
          (e.style.zIndex = $s.toString()),
          (e.style.borderStyle = "none"),
          navigator.userAgent.toLowerCase().indexOf("chrome") > -1
            ? e.setAttribute("aria-live", "off")
            : e.setAttribute("aria-live", "polite"),
          navigator.userAgent.match(/rv:.*Gecko\//)
            ? e.setAttribute("aria-relevant", "additions")
            : e.setAttribute("aria-relevant", "text"),
          e.addEventListener("click", this._onClick.bind(this)),
          e.addEventListener("focus", this._onFocus.bind(this)),
          e.addEventListener("focusout", this._onFocusOut.bind(this))),
          (e.style.pointerEvents = r.accessiblePointerEvents),
          (e.type = r.accessibleType),
          r.accessibleTitle && r.accessibleTitle !== null
            ? (e.title = r.accessibleTitle)
            : (!r.accessibleHint || r.accessibleHint === null) &&
              (e.title = "displayObject " + r.tabIndex),
          r.accessibleHint &&
            r.accessibleHint !== null &&
            e.setAttribute("aria-label", r.accessibleHint),
          this.debug && this.updateDebugHTML(e),
          (r._accessibleActive = !0),
          (r._accessibleDiv = e),
          (e.displayObject = r),
          this.children.push(r),
          this.div.appendChild(r._accessibleDiv),
          (r._accessibleDiv.tabIndex = r.tabIndex);
      }),
      (t.prototype._onClick = function (r) {
        var e = this.renderer.plugins.interaction,
          i = r.target.displayObject,
          n = e.eventData;
        e.dispatchEvent(i, "click", n),
          e.dispatchEvent(i, "pointertap", n),
          e.dispatchEvent(i, "tap", n);
      }),
      (t.prototype._onFocus = function (r) {
        r.target.getAttribute("aria-live") ||
          r.target.setAttribute("aria-live", "assertive");
        var e = this.renderer.plugins.interaction,
          i = r.target.displayObject,
          n = e.eventData;
        e.dispatchEvent(i, "mouseover", n);
      }),
      (t.prototype._onFocusOut = function (r) {
        r.target.getAttribute("aria-live") ||
          r.target.setAttribute("aria-live", "polite");
        var e = this.renderer.plugins.interaction,
          i = r.target.displayObject,
          n = e.eventData;
        e.dispatchEvent(i, "mouseout", n);
      }),
      (t.prototype._onKeyDown = function (r) {
        r.keyCode === oc && this.activate();
      }),
      (t.prototype._onMouseMove = function (r) {
        (r.movementX === 0 && r.movementY === 0) || this.deactivate();
      }),
      (t.prototype.destroy = function () {
        this.destroyTouchHook(),
          (this.div = null),
          self.document.removeEventListener("mousemove", this._onMouseMove, !0),
          self.removeEventListener("keydown", this._onKeyDown),
          (this.pool = null),
          (this.children = null),
          (this.renderer = null);
      }),
      t
    );
  })();
/*!
 * @pixi/ticker - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/ticker is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ S.TARGET_FPMS = 0.06;
var Xt;
(function (t) {
  (t[(t.INTERACTION = 50)] = "INTERACTION"),
    (t[(t.HIGH = 25)] = "HIGH"),
    (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.LOW = -25)] = "LOW"),
    (t[(t.UTILITY = -50)] = "UTILITY");
})(Xt || (Xt = {}));
var mi = (function () {
    function t(r, e, i, n) {
      e === void 0 && (e = null),
        i === void 0 && (i = 0),
        n === void 0 && (n = !1),
        (this.next = null),
        (this.previous = null),
        (this._destroyed = !1),
        (this.fn = r),
        (this.context = e),
        (this.priority = i),
        (this.once = n);
    }
    return (
      (t.prototype.match = function (r, e) {
        return e === void 0 && (e = null), this.fn === r && this.context === e;
      }),
      (t.prototype.emit = function (r) {
        this.fn && (this.context ? this.fn.call(this.context, r) : this.fn(r));
        var e = this.next;
        return (
          this.once && this.destroy(!0),
          this._destroyed && (this.next = null),
          e
        );
      }),
      (t.prototype.connect = function (r) {
        (this.previous = r),
          r.next && (r.next.previous = this),
          (this.next = r.next),
          (r.next = this);
      }),
      (t.prototype.destroy = function (r) {
        r === void 0 && (r = !1),
          (this._destroyed = !0),
          (this.fn = null),
          (this.context = null),
          this.previous && (this.previous.next = this.next),
          this.next && (this.next.previous = this.previous);
        var e = this.next;
        return (this.next = r ? null : e), (this.previous = null), e;
      }),
      t
    );
  })(),
  mt = (function () {
    function t() {
      var r = this;
      (this.autoStart = !1),
        (this.deltaTime = 1),
        (this.lastTime = -1),
        (this.speed = 1),
        (this.started = !1),
        (this._requestId = null),
        (this._maxElapsedMS = 100),
        (this._minElapsedMS = 0),
        (this._protected = !1),
        (this._lastFrame = -1),
        (this._head = new mi(null, null, 1 / 0)),
        (this.deltaMS = 1 / S.TARGET_FPMS),
        (this.elapsedMS = 1 / S.TARGET_FPMS),
        (this._tick = function (e) {
          (r._requestId = null),
            r.started &&
              (r.update(e),
              r.started &&
                r._requestId === null &&
                r._head.next &&
                (r._requestId = requestAnimationFrame(r._tick)));
        });
    }
    return (
      (t.prototype._requestIfNeeded = function () {
        this._requestId === null &&
          this._head.next &&
          ((this.lastTime = performance.now()),
          (this._lastFrame = this.lastTime),
          (this._requestId = requestAnimationFrame(this._tick)));
      }),
      (t.prototype._cancelIfNeeded = function () {
        this._requestId !== null &&
          (cancelAnimationFrame(this._requestId), (this._requestId = null));
      }),
      (t.prototype._startIfPossible = function () {
        this.started ? this._requestIfNeeded() : this.autoStart && this.start();
      }),
      (t.prototype.add = function (r, e, i) {
        return (
          i === void 0 && (i = Xt.NORMAL), this._addListener(new mi(r, e, i))
        );
      }),
      (t.prototype.addOnce = function (r, e, i) {
        return (
          i === void 0 && (i = Xt.NORMAL),
          this._addListener(new mi(r, e, i, !0))
        );
      }),
      (t.prototype._addListener = function (r) {
        var e = this._head.next,
          i = this._head;
        if (!e) r.connect(i);
        else {
          for (; e; ) {
            if (r.priority > e.priority) {
              r.connect(i);
              break;
            }
            (i = e), (e = e.next);
          }
          r.previous || r.connect(i);
        }
        return this._startIfPossible(), this;
      }),
      (t.prototype.remove = function (r, e) {
        for (var i = this._head.next; i; )
          i.match(r, e) ? (i = i.destroy()) : (i = i.next);
        return this._head.next || this._cancelIfNeeded(), this;
      }),
      Object.defineProperty(t.prototype, "count", {
        get: function () {
          if (!this._head) return 0;
          for (var r = 0, e = this._head; (e = e.next); ) r++;
          return r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.start = function () {
        this.started || ((this.started = !0), this._requestIfNeeded());
      }),
      (t.prototype.stop = function () {
        this.started && ((this.started = !1), this._cancelIfNeeded());
      }),
      (t.prototype.destroy = function () {
        if (!this._protected) {
          this.stop();
          for (var r = this._head.next; r; ) r = r.destroy(!0);
          this._head.destroy(), (this._head = null);
        }
      }),
      (t.prototype.update = function (r) {
        r === void 0 && (r = performance.now());
        var e;
        if (r > this.lastTime) {
          if (
            ((e = this.elapsedMS = r - this.lastTime),
            e > this._maxElapsedMS && (e = this._maxElapsedMS),
            (e *= this.speed),
            this._minElapsedMS)
          ) {
            var i = (r - this._lastFrame) | 0;
            if (i < this._minElapsedMS) return;
            this._lastFrame = r - (i % this._minElapsedMS);
          }
          (this.deltaMS = e), (this.deltaTime = this.deltaMS * S.TARGET_FPMS);
          for (var n = this._head, s = n.next; s; ) s = s.emit(this.deltaTime);
          n.next || this._cancelIfNeeded();
        } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        this.lastTime = r;
      }),
      Object.defineProperty(t.prototype, "FPS", {
        get: function () {
          return 1e3 / this.elapsedMS;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "minFPS", {
        get: function () {
          return 1e3 / this._maxElapsedMS;
        },
        set: function (r) {
          var e = Math.min(this.maxFPS, r),
            i = Math.min(Math.max(0, e) / 1e3, S.TARGET_FPMS);
          this._maxElapsedMS = 1 / i;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "maxFPS", {
        get: function () {
          return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
        },
        set: function (r) {
          if (r === 0) this._minElapsedMS = 0;
          else {
            var e = Math.max(this.minFPS, r);
            this._minElapsedMS = 1 / (e / 1e3);
          }
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "shared", {
        get: function () {
          if (!t._shared) {
            var r = (t._shared = new t());
            (r.autoStart = !0), (r._protected = !0);
          }
          return t._shared;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "system", {
        get: function () {
          if (!t._system) {
            var r = (t._system = new t());
            (r.autoStart = !0), (r._protected = !0);
          }
          return t._system;
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })(),
  pc = (function () {
    function t() {}
    return (
      (t.init = function (r) {
        var e = this;
        (r = Object.assign({ autoStart: !0, sharedTicker: !1 }, r)),
          Object.defineProperty(this, "ticker", {
            set: function (i) {
              this._ticker && this._ticker.remove(this.render, this),
                (this._ticker = i),
                i && i.add(this.render, this, Xt.LOW);
            },
            get: function () {
              return this._ticker;
            },
          }),
          (this.stop = function () {
            e._ticker.stop();
          }),
          (this.start = function () {
            e._ticker.start();
          }),
          (this._ticker = null),
          (this.ticker = r.sharedTicker ? mt.shared : new mt()),
          r.autoStart && this.start();
      }),
      (t.destroy = function () {
        if (this._ticker) {
          var r = this._ticker;
          (this.ticker = null), r.destroy();
        }
      }),
      t
    );
  })();
/*!
 * @pixi/interaction - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/interaction is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Zs = (function () {
  function t() {
    (this.pressure = 0),
      (this.rotationAngle = 0),
      (this.twist = 0),
      (this.tangentialPressure = 0),
      (this.global = new ht()),
      (this.target = null),
      (this.originalEvent = null),
      (this.identifier = null),
      (this.isPrimary = !1),
      (this.button = 0),
      (this.buttons = 0),
      (this.width = 0),
      (this.height = 0),
      (this.tiltX = 0),
      (this.tiltY = 0),
      (this.pointerType = null),
      (this.pressure = 0),
      (this.rotationAngle = 0),
      (this.twist = 0),
      (this.tangentialPressure = 0);
  }
  return (
    Object.defineProperty(t.prototype, "pointerId", {
      get: function () {
        return this.identifier;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (t.prototype.getLocalPosition = function (r, e, i) {
      return r.worldTransform.applyInverse(i || this.global, e);
    }),
    (t.prototype.copyEvent = function (r) {
      "isPrimary" in r && r.isPrimary && (this.isPrimary = !0),
        (this.button = "button" in r && r.button);
      var e = "buttons" in r && r.buttons;
      (this.buttons = Number.isInteger(e) ? e : "which" in r && r.which),
        (this.width = "width" in r && r.width),
        (this.height = "height" in r && r.height),
        (this.tiltX = "tiltX" in r && r.tiltX),
        (this.tiltY = "tiltY" in r && r.tiltY),
        (this.pointerType = "pointerType" in r && r.pointerType),
        (this.pressure = "pressure" in r && r.pressure),
        (this.rotationAngle = "rotationAngle" in r && r.rotationAngle),
        (this.twist = ("twist" in r && r.twist) || 0),
        (this.tangentialPressure =
          ("tangentialPressure" in r && r.tangentialPressure) || 0);
    }),
    (t.prototype.reset = function () {
      this.isPrimary = !1;
    }),
    t
  );
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var yi =
  function (t, r) {
    return (
      (yi =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      yi(t, r)
    );
  };
function vc(t, r) {
  yi(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var _c = (function () {
    function t() {
      (this.stopped = !1),
        (this.stopsPropagatingAt = null),
        (this.stopPropagationHint = !1),
        (this.target = null),
        (this.currentTarget = null),
        (this.type = null),
        (this.data = null);
    }
    return (
      (t.prototype.stopPropagation = function () {
        (this.stopped = !0),
          (this.stopPropagationHint = !0),
          (this.stopsPropagatingAt = this.currentTarget);
      }),
      (t.prototype.reset = function () {
        (this.stopped = !1),
          (this.stopsPropagatingAt = null),
          (this.stopPropagationHint = !1),
          (this.currentTarget = null),
          (this.target = null);
      }),
      t
    );
  })(),
  gi = (function () {
    function t(r) {
      (this._pointerId = r), (this._flags = t.FLAGS.NONE);
    }
    return (
      (t.prototype._doSet = function (r, e) {
        e ? (this._flags = this._flags | r) : (this._flags = this._flags & ~r);
      }),
      Object.defineProperty(t.prototype, "pointerId", {
        get: function () {
          return this._pointerId;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "flags", {
        get: function () {
          return this._flags;
        },
        set: function (r) {
          this._flags = r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "none", {
        get: function () {
          return this._flags === t.FLAGS.NONE;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "over", {
        get: function () {
          return (this._flags & t.FLAGS.OVER) != 0;
        },
        set: function (r) {
          this._doSet(t.FLAGS.OVER, r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "rightDown", {
        get: function () {
          return (this._flags & t.FLAGS.RIGHT_DOWN) != 0;
        },
        set: function (r) {
          this._doSet(t.FLAGS.RIGHT_DOWN, r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "leftDown", {
        get: function () {
          return (this._flags & t.FLAGS.LEFT_DOWN) != 0;
        },
        set: function (r) {
          this._doSet(t.FLAGS.LEFT_DOWN, r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.FLAGS = Object.freeze({
        NONE: 0,
        OVER: 1 << 0,
        LEFT_DOWN: 1 << 1,
        RIGHT_DOWN: 1 << 2,
      })),
      t
    );
  })(),
  mc = (function () {
    function t() {
      this._tempPoint = new ht();
    }
    return (
      (t.prototype.recursiveFindHit = function (r, e, i, n, s) {
        if (!e || !e.visible) return !1;
        var a = r.data.global;
        s = e.interactive || s;
        var o = !1,
          h = s,
          u = !0;
        if (
          (e.hitArea
            ? (n &&
                (e.worldTransform.applyInverse(a, this._tempPoint),
                e.hitArea.contains(this._tempPoint.x, this._tempPoint.y)
                  ? (o = !0)
                  : ((n = !1), (u = !1))),
              (h = !1))
            : e._mask &&
              n &&
              ((e._mask.containsPoint && e._mask.containsPoint(a)) || (n = !1)),
          u && e.interactiveChildren && e.children)
        )
          for (var f = e.children, c = f.length - 1; c >= 0; c--) {
            var l = f[c],
              d = this.recursiveFindHit(r, l, i, n, h);
            if (d) {
              if (!l.parent) continue;
              (h = !1), d && (r.target && (n = !1), (o = !0));
            }
          }
        return (
          s &&
            (n &&
              !r.target &&
              !e.hitArea &&
              e.containsPoint &&
              e.containsPoint(a) &&
              (o = !0),
            e.interactive &&
              (o && !r.target && (r.target = e), i && i(r, e, !!o))),
          o
        );
      }),
      (t.prototype.findHit = function (r, e, i, n) {
        this.recursiveFindHit(r, e, i, n, !1);
      }),
      t
    );
  })(),
  yc = {
    interactive: !1,
    interactiveChildren: !0,
    hitArea: null,
    get buttonMode() {
      return this.cursor === "pointer";
    },
    set buttonMode(t) {
      t
        ? (this.cursor = "pointer")
        : this.cursor === "pointer" && (this.cursor = null);
    },
    cursor: null,
    get trackedPointers() {
      return (
        this._trackedPointers === void 0 && (this._trackedPointers = {}),
        this._trackedPointers
      );
    },
    _trackedPointers: void 0,
  };
ft.mixin(yc);
var gr = 1,
  xr = { target: null, data: { global: null } },
  gc = (function (t) {
    vc(r, t);
    function r(e, i) {
      var n = t.call(this) || this;
      return (
        (i = i || {}),
        (n.renderer = e),
        (n.autoPreventDefault =
          i.autoPreventDefault !== void 0 ? i.autoPreventDefault : !0),
        (n.interactionFrequency = i.interactionFrequency || 10),
        (n.mouse = new Zs()),
        (n.mouse.identifier = gr),
        n.mouse.global.set(-999999),
        (n.activeInteractionData = {}),
        (n.activeInteractionData[gr] = n.mouse),
        (n.interactionDataPool = []),
        (n.eventData = new _c()),
        (n.interactionDOMElement = null),
        (n.moveWhenInside = !1),
        (n.eventsAdded = !1),
        (n.tickerAdded = !1),
        (n.mouseOverRenderer = !("PointerEvent" in self)),
        (n.supportsTouchEvents = "ontouchstart" in self),
        (n.supportsPointerEvents = !!self.PointerEvent),
        (n.onPointerUp = n.onPointerUp.bind(n)),
        (n.processPointerUp = n.processPointerUp.bind(n)),
        (n.onPointerCancel = n.onPointerCancel.bind(n)),
        (n.processPointerCancel = n.processPointerCancel.bind(n)),
        (n.onPointerDown = n.onPointerDown.bind(n)),
        (n.processPointerDown = n.processPointerDown.bind(n)),
        (n.onPointerMove = n.onPointerMove.bind(n)),
        (n.processPointerMove = n.processPointerMove.bind(n)),
        (n.onPointerOut = n.onPointerOut.bind(n)),
        (n.processPointerOverOut = n.processPointerOverOut.bind(n)),
        (n.onPointerOver = n.onPointerOver.bind(n)),
        (n.cursorStyles = { default: "inherit", pointer: "pointer" }),
        (n.currentCursorMode = null),
        (n.cursor = null),
        (n.resolution = 1),
        (n.delayedEvents = []),
        (n.search = new mc()),
        (n._tempDisplayObject = new As()),
        (n._eventListenerOptions = { capture: !0, passive: !1 }),
        (n._useSystemTicker =
          i.useSystemTicker !== void 0 ? i.useSystemTicker : !0),
        n.setTargetElement(n.renderer.view, n.renderer.resolution),
        n
      );
    }
    return (
      Object.defineProperty(r.prototype, "useSystemTicker", {
        get: function () {
          return this._useSystemTicker;
        },
        set: function (e) {
          (this._useSystemTicker = e),
            e ? this.addTickerListener() : this.removeTickerListener();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "lastObjectRendered", {
        get: function () {
          return this.renderer._lastObjectRendered || this._tempDisplayObject;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.hitTest = function (e, i) {
        return (
          (xr.target = null),
          (xr.data.global = e),
          i || (i = this.lastObjectRendered),
          this.processInteractive(xr, i, null, !0),
          xr.target
        );
      }),
      (r.prototype.setTargetElement = function (e, i) {
        i === void 0 && (i = 1),
          this.removeTickerListener(),
          this.removeEvents(),
          (this.interactionDOMElement = e),
          (this.resolution = i),
          this.addEvents(),
          this.addTickerListener();
      }),
      (r.prototype.addTickerListener = function () {
        this.tickerAdded ||
          !this.interactionDOMElement ||
          !this._useSystemTicker ||
          (mt.system.add(this.tickerUpdate, this, Xt.INTERACTION),
          (this.tickerAdded = !0));
      }),
      (r.prototype.removeTickerListener = function () {
        !this.tickerAdded ||
          (mt.system.remove(this.tickerUpdate, this), (this.tickerAdded = !1));
      }),
      (r.prototype.addEvents = function () {
        if (!(this.eventsAdded || !this.interactionDOMElement)) {
          var e = this.interactionDOMElement.style;
          self.navigator.msPointerEnabled
            ? ((e.msContentZooming = "none"), (e.msTouchAction = "none"))
            : this.supportsPointerEvents && (e.touchAction = "none"),
            this.supportsPointerEvents
              ? (self.document.addEventListener(
                  "pointermove",
                  this.onPointerMove,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "pointerdown",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "pointerleave",
                  this.onPointerOut,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "pointerover",
                  this.onPointerOver,
                  this._eventListenerOptions
                ),
                self.addEventListener(
                  "pointercancel",
                  this.onPointerCancel,
                  this._eventListenerOptions
                ),
                self.addEventListener(
                  "pointerup",
                  this.onPointerUp,
                  this._eventListenerOptions
                ))
              : (self.document.addEventListener(
                  "mousemove",
                  this.onPointerMove,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "mousedown",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "mouseout",
                  this.onPointerOut,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "mouseover",
                  this.onPointerOver,
                  this._eventListenerOptions
                ),
                self.addEventListener(
                  "mouseup",
                  this.onPointerUp,
                  this._eventListenerOptions
                )),
            this.supportsTouchEvents &&
              (this.interactionDOMElement.addEventListener(
                "touchstart",
                this.onPointerDown,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.addEventListener(
                "touchcancel",
                this.onPointerCancel,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.addEventListener(
                "touchend",
                this.onPointerUp,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.addEventListener(
                "touchmove",
                this.onPointerMove,
                this._eventListenerOptions
              )),
            (this.eventsAdded = !0);
        }
      }),
      (r.prototype.removeEvents = function () {
        if (!(!this.eventsAdded || !this.interactionDOMElement)) {
          var e = this.interactionDOMElement.style;
          self.navigator.msPointerEnabled
            ? ((e.msContentZooming = ""), (e.msTouchAction = ""))
            : this.supportsPointerEvents && (e.touchAction = ""),
            this.supportsPointerEvents
              ? (self.document.removeEventListener(
                  "pointermove",
                  this.onPointerMove,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "pointerdown",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "pointerleave",
                  this.onPointerOut,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "pointerover",
                  this.onPointerOver,
                  this._eventListenerOptions
                ),
                self.removeEventListener(
                  "pointercancel",
                  this.onPointerCancel,
                  this._eventListenerOptions
                ),
                self.removeEventListener(
                  "pointerup",
                  this.onPointerUp,
                  this._eventListenerOptions
                ))
              : (self.document.removeEventListener(
                  "mousemove",
                  this.onPointerMove,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "mousedown",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "mouseout",
                  this.onPointerOut,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "mouseover",
                  this.onPointerOver,
                  this._eventListenerOptions
                ),
                self.removeEventListener(
                  "mouseup",
                  this.onPointerUp,
                  this._eventListenerOptions
                )),
            this.supportsTouchEvents &&
              (this.interactionDOMElement.removeEventListener(
                "touchstart",
                this.onPointerDown,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.removeEventListener(
                "touchcancel",
                this.onPointerCancel,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.removeEventListener(
                "touchend",
                this.onPointerUp,
                this._eventListenerOptions
              ),
              this.interactionDOMElement.removeEventListener(
                "touchmove",
                this.onPointerMove,
                this._eventListenerOptions
              )),
            (this.interactionDOMElement = null),
            (this.eventsAdded = !1);
        }
      }),
      (r.prototype.tickerUpdate = function (e) {
        (this._deltaTime += e),
          !(this._deltaTime < this.interactionFrequency) &&
            ((this._deltaTime = 0), this.update());
      }),
      (r.prototype.update = function () {
        if (!!this.interactionDOMElement) {
          if (this._didMove) {
            this._didMove = !1;
            return;
          }
          this.cursor = null;
          for (var e in this.activeInteractionData)
            if (this.activeInteractionData.hasOwnProperty(e)) {
              var i = this.activeInteractionData[e];
              if (i.originalEvent && i.pointerType !== "touch") {
                var n = this.configureInteractionEventForDOMEvent(
                  this.eventData,
                  i.originalEvent,
                  i
                );
                this.processInteractive(
                  n,
                  this.lastObjectRendered,
                  this.processPointerOverOut,
                  !0
                );
              }
            }
          this.setCursorMode(this.cursor);
        }
      }),
      (r.prototype.setCursorMode = function (e) {
        e = e || "default";
        var i = !0;
        if (
          (self.OffscreenCanvas &&
            this.interactionDOMElement instanceof OffscreenCanvas &&
            (i = !1),
          this.currentCursorMode !== e)
        ) {
          this.currentCursorMode = e;
          var n = this.cursorStyles[e];
          if (n)
            switch (typeof n) {
              case "string":
                i && (this.interactionDOMElement.style.cursor = n);
                break;
              case "function":
                n(e);
                break;
              case "object":
                i && Object.assign(this.interactionDOMElement.style, n);
                break;
            }
          else
            i &&
              typeof e == "string" &&
              !Object.prototype.hasOwnProperty.call(this.cursorStyles, e) &&
              (this.interactionDOMElement.style.cursor = e);
        }
      }),
      (r.prototype.dispatchEvent = function (e, i, n) {
        (!n.stopPropagationHint || e === n.stopsPropagatingAt) &&
          ((n.currentTarget = e), (n.type = i), e.emit(i, n), e[i] && e[i](n));
      }),
      (r.prototype.delayDispatchEvent = function (e, i, n) {
        this.delayedEvents.push({
          displayObject: e,
          eventString: i,
          eventData: n,
        });
      }),
      (r.prototype.mapPositionToPoint = function (e, i, n) {
        var s;
        this.interactionDOMElement.parentElement
          ? (s = this.interactionDOMElement.getBoundingClientRect())
          : (s = {
              x: 0,
              y: 0,
              width: this.interactionDOMElement.width,
              height: this.interactionDOMElement.height,
              left: 0,
              top: 0,
            });
        var a = 1 / this.resolution;
        (e.x = (i - s.left) * (this.interactionDOMElement.width / s.width) * a),
          (e.y =
            (n - s.top) * (this.interactionDOMElement.height / s.height) * a);
      }),
      (r.prototype.processInteractive = function (e, i, n, s) {
        var a = this.search.findHit(e, i, n, s),
          o = this.delayedEvents;
        if (!o.length) return a;
        e.stopPropagationHint = !1;
        var h = o.length;
        this.delayedEvents = [];
        for (var u = 0; u < h; u++) {
          var f = o[u],
            c = f.displayObject,
            l = f.eventString,
            d = f.eventData;
          d.stopsPropagatingAt === c && (d.stopPropagationHint = !0),
            this.dispatchEvent(c, l, d);
        }
        return a;
      }),
      (r.prototype.onPointerDown = function (e) {
        if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
          var i = this.normalizeToPointerData(e);
          if (this.autoPreventDefault && i[0].isNormalized) {
            var n = e.cancelable || !("cancelable" in e);
            n && e.preventDefault();
          }
          for (var s = i.length, a = 0; a < s; a++) {
            var o = i[a],
              h = this.getInteractionDataForPointerId(o),
              u = this.configureInteractionEventForDOMEvent(
                this.eventData,
                o,
                h
              );
            if (
              ((u.data.originalEvent = e),
              this.processInteractive(
                u,
                this.lastObjectRendered,
                this.processPointerDown,
                !0
              ),
              this.emit("pointerdown", u),
              o.pointerType === "touch")
            )
              this.emit("touchstart", u);
            else if (o.pointerType === "mouse" || o.pointerType === "pen") {
              var f = o.button === 2;
              this.emit(f ? "rightdown" : "mousedown", this.eventData);
            }
          }
        }
      }),
      (r.prototype.processPointerDown = function (e, i, n) {
        var s = e.data,
          a = e.data.identifier;
        if (n) {
          if (
            (i.trackedPointers[a] || (i.trackedPointers[a] = new gi(a)),
            this.dispatchEvent(i, "pointerdown", e),
            s.pointerType === "touch")
          )
            this.dispatchEvent(i, "touchstart", e);
          else if (s.pointerType === "mouse" || s.pointerType === "pen") {
            var o = s.button === 2;
            o
              ? (i.trackedPointers[a].rightDown = !0)
              : (i.trackedPointers[a].leftDown = !0),
              this.dispatchEvent(i, o ? "rightdown" : "mousedown", e);
          }
        }
      }),
      (r.prototype.onPointerComplete = function (e, i, n) {
        for (
          var s = this.normalizeToPointerData(e),
            a = s.length,
            o = e.target !== this.interactionDOMElement ? "outside" : "",
            h = 0;
          h < a;
          h++
        ) {
          var u = s[h],
            f = this.getInteractionDataForPointerId(u),
            c = this.configureInteractionEventForDOMEvent(this.eventData, u, f);
          if (
            ((c.data.originalEvent = e),
            this.processInteractive(c, this.lastObjectRendered, n, i || !o),
            this.emit(i ? "pointercancel" : "pointerup" + o, c),
            u.pointerType === "mouse" || u.pointerType === "pen")
          ) {
            var l = u.button === 2;
            this.emit(l ? "rightup" + o : "mouseup" + o, c);
          } else
            u.pointerType === "touch" &&
              (this.emit(i ? "touchcancel" : "touchend" + o, c),
              this.releaseInteractionDataForPointerId(u.pointerId));
        }
      }),
      (r.prototype.onPointerCancel = function (e) {
        (this.supportsTouchEvents && e.pointerType === "touch") ||
          this.onPointerComplete(e, !0, this.processPointerCancel);
      }),
      (r.prototype.processPointerCancel = function (e, i) {
        var n = e.data,
          s = e.data.identifier;
        i.trackedPointers[s] !== void 0 &&
          (delete i.trackedPointers[s],
          this.dispatchEvent(i, "pointercancel", e),
          n.pointerType === "touch" && this.dispatchEvent(i, "touchcancel", e));
      }),
      (r.prototype.onPointerUp = function (e) {
        (this.supportsTouchEvents && e.pointerType === "touch") ||
          this.onPointerComplete(e, !1, this.processPointerUp);
      }),
      (r.prototype.processPointerUp = function (e, i, n) {
        var s = e.data,
          a = e.data.identifier,
          o = i.trackedPointers[a],
          h = s.pointerType === "touch",
          u = s.pointerType === "mouse" || s.pointerType === "pen",
          f = !1;
        if (u) {
          var c = s.button === 2,
            l = gi.FLAGS,
            d = c ? l.RIGHT_DOWN : l.LEFT_DOWN,
            p = o !== void 0 && o.flags & d;
          n
            ? (this.dispatchEvent(i, c ? "rightup" : "mouseup", e),
              p &&
                (this.dispatchEvent(i, c ? "rightclick" : "click", e),
                (f = !0)))
            : p &&
              this.dispatchEvent(i, c ? "rightupoutside" : "mouseupoutside", e),
            o && (c ? (o.rightDown = !1) : (o.leftDown = !1));
        }
        n
          ? (this.dispatchEvent(i, "pointerup", e),
            h && this.dispatchEvent(i, "touchend", e),
            o &&
              ((!u || f) && this.dispatchEvent(i, "pointertap", e),
              h && (this.dispatchEvent(i, "tap", e), (o.over = !1))))
          : o &&
            (this.dispatchEvent(i, "pointerupoutside", e),
            h && this.dispatchEvent(i, "touchendoutside", e)),
          o && o.none && delete i.trackedPointers[a];
      }),
      (r.prototype.onPointerMove = function (e) {
        if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
          var i = this.normalizeToPointerData(e);
          (i[0].pointerType === "mouse" || i[0].pointerType === "pen") &&
            ((this._didMove = !0), (this.cursor = null));
          for (var n = i.length, s = 0; s < n; s++) {
            var a = i[s],
              o = this.getInteractionDataForPointerId(a),
              h = this.configureInteractionEventForDOMEvent(
                this.eventData,
                a,
                o
              );
            (h.data.originalEvent = e),
              this.processInteractive(
                h,
                this.lastObjectRendered,
                this.processPointerMove,
                !0
              ),
              this.emit("pointermove", h),
              a.pointerType === "touch" && this.emit("touchmove", h),
              (a.pointerType === "mouse" || a.pointerType === "pen") &&
                this.emit("mousemove", h);
          }
          i[0].pointerType === "mouse" && this.setCursorMode(this.cursor);
        }
      }),
      (r.prototype.processPointerMove = function (e, i, n) {
        var s = e.data,
          a = s.pointerType === "touch",
          o = s.pointerType === "mouse" || s.pointerType === "pen";
        o && this.processPointerOverOut(e, i, n),
          (!this.moveWhenInside || n) &&
            (this.dispatchEvent(i, "pointermove", e),
            a && this.dispatchEvent(i, "touchmove", e),
            o && this.dispatchEvent(i, "mousemove", e));
      }),
      (r.prototype.onPointerOut = function (e) {
        if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
          var i = this.normalizeToPointerData(e),
            n = i[0];
          n.pointerType === "mouse" &&
            ((this.mouseOverRenderer = !1), this.setCursorMode(null));
          var s = this.getInteractionDataForPointerId(n),
            a = this.configureInteractionEventForDOMEvent(this.eventData, n, s);
          (a.data.originalEvent = n),
            this.processInteractive(
              a,
              this.lastObjectRendered,
              this.processPointerOverOut,
              !1
            ),
            this.emit("pointerout", a),
            n.pointerType === "mouse" || n.pointerType === "pen"
              ? this.emit("mouseout", a)
              : this.releaseInteractionDataForPointerId(s.identifier);
        }
      }),
      (r.prototype.processPointerOverOut = function (e, i, n) {
        var s = e.data,
          a = e.data.identifier,
          o = s.pointerType === "mouse" || s.pointerType === "pen",
          h = i.trackedPointers[a];
        n && !h && (h = i.trackedPointers[a] = new gi(a)),
          h !== void 0 &&
            (n && this.mouseOverRenderer
              ? (h.over ||
                  ((h.over = !0),
                  this.delayDispatchEvent(i, "pointerover", e),
                  o && this.delayDispatchEvent(i, "mouseover", e)),
                o && this.cursor === null && (this.cursor = i.cursor))
              : h.over &&
                ((h.over = !1),
                this.dispatchEvent(i, "pointerout", this.eventData),
                o && this.dispatchEvent(i, "mouseout", e),
                h.none && delete i.trackedPointers[a]));
      }),
      (r.prototype.onPointerOver = function (e) {
        var i = this.normalizeToPointerData(e),
          n = i[0],
          s = this.getInteractionDataForPointerId(n),
          a = this.configureInteractionEventForDOMEvent(this.eventData, n, s);
        (a.data.originalEvent = n),
          n.pointerType === "mouse" && (this.mouseOverRenderer = !0),
          this.emit("pointerover", a),
          (n.pointerType === "mouse" || n.pointerType === "pen") &&
            this.emit("mouseover", a);
      }),
      (r.prototype.getInteractionDataForPointerId = function (e) {
        var i = e.pointerId,
          n;
        return (
          i === gr || e.pointerType === "mouse"
            ? (n = this.mouse)
            : this.activeInteractionData[i]
            ? (n = this.activeInteractionData[i])
            : ((n = this.interactionDataPool.pop() || new Zs()),
              (n.identifier = i),
              (this.activeInteractionData[i] = n)),
          n.copyEvent(e),
          n
        );
      }),
      (r.prototype.releaseInteractionDataForPointerId = function (e) {
        var i = this.activeInteractionData[e];
        i &&
          (delete this.activeInteractionData[e],
          i.reset(),
          this.interactionDataPool.push(i));
      }),
      (r.prototype.configureInteractionEventForDOMEvent = function (e, i, n) {
        return (
          (e.data = n),
          this.mapPositionToPoint(n.global, i.clientX, i.clientY),
          i.pointerType === "touch" &&
            ((i.globalX = n.global.x), (i.globalY = n.global.y)),
          (n.originalEvent = i),
          e.reset(),
          e
        );
      }),
      (r.prototype.normalizeToPointerData = function (e) {
        var i = [];
        if (this.supportsTouchEvents && e instanceof TouchEvent)
          for (var n = 0, s = e.changedTouches.length; n < s; n++) {
            var a = e.changedTouches[n];
            typeof a.button == "undefined" &&
              (a.button = e.touches.length ? 1 : 0),
              typeof a.buttons == "undefined" &&
                (a.buttons = e.touches.length ? 1 : 0),
              typeof a.isPrimary == "undefined" &&
                (a.isPrimary =
                  e.touches.length === 1 && e.type === "touchstart"),
              typeof a.width == "undefined" && (a.width = a.radiusX || 1),
              typeof a.height == "undefined" && (a.height = a.radiusY || 1),
              typeof a.tiltX == "undefined" && (a.tiltX = 0),
              typeof a.tiltY == "undefined" && (a.tiltY = 0),
              typeof a.pointerType == "undefined" && (a.pointerType = "touch"),
              typeof a.pointerId == "undefined" &&
                (a.pointerId = a.identifier || 0),
              typeof a.pressure == "undefined" && (a.pressure = a.force || 0.5),
              typeof a.twist == "undefined" && (a.twist = 0),
              typeof a.tangentialPressure == "undefined" &&
                (a.tangentialPressure = 0),
              typeof a.layerX == "undefined" &&
                (a.layerX = a.offsetX = a.clientX),
              typeof a.layerY == "undefined" &&
                (a.layerY = a.offsetY = a.clientY),
              (a.isNormalized = !0),
              i.push(a);
          }
        else if (
          !self.MouseEvent ||
          (e instanceof MouseEvent &&
            (!this.supportsPointerEvents || !(e instanceof self.PointerEvent)))
        ) {
          var o = e;
          typeof o.isPrimary == "undefined" && (o.isPrimary = !0),
            typeof o.width == "undefined" && (o.width = 1),
            typeof o.height == "undefined" && (o.height = 1),
            typeof o.tiltX == "undefined" && (o.tiltX = 0),
            typeof o.tiltY == "undefined" && (o.tiltY = 0),
            typeof o.pointerType == "undefined" && (o.pointerType = "mouse"),
            typeof o.pointerId == "undefined" && (o.pointerId = gr),
            typeof o.pressure == "undefined" && (o.pressure = 0.5),
            typeof o.twist == "undefined" && (o.twist = 0),
            typeof o.tangentialPressure == "undefined" &&
              (o.tangentialPressure = 0),
            (o.isNormalized = !0),
            i.push(o);
        } else i.push(e);
        return i;
      }),
      (r.prototype.destroy = function () {
        this.removeEvents(),
          this.removeTickerListener(),
          this.removeAllListeners(),
          (this.renderer = null),
          (this.mouse = null),
          (this.eventData = null),
          (this.interactionDOMElement = null),
          (this.onPointerDown = null),
          (this.processPointerDown = null),
          (this.onPointerUp = null),
          (this.processPointerUp = null),
          (this.onPointerCancel = null),
          (this.processPointerCancel = null),
          (this.onPointerMove = null),
          (this.processPointerMove = null),
          (this.onPointerOut = null),
          (this.processPointerOverOut = null),
          (this.onPointerOver = null),
          (this.search = null);
      }),
      r
    );
  })(Ue);
/*!
 * @pixi/runner - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/runner is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Tt = (function () {
  function t(r) {
    (this.items = []), (this._name = r), (this._aliasCount = 0);
  }
  return (
    (t.prototype.emit = function (r, e, i, n, s, a, o, h) {
      if (arguments.length > 8) throw new Error("max arguments reached");
      var u = this,
        f = u.name,
        c = u.items;
      this._aliasCount++;
      for (var l = 0, d = c.length; l < d; l++) c[l][f](r, e, i, n, s, a, o, h);
      return c === this.items && this._aliasCount--, this;
    }),
    (t.prototype.ensureNonAliasedItems = function () {
      this._aliasCount > 0 &&
        this.items.length > 1 &&
        ((this._aliasCount = 0), (this.items = this.items.slice(0)));
    }),
    (t.prototype.add = function (r) {
      return (
        r[this._name] &&
          (this.ensureNonAliasedItems(), this.remove(r), this.items.push(r)),
        this
      );
    }),
    (t.prototype.remove = function (r) {
      var e = this.items.indexOf(r);
      return (
        e !== -1 && (this.ensureNonAliasedItems(), this.items.splice(e, 1)),
        this
      );
    }),
    (t.prototype.contains = function (r) {
      return this.items.indexOf(r) !== -1;
    }),
    (t.prototype.removeAll = function () {
      return this.ensureNonAliasedItems(), (this.items.length = 0), this;
    }),
    (t.prototype.destroy = function () {
      this.removeAll(), (this.items = null), (this._name = null);
    }),
    Object.defineProperty(t.prototype, "empty", {
      get: function () {
        return this.items.length === 0;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, "name", {
      get: function () {
        return this._name;
      },
      enumerable: !1,
      configurable: !0,
    }),
    t
  );
})();
Object.defineProperties(Tt.prototype, {
  dispatch: { value: Tt.prototype.emit },
  run: { value: Tt.prototype.emit },
});
/*!
 * @pixi/core - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ S.PREFER_ENV = At.any ? Bt.WEBGL : Bt.WEBGL2;
S.STRICT_TEXTURE_CACHE = !1;
var Tr = [];
function xi(t, r) {
  if (!t) return null;
  var e = "";
  if (typeof t == "string") {
    var i = /\.(\w{3,4})(?:$|\?|#)/i.exec(t);
    i && (e = i[1].toLowerCase());
  }
  for (var n = Tr.length - 1; n >= 0; --n) {
    var s = Tr[n];
    if (s.test && s.test(t, e)) return new s(t, r);
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var Ti =
  function (t, r) {
    return (
      (Ti =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      Ti(t, r)
    );
  };
function K(t, r) {
  Ti(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var bi = function () {
  return (
    (bi =
      Object.assign ||
      function (r) {
        for (var e = arguments, i, n = 1, s = arguments.length; n < s; n++) {
          i = e[n];
          for (var a in i)
            Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
        }
        return r;
      }),
    bi.apply(this, arguments)
  );
};
function xc(t, r) {
  var e = {};
  for (var i in t)
    Object.prototype.hasOwnProperty.call(t, i) &&
      r.indexOf(i) < 0 &&
      (e[i] = t[i]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, i = Object.getOwnPropertySymbols(t); n < i.length; n++)
      r.indexOf(i[n]) < 0 && (e[i[n]] = t[i[n]]);
  return e;
}
var be = (function () {
    function t(r, e) {
      r === void 0 && (r = 0),
        e === void 0 && (e = 0),
        (this._width = r),
        (this._height = e),
        (this.destroyed = !1),
        (this.internal = !1),
        (this.onResize = new Tt("setRealSize")),
        (this.onUpdate = new Tt("update")),
        (this.onError = new Tt("onError"));
    }
    return (
      (t.prototype.bind = function (r) {
        this.onResize.add(r),
          this.onUpdate.add(r),
          this.onError.add(r),
          (this._width || this._height) &&
            this.onResize.emit(this._width, this._height);
      }),
      (t.prototype.unbind = function (r) {
        this.onResize.remove(r),
          this.onUpdate.remove(r),
          this.onError.remove(r);
      }),
      (t.prototype.resize = function (r, e) {
        (r !== this._width || e !== this._height) &&
          ((this._width = r), (this._height = e), this.onResize.emit(r, e));
      }),
      Object.defineProperty(t.prototype, "valid", {
        get: function () {
          return !!this._width && !!this._height;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.update = function () {
        this.destroyed || this.onUpdate.emit();
      }),
      (t.prototype.load = function () {
        return Promise.resolve(this);
      }),
      Object.defineProperty(t.prototype, "width", {
        get: function () {
          return this._width;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "height", {
        get: function () {
          return this._height;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.style = function (r, e, i) {
        return !1;
      }),
      (t.prototype.dispose = function () {}),
      (t.prototype.destroy = function () {
        this.destroyed ||
          ((this.destroyed = !0),
          this.dispose(),
          this.onError.removeAll(),
          (this.onError = null),
          this.onResize.removeAll(),
          (this.onResize = null),
          this.onUpdate.removeAll(),
          (this.onUpdate = null));
      }),
      (t.test = function (r, e) {
        return !1;
      }),
      t
    );
  })(),
  Xe = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this,
        s = i || {},
        a = s.width,
        o = s.height;
      if (!a || !o) throw new Error("BufferResource width or height invalid");
      return (n = t.call(this, a, o) || this), (n.data = e), n;
    }
    return (
      (r.prototype.upload = function (e, i, n) {
        var s = e.gl;
        s.pixelStorei(
          s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
          i.alphaMode === Ot.UNPACK
        );
        var a = i.realWidth,
          o = i.realHeight;
        return (
          n.width === a && n.height === o
            ? s.texSubImage2D(
                i.target,
                0,
                0,
                0,
                a,
                o,
                i.format,
                n.type,
                this.data
              )
            : ((n.width = a),
              (n.height = o),
              s.texImage2D(
                i.target,
                0,
                n.internalFormat,
                a,
                o,
                0,
                i.format,
                n.type,
                this.data
              )),
          !0
        );
      }),
      (r.prototype.dispose = function () {
        this.data = null;
      }),
      (r.test = function (e) {
        return (
          e instanceof Float32Array ||
          e instanceof Uint8Array ||
          e instanceof Uint32Array
        );
      }),
      r
    );
  })(be),
  Tc = { scaleMode: Mt.NEAREST, format: w.RGBA, alphaMode: Ot.NPM },
  W = (function (t) {
    K(r, t);
    function r(e, i) {
      e === void 0 && (e = null), i === void 0 && (i = null);
      var n = t.call(this) || this;
      i = i || {};
      var s = i.alphaMode,
        a = i.mipmap,
        o = i.anisotropicLevel,
        h = i.scaleMode,
        u = i.width,
        f = i.height,
        c = i.wrapMode,
        l = i.format,
        d = i.type,
        p = i.target,
        _ = i.resolution,
        v = i.resourceOptions;
      return (
        e && !(e instanceof be) && ((e = xi(e, v)), (e.internal = !0)),
        (n.resolution = _ || S.RESOLUTION),
        (n.width = Math.round((u || 0) * n.resolution) / n.resolution),
        (n.height = Math.round((f || 0) * n.resolution) / n.resolution),
        (n._mipmap = a !== void 0 ? a : S.MIPMAP_TEXTURES),
        (n.anisotropicLevel = o !== void 0 ? o : S.ANISOTROPIC_LEVEL),
        (n._wrapMode = c || S.WRAP_MODE),
        (n._scaleMode = h !== void 0 ? h : S.SCALE_MODE),
        (n.format = l || w.RGBA),
        (n.type = d || G.UNSIGNED_BYTE),
        (n.target = p || Jt.TEXTURE_2D),
        (n.alphaMode = s !== void 0 ? s : Ot.UNPACK),
        (n.uid = Qt()),
        (n.touched = 0),
        (n.isPowerOfTwo = !1),
        n._refreshPOT(),
        (n._glTextures = {}),
        (n.dirtyId = 0),
        (n.dirtyStyleId = 0),
        (n.cacheId = null),
        (n.valid = u > 0 && f > 0),
        (n.textureCacheIds = []),
        (n.destroyed = !1),
        (n.resource = null),
        (n._batchEnabled = 0),
        (n._batchLocation = 0),
        (n.parentTextureArray = null),
        n.setResource(e),
        n
      );
    }
    return (
      Object.defineProperty(r.prototype, "realWidth", {
        get: function () {
          return Math.round(this.width * this.resolution);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "realHeight", {
        get: function () {
          return Math.round(this.height * this.resolution);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "mipmap", {
        get: function () {
          return this._mipmap;
        },
        set: function (e) {
          this._mipmap !== e && ((this._mipmap = e), this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "scaleMode", {
        get: function () {
          return this._scaleMode;
        },
        set: function (e) {
          this._scaleMode !== e && ((this._scaleMode = e), this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "wrapMode", {
        get: function () {
          return this._wrapMode;
        },
        set: function (e) {
          this._wrapMode !== e && ((this._wrapMode = e), this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.setStyle = function (e, i) {
        var n;
        return (
          e !== void 0 &&
            e !== this.scaleMode &&
            ((this.scaleMode = e), (n = !0)),
          i !== void 0 && i !== this.mipmap && ((this.mipmap = i), (n = !0)),
          n && this.dirtyStyleId++,
          this
        );
      }),
      (r.prototype.setSize = function (e, i, n) {
        return (n = n || this.resolution), this.setRealSize(e * n, i * n, n);
      }),
      (r.prototype.setRealSize = function (e, i, n) {
        return (
          (this.resolution = n || this.resolution),
          (this.width = Math.round(e) / this.resolution),
          (this.height = Math.round(i) / this.resolution),
          this._refreshPOT(),
          this.update(),
          this
        );
      }),
      (r.prototype._refreshPOT = function () {
        this.isPowerOfTwo = bs(this.realWidth) && bs(this.realHeight);
      }),
      (r.prototype.setResolution = function (e) {
        var i = this.resolution;
        return i === e
          ? this
          : ((this.resolution = e),
            this.valid &&
              ((this.width = Math.round(this.width * i) / e),
              (this.height = Math.round(this.height * i) / e),
              this.emit("update", this)),
            this._refreshPOT(),
            this);
      }),
      (r.prototype.setResource = function (e) {
        if (this.resource === e) return this;
        if (this.resource) throw new Error("Resource can be set only once");
        return e.bind(this), (this.resource = e), this;
      }),
      (r.prototype.update = function () {
        this.valid
          ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this))
          : this.width > 0 &&
            this.height > 0 &&
            ((this.valid = !0),
            this.emit("loaded", this),
            this.emit("update", this));
      }),
      (r.prototype.onError = function (e) {
        this.emit("error", this, e);
      }),
      (r.prototype.destroy = function () {
        this.resource &&
          (this.resource.unbind(this),
          this.resource.internal && this.resource.destroy(),
          (this.resource = null)),
          this.cacheId &&
            (delete ee[this.cacheId],
            delete kt[this.cacheId],
            (this.cacheId = null)),
          this.dispose(),
          r.removeFromCache(this),
          (this.textureCacheIds = null),
          (this.destroyed = !0);
      }),
      (r.prototype.dispose = function () {
        this.emit("dispose", this);
      }),
      (r.prototype.castToBaseTexture = function () {
        return this;
      }),
      (r.from = function (e, i, n) {
        n === void 0 && (n = S.STRICT_TEXTURE_CACHE);
        var s = typeof e == "string",
          a = null;
        if (s) a = e;
        else {
          if (!e._pixiId) {
            var o = (i && i.pixiIdPrefix) || "pixiid";
            e._pixiId = o + "_" + Qt();
          }
          a = e._pixiId;
        }
        var h = ee[a];
        if (s && n && !h)
          throw new Error(
            'The cacheId "' + a + '" does not exist in BaseTextureCache.'
          );
        return h || ((h = new r(e, i)), (h.cacheId = a), r.addToCache(h, a)), h;
      }),
      (r.fromBuffer = function (e, i, n, s) {
        e = e || new Float32Array(i * n * 4);
        var a = new Xe(e, { width: i, height: n }),
          o = e instanceof Float32Array ? G.FLOAT : G.UNSIGNED_BYTE;
        return new r(
          a,
          Object.assign(Tc, s || { width: i, height: n, type: o })
        );
      }),
      (r.addToCache = function (e, i) {
        i &&
          (e.textureCacheIds.indexOf(i) === -1 && e.textureCacheIds.push(i),
          ee[i] &&
            console.warn(
              "BaseTexture added to the cache with an id [" +
                i +
                "] that already had an entry"
            ),
          (ee[i] = e));
      }),
      (r.removeFromCache = function (e) {
        if (typeof e == "string") {
          var i = ee[e];
          if (i) {
            var n = i.textureCacheIds.indexOf(e);
            return n > -1 && i.textureCacheIds.splice(n, 1), delete ee[e], i;
          }
        } else if (e && e.textureCacheIds) {
          for (var s = 0; s < e.textureCacheIds.length; ++s)
            delete ee[e.textureCacheIds[s]];
          return (e.textureCacheIds.length = 0), e;
        }
        return null;
      }),
      (r._globalBatch = 0),
      r
    );
  })(Ue),
  Ei = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this,
        s = i || {},
        a = s.width,
        o = s.height;
      (n = t.call(this, a, o) || this), (n.items = []), (n.itemDirtyIds = []);
      for (var h = 0; h < e; h++) {
        var u = new W();
        n.items.push(u), n.itemDirtyIds.push(-2);
      }
      return (n.length = e), (n._load = null), (n.baseTexture = null), n;
    }
    return (
      (r.prototype.initFromArray = function (e, i) {
        for (var n = 0; n < this.length; n++)
          !e[n] ||
            (e[n].castToBaseTexture
              ? this.addBaseTextureAt(e[n].castToBaseTexture(), n)
              : e[n] instanceof be
              ? this.addResourceAt(e[n], n)
              : this.addResourceAt(xi(e[n], i), n));
      }),
      (r.prototype.dispose = function () {
        for (var e = 0, i = this.length; e < i; e++) this.items[e].destroy();
        (this.items = null), (this.itemDirtyIds = null), (this._load = null);
      }),
      (r.prototype.addResourceAt = function (e, i) {
        if (!this.items[i]) throw new Error("Index " + i + " is out of bounds");
        return (
          e.valid && !this.valid && this.resize(e.width, e.height),
          this.items[i].setResource(e),
          this
        );
      }),
      (r.prototype.bind = function (e) {
        if (this.baseTexture !== null)
          throw new Error("Only one base texture per TextureArray is allowed");
        t.prototype.bind.call(this, e);
        for (var i = 0; i < this.length; i++)
          (this.items[i].parentTextureArray = e),
            this.items[i].on("update", e.update, e);
      }),
      (r.prototype.unbind = function (e) {
        t.prototype.unbind.call(this, e);
        for (var i = 0; i < this.length; i++)
          (this.items[i].parentTextureArray = null),
            this.items[i].off("update", e.update, e);
      }),
      (r.prototype.load = function () {
        var e = this;
        if (this._load) return this._load;
        var i = this.items
            .map(function (s) {
              return s.resource;
            })
            .filter(function (s) {
              return s;
            }),
          n = i.map(function (s) {
            return s.load();
          });
        return (
          (this._load = Promise.all(n).then(function () {
            var s = e.items[0],
              a = s.realWidth,
              o = s.realHeight;
            return e.resize(a, o), Promise.resolve(e);
          })),
          this._load
        );
      }),
      r
    );
  })(be),
  Ks = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this,
        s = i || {},
        a = s.width,
        o = s.height,
        h,
        u;
      return (
        Array.isArray(e) ? ((h = e), (u = e.length)) : (u = e),
        (n = t.call(this, u, { width: a, height: o }) || this),
        h && n.initFromArray(h, i),
        n
      );
    }
    return (
      (r.prototype.addBaseTextureAt = function (e, i) {
        if (e.resource) this.addResourceAt(e.resource, i);
        else throw new Error("ArrayResource does not support RenderTexture");
        return this;
      }),
      (r.prototype.bind = function (e) {
        t.prototype.bind.call(this, e), (e.target = Jt.TEXTURE_2D_ARRAY);
      }),
      (r.prototype.upload = function (e, i, n) {
        var s = this,
          a = s.length,
          o = s.itemDirtyIds,
          h = s.items,
          u = e.gl;
        n.dirtyId < 0 &&
          u.texImage3D(
            u.TEXTURE_2D_ARRAY,
            0,
            n.internalFormat,
            this._width,
            this._height,
            a,
            0,
            i.format,
            n.type,
            null
          );
        for (var f = 0; f < a; f++) {
          var c = h[f];
          o[f] < c.dirtyId &&
            ((o[f] = c.dirtyId),
            c.valid &&
              u.texSubImage3D(
                u.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                f,
                c.resource.width,
                c.resource.height,
                1,
                i.format,
                n.type,
                c.resource.source
              ));
        }
        return !0;
      }),
      r
    );
  })(Ei),
  Ht = (function (t) {
    K(r, t);
    function r(e) {
      var i = this,
        n = e,
        s = n.naturalWidth || n.videoWidth || n.width,
        a = n.naturalHeight || n.videoHeight || n.height;
      return (
        (i = t.call(this, s, a) || this), (i.source = e), (i.noSubImage = !1), i
      );
    }
    return (
      (r.crossOrigin = function (e, i, n) {
        n === void 0 && i.indexOf("data:") !== 0
          ? (e.crossOrigin = Jl(i))
          : n !== !1 &&
            (e.crossOrigin = typeof n == "string" ? n : "anonymous");
      }),
      (r.prototype.upload = function (e, i, n, s) {
        var a = e.gl,
          o = i.realWidth,
          h = i.realHeight;
        return (
          (s = s || this.source),
          a.pixelStorei(
            a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            i.alphaMode === Ot.UNPACK
          ),
          !this.noSubImage &&
          i.target === a.TEXTURE_2D &&
          n.width === o &&
          n.height === h
            ? a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, i.format, n.type, s)
            : ((n.width = o),
              (n.height = h),
              a.texImage2D(i.target, 0, n.internalFormat, i.format, n.type, s)),
          !0
        );
      }),
      (r.prototype.update = function () {
        if (!this.destroyed) {
          var e = this.source,
            i = e.naturalWidth || e.videoWidth || e.width,
            n = e.naturalHeight || e.videoHeight || e.height;
          this.resize(i, n), t.prototype.update.call(this);
        }
      }),
      (r.prototype.dispose = function () {
        this.source = null;
      }),
      r
    );
  })(be),
  Ii = (function (t) {
    K(r, t);
    function r(e) {
      return t.call(this, e) || this;
    }
    return (
      (r.test = function (e) {
        var i = self.OffscreenCanvas;
        return i && e instanceof i
          ? !0
          : self.HTMLCanvasElement && e instanceof HTMLCanvasElement;
      }),
      r
    );
  })(Ht),
  Js = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this,
        s = i || {},
        a = s.width,
        o = s.height,
        h = s.autoLoad,
        u = s.linkBaseTexture;
      if (e && e.length !== r.SIDES)
        throw new Error("Invalid length. Got " + e.length + ", expected 6");
      n = t.call(this, 6, { width: a, height: o }) || this;
      for (var f = 0; f < r.SIDES; f++)
        n.items[f].target = Jt.TEXTURE_CUBE_MAP_POSITIVE_X + f;
      return (
        (n.linkBaseTexture = u !== !1),
        e && n.initFromArray(e, i),
        h !== !1 && n.load(),
        n
      );
    }
    return (
      (r.prototype.bind = function (e) {
        t.prototype.bind.call(this, e), (e.target = Jt.TEXTURE_CUBE_MAP);
      }),
      (r.prototype.addBaseTextureAt = function (e, i, n) {
        if (!this.items[i]) throw new Error("Index " + i + " is out of bounds");
        if (
          !this.linkBaseTexture ||
          e.parentTextureArray ||
          Object.keys(e._glTextures).length > 0
        )
          if (e.resource) this.addResourceAt(e.resource, i);
          else
            throw new Error(
              "CubeResource does not support copying of renderTexture."
            );
        else
          (e.target = Jt.TEXTURE_CUBE_MAP_POSITIVE_X + i),
            (e.parentTextureArray = this.baseTexture),
            (this.items[i] = e);
        return (
          e.valid && !this.valid && this.resize(e.realWidth, e.realHeight),
          (this.items[i] = e),
          this
        );
      }),
      (r.prototype.upload = function (e, i, n) {
        for (var s = this.itemDirtyIds, a = 0; a < r.SIDES; a++) {
          var o = this.items[a];
          s[a] < o.dirtyId &&
            (o.valid && o.resource
              ? (o.resource.upload(e, o, n), (s[a] = o.dirtyId))
              : s[a] < -1 &&
                (e.gl.texImage2D(
                  o.target,
                  0,
                  n.internalFormat,
                  i.realWidth,
                  i.realHeight,
                  0,
                  i.format,
                  n.type,
                  null
                ),
                (s[a] = -1)));
        }
        return !0;
      }),
      (r.test = function (e) {
        return Array.isArray(e) && e.length === r.SIDES;
      }),
      (r.SIDES = 6),
      r
    );
  })(Ei),
  Ri = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this;
      if (((i = i || {}), !(e instanceof HTMLImageElement))) {
        var s = new Image();
        Ht.crossOrigin(s, e, i.crossorigin), (s.src = e), (e = s);
      }
      return (
        (n = t.call(this, e) || this),
        !e.complete &&
          !!n._width &&
          !!n._height &&
          ((n._width = 0), (n._height = 0)),
        (n.url = e.src),
        (n._process = null),
        (n.preserveBitmap = !1),
        (n.createBitmap =
          (i.createBitmap !== void 0
            ? i.createBitmap
            : S.CREATE_IMAGE_BITMAP) && !!self.createImageBitmap),
        (n.alphaMode = typeof i.alphaMode == "number" ? i.alphaMode : null),
        (n.bitmap = null),
        (n._load = null),
        i.autoLoad !== !1 && n.load(),
        n
      );
    }
    return (
      (r.prototype.load = function (e) {
        var i = this;
        return this._load
          ? this._load
          : (e !== void 0 && (this.createBitmap = e),
            (this._load = new Promise(function (n, s) {
              var a = i.source;
              i.url = a.src;
              var o = function () {
                i.destroyed ||
                  ((a.onload = null),
                  (a.onerror = null),
                  i.resize(a.width, a.height),
                  (i._load = null),
                  i.createBitmap ? n(i.process()) : n(i));
              };
              a.complete && a.src
                ? o()
                : ((a.onload = o),
                  (a.onerror = function (h) {
                    s(h), i.onError.emit(h);
                  }));
            })),
            this._load);
      }),
      (r.prototype.process = function () {
        var e = this,
          i = this.source;
        if (this._process !== null) return this._process;
        if (this.bitmap !== null || !self.createImageBitmap)
          return Promise.resolve(this);
        var n = self.createImageBitmap,
          s = !i.crossOrigin || i.crossOrigin === "anonymous";
        return (
          (this._process = fetch(i.src, { mode: s ? "cors" : "no-cors" })
            .then(function (a) {
              return a.blob();
            })
            .then(function (a) {
              return n(a, 0, 0, i.width, i.height, {
                premultiplyAlpha:
                  e.alphaMode === Ot.UNPACK ? "premultiply" : "none",
              });
            })
            .then(function (a) {
              return e.destroyed
                ? Promise.reject()
                : ((e.bitmap = a),
                  e.update(),
                  (e._process = null),
                  Promise.resolve(e));
            })),
          this._process
        );
      }),
      (r.prototype.upload = function (e, i, n) {
        if (
          (typeof this.alphaMode == "number" && (i.alphaMode = this.alphaMode),
          !this.createBitmap)
        )
          return t.prototype.upload.call(this, e, i, n);
        if (!this.bitmap && (this.process(), !this.bitmap)) return !1;
        if (
          (t.prototype.upload.call(this, e, i, n, this.bitmap),
          !this.preserveBitmap)
        ) {
          var s = !0,
            a = i._glTextures;
          for (var o in a) {
            var h = a[o];
            if (h !== n && h.dirtyId !== i.dirtyId) {
              s = !1;
              break;
            }
          }
          s && (this.bitmap.close && this.bitmap.close(), (this.bitmap = null));
        }
        return !0;
      }),
      (r.prototype.dispose = function () {
        (this.source.onload = null),
          (this.source.onerror = null),
          t.prototype.dispose.call(this),
          this.bitmap && (this.bitmap.close(), (this.bitmap = null)),
          (this._process = null),
          (this._load = null);
      }),
      (r.test = function (e) {
        return typeof e == "string" || e instanceof HTMLImageElement;
      }),
      r
    );
  })(Ht),
  Qs = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this;
      return (
        (i = i || {}),
        (n = t.call(this, document.createElement("canvas")) || this),
        (n._width = 0),
        (n._height = 0),
        (n.svg = e),
        (n.scale = i.scale || 1),
        (n._overrideWidth = i.width),
        (n._overrideHeight = i.height),
        (n._resolve = null),
        (n._crossorigin = i.crossorigin),
        (n._load = null),
        i.autoLoad !== !1 && n.load(),
        n
      );
    }
    return (
      (r.prototype.load = function () {
        var e = this;
        return this._load
          ? this._load
          : ((this._load = new Promise(function (i) {
              if (
                ((e._resolve = function () {
                  e.resize(e.source.width, e.source.height), i(e);
                }),
                r.SVG_XML.test(e.svg.trim()))
              ) {
                if (!btoa)
                  throw new Error(
                    "Your browser doesn't support base64 conversions."
                  );
                e.svg =
                  "data:image/svg+xml;base64," +
                  btoa(unescape(encodeURIComponent(e.svg)));
              }
              e._loadSvg();
            })),
            this._load);
      }),
      (r.prototype._loadSvg = function () {
        var e = this,
          i = new Image();
        Ht.crossOrigin(i, this.svg, this._crossorigin),
          (i.src = this.svg),
          (i.onerror = function (n) {
            !e._resolve || ((i.onerror = null), e.onError.emit(n));
          }),
          (i.onload = function () {
            if (!!e._resolve) {
              var n = i.width,
                s = i.height;
              if (!n || !s)
                throw new Error(
                  "The SVG image must have width and height defined (in pixels), canvas API needs them."
                );
              var a = n * e.scale,
                o = s * e.scale;
              (e._overrideWidth || e._overrideHeight) &&
                ((a = e._overrideWidth || (e._overrideHeight / s) * n),
                (o = e._overrideHeight || (e._overrideWidth / n) * s)),
                (a = Math.round(a)),
                (o = Math.round(o));
              var h = e.source;
              (h.width = a),
                (h.height = o),
                (h._pixiId = "canvas_" + Qt()),
                h.getContext("2d").drawImage(i, 0, 0, n, s, 0, 0, a, o),
                e._resolve(),
                (e._resolve = null);
            }
          });
      }),
      (r.getSize = function (e) {
        var i = r.SVG_SIZE.exec(e),
          n = {};
        return (
          i &&
            ((n[i[1]] = Math.round(parseFloat(i[3]))),
            (n[i[5]] = Math.round(parseFloat(i[7])))),
          n
        );
      }),
      (r.prototype.dispose = function () {
        t.prototype.dispose.call(this),
          (this._resolve = null),
          (this._crossorigin = null);
      }),
      (r.test = function (e, i) {
        return (
          i === "svg" ||
          (typeof e == "string" &&
            /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(e)) ||
          (typeof e == "string" && r.SVG_XML.test(e))
        );
      }),
      (r.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m),
      (r.SVG_SIZE =
        /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i),
      r
    );
  })(Ht),
  ta = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = this;
      if (((i = i || {}), !(e instanceof HTMLVideoElement))) {
        var s = document.createElement("video");
        s.setAttribute("preload", "auto"),
          s.setAttribute("webkit-playsinline", ""),
          s.setAttribute("playsinline", ""),
          typeof e == "string" && (e = [e]);
        var a = e[0].src || e[0];
        Ht.crossOrigin(s, a, i.crossorigin);
        for (var o = 0; o < e.length; ++o) {
          var h = document.createElement("source"),
            u = e[o],
            f = u.src,
            c = u.mime;
          f = f || e[o];
          var l = f.split("?").shift().toLowerCase(),
            d = l.substr(l.lastIndexOf(".") + 1);
          (c = c || r.MIME_TYPES[d] || "video/" + d),
            (h.src = f),
            (h.type = c),
            s.appendChild(h);
        }
        e = s;
      }
      return (
        (n = t.call(this, e) || this),
        (n.noSubImage = !0),
        (n._autoUpdate = !0),
        (n._isConnectedToTicker = !1),
        (n._updateFPS = i.updateFPS || 0),
        (n._msToNextUpdate = 0),
        (n.autoPlay = i.autoPlay !== !1),
        (n._load = null),
        (n._resolve = null),
        (n._onCanPlay = n._onCanPlay.bind(n)),
        (n._onError = n._onError.bind(n)),
        i.autoLoad !== !1 && n.load(),
        n
      );
    }
    return (
      (r.prototype.update = function (e) {
        if (!this.destroyed) {
          var i = mt.shared.elapsedMS * this.source.playbackRate;
          (this._msToNextUpdate = Math.floor(this._msToNextUpdate - i)),
            (!this._updateFPS || this._msToNextUpdate <= 0) &&
              (t.prototype.update.call(this),
              (this._msToNextUpdate = this._updateFPS
                ? Math.floor(1e3 / this._updateFPS)
                : 0));
        }
      }),
      (r.prototype.load = function () {
        var e = this;
        if (this._load) return this._load;
        var i = this.source;
        return (
          (i.readyState === i.HAVE_ENOUGH_DATA ||
            i.readyState === i.HAVE_FUTURE_DATA) &&
            i.width &&
            i.height &&
            (i.complete = !0),
          i.addEventListener("play", this._onPlayStart.bind(this)),
          i.addEventListener("pause", this._onPlayStop.bind(this)),
          this._isSourceReady()
            ? this._onCanPlay()
            : (i.addEventListener("canplay", this._onCanPlay),
              i.addEventListener("canplaythrough", this._onCanPlay),
              i.addEventListener("error", this._onError, !0)),
          (this._load = new Promise(function (n) {
            e.valid ? n(e) : ((e._resolve = n), i.load());
          })),
          this._load
        );
      }),
      (r.prototype._onError = function (e) {
        this.source.removeEventListener("error", this._onError, !0),
          this.onError.emit(e);
      }),
      (r.prototype._isSourcePlaying = function () {
        var e = this.source;
        return (
          e.currentTime > 0 &&
          e.paused === !1 &&
          e.ended === !1 &&
          e.readyState > 2
        );
      }),
      (r.prototype._isSourceReady = function () {
        var e = this.source;
        return e.readyState === 3 || e.readyState === 4;
      }),
      (r.prototype._onPlayStart = function () {
        this.valid || this._onCanPlay(),
          this.autoUpdate &&
            !this._isConnectedToTicker &&
            (mt.shared.add(this.update, this),
            (this._isConnectedToTicker = !0));
      }),
      (r.prototype._onPlayStop = function () {
        this._isConnectedToTicker &&
          (mt.shared.remove(this.update, this),
          (this._isConnectedToTicker = !1));
      }),
      (r.prototype._onCanPlay = function () {
        var e = this.source;
        e.removeEventListener("canplay", this._onCanPlay),
          e.removeEventListener("canplaythrough", this._onCanPlay);
        var i = this.valid;
        this.resize(e.videoWidth, e.videoHeight),
          !i && this._resolve && (this._resolve(this), (this._resolve = null)),
          this._isSourcePlaying()
            ? this._onPlayStart()
            : this.autoPlay && e.play();
      }),
      (r.prototype.dispose = function () {
        this._isConnectedToTicker &&
          (mt.shared.remove(this.update, this),
          (this._isConnectedToTicker = !1));
        var e = this.source;
        e &&
          (e.removeEventListener("error", this._onError, !0),
          e.pause(),
          (e.src = ""),
          e.load()),
          t.prototype.dispose.call(this);
      }),
      Object.defineProperty(r.prototype, "autoUpdate", {
        get: function () {
          return this._autoUpdate;
        },
        set: function (e) {
          e !== this._autoUpdate &&
            ((this._autoUpdate = e),
            !this._autoUpdate && this._isConnectedToTicker
              ? (mt.shared.remove(this.update, this),
                (this._isConnectedToTicker = !1))
              : this._autoUpdate &&
                !this._isConnectedToTicker &&
                this._isSourcePlaying() &&
                (mt.shared.add(this.update, this),
                (this._isConnectedToTicker = !0)));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "updateFPS", {
        get: function () {
          return this._updateFPS;
        },
        set: function (e) {
          e !== this._updateFPS && (this._updateFPS = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.test = function (e, i) {
        return (
          (self.HTMLVideoElement && e instanceof HTMLVideoElement) ||
          r.TYPES.indexOf(i) > -1
        );
      }),
      (r.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"]),
      (r.MIME_TYPES = {
        ogv: "video/ogg",
        mov: "video/quicktime",
        m4v: "video/mp4",
      }),
      r
    );
  })(Ht),
  ea = (function (t) {
    K(r, t);
    function r(e) {
      return t.call(this, e) || this;
    }
    return (
      (r.test = function (e) {
        return !!self.createImageBitmap && e instanceof ImageBitmap;
      }),
      r
    );
  })(Ht);
Tr.push(Ri, ea, Ii, ta, Qs, Xe, Js, Ks);
var ra = {
    __proto__: null,
    Resource: be,
    BaseImageResource: Ht,
    INSTALLED: Tr,
    autoDetectResource: xi,
    AbstractMultiResource: Ei,
    ArrayResource: Ks,
    BufferResource: Xe,
    CanvasResource: Ii,
    CubeResource: Js,
    ImageResource: Ri,
    SVGResource: Qs,
    VideoResource: ta,
    ImageBitmapResource: ea,
  },
  bc = (function (t) {
    K(r, t);
    function r() {
      return (t !== null && t.apply(this, arguments)) || this;
    }
    return (
      (r.prototype.upload = function (e, i, n) {
        var s = e.gl;
        s.pixelStorei(
          s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
          i.alphaMode === Ot.UNPACK
        );
        var a = i.realWidth,
          o = i.realHeight;
        return (
          n.width === a && n.height === o
            ? s.texSubImage2D(
                i.target,
                0,
                0,
                0,
                a,
                o,
                i.format,
                n.type,
                this.data
              )
            : ((n.width = a),
              (n.height = o),
              s.texImage2D(
                i.target,
                0,
                n.internalFormat,
                a,
                o,
                0,
                i.format,
                n.type,
                this.data
              )),
          !0
        );
      }),
      r
    );
  })(Xe),
  wi = (function () {
    function t(r, e) {
      (this.width = Math.round(r || 100)),
        (this.height = Math.round(e || 100)),
        (this.stencil = !1),
        (this.depth = !1),
        (this.dirtyId = 0),
        (this.dirtyFormat = 0),
        (this.dirtySize = 0),
        (this.depthTexture = null),
        (this.colorTextures = []),
        (this.glFramebuffers = {}),
        (this.disposeRunner = new Tt("disposeFramebuffer")),
        (this.multisample = ct.NONE);
    }
    return (
      Object.defineProperty(t.prototype, "colorTexture", {
        get: function () {
          return this.colorTextures[0];
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.addColorTexture = function (r, e) {
        return (
          r === void 0 && (r = 0),
          (this.colorTextures[r] =
            e ||
            new W(null, {
              scaleMode: Mt.NEAREST,
              resolution: 1,
              mipmap: zt.OFF,
              width: this.width,
              height: this.height,
            })),
          this.dirtyId++,
          this.dirtyFormat++,
          this
        );
      }),
      (t.prototype.addDepthTexture = function (r) {
        return (
          (this.depthTexture =
            r ||
            new W(new bc(null, { width: this.width, height: this.height }), {
              scaleMode: Mt.NEAREST,
              resolution: 1,
              width: this.width,
              height: this.height,
              mipmap: zt.OFF,
              format: w.DEPTH_COMPONENT,
              type: G.UNSIGNED_SHORT,
            })),
          this.dirtyId++,
          this.dirtyFormat++,
          this
        );
      }),
      (t.prototype.enableDepth = function () {
        return (this.depth = !0), this.dirtyId++, this.dirtyFormat++, this;
      }),
      (t.prototype.enableStencil = function () {
        return (this.stencil = !0), this.dirtyId++, this.dirtyFormat++, this;
      }),
      (t.prototype.resize = function (r, e) {
        if (
          ((r = Math.round(r)),
          (e = Math.round(e)),
          !(r === this.width && e === this.height))
        ) {
          (this.width = r), (this.height = e), this.dirtyId++, this.dirtySize++;
          for (var i = 0; i < this.colorTextures.length; i++) {
            var n = this.colorTextures[i],
              s = n.resolution;
            n.setSize(r / s, e / s);
          }
          if (this.depthTexture) {
            var s = this.depthTexture.resolution;
            this.depthTexture.setSize(r / s, e / s);
          }
        }
      }),
      (t.prototype.dispose = function () {
        this.disposeRunner.emit(this, !1);
      }),
      (t.prototype.destroyDepthTexture = function () {
        this.depthTexture &&
          (this.depthTexture.destroy(),
          (this.depthTexture = null),
          ++this.dirtyId,
          ++this.dirtyFormat);
      }),
      t
    );
  })(),
  ia = (function (t) {
    K(r, t);
    function r(e) {
      var i = this;
      if (typeof e == "number") {
        var n = arguments[0],
          s = arguments[1],
          a = arguments[2],
          o = arguments[3];
        e = { width: n, height: s, scaleMode: a, resolution: o };
      }
      return (
        (e.width = e.width || 100),
        (e.height = e.height || 100),
        (e.multisample = e.multisample !== void 0 ? e.multisample : ct.NONE),
        (i = t.call(this, null, e) || this),
        (i.mipmap = zt.OFF),
        (i.valid = !0),
        (i.clearColor = [0, 0, 0, 0]),
        (i.framebuffer = new wi(i.realWidth, i.realHeight).addColorTexture(
          0,
          i
        )),
        (i.framebuffer.multisample = e.multisample),
        (i.maskStack = []),
        (i.filterStack = [{}]),
        i
      );
    }
    return (
      (r.prototype.resize = function (e, i) {
        this.framebuffer.resize(e * this.resolution, i * this.resolution),
          this.setRealSize(this.framebuffer.width, this.framebuffer.height);
      }),
      (r.prototype.dispose = function () {
        this.framebuffer.dispose(), t.prototype.dispose.call(this);
      }),
      (r.prototype.destroy = function () {
        t.prototype.destroy.call(this),
          this.framebuffer.destroyDepthTexture(),
          (this.framebuffer = null);
      }),
      r
    );
  })(W),
  na = (function () {
    function t() {
      (this.x0 = 0),
        (this.y0 = 0),
        (this.x1 = 1),
        (this.y1 = 0),
        (this.x2 = 1),
        (this.y2 = 1),
        (this.x3 = 0),
        (this.y3 = 1),
        (this.uvsFloat32 = new Float32Array(8));
    }
    return (
      (t.prototype.set = function (r, e, i) {
        var n = e.width,
          s = e.height;
        if (i) {
          var a = r.width / 2 / n,
            o = r.height / 2 / s,
            h = r.x / n + a,
            u = r.y / s + o;
          (i = et.add(i, et.NW)),
            (this.x0 = h + a * et.uX(i)),
            (this.y0 = u + o * et.uY(i)),
            (i = et.add(i, 2)),
            (this.x1 = h + a * et.uX(i)),
            (this.y1 = u + o * et.uY(i)),
            (i = et.add(i, 2)),
            (this.x2 = h + a * et.uX(i)),
            (this.y2 = u + o * et.uY(i)),
            (i = et.add(i, 2)),
            (this.x3 = h + a * et.uX(i)),
            (this.y3 = u + o * et.uY(i));
        } else
          (this.x0 = r.x / n),
            (this.y0 = r.y / s),
            (this.x1 = (r.x + r.width) / n),
            (this.y1 = r.y / s),
            (this.x2 = (r.x + r.width) / n),
            (this.y2 = (r.y + r.height) / s),
            (this.x3 = r.x / n),
            (this.y3 = (r.y + r.height) / s);
        (this.uvsFloat32[0] = this.x0),
          (this.uvsFloat32[1] = this.y0),
          (this.uvsFloat32[2] = this.x1),
          (this.uvsFloat32[3] = this.y1),
          (this.uvsFloat32[4] = this.x2),
          (this.uvsFloat32[5] = this.y2),
          (this.uvsFloat32[6] = this.x3),
          (this.uvsFloat32[7] = this.y3);
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/core:TextureUvs " +
          ("x0=" + this.x0 + " y0=" + this.y0 + " ") +
          ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") +
          ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) +
          "]"
        );
      }),
      t
    );
  })(),
  sa = new na(),
  B = (function (t) {
    K(r, t);
    function r(e, i, n, s, a, o) {
      var h = t.call(this) || this;
      if (
        ((h.noFrame = !1),
        i || ((h.noFrame = !0), (i = new z(0, 0, 1, 1))),
        e instanceof r && (e = e.baseTexture),
        (h.baseTexture = e),
        (h._frame = i),
        (h.trim = s),
        (h.valid = !1),
        (h._uvs = sa),
        (h.uvMatrix = null),
        (h.orig = n || i),
        (h._rotate = Number(a || 0)),
        a === !0)
      )
        h._rotate = 2;
      else if (h._rotate % 2 != 0)
        throw new Error(
          "attempt to use diamond-shaped UVs. If you are sure, set rotation manually"
        );
      return (
        (h.defaultAnchor = o ? new ht(o.x, o.y) : new ht(0, 0)),
        (h._updateID = 0),
        (h.textureCacheIds = []),
        e.valid
          ? h.noFrame
            ? e.valid && h.onBaseTextureUpdated(e)
            : (h.frame = i)
          : e.once("loaded", h.onBaseTextureUpdated, h),
        h.noFrame && e.on("update", h.onBaseTextureUpdated, h),
        h
      );
    }
    return (
      (r.prototype.update = function () {
        this.baseTexture.resource && this.baseTexture.resource.update();
      }),
      (r.prototype.onBaseTextureUpdated = function (e) {
        if (this.noFrame) {
          if (!this.baseTexture.valid) return;
          (this._frame.width = e.width),
            (this._frame.height = e.height),
            (this.valid = !0),
            this.updateUvs();
        } else this.frame = this._frame;
        this.emit("update", this);
      }),
      (r.prototype.destroy = function (e) {
        if (this.baseTexture) {
          if (e) {
            var i = this.baseTexture.resource;
            i && i.url && kt[i.url] && r.removeFromCache(i.url),
              this.baseTexture.destroy();
          }
          this.baseTexture.off("loaded", this.onBaseTextureUpdated, this),
            this.baseTexture.off("update", this.onBaseTextureUpdated, this),
            (this.baseTexture = null);
        }
        (this._frame = null),
          (this._uvs = null),
          (this.trim = null),
          (this.orig = null),
          (this.valid = !1),
          r.removeFromCache(this),
          (this.textureCacheIds = null);
      }),
      (r.prototype.clone = function () {
        var e = this._frame.clone(),
          i = this._frame === this.orig ? e : this.orig.clone(),
          n = new r(
            this.baseTexture,
            !this.noFrame && e,
            i,
            this.trim && this.trim.clone(),
            this.rotate,
            this.defaultAnchor
          );
        return this.noFrame && (n._frame = e), n;
      }),
      (r.prototype.updateUvs = function () {
        this._uvs === sa && (this._uvs = new na()),
          this._uvs.set(this._frame, this.baseTexture, this.rotate),
          this._updateID++;
      }),
      (r.from = function (e, i, n) {
        i === void 0 && (i = {}), n === void 0 && (n = S.STRICT_TEXTURE_CACHE);
        var s = typeof e == "string",
          a = null;
        if (s) a = e;
        else if (e instanceof W) {
          if (!e.cacheId) {
            var o = (i && i.pixiIdPrefix) || "pixiid";
            (e.cacheId = o + "-" + Qt()), W.addToCache(e, e.cacheId);
          }
          a = e.cacheId;
        } else {
          if (!e._pixiId) {
            var o = (i && i.pixiIdPrefix) || "pixiid";
            e._pixiId = o + "_" + Qt();
          }
          a = e._pixiId;
        }
        var h = kt[a];
        if (s && n && !h)
          throw new Error(
            'The cacheId "' + a + '" does not exist in TextureCache.'
          );
        return (
          !h && !(e instanceof W)
            ? (i.resolution || (i.resolution = pr(e)),
              (h = new r(new W(e, i))),
              (h.baseTexture.cacheId = a),
              W.addToCache(h.baseTexture, a),
              r.addToCache(h, a))
            : !h && e instanceof W && ((h = new r(e)), r.addToCache(h, a)),
          h
        );
      }),
      (r.fromURL = function (e, i) {
        var n = Object.assign(
            { autoLoad: !1 },
            i == null ? void 0 : i.resourceOptions
          ),
          s = r.from(e, Object.assign({ resourceOptions: n }, i), !1),
          a = s.baseTexture.resource;
        return s.baseTexture.valid
          ? Promise.resolve(s)
          : a.load().then(function () {
              return Promise.resolve(s);
            });
      }),
      (r.fromBuffer = function (e, i, n, s) {
        return new r(W.fromBuffer(e, i, n, s));
      }),
      (r.fromLoader = function (e, i, n, s) {
        var a = new W(
            e,
            Object.assign({ scaleMode: S.SCALE_MODE, resolution: pr(i) }, s)
          ),
          o = a.resource;
        o instanceof Ri && (o.url = i);
        var h = new r(a);
        return (
          n || (n = i),
          W.addToCache(h.baseTexture, n),
          r.addToCache(h, n),
          n !== i && (W.addToCache(h.baseTexture, i), r.addToCache(h, i)),
          h.baseTexture.valid
            ? Promise.resolve(h)
            : new Promise(function (u) {
                h.baseTexture.once("loaded", function () {
                  return u(h);
                });
              })
        );
      }),
      (r.addToCache = function (e, i) {
        i &&
          (e.textureCacheIds.indexOf(i) === -1 && e.textureCacheIds.push(i),
          kt[i] &&
            console.warn(
              "Texture added to the cache with an id [" +
                i +
                "] that already had an entry"
            ),
          (kt[i] = e));
      }),
      (r.removeFromCache = function (e) {
        if (typeof e == "string") {
          var i = kt[e];
          if (i) {
            var n = i.textureCacheIds.indexOf(e);
            return n > -1 && i.textureCacheIds.splice(n, 1), delete kt[e], i;
          }
        } else if (e && e.textureCacheIds) {
          for (var s = 0; s < e.textureCacheIds.length; ++s)
            kt[e.textureCacheIds[s]] === e && delete kt[e.textureCacheIds[s]];
          return (e.textureCacheIds.length = 0), e;
        }
        return null;
      }),
      Object.defineProperty(r.prototype, "resolution", {
        get: function () {
          return this.baseTexture.resolution;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "frame", {
        get: function () {
          return this._frame;
        },
        set: function (e) {
          (this._frame = e), (this.noFrame = !1);
          var i = e.x,
            n = e.y,
            s = e.width,
            a = e.height,
            o = i + s > this.baseTexture.width,
            h = n + a > this.baseTexture.height;
          if (o || h) {
            var u = o && h ? "and" : "or",
              f =
                "X: " +
                i +
                " + " +
                s +
                " = " +
                (i + s) +
                " > " +
                this.baseTexture.width,
              c =
                "Y: " +
                n +
                " + " +
                a +
                " = " +
                (n + a) +
                " > " +
                this.baseTexture.height;
            throw new Error(
              "Texture Error: frame does not fit inside the base Texture dimensions: " +
                (f + " " + u + " " + c)
            );
          }
          (this.valid = s && a && this.baseTexture.valid),
            !this.trim && !this.rotate && (this.orig = e),
            this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "rotate", {
        get: function () {
          return this._rotate;
        },
        set: function (e) {
          (this._rotate = e), this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "width", {
        get: function () {
          return this.orig.width;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "height", {
        get: function () {
          return this.orig.height;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.castToBaseTexture = function () {
        return this.baseTexture;
      }),
      r
    );
  })(Ue);
function Ec() {
  var t = document.createElement("canvas");
  (t.width = 16), (t.height = 16);
  var r = t.getContext("2d");
  return (
    (r.fillStyle = "white"), r.fillRect(0, 0, 16, 16), new B(new W(new Ii(t)))
  );
}
function br(t) {
  (t.destroy = function () {}),
    (t.on = function () {}),
    (t.once = function () {}),
    (t.emit = function () {});
}
B.EMPTY = new B(new W());
br(B.EMPTY);
br(B.EMPTY.baseTexture);
B.WHITE = Ec();
br(B.WHITE);
br(B.WHITE.baseTexture);
var ae = (function (t) {
    K(r, t);
    function r(e, i) {
      var n = t.call(this, e, i) || this;
      return (
        (n.valid = !0),
        (n.filterFrame = null),
        (n.filterPoolKey = null),
        n.updateUvs(),
        n
      );
    }
    return (
      Object.defineProperty(r.prototype, "framebuffer", {
        get: function () {
          return this.baseTexture.framebuffer;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "multisample", {
        get: function () {
          return this.framebuffer.multisample;
        },
        set: function (e) {
          this.framebuffer.multisample = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.resize = function (e, i, n) {
        n === void 0 && (n = !0);
        var s = this.baseTexture.resolution,
          a = Math.round(e * s) / s,
          o = Math.round(i * s) / s;
        (this.valid = a > 0 && o > 0),
          (this._frame.width = this.orig.width = a),
          (this._frame.height = this.orig.height = o),
          n && this.baseTexture.resize(a, o),
          this.updateUvs();
      }),
      (r.prototype.setResolution = function (e) {
        var i = this.baseTexture;
        i.resolution !== e &&
          (i.setResolution(e), this.resize(i.width, i.height, !1));
      }),
      (r.create = function (e) {
        for (var i = arguments, n = [], s = 1; s < arguments.length; s++)
          n[s - 1] = i[s];
        return (
          typeof e == "number" &&
            (te(
              "6.0.0",
              "Arguments (width, height, scaleMode, resolution) have been deprecated."
            ),
            (e = {
              width: e,
              height: n[0],
              scaleMode: n[1],
              resolution: n[2],
            })),
          new r(new ia(e))
        );
      }),
      r
    );
  })(B),
  Ic = (function () {
    function t(r) {
      (this.texturePool = {}),
        (this.textureOptions = r || {}),
        (this.enableFullScreen = !1),
        (this._pixelsWidth = 0),
        (this._pixelsHeight = 0);
    }
    return (
      (t.prototype.createTexture = function (r, e, i) {
        i === void 0 && (i = ct.NONE);
        var n = new ia(
          Object.assign(
            { width: r, height: e, resolution: 1, multisample: i },
            this.textureOptions
          )
        );
        return new ae(n);
      }),
      (t.prototype.getOptimalTexture = function (r, e, i, n) {
        i === void 0 && (i = 1), n === void 0 && (n = ct.NONE);
        var s;
        (r = Math.ceil(r * i)),
          (e = Math.ceil(e * i)),
          !this.enableFullScreen ||
          r !== this._pixelsWidth ||
          e !== this._pixelsHeight
            ? ((r = cr(r)),
              (e = cr(e)),
              (s = (((r & 65535) << 16) | (e & 65535)) >>> 0),
              n > 1 && (s += n * 4294967296))
            : (s = n > 1 ? -n : -1),
          this.texturePool[s] || (this.texturePool[s] = []);
        var a = this.texturePool[s].pop();
        return (
          a || (a = this.createTexture(r, e, n)),
          (a.filterPoolKey = s),
          a.setResolution(i),
          a
        );
      }),
      (t.prototype.getFilterTexture = function (r, e, i) {
        var n = this.getOptimalTexture(
          r.width,
          r.height,
          e || r.resolution,
          i || ct.NONE
        );
        return (n.filterFrame = r.filterFrame), n;
      }),
      (t.prototype.returnTexture = function (r) {
        var e = r.filterPoolKey;
        (r.filterFrame = null), this.texturePool[e].push(r);
      }),
      (t.prototype.returnFilterTexture = function (r) {
        this.returnTexture(r);
      }),
      (t.prototype.clear = function (r) {
        if (((r = r !== !1), r))
          for (var e in this.texturePool) {
            var i = this.texturePool[e];
            if (i) for (var n = 0; n < i.length; n++) i[n].destroy(!0);
          }
        this.texturePool = {};
      }),
      (t.prototype.setScreenSize = function (r) {
        if (
          !(r.width === this._pixelsWidth && r.height === this._pixelsHeight)
        ) {
          this.enableFullScreen = r.width > 0 && r.height > 0;
          for (var e in this.texturePool)
            if (Number(e) < 0) {
              var i = this.texturePool[e];
              if (i) for (var n = 0; n < i.length; n++) i[n].destroy(!0);
              this.texturePool[e] = [];
            }
          (this._pixelsWidth = r.width), (this._pixelsHeight = r.height);
        }
      }),
      (t.SCREEN_KEY = -1),
      t
    );
  })(),
  aa = (function () {
    function t(r, e, i, n, s, a, o) {
      e === void 0 && (e = 0),
        i === void 0 && (i = !1),
        n === void 0 && (n = G.FLOAT),
        (this.buffer = r),
        (this.size = e),
        (this.normalized = i),
        (this.type = n),
        (this.stride = s),
        (this.start = a),
        (this.instance = o);
    }
    return (
      (t.prototype.destroy = function () {
        this.buffer = null;
      }),
      (t.from = function (r, e, i, n, s) {
        return new t(r, e, i, n, s);
      }),
      t
    );
  })(),
  Rc = 0,
  dt = (function () {
    function t(r, e, i) {
      e === void 0 && (e = !0),
        i === void 0 && (i = !1),
        (this.data = r || new Float32Array(1)),
        (this._glBuffers = {}),
        (this._updateID = 0),
        (this.index = i),
        (this.static = e),
        (this.id = Rc++),
        (this.disposeRunner = new Tt("disposeBuffer"));
    }
    return (
      (t.prototype.update = function (r) {
        r instanceof Array && (r = new Float32Array(r)),
          (this.data = r || this.data),
          this._updateID++;
      }),
      (t.prototype.dispose = function () {
        this.disposeRunner.emit(this, !1);
      }),
      (t.prototype.destroy = function () {
        this.dispose(), (this.data = null);
      }),
      Object.defineProperty(t.prototype, "index", {
        get: function () {
          return this.type === Ut.ELEMENT_ARRAY_BUFFER;
        },
        set: function (r) {
          this.type = r ? Ut.ELEMENT_ARRAY_BUFFER : Ut.ARRAY_BUFFER;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.from = function (r) {
        return r instanceof Array && (r = new Float32Array(r)), new t(r);
      }),
      t
    );
  })(),
  wc = { Float32Array, Uint32Array, Int32Array, Uint8Array };
function Cc(t, r) {
  for (var e = 0, i = 0, n = {}, s = 0; s < t.length; s++)
    (i += r[s]), (e += t[s].length);
  for (
    var a = new ArrayBuffer(e * 4), o = null, h = 0, s = 0;
    s < t.length;
    s++
  ) {
    var u = r[s],
      f = t[s],
      c = Ts(f);
    n[c] || (n[c] = new wc[c](a)), (o = n[c]);
    for (var l = 0; l < f.length; l++) {
      var d = ((l / u) | 0) * i + h,
        p = l % u;
      o[d + p] = f[l];
    }
    h += u;
  }
  return new Float32Array(a);
}
var oa = { 5126: 4, 5123: 2, 5121: 1 },
  Pc = 0,
  Ac = { Float32Array, Uint32Array, Int32Array, Uint8Array, Uint16Array },
  He = (function () {
    function t(r, e) {
      r === void 0 && (r = []),
        e === void 0 && (e = {}),
        (this.buffers = r),
        (this.indexBuffer = null),
        (this.attributes = e),
        (this.glVertexArrayObjects = {}),
        (this.id = Pc++),
        (this.instanced = !1),
        (this.instanceCount = 1),
        (this.disposeRunner = new Tt("disposeGeometry")),
        (this.refCount = 0);
    }
    return (
      (t.prototype.addAttribute = function (r, e, i, n, s, a, o, h) {
        if (
          (i === void 0 && (i = 0),
          n === void 0 && (n = !1),
          h === void 0 && (h = !1),
          !e)
        )
          throw new Error("You must pass a buffer when creating an attribute");
        e instanceof dt ||
          (e instanceof Array && (e = new Float32Array(e)), (e = new dt(e)));
        var u = r.split("|");
        if (u.length > 1) {
          for (var f = 0; f < u.length; f++)
            this.addAttribute(u[f], e, i, n, s);
          return this;
        }
        var c = this.buffers.indexOf(e);
        return (
          c === -1 && (this.buffers.push(e), (c = this.buffers.length - 1)),
          (this.attributes[r] = new aa(c, i, n, s, a, o, h)),
          (this.instanced = this.instanced || h),
          this
        );
      }),
      (t.prototype.getAttribute = function (r) {
        return this.attributes[r];
      }),
      (t.prototype.getBuffer = function (r) {
        return this.buffers[this.getAttribute(r).buffer];
      }),
      (t.prototype.addIndex = function (r) {
        return (
          r instanceof dt ||
            (r instanceof Array && (r = new Uint16Array(r)), (r = new dt(r))),
          (r.type = Ut.ELEMENT_ARRAY_BUFFER),
          (this.indexBuffer = r),
          this.buffers.indexOf(r) === -1 && this.buffers.push(r),
          this
        );
      }),
      (t.prototype.getIndex = function () {
        return this.indexBuffer;
      }),
      (t.prototype.interleave = function () {
        if (
          this.buffers.length === 1 ||
          (this.buffers.length === 2 && this.indexBuffer)
        )
          return this;
        var r = [],
          e = [],
          i = new dt(),
          n;
        for (n in this.attributes) {
          var s = this.attributes[n],
            a = this.buffers[s.buffer];
          r.push(a.data), e.push((s.size * oa[s.type]) / 4), (s.buffer = 0);
        }
        for (i.data = Cc(r, e), n = 0; n < this.buffers.length; n++)
          this.buffers[n] !== this.indexBuffer && this.buffers[n].destroy();
        return (
          (this.buffers = [i]),
          this.indexBuffer && this.buffers.push(this.indexBuffer),
          this
        );
      }),
      (t.prototype.getSize = function () {
        for (var r in this.attributes) {
          var e = this.attributes[r],
            i = this.buffers[e.buffer];
          return i.data.length / (e.stride / 4 || e.size);
        }
        return 0;
      }),
      (t.prototype.dispose = function () {
        this.disposeRunner.emit(this, !1);
      }),
      (t.prototype.destroy = function () {
        this.dispose(),
          (this.buffers = null),
          (this.indexBuffer = null),
          (this.attributes = null);
      }),
      (t.prototype.clone = function () {
        for (var r = new t(), e = 0; e < this.buffers.length; e++)
          r.buffers[e] = new dt(this.buffers[e].data.slice(0));
        for (var e in this.attributes) {
          var i = this.attributes[e];
          r.attributes[e] = new aa(
            i.buffer,
            i.size,
            i.normalized,
            i.type,
            i.stride,
            i.start,
            i.instance
          );
        }
        return (
          this.indexBuffer &&
            ((r.indexBuffer =
              r.buffers[this.buffers.indexOf(this.indexBuffer)]),
            (r.indexBuffer.type = Ut.ELEMENT_ARRAY_BUFFER)),
          r
        );
      }),
      (t.merge = function (r) {
        for (
          var e = new t(), i = [], n = [], s = [], a, o = 0;
          o < r.length;
          o++
        ) {
          a = r[o];
          for (var h = 0; h < a.buffers.length; h++)
            (n[h] = n[h] || 0), (n[h] += a.buffers[h].data.length), (s[h] = 0);
        }
        for (var o = 0; o < a.buffers.length; o++)
          (i[o] = new Ac[Ts(a.buffers[o].data)](n[o])),
            (e.buffers[o] = new dt(i[o]));
        for (var o = 0; o < r.length; o++) {
          a = r[o];
          for (var h = 0; h < a.buffers.length; h++)
            i[h].set(a.buffers[h].data, s[h]),
              (s[h] += a.buffers[h].data.length);
        }
        if (((e.attributes = a.attributes), a.indexBuffer)) {
          (e.indexBuffer = e.buffers[a.buffers.indexOf(a.indexBuffer)]),
            (e.indexBuffer.type = Ut.ELEMENT_ARRAY_BUFFER);
          for (var u = 0, f = 0, c = 0, l = 0, o = 0; o < a.buffers.length; o++)
            if (a.buffers[o] !== a.indexBuffer) {
              l = o;
              break;
            }
          for (var o in a.attributes) {
            var d = a.attributes[o];
            (d.buffer | 0) === l && (f += (d.size * oa[d.type]) / 4);
          }
          for (var o = 0; o < r.length; o++) {
            for (var p = r[o].indexBuffer.data, h = 0; h < p.length; h++)
              e.indexBuffer.data[h + c] += u;
            (u += r[o].buffers[l].data.length / f), (c += p.length);
          }
        }
        return e;
      }),
      t
    );
  })(),
  Nc = (function (t) {
    K(r, t);
    function r() {
      var e = t.call(this) || this;
      return (
        e
          .addAttribute(
            "aVertexPosition",
            new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
          )
          .addIndex([0, 1, 3, 2]),
        e
      );
    }
    return r;
  })(He),
  ha = (function (t) {
    K(r, t);
    function r() {
      var e = t.call(this) || this;
      return (
        (e.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])),
        (e.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])),
        (e.vertexBuffer = new dt(e.vertices)),
        (e.uvBuffer = new dt(e.uvs)),
        e
          .addAttribute("aVertexPosition", e.vertexBuffer)
          .addAttribute("aTextureCoord", e.uvBuffer)
          .addIndex([0, 1, 2, 0, 2, 3]),
        e
      );
    }
    return (
      (r.prototype.map = function (e, i) {
        var n = 0,
          s = 0;
        return (
          (this.uvs[0] = n),
          (this.uvs[1] = s),
          (this.uvs[2] = n + i.width / e.width),
          (this.uvs[3] = s),
          (this.uvs[4] = n + i.width / e.width),
          (this.uvs[5] = s + i.height / e.height),
          (this.uvs[6] = n),
          (this.uvs[7] = s + i.height / e.height),
          (n = i.x),
          (s = i.y),
          (this.vertices[0] = n),
          (this.vertices[1] = s),
          (this.vertices[2] = n + i.width),
          (this.vertices[3] = s),
          (this.vertices[4] = n + i.width),
          (this.vertices[5] = s + i.height),
          (this.vertices[6] = n),
          (this.vertices[7] = s + i.height),
          this.invalidate(),
          this
        );
      }),
      (r.prototype.invalidate = function () {
        return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
      }),
      r
    );
  })(He),
  Oc = 0,
  oe = (function () {
    function t(r, e, i) {
      (this.group = !0),
        (this.syncUniforms = {}),
        (this.dirtyId = 0),
        (this.id = Oc++),
        (this.static = !!e),
        (this.ubo = !!i),
        r instanceof dt
          ? ((this.buffer = r),
            (this.buffer.type = Ut.UNIFORM_BUFFER),
            (this.autoManage = !1),
            (this.ubo = !0))
          : ((this.uniforms = r),
            this.ubo &&
              ((this.buffer = new dt(new Float32Array(1))),
              (this.buffer.type = Ut.UNIFORM_BUFFER),
              (this.autoManage = !0)));
    }
    return (
      (t.prototype.update = function () {
        this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
      }),
      (t.prototype.add = function (r, e, i) {
        if (!this.ubo) this.uniforms[r] = new t(e, i);
        else
          throw new Error(
            "[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them"
          );
      }),
      (t.from = function (r, e, i) {
        return new t(r, e, i);
      }),
      (t.uboFrom = function (r, e) {
        return new t(r, e != null ? e : !0, !0);
      }),
      t
    );
  })(),
  Sc = (function () {
    function t() {
      (this.renderTexture = null),
        (this.target = null),
        (this.legacy = !1),
        (this.resolution = 1),
        (this.multisample = ct.NONE),
        (this.sourceFrame = new z()),
        (this.destinationFrame = new z()),
        (this.bindingSourceFrame = new z()),
        (this.bindingDestinationFrame = new z()),
        (this.filters = []),
        (this.transform = null);
    }
    return (
      (t.prototype.clear = function () {
        (this.target = null),
          (this.filters = null),
          (this.renderTexture = null);
      }),
      t
    );
  })(),
  Er = [new ht(), new ht(), new ht(), new ht()],
  Ci = new ut(),
  ua = (function () {
    function t(r) {
      (this.renderer = r),
        (this.defaultFilterStack = [{}]),
        (this.texturePool = new Ic()),
        this.texturePool.setScreenSize(r.view),
        (this.statePool = []),
        (this.quad = new Nc()),
        (this.quadUv = new ha()),
        (this.tempRect = new z()),
        (this.activeState = {}),
        (this.globalUniforms = new oe(
          {
            outputFrame: new z(),
            inputSize: new Float32Array(4),
            inputPixel: new Float32Array(4),
            inputClamp: new Float32Array(4),
            resolution: 1,
            filterArea: new Float32Array(4),
            filterClamp: new Float32Array(4),
          },
          !0
        )),
        (this.forceClear = !1),
        (this.useMaxPadding = !1);
    }
    return (
      (t.prototype.push = function (r, e) {
        for (
          var i,
            n,
            s = this.renderer,
            a = this.defaultFilterStack,
            o = this.statePool.pop() || new Sc(),
            h = this.renderer.renderTexture,
            u = e[0].resolution,
            f = e[0].multisample,
            c = e[0].padding,
            l = e[0].autoFit,
            d = (i = e[0].legacy) !== null && i !== void 0 ? i : !0,
            p = 1;
          p < e.length;
          p++
        ) {
          var _ = e[p];
          (u = Math.min(u, _.resolution)),
            (f = Math.min(f, _.multisample)),
            (c = this.useMaxPadding ? Math.max(c, _.padding) : c + _.padding),
            (l = l && _.autoFit),
            (d = d || ((n = _.legacy) !== null && n !== void 0 ? n : !0));
        }
        if (
          (a.length === 1 &&
            (this.defaultFilterStack[0].renderTexture = h.current),
          a.push(o),
          (o.resolution = u),
          (o.multisample = f),
          (o.legacy = d),
          (o.target = r),
          o.sourceFrame.copyFrom(r.filterArea || r.getBounds(!0)),
          o.sourceFrame.pad(c),
          l)
        ) {
          var v = this.tempRect.copyFrom(h.sourceFrame);
          s.projection.transform &&
            this.transformAABB(Ci.copyFrom(s.projection.transform).invert(), v),
            o.sourceFrame.fit(v);
        }
        this.roundFrame(
          o.sourceFrame,
          h.current ? h.current.resolution : s.resolution,
          h.sourceFrame,
          h.destinationFrame,
          s.projection.transform
        ),
          (o.renderTexture = this.getOptimalFilterTexture(
            o.sourceFrame.width,
            o.sourceFrame.height,
            u,
            f
          )),
          (o.filters = e),
          (o.destinationFrame.width = o.renderTexture.width),
          (o.destinationFrame.height = o.renderTexture.height);
        var m = this.tempRect;
        (m.x = 0),
          (m.y = 0),
          (m.width = o.sourceFrame.width),
          (m.height = o.sourceFrame.height),
          (o.renderTexture.filterFrame = o.sourceFrame),
          o.bindingSourceFrame.copyFrom(h.sourceFrame),
          o.bindingDestinationFrame.copyFrom(h.destinationFrame),
          (o.transform = s.projection.transform),
          (s.projection.transform = null),
          h.bind(o.renderTexture, o.sourceFrame, m),
          s.framebuffer.clear(0, 0, 0, 0);
      }),
      (t.prototype.pop = function () {
        var r = this.defaultFilterStack,
          e = r.pop(),
          i = e.filters;
        this.activeState = e;
        var n = this.globalUniforms.uniforms;
        (n.outputFrame = e.sourceFrame), (n.resolution = e.resolution);
        var s = n.inputSize,
          a = n.inputPixel,
          o = n.inputClamp;
        if (
          ((s[0] = e.destinationFrame.width),
          (s[1] = e.destinationFrame.height),
          (s[2] = 1 / s[0]),
          (s[3] = 1 / s[1]),
          (a[0] = Math.round(s[0] * e.resolution)),
          (a[1] = Math.round(s[1] * e.resolution)),
          (a[2] = 1 / a[0]),
          (a[3] = 1 / a[1]),
          (o[0] = 0.5 * a[2]),
          (o[1] = 0.5 * a[3]),
          (o[2] = e.sourceFrame.width * s[2] - 0.5 * a[2]),
          (o[3] = e.sourceFrame.height * s[3] - 0.5 * a[3]),
          e.legacy)
        ) {
          var h = n.filterArea;
          (h[0] = e.destinationFrame.width),
            (h[1] = e.destinationFrame.height),
            (h[2] = e.sourceFrame.x),
            (h[3] = e.sourceFrame.y),
            (n.filterClamp = n.inputClamp);
        }
        this.globalUniforms.update();
        var u = r[r.length - 1];
        if ((this.renderer.framebuffer.blit(), i.length === 1))
          i[0].apply(this, e.renderTexture, u.renderTexture, Wt.BLEND, e),
            this.returnFilterTexture(e.renderTexture);
        else {
          var f = e.renderTexture,
            c = this.getOptimalFilterTexture(f.width, f.height, e.resolution);
          c.filterFrame = f.filterFrame;
          var l = 0;
          for (l = 0; l < i.length - 1; ++l) {
            l === 1 &&
              e.multisample > 1 &&
              ((c = this.getOptimalFilterTexture(
                f.width,
                f.height,
                e.resolution
              )),
              (c.filterFrame = f.filterFrame)),
              i[l].apply(this, f, c, Wt.CLEAR, e);
            var d = f;
            (f = c), (c = d);
          }
          i[l].apply(this, f, u.renderTexture, Wt.BLEND, e),
            l > 1 &&
              e.multisample > 1 &&
              this.returnFilterTexture(e.renderTexture),
            this.returnFilterTexture(f),
            this.returnFilterTexture(c);
        }
        e.clear(), this.statePool.push(e);
      }),
      (t.prototype.bindAndClear = function (r, e) {
        e === void 0 && (e = Wt.CLEAR);
        var i = this.renderer,
          n = i.renderTexture,
          s = i.state;
        if (
          (r ===
          this.defaultFilterStack[this.defaultFilterStack.length - 1]
            .renderTexture
            ? (this.renderer.projection.transform = this.activeState.transform)
            : (this.renderer.projection.transform = null),
          r && r.filterFrame)
        ) {
          var a = this.tempRect;
          (a.x = 0),
            (a.y = 0),
            (a.width = r.filterFrame.width),
            (a.height = r.filterFrame.height),
            n.bind(r, r.filterFrame, a);
        } else
          r !==
          this.defaultFilterStack[this.defaultFilterStack.length - 1]
            .renderTexture
            ? n.bind(r)
            : this.renderer.renderTexture.bind(
                r,
                this.activeState.bindingSourceFrame,
                this.activeState.bindingDestinationFrame
              );
        var o = s.stateId & 1 || this.forceClear;
        (e === Wt.CLEAR || (e === Wt.BLIT && o)) &&
          this.renderer.framebuffer.clear(0, 0, 0, 0);
      }),
      (t.prototype.applyFilter = function (r, e, i, n) {
        var s = this.renderer;
        s.state.set(r.state),
          this.bindAndClear(i, n),
          (r.uniforms.uSampler = e),
          (r.uniforms.filterGlobals = this.globalUniforms),
          s.shader.bind(r),
          (r.legacy = !!r.program.attributeData.aTextureCoord),
          r.legacy
            ? (this.quadUv.map(e._frame, e.filterFrame),
              s.geometry.bind(this.quadUv),
              s.geometry.draw(It.TRIANGLES))
            : (s.geometry.bind(this.quad), s.geometry.draw(It.TRIANGLE_STRIP));
      }),
      (t.prototype.calculateSpriteMatrix = function (r, e) {
        var i = this.activeState,
          n = i.sourceFrame,
          s = i.destinationFrame,
          a = e._texture.orig,
          o = r.set(s.width, 0, 0, s.height, n.x, n.y),
          h = e.worldTransform.copyTo(ut.TEMP_MATRIX);
        return (
          h.invert(),
          o.prepend(h),
          o.scale(1 / a.width, 1 / a.height),
          o.translate(e.anchor.x, e.anchor.y),
          o
        );
      }),
      (t.prototype.destroy = function () {
        (this.renderer = null), this.texturePool.clear(!1);
      }),
      (t.prototype.getOptimalFilterTexture = function (r, e, i, n) {
        return (
          i === void 0 && (i = 1),
          n === void 0 && (n = ct.NONE),
          this.texturePool.getOptimalTexture(r, e, i, n)
        );
      }),
      (t.prototype.getFilterTexture = function (r, e, i) {
        if (typeof r == "number") {
          var n = r;
          (r = e), (e = n);
        }
        r = r || this.activeState.renderTexture;
        var s = this.texturePool.getOptimalTexture(
          r.width,
          r.height,
          e || r.resolution,
          i || ct.NONE
        );
        return (s.filterFrame = r.filterFrame), s;
      }),
      (t.prototype.returnFilterTexture = function (r) {
        this.texturePool.returnTexture(r);
      }),
      (t.prototype.emptyPool = function () {
        this.texturePool.clear(!0);
      }),
      (t.prototype.resize = function () {
        this.texturePool.setScreenSize(this.renderer.view);
      }),
      (t.prototype.transformAABB = function (r, e) {
        var i = Er[0],
          n = Er[1],
          s = Er[2],
          a = Er[3];
        i.set(e.left, e.top),
          n.set(e.left, e.bottom),
          s.set(e.right, e.top),
          a.set(e.right, e.bottom),
          r.apply(i, i),
          r.apply(n, n),
          r.apply(s, s),
          r.apply(a, a);
        var o = Math.min(i.x, n.x, s.x, a.x),
          h = Math.min(i.y, n.y, s.y, a.y),
          u = Math.max(i.x, n.x, s.x, a.x),
          f = Math.max(i.y, n.y, s.y, a.y);
        (e.x = o), (e.y = h), (e.width = u - o), (e.height = f - h);
      }),
      (t.prototype.roundFrame = function (r, e, i, n, s) {
        if (!(r.width <= 0 || r.height <= 0 || i.width <= 0 || i.height <= 0)) {
          if (s) {
            var a = s.a,
              o = s.b,
              h = s.c,
              u = s.d;
            if (
              (Math.abs(o) > 1e-4 || Math.abs(h) > 1e-4) &&
              (Math.abs(a) > 1e-4 || Math.abs(u) > 1e-4)
            )
              return;
          }
          (s = s ? Ci.copyFrom(s) : Ci.identity()),
            s
              .translate(-i.x, -i.y)
              .scale(n.width / i.width, n.height / i.height)
              .translate(n.x, n.y),
            this.transformAABB(s, r),
            r.ceil(e),
            this.transformAABB(s.invert(), r);
        }
      }),
      t
    );
  })(),
  Ir = (function () {
    function t(r) {
      this.renderer = r;
    }
    return (
      (t.prototype.flush = function () {}),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      (t.prototype.start = function () {}),
      (t.prototype.stop = function () {
        this.flush();
      }),
      (t.prototype.render = function (r) {}),
      t
    );
  })(),
  fa = (function () {
    function t(r) {
      (this.renderer = r),
        (this.emptyRenderer = new Ir(r)),
        (this.currentRenderer = this.emptyRenderer);
    }
    return (
      (t.prototype.setObjectRenderer = function (r) {
        this.currentRenderer !== r &&
          (this.currentRenderer.stop(),
          (this.currentRenderer = r),
          this.currentRenderer.start());
      }),
      (t.prototype.flush = function () {
        this.setObjectRenderer(this.emptyRenderer);
      }),
      (t.prototype.reset = function () {
        this.setObjectRenderer(this.emptyRenderer);
      }),
      (t.prototype.copyBoundTextures = function (r, e) {
        for (
          var i = this.renderer.texture.boundTextures, n = e - 1;
          n >= 0;
          --n
        )
          (r[n] = i[n] || null), r[n] && (r[n]._batchLocation = n);
      }),
      (t.prototype.boundArray = function (r, e, i, n) {
        for (
          var s = r.elements, a = r.ids, o = r.count, h = 0, u = 0;
          u < o;
          u++
        ) {
          var f = s[u],
            c = f._batchLocation;
          if (c >= 0 && c < n && e[c] === f) {
            a[u] = c;
            continue;
          }
          for (; h < n; ) {
            var l = e[h];
            if (l && l._batchEnabled === i && l._batchLocation === h) {
              h++;
              continue;
            }
            (a[u] = h), (f._batchLocation = h), (e[h] = f);
            break;
          }
        }
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  la = 0,
  ca = (function () {
    function t(r) {
      (this.renderer = r),
        (this.webGLVersion = 1),
        (this.extensions = {}),
        (this.supports = { uint32Indices: !1 }),
        (this.handleContextLost = this.handleContextLost.bind(this)),
        (this.handleContextRestored = this.handleContextRestored.bind(this)),
        r.view.addEventListener("webglcontextlost", this.handleContextLost, !1),
        r.view.addEventListener(
          "webglcontextrestored",
          this.handleContextRestored,
          !1
        );
    }
    return (
      Object.defineProperty(t.prototype, "isLost", {
        get: function () {
          return !this.gl || this.gl.isContextLost();
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.contextChange = function (r) {
        (this.gl = r),
          (this.renderer.gl = r),
          (this.renderer.CONTEXT_UID = la++),
          r.isContextLost() &&
            r.getExtension("WEBGL_lose_context") &&
            r.getExtension("WEBGL_lose_context").restoreContext();
      }),
      (t.prototype.initFromContext = function (r) {
        (this.gl = r),
          this.validateContext(r),
          (this.renderer.gl = r),
          (this.renderer.CONTEXT_UID = la++),
          this.renderer.runners.contextChange.emit(r);
      }),
      (t.prototype.initFromOptions = function (r) {
        var e = this.createContext(this.renderer.view, r);
        this.initFromContext(e);
      }),
      (t.prototype.createContext = function (r, e) {
        var i;
        if ((S.PREFER_ENV >= Bt.WEBGL2 && (i = r.getContext("webgl2", e)), i))
          this.webGLVersion = 2;
        else if (
          ((this.webGLVersion = 1),
          (i =
            r.getContext("webgl", e) || r.getContext("experimental-webgl", e)),
          !i)
        )
          throw new Error(
            "This browser does not support WebGL. Try using the canvas renderer"
          );
        return (this.gl = i), this.getExtensions(), this.gl;
      }),
      (t.prototype.getExtensions = function () {
        var r = this.gl,
          e = {
            anisotropicFiltering: r.getExtension(
              "EXT_texture_filter_anisotropic"
            ),
            floatTextureLinear: r.getExtension("OES_texture_float_linear"),
            s3tc: r.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: r.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: r.getExtension("WEBGL_compressed_texture_etc"),
            etc1: r.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc:
              r.getExtension("WEBGL_compressed_texture_pvrtc") ||
              r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: r.getExtension("WEBGL_compressed_texture_atc"),
            astc: r.getExtension("WEBGL_compressed_texture_astc"),
          };
        this.webGLVersion === 1
          ? Object.assign(this.extensions, e, {
              drawBuffers: r.getExtension("WEBGL_draw_buffers"),
              depthTexture: r.getExtension("WEBGL_depth_texture"),
              loseContext: r.getExtension("WEBGL_lose_context"),
              vertexArrayObject:
                r.getExtension("OES_vertex_array_object") ||
                r.getExtension("MOZ_OES_vertex_array_object") ||
                r.getExtension("WEBKIT_OES_vertex_array_object"),
              uint32ElementIndex: r.getExtension("OES_element_index_uint"),
              floatTexture: r.getExtension("OES_texture_float"),
              floatTextureLinear: r.getExtension("OES_texture_float_linear"),
              textureHalfFloat: r.getExtension("OES_texture_half_float"),
              textureHalfFloatLinear: r.getExtension(
                "OES_texture_half_float_linear"
              ),
            })
          : this.webGLVersion === 2 &&
            Object.assign(this.extensions, e, {
              colorBufferFloat: r.getExtension("EXT_color_buffer_float"),
            });
      }),
      (t.prototype.handleContextLost = function (r) {
        r.preventDefault();
      }),
      (t.prototype.handleContextRestored = function () {
        this.renderer.runners.contextChange.emit(this.gl);
      }),
      (t.prototype.destroy = function () {
        var r = this.renderer.view;
        (this.renderer = null),
          r.removeEventListener("webglcontextlost", this.handleContextLost),
          r.removeEventListener(
            "webglcontextrestored",
            this.handleContextRestored
          ),
          this.gl.useProgram(null),
          this.extensions.loseContext &&
            this.extensions.loseContext.loseContext();
      }),
      (t.prototype.postrender = function () {
        this.renderer.renderingToScreen && this.gl.flush();
      }),
      (t.prototype.validateContext = function (r) {
        var e = r.getContextAttributes(),
          i =
            "WebGL2RenderingContext" in self &&
            r instanceof self.WebGL2RenderingContext;
        i && (this.webGLVersion = 2),
          e.stencil ||
            console.warn(
              "Provided WebGL context does not have a stencil buffer, masks may not render correctly"
            );
        var n = i || !!r.getExtension("OES_element_index_uint");
        (this.supports.uint32Indices = n),
          n ||
            console.warn(
              "Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly"
            );
      }),
      t
    );
  })(),
  Uc = (function () {
    function t(r) {
      (this.framebuffer = r),
        (this.stencil = null),
        (this.dirtyId = -1),
        (this.dirtyFormat = -1),
        (this.dirtySize = -1),
        (this.multisample = ct.NONE),
        (this.msaaBuffer = null),
        (this.blitFramebuffer = null),
        (this.mipLevel = 0);
    }
    return t;
  })(),
  Fc = new z(),
  da = (function () {
    function t(r) {
      (this.renderer = r),
        (this.managedFramebuffers = []),
        (this.unknownFramebuffer = new wi(10, 10)),
        (this.msaaSamples = null);
    }
    return (
      (t.prototype.contextChange = function () {
        var r = (this.gl = this.renderer.gl);
        if (
          ((this.CONTEXT_UID = this.renderer.CONTEXT_UID),
          (this.current = this.unknownFramebuffer),
          (this.viewport = new z()),
          (this.hasMRT = !0),
          (this.writeDepthTexture = !0),
          this.disposeAll(!0),
          this.renderer.context.webGLVersion === 1)
        ) {
          var e = this.renderer.context.extensions.drawBuffers,
            i = this.renderer.context.extensions.depthTexture;
          S.PREFER_ENV === Bt.WEBGL_LEGACY && ((e = null), (i = null)),
            e
              ? (r.drawBuffers = function (n) {
                  return e.drawBuffersWEBGL(n);
                })
              : ((this.hasMRT = !1), (r.drawBuffers = function () {})),
            i || (this.writeDepthTexture = !1);
        } else
          this.msaaSamples = r.getInternalformatParameter(
            r.RENDERBUFFER,
            r.RGBA8,
            r.SAMPLES
          );
      }),
      (t.prototype.bind = function (r, e, i) {
        i === void 0 && (i = 0);
        var n = this.gl;
        if (r) {
          var s = r.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(r);
          this.current !== r &&
            ((this.current = r),
            n.bindFramebuffer(n.FRAMEBUFFER, s.framebuffer)),
            s.mipLevel !== i &&
              (r.dirtyId++, r.dirtyFormat++, (s.mipLevel = i)),
            s.dirtyId !== r.dirtyId &&
              ((s.dirtyId = r.dirtyId),
              s.dirtyFormat !== r.dirtyFormat
                ? ((s.dirtyFormat = r.dirtyFormat),
                  (s.dirtySize = r.dirtySize),
                  this.updateFramebuffer(r, i))
                : s.dirtySize !== r.dirtySize &&
                  ((s.dirtySize = r.dirtySize), this.resizeFramebuffer(r)));
          for (var a = 0; a < r.colorTextures.length; a++) {
            var o = r.colorTextures[a];
            this.renderer.texture.unbind(o.parentTextureArray || o);
          }
          if (
            (r.depthTexture && this.renderer.texture.unbind(r.depthTexture), e)
          ) {
            var h = e.width >> i,
              u = e.height >> i,
              f = h / e.width;
            this.setViewport(e.x * f, e.y * f, h, u);
          } else {
            var h = r.width >> i,
              u = r.height >> i;
            this.setViewport(0, 0, h, u);
          }
        } else
          this.current &&
            ((this.current = null), n.bindFramebuffer(n.FRAMEBUFFER, null)),
            e
              ? this.setViewport(e.x, e.y, e.width, e.height)
              : this.setViewport(
                  0,
                  0,
                  this.renderer.width,
                  this.renderer.height
                );
      }),
      (t.prototype.setViewport = function (r, e, i, n) {
        var s = this.viewport;
        (r = Math.round(r)),
          (e = Math.round(e)),
          (i = Math.round(i)),
          (n = Math.round(n)),
          (s.width !== i || s.height !== n || s.x !== r || s.y !== e) &&
            ((s.x = r),
            (s.y = e),
            (s.width = i),
            (s.height = n),
            this.gl.viewport(r, e, i, n));
      }),
      Object.defineProperty(t.prototype, "size", {
        get: function () {
          return this.current
            ? {
                x: 0,
                y: 0,
                width: this.current.width,
                height: this.current.height,
              }
            : {
                x: 0,
                y: 0,
                width: this.renderer.width,
                height: this.renderer.height,
              };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.clear = function (r, e, i, n, s) {
        s === void 0 && (s = fr.COLOR | fr.DEPTH);
        var a = this.gl;
        a.clearColor(r, e, i, n), a.clear(s);
      }),
      (t.prototype.initFramebuffer = function (r) {
        var e = this.gl,
          i = new Uc(e.createFramebuffer());
        return (
          (i.multisample = this.detectSamples(r.multisample)),
          (r.glFramebuffers[this.CONTEXT_UID] = i),
          this.managedFramebuffers.push(r),
          r.disposeRunner.add(this),
          i
        );
      }),
      (t.prototype.resizeFramebuffer = function (r) {
        var e = this.gl,
          i = r.glFramebuffers[this.CONTEXT_UID];
        i.msaaBuffer &&
          (e.bindRenderbuffer(e.RENDERBUFFER, i.msaaBuffer),
          e.renderbufferStorageMultisample(
            e.RENDERBUFFER,
            i.multisample,
            e.RGBA8,
            r.width,
            r.height
          )),
          i.stencil &&
            (e.bindRenderbuffer(e.RENDERBUFFER, i.stencil),
            i.msaaBuffer
              ? e.renderbufferStorageMultisample(
                  e.RENDERBUFFER,
                  i.multisample,
                  e.DEPTH24_STENCIL8,
                  r.width,
                  r.height
                )
              : e.renderbufferStorage(
                  e.RENDERBUFFER,
                  e.DEPTH_STENCIL,
                  r.width,
                  r.height
                ));
        var n = r.colorTextures,
          s = n.length;
        e.drawBuffers || (s = Math.min(s, 1));
        for (var a = 0; a < s; a++) {
          var o = n[a],
            h = o.parentTextureArray || o;
          this.renderer.texture.bind(h, 0);
        }
        r.depthTexture &&
          this.writeDepthTexture &&
          this.renderer.texture.bind(r.depthTexture, 0);
      }),
      (t.prototype.updateFramebuffer = function (r, e) {
        var i = this.gl,
          n = r.glFramebuffers[this.CONTEXT_UID],
          s = r.colorTextures,
          a = s.length;
        i.drawBuffers || (a = Math.min(a, 1)),
          n.multisample > 1 && this.canMultisampleFramebuffer(r)
            ? ((n.msaaBuffer = n.msaaBuffer || i.createRenderbuffer()),
              i.bindRenderbuffer(i.RENDERBUFFER, n.msaaBuffer),
              i.renderbufferStorageMultisample(
                i.RENDERBUFFER,
                n.multisample,
                i.RGBA8,
                r.width,
                r.height
              ),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0,
                i.RENDERBUFFER,
                n.msaaBuffer
              ))
            : n.msaaBuffer &&
              (i.deleteRenderbuffer(n.msaaBuffer),
              (n.msaaBuffer = null),
              n.blitFramebuffer &&
                (n.blitFramebuffer.dispose(), (n.blitFramebuffer = null)));
        for (var o = [], h = 0; h < a; h++) {
          var u = s[h],
            f = u.parentTextureArray || u;
          this.renderer.texture.bind(f, 0),
            !(h === 0 && n.msaaBuffer) &&
              (i.framebufferTexture2D(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + h,
                u.target,
                f._glTextures[this.CONTEXT_UID].texture,
                e
              ),
              o.push(i.COLOR_ATTACHMENT0 + h));
        }
        if ((o.length > 1 && i.drawBuffers(o), r.depthTexture)) {
          var c = this.writeDepthTexture;
          if (c) {
            var l = r.depthTexture;
            this.renderer.texture.bind(l, 0),
              i.framebufferTexture2D(
                i.FRAMEBUFFER,
                i.DEPTH_ATTACHMENT,
                i.TEXTURE_2D,
                l._glTextures[this.CONTEXT_UID].texture,
                e
              );
          }
        }
        (r.stencil || r.depth) && !(r.depthTexture && this.writeDepthTexture)
          ? ((n.stencil = n.stencil || i.createRenderbuffer()),
            i.bindRenderbuffer(i.RENDERBUFFER, n.stencil),
            n.msaaBuffer
              ? i.renderbufferStorageMultisample(
                  i.RENDERBUFFER,
                  n.multisample,
                  i.DEPTH24_STENCIL8,
                  r.width,
                  r.height
                )
              : i.renderbufferStorage(
                  i.RENDERBUFFER,
                  i.DEPTH_STENCIL,
                  r.width,
                  r.height
                ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.DEPTH_STENCIL_ATTACHMENT,
              i.RENDERBUFFER,
              n.stencil
            ))
          : n.stencil && (i.deleteRenderbuffer(n.stencil), (n.stencil = null));
      }),
      (t.prototype.canMultisampleFramebuffer = function (r) {
        return (
          this.renderer.context.webGLVersion !== 1 &&
          r.colorTextures.length <= 1 &&
          !r.depthTexture
        );
      }),
      (t.prototype.detectSamples = function (r) {
        var e = this.msaaSamples,
          i = ct.NONE;
        if (r <= 1 || e === null) return i;
        for (var n = 0; n < e.length; n++)
          if (e[n] <= r) {
            i = e[n];
            break;
          }
        return i === 1 && (i = ct.NONE), i;
      }),
      (t.prototype.blit = function (r, e, i) {
        var n = this,
          s = n.current,
          a = n.renderer,
          o = n.gl,
          h = n.CONTEXT_UID;
        if (a.context.webGLVersion === 2 && !!s) {
          var u = s.glFramebuffers[h];
          if (!!u) {
            if (!r) {
              if (!u.msaaBuffer) return;
              var f = s.colorTextures[0];
              if (!f) return;
              u.blitFramebuffer ||
                ((u.blitFramebuffer = new wi(s.width, s.height)),
                u.blitFramebuffer.addColorTexture(0, f)),
                (r = u.blitFramebuffer),
                r.colorTextures[0] !== f &&
                  ((r.colorTextures[0] = f), r.dirtyId++, r.dirtyFormat++),
                (r.width !== s.width || r.height !== s.height) &&
                  ((r.width = s.width),
                  (r.height = s.height),
                  r.dirtyId++,
                  r.dirtySize++);
            }
            e || ((e = Fc), (e.width = s.width), (e.height = s.height)),
              i || (i = e);
            var c = e.width === i.width && e.height === i.height;
            this.bind(r),
              o.bindFramebuffer(o.READ_FRAMEBUFFER, u.framebuffer),
              o.blitFramebuffer(
                e.x,
                e.y,
                e.width,
                e.height,
                i.x,
                i.y,
                i.width,
                i.height,
                o.COLOR_BUFFER_BIT,
                c ? o.NEAREST : o.LINEAR
              );
          }
        }
      }),
      (t.prototype.disposeFramebuffer = function (r, e) {
        var i = r.glFramebuffers[this.CONTEXT_UID],
          n = this.gl;
        if (!!i) {
          delete r.glFramebuffers[this.CONTEXT_UID];
          var s = this.managedFramebuffers.indexOf(r);
          s >= 0 && this.managedFramebuffers.splice(s, 1),
            r.disposeRunner.remove(this),
            e ||
              (n.deleteFramebuffer(i.framebuffer),
              i.msaaBuffer && n.deleteRenderbuffer(i.msaaBuffer),
              i.stencil && n.deleteRenderbuffer(i.stencil)),
            i.blitFramebuffer && i.blitFramebuffer.dispose();
        }
      }),
      (t.prototype.disposeAll = function (r) {
        var e = this.managedFramebuffers;
        this.managedFramebuffers = [];
        for (var i = 0; i < e.length; i++) this.disposeFramebuffer(e[i], r);
      }),
      (t.prototype.forceStencil = function () {
        var r = this.current;
        if (!!r) {
          var e = r.glFramebuffers[this.CONTEXT_UID];
          if (!(!e || e.stencil)) {
            r.stencil = !0;
            var i = r.width,
              n = r.height,
              s = this.gl,
              a = s.createRenderbuffer();
            s.bindRenderbuffer(s.RENDERBUFFER, a),
              e.msaaBuffer
                ? s.renderbufferStorageMultisample(
                    s.RENDERBUFFER,
                    e.multisample,
                    s.DEPTH24_STENCIL8,
                    i,
                    n
                  )
                : s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_STENCIL, i, n),
              (e.stencil = a),
              s.framebufferRenderbuffer(
                s.FRAMEBUFFER,
                s.DEPTH_STENCIL_ATTACHMENT,
                s.RENDERBUFFER,
                a
              );
          }
        }
      }),
      (t.prototype.reset = function () {
        (this.current = this.unknownFramebuffer), (this.viewport = new z());
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  Pi = { 5126: 4, 5123: 2, 5121: 1 },
  pa = (function () {
    function t(r) {
      (this.renderer = r),
        (this._activeGeometry = null),
        (this._activeVao = null),
        (this.hasVao = !0),
        (this.hasInstance = !0),
        (this.canUseUInt32ElementIndex = !1),
        (this.managedGeometries = {});
    }
    return (
      (t.prototype.contextChange = function () {
        this.disposeAll(!0);
        var r = (this.gl = this.renderer.gl),
          e = this.renderer.context;
        if (
          ((this.CONTEXT_UID = this.renderer.CONTEXT_UID), e.webGLVersion !== 2)
        ) {
          var i = this.renderer.context.extensions.vertexArrayObject;
          S.PREFER_ENV === Bt.WEBGL_LEGACY && (i = null),
            i
              ? ((r.createVertexArray = function () {
                  return i.createVertexArrayOES();
                }),
                (r.bindVertexArray = function (s) {
                  return i.bindVertexArrayOES(s);
                }),
                (r.deleteVertexArray = function (s) {
                  return i.deleteVertexArrayOES(s);
                }))
              : ((this.hasVao = !1),
                (r.createVertexArray = function () {
                  return null;
                }),
                (r.bindVertexArray = function () {
                  return null;
                }),
                (r.deleteVertexArray = function () {
                  return null;
                }));
        }
        if (e.webGLVersion !== 2) {
          var n = r.getExtension("ANGLE_instanced_arrays");
          n
            ? ((r.vertexAttribDivisor = function (s, a) {
                return n.vertexAttribDivisorANGLE(s, a);
              }),
              (r.drawElementsInstanced = function (s, a, o, h, u) {
                return n.drawElementsInstancedANGLE(s, a, o, h, u);
              }),
              (r.drawArraysInstanced = function (s, a, o, h) {
                return n.drawArraysInstancedANGLE(s, a, o, h);
              }))
            : (this.hasInstance = !1);
        }
        this.canUseUInt32ElementIndex =
          e.webGLVersion === 2 || !!e.extensions.uint32ElementIndex;
      }),
      (t.prototype.bind = function (r, e) {
        e = e || this.renderer.shader.shader;
        var i = this.gl,
          n = r.glVertexArrayObjects[this.CONTEXT_UID],
          s = !1;
        n ||
          ((this.managedGeometries[r.id] = r),
          r.disposeRunner.add(this),
          (r.glVertexArrayObjects[this.CONTEXT_UID] = n = {}),
          (s = !0));
        var a = n[e.program.id] || this.initGeometryVao(r, e, s);
        (this._activeGeometry = r),
          this._activeVao !== a &&
            ((this._activeVao = a),
            this.hasVao
              ? i.bindVertexArray(a)
              : this.activateVao(r, e.program)),
          this.updateBuffers();
      }),
      (t.prototype.reset = function () {
        this.unbind();
      }),
      (t.prototype.updateBuffers = function () {
        for (
          var r = this._activeGeometry, e = this.renderer.buffer, i = 0;
          i < r.buffers.length;
          i++
        ) {
          var n = r.buffers[i];
          e.update(n);
        }
      }),
      (t.prototype.checkCompatibility = function (r, e) {
        var i = r.attributes,
          n = e.attributeData;
        for (var s in n)
          if (!i[s])
            throw new Error(
              'shader and geometry incompatible, geometry missing the "' +
                s +
                '" attribute'
            );
      }),
      (t.prototype.getSignature = function (r, e) {
        var i = r.attributes,
          n = e.attributeData,
          s = ["g", r.id];
        for (var a in i) n[a] && s.push(a, n[a].location);
        return s.join("-");
      }),
      (t.prototype.initGeometryVao = function (r, e, i) {
        i === void 0 && (i = !0);
        var n = this.gl,
          s = this.CONTEXT_UID,
          a = this.renderer.buffer,
          o = e.program;
        o.glPrograms[s] || this.renderer.shader.generateProgram(e),
          this.checkCompatibility(r, o);
        var h = this.getSignature(r, o),
          u = r.glVertexArrayObjects[this.CONTEXT_UID],
          f = u[h];
        if (f) return (u[o.id] = f), f;
        var c = r.buffers,
          l = r.attributes,
          d = {},
          p = {};
        for (var _ in c) (d[_] = 0), (p[_] = 0);
        for (var _ in l)
          !l[_].size && o.attributeData[_]
            ? (l[_].size = o.attributeData[_].size)
            : l[_].size ||
              console.warn(
                "PIXI Geometry attribute '" +
                  _ +
                  "' size cannot be determined (likely the bound shader does not have the attribute)"
              ),
            (d[l[_].buffer] += l[_].size * Pi[l[_].type]);
        for (var _ in l) {
          var v = l[_],
            m = v.size;
          v.stride === void 0 &&
            (d[v.buffer] === m * Pi[v.type]
              ? (v.stride = 0)
              : (v.stride = d[v.buffer])),
            v.start === void 0 &&
              ((v.start = p[v.buffer]), (p[v.buffer] += m * Pi[v.type]));
        }
        (f = n.createVertexArray()), n.bindVertexArray(f);
        for (var g = 0; g < c.length; g++) {
          var T = c[g];
          a.bind(T), i && T._glBuffers[s].refCount++;
        }
        return (
          this.activateVao(r, o),
          (this._activeVao = f),
          (u[o.id] = f),
          (u[h] = f),
          f
        );
      }),
      (t.prototype.disposeGeometry = function (r, e) {
        var i;
        if (!!this.managedGeometries[r.id]) {
          delete this.managedGeometries[r.id];
          var n = r.glVertexArrayObjects[this.CONTEXT_UID],
            s = this.gl,
            a = r.buffers,
            o =
              (i = this.renderer) === null || i === void 0 ? void 0 : i.buffer;
          if ((r.disposeRunner.remove(this), !!n)) {
            if (o)
              for (var h = 0; h < a.length; h++) {
                var u = a[h]._glBuffers[this.CONTEXT_UID];
                u &&
                  (u.refCount--, u.refCount === 0 && !e && o.dispose(a[h], e));
              }
            if (!e) {
              for (var f in n)
                if (f[0] === "g") {
                  var c = n[f];
                  this._activeVao === c && this.unbind(),
                    s.deleteVertexArray(c);
                }
            }
            delete r.glVertexArrayObjects[this.CONTEXT_UID];
          }
        }
      }),
      (t.prototype.disposeAll = function (r) {
        for (
          var e = Object.keys(this.managedGeometries), i = 0;
          i < e.length;
          i++
        )
          this.disposeGeometry(this.managedGeometries[e[i]], r);
      }),
      (t.prototype.activateVao = function (r, e) {
        var i = this.gl,
          n = this.CONTEXT_UID,
          s = this.renderer.buffer,
          a = r.buffers,
          o = r.attributes;
        r.indexBuffer && s.bind(r.indexBuffer);
        var h = null;
        for (var u in o) {
          var f = o[u],
            c = a[f.buffer],
            l = c._glBuffers[n];
          if (e.attributeData[u]) {
            h !== l && (s.bind(c), (h = l));
            var d = e.attributeData[u].location;
            if (
              (i.enableVertexAttribArray(d),
              i.vertexAttribPointer(
                d,
                f.size,
                f.type || i.FLOAT,
                f.normalized,
                f.stride,
                f.start
              ),
              f.instance)
            )
              if (this.hasInstance) i.vertexAttribDivisor(d, 1);
              else
                throw new Error(
                  "geometry error, GPU Instancing is not supported on this device"
                );
          }
        }
      }),
      (t.prototype.draw = function (r, e, i, n) {
        var s = this.gl,
          a = this._activeGeometry;
        if (a.indexBuffer) {
          var o = a.indexBuffer.data.BYTES_PER_ELEMENT,
            h = o === 2 ? s.UNSIGNED_SHORT : s.UNSIGNED_INT;
          o === 2 || (o === 4 && this.canUseUInt32ElementIndex)
            ? a.instanced
              ? s.drawElementsInstanced(
                  r,
                  e || a.indexBuffer.data.length,
                  h,
                  (i || 0) * o,
                  n || 1
                )
              : s.drawElements(
                  r,
                  e || a.indexBuffer.data.length,
                  h,
                  (i || 0) * o
                )
            : console.warn("unsupported index buffer type: uint32");
        } else
          a.instanced
            ? s.drawArraysInstanced(r, i, e || a.getSize(), n || 1)
            : s.drawArrays(r, i, e || a.getSize());
        return this;
      }),
      (t.prototype.unbind = function () {
        this.gl.bindVertexArray(null),
          (this._activeVao = null),
          (this._activeGeometry = null);
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  Lc = (function () {
    function t(r) {
      r === void 0 && (r = null),
        (this.type = xt.NONE),
        (this.autoDetect = !0),
        (this.maskObject = r || null),
        (this.pooled = !1),
        (this.isMaskData = !0),
        (this.resolution = null),
        (this.multisample = S.FILTER_MULTISAMPLE),
        (this.enabled = !0),
        (this._filters = null),
        (this._stencilCounter = 0),
        (this._scissorCounter = 0),
        (this._scissorRect = null),
        (this._scissorRectLocal = null),
        (this._target = null);
    }
    return (
      Object.defineProperty(t.prototype, "filter", {
        get: function () {
          return this._filters ? this._filters[0] : null;
        },
        set: function (r) {
          r
            ? this._filters
              ? (this._filters[0] = r)
              : (this._filters = [r])
            : (this._filters = null);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.reset = function () {
        this.pooled &&
          ((this.maskObject = null),
          (this.type = xt.NONE),
          (this.autoDetect = !0)),
          (this._target = null),
          (this._scissorRectLocal = null);
      }),
      (t.prototype.copyCountersOrReset = function (r) {
        r
          ? ((this._stencilCounter = r._stencilCounter),
            (this._scissorCounter = r._scissorCounter),
            (this._scissorRect = r._scissorRect))
          : ((this._stencilCounter = 0),
            (this._scissorCounter = 0),
            (this._scissorRect = null));
      }),
      t
    );
  })();
function va(t, r, e) {
  var i = t.createShader(r);
  return t.shaderSource(i, e), t.compileShader(i), i;
}
function _a(t, r) {
  var e = t
      .getShaderSource(r)
      .split(
        `
`
      )
      .map(function (u, f) {
        return f + ": " + u;
      }),
    i = t.getShaderInfoLog(r),
    n = i.split(`
`),
    s = {},
    a = n
      .map(function (u) {
        return parseFloat(u.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
      })
      .filter(function (u) {
        return u && !s[u] ? ((s[u] = !0), !0) : !1;
      }),
    o = [""];
  a.forEach(function (u) {
    (e[u - 1] = "%c" + e[u - 1] + "%c"),
      o.push(
        "background: #FF0000; color:#FFFFFF; font-size: 10px",
        "font-size: 10px"
      );
  });
  var h = e.join(`
`);
  (o[0] = h),
    console.error(i),
    console.groupCollapsed("click to view full shader code"),
    console.warn.apply(console, o),
    console.groupEnd();
}
function Gc(t, r, e, i) {
  t.getProgramParameter(r, t.LINK_STATUS) ||
    (t.getShaderParameter(e, t.COMPILE_STATUS) || _a(t, e),
    t.getShaderParameter(i, t.COMPILE_STATUS) || _a(t, i),
    console.error("PixiJS Error: Could not initialize shader."),
    t.getProgramInfoLog(r) !== "" &&
      console.warn(
        "PixiJS Warning: gl.getProgramInfoLog()",
        t.getProgramInfoLog(r)
      ));
}
function Ai(t) {
  for (var r = new Array(t), e = 0; e < r.length; e++) r[e] = !1;
  return r;
}
function ma(t, r) {
  switch (t) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * r);
    case "vec3":
      return new Float32Array(3 * r);
    case "vec4":
      return new Float32Array(4 * r);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * r);
    case "ivec3":
      return new Int32Array(3 * r);
    case "ivec4":
      return new Int32Array(4 * r);
    case "uvec2":
      return new Uint32Array(2 * r);
    case "uvec3":
      return new Uint32Array(3 * r);
    case "uvec4":
      return new Uint32Array(4 * r);
    case "bool":
      return !1;
    case "bvec2":
      return Ai(2 * r);
    case "bvec3":
      return Ai(3 * r);
    case "bvec4":
      return Ai(4 * r);
    case "mat2":
      return new Float32Array([1, 0, 0, 1]);
    case "mat3":
      return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    case "mat4":
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  return null;
}
var ya = {},
  Ve = ya;
function Bc() {
  if (Ve === ya || (Ve && Ve.isContextLost())) {
    var t = document.createElement("canvas"),
      r = void 0;
    S.PREFER_ENV >= Bt.WEBGL2 && (r = t.getContext("webgl2", {})),
      r ||
        ((r =
          t.getContext("webgl", {}) || t.getContext("experimental-webgl", {})),
        r ? r.getExtension("WEBGL_draw_buffers") : (r = null)),
      (Ve = r);
  }
  return Ve;
}
var Rr;
function Mc() {
  if (!Rr) {
    Rr = St.MEDIUM;
    var t = Bc();
    if (t && t.getShaderPrecisionFormat) {
      var r = t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT);
      Rr = r.precision ? St.HIGH : St.MEDIUM;
    }
  }
  return Rr;
}
function ga(t, r, e) {
  if (t.substring(0, 9) !== "precision") {
    var i = r;
    return (
      r === St.HIGH && e !== St.HIGH && (i = St.MEDIUM),
      "precision " +
        i +
        ` float;
` +
        t
    );
  } else if (e !== St.HIGH && t.substring(0, 15) === "precision highp")
    return t.replace("precision highp", "precision mediump");
  return t;
}
var Dc = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  int: 1,
  ivec2: 2,
  ivec3: 3,
  ivec4: 4,
  uint: 1,
  uvec2: 2,
  uvec3: 3,
  uvec4: 4,
  bool: 1,
  bvec2: 2,
  bvec3: 3,
  bvec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1,
};
function xa(t) {
  return Dc[t];
}
var wr = null,
  Ta = {
    FLOAT: "float",
    FLOAT_VEC2: "vec2",
    FLOAT_VEC3: "vec3",
    FLOAT_VEC4: "vec4",
    INT: "int",
    INT_VEC2: "ivec2",
    INT_VEC3: "ivec3",
    INT_VEC4: "ivec4",
    UNSIGNED_INT: "uint",
    UNSIGNED_INT_VEC2: "uvec2",
    UNSIGNED_INT_VEC3: "uvec3",
    UNSIGNED_INT_VEC4: "uvec4",
    BOOL: "bool",
    BOOL_VEC2: "bvec2",
    BOOL_VEC3: "bvec3",
    BOOL_VEC4: "bvec4",
    FLOAT_MAT2: "mat2",
    FLOAT_MAT3: "mat3",
    FLOAT_MAT4: "mat4",
    SAMPLER_2D: "sampler2D",
    INT_SAMPLER_2D: "sampler2D",
    UNSIGNED_INT_SAMPLER_2D: "sampler2D",
    SAMPLER_CUBE: "samplerCube",
    INT_SAMPLER_CUBE: "samplerCube",
    UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
    SAMPLER_2D_ARRAY: "sampler2DArray",
    INT_SAMPLER_2D_ARRAY: "sampler2DArray",
    UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  };
function ba(t, r) {
  if (!wr) {
    var e = Object.keys(Ta);
    wr = {};
    for (var i = 0; i < e.length; ++i) {
      var n = e[i];
      wr[t[n]] = Ta[n];
    }
  }
  return wr[r];
}
var Ee = [
    {
      test: function (t) {
        return t.type === "float" && t.size === 1;
      },
      code: function (t) {
        return (
          `
            if(uv["` +
          t +
          '"] !== ud["' +
          t +
          `"].value)
            {
                ud["` +
          t +
          '"].value = uv["' +
          t +
          `"]
                gl.uniform1f(ud["` +
          t +
          '"].location, uv["' +
          t +
          `"])
            }
            `
        );
      },
    },
    {
      test: function (t) {
        return (
          (t.type === "sampler2D" ||
            t.type === "samplerCube" ||
            t.type === "sampler2DArray") &&
          t.size === 1 &&
          !t.isArray
        );
      },
      code: function (t) {
        return (
          `t = syncData.textureCount++;

            renderer.texture.bind(uv["` +
          t +
          `"], t);

            if(ud["` +
          t +
          `"].value !== t)
            {
                ud["` +
          t +
          `"].value = t;
                gl.uniform1i(ud["` +
          t +
          `"].location, t);
; // eslint-disable-line max-len
            }`
        );
      },
    },
    {
      test: function (t, r) {
        return t.type === "mat3" && t.size === 1 && r.a !== void 0;
      },
      code: function (t) {
        return (
          `
            gl.uniformMatrix3fv(ud["` +
          t +
          '"].location, false, uv["' +
          t +
          `"].toArray(true));
            `
        );
      },
      codeUbo: function (t) {
        return (
          `
                var ` +
          t +
          "_matrix = uv." +
          t +
          `.toArray(true);

                data[offset] = ` +
          t +
          `_matrix[0];
                data[offset+1] = ` +
          t +
          `_matrix[1];
                data[offset+2] = ` +
          t +
          `_matrix[2];
        
                data[offset + 4] = ` +
          t +
          `_matrix[3];
                data[offset + 5] = ` +
          t +
          `_matrix[4];
                data[offset + 6] = ` +
          t +
          `_matrix[5];
        
                data[offset + 8] = ` +
          t +
          `_matrix[6];
                data[offset + 9] = ` +
          t +
          `_matrix[7];
                data[offset + 10] = ` +
          t +
          `_matrix[8];
            `
        );
      },
    },
    {
      test: function (t, r) {
        return t.type === "vec2" && t.size === 1 && r.x !== void 0;
      },
      code: function (t) {
        return (
          `
                cv = ud["` +
          t +
          `"].value;
                v = uv["` +
          t +
          `"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["` +
          t +
          `"].location, v.x, v.y);
                }`
        );
      },
      codeUbo: function (t) {
        return (
          `
                v = uv.` +
          t +
          `;

                data[offset] = v.x;
                data[offset+1] = v.y;
            `
        );
      },
    },
    {
      test: function (t) {
        return t.type === "vec2" && t.size === 1;
      },
      code: function (t) {
        return (
          `
                cv = ud["` +
          t +
          `"].value;
                v = uv["` +
          t +
          `"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["` +
          t +
          `"].location, v[0], v[1]);
                }
            `
        );
      },
    },
    {
      test: function (t, r) {
        return t.type === "vec4" && t.size === 1 && r.width !== void 0;
      },
      code: function (t) {
        return (
          `
                cv = ud["` +
          t +
          `"].value;
                v = uv["` +
          t +
          `"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["` +
          t +
          `"].location, v.x, v.y, v.width, v.height)
                }`
        );
      },
      codeUbo: function (t) {
        return (
          `
                    v = uv.` +
          t +
          `;

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `
        );
      },
    },
    {
      test: function (t) {
        return t.type === "vec4" && t.size === 1;
      },
      code: function (t) {
        return (
          `
                cv = ud["` +
          t +
          `"].value;
                v = uv["` +
          t +
          `"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["` +
          t +
          `"].location, v[0], v[1], v[2], v[3])
                }`
        );
      },
    },
  ],
  kc = {
    float: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1f(location, v);
    }`,
    vec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2f(location, v[0], v[1])
    }`,
    vec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3f(location, v[0], v[1], v[2])
    }`,
    vec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4f(location, v[0], v[1], v[2], v[3]);
    }`,
    int: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
    ivec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
    ivec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
    ivec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
    uint: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1ui(location, v);
    }`,
    uvec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2ui(location, v[0], v[1]);
    }`,
    uvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3ui(location, v[0], v[1], v[2]);
    }`,
    uvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
    }`,
    bool: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1i(location, v);
    }`,
    bvec2: `
    if (cv[0] != v[0] || cv[1] != v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
    bvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
    bvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    sampler2D: "gl.uniform1i(location, v)",
    samplerCube: "gl.uniform1i(location, v)",
    sampler2DArray: "gl.uniform1i(location, v)",
  },
  Xc = {
    float: "gl.uniform1fv(location, v)",
    vec2: "gl.uniform2fv(location, v)",
    vec3: "gl.uniform3fv(location, v)",
    vec4: "gl.uniform4fv(location, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    int: "gl.uniform1iv(location, v)",
    ivec2: "gl.uniform2iv(location, v)",
    ivec3: "gl.uniform3iv(location, v)",
    ivec4: "gl.uniform4iv(location, v)",
    uint: "gl.uniform1uiv(location, v)",
    uvec2: "gl.uniform2uiv(location, v)",
    uvec3: "gl.uniform3uiv(location, v)",
    uvec4: "gl.uniform4uiv(location, v)",
    bool: "gl.uniform1iv(location, v)",
    bvec2: "gl.uniform2iv(location, v)",
    bvec3: "gl.uniform3iv(location, v)",
    bvec4: "gl.uniform4iv(location, v)",
    sampler2D: "gl.uniform1iv(location, v)",
    samplerCube: "gl.uniform1iv(location, v)",
    sampler2DArray: "gl.uniform1iv(location, v)",
  };
function Hc(t, r) {
  var e,
    i = [
      `
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `,
    ];
  for (var n in t.uniforms) {
    var s = r[n];
    if (!s) {
      ((e = t.uniforms[n]) === null || e === void 0 ? void 0 : e.group) &&
        (t.uniforms[n].ubo
          ? i.push(
              `
                        renderer.shader.syncUniformBufferGroup(uv.` +
                n +
                ", '" +
                n +
                `');
                    `
            )
          : i.push(
              `
                        renderer.shader.syncUniformGroup(uv.` +
                n +
                `, syncData);
                    `
            ));
      continue;
    }
    for (var a = t.uniforms[n], o = !1, h = 0; h < Ee.length; h++)
      if (Ee[h].test(s, a)) {
        i.push(Ee[h].code(n, a)), (o = !0);
        break;
      }
    if (!o) {
      var u = s.size === 1 ? kc : Xc,
        f = u[s.type].replace("location", 'ud["' + n + '"].location');
      i.push(
        `
            cu = ud["` +
          n +
          `"];
            cv = cu.value;
            v = uv["` +
          n +
          `"];
            ` +
          f +
          ";"
      );
    }
  }
  return new Function(
    "ud",
    "uv",
    "renderer",
    "syncData",
    i.join(`
`)
  );
}
var Vc = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}",
].join(`
`);
function jc(t) {
  for (var r = "", e = 0; e < t; ++e)
    e > 0 &&
      (r += `
else `),
      e < t - 1 && (r += "if(test == " + e + ".0){}");
  return r;
}
function zc(t, r) {
  if (t === 0)
    throw new Error(
      "Invalid value of `0` passed to `checkMaxIfStatementsInShader`"
    );
  for (var e = r.createShader(r.FRAGMENT_SHADER); ; ) {
    var i = Vc.replace(/%forloop%/gi, jc(t));
    if (
      (r.shaderSource(e, i),
      r.compileShader(e),
      !r.getShaderParameter(e, r.COMPILE_STATUS))
    )
      t = (t / 2) | 0;
    else break;
  }
  return t;
}
var je;
function Wc() {
  if (typeof je == "boolean") return je;
  try {
    var t = new Function(
      "param1",
      "param2",
      "param3",
      "return param1[param2] === param3;"
    );
    je = t({ a: "b" }, "a", "b") === !0;
  } catch {
    je = !1;
  }
  return je;
}
var Yc = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`,
  $c = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vTextureCoord = aTextureCoord;
}
`,
  qc = 0,
  Cr = {},
  ze = (function () {
    function t(r, e, i) {
      i === void 0 && (i = "pixi-shader"),
        (this.id = qc++),
        (this.vertexSrc = r || t.defaultVertexSrc),
        (this.fragmentSrc = e || t.defaultFragmentSrc),
        (this.vertexSrc = this.vertexSrc.trim()),
        (this.fragmentSrc = this.fragmentSrc.trim()),
        this.vertexSrc.substring(0, 8) !== "#version" &&
          ((i = i.replace(/\s+/g, "-")),
          Cr[i] ? (Cr[i]++, (i += "-" + Cr[i])) : (Cr[i] = 1),
          (this.vertexSrc =
            "#define SHADER_NAME " +
            i +
            `
` +
            this.vertexSrc),
          (this.fragmentSrc =
            "#define SHADER_NAME " +
            i +
            `
` +
            this.fragmentSrc),
          (this.vertexSrc = ga(this.vertexSrc, S.PRECISION_VERTEX, St.HIGH)),
          (this.fragmentSrc = ga(
            this.fragmentSrc,
            S.PRECISION_FRAGMENT,
            Mc()
          ))),
        (this.glPrograms = {}),
        (this.syncUniforms = null);
    }
    return (
      Object.defineProperty(t, "defaultVertexSrc", {
        get: function () {
          return $c;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultFragmentSrc", {
        get: function () {
          return Yc;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.from = function (r, e, i) {
        var n = r + e,
          s = Rs[n];
        return s || (Rs[n] = s = new t(r, e, i)), s;
      }),
      t
    );
  })(),
  Yt = (function () {
    function t(r, e) {
      (this.uniformBindCount = 0),
        (this.program = r),
        e
          ? e instanceof oe
            ? (this.uniformGroup = e)
            : (this.uniformGroup = new oe(e))
          : (this.uniformGroup = new oe({}));
    }
    return (
      (t.prototype.checkUniformExists = function (r, e) {
        if (e.uniforms[r]) return !0;
        for (var i in e.uniforms) {
          var n = e.uniforms[i];
          if (n.group && this.checkUniformExists(r, n)) return !0;
        }
        return !1;
      }),
      (t.prototype.destroy = function () {
        this.uniformGroup = null;
      }),
      Object.defineProperty(t.prototype, "uniforms", {
        get: function () {
          return this.uniformGroup.uniforms;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.from = function (r, e, i) {
        var n = ze.from(r, e);
        return new t(n, i);
      }),
      t
    );
  })(),
  Ni = 0,
  Oi = 1,
  Si = 2,
  Ui = 3,
  Fi = 4,
  Li = 5,
  he = (function () {
    function t() {
      (this.data = 0),
        (this.blendMode = U.NORMAL),
        (this.polygonOffset = 0),
        (this.blend = !0),
        (this.depthMask = !0);
    }
    return (
      Object.defineProperty(t.prototype, "blend", {
        get: function () {
          return !!(this.data & (1 << Ni));
        },
        set: function (r) {
          !!(this.data & (1 << Ni)) !== r && (this.data ^= 1 << Ni);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "offsets", {
        get: function () {
          return !!(this.data & (1 << Oi));
        },
        set: function (r) {
          !!(this.data & (1 << Oi)) !== r && (this.data ^= 1 << Oi);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "culling", {
        get: function () {
          return !!(this.data & (1 << Si));
        },
        set: function (r) {
          !!(this.data & (1 << Si)) !== r && (this.data ^= 1 << Si);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "depthTest", {
        get: function () {
          return !!(this.data & (1 << Ui));
        },
        set: function (r) {
          !!(this.data & (1 << Ui)) !== r && (this.data ^= 1 << Ui);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "depthMask", {
        get: function () {
          return !!(this.data & (1 << Li));
        },
        set: function (r) {
          !!(this.data & (1 << Li)) !== r && (this.data ^= 1 << Li);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "clockwiseFrontFace", {
        get: function () {
          return !!(this.data & (1 << Fi));
        },
        set: function (r) {
          !!(this.data & (1 << Fi)) !== r && (this.data ^= 1 << Fi);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "blendMode", {
        get: function () {
          return this._blendMode;
        },
        set: function (r) {
          (this.blend = r !== U.NONE), (this._blendMode = r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "polygonOffset", {
        get: function () {
          return this._polygonOffset;
        },
        set: function (r) {
          (this.offsets = !!r), (this._polygonOffset = r);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.toString = function () {
        return (
          "[@pixi/core:State " +
          ("blendMode=" + this.blendMode + " ") +
          ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") +
          ("culling=" + this.culling + " ") +
          ("depthMask=" + this.depthMask + " ") +
          ("polygonOffset=" + this.polygonOffset) +
          "]"
        );
      }),
      (t.for2d = function () {
        var r = new t();
        return (r.depthTest = !1), (r.blend = !0), r;
      }),
      t
    );
  })(),
  Zc = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,
  Kc = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`,
  $t = (function (t) {
    K(r, t);
    function r(e, i, n) {
      var s = this,
        a = ze.from(e || r.defaultVertexSrc, i || r.defaultFragmentSrc);
      return (
        (s = t.call(this, a, n) || this),
        (s.padding = 0),
        (s.resolution = S.FILTER_RESOLUTION),
        (s.multisample = S.FILTER_MULTISAMPLE),
        (s.enabled = !0),
        (s.autoFit = !0),
        (s.state = new he()),
        s
      );
    }
    return (
      (r.prototype.apply = function (e, i, n, s, a) {
        e.applyFilter(this, i, n, s);
      }),
      Object.defineProperty(r.prototype, "blendMode", {
        get: function () {
          return this.state.blendMode;
        },
        set: function (e) {
          this.state.blendMode = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "resolution", {
        get: function () {
          return this._resolution;
        },
        set: function (e) {
          this._resolution = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r, "defaultVertexSrc", {
        get: function () {
          return Zc;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r, "defaultFragmentSrc", {
        get: function () {
          return Kc;
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(Yt),
  Jc = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 otherMatrix;

varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;
}
`,
  Qc = `varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mask;
uniform float alpha;
uniform float npmAlpha;
uniform vec4 maskClamp;

void main(void)
{
    float clip = step(3.5,
        step(maskClamp.x, vMaskCoord.x) +
        step(maskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, maskClamp.z) +
        step(vMaskCoord.y, maskClamp.w));

    vec4 original = texture2D(uSampler, vTextureCoord);
    vec4 masky = texture2D(mask, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    original *= (alphaMul * masky.r * alpha * clip);

    gl_FragColor = original;
}
`,
  Ea = new ut(),
  Gi = (function () {
    function t(r, e) {
      (this._texture = r),
        (this.mapCoord = new ut()),
        (this.uClampFrame = new Float32Array(4)),
        (this.uClampOffset = new Float32Array(2)),
        (this._textureID = -1),
        (this._updateID = 0),
        (this.clampOffset = 0),
        (this.clampMargin = typeof e == "undefined" ? 0.5 : e),
        (this.isSimple = !1);
    }
    return (
      Object.defineProperty(t.prototype, "texture", {
        get: function () {
          return this._texture;
        },
        set: function (r) {
          (this._texture = r), (this._textureID = -1);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.multiplyUvs = function (r, e) {
        e === void 0 && (e = r);
        for (var i = this.mapCoord, n = 0; n < r.length; n += 2) {
          var s = r[n],
            a = r[n + 1];
          (e[n] = s * i.a + a * i.c + i.tx),
            (e[n + 1] = s * i.b + a * i.d + i.ty);
        }
        return e;
      }),
      (t.prototype.update = function (r) {
        var e = this._texture;
        if (!e || !e.valid || (!r && this._textureID === e._updateID))
          return !1;
        (this._textureID = e._updateID), this._updateID++;
        var i = e._uvs;
        this.mapCoord.set(
          i.x1 - i.x0,
          i.y1 - i.y0,
          i.x3 - i.x0,
          i.y3 - i.y0,
          i.x0,
          i.y0
        );
        var n = e.orig,
          s = e.trim;
        s &&
          (Ea.set(
            n.width / s.width,
            0,
            0,
            n.height / s.height,
            -s.x / s.width,
            -s.y / s.height
          ),
          this.mapCoord.append(Ea));
        var a = e.baseTexture,
          o = this.uClampFrame,
          h = this.clampMargin / a.resolution,
          u = this.clampOffset;
        return (
          (o[0] = (e._frame.x + h + u) / a.width),
          (o[1] = (e._frame.y + h + u) / a.height),
          (o[2] = (e._frame.x + e._frame.width - h + u) / a.width),
          (o[3] = (e._frame.y + e._frame.height - h + u) / a.height),
          (this.uClampOffset[0] = u / a.realWidth),
          (this.uClampOffset[1] = u / a.realHeight),
          (this.isSimple =
            e._frame.width === a.width &&
            e._frame.height === a.height &&
            e.rotate === 0),
          !0
        );
      }),
      t
    );
  })(),
  td = (function (t) {
    K(r, t);
    function r(e, i, n) {
      var s = this,
        a = null;
      return (
        typeof e != "string" &&
          i === void 0 &&
          n === void 0 &&
          ((a = e), (e = void 0), (i = void 0), (n = void 0)),
        (s = t.call(this, e || Jc, i || Qc, n) || this),
        (s.maskSprite = a),
        (s.maskMatrix = new ut()),
        s
      );
    }
    return (
      Object.defineProperty(r.prototype, "maskSprite", {
        get: function () {
          return this._maskSprite;
        },
        set: function (e) {
          (this._maskSprite = e),
            this._maskSprite && (this._maskSprite.renderable = !1);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.apply = function (e, i, n, s) {
        var a = this._maskSprite,
          o = a._texture;
        !o.valid ||
          (o.uvMatrix || (o.uvMatrix = new Gi(o, 0)),
          o.uvMatrix.update(),
          (this.uniforms.npmAlpha = o.baseTexture.alphaMode ? 0 : 1),
          (this.uniforms.mask = o),
          (this.uniforms.otherMatrix = e
            .calculateSpriteMatrix(this.maskMatrix, a)
            .prepend(o.uvMatrix.mapCoord)),
          (this.uniforms.alpha = a.worldAlpha),
          (this.uniforms.maskClamp = o.uvMatrix.uClampFrame),
          e.applyFilter(this, i, n, s));
      }),
      r
    );
  })($t),
  Ia = (function () {
    function t(r) {
      (this.renderer = r),
        (this.enableScissor = !0),
        (this.alphaMaskPool = []),
        (this.maskDataPool = []),
        (this.maskStack = []),
        (this.alphaMaskIndex = 0);
    }
    return (
      (t.prototype.setMaskStack = function (r) {
        (this.maskStack = r),
          this.renderer.scissor.setMaskStack(r),
          this.renderer.stencil.setMaskStack(r);
      }),
      (t.prototype.push = function (r, e) {
        var i = e;
        if (!i.isMaskData) {
          var n = this.maskDataPool.pop() || new Lc();
          (n.pooled = !0), (n.maskObject = e), (i = n);
        }
        var s =
          this.maskStack.length !== 0
            ? this.maskStack[this.maskStack.length - 1]
            : null;
        if (
          (i.copyCountersOrReset(s),
          i.autoDetect && this.detect(i),
          (i._target = r),
          i.type !== xt.SPRITE && this.maskStack.push(i),
          i.enabled)
        )
          switch (i.type) {
            case xt.SCISSOR:
              this.renderer.scissor.push(i);
              break;
            case xt.STENCIL:
              this.renderer.stencil.push(i);
              break;
            case xt.SPRITE:
              i.copyCountersOrReset(null), this.pushSpriteMask(i);
              break;
          }
        i.type === xt.SPRITE && this.maskStack.push(i);
      }),
      (t.prototype.pop = function (r) {
        var e = this.maskStack.pop();
        if (!(!e || e._target !== r)) {
          if (e.enabled)
            switch (e.type) {
              case xt.SCISSOR:
                this.renderer.scissor.pop();
                break;
              case xt.STENCIL:
                this.renderer.stencil.pop(e.maskObject);
                break;
              case xt.SPRITE:
                this.popSpriteMask(e);
                break;
            }
          if (
            (e.reset(),
            e.pooled && this.maskDataPool.push(e),
            this.maskStack.length !== 0)
          ) {
            var i = this.maskStack[this.maskStack.length - 1];
            i.type === xt.SPRITE &&
              i._filters &&
              (i._filters[0].maskSprite = i.maskObject);
          }
        }
      }),
      (t.prototype.detect = function (r) {
        var e = r.maskObject;
        e.isSprite
          ? (r.type = xt.SPRITE)
          : this.enableScissor && this.renderer.scissor.testScissor(r)
          ? (r.type = xt.SCISSOR)
          : (r.type = xt.STENCIL);
      }),
      (t.prototype.pushSpriteMask = function (r) {
        var e,
          i,
          n = r.maskObject,
          s = r._target,
          a = r._filters;
        a ||
          ((a = this.alphaMaskPool[this.alphaMaskIndex]),
          a || (a = this.alphaMaskPool[this.alphaMaskIndex] = [new td()]));
        var o = this.renderer,
          h = o.renderTexture,
          u,
          f;
        if (h.current) {
          var c = h.current;
          (u = r.resolution || c.resolution),
            (f =
              (e = r.multisample) !== null && e !== void 0 ? e : c.multisample);
        } else
          (u = r.resolution || o.resolution),
            (f =
              (i = r.multisample) !== null && i !== void 0 ? i : o.multisample);
        (a[0].resolution = u), (a[0].multisample = f), (a[0].maskSprite = n);
        var l = s.filterArea;
        (s.filterArea = n.getBounds(!0)),
          o.filter.push(s, a),
          (s.filterArea = l),
          r._filters || this.alphaMaskIndex++;
      }),
      (t.prototype.popSpriteMask = function (r) {
        this.renderer.filter.pop(),
          r._filters
            ? (r._filters[0].maskSprite = null)
            : (this.alphaMaskIndex--,
              (this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null));
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  Ra = (function () {
    function t(r) {
      (this.renderer = r), (this.maskStack = []), (this.glConst = 0);
    }
    return (
      (t.prototype.getStackLength = function () {
        return this.maskStack.length;
      }),
      (t.prototype.setMaskStack = function (r) {
        var e = this.renderer.gl,
          i = this.getStackLength();
        this.maskStack = r;
        var n = this.getStackLength();
        n !== i &&
          (n === 0
            ? e.disable(this.glConst)
            : (e.enable(this.glConst), this._useCurrent()));
      }),
      (t.prototype._useCurrent = function () {}),
      (t.prototype.destroy = function () {
        (this.renderer = null), (this.maskStack = null);
      }),
      t
    );
  })(),
  wa = new ut(),
  Ca = (function (t) {
    K(r, t);
    function r(e) {
      var i = t.call(this, e) || this;
      return (i.glConst = WebGLRenderingContext.SCISSOR_TEST), i;
    }
    return (
      (r.prototype.getStackLength = function () {
        var e = this.maskStack[this.maskStack.length - 1];
        return e ? e._scissorCounter : 0;
      }),
      (r.prototype.calcScissorRect = function (e) {
        if (!e._scissorRectLocal) {
          var i = e._scissorRect,
            n = e.maskObject,
            s = this.renderer,
            a = s.renderTexture;
          n.renderable = !0;
          var o = n.getBounds();
          this.roundFrameToPixels(
            o,
            a.current ? a.current.resolution : s.resolution,
            a.sourceFrame,
            a.destinationFrame,
            s.projection.transform
          ),
            (n.renderable = !1),
            i && o.fit(i),
            (e._scissorRectLocal = o);
        }
      }),
      (r.isMatrixRotated = function (e) {
        if (!e) return !1;
        var i = e.a,
          n = e.b,
          s = e.c,
          a = e.d;
        return (
          (Math.abs(n) > 1e-4 || Math.abs(s) > 1e-4) &&
          (Math.abs(i) > 1e-4 || Math.abs(a) > 1e-4)
        );
      }),
      (r.prototype.testScissor = function (e) {
        var i = e.maskObject;
        if (
          !i.isFastRect ||
          !i.isFastRect() ||
          r.isMatrixRotated(i.worldTransform) ||
          r.isMatrixRotated(this.renderer.projection.transform)
        )
          return !1;
        this.calcScissorRect(e);
        var n = e._scissorRectLocal;
        return n.width > 0 && n.height > 0;
      }),
      (r.prototype.roundFrameToPixels = function (e, i, n, s, a) {
        r.isMatrixRotated(a) ||
          ((a = a ? wa.copyFrom(a) : wa.identity()),
          a
            .translate(-n.x, -n.y)
            .scale(s.width / n.width, s.height / n.height)
            .translate(s.x, s.y),
          this.renderer.filter.transformAABB(a, e),
          e.fit(s),
          (e.x = Math.round(e.x * i)),
          (e.y = Math.round(e.y * i)),
          (e.width = Math.round(e.width * i)),
          (e.height = Math.round(e.height * i)));
      }),
      (r.prototype.push = function (e) {
        e._scissorRectLocal || this.calcScissorRect(e);
        var i = this.renderer.gl;
        e._scissorRect || i.enable(i.SCISSOR_TEST),
          e._scissorCounter++,
          (e._scissorRect = e._scissorRectLocal),
          this._useCurrent();
      }),
      (r.prototype.pop = function () {
        var e = this.renderer.gl;
        this.getStackLength() > 0
          ? this._useCurrent()
          : e.disable(e.SCISSOR_TEST);
      }),
      (r.prototype._useCurrent = function () {
        var e = this.maskStack[this.maskStack.length - 1]._scissorRect,
          i;
        this.renderer.renderTexture.current
          ? (i = e.y)
          : (i = this.renderer.height - e.height - e.y),
          this.renderer.gl.scissor(e.x, i, e.width, e.height);
      }),
      r
    );
  })(Ra),
  Pa = (function (t) {
    K(r, t);
    function r(e) {
      var i = t.call(this, e) || this;
      return (i.glConst = WebGLRenderingContext.STENCIL_TEST), i;
    }
    return (
      (r.prototype.getStackLength = function () {
        var e = this.maskStack[this.maskStack.length - 1];
        return e ? e._stencilCounter : 0;
      }),
      (r.prototype.push = function (e) {
        var i = e.maskObject,
          n = this.renderer.gl,
          s = e._stencilCounter;
        s === 0 &&
          (this.renderer.framebuffer.forceStencil(),
          n.clearStencil(0),
          n.clear(n.STENCIL_BUFFER_BIT),
          n.enable(n.STENCIL_TEST)),
          e._stencilCounter++,
          n.colorMask(!1, !1, !1, !1),
          n.stencilFunc(n.EQUAL, s, 4294967295),
          n.stencilOp(n.KEEP, n.KEEP, n.INCR),
          (i.renderable = !0),
          i.render(this.renderer),
          this.renderer.batch.flush(),
          (i.renderable = !1),
          this._useCurrent();
      }),
      (r.prototype.pop = function (e) {
        var i = this.renderer.gl;
        this.getStackLength() === 0
          ? i.disable(i.STENCIL_TEST)
          : (i.colorMask(!1, !1, !1, !1),
            i.stencilOp(i.KEEP, i.KEEP, i.DECR),
            (e.renderable = !0),
            e.render(this.renderer),
            this.renderer.batch.flush(),
            (e.renderable = !1),
            this._useCurrent());
      }),
      (r.prototype._useCurrent = function () {
        var e = this.renderer.gl;
        e.colorMask(!0, !0, !0, !0),
          e.stencilFunc(e.EQUAL, this.getStackLength(), 4294967295),
          e.stencilOp(e.KEEP, e.KEEP, e.KEEP);
      }),
      r
    );
  })(Ra),
  Aa = (function () {
    function t(r) {
      (this.renderer = r),
        (this.destinationFrame = null),
        (this.sourceFrame = null),
        (this.defaultFrame = null),
        (this.projectionMatrix = new ut()),
        (this.transform = null);
    }
    return (
      (t.prototype.update = function (r, e, i, n) {
        (this.destinationFrame =
          r || this.destinationFrame || this.defaultFrame),
          (this.sourceFrame = e || this.sourceFrame || r),
          this.calculateProjection(
            this.destinationFrame,
            this.sourceFrame,
            i,
            n
          ),
          this.transform && this.projectionMatrix.append(this.transform);
        var s = this.renderer;
        (s.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix),
          s.globalUniforms.update(),
          s.shader.shader &&
            s.shader.syncUniformGroup(s.shader.shader.uniforms.globals);
      }),
      (t.prototype.calculateProjection = function (r, e, i, n) {
        var s = this.projectionMatrix,
          a = n ? -1 : 1;
        s.identity(),
          (s.a = (1 / e.width) * 2),
          (s.d = a * ((1 / e.height) * 2)),
          (s.tx = -1 - e.x * s.a),
          (s.ty = -a - e.y * s.d);
      }),
      (t.prototype.setTransform = function (r) {}),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  ue = new z(),
  We = new z(),
  Na = (function () {
    function t(r) {
      (this.renderer = r),
        (this.clearColor = r._backgroundColorRgba),
        (this.defaultMaskStack = []),
        (this.current = null),
        (this.sourceFrame = new z()),
        (this.destinationFrame = new z()),
        (this.viewportFrame = new z());
    }
    return (
      (t.prototype.bind = function (r, e, i) {
        r === void 0 && (r = null);
        var n = this.renderer;
        this.current = r;
        var s, a, o;
        r
          ? ((s = r.baseTexture),
            (o = s.resolution),
            e ||
              ((ue.width = r.frame.width),
              (ue.height = r.frame.height),
              (e = ue)),
            i ||
              ((We.x = r.frame.x),
              (We.y = r.frame.y),
              (We.width = e.width),
              (We.height = e.height),
              (i = We)),
            (a = s.framebuffer))
          : ((o = n.resolution),
            e ||
              ((ue.width = n.screen.width),
              (ue.height = n.screen.height),
              (e = ue)),
            i || ((i = ue), (i.width = e.width), (i.height = e.height)));
        var h = this.viewportFrame;
        (h.x = i.x * o),
          (h.y = i.y * o),
          (h.width = i.width * o),
          (h.height = i.height * o),
          r || (h.y = n.view.height - (h.y + h.height)),
          h.ceil(),
          this.renderer.framebuffer.bind(a, h),
          this.renderer.projection.update(i, e, o, !a),
          r
            ? this.renderer.mask.setMaskStack(s.maskStack)
            : this.renderer.mask.setMaskStack(this.defaultMaskStack),
          this.sourceFrame.copyFrom(e),
          this.destinationFrame.copyFrom(i);
      }),
      (t.prototype.clear = function (r, e) {
        this.current
          ? (r = r || this.current.baseTexture.clearColor)
          : (r = r || this.clearColor);
        var i = this.destinationFrame,
          n = this.current ? this.current.baseTexture : this.renderer.screen,
          s = i.width !== n.width || i.height !== n.height;
        if (s) {
          var a = this.viewportFrame,
            o = a.x,
            h = a.y,
            u = a.width,
            f = a.height;
          (o = Math.round(o)),
            (h = Math.round(h)),
            (u = Math.round(u)),
            (f = Math.round(f)),
            this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST),
            this.renderer.gl.scissor(o, h, u, f);
        }
        this.renderer.framebuffer.clear(r[0], r[1], r[2], r[3], e),
          s && this.renderer.scissor.pop();
      }),
      (t.prototype.resize = function () {
        this.bind(null);
      }),
      (t.prototype.reset = function () {
        this.bind(null);
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })();
function ed(t, r, e, i, n) {
  e.buffer.update(n);
}
var rd = {
    float: `
        data[offset] = v;
    `,
    vec2: `
        data[offset] = v[0];
        data[offset+1] = v[1];
    `,
    vec3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

    `,
    vec4: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];
        data[offset+3] = v[3];
    `,
    mat2: `
        data[offset] = v[0];
        data[offset+1] = v[1];

        data[offset+4] = v[2];
        data[offset+5] = v[3];
    `,
    mat3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];

        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `,
    mat4: `
        for(var i = 0; i < 16; i++)
        {
            data[offset + i] = v[i];
        }
    `,
  },
  Oa = {
    float: 4,
    vec2: 8,
    vec3: 12,
    vec4: 16,
    int: 4,
    ivec2: 8,
    ivec3: 12,
    ivec4: 16,
    uint: 4,
    uvec2: 8,
    uvec3: 12,
    uvec4: 16,
    bool: 4,
    bvec2: 8,
    bvec3: 12,
    bvec4: 16,
    mat2: 16 * 2,
    mat3: 16 * 3,
    mat4: 16 * 4,
  };
function id(t) {
  for (
    var r = t.map(function (h) {
        return { data: h, offset: 0, dataLen: 0, dirty: 0 };
      }),
      e = 0,
      i = 0,
      n = 0,
      s = 0;
    s < r.length;
    s++
  ) {
    var a = r[s];
    if (
      ((e = Oa[a.data.type]),
      a.data.size > 1 && (e = Math.max(e, 16) * a.data.size),
      (a.dataLen = e),
      i % e != 0 && i < 16)
    ) {
      var o = (i % e) % 16;
      (i += o), (n += o);
    }
    i + e > 16
      ? ((n = Math.ceil(n / 16) * 16), (a.offset = n), (n += e), (i = e))
      : ((a.offset = n), (i += e), (n += e));
  }
  return (n = Math.ceil(n / 16) * 16), { uboElements: r, size: n };
}
function nd(t, r) {
  var e = [];
  for (var i in t) r[i] && e.push(r[i]);
  return (
    e.sort(function (n, s) {
      return n.index - s.index;
    }),
    e
  );
}
function sd(t, r) {
  if (!t.autoManage) return { size: 0, syncFunc: ed };
  for (
    var e = nd(t.uniforms, r),
      i = id(e),
      n = i.uboElements,
      s = i.size,
      a = [
        `
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `,
      ],
      o = 0;
    o < n.length;
    o++
  ) {
    for (
      var h = n[o], u = t.uniforms[h.data.name], f = h.data.name, c = !1, l = 0;
      l < Ee.length;
      l++
    ) {
      var d = Ee[l];
      if (d.codeUbo && d.test(h.data, u)) {
        a.push("offset = " + h.offset / 4 + ";", Ee[l].codeUbo(h.data.name, u)),
          (c = !0);
        break;
      }
    }
    if (!c)
      if (h.data.size > 1) {
        var p = xa(h.data.type),
          _ = Math.max(Oa[h.data.type] / 16, 1),
          v = p / _,
          m = (4 - (v % 4)) % 4;
        a.push(
          `
                cv = ud.` +
            f +
            `.value;
                v = uv.` +
            f +
            `;
                offset = ` +
            h.offset / 4 +
            `;

                t = 0;

                for(var i=0; i < ` +
            h.data.size * _ +
            `; i++)
                {
                    for(var j = 0; j < ` +
            v +
            `; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ` +
            m +
            `;
                }

                `
        );
      } else {
        var g = rd[h.data.type];
        a.push(
          `
                cv = ud.` +
            f +
            `.value;
                v = uv.` +
            f +
            `;
                offset = ` +
            h.offset / 4 +
            `;
                ` +
            g +
            `;
                `
        );
      }
  }
  return (
    a.push(`
       renderer.buffer.update(buffer);
    `),
    {
      size: s,
      syncFunc: new Function(
        "ud",
        "uv",
        "renderer",
        "syncData",
        "buffer",
        a.join(`
`)
      ),
    }
  );
}
var ad = (function () {
  function t(r, e) {
    (this.program = r),
      (this.uniformData = e),
      (this.uniformGroups = {}),
      (this.uniformDirtyGroups = {}),
      (this.uniformBufferBindings = {});
  }
  return (
    (t.prototype.destroy = function () {
      (this.uniformData = null),
        (this.uniformGroups = null),
        (this.uniformDirtyGroups = null),
        (this.uniformBufferBindings = null),
        (this.program = null);
    }),
    t
  );
})();
function od(t, r) {
  for (
    var e = {}, i = r.getProgramParameter(t, r.ACTIVE_ATTRIBUTES), n = 0;
    n < i;
    n++
  ) {
    var s = r.getActiveAttrib(t, n);
    if (s.name.indexOf("gl_") !== 0) {
      var a = ba(r, s.type),
        o = {
          type: a,
          name: s.name,
          size: xa(a),
          location: r.getAttribLocation(t, s.name),
        };
      e[s.name] = o;
    }
  }
  return e;
}
function hd(t, r) {
  for (
    var e = {}, i = r.getProgramParameter(t, r.ACTIVE_UNIFORMS), n = 0;
    n < i;
    n++
  ) {
    var s = r.getActiveUniform(t, n),
      a = s.name.replace(/\[.*?\]$/, ""),
      o = !!s.name.match(/\[.*?\]$/),
      h = ba(r, s.type);
    e[a] = {
      name: a,
      index: n,
      type: h,
      size: s.size,
      isArray: o,
      value: ma(h, s.size),
    };
  }
  return e;
}
function ud(t, r) {
  var e = va(t, t.VERTEX_SHADER, r.vertexSrc),
    i = va(t, t.FRAGMENT_SHADER, r.fragmentSrc),
    n = t.createProgram();
  if (
    (t.attachShader(n, e),
    t.attachShader(n, i),
    t.linkProgram(n),
    t.getProgramParameter(n, t.LINK_STATUS) || Gc(t, n, e, i),
    (r.attributeData = od(n, t)),
    (r.uniformData = hd(n, t)),
    !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(r.vertexSrc))
  ) {
    var s = Object.keys(r.attributeData);
    s.sort(function (f, c) {
      return f > c ? 1 : -1;
    });
    for (var a = 0; a < s.length; a++)
      (r.attributeData[s[a]].location = a), t.bindAttribLocation(n, a, s[a]);
    t.linkProgram(n);
  }
  t.deleteShader(e), t.deleteShader(i);
  var o = {};
  for (var a in r.uniformData) {
    var h = r.uniformData[a];
    o[a] = { location: t.getUniformLocation(n, a), value: ma(h.type, h.size) };
  }
  var u = new ad(n, o);
  return u;
}
var fd = 0,
  Pr = { textureCount: 0, uboCount: 0 },
  Sa = (function () {
    function t(r) {
      (this.destroyed = !1),
        (this.renderer = r),
        this.systemCheck(),
        (this.gl = null),
        (this.shader = null),
        (this.program = null),
        (this.cache = {}),
        (this._uboCache = {}),
        (this.id = fd++);
    }
    return (
      (t.prototype.systemCheck = function () {
        if (!Wc())
          throw new Error(
            "Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support."
          );
      }),
      (t.prototype.contextChange = function (r) {
        (this.gl = r), this.reset();
      }),
      (t.prototype.bind = function (r, e) {
        r.uniforms.globals = this.renderer.globalUniforms;
        var i = r.program,
          n =
            i.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(r);
        return (
          (this.shader = r),
          this.program !== i &&
            ((this.program = i), this.gl.useProgram(n.program)),
          e ||
            ((Pr.textureCount = 0),
            (Pr.uboCount = 0),
            this.syncUniformGroup(r.uniformGroup, Pr)),
          n
        );
      }),
      (t.prototype.setUniforms = function (r) {
        var e = this.shader.program,
          i = e.glPrograms[this.renderer.CONTEXT_UID];
        e.syncUniforms(i.uniformData, r, this.renderer);
      }),
      (t.prototype.syncUniformGroup = function (r, e) {
        var i = this.getGlProgram();
        (!r.static || r.dirtyId !== i.uniformDirtyGroups[r.id]) &&
          ((i.uniformDirtyGroups[r.id] = r.dirtyId),
          this.syncUniforms(r, i, e));
      }),
      (t.prototype.syncUniforms = function (r, e, i) {
        var n =
          r.syncUniforms[this.shader.program.id] || this.createSyncGroups(r);
        n(e.uniformData, r.uniforms, this.renderer, i);
      }),
      (t.prototype.createSyncGroups = function (r) {
        var e = this.getSignature(r, this.shader.program.uniformData, "u");
        return (
          this.cache[e] ||
            (this.cache[e] = Hc(r, this.shader.program.uniformData)),
          (r.syncUniforms[this.shader.program.id] = this.cache[e]),
          r.syncUniforms[this.shader.program.id]
        );
      }),
      (t.prototype.syncUniformBufferGroup = function (r, e) {
        var i = this.getGlProgram();
        if (!r.static || r.dirtyId !== 0 || !i.uniformGroups[r.id]) {
          r.dirtyId = 0;
          var n = i.uniformGroups[r.id] || this.createSyncBufferGroup(r, i, e);
          r.buffer.update(),
            n(i.uniformData, r.uniforms, this.renderer, Pr, r.buffer);
        }
        this.renderer.buffer.bindBufferBase(
          r.buffer,
          i.uniformBufferBindings[e]
        );
      }),
      (t.prototype.createSyncBufferGroup = function (r, e, i) {
        var n = this.renderer.gl;
        this.renderer.buffer.bind(r.buffer);
        var s = this.gl.getUniformBlockIndex(e.program, i);
        (e.uniformBufferBindings[i] = this.shader.uniformBindCount),
          n.uniformBlockBinding(e.program, s, this.shader.uniformBindCount),
          this.shader.uniformBindCount++;
        var a = this.getSignature(r, this.shader.program.uniformData, "ubo"),
          o = this._uboCache[a];
        if (
          (o ||
            (o = this._uboCache[a] = sd(r, this.shader.program.uniformData)),
          r.autoManage)
        ) {
          var h = new Float32Array(o.size / 4);
          r.buffer.update(h);
        }
        return (e.uniformGroups[r.id] = o.syncFunc), e.uniformGroups[r.id];
      }),
      (t.prototype.getSignature = function (r, e, i) {
        var n = r.uniforms,
          s = [i + "-"];
        for (var a in n) s.push(a), e[a] && s.push(e[a].type);
        return s.join("-");
      }),
      (t.prototype.getGlProgram = function () {
        return this.shader
          ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID]
          : null;
      }),
      (t.prototype.generateProgram = function (r) {
        var e = this.gl,
          i = r.program,
          n = ud(e, i);
        return (i.glPrograms[this.renderer.CONTEXT_UID] = n), n;
      }),
      (t.prototype.reset = function () {
        (this.program = null), (this.shader = null);
      }),
      (t.prototype.destroy = function () {
        (this.renderer = null), (this.destroyed = !0);
      }),
      t
    );
  })();
function ld(t, r) {
  return (
    r === void 0 && (r = []),
    (r[U.NORMAL] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.ADD] = [t.ONE, t.ONE]),
    (r[U.MULTIPLY] = [
      t.DST_COLOR,
      t.ONE_MINUS_SRC_ALPHA,
      t.ONE,
      t.ONE_MINUS_SRC_ALPHA,
    ]),
    (r[U.SCREEN] = [
      t.ONE,
      t.ONE_MINUS_SRC_COLOR,
      t.ONE,
      t.ONE_MINUS_SRC_ALPHA,
    ]),
    (r[U.OVERLAY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.DARKEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.LIGHTEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.COLOR_DODGE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.COLOR_BURN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.HARD_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.SOFT_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.DIFFERENCE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.EXCLUSION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.HUE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.SATURATION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.COLOR] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.LUMINOSITY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.NONE] = [0, 0]),
    (r[U.NORMAL_NPM] = [
      t.SRC_ALPHA,
      t.ONE_MINUS_SRC_ALPHA,
      t.ONE,
      t.ONE_MINUS_SRC_ALPHA,
    ]),
    (r[U.ADD_NPM] = [t.SRC_ALPHA, t.ONE, t.ONE, t.ONE]),
    (r[U.SCREEN_NPM] = [
      t.SRC_ALPHA,
      t.ONE_MINUS_SRC_COLOR,
      t.ONE,
      t.ONE_MINUS_SRC_ALPHA,
    ]),
    (r[U.SRC_IN] = [t.DST_ALPHA, t.ZERO]),
    (r[U.SRC_OUT] = [t.ONE_MINUS_DST_ALPHA, t.ZERO]),
    (r[U.SRC_ATOP] = [t.DST_ALPHA, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.DST_OVER] = [t.ONE_MINUS_DST_ALPHA, t.ONE]),
    (r[U.DST_IN] = [t.ZERO, t.SRC_ALPHA]),
    (r[U.DST_OUT] = [t.ZERO, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.DST_ATOP] = [t.ONE_MINUS_DST_ALPHA, t.SRC_ALPHA]),
    (r[U.XOR] = [t.ONE_MINUS_DST_ALPHA, t.ONE_MINUS_SRC_ALPHA]),
    (r[U.SUBTRACT] = [
      t.ONE,
      t.ONE,
      t.ONE,
      t.ONE,
      t.FUNC_REVERSE_SUBTRACT,
      t.FUNC_ADD,
    ]),
    r
  );
}
var cd = 0,
  dd = 1,
  pd = 2,
  vd = 3,
  _d = 4,
  md = 5,
  Ua = (function () {
    function t() {
      (this.gl = null),
        (this.stateId = 0),
        (this.polygonOffset = 0),
        (this.blendMode = U.NONE),
        (this._blendEq = !1),
        (this.map = []),
        (this.map[cd] = this.setBlend),
        (this.map[dd] = this.setOffset),
        (this.map[pd] = this.setCullFace),
        (this.map[vd] = this.setDepthTest),
        (this.map[_d] = this.setFrontFace),
        (this.map[md] = this.setDepthMask),
        (this.checks = []),
        (this.defaultState = new he()),
        (this.defaultState.blend = !0);
    }
    return (
      (t.prototype.contextChange = function (r) {
        (this.gl = r),
          (this.blendModes = ld(r)),
          this.set(this.defaultState),
          this.reset();
      }),
      (t.prototype.set = function (r) {
        if (((r = r || this.defaultState), this.stateId !== r.data)) {
          for (var e = this.stateId ^ r.data, i = 0; e; )
            e & 1 && this.map[i].call(this, !!(r.data & (1 << i))),
              (e = e >> 1),
              i++;
          this.stateId = r.data;
        }
        for (var i = 0; i < this.checks.length; i++) this.checks[i](this, r);
      }),
      (t.prototype.forceState = function (r) {
        r = r || this.defaultState;
        for (var e = 0; e < this.map.length; e++)
          this.map[e].call(this, !!(r.data & (1 << e)));
        for (var e = 0; e < this.checks.length; e++) this.checks[e](this, r);
        this.stateId = r.data;
      }),
      (t.prototype.setBlend = function (r) {
        this.updateCheck(t.checkBlendMode, r),
          this.gl[r ? "enable" : "disable"](this.gl.BLEND);
      }),
      (t.prototype.setOffset = function (r) {
        this.updateCheck(t.checkPolygonOffset, r),
          this.gl[r ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
      }),
      (t.prototype.setDepthTest = function (r) {
        this.gl[r ? "enable" : "disable"](this.gl.DEPTH_TEST);
      }),
      (t.prototype.setDepthMask = function (r) {
        this.gl.depthMask(r);
      }),
      (t.prototype.setCullFace = function (r) {
        this.gl[r ? "enable" : "disable"](this.gl.CULL_FACE);
      }),
      (t.prototype.setFrontFace = function (r) {
        this.gl.frontFace(this.gl[r ? "CW" : "CCW"]);
      }),
      (t.prototype.setBlendMode = function (r) {
        if (r !== this.blendMode) {
          this.blendMode = r;
          var e = this.blendModes[r],
            i = this.gl;
          e.length === 2
            ? i.blendFunc(e[0], e[1])
            : i.blendFuncSeparate(e[0], e[1], e[2], e[3]),
            e.length === 6
              ? ((this._blendEq = !0), i.blendEquationSeparate(e[4], e[5]))
              : this._blendEq &&
                ((this._blendEq = !1),
                i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD));
        }
      }),
      (t.prototype.setPolygonOffset = function (r, e) {
        this.gl.polygonOffset(r, e);
      }),
      (t.prototype.reset = function () {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1),
          this.forceState(this.defaultState),
          (this._blendEq = !0),
          (this.blendMode = -1),
          this.setBlendMode(0);
      }),
      (t.prototype.updateCheck = function (r, e) {
        var i = this.checks.indexOf(r);
        e && i === -1
          ? this.checks.push(r)
          : !e && i !== -1 && this.checks.splice(i, 1);
      }),
      (t.checkBlendMode = function (r, e) {
        r.setBlendMode(e.blendMode);
      }),
      (t.checkPolygonOffset = function (r, e) {
        r.setPolygonOffset(1, e.polygonOffset);
      }),
      (t.prototype.destroy = function () {
        this.gl = null;
      }),
      t
    );
  })(),
  Fa = (function () {
    function t(r) {
      (this.renderer = r),
        (this.count = 0),
        (this.checkCount = 0),
        (this.maxIdle = S.GC_MAX_IDLE),
        (this.checkCountMax = S.GC_MAX_CHECK_COUNT),
        (this.mode = S.GC_MODE);
    }
    return (
      (t.prototype.postrender = function () {
        !this.renderer.renderingToScreen ||
          (this.count++,
          this.mode !== fi.MANUAL &&
            (this.checkCount++,
            this.checkCount > this.checkCountMax &&
              ((this.checkCount = 0), this.run())));
      }),
      (t.prototype.run = function () {
        for (
          var r = this.renderer.texture, e = r.managedTextures, i = !1, n = 0;
          n < e.length;
          n++
        ) {
          var s = e[n];
          !s.framebuffer &&
            this.count - s.touched > this.maxIdle &&
            (r.destroyTexture(s, !0), (e[n] = null), (i = !0));
        }
        if (i) {
          for (var a = 0, n = 0; n < e.length; n++)
            e[n] !== null && (e[a++] = e[n]);
          e.length = a;
        }
      }),
      (t.prototype.unload = function (r) {
        var e = this.renderer.texture,
          i = r._texture;
        i && !i.framebuffer && e.destroyTexture(i);
        for (var n = r.children.length - 1; n >= 0; n--)
          this.unload(r.children[n]);
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })();
function yd(t) {
  var r, e, i, n, s, a, o, h, u, f, c, l, d, p, _, v, m, g, T, I, x, y, C;
  return (
    "WebGL2RenderingContext" in self && t instanceof self.WebGL2RenderingContext
      ? (C =
          ((r = {}),
          (r[G.UNSIGNED_BYTE] =
            ((e = {}),
            (e[w.RGBA] = t.RGBA8),
            (e[w.RGB] = t.RGB8),
            (e[w.RG] = t.RG8),
            (e[w.RED] = t.R8),
            (e[w.RGBA_INTEGER] = t.RGBA8UI),
            (e[w.RGB_INTEGER] = t.RGB8UI),
            (e[w.RG_INTEGER] = t.RG8UI),
            (e[w.RED_INTEGER] = t.R8UI),
            (e[w.ALPHA] = t.ALPHA),
            (e[w.LUMINANCE] = t.LUMINANCE),
            (e[w.LUMINANCE_ALPHA] = t.LUMINANCE_ALPHA),
            e)),
          (r[G.BYTE] =
            ((i = {}),
            (i[w.RGBA] = t.RGBA8_SNORM),
            (i[w.RGB] = t.RGB8_SNORM),
            (i[w.RG] = t.RG8_SNORM),
            (i[w.RED] = t.R8_SNORM),
            (i[w.RGBA_INTEGER] = t.RGBA8I),
            (i[w.RGB_INTEGER] = t.RGB8I),
            (i[w.RG_INTEGER] = t.RG8I),
            (i[w.RED_INTEGER] = t.R8I),
            i)),
          (r[G.UNSIGNED_SHORT] =
            ((n = {}),
            (n[w.RGBA_INTEGER] = t.RGBA16UI),
            (n[w.RGB_INTEGER] = t.RGB16UI),
            (n[w.RG_INTEGER] = t.RG16UI),
            (n[w.RED_INTEGER] = t.R16UI),
            (n[w.DEPTH_COMPONENT] = t.DEPTH_COMPONENT16),
            n)),
          (r[G.SHORT] =
            ((s = {}),
            (s[w.RGBA_INTEGER] = t.RGBA16I),
            (s[w.RGB_INTEGER] = t.RGB16I),
            (s[w.RG_INTEGER] = t.RG16I),
            (s[w.RED_INTEGER] = t.R16I),
            s)),
          (r[G.UNSIGNED_INT] =
            ((a = {}),
            (a[w.RGBA_INTEGER] = t.RGBA32UI),
            (a[w.RGB_INTEGER] = t.RGB32UI),
            (a[w.RG_INTEGER] = t.RG32UI),
            (a[w.RED_INTEGER] = t.R32UI),
            (a[w.DEPTH_COMPONENT] = t.DEPTH_COMPONENT24),
            a)),
          (r[G.INT] =
            ((o = {}),
            (o[w.RGBA_INTEGER] = t.RGBA32I),
            (o[w.RGB_INTEGER] = t.RGB32I),
            (o[w.RG_INTEGER] = t.RG32I),
            (o[w.RED_INTEGER] = t.R32I),
            o)),
          (r[G.FLOAT] =
            ((h = {}),
            (h[w.RGBA] = t.RGBA32F),
            (h[w.RGB] = t.RGB32F),
            (h[w.RG] = t.RG32F),
            (h[w.RED] = t.R32F),
            (h[w.DEPTH_COMPONENT] = t.DEPTH_COMPONENT32F),
            h)),
          (r[G.HALF_FLOAT] =
            ((u = {}),
            (u[w.RGBA] = t.RGBA16F),
            (u[w.RGB] = t.RGB16F),
            (u[w.RG] = t.RG16F),
            (u[w.RED] = t.R16F),
            u)),
          (r[G.UNSIGNED_SHORT_5_6_5] = ((f = {}), (f[w.RGB] = t.RGB565), f)),
          (r[G.UNSIGNED_SHORT_4_4_4_4] = ((c = {}), (c[w.RGBA] = t.RGBA4), c)),
          (r[G.UNSIGNED_SHORT_5_5_5_1] =
            ((l = {}), (l[w.RGBA] = t.RGB5_A1), l)),
          (r[G.UNSIGNED_INT_2_10_10_10_REV] =
            ((d = {}),
            (d[w.RGBA] = t.RGB10_A2),
            (d[w.RGBA_INTEGER] = t.RGB10_A2UI),
            d)),
          (r[G.UNSIGNED_INT_10F_11F_11F_REV] =
            ((p = {}), (p[w.RGB] = t.R11F_G11F_B10F), p)),
          (r[G.UNSIGNED_INT_5_9_9_9_REV] =
            ((_ = {}), (_[w.RGB] = t.RGB9_E5), _)),
          (r[G.UNSIGNED_INT_24_8] =
            ((v = {}), (v[w.DEPTH_STENCIL] = t.DEPTH24_STENCIL8), v)),
          (r[G.FLOAT_32_UNSIGNED_INT_24_8_REV] =
            ((m = {}), (m[w.DEPTH_STENCIL] = t.DEPTH32F_STENCIL8), m)),
          r))
      : (C =
          ((g = {}),
          (g[G.UNSIGNED_BYTE] =
            ((T = {}),
            (T[w.RGBA] = t.RGBA),
            (T[w.RGB] = t.RGB),
            (T[w.ALPHA] = t.ALPHA),
            (T[w.LUMINANCE] = t.LUMINANCE),
            (T[w.LUMINANCE_ALPHA] = t.LUMINANCE_ALPHA),
            T)),
          (g[G.UNSIGNED_SHORT_5_6_5] = ((I = {}), (I[w.RGB] = t.RGB), I)),
          (g[G.UNSIGNED_SHORT_4_4_4_4] = ((x = {}), (x[w.RGBA] = t.RGBA), x)),
          (g[G.UNSIGNED_SHORT_5_5_5_1] = ((y = {}), (y[w.RGBA] = t.RGBA), y)),
          g)),
    C
  );
}
var Bi = (function () {
    function t(r) {
      (this.texture = r),
        (this.width = -1),
        (this.height = -1),
        (this.dirtyId = -1),
        (this.dirtyStyleId = -1),
        (this.mipmap = !1),
        (this.wrapMode = 33071),
        (this.type = G.UNSIGNED_BYTE),
        (this.internalFormat = w.RGBA),
        (this.samplerType = 0);
    }
    return t;
  })(),
  La = (function () {
    function t(r) {
      (this.renderer = r),
        (this.boundTextures = []),
        (this.currentLocation = -1),
        (this.managedTextures = []),
        (this._unknownBoundTextures = !1),
        (this.unknownTexture = new W()),
        (this.hasIntegerTextures = !1);
    }
    return (
      (t.prototype.contextChange = function () {
        var r = (this.gl = this.renderer.gl);
        (this.CONTEXT_UID = this.renderer.CONTEXT_UID),
          (this.webGLVersion = this.renderer.context.webGLVersion),
          (this.internalFormats = yd(r));
        var e = r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS);
        this.boundTextures.length = e;
        for (var i = 0; i < e; i++) this.boundTextures[i] = null;
        this.emptyTextures = {};
        var n = new Bi(r.createTexture());
        r.bindTexture(r.TEXTURE_2D, n.texture),
          r.texImage2D(
            r.TEXTURE_2D,
            0,
            r.RGBA,
            1,
            1,
            0,
            r.RGBA,
            r.UNSIGNED_BYTE,
            new Uint8Array(4)
          ),
          (this.emptyTextures[r.TEXTURE_2D] = n),
          (this.emptyTextures[r.TEXTURE_CUBE_MAP] = new Bi(r.createTexture())),
          r.bindTexture(
            r.TEXTURE_CUBE_MAP,
            this.emptyTextures[r.TEXTURE_CUBE_MAP].texture
          );
        for (var i = 0; i < 6; i++)
          r.texImage2D(
            r.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0,
            r.RGBA,
            1,
            1,
            0,
            r.RGBA,
            r.UNSIGNED_BYTE,
            null
          );
        r.texParameteri(r.TEXTURE_CUBE_MAP, r.TEXTURE_MAG_FILTER, r.LINEAR),
          r.texParameteri(r.TEXTURE_CUBE_MAP, r.TEXTURE_MIN_FILTER, r.LINEAR);
        for (var i = 0; i < this.boundTextures.length; i++) this.bind(null, i);
      }),
      (t.prototype.bind = function (r, e) {
        e === void 0 && (e = 0);
        var i = this.gl;
        if (
          ((r = r == null ? void 0 : r.castToBaseTexture()),
          r && r.valid && !r.parentTextureArray)
        ) {
          r.touched = this.renderer.textureGC.count;
          var n = r._glTextures[this.CONTEXT_UID] || this.initTexture(r);
          this.boundTextures[e] !== r &&
            (this.currentLocation !== e &&
              ((this.currentLocation = e), i.activeTexture(i.TEXTURE0 + e)),
            i.bindTexture(r.target, n.texture)),
            n.dirtyId !== r.dirtyId &&
              (this.currentLocation !== e &&
                ((this.currentLocation = e), i.activeTexture(i.TEXTURE0 + e)),
              this.updateTexture(r)),
            (this.boundTextures[e] = r);
        } else
          this.currentLocation !== e &&
            ((this.currentLocation = e), i.activeTexture(i.TEXTURE0 + e)),
            i.bindTexture(
              i.TEXTURE_2D,
              this.emptyTextures[i.TEXTURE_2D].texture
            ),
            (this.boundTextures[e] = null);
      }),
      (t.prototype.reset = function () {
        (this._unknownBoundTextures = !0),
          (this.hasIntegerTextures = !1),
          (this.currentLocation = -1);
        for (var r = 0; r < this.boundTextures.length; r++)
          this.boundTextures[r] = this.unknownTexture;
      }),
      (t.prototype.unbind = function (r) {
        var e = this,
          i = e.gl,
          n = e.boundTextures;
        if (this._unknownBoundTextures) {
          this._unknownBoundTextures = !1;
          for (var s = 0; s < n.length; s++)
            n[s] === this.unknownTexture && this.bind(null, s);
        }
        for (var s = 0; s < n.length; s++)
          n[s] === r &&
            (this.currentLocation !== s &&
              (i.activeTexture(i.TEXTURE0 + s), (this.currentLocation = s)),
            i.bindTexture(r.target, this.emptyTextures[r.target].texture),
            (n[s] = null));
      }),
      (t.prototype.ensureSamplerType = function (r) {
        var e = this,
          i = e.boundTextures,
          n = e.hasIntegerTextures,
          s = e.CONTEXT_UID;
        if (!!n)
          for (var a = r - 1; a >= 0; --a) {
            var o = i[a];
            if (o) {
              var h = o._glTextures[s];
              h.samplerType !== lr.FLOAT && this.renderer.texture.unbind(o);
            }
          }
      }),
      (t.prototype.initTexture = function (r) {
        var e = new Bi(this.gl.createTexture());
        return (
          (e.dirtyId = -1),
          (r._glTextures[this.CONTEXT_UID] = e),
          this.managedTextures.push(r),
          r.on("dispose", this.destroyTexture, this),
          e
        );
      }),
      (t.prototype.initTextureType = function (r, e) {
        var i, n;
        (e.internalFormat =
          (n =
            (i = this.internalFormats[r.type]) === null || i === void 0
              ? void 0
              : i[r.format]) !== null && n !== void 0
            ? n
            : r.format),
          this.webGLVersion === 2 && r.type === G.HALF_FLOAT
            ? (e.type = this.gl.HALF_FLOAT)
            : (e.type = r.type);
      }),
      (t.prototype.updateTexture = function (r) {
        var e = r._glTextures[this.CONTEXT_UID];
        if (!!e) {
          var i = this.renderer;
          if (
            (this.initTextureType(r, e),
            r.resource && r.resource.upload(i, r, e))
          )
            e.samplerType !== lr.FLOAT && (this.hasIntegerTextures = !0);
          else {
            var n = r.realWidth,
              s = r.realHeight,
              a = i.gl;
            (e.width !== n || e.height !== s || e.dirtyId < 0) &&
              ((e.width = n),
              (e.height = s),
              a.texImage2D(
                r.target,
                0,
                e.internalFormat,
                n,
                s,
                0,
                r.format,
                e.type,
                null
              ));
          }
          r.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(r),
            (e.dirtyId = r.dirtyId);
        }
      }),
      (t.prototype.destroyTexture = function (r, e) {
        var i = this.gl;
        if (
          ((r = r.castToBaseTexture()),
          r._glTextures[this.CONTEXT_UID] &&
            (this.unbind(r),
            i.deleteTexture(r._glTextures[this.CONTEXT_UID].texture),
            r.off("dispose", this.destroyTexture, this),
            delete r._glTextures[this.CONTEXT_UID],
            !e))
        ) {
          var n = this.managedTextures.indexOf(r);
          n !== -1 && ge(this.managedTextures, n, 1);
        }
      }),
      (t.prototype.updateTextureStyle = function (r) {
        var e = r._glTextures[this.CONTEXT_UID];
        !e ||
          ((r.mipmap === zt.POW2 || this.webGLVersion !== 2) && !r.isPowerOfTwo
            ? (e.mipmap = !1)
            : (e.mipmap = r.mipmap >= 1),
          this.webGLVersion !== 2 && !r.isPowerOfTwo
            ? (e.wrapMode = Dt.CLAMP)
            : (e.wrapMode = r.wrapMode),
          (r.resource && r.resource.style(this.renderer, r, e)) ||
            this.setStyle(r, e),
          (e.dirtyStyleId = r.dirtyStyleId));
      }),
      (t.prototype.setStyle = function (r, e) {
        var i = this.gl;
        if (
          (e.mipmap && r.mipmap !== zt.ON_MANUAL && i.generateMipmap(r.target),
          i.texParameteri(r.target, i.TEXTURE_WRAP_S, e.wrapMode),
          i.texParameteri(r.target, i.TEXTURE_WRAP_T, e.wrapMode),
          e.mipmap)
        ) {
          i.texParameteri(
            r.target,
            i.TEXTURE_MIN_FILTER,
            r.scaleMode === Mt.LINEAR
              ? i.LINEAR_MIPMAP_LINEAR
              : i.NEAREST_MIPMAP_NEAREST
          );
          var n = this.renderer.context.extensions.anisotropicFiltering;
          if (n && r.anisotropicLevel > 0 && r.scaleMode === Mt.LINEAR) {
            var s = Math.min(
              r.anisotropicLevel,
              i.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
            );
            i.texParameterf(r.target, n.TEXTURE_MAX_ANISOTROPY_EXT, s);
          }
        } else
          i.texParameteri(
            r.target,
            i.TEXTURE_MIN_FILTER,
            r.scaleMode === Mt.LINEAR ? i.LINEAR : i.NEAREST
          );
        i.texParameteri(
          r.target,
          i.TEXTURE_MAG_FILTER,
          r.scaleMode === Mt.LINEAR ? i.LINEAR : i.NEAREST
        );
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      t
    );
  })(),
  Ga = {
    __proto__: null,
    FilterSystem: ua,
    BatchSystem: fa,
    ContextSystem: ca,
    FramebufferSystem: da,
    GeometrySystem: pa,
    MaskSystem: Ia,
    ScissorSystem: Ca,
    StencilSystem: Pa,
    ProjectionSystem: Aa,
    RenderTextureSystem: Na,
    ShaderSystem: Sa,
    StateSystem: Ua,
    TextureGCSystem: Fa,
    TextureSystem: La,
  },
  Mi = new ut(),
  gd = (function (t) {
    K(r, t);
    function r(e, i) {
      e === void 0 && (e = De.UNKNOWN);
      var n = t.call(this) || this;
      return (
        (i = Object.assign({}, S.RENDER_OPTIONS, i)),
        (n.options = i),
        (n.type = e),
        (n.screen = new z(0, 0, i.width, i.height)),
        (n.view = i.view || document.createElement("canvas")),
        (n.resolution = i.resolution || S.RESOLUTION),
        (n.useContextAlpha = i.useContextAlpha),
        (n.autoDensity = !!i.autoDensity),
        (n.preserveDrawingBuffer = i.preserveDrawingBuffer),
        (n.clearBeforeRender = i.clearBeforeRender),
        (n._backgroundColor = 0),
        (n._backgroundColorRgba = [0, 0, 0, 1]),
        (n._backgroundColorString = "#000000"),
        (n.backgroundColor = i.backgroundColor || n._backgroundColor),
        (n.backgroundAlpha = i.backgroundAlpha),
        i.transparent !== void 0 &&
          (te(
            "6.0.0",
            "Option transparent is deprecated, please use backgroundAlpha instead."
          ),
          (n.useContextAlpha = i.transparent),
          (n.backgroundAlpha = i.transparent ? 0 : 1)),
        (n._lastObjectRendered = null),
        (n.plugins = {}),
        n
      );
    }
    return (
      (r.prototype.initPlugins = function (e) {
        for (var i in e) this.plugins[i] = new e[i](this);
      }),
      Object.defineProperty(r.prototype, "width", {
        get: function () {
          return this.view.width;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "height", {
        get: function () {
          return this.view.height;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.resize = function (e, i) {
        (this.view.width = Math.round(e * this.resolution)),
          (this.view.height = Math.round(i * this.resolution));
        var n = this.view.width / this.resolution,
          s = this.view.height / this.resolution;
        (this.screen.width = n),
          (this.screen.height = s),
          this.autoDensity &&
            ((this.view.style.width = n + "px"),
            (this.view.style.height = s + "px")),
          this.emit("resize", n, s);
      }),
      (r.prototype.generateTexture = function (e, i, n, s) {
        i === void 0 && (i = {}),
          typeof i == "number" &&
            (te(
              "6.1.0",
              "generateTexture options (scaleMode, resolution, region) are now object options."
            ),
            (i = { scaleMode: i, resolution: n, region: s }));
        var a = i.region,
          o = xc(i, ["region"]);
        (s = a || e.getLocalBounds(null, !0)),
          s.width === 0 && (s.width = 1),
          s.height === 0 && (s.height = 1);
        var h = ae.create(bi({ width: s.width, height: s.height }, o));
        return (
          (Mi.tx = -s.x),
          (Mi.ty = -s.y),
          this.render(e, {
            renderTexture: h,
            clear: !1,
            transform: Mi,
            skipUpdateTransform: !!e.parent,
          }),
          h
        );
      }),
      (r.prototype.destroy = function (e) {
        for (var i in this.plugins)
          this.plugins[i].destroy(), (this.plugins[i] = null);
        e &&
          this.view.parentNode &&
          this.view.parentNode.removeChild(this.view);
        var n = this;
        (n.plugins = null),
          (n.type = De.UNKNOWN),
          (n.view = null),
          (n.screen = null),
          (n._tempDisplayObjectParent = null),
          (n.options = null),
          (this._backgroundColorRgba = null),
          (this._backgroundColorString = null),
          (this._lastObjectRendered = null);
      }),
      Object.defineProperty(r.prototype, "backgroundColor", {
        get: function () {
          return this._backgroundColor;
        },
        set: function (e) {
          (this._backgroundColor = e),
            (this._backgroundColorString = _s(e)),
            ye(e, this._backgroundColorRgba);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "backgroundAlpha", {
        get: function () {
          return this._backgroundColorRgba[3];
        },
        set: function (e) {
          this._backgroundColorRgba[3] = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(Ue),
  xd = (function () {
    function t(r) {
      (this.buffer = r || null),
        (this.updateID = -1),
        (this.byteLength = -1),
        (this.refCount = 0);
    }
    return t;
  })(),
  Td = (function () {
    function t(r) {
      (this.renderer = r),
        (this.managedBuffers = {}),
        (this.boundBufferBases = {});
    }
    return (
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      (t.prototype.contextChange = function () {
        this.disposeAll(!0),
          (this.gl = this.renderer.gl),
          (this.CONTEXT_UID = this.renderer.CONTEXT_UID);
      }),
      (t.prototype.bind = function (r) {
        var e = this,
          i = e.gl,
          n = e.CONTEXT_UID,
          s = r._glBuffers[n] || this.createGLBuffer(r);
        i.bindBuffer(r.type, s.buffer);
      }),
      (t.prototype.bindBufferBase = function (r, e) {
        var i = this,
          n = i.gl,
          s = i.CONTEXT_UID;
        if (this.boundBufferBases[e] !== r) {
          var a = r._glBuffers[s] || this.createGLBuffer(r);
          (this.boundBufferBases[e] = r),
            n.bindBufferBase(n.UNIFORM_BUFFER, e, a.buffer);
        }
      }),
      (t.prototype.bindBufferRange = function (r, e, i) {
        var n = this,
          s = n.gl,
          a = n.CONTEXT_UID;
        i = i || 0;
        var o = r._glBuffers[a] || this.createGLBuffer(r);
        s.bindBufferRange(s.UNIFORM_BUFFER, e || 0, o.buffer, i * 256, 256);
      }),
      (t.prototype.update = function (r) {
        var e = this,
          i = e.gl,
          n = e.CONTEXT_UID,
          s = r._glBuffers[n];
        if (r._updateID !== s.updateID)
          if (
            ((s.updateID = r._updateID),
            i.bindBuffer(r.type, s.buffer),
            s.byteLength >= r.data.byteLength)
          )
            i.bufferSubData(r.type, 0, r.data);
          else {
            var a = r.static ? i.STATIC_DRAW : i.DYNAMIC_DRAW;
            (s.byteLength = r.data.byteLength), i.bufferData(r.type, r.data, a);
          }
      }),
      (t.prototype.dispose = function (r, e) {
        if (!!this.managedBuffers[r.id]) {
          delete this.managedBuffers[r.id];
          var i = r._glBuffers[this.CONTEXT_UID],
            n = this.gl;
          r.disposeRunner.remove(this),
            !!i &&
              (e || n.deleteBuffer(i.buffer),
              delete r._glBuffers[this.CONTEXT_UID]);
        }
      }),
      (t.prototype.disposeAll = function (r) {
        for (var e = Object.keys(this.managedBuffers), i = 0; i < e.length; i++)
          this.dispose(this.managedBuffers[e[i]], r);
      }),
      (t.prototype.createGLBuffer = function (r) {
        var e = this,
          i = e.CONTEXT_UID,
          n = e.gl;
        return (
          (r._glBuffers[i] = new xd(n.createBuffer())),
          (this.managedBuffers[r.id] = r),
          r.disposeRunner.add(this),
          r._glBuffers[i]
        );
      }),
      t
    );
  })(),
  qt = (function (t) {
    K(r, t);
    function r(e) {
      var i = t.call(this, De.WEBGL, e) || this;
      return (
        (e = i.options),
        (i.gl = null),
        (i.CONTEXT_UID = 0),
        (i.runners = {
          destroy: new Tt("destroy"),
          contextChange: new Tt("contextChange"),
          reset: new Tt("reset"),
          update: new Tt("update"),
          postrender: new Tt("postrender"),
          prerender: new Tt("prerender"),
          resize: new Tt("resize"),
        }),
        i.runners.contextChange.add(i),
        (i.globalUniforms = new oe({ projectionMatrix: new ut() }, !0)),
        i
          .addSystem(Ia, "mask")
          .addSystem(ca, "context")
          .addSystem(Ua, "state")
          .addSystem(Sa, "shader")
          .addSystem(La, "texture")
          .addSystem(Td, "buffer")
          .addSystem(pa, "geometry")
          .addSystem(da, "framebuffer")
          .addSystem(Ca, "scissor")
          .addSystem(Pa, "stencil")
          .addSystem(Aa, "projection")
          .addSystem(Fa, "textureGC")
          .addSystem(ua, "filter")
          .addSystem(Na, "renderTexture")
          .addSystem(fa, "batch"),
        i.initPlugins(r.__plugins),
        (i.multisample = void 0),
        e.context
          ? i.context.initFromContext(e.context)
          : i.context.initFromOptions({
              alpha: !!i.useContextAlpha,
              antialias: e.antialias,
              premultipliedAlpha:
                i.useContextAlpha && i.useContextAlpha !== "notMultiplied",
              stencil: !0,
              preserveDrawingBuffer: e.preserveDrawingBuffer,
              powerPreference: i.options.powerPreference,
            }),
        (i.renderingToScreen = !0),
        iu(i.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1"),
        i.resize(i.options.width, i.options.height),
        i
      );
    }
    return (
      (r.create = function (e) {
        if (nu()) return new r(e);
        throw new Error(
          'WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.'
        );
      }),
      (r.prototype.contextChange = function () {
        var e = this.gl,
          i;
        if (this.context.webGLVersion === 1) {
          var n = e.getParameter(e.FRAMEBUFFER_BINDING);
          e.bindFramebuffer(e.FRAMEBUFFER, null),
            (i = e.getParameter(e.SAMPLES)),
            e.bindFramebuffer(e.FRAMEBUFFER, n);
        } else {
          var n = e.getParameter(e.DRAW_FRAMEBUFFER_BINDING);
          e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null),
            (i = e.getParameter(e.SAMPLES)),
            e.bindFramebuffer(e.DRAW_FRAMEBUFFER, n);
        }
        i >= ct.HIGH
          ? (this.multisample = ct.HIGH)
          : i >= ct.MEDIUM
          ? (this.multisample = ct.MEDIUM)
          : i >= ct.LOW
          ? (this.multisample = ct.LOW)
          : (this.multisample = ct.NONE);
      }),
      (r.prototype.addSystem = function (e, i) {
        var n = new e(this);
        if (this[i])
          throw new Error('Whoops! The name "' + i + '" is already in use');
        this[i] = n;
        for (var s in this.runners) this.runners[s].add(n);
        return this;
      }),
      (r.prototype.render = function (e, i) {
        var n, s, a, o;
        if (
          (i &&
            (i instanceof ae
              ? (te(
                  "6.0.0",
                  "Renderer#render arguments changed, use options instead."
                ),
                (n = i),
                (s = arguments[2]),
                (a = arguments[3]),
                (o = arguments[4]))
              : ((n = i.renderTexture),
                (s = i.clear),
                (a = i.transform),
                (o = i.skipUpdateTransform))),
          (this.renderingToScreen = !n),
          this.runners.prerender.emit(),
          this.emit("prerender"),
          (this.projection.transform = a),
          !this.context.isLost)
        ) {
          if ((n || (this._lastObjectRendered = e), !o)) {
            var h = e.enableTempParent();
            e.updateTransform(), e.disableTempParent(h);
          }
          this.renderTexture.bind(n),
            this.batch.currentRenderer.start(),
            (s !== void 0 ? s : this.clearBeforeRender) &&
              this.renderTexture.clear(),
            e.render(this),
            this.batch.currentRenderer.flush(),
            n && n.baseTexture.update(),
            this.runners.postrender.emit(),
            (this.projection.transform = null),
            this.emit("postrender");
        }
      }),
      (r.prototype.generateTexture = function (e, i, n, s) {
        i === void 0 && (i = {});
        var a = t.prototype.generateTexture.call(this, e, i, n, s);
        return this.framebuffer.blit(), a;
      }),
      (r.prototype.resize = function (e, i) {
        t.prototype.resize.call(this, e, i),
          this.runners.resize.emit(this.screen.height, this.screen.width);
      }),
      (r.prototype.reset = function () {
        return this.runners.reset.emit(), this;
      }),
      (r.prototype.clear = function () {
        this.renderTexture.bind(), this.renderTexture.clear();
      }),
      (r.prototype.destroy = function (e) {
        this.runners.destroy.emit();
        for (var i in this.runners) this.runners[i].destroy();
        t.prototype.destroy.call(this, e), (this.gl = null);
      }),
      Object.defineProperty(r.prototype, "extract", {
        get: function () {
          return (
            te(
              "6.0.0",
              "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead."
            ),
            this.plugins.extract
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.registerPlugin = function (e, i) {
        (r.__plugins = r.__plugins || {}), (r.__plugins[e] = i);
      }),
      r
    );
  })(gd);
function bd(t) {
  return qt.create(t);
}
var Ed = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,
  Id = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,
  Rd = Ed,
  Ba = Id,
  Di = (function () {
    function t() {
      (this.texArray = null),
        (this.blend = 0),
        (this.type = It.TRIANGLES),
        (this.start = 0),
        (this.size = 0),
        (this.data = null);
    }
    return t;
  })(),
  ki = (function () {
    function t() {
      (this.elements = []), (this.ids = []), (this.count = 0);
    }
    return (
      (t.prototype.clear = function () {
        for (var r = 0; r < this.count; r++) this.elements[r] = null;
        this.count = 0;
      }),
      t
    );
  })(),
  Xi = (function () {
    function t(r) {
      typeof r == "number"
        ? (this.rawBinaryData = new ArrayBuffer(r))
        : r instanceof Uint8Array
        ? (this.rawBinaryData = r.buffer)
        : (this.rawBinaryData = r),
        (this.uint32View = new Uint32Array(this.rawBinaryData)),
        (this.float32View = new Float32Array(this.rawBinaryData));
    }
    return (
      Object.defineProperty(t.prototype, "int8View", {
        get: function () {
          return (
            this._int8View ||
              (this._int8View = new Int8Array(this.rawBinaryData)),
            this._int8View
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "uint8View", {
        get: function () {
          return (
            this._uint8View ||
              (this._uint8View = new Uint8Array(this.rawBinaryData)),
            this._uint8View
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "int16View", {
        get: function () {
          return (
            this._int16View ||
              (this._int16View = new Int16Array(this.rawBinaryData)),
            this._int16View
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "uint16View", {
        get: function () {
          return (
            this._uint16View ||
              (this._uint16View = new Uint16Array(this.rawBinaryData)),
            this._uint16View
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "int32View", {
        get: function () {
          return (
            this._int32View ||
              (this._int32View = new Int32Array(this.rawBinaryData)),
            this._int32View
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.view = function (r) {
        return this[r + "View"];
      }),
      (t.prototype.destroy = function () {
        (this.rawBinaryData = null),
          (this._int8View = null),
          (this._uint8View = null),
          (this._int16View = null),
          (this._uint16View = null),
          (this._int32View = null),
          (this.uint32View = null),
          (this.float32View = null);
      }),
      (t.sizeOf = function (r) {
        switch (r) {
          case "int8":
          case "uint8":
            return 1;
          case "int16":
          case "uint16":
            return 2;
          case "int32":
          case "uint32":
          case "float32":
            return 4;
          default:
            throw new Error(r + " isn't a valid view type");
        }
      }),
      t
    );
  })(),
  wd = (function (t) {
    K(r, t);
    function r(e) {
      var i = t.call(this, e) || this;
      return (
        (i.shaderGenerator = null),
        (i.geometryClass = null),
        (i.vertexSize = null),
        (i.state = he.for2d()),
        (i.size = S.SPRITE_BATCH_SIZE * 4),
        (i._vertexCount = 0),
        (i._indexCount = 0),
        (i._bufferedElements = []),
        (i._bufferedTextures = []),
        (i._bufferSize = 0),
        (i._shader = null),
        (i._packedGeometries = []),
        (i._packedGeometryPoolSize = 2),
        (i._flushId = 0),
        (i._aBuffers = {}),
        (i._iBuffers = {}),
        (i.MAX_TEXTURES = 1),
        i.renderer.on("prerender", i.onPrerender, i),
        e.runners.contextChange.add(i),
        (i._dcIndex = 0),
        (i._aIndex = 0),
        (i._iIndex = 0),
        (i._attributeBuffer = null),
        (i._indexBuffer = null),
        (i._tempBoundTextures = []),
        i
      );
    }
    return (
      (r.prototype.contextChange = function () {
        var e = this.renderer.gl;
        S.PREFER_ENV === Bt.WEBGL_LEGACY
          ? (this.MAX_TEXTURES = 1)
          : ((this.MAX_TEXTURES = Math.min(
              e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),
              S.SPRITE_MAX_TEXTURES
            )),
            (this.MAX_TEXTURES = zc(this.MAX_TEXTURES, e))),
          (this._shader = this.shaderGenerator.generateShader(
            this.MAX_TEXTURES
          ));
        for (var i = 0; i < this._packedGeometryPoolSize; i++)
          this._packedGeometries[i] = new this.geometryClass();
        this.initFlushBuffers();
      }),
      (r.prototype.initFlushBuffers = function () {
        for (
          var e = r._drawCallPool,
            i = r._textureArrayPool,
            n = this.size / 4,
            s = Math.floor(n / this.MAX_TEXTURES) + 1;
          e.length < n;

        )
          e.push(new Di());
        for (; i.length < s; ) i.push(new ki());
        for (var a = 0; a < this.MAX_TEXTURES; a++)
          this._tempBoundTextures[a] = null;
      }),
      (r.prototype.onPrerender = function () {
        this._flushId = 0;
      }),
      (r.prototype.render = function (e) {
        !e._texture.valid ||
          (this._vertexCount + e.vertexData.length / 2 > this.size &&
            this.flush(),
          (this._vertexCount += e.vertexData.length / 2),
          (this._indexCount += e.indices.length),
          (this._bufferedTextures[this._bufferSize] = e._texture.baseTexture),
          (this._bufferedElements[this._bufferSize++] = e));
      }),
      (r.prototype.buildTexturesAndDrawCalls = function () {
        var e = this,
          i = e._bufferedTextures,
          n = e.MAX_TEXTURES,
          s = r._textureArrayPool,
          a = this.renderer.batch,
          o = this._tempBoundTextures,
          h = this.renderer.textureGC.count,
          u = ++W._globalBatch,
          f = 0,
          c = s[0],
          l = 0;
        a.copyBoundTextures(o, n);
        for (var d = 0; d < this._bufferSize; ++d) {
          var p = i[d];
          (i[d] = null),
            p._batchEnabled !== u &&
              (c.count >= n &&
                (a.boundArray(c, o, u, n),
                this.buildDrawCalls(c, l, d),
                (l = d),
                (c = s[++f]),
                ++u),
              (p._batchEnabled = u),
              (p.touched = h),
              (c.elements[c.count++] = p));
        }
        c.count > 0 &&
          (a.boundArray(c, o, u, n),
          this.buildDrawCalls(c, l, this._bufferSize),
          ++f,
          ++u);
        for (var d = 0; d < o.length; d++) o[d] = null;
        W._globalBatch = u;
      }),
      (r.prototype.buildDrawCalls = function (e, i, n) {
        var s = this,
          a = s._bufferedElements,
          o = s._attributeBuffer,
          h = s._indexBuffer,
          u = s.vertexSize,
          f = r._drawCallPool,
          c = this._dcIndex,
          l = this._aIndex,
          d = this._iIndex,
          p = f[c];
        (p.start = this._iIndex), (p.texArray = e);
        for (var _ = i; _ < n; ++_) {
          var v = a[_],
            m = v._texture.baseTexture,
            g = ys[m.alphaMode ? 1 : 0][v.blendMode];
          (a[_] = null),
            i < _ &&
              p.blend !== g &&
              ((p.size = d - p.start),
              (i = _),
              (p = f[++c]),
              (p.texArray = e),
              (p.start = d)),
            this.packInterleavedGeometry(v, o, h, l, d),
            (l += (v.vertexData.length / 2) * u),
            (d += v.indices.length),
            (p.blend = g);
        }
        i < n && ((p.size = d - p.start), ++c),
          (this._dcIndex = c),
          (this._aIndex = l),
          (this._iIndex = d);
      }),
      (r.prototype.bindAndClearTexArray = function (e) {
        for (var i = this.renderer.texture, n = 0; n < e.count; n++)
          i.bind(e.elements[n], e.ids[n]), (e.elements[n] = null);
        e.count = 0;
      }),
      (r.prototype.updateGeometry = function () {
        var e = this,
          i = e._packedGeometries,
          n = e._attributeBuffer,
          s = e._indexBuffer;
        S.CAN_UPLOAD_SAME_BUFFER
          ? (i[this._flushId]._buffer.update(n.rawBinaryData),
            i[this._flushId]._indexBuffer.update(s),
            this.renderer.geometry.updateBuffers())
          : (this._packedGeometryPoolSize <= this._flushId &&
              (this._packedGeometryPoolSize++,
              (i[this._flushId] = new this.geometryClass())),
            i[this._flushId]._buffer.update(n.rawBinaryData),
            i[this._flushId]._indexBuffer.update(s),
            this.renderer.geometry.bind(i[this._flushId]),
            this.renderer.geometry.updateBuffers(),
            this._flushId++);
      }),
      (r.prototype.drawBatches = function () {
        for (
          var e = this._dcIndex,
            i = this.renderer,
            n = i.gl,
            s = i.state,
            a = r._drawCallPool,
            o = null,
            h = 0;
          h < e;
          h++
        ) {
          var u = a[h],
            f = u.texArray,
            c = u.type,
            l = u.size,
            d = u.start,
            p = u.blend;
          o !== f && ((o = f), this.bindAndClearTexArray(f)),
            (this.state.blendMode = p),
            s.set(this.state),
            n.drawElements(c, l, n.UNSIGNED_SHORT, d * 2);
        }
      }),
      (r.prototype.flush = function () {
        this._vertexCount !== 0 &&
          ((this._attributeBuffer = this.getAttributeBuffer(this._vertexCount)),
          (this._indexBuffer = this.getIndexBuffer(this._indexCount)),
          (this._aIndex = 0),
          (this._iIndex = 0),
          (this._dcIndex = 0),
          this.buildTexturesAndDrawCalls(),
          this.updateGeometry(),
          this.drawBatches(),
          (this._bufferSize = 0),
          (this._vertexCount = 0),
          (this._indexCount = 0));
      }),
      (r.prototype.start = function () {
        this.renderer.state.set(this.state),
          this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES),
          this.renderer.shader.bind(this._shader),
          S.CAN_UPLOAD_SAME_BUFFER &&
            this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
      }),
      (r.prototype.stop = function () {
        this.flush();
      }),
      (r.prototype.destroy = function () {
        for (var e = 0; e < this._packedGeometryPoolSize; e++)
          this._packedGeometries[e] && this._packedGeometries[e].destroy();
        this.renderer.off("prerender", this.onPrerender, this),
          (this._aBuffers = null),
          (this._iBuffers = null),
          (this._packedGeometries = null),
          (this._attributeBuffer = null),
          (this._indexBuffer = null),
          this._shader && (this._shader.destroy(), (this._shader = null)),
          t.prototype.destroy.call(this);
      }),
      (r.prototype.getAttributeBuffer = function (e) {
        var i = cr(Math.ceil(e / 8)),
          n = Es(i),
          s = i * 8;
        this._aBuffers.length <= n && (this._iBuffers.length = n + 1);
        var a = this._aBuffers[s];
        return (
          a || (this._aBuffers[s] = a = new Xi(s * this.vertexSize * 4)), a
        );
      }),
      (r.prototype.getIndexBuffer = function (e) {
        var i = cr(Math.ceil(e / 12)),
          n = Es(i),
          s = i * 12;
        this._iBuffers.length <= n && (this._iBuffers.length = n + 1);
        var a = this._iBuffers[n];
        return a || (this._iBuffers[n] = a = new Uint16Array(s)), a;
      }),
      (r.prototype.packInterleavedGeometry = function (e, i, n, s, a) {
        for (
          var o = i.uint32View,
            h = i.float32View,
            u = s / this.vertexSize,
            f = e.uvs,
            c = e.indices,
            l = e.vertexData,
            d = e._texture.baseTexture._batchLocation,
            p = Math.min(e.worldAlpha, 1),
            _ =
              p < 1 && e._texture.baseTexture.alphaMode
                ? ci(e._tintRGB, p)
                : e._tintRGB + ((p * 255) << 24),
            v = 0;
          v < l.length;
          v += 2
        )
          (h[s++] = l[v]),
            (h[s++] = l[v + 1]),
            (h[s++] = f[v]),
            (h[s++] = f[v + 1]),
            (o[s++] = _),
            (h[s++] = d);
        for (var v = 0; v < c.length; v++) n[a++] = u + c[v];
      }),
      (r._drawCallPool = []),
      (r._textureArrayPool = []),
      r
    );
  })(Ir),
  Cd = (function () {
    function t(r, e) {
      if (
        ((this.vertexSrc = r),
        (this.fragTemplate = e),
        (this.programCache = {}),
        (this.defaultGroupCache = {}),
        e.indexOf("%count%") < 0)
      )
        throw new Error('Fragment template must contain "%count%".');
      if (e.indexOf("%forloop%") < 0)
        throw new Error('Fragment template must contain "%forloop%".');
    }
    return (
      (t.prototype.generateShader = function (r) {
        if (!this.programCache[r]) {
          for (var e = new Int32Array(r), i = 0; i < r; i++) e[i] = i;
          this.defaultGroupCache[r] = oe.from({ uSamplers: e }, !0);
          var n = this.fragTemplate;
          (n = n.replace(/%count%/gi, "" + r)),
            (n = n.replace(/%forloop%/gi, this.generateSampleSrc(r))),
            (this.programCache[r] = new ze(this.vertexSrc, n));
        }
        var s = {
          tint: new Float32Array([1, 1, 1, 1]),
          translationMatrix: new ut(),
          default: this.defaultGroupCache[r],
        };
        return new Yt(this.programCache[r], s);
      }),
      (t.prototype.generateSampleSrc = function (r) {
        var e = "";
        (e += `
`),
          (e += `
`);
        for (var i = 0; i < r; i++)
          i > 0 &&
            (e += `
else `),
            i < r - 1 && (e += "if(vTextureId < " + i + ".5)"),
            (e += `
{`),
            (e +=
              `
	color = texture2D(uSamplers[` +
              i +
              "], vTextureCoord);"),
            (e += `
}`);
        return (
          (e += `
`),
          (e += `
`),
          e
        );
      }),
      t
    );
  })(),
  Ma = (function (t) {
    K(r, t);
    function r(e) {
      e === void 0 && (e = !1);
      var i = t.call(this) || this;
      return (
        (i._buffer = new dt(null, e, !1)),
        (i._indexBuffer = new dt(null, e, !0)),
        i
          .addAttribute("aVertexPosition", i._buffer, 2, !1, G.FLOAT)
          .addAttribute("aTextureCoord", i._buffer, 2, !1, G.FLOAT)
          .addAttribute("aColor", i._buffer, 4, !0, G.UNSIGNED_BYTE)
          .addAttribute("aTextureId", i._buffer, 1, !0, G.FLOAT)
          .addIndex(i._indexBuffer),
        i
      );
    }
    return r;
  })(He),
  Da = `precision highp float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform vec4 tint;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main(void){
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vColor = aColor * tint;
}
`,
  ka = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`,
  Pd = (function () {
    function t() {}
    return (
      (t.create = function (r) {
        var e = Object.assign(
            { vertex: Da, fragment: ka, geometryClass: Ma, vertexSize: 6 },
            r
          ),
          i = e.vertex,
          n = e.fragment,
          s = e.vertexSize,
          a = e.geometryClass;
        return (function (o) {
          K(h, o);
          function h(u) {
            var f = o.call(this, u) || this;
            return (
              (f.shaderGenerator = new Cd(i, n)),
              (f.geometryClass = a),
              (f.vertexSize = s),
              f
            );
          }
          return h;
        })(wd);
      }),
      Object.defineProperty(t, "defaultVertexSrc", {
        get: function () {
          return Da;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultFragmentTemplate", {
        get: function () {
          return ka;
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })(),
  Ad = Pd.create(),
  Nd = {},
  Od = function (t) {
    Object.defineProperty(Nd, t, {
      get: function () {
        return (
          te("6.0.0", "PIXI.systems." + t + " has moved to PIXI." + t), ra[t]
        );
      },
    });
  };
for (var Hi in ra) Od(Hi);
var Sd = {},
  Ud = function (t) {
    Object.defineProperty(Sd, t, {
      get: function () {
        return (
          te("6.0.0", "PIXI.resources." + t + " has moved to PIXI." + t), Ga[t]
        );
      },
    });
  };
for (var Hi in Ga) Ud(Hi);
/*!
 * @pixi/app - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/app is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Vi = (function () {
    function t(r) {
      var e = this;
      (this.stage = new Ft()),
        (r = Object.assign({ forceCanvas: !1 }, r)),
        (this.renderer = bd(r)),
        t._plugins.forEach(function (i) {
          i.init.call(e, r);
        });
    }
    return (
      (t.registerPlugin = function (r) {
        t._plugins.push(r);
      }),
      (t.prototype.render = function () {
        this.renderer.render(this.stage);
      }),
      Object.defineProperty(t.prototype, "view", {
        get: function () {
          return this.renderer.view;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "screen", {
        get: function () {
          return this.renderer.screen;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.destroy = function (r, e) {
        var i = this,
          n = t._plugins.slice(0);
        n.reverse(),
          n.forEach(function (s) {
            s.destroy.call(i);
          }),
          this.stage.destroy(e),
          (this.stage = null),
          this.renderer.destroy(r),
          (this.renderer = null);
      }),
      (t._plugins = []),
      t
    );
  })(),
  Fd = (function () {
    function t() {}
    return (
      (t.init = function (r) {
        var e = this;
        Object.defineProperty(this, "resizeTo", {
          set: function (i) {
            self.removeEventListener("resize", this.queueResize),
              (this._resizeTo = i),
              i &&
                (self.addEventListener("resize", this.queueResize),
                this.resize());
          },
          get: function () {
            return this._resizeTo;
          },
        }),
          (this.queueResize = function () {
            !e._resizeTo ||
              (e.cancelResize(),
              (e._resizeId = requestAnimationFrame(function () {
                return e.resize();
              })));
          }),
          (this.cancelResize = function () {
            e._resizeId &&
              (cancelAnimationFrame(e._resizeId), (e._resizeId = null));
          }),
          (this.resize = function () {
            if (!!e._resizeTo) {
              e.cancelResize();
              var i, n;
              if (e._resizeTo === self)
                (i = self.innerWidth), (n = self.innerHeight);
              else {
                var s = e._resizeTo,
                  a = s.clientWidth,
                  o = s.clientHeight;
                (i = a), (n = o);
              }
              e.renderer.resize(i, n);
            }
          }),
          (this._resizeId = null),
          (this._resizeTo = null),
          (this.resizeTo = r.resizeTo || null);
      }),
      (t.destroy = function () {
        self.removeEventListener("resize", this.queueResize),
          this.cancelResize(),
          (this.cancelResize = null),
          (this.queueResize = null),
          (this.resizeTo = null),
          (this.resize = null);
      }),
      t
    );
  })();
Vi.registerPlugin(Fd);
/*!
 * @pixi/extract - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/extract is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Xa = new z(),
  Ha = 4,
  Ld = (function () {
    function t(r) {
      this.renderer = r;
    }
    return (
      (t.prototype.image = function (r, e, i) {
        var n = new Image();
        return (n.src = this.base64(r, e, i)), n;
      }),
      (t.prototype.base64 = function (r, e, i) {
        return this.canvas(r).toDataURL(e, i);
      }),
      (t.prototype.canvas = function (r) {
        var e = this.renderer,
          i,
          n,
          s = !1,
          a,
          o = !1;
        r &&
          (r instanceof ae
            ? (a = r)
            : ((a = this.renderer.generateTexture(r)), (o = !0))),
          a
            ? ((i = a.baseTexture.resolution),
              (n = a.frame),
              (s = !1),
              e.renderTexture.bind(a))
            : ((i = this.renderer.resolution),
              (s = !0),
              (n = Xa),
              (n.width = this.renderer.width),
              (n.height = this.renderer.height),
              e.renderTexture.bind(null));
        var h = Math.floor(n.width * i + 1e-4),
          u = Math.floor(n.height * i + 1e-4),
          f = new ws(h, u, 1),
          c = new Uint8Array(Ha * h * u),
          l = e.gl;
        l.readPixels(n.x * i, n.y * i, h, u, l.RGBA, l.UNSIGNED_BYTE, c);
        var d = f.context.getImageData(0, 0, h, u);
        if (
          (t.arrayPostDivide(c, d.data), f.context.putImageData(d, 0, 0), s)
        ) {
          var p = new ws(f.width, f.height, 1);
          p.context.scale(1, -1),
            p.context.drawImage(f.canvas, 0, -u),
            f.destroy(),
            (f = p);
        }
        return o && a.destroy(!0), f.canvas;
      }),
      (t.prototype.pixels = function (r) {
        var e = this.renderer,
          i,
          n,
          s,
          a = !1;
        r &&
          (r instanceof ae
            ? (s = r)
            : ((s = this.renderer.generateTexture(r)), (a = !0))),
          s
            ? ((i = s.baseTexture.resolution),
              (n = s.frame),
              e.renderTexture.bind(s))
            : ((i = e.resolution),
              (n = Xa),
              (n.width = e.width),
              (n.height = e.height),
              e.renderTexture.bind(null));
        var o = n.width * i,
          h = n.height * i,
          u = new Uint8Array(Ha * o * h),
          f = e.gl;
        return (
          f.readPixels(n.x * i, n.y * i, o, h, f.RGBA, f.UNSIGNED_BYTE, u),
          a && s.destroy(!0),
          t.arrayPostDivide(u, u),
          u
        );
      }),
      (t.prototype.destroy = function () {
        this.renderer = null;
      }),
      (t.arrayPostDivide = function (r, e) {
        for (var i = 0; i < r.length; i += 4) {
          var n = (e[i + 3] = r[i + 3]);
          n !== 0
            ? ((e[i] = Math.round(Math.min((r[i] * 255) / n, 255))),
              (e[i + 1] = Math.round(Math.min((r[i + 1] * 255) / n, 255))),
              (e[i + 2] = Math.round(Math.min((r[i + 2] * 255) / n, 255))))
            : ((e[i] = r[i]), (e[i + 1] = r[i + 1]), (e[i + 2] = r[i + 2]));
        }
      }),
      t
    );
  })();
/*!
 * @pixi/loaders - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/loaders is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Ar = (function () {
  function t(r, e, i) {
    e === void 0 && (e = !1),
      (this._fn = r),
      (this._once = e),
      (this._thisArg = i),
      (this._next = this._prev = this._owner = null);
  }
  return (
    (t.prototype.detach = function () {
      return this._owner === null ? !1 : (this._owner.detach(this), !0);
    }),
    t
  );
})();
function Va(t, r) {
  return (
    t._head
      ? ((t._tail._next = r), (r._prev = t._tail), (t._tail = r))
      : ((t._head = r), (t._tail = r)),
    (r._owner = t),
    r
  );
}
var Vt = (function () {
  function t() {
    this._head = this._tail = void 0;
  }
  return (
    (t.prototype.handlers = function (r) {
      r === void 0 && (r = !1);
      var e = this._head;
      if (r) return !!e;
      for (var i = []; e; ) i.push(e), (e = e._next);
      return i;
    }),
    (t.prototype.has = function (r) {
      if (!(r instanceof Ar))
        throw new Error(
          "MiniSignal#has(): First arg must be a SignalBinding object."
        );
      return r._owner === this;
    }),
    (t.prototype.dispatch = function () {
      for (var r = arguments, e = [], i = 0; i < arguments.length; i++)
        e[i] = r[i];
      var n = this._head;
      if (!n) return !1;
      for (; n; )
        n._once && this.detach(n), n._fn.apply(n._thisArg, e), (n = n._next);
      return !0;
    }),
    (t.prototype.add = function (r, e) {
      if ((e === void 0 && (e = null), typeof r != "function"))
        throw new Error("MiniSignal#add(): First arg must be a Function.");
      return Va(this, new Ar(r, !1, e));
    }),
    (t.prototype.once = function (r, e) {
      if ((e === void 0 && (e = null), typeof r != "function"))
        throw new Error("MiniSignal#once(): First arg must be a Function.");
      return Va(this, new Ar(r, !0, e));
    }),
    (t.prototype.detach = function (r) {
      if (!(r instanceof Ar))
        throw new Error(
          "MiniSignal#detach(): First arg must be a SignalBinding object."
        );
      return r._owner !== this
        ? this
        : (r._prev && (r._prev._next = r._next),
          r._next && (r._next._prev = r._prev),
          r === this._head
            ? ((this._head = r._next), r._next === null && (this._tail = null))
            : r === this._tail &&
              ((this._tail = r._prev), (this._tail._next = null)),
          (r._owner = null),
          this);
    }),
    (t.prototype.detachAll = function () {
      var r = this._head;
      if (!r) return this;
      for (this._head = this._tail = null; r; )
        (r._owner = null), (r = r._next);
      return this;
    }),
    t
  );
})();
function ja(t, r) {
  r = r || {};
  for (
    var e = {
        key: [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ],
        q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
        parser: {
          strict:
            /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose:
            /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        },
      },
      i = e.parser[r.strictMode ? "strict" : "loose"].exec(t),
      n = {},
      s = 14;
    s--;

  )
    n[e.key[s]] = i[s] || "";
  return (
    (n[e.q.name] = {}),
    n[e.key[12]].replace(e.q.parser, function (a, o, h) {
      o && (n[e.q.name][o] = h);
    }),
    n
  );
}
var Gd = !!(
    self.XDomainRequest && !("withCredentials" in new XMLHttpRequest())
  ),
  Nr = null,
  Bd = 0,
  za = 200,
  Md = 204,
  Dd = 1223,
  kd = 2;
function Wa() {}
function Ya(t, r, e) {
  r && r.indexOf(".") === 0 && (r = r.substring(1)), !!r && (t[r] = e);
}
function ji(t) {
  return t.toString().replace("object ", "");
}
var st = (function () {
  function t(r, e, i) {
    if (
      ((this._dequeue = Wa),
      (this._onLoadBinding = null),
      (this._elementTimer = 0),
      (this._boundComplete = null),
      (this._boundOnError = null),
      (this._boundOnProgress = null),
      (this._boundOnTimeout = null),
      (this._boundXhrOnError = null),
      (this._boundXhrOnTimeout = null),
      (this._boundXhrOnAbort = null),
      (this._boundXhrOnLoad = null),
      typeof r != "string" || typeof e != "string")
    )
      throw new Error(
        "Both name and url are required for constructing a resource."
      );
    (i = i || {}),
      (this._flags = 0),
      this._setFlag(t.STATUS_FLAGS.DATA_URL, e.indexOf("data:") === 0),
      (this.name = r),
      (this.url = e),
      (this.extension = this._getExtension()),
      (this.data = null),
      (this.crossOrigin = i.crossOrigin === !0 ? "anonymous" : i.crossOrigin),
      (this.timeout = i.timeout || 0),
      (this.loadType = i.loadType || this._determineLoadType()),
      (this.xhrType = i.xhrType),
      (this.metadata = i.metadata || {}),
      (this.error = null),
      (this.xhr = null),
      (this.children = []),
      (this.type = t.TYPE.UNKNOWN),
      (this.progressChunk = 0),
      (this._dequeue = Wa),
      (this._onLoadBinding = null),
      (this._elementTimer = 0),
      (this._boundComplete = this.complete.bind(this)),
      (this._boundOnError = this._onError.bind(this)),
      (this._boundOnProgress = this._onProgress.bind(this)),
      (this._boundOnTimeout = this._onTimeout.bind(this)),
      (this._boundXhrOnError = this._xhrOnError.bind(this)),
      (this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this)),
      (this._boundXhrOnAbort = this._xhrOnAbort.bind(this)),
      (this._boundXhrOnLoad = this._xhrOnLoad.bind(this)),
      (this.onStart = new Vt()),
      (this.onProgress = new Vt()),
      (this.onComplete = new Vt()),
      (this.onAfterMiddleware = new Vt());
  }
  return (
    (t.setExtensionLoadType = function (r, e) {
      Ya(t._loadTypeMap, r, e);
    }),
    (t.setExtensionXhrType = function (r, e) {
      Ya(t._xhrTypeMap, r, e);
    }),
    Object.defineProperty(t.prototype, "isDataUrl", {
      get: function () {
        return this._hasFlag(t.STATUS_FLAGS.DATA_URL);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, "isComplete", {
      get: function () {
        return this._hasFlag(t.STATUS_FLAGS.COMPLETE);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, "isLoading", {
      get: function () {
        return this._hasFlag(t.STATUS_FLAGS.LOADING);
      },
      enumerable: !1,
      configurable: !0,
    }),
    (t.prototype.complete = function () {
      this._clearEvents(), this._finish();
    }),
    (t.prototype.abort = function (r) {
      if (!this.error) {
        if (((this.error = new Error(r)), this._clearEvents(), this.xhr))
          this.xhr.abort();
        else if (this.xdr) this.xdr.abort();
        else if (this.data)
          if (this.data.src) this.data.src = t.EMPTY_GIF;
          else
            for (; this.data.firstChild; )
              this.data.removeChild(this.data.firstChild);
        this._finish();
      }
    }),
    (t.prototype.load = function (r) {
      var e = this;
      if (!this.isLoading) {
        if (this.isComplete) {
          r &&
            setTimeout(function () {
              return r(e);
            }, 1);
          return;
        } else r && this.onComplete.once(r);
        switch (
          (this._setFlag(t.STATUS_FLAGS.LOADING, !0),
          this.onStart.dispatch(this),
          (this.crossOrigin === !1 || typeof this.crossOrigin != "string") &&
            (this.crossOrigin = this._determineCrossOrigin(this.url)),
          this.loadType)
        ) {
          case t.LOAD_TYPE.IMAGE:
            (this.type = t.TYPE.IMAGE), this._loadElement("image");
            break;
          case t.LOAD_TYPE.AUDIO:
            (this.type = t.TYPE.AUDIO), this._loadSourceElement("audio");
            break;
          case t.LOAD_TYPE.VIDEO:
            (this.type = t.TYPE.VIDEO), this._loadSourceElement("video");
            break;
          case t.LOAD_TYPE.XHR:
          default:
            Gd && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            break;
        }
      }
    }),
    (t.prototype._hasFlag = function (r) {
      return (this._flags & r) != 0;
    }),
    (t.prototype._setFlag = function (r, e) {
      this._flags = e ? this._flags | r : this._flags & ~r;
    }),
    (t.prototype._clearEvents = function () {
      clearTimeout(this._elementTimer),
        this.data &&
          this.data.removeEventListener &&
          (this.data.removeEventListener("error", this._boundOnError, !1),
          this.data.removeEventListener("load", this._boundComplete, !1),
          this.data.removeEventListener("progress", this._boundOnProgress, !1),
          this.data.removeEventListener(
            "canplaythrough",
            this._boundComplete,
            !1
          )),
        this.xhr &&
          (this.xhr.removeEventListener
            ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1),
              this.xhr.removeEventListener(
                "timeout",
                this._boundXhrOnTimeout,
                !1
              ),
              this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1),
              this.xhr.removeEventListener(
                "progress",
                this._boundOnProgress,
                !1
              ),
              this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1))
            : ((this.xhr.onerror = null),
              (this.xhr.ontimeout = null),
              (this.xhr.onprogress = null),
              (this.xhr.onload = null)));
    }),
    (t.prototype._finish = function () {
      if (this.isComplete)
        throw new Error(
          "Complete called again for an already completed resource."
        );
      this._setFlag(t.STATUS_FLAGS.COMPLETE, !0),
        this._setFlag(t.STATUS_FLAGS.LOADING, !1),
        this.onComplete.dispatch(this);
    }),
    (t.prototype._loadElement = function (r) {
      this.metadata.loadElement
        ? (this.data = this.metadata.loadElement)
        : r === "image" && typeof self.Image != "undefined"
        ? (this.data = new Image())
        : (this.data = document.createElement(r)),
        this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
        this.metadata.skipSource || (this.data.src = this.url),
        this.data.addEventListener("error", this._boundOnError, !1),
        this.data.addEventListener("load", this._boundComplete, !1),
        this.data.addEventListener("progress", this._boundOnProgress, !1),
        this.timeout &&
          (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }),
    (t.prototype._loadSourceElement = function (r) {
      if (
        (this.metadata.loadElement
          ? (this.data = this.metadata.loadElement)
          : r === "audio" && typeof self.Audio != "undefined"
          ? (this.data = new Audio())
          : (this.data = document.createElement(r)),
        this.data === null)
      ) {
        this.abort("Unsupported element: " + r);
        return;
      }
      if (
        (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
        !this.metadata.skipSource)
      )
        if (navigator.isCocoonJS)
          this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        else if (Array.isArray(this.url))
          for (var e = this.metadata.mimeType, i = 0; i < this.url.length; ++i)
            this.data.appendChild(
              this._createSource(r, this.url[i], Array.isArray(e) ? e[i] : e)
            );
        else {
          var e = this.metadata.mimeType;
          this.data.appendChild(
            this._createSource(r, this.url, Array.isArray(e) ? e[0] : e)
          );
        }
      this.data.addEventListener("error", this._boundOnError, !1),
        this.data.addEventListener("load", this._boundComplete, !1),
        this.data.addEventListener("progress", this._boundOnProgress, !1),
        this.data.addEventListener("canplaythrough", this._boundComplete, !1),
        this.data.load(),
        this.timeout &&
          (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }),
    (t.prototype._loadXhr = function () {
      typeof this.xhrType != "string" &&
        (this.xhrType = this._determineXhrType());
      var r = (this.xhr = new XMLHttpRequest());
      r.open("GET", this.url, !0),
        (r.timeout = this.timeout),
        this.xhrType === t.XHR_RESPONSE_TYPE.JSON ||
        this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT
          ? (r.responseType = t.XHR_RESPONSE_TYPE.TEXT)
          : (r.responseType = this.xhrType),
        r.addEventListener("error", this._boundXhrOnError, !1),
        r.addEventListener("timeout", this._boundXhrOnTimeout, !1),
        r.addEventListener("abort", this._boundXhrOnAbort, !1),
        r.addEventListener("progress", this._boundOnProgress, !1),
        r.addEventListener("load", this._boundXhrOnLoad, !1),
        r.send();
    }),
    (t.prototype._loadXdr = function () {
      typeof this.xhrType != "string" &&
        (this.xhrType = this._determineXhrType());
      var r = (this.xhr = new self.XDomainRequest());
      (r.timeout = this.timeout || 5e3),
        (r.onerror = this._boundXhrOnError),
        (r.ontimeout = this._boundXhrOnTimeout),
        (r.onprogress = this._boundOnProgress),
        (r.onload = this._boundXhrOnLoad),
        r.open("GET", this.url, !0),
        setTimeout(function () {
          return r.send();
        }, 1);
    }),
    (t.prototype._createSource = function (r, e, i) {
      i || (i = r + "/" + this._getExtension(e));
      var n = document.createElement("source");
      return (n.src = e), (n.type = i), n;
    }),
    (t.prototype._onError = function (r) {
      this.abort("Failed to load element using: " + r.target.nodeName);
    }),
    (t.prototype._onProgress = function (r) {
      r &&
        r.lengthComputable &&
        this.onProgress.dispatch(this, r.loaded / r.total);
    }),
    (t.prototype._onTimeout = function () {
      this.abort("Load timed out.");
    }),
    (t.prototype._xhrOnError = function () {
      var r = this.xhr;
      this.abort(
        ji(r) +
          " Request failed. Status: " +
          r.status +
          ', text: "' +
          r.statusText +
          '"'
      );
    }),
    (t.prototype._xhrOnTimeout = function () {
      var r = this.xhr;
      this.abort(ji(r) + " Request timed out.");
    }),
    (t.prototype._xhrOnAbort = function () {
      var r = this.xhr;
      this.abort(ji(r) + " Request was aborted by the user.");
    }),
    (t.prototype._xhrOnLoad = function () {
      var r = this.xhr,
        e = "",
        i = typeof r.status == "undefined" ? za : r.status;
      (r.responseType === "" ||
        r.responseType === "text" ||
        typeof r.responseType == "undefined") &&
        (e = r.responseText),
        i === Bd &&
        (e.length > 0 || r.responseType === t.XHR_RESPONSE_TYPE.BUFFER)
          ? (i = za)
          : i === Dd && (i = Md);
      var n = (i / 100) | 0;
      if (n === kd)
        if (this.xhrType === t.XHR_RESPONSE_TYPE.TEXT)
          (this.data = e), (this.type = t.TYPE.TEXT);
        else if (this.xhrType === t.XHR_RESPONSE_TYPE.JSON)
          try {
            (this.data = JSON.parse(e)), (this.type = t.TYPE.JSON);
          } catch (o) {
            this.abort("Error trying to parse loaded json: " + o);
            return;
          }
        else if (this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT)
          try {
            if (self.DOMParser) {
              var s = new DOMParser();
              this.data = s.parseFromString(e, "text/xml");
            } else {
              var a = document.createElement("div");
              (a.innerHTML = e), (this.data = a);
            }
            this.type = t.TYPE.XML;
          } catch (o) {
            this.abort("Error trying to parse loaded xml: " + o);
            return;
          }
        else this.data = r.response || e;
      else {
        this.abort("[" + r.status + "] " + r.statusText + ": " + r.responseURL);
        return;
      }
      this.complete();
    }),
    (t.prototype._determineCrossOrigin = function (r, e) {
      if (r.indexOf("data:") === 0) return "";
      if (self.origin !== self.location.origin) return "anonymous";
      (e = e || self.location),
        Nr || (Nr = document.createElement("a")),
        (Nr.href = r);
      var i = ja(Nr.href, { strictMode: !0 }),
        n = (!i.port && e.port === "") || i.port === e.port,
        s = i.protocol ? i.protocol + ":" : "";
      return i.host !== e.hostname || !n || s !== e.protocol ? "anonymous" : "";
    }),
    (t.prototype._determineXhrType = function () {
      return t._xhrTypeMap[this.extension] || t.XHR_RESPONSE_TYPE.TEXT;
    }),
    (t.prototype._determineLoadType = function () {
      return t._loadTypeMap[this.extension] || t.LOAD_TYPE.XHR;
    }),
    (t.prototype._getExtension = function (r) {
      r === void 0 && (r = this.url);
      var e = "";
      if (this.isDataUrl) {
        var i = r.indexOf("/");
        e = r.substring(i + 1, r.indexOf(";", i));
      } else {
        var n = r.indexOf("?"),
          s = r.indexOf("#"),
          a = Math.min(n > -1 ? n : r.length, s > -1 ? s : r.length);
        (r = r.substring(0, a)), (e = r.substring(r.lastIndexOf(".") + 1));
      }
      return e.toLowerCase();
    }),
    (t.prototype._getMimeFromXhrType = function (r) {
      switch (r) {
        case t.XHR_RESPONSE_TYPE.BUFFER:
          return "application/octet-binary";
        case t.XHR_RESPONSE_TYPE.BLOB:
          return "application/blob";
        case t.XHR_RESPONSE_TYPE.DOCUMENT:
          return "application/xml";
        case t.XHR_RESPONSE_TYPE.JSON:
          return "application/json";
        case t.XHR_RESPONSE_TYPE.DEFAULT:
        case t.XHR_RESPONSE_TYPE.TEXT:
        default:
          return "text/plain";
      }
    }),
    t
  );
})();
(function (t) {
  (function (r) {
    (r[(r.NONE = 0)] = "NONE"),
      (r[(r.DATA_URL = 1)] = "DATA_URL"),
      (r[(r.COMPLETE = 2)] = "COMPLETE"),
      (r[(r.LOADING = 4)] = "LOADING");
  })(t.STATUS_FLAGS || (t.STATUS_FLAGS = {})),
    (function (r) {
      (r[(r.UNKNOWN = 0)] = "UNKNOWN"),
        (r[(r.JSON = 1)] = "JSON"),
        (r[(r.XML = 2)] = "XML"),
        (r[(r.IMAGE = 3)] = "IMAGE"),
        (r[(r.AUDIO = 4)] = "AUDIO"),
        (r[(r.VIDEO = 5)] = "VIDEO"),
        (r[(r.TEXT = 6)] = "TEXT");
    })(t.TYPE || (t.TYPE = {})),
    (function (r) {
      (r[(r.XHR = 1)] = "XHR"),
        (r[(r.IMAGE = 2)] = "IMAGE"),
        (r[(r.AUDIO = 3)] = "AUDIO"),
        (r[(r.VIDEO = 4)] = "VIDEO");
    })(t.LOAD_TYPE || (t.LOAD_TYPE = {})),
    (function (r) {
      (r.DEFAULT = "text"),
        (r.BUFFER = "arraybuffer"),
        (r.BLOB = "blob"),
        (r.DOCUMENT = "document"),
        (r.JSON = "json"),
        (r.TEXT = "text");
    })(t.XHR_RESPONSE_TYPE || (t.XHR_RESPONSE_TYPE = {})),
    (t._loadTypeMap = {
      gif: t.LOAD_TYPE.IMAGE,
      png: t.LOAD_TYPE.IMAGE,
      bmp: t.LOAD_TYPE.IMAGE,
      jpg: t.LOAD_TYPE.IMAGE,
      jpeg: t.LOAD_TYPE.IMAGE,
      tif: t.LOAD_TYPE.IMAGE,
      tiff: t.LOAD_TYPE.IMAGE,
      webp: t.LOAD_TYPE.IMAGE,
      tga: t.LOAD_TYPE.IMAGE,
      svg: t.LOAD_TYPE.IMAGE,
      "svg+xml": t.LOAD_TYPE.IMAGE,
      mp3: t.LOAD_TYPE.AUDIO,
      ogg: t.LOAD_TYPE.AUDIO,
      wav: t.LOAD_TYPE.AUDIO,
      mp4: t.LOAD_TYPE.VIDEO,
      webm: t.LOAD_TYPE.VIDEO,
    }),
    (t._xhrTypeMap = {
      xhtml: t.XHR_RESPONSE_TYPE.DOCUMENT,
      html: t.XHR_RESPONSE_TYPE.DOCUMENT,
      htm: t.XHR_RESPONSE_TYPE.DOCUMENT,
      xml: t.XHR_RESPONSE_TYPE.DOCUMENT,
      tmx: t.XHR_RESPONSE_TYPE.DOCUMENT,
      svg: t.XHR_RESPONSE_TYPE.DOCUMENT,
      tsx: t.XHR_RESPONSE_TYPE.DOCUMENT,
      gif: t.XHR_RESPONSE_TYPE.BLOB,
      png: t.XHR_RESPONSE_TYPE.BLOB,
      bmp: t.XHR_RESPONSE_TYPE.BLOB,
      jpg: t.XHR_RESPONSE_TYPE.BLOB,
      jpeg: t.XHR_RESPONSE_TYPE.BLOB,
      tif: t.XHR_RESPONSE_TYPE.BLOB,
      tiff: t.XHR_RESPONSE_TYPE.BLOB,
      webp: t.XHR_RESPONSE_TYPE.BLOB,
      tga: t.XHR_RESPONSE_TYPE.BLOB,
      json: t.XHR_RESPONSE_TYPE.JSON,
      text: t.XHR_RESPONSE_TYPE.TEXT,
      txt: t.XHR_RESPONSE_TYPE.TEXT,
      ttf: t.XHR_RESPONSE_TYPE.BUFFER,
      otf: t.XHR_RESPONSE_TYPE.BUFFER,
    }),
    (t.EMPTY_GIF =
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
})(st || (st = {}));
function fe() {}
function Xd(t) {
  return function () {
    for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
      i[n] = e[n];
    if (t === null) throw new Error("Callback was already called.");
    var s = t;
    (t = null), s.apply(this, i);
  };
}
var Hd = (function () {
    function t(r, e) {
      (this.data = r), (this.callback = e);
    }
    return t;
  })(),
  zi = (function () {
    function t(r, e) {
      var i = this;
      if (
        (e === void 0 && (e = 1),
        (this.workers = 0),
        (this.saturated = fe),
        (this.unsaturated = fe),
        (this.empty = fe),
        (this.drain = fe),
        (this.error = fe),
        (this.started = !1),
        (this.paused = !1),
        (this._tasks = []),
        (this._insert = function (n, s, a) {
          if (a && typeof a != "function")
            throw new Error("task callback must be a function");
          if (((i.started = !0), n == null && i.idle())) {
            setTimeout(function () {
              return i.drain();
            }, 1);
            return;
          }
          var o = new Hd(n, typeof a == "function" ? a : fe);
          s ? i._tasks.unshift(o) : i._tasks.push(o), setTimeout(i.process, 1);
        }),
        (this.process = function () {
          for (; !i.paused && i.workers < i.concurrency && i._tasks.length; ) {
            var n = i._tasks.shift();
            i._tasks.length === 0 && i.empty(),
              (i.workers += 1),
              i.workers === i.concurrency && i.saturated(),
              i._worker(n.data, Xd(i._next(n)));
          }
        }),
        (this._worker = r),
        e === 0)
      )
        throw new Error("Concurrency must not be zero");
      (this.concurrency = e), (this.buffer = e / 4);
    }
    return (
      (t.prototype._next = function (r) {
        var e = this;
        return function () {
          for (var i = arguments, n = [], s = 0; s < arguments.length; s++)
            n[s] = i[s];
          (e.workers -= 1),
            r.callback.apply(r, n),
            n[0] != null && e.error(n[0], r.data),
            e.workers <= e.concurrency - e.buffer && e.unsaturated(),
            e.idle() && e.drain(),
            e.process();
        };
      }),
      (t.prototype.push = function (r, e) {
        this._insert(r, !1, e);
      }),
      (t.prototype.kill = function () {
        (this.workers = 0),
          (this.drain = fe),
          (this.started = !1),
          (this._tasks = []);
      }),
      (t.prototype.unshift = function (r, e) {
        this._insert(r, !0, e);
      }),
      (t.prototype.length = function () {
        return this._tasks.length;
      }),
      (t.prototype.running = function () {
        return this.workers;
      }),
      (t.prototype.idle = function () {
        return this._tasks.length + this.workers === 0;
      }),
      (t.prototype.pause = function () {
        this.paused !== !0 && (this.paused = !0);
      }),
      (t.prototype.resume = function () {
        if (this.paused !== !1) {
          this.paused = !1;
          for (var r = 1; r <= this.concurrency; r++) this.process();
        }
      }),
      (t.eachSeries = function (r, e, i, n) {
        var s = 0,
          a = r.length;
        function o(h) {
          if (h || s === a) {
            i && i(h);
            return;
          }
          n
            ? setTimeout(function () {
                e(r[s++], o);
              }, 1)
            : e(r[s++], o);
        }
        o();
      }),
      (t.queue = function (r, e) {
        return new t(r, e);
      }),
      t
    );
  })(),
  Wi = 100,
  Vd = /(#[\w-]+)?$/,
  Lt = (function () {
    function t(r, e) {
      var i = this;
      r === void 0 && (r = ""),
        e === void 0 && (e = 10),
        (this.progress = 0),
        (this.loading = !1),
        (this.defaultQueryString = ""),
        (this._beforeMiddleware = []),
        (this._afterMiddleware = []),
        (this._resourcesParsing = []),
        (this._boundLoadResource = function (h, u) {
          return i._loadResource(h, u);
        }),
        (this.resources = {}),
        (this.baseUrl = r),
        (this._beforeMiddleware = []),
        (this._afterMiddleware = []),
        (this._resourcesParsing = []),
        (this._boundLoadResource = function (h, u) {
          return i._loadResource(h, u);
        }),
        (this._queue = zi.queue(this._boundLoadResource, e)),
        this._queue.pause(),
        (this.resources = {}),
        (this.onProgress = new Vt()),
        (this.onError = new Vt()),
        (this.onLoad = new Vt()),
        (this.onStart = new Vt()),
        (this.onComplete = new Vt());
      for (var n = 0; n < t._plugins.length; ++n) {
        var s = t._plugins[n],
          a = s.pre,
          o = s.use;
        a && this.pre(a), o && this.use(o);
      }
      this._protected = !1;
    }
    return (
      (t.prototype._add = function (r, e, i, n) {
        if (this.loading && (!i || !i.parentResource))
          throw new Error("Cannot add resources while the loader is running.");
        if (this.resources[r])
          throw new Error('Resource named "' + r + '" already exists.');
        if (
          ((e = this._prepareUrl(e)),
          (this.resources[r] = new st(r, e, i)),
          typeof n == "function" && this.resources[r].onAfterMiddleware.once(n),
          this.loading)
        ) {
          for (
            var s = i.parentResource, a = [], o = 0;
            o < s.children.length;
            ++o
          )
            s.children[o].isComplete || a.push(s.children[o]);
          var h = s.progressChunk * (a.length + 1),
            u = h / (a.length + 2);
          s.children.push(this.resources[r]), (s.progressChunk = u);
          for (var o = 0; o < a.length; ++o) a[o].progressChunk = u;
          this.resources[r].progressChunk = u;
        }
        return this._queue.push(this.resources[r]), this;
      }),
      (t.prototype.pre = function (r) {
        return this._beforeMiddleware.push(r), this;
      }),
      (t.prototype.use = function (r) {
        return this._afterMiddleware.push(r), this;
      }),
      (t.prototype.reset = function () {
        (this.progress = 0),
          (this.loading = !1),
          this._queue.kill(),
          this._queue.pause();
        for (var r in this.resources) {
          var e = this.resources[r];
          e._onLoadBinding && e._onLoadBinding.detach(),
            e.isLoading && e.abort("loader reset");
        }
        return (this.resources = {}), this;
      }),
      (t.prototype.load = function (r) {
        if ((typeof r == "function" && this.onComplete.once(r), this.loading))
          return this;
        if (this._queue.idle()) this._onStart(), this._onComplete();
        else {
          for (
            var e = this._queue._tasks.length, i = Wi / e, n = 0;
            n < this._queue._tasks.length;
            ++n
          )
            this._queue._tasks[n].data.progressChunk = i;
          this._onStart(), this._queue.resume();
        }
        return this;
      }),
      Object.defineProperty(t.prototype, "concurrency", {
        get: function () {
          return this._queue.concurrency;
        },
        set: function (r) {
          this._queue.concurrency = r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype._prepareUrl = function (r) {
        var e = ja(r, { strictMode: !0 }),
          i;
        if (
          (e.protocol || !e.path || r.indexOf("//") === 0
            ? (i = r)
            : this.baseUrl.length &&
              this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 &&
              r.charAt(0) !== "/"
            ? (i = this.baseUrl + "/" + r)
            : (i = this.baseUrl + r),
          this.defaultQueryString)
        ) {
          var n = Vd.exec(i)[0];
          (i = i.substr(0, i.length - n.length)),
            i.indexOf("?") !== -1
              ? (i += "&" + this.defaultQueryString)
              : (i += "?" + this.defaultQueryString),
            (i += n);
        }
        return i;
      }),
      (t.prototype._loadResource = function (r, e) {
        var i = this;
        (r._dequeue = e),
          zi.eachSeries(
            this._beforeMiddleware,
            function (n, s) {
              n.call(i, r, function () {
                s(r.isComplete ? {} : null);
              });
            },
            function () {
              r.isComplete
                ? i._onLoad(r)
                : ((r._onLoadBinding = r.onComplete.once(i._onLoad, i)),
                  r.load());
            },
            !0
          );
      }),
      (t.prototype._onStart = function () {
        (this.progress = 0), (this.loading = !0), this.onStart.dispatch(this);
      }),
      (t.prototype._onComplete = function () {
        (this.progress = Wi),
          (this.loading = !1),
          this.onComplete.dispatch(this, this.resources);
      }),
      (t.prototype._onLoad = function (r) {
        var e = this;
        (r._onLoadBinding = null),
          this._resourcesParsing.push(r),
          r._dequeue(),
          zi.eachSeries(
            this._afterMiddleware,
            function (i, n) {
              i.call(e, r, n);
            },
            function () {
              r.onAfterMiddleware.dispatch(r),
                (e.progress = Math.min(Wi, e.progress + r.progressChunk)),
                e.onProgress.dispatch(e, r),
                r.error
                  ? e.onError.dispatch(r.error, e, r)
                  : e.onLoad.dispatch(e, r),
                e._resourcesParsing.splice(e._resourcesParsing.indexOf(r), 1),
                e._queue.idle() &&
                  e._resourcesParsing.length === 0 &&
                  e._onComplete();
            },
            !0
          );
      }),
      (t.prototype.destroy = function () {
        this._protected || this.reset();
      }),
      Object.defineProperty(t, "shared", {
        get: function () {
          var r = t._shared;
          return r || ((r = new t()), (r._protected = !0), (t._shared = r)), r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.registerPlugin = function (r) {
        return t._plugins.push(r), r.add && r.add(), t;
      }),
      (t._plugins = []),
      t
    );
  })();
Lt.prototype.add = function (r, e, i, n) {
  if (Array.isArray(r)) {
    for (var s = 0; s < r.length; ++s) this.add(r[s]);
    return this;
  }
  if (
    (typeof r == "object" &&
      ((i = r),
      (n = e || i.callback || i.onComplete),
      (e = i.url),
      (r = i.name || i.key || i.url)),
    typeof e != "string" && ((n = i), (i = e), (e = r)),
    typeof e != "string")
  )
    throw new Error("No url passed to add resource to loader.");
  return typeof i == "function" && ((n = i), (i = null)), this._add(r, e, i, n);
};
var jd = (function () {
    function t() {}
    return (
      (t.init = function (r) {
        (r = Object.assign({ sharedLoader: !1 }, r)),
          (this.loader = r.sharedLoader ? Lt.shared : new Lt());
      }),
      (t.destroy = function () {
        this.loader && (this.loader.destroy(), (this.loader = null));
      }),
      t
    );
  })(),
  zd = (function () {
    function t() {}
    return (
      (t.add = function () {
        st.setExtensionLoadType("svg", st.LOAD_TYPE.XHR),
          st.setExtensionXhrType("svg", st.XHR_RESPONSE_TYPE.TEXT);
      }),
      (t.use = function (r, e) {
        if (r.data && (r.type === st.TYPE.IMAGE || r.extension === "svg")) {
          var i = r.data,
            n = r.url,
            s = r.name,
            a = r.metadata;
          B.fromLoader(i, n, s, a)
            .then(function (o) {
              (r.texture = o), e();
            })
            .catch(e);
        } else e();
      }),
      t
    );
  })(),
  Wd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Yd(t) {
  for (var r = "", e = 0; e < t.length; ) {
    for (var i = [0, 0, 0], n = [0, 0, 0, 0], s = 0; s < i.length; ++s)
      e < t.length ? (i[s] = t.charCodeAt(e++) & 255) : (i[s] = 0);
    (n[0] = i[0] >> 2),
      (n[1] = ((i[0] & 3) << 4) | (i[1] >> 4)),
      (n[2] = ((i[1] & 15) << 2) | (i[2] >> 6)),
      (n[3] = i[2] & 63);
    var a = e - (t.length - 1);
    switch (a) {
      case 2:
        (n[3] = 64), (n[2] = 64);
        break;
      case 1:
        n[3] = 64;
        break;
    }
    for (var s = 0; s < n.length; ++s) r += Wd.charAt(n[s]);
  }
  return r;
}
var $a = self.URL || self.webkitURL;
function $d(t, r) {
  if (!t.data) {
    r();
    return;
  }
  if (t.xhr && t.xhrType === st.XHR_RESPONSE_TYPE.BLOB) {
    if (!self.Blob || typeof t.data == "string") {
      var e = t.xhr.getResponseHeader("content-type");
      if (e && e.indexOf("image") === 0) {
        (t.data = new Image()),
          (t.data.src = "data:" + e + ";base64," + Yd(t.xhr.responseText)),
          (t.type = st.TYPE.IMAGE),
          (t.data.onload = function () {
            (t.data.onload = null), r();
          });
        return;
      }
    } else if (t.data.type.indexOf("image") === 0) {
      var i = $a.createObjectURL(t.data);
      (t.blob = t.data),
        (t.data = new Image()),
        (t.data.src = i),
        (t.type = st.TYPE.IMAGE),
        (t.data.onload = function () {
          $a.revokeObjectURL(i), (t.data.onload = null), r();
        });
      return;
    }
  }
  r();
}
Lt.registerPlugin({ use: $d });
Lt.registerPlugin(zd);
/*!
 * @pixi/compressed-textures - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/compressed-textures is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var q, D;
(function (t) {
  (t[(t.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776)] =
    "COMPRESSED_RGB_S3TC_DXT1_EXT"),
    (t[(t.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777)] =
      "COMPRESSED_RGBA_S3TC_DXT1_EXT"),
    (t[(t.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778)] =
      "COMPRESSED_RGBA_S3TC_DXT3_EXT"),
    (t[(t.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779)] =
      "COMPRESSED_RGBA_S3TC_DXT5_EXT"),
    (t[(t.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"),
    (t[(t.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"),
    (t[(t.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"),
    (t[(t.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916)] =
      "COMPRESSED_SRGB_S3TC_DXT1_EXT"),
    (t[(t.COMPRESSED_R11_EAC = 37488)] = "COMPRESSED_R11_EAC"),
    (t[(t.COMPRESSED_SIGNED_R11_EAC = 37489)] = "COMPRESSED_SIGNED_R11_EAC"),
    (t[(t.COMPRESSED_RG11_EAC = 37490)] = "COMPRESSED_RG11_EAC"),
    (t[(t.COMPRESSED_SIGNED_RG11_EAC = 37491)] = "COMPRESSED_SIGNED_RG11_EAC"),
    (t[(t.COMPRESSED_RGB8_ETC2 = 37492)] = "COMPRESSED_RGB8_ETC2"),
    (t[(t.COMPRESSED_RGBA8_ETC2_EAC = 37496)] = "COMPRESSED_RGBA8_ETC2_EAC"),
    (t[(t.COMPRESSED_SRGB8_ETC2 = 37493)] = "COMPRESSED_SRGB8_ETC2"),
    (t[(t.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497)] =
      "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"),
    (t[(t.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494)] =
      "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"),
    (t[(t.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495)] =
      "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"),
    (t[(t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840)] =
      "COMPRESSED_RGB_PVRTC_4BPPV1_IMG"),
    (t[(t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842)] =
      "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"),
    (t[(t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841)] =
      "COMPRESSED_RGB_PVRTC_2BPPV1_IMG"),
    (t[(t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843)] =
      "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"),
    (t[(t.COMPRESSED_RGB_ETC1_WEBGL = 36196)] = "COMPRESSED_RGB_ETC1_WEBGL"),
    (t[(t.COMPRESSED_RGB_ATC_WEBGL = 35986)] = "COMPRESSED_RGB_ATC_WEBGL"),
    (t[(t.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986)] =
      "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL"),
    (t[(t.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798)] =
      "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL");
})(D || (D = {}));
var Or =
  ((q = {}),
  (q[D.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5),
  (q[D.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5),
  (q[D.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1),
  (q[D.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1),
  (q[D.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5),
  (q[D.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5),
  (q[D.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1),
  (q[D.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1),
  (q[D.COMPRESSED_R11_EAC] = 0.5),
  (q[D.COMPRESSED_SIGNED_R11_EAC] = 0.5),
  (q[D.COMPRESSED_RG11_EAC] = 1),
  (q[D.COMPRESSED_SIGNED_RG11_EAC] = 1),
  (q[D.COMPRESSED_RGB8_ETC2] = 0.5),
  (q[D.COMPRESSED_RGBA8_ETC2_EAC] = 1),
  (q[D.COMPRESSED_SRGB8_ETC2] = 0.5),
  (q[D.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1),
  (q[D.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5),
  (q[D.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5),
  (q[D.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5),
  (q[D.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5),
  (q[D.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25),
  (q[D.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25),
  (q[D.COMPRESSED_RGB_ETC1_WEBGL] = 0.5),
  (q[D.COMPRESSED_RGB_ATC_WEBGL] = 0.5),
  (q[D.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1),
  (q[D.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1),
  q);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var Yi =
  function (t, r) {
    return (
      (Yi =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      Yi(t, r)
    );
  };
function qa(t, r) {
  Yi(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
function qd(t, r, e, i) {
  return new (e || (e = Promise))(function (n, s) {
    function a(u) {
      try {
        h(i.next(u));
      } catch (f) {
        s(f);
      }
    }
    function o(u) {
      try {
        h(i.throw(u));
      } catch (f) {
        s(f);
      }
    }
    function h(u) {
      u.done
        ? n(u.value)
        : new e(function (f) {
            f(u.value);
          }).then(a, o);
    }
    h((i = i.apply(t, r || [])).next());
  });
}
function Zd(t, r) {
  var e = {
      label: 0,
      sent: function () {
        if (s[0] & 1) throw s[1];
        return s[1];
      },
      trys: [],
      ops: [],
    },
    i,
    n,
    s,
    a;
  return (
    (a = { next: o(0), throw: o(1), return: o(2) }),
    typeof Symbol == "function" &&
      (a[Symbol.iterator] = function () {
        return this;
      }),
    a
  );
  function o(u) {
    return function (f) {
      return h([u, f]);
    };
  }
  function h(u) {
    if (i) throw new TypeError("Generator is already executing.");
    for (; e; )
      try {
        if (
          ((i = 1),
          n &&
            (s =
              u[0] & 2
                ? n.return
                : u[0]
                ? n.throw || ((s = n.return) && s.call(n), 0)
                : n.next) &&
            !(s = s.call(n, u[1])).done)
        )
          return s;
        switch (((n = 0), s && (u = [u[0] & 2, s.value]), u[0])) {
          case 0:
          case 1:
            s = u;
            break;
          case 4:
            return e.label++, { value: u[1], done: !1 };
          case 5:
            e.label++, (n = u[1]), (u = [0]);
            continue;
          case 7:
            (u = e.ops.pop()), e.trys.pop();
            continue;
          default:
            if (
              ((s = e.trys),
              !(s = s.length > 0 && s[s.length - 1]) &&
                (u[0] === 6 || u[0] === 2))
            ) {
              e = 0;
              continue;
            }
            if (u[0] === 3 && (!s || (u[1] > s[0] && u[1] < s[3]))) {
              e.label = u[1];
              break;
            }
            if (u[0] === 6 && e.label < s[1]) {
              (e.label = s[1]), (s = u);
              break;
            }
            if (s && e.label < s[2]) {
              (e.label = s[2]), e.ops.push(u);
              break;
            }
            s[2] && e.ops.pop(), e.trys.pop();
            continue;
        }
        u = r.call(t, e);
      } catch (f) {
        (u = [6, f]), (n = 0);
      } finally {
        i = s = 0;
      }
    if (u[0] & 5) throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}
var Kd = (function (t) {
    qa(r, t);
    function r(e, i) {
      i === void 0 && (i = { width: 1, height: 1, autoLoad: !0 });
      var n = this,
        s,
        a;
      return (
        typeof e == "string"
          ? ((s = e), (a = new Uint8Array()))
          : ((s = null), (a = e)),
        (n = t.call(this, a, i) || this),
        (n.origin = s),
        (n.buffer = a ? new Xi(a) : null),
        n.origin && i.autoLoad !== !1 && n.load(),
        a &&
          a.length &&
          ((n.loaded = !0), n.onBlobLoaded(n.buffer.rawBinaryData)),
        n
      );
    }
    return (
      (r.prototype.onBlobLoaded = function (e) {}),
      (r.prototype.load = function () {
        return qd(this, void 0, Promise, function () {
          var e, i, n;
          return Zd(this, function (s) {
            switch (s.label) {
              case 0:
                return [4, fetch(this.origin)];
              case 1:
                return (e = s.sent()), [4, e.blob()];
              case 2:
                return (i = s.sent()), [4, i.arrayBuffer()];
              case 3:
                return (
                  (n = s.sent()),
                  (this.data = new Uint32Array(n)),
                  (this.buffer = new Xi(n)),
                  (this.loaded = !0),
                  this.onBlobLoaded(n),
                  this.update(),
                  [2, this]
                );
            }
          });
        });
      }),
      r
    );
  })(Xe),
  $i = (function (t) {
    qa(r, t);
    function r(e, i) {
      var n = t.call(this, e, i) || this;
      return (
        (n.format = i.format),
        (n.levels = i.levels || 1),
        (n._width = i.width),
        (n._height = i.height),
        (n._extension = r._formatToExtension(n.format)),
        (i.levelBuffers || n.buffer) &&
          (n._levelBuffers =
            i.levelBuffers ||
            r._createLevelBuffers(
              e instanceof Uint8Array ? e : n.buffer.uint8View,
              n.format,
              n.levels,
              4,
              4,
              n.width,
              n.height
            )),
        n
      );
    }
    return (
      (r.prototype.upload = function (e, i, n) {
        var s = e.gl,
          a = e.context.extensions[this._extension];
        if (!a)
          throw new Error(
            this._extension +
              " textures are not supported on the current machine"
          );
        if (!this._levelBuffers) return !1;
        for (var o = 0, h = this.levels; o < h; o++) {
          var u = this._levelBuffers[o],
            f = u.levelID,
            c = u.levelWidth,
            l = u.levelHeight,
            d = u.levelBuffer;
          s.compressedTexImage2D(s.TEXTURE_2D, f, this.format, c, l, 0, d);
        }
        return !0;
      }),
      (r.prototype.onBlobLoaded = function () {
        this._levelBuffers = r._createLevelBuffers(
          this.buffer.uint8View,
          this.format,
          this.levels,
          4,
          4,
          this.width,
          this.height
        );
      }),
      (r._formatToExtension = function (e) {
        if (e >= 33776 && e <= 33779) return "s3tc";
        if (e >= 37488 && e <= 37497) return "etc";
        if (e >= 35840 && e <= 35843) return "pvrtc";
        if (e >= 36196) return "etc1";
        if (e >= 35986 && e <= 34798) return "atc";
        throw new Error("Invalid (compressed) texture format given!");
      }),
      (r._createLevelBuffers = function (e, i, n, s, a, o, h) {
        for (
          var u = new Array(n),
            f = e.byteOffset,
            c = o,
            l = h,
            d = (c + s - 1) & ~(s - 1),
            p = (l + a - 1) & ~(a - 1),
            _ = d * p * Or[i],
            v = 0;
          v < n;
          v++
        )
          (u[v] = {
            levelID: v,
            levelWidth: n > 1 ? c : d,
            levelHeight: n > 1 ? l : p,
            levelBuffer: new Uint8Array(e.buffer, f, _),
          }),
            (f += _),
            (c = c >> 1 || 1),
            (l = l >> 1 || 1),
            (d = (c + s - 1) & ~(s - 1)),
            (p = (l + a - 1) & ~(a - 1)),
            (_ = d * p * Or[i]);
        return u;
      }),
      r
    );
  })(Kd),
  Jd = (function () {
    function t() {}
    return (
      (t.use = function (r, e) {
        var i = r.data,
          n = this;
        if (r.type === st.TYPE.JSON && i && i.cacheID && i.textures) {
          for (
            var s = i.textures, a = void 0, o = void 0, h = 0, u = s.length;
            h < u;
            h++
          ) {
            var f = s[h],
              c = f.src,
              l = f.format;
            if ((l || (o = c), t.textureFormats[l])) {
              a = c;
              break;
            }
          }
          if (((a = a || o), !a)) {
            e(
              new Error(
                "Cannot load compressed-textures in " +
                  r.url +
                  ", make sure you provide a fallback"
              )
            );
            return;
          }
          if (a === r.url) {
            e(
              new Error(
                "URL of compressed texture cannot be the same as the manifest's URL"
              )
            );
            return;
          }
          var d = {
              crossOrigin: r.crossOrigin,
              metadata: r.metadata.imageMetadata,
              parentResource: r,
            },
            p = me.resolve(r.url.replace(n.baseUrl, ""), a),
            _ = i.cacheID;
          n.add(_, p, d, function (v) {
            if (v.error) {
              e(v.error);
              return;
            }
            var m = v.texture,
              g = m === void 0 ? null : m,
              T = v.textures,
              I = T === void 0 ? {} : T;
            Object.assign(r, { texture: g, textures: I }), e();
          });
        } else e();
      }),
      (t.add = function () {
        var r = document.createElement("canvas"),
          e = r.getContext("webgl");
        if (!e) {
          console.warn(
            "WebGL not available for compressed textures. Silently failing."
          );
          return;
        }
        var i = {
          s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
          s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
          etc: e.getExtension("WEBGL_compressed_texture_etc"),
          etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
          pvrtc:
            e.getExtension("WEBGL_compressed_texture_pvrtc") ||
            e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
          atc: e.getExtension("WEBGL_compressed_texture_atc"),
          astc: e.getExtension("WEBGL_compressed_texture_astc"),
        };
        (t.textureExtensions = i), (t.textureFormats = {});
        for (var n in i) {
          var s = i[n];
          !s || Object.assign(t.textureFormats, Object.getPrototypeOf(s));
        }
      }),
      t
    );
  })();
function Za(t, r, e) {
  var i = { textures: {}, texture: null };
  if (!r) return i;
  var n = r.map(function (s) {
    return new B(
      new W(
        s,
        Object.assign(
          { mipmap: zt.OFF, alphaMode: Ot.NO_PREMULTIPLIED_ALPHA },
          e
        )
      )
    );
  });
  return (
    n.forEach(function (s, a) {
      var o = s.baseTexture,
        h = t + "-" + (a + 1);
      W.addToCache(o, h),
        B.addToCache(s, h),
        a === 0 && (W.addToCache(o, t), B.addToCache(s, t), (i.texture = s)),
        (i.textures[h] = s);
    }),
    i
  );
}
var Ye, Rt;
st.setExtensionXhrType("dds", st.XHR_RESPONSE_TYPE.BUFFER);
var qi = 4,
  Sr = 124,
  Qd = 32,
  Ka = 20,
  tp = 542327876,
  Ur = {
    SIZE: 1,
    FLAGS: 2,
    HEIGHT: 3,
    WIDTH: 4,
    MIPMAP_COUNT: 7,
    PIXEL_FORMAT: 19,
  },
  ep = {
    SIZE: 0,
    FLAGS: 1,
    FOURCC: 2,
    RGB_BITCOUNT: 3,
    R_BIT_MASK: 4,
    G_BIT_MASK: 5,
    B_BIT_MASK: 6,
    A_BIT_MASK: 7,
  },
  Fr = {
    DXGI_FORMAT: 0,
    RESOURCE_DIMENSION: 1,
    MISC_FLAG: 2,
    ARRAY_SIZE: 3,
    MISC_FLAGS2: 4,
  },
  wt;
(function (t) {
  (t[(t.DXGI_FORMAT_UNKNOWN = 0)] = "DXGI_FORMAT_UNKNOWN"),
    (t[(t.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1)] =
      "DXGI_FORMAT_R32G32B32A32_TYPELESS"),
    (t[(t.DXGI_FORMAT_R32G32B32A32_FLOAT = 2)] =
      "DXGI_FORMAT_R32G32B32A32_FLOAT"),
    (t[(t.DXGI_FORMAT_R32G32B32A32_UINT = 3)] =
      "DXGI_FORMAT_R32G32B32A32_UINT"),
    (t[(t.DXGI_FORMAT_R32G32B32A32_SINT = 4)] =
      "DXGI_FORMAT_R32G32B32A32_SINT"),
    (t[(t.DXGI_FORMAT_R32G32B32_TYPELESS = 5)] =
      "DXGI_FORMAT_R32G32B32_TYPELESS"),
    (t[(t.DXGI_FORMAT_R32G32B32_FLOAT = 6)] = "DXGI_FORMAT_R32G32B32_FLOAT"),
    (t[(t.DXGI_FORMAT_R32G32B32_UINT = 7)] = "DXGI_FORMAT_R32G32B32_UINT"),
    (t[(t.DXGI_FORMAT_R32G32B32_SINT = 8)] = "DXGI_FORMAT_R32G32B32_SINT"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9)] =
      "DXGI_FORMAT_R16G16B16A16_TYPELESS"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_FLOAT = 10)] =
      "DXGI_FORMAT_R16G16B16A16_FLOAT"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_UNORM = 11)] =
      "DXGI_FORMAT_R16G16B16A16_UNORM"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_UINT = 12)] =
      "DXGI_FORMAT_R16G16B16A16_UINT"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_SNORM = 13)] =
      "DXGI_FORMAT_R16G16B16A16_SNORM"),
    (t[(t.DXGI_FORMAT_R16G16B16A16_SINT = 14)] =
      "DXGI_FORMAT_R16G16B16A16_SINT"),
    (t[(t.DXGI_FORMAT_R32G32_TYPELESS = 15)] = "DXGI_FORMAT_R32G32_TYPELESS"),
    (t[(t.DXGI_FORMAT_R32G32_FLOAT = 16)] = "DXGI_FORMAT_R32G32_FLOAT"),
    (t[(t.DXGI_FORMAT_R32G32_UINT = 17)] = "DXGI_FORMAT_R32G32_UINT"),
    (t[(t.DXGI_FORMAT_R32G32_SINT = 18)] = "DXGI_FORMAT_R32G32_SINT"),
    (t[(t.DXGI_FORMAT_R32G8X24_TYPELESS = 19)] =
      "DXGI_FORMAT_R32G8X24_TYPELESS"),
    (t[(t.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20)] =
      "DXGI_FORMAT_D32_FLOAT_S8X24_UINT"),
    (t[(t.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21)] =
      "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS"),
    (t[(t.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22)] =
      "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT"),
    (t[(t.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23)] =
      "DXGI_FORMAT_R10G10B10A2_TYPELESS"),
    (t[(t.DXGI_FORMAT_R10G10B10A2_UNORM = 24)] =
      "DXGI_FORMAT_R10G10B10A2_UNORM"),
    (t[(t.DXGI_FORMAT_R10G10B10A2_UINT = 25)] = "DXGI_FORMAT_R10G10B10A2_UINT"),
    (t[(t.DXGI_FORMAT_R11G11B10_FLOAT = 26)] = "DXGI_FORMAT_R11G11B10_FLOAT"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27)] =
      "DXGI_FORMAT_R8G8B8A8_TYPELESS"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_UNORM = 28)] = "DXGI_FORMAT_R8G8B8A8_UNORM"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29)] =
      "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_UINT = 30)] = "DXGI_FORMAT_R8G8B8A8_UINT"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_SNORM = 31)] = "DXGI_FORMAT_R8G8B8A8_SNORM"),
    (t[(t.DXGI_FORMAT_R8G8B8A8_SINT = 32)] = "DXGI_FORMAT_R8G8B8A8_SINT"),
    (t[(t.DXGI_FORMAT_R16G16_TYPELESS = 33)] = "DXGI_FORMAT_R16G16_TYPELESS"),
    (t[(t.DXGI_FORMAT_R16G16_FLOAT = 34)] = "DXGI_FORMAT_R16G16_FLOAT"),
    (t[(t.DXGI_FORMAT_R16G16_UNORM = 35)] = "DXGI_FORMAT_R16G16_UNORM"),
    (t[(t.DXGI_FORMAT_R16G16_UINT = 36)] = "DXGI_FORMAT_R16G16_UINT"),
    (t[(t.DXGI_FORMAT_R16G16_SNORM = 37)] = "DXGI_FORMAT_R16G16_SNORM"),
    (t[(t.DXGI_FORMAT_R16G16_SINT = 38)] = "DXGI_FORMAT_R16G16_SINT"),
    (t[(t.DXGI_FORMAT_R32_TYPELESS = 39)] = "DXGI_FORMAT_R32_TYPELESS"),
    (t[(t.DXGI_FORMAT_D32_FLOAT = 40)] = "DXGI_FORMAT_D32_FLOAT"),
    (t[(t.DXGI_FORMAT_R32_FLOAT = 41)] = "DXGI_FORMAT_R32_FLOAT"),
    (t[(t.DXGI_FORMAT_R32_UINT = 42)] = "DXGI_FORMAT_R32_UINT"),
    (t[(t.DXGI_FORMAT_R32_SINT = 43)] = "DXGI_FORMAT_R32_SINT"),
    (t[(t.DXGI_FORMAT_R24G8_TYPELESS = 44)] = "DXGI_FORMAT_R24G8_TYPELESS"),
    (t[(t.DXGI_FORMAT_D24_UNORM_S8_UINT = 45)] =
      "DXGI_FORMAT_D24_UNORM_S8_UINT"),
    (t[(t.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46)] =
      "DXGI_FORMAT_R24_UNORM_X8_TYPELESS"),
    (t[(t.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47)] =
      "DXGI_FORMAT_X24_TYPELESS_G8_UINT"),
    (t[(t.DXGI_FORMAT_R8G8_TYPELESS = 48)] = "DXGI_FORMAT_R8G8_TYPELESS"),
    (t[(t.DXGI_FORMAT_R8G8_UNORM = 49)] = "DXGI_FORMAT_R8G8_UNORM"),
    (t[(t.DXGI_FORMAT_R8G8_UINT = 50)] = "DXGI_FORMAT_R8G8_UINT"),
    (t[(t.DXGI_FORMAT_R8G8_SNORM = 51)] = "DXGI_FORMAT_R8G8_SNORM"),
    (t[(t.DXGI_FORMAT_R8G8_SINT = 52)] = "DXGI_FORMAT_R8G8_SINT"),
    (t[(t.DXGI_FORMAT_R16_TYPELESS = 53)] = "DXGI_FORMAT_R16_TYPELESS"),
    (t[(t.DXGI_FORMAT_R16_FLOAT = 54)] = "DXGI_FORMAT_R16_FLOAT"),
    (t[(t.DXGI_FORMAT_D16_UNORM = 55)] = "DXGI_FORMAT_D16_UNORM"),
    (t[(t.DXGI_FORMAT_R16_UNORM = 56)] = "DXGI_FORMAT_R16_UNORM"),
    (t[(t.DXGI_FORMAT_R16_UINT = 57)] = "DXGI_FORMAT_R16_UINT"),
    (t[(t.DXGI_FORMAT_R16_SNORM = 58)] = "DXGI_FORMAT_R16_SNORM"),
    (t[(t.DXGI_FORMAT_R16_SINT = 59)] = "DXGI_FORMAT_R16_SINT"),
    (t[(t.DXGI_FORMAT_R8_TYPELESS = 60)] = "DXGI_FORMAT_R8_TYPELESS"),
    (t[(t.DXGI_FORMAT_R8_UNORM = 61)] = "DXGI_FORMAT_R8_UNORM"),
    (t[(t.DXGI_FORMAT_R8_UINT = 62)] = "DXGI_FORMAT_R8_UINT"),
    (t[(t.DXGI_FORMAT_R8_SNORM = 63)] = "DXGI_FORMAT_R8_SNORM"),
    (t[(t.DXGI_FORMAT_R8_SINT = 64)] = "DXGI_FORMAT_R8_SINT"),
    (t[(t.DXGI_FORMAT_A8_UNORM = 65)] = "DXGI_FORMAT_A8_UNORM"),
    (t[(t.DXGI_FORMAT_R1_UNORM = 66)] = "DXGI_FORMAT_R1_UNORM"),
    (t[(t.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67)] =
      "DXGI_FORMAT_R9G9B9E5_SHAREDEXP"),
    (t[(t.DXGI_FORMAT_R8G8_B8G8_UNORM = 68)] = "DXGI_FORMAT_R8G8_B8G8_UNORM"),
    (t[(t.DXGI_FORMAT_G8R8_G8B8_UNORM = 69)] = "DXGI_FORMAT_G8R8_G8B8_UNORM"),
    (t[(t.DXGI_FORMAT_BC1_TYPELESS = 70)] = "DXGI_FORMAT_BC1_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC1_UNORM = 71)] = "DXGI_FORMAT_BC1_UNORM"),
    (t[(t.DXGI_FORMAT_BC1_UNORM_SRGB = 72)] = "DXGI_FORMAT_BC1_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_BC2_TYPELESS = 73)] = "DXGI_FORMAT_BC2_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC2_UNORM = 74)] = "DXGI_FORMAT_BC2_UNORM"),
    (t[(t.DXGI_FORMAT_BC2_UNORM_SRGB = 75)] = "DXGI_FORMAT_BC2_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_BC3_TYPELESS = 76)] = "DXGI_FORMAT_BC3_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC3_UNORM = 77)] = "DXGI_FORMAT_BC3_UNORM"),
    (t[(t.DXGI_FORMAT_BC3_UNORM_SRGB = 78)] = "DXGI_FORMAT_BC3_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_BC4_TYPELESS = 79)] = "DXGI_FORMAT_BC4_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC4_UNORM = 80)] = "DXGI_FORMAT_BC4_UNORM"),
    (t[(t.DXGI_FORMAT_BC4_SNORM = 81)] = "DXGI_FORMAT_BC4_SNORM"),
    (t[(t.DXGI_FORMAT_BC5_TYPELESS = 82)] = "DXGI_FORMAT_BC5_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC5_UNORM = 83)] = "DXGI_FORMAT_BC5_UNORM"),
    (t[(t.DXGI_FORMAT_BC5_SNORM = 84)] = "DXGI_FORMAT_BC5_SNORM"),
    (t[(t.DXGI_FORMAT_B5G6R5_UNORM = 85)] = "DXGI_FORMAT_B5G6R5_UNORM"),
    (t[(t.DXGI_FORMAT_B5G5R5A1_UNORM = 86)] = "DXGI_FORMAT_B5G5R5A1_UNORM"),
    (t[(t.DXGI_FORMAT_B8G8R8A8_UNORM = 87)] = "DXGI_FORMAT_B8G8R8A8_UNORM"),
    (t[(t.DXGI_FORMAT_B8G8R8X8_UNORM = 88)] = "DXGI_FORMAT_B8G8R8X8_UNORM"),
    (t[(t.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89)] =
      "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM"),
    (t[(t.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90)] =
      "DXGI_FORMAT_B8G8R8A8_TYPELESS"),
    (t[(t.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91)] =
      "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92)] =
      "DXGI_FORMAT_B8G8R8X8_TYPELESS"),
    (t[(t.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93)] =
      "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_BC6H_TYPELESS = 94)] = "DXGI_FORMAT_BC6H_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC6H_UF16 = 95)] = "DXGI_FORMAT_BC6H_UF16"),
    (t[(t.DXGI_FORMAT_BC6H_SF16 = 96)] = "DXGI_FORMAT_BC6H_SF16"),
    (t[(t.DXGI_FORMAT_BC7_TYPELESS = 97)] = "DXGI_FORMAT_BC7_TYPELESS"),
    (t[(t.DXGI_FORMAT_BC7_UNORM = 98)] = "DXGI_FORMAT_BC7_UNORM"),
    (t[(t.DXGI_FORMAT_BC7_UNORM_SRGB = 99)] = "DXGI_FORMAT_BC7_UNORM_SRGB"),
    (t[(t.DXGI_FORMAT_AYUV = 100)] = "DXGI_FORMAT_AYUV"),
    (t[(t.DXGI_FORMAT_Y410 = 101)] = "DXGI_FORMAT_Y410"),
    (t[(t.DXGI_FORMAT_Y416 = 102)] = "DXGI_FORMAT_Y416"),
    (t[(t.DXGI_FORMAT_NV12 = 103)] = "DXGI_FORMAT_NV12"),
    (t[(t.DXGI_FORMAT_P010 = 104)] = "DXGI_FORMAT_P010"),
    (t[(t.DXGI_FORMAT_P016 = 105)] = "DXGI_FORMAT_P016"),
    (t[(t.DXGI_FORMAT_420_OPAQUE = 106)] = "DXGI_FORMAT_420_OPAQUE"),
    (t[(t.DXGI_FORMAT_YUY2 = 107)] = "DXGI_FORMAT_YUY2"),
    (t[(t.DXGI_FORMAT_Y210 = 108)] = "DXGI_FORMAT_Y210"),
    (t[(t.DXGI_FORMAT_Y216 = 109)] = "DXGI_FORMAT_Y216"),
    (t[(t.DXGI_FORMAT_NV11 = 110)] = "DXGI_FORMAT_NV11"),
    (t[(t.DXGI_FORMAT_AI44 = 111)] = "DXGI_FORMAT_AI44"),
    (t[(t.DXGI_FORMAT_IA44 = 112)] = "DXGI_FORMAT_IA44"),
    (t[(t.DXGI_FORMAT_P8 = 113)] = "DXGI_FORMAT_P8"),
    (t[(t.DXGI_FORMAT_A8P8 = 114)] = "DXGI_FORMAT_A8P8"),
    (t[(t.DXGI_FORMAT_B4G4R4A4_UNORM = 115)] = "DXGI_FORMAT_B4G4R4A4_UNORM"),
    (t[(t.DXGI_FORMAT_P208 = 116)] = "DXGI_FORMAT_P208"),
    (t[(t.DXGI_FORMAT_V208 = 117)] = "DXGI_FORMAT_V208"),
    (t[(t.DXGI_FORMAT_V408 = 118)] = "DXGI_FORMAT_V408"),
    (t[(t.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119)] =
      "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE"),
    (t[(t.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120)] =
      "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE"),
    (t[(t.DXGI_FORMAT_FORCE_UINT = 121)] = "DXGI_FORMAT_FORCE_UINT");
})(wt || (wt = {}));
var Zi;
(function (t) {
  (t[(t.DDS_DIMENSION_TEXTURE1D = 2)] = "DDS_DIMENSION_TEXTURE1D"),
    (t[(t.DDS_DIMENSION_TEXTURE2D = 3)] = "DDS_DIMENSION_TEXTURE2D"),
    (t[(t.DDS_DIMENSION_TEXTURE3D = 6)] = "DDS_DIMENSION_TEXTURE3D");
})(Zi || (Zi = {}));
var rp = 1,
  ip = 2,
  np = 4,
  sp = 64,
  ap = 512,
  op = 131072,
  hp = 827611204,
  up = 861165636,
  fp = 894720068,
  lp = 808540228,
  cp = 4,
  dp =
    ((Ye = {}),
    (Ye[hp] = D.COMPRESSED_RGBA_S3TC_DXT1_EXT),
    (Ye[up] = D.COMPRESSED_RGBA_S3TC_DXT3_EXT),
    (Ye[fp] = D.COMPRESSED_RGBA_S3TC_DXT5_EXT),
    Ye),
  pp =
    ((Rt = {}),
    (Rt[wt.DXGI_FORMAT_BC1_TYPELESS] = D.COMPRESSED_RGBA_S3TC_DXT1_EXT),
    (Rt[wt.DXGI_FORMAT_BC1_UNORM] = D.COMPRESSED_RGBA_S3TC_DXT1_EXT),
    (Rt[wt.DXGI_FORMAT_BC2_TYPELESS] = D.COMPRESSED_RGBA_S3TC_DXT3_EXT),
    (Rt[wt.DXGI_FORMAT_BC2_UNORM] = D.COMPRESSED_RGBA_S3TC_DXT3_EXT),
    (Rt[wt.DXGI_FORMAT_BC3_TYPELESS] = D.COMPRESSED_RGBA_S3TC_DXT5_EXT),
    (Rt[wt.DXGI_FORMAT_BC3_UNORM] = D.COMPRESSED_RGBA_S3TC_DXT5_EXT),
    (Rt[wt.DXGI_FORMAT_BC1_UNORM_SRGB] = D.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT),
    (Rt[wt.DXGI_FORMAT_BC2_UNORM_SRGB] = D.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT),
    (Rt[wt.DXGI_FORMAT_BC3_UNORM_SRGB] = D.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT),
    Rt),
  vp = (function () {
    function t() {}
    return (
      (t.use = function (r, e) {
        if (r.extension === "dds" && r.data)
          try {
            Object.assign(r, Za(r.name || r.url, t.parse(r.data), r.metadata));
          } catch (i) {
            e(i);
            return;
          }
        e();
      }),
      (t.parse = function (r) {
        var e = new Uint32Array(r),
          i = e[0];
        if (i !== tp) throw new Error("Invalid DDS file magic word");
        var n = new Uint32Array(r, 0, Sr / Uint32Array.BYTES_PER_ELEMENT),
          s = n[Ur.HEIGHT],
          a = n[Ur.WIDTH],
          o = n[Ur.MIPMAP_COUNT],
          h = new Uint32Array(
            r,
            Ur.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT,
            Qd / Uint32Array.BYTES_PER_ELEMENT
          ),
          u = h[rp];
        if (u & np) {
          var f = h[ep.FOURCC];
          if (f !== lp) {
            var c = dp[f],
              l = qi + Sr,
              d = new Uint8Array(r, l),
              p = new $i(d, { format: c, width: a, height: s, levels: o });
            return [p];
          }
          var _ = qi + Sr,
            v = new Uint32Array(
              e.buffer,
              _,
              Ka / Uint32Array.BYTES_PER_ELEMENT
            ),
            m = v[Fr.DXGI_FORMAT],
            g = v[Fr.RESOURCE_DIMENSION],
            T = v[Fr.MISC_FLAG],
            I = v[Fr.ARRAY_SIZE],
            x = pp[m];
          if (x === void 0)
            throw new Error(
              "DDSLoader cannot parse texture data with DXGI format " + m
            );
          if (T === cp)
            throw new Error("DDSLoader does not support cubemap textures");
          if (g === Zi.DDS_DIMENSION_TEXTURE3D)
            throw new Error("DDSLoader does not supported 3D texture data");
          var y = new Array(),
            C = qi + Sr + Ka;
          if (I === 1) y.push(new Uint8Array(r, C));
          else {
            for (var N = Or[x], b = 0, R = a, F = s, O = 0; O < o; O++) {
              var k = Math.max(1, (R + 3) & ~3),
                Q = Math.max(1, (F + 3) & ~3),
                A = k * Q * N;
              (b += A), (R = R >>> 1), (F = F >>> 1);
            }
            for (var P = C, O = 0; O < I; O++)
              y.push(new Uint8Array(r, P, b)), (P += b);
          }
          return y.map(function (X) {
            return new $i(X, { format: x, width: a, height: s, levels: o });
          });
        }
        throw u & sp
          ? new Error("DDSLoader does not support uncompressed texture data.")
          : u & ap
          ? new Error(
              "DDSLoader does not supported YUV uncompressed texture data."
            )
          : u & op
          ? new Error(
              "DDSLoader does not support single-channel (lumninance) texture data!"
            )
          : u & ip
          ? new Error(
              "DDSLoader does not support single-channel (alpha) texture data!"
            )
          : new Error(
              "DDSLoader failed to load a texture file due to an unknown reason!"
            );
      }),
      t
    );
  })(),
  Ie,
  le,
  $e;
st.setExtensionXhrType("ktx", st.XHR_RESPONSE_TYPE.BUFFER);
var Ja = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10],
  _p = 67305985,
  Ct = {
    FILE_IDENTIFIER: 0,
    ENDIANNESS: 12,
    GL_TYPE: 16,
    GL_TYPE_SIZE: 20,
    GL_FORMAT: 24,
    GL_INTERNAL_FORMAT: 28,
    GL_BASE_INTERNAL_FORMAT: 32,
    PIXEL_WIDTH: 36,
    PIXEL_HEIGHT: 40,
    PIXEL_DEPTH: 44,
    NUMBER_OF_ARRAY_ELEMENTS: 48,
    NUMBER_OF_FACES: 52,
    NUMBER_OF_MIPMAP_LEVELS: 56,
    BYTES_OF_KEY_VALUE_DATA: 60,
  },
  mp = 64,
  Qa =
    ((Ie = {}),
    (Ie[G.UNSIGNED_BYTE] = 1),
    (Ie[G.UNSIGNED_SHORT] = 2),
    (Ie[G.FLOAT] = 4),
    (Ie[G.HALF_FLOAT] = 8),
    Ie),
  yp =
    ((le = {}),
    (le[w.RGBA] = 4),
    (le[w.RGB] = 3),
    (le[w.LUMINANCE] = 1),
    (le[w.LUMINANCE_ALPHA] = 2),
    (le[w.ALPHA] = 1),
    le),
  gp =
    (($e = {}),
    ($e[G.UNSIGNED_SHORT_4_4_4_4] = 2),
    ($e[G.UNSIGNED_SHORT_5_5_5_1] = 2),
    ($e[G.UNSIGNED_SHORT_5_6_5] = 2),
    $e),
  xp = (function () {
    function t() {}
    return (
      (t.use = function (r, e) {
        if (r.extension === "ktx" && r.data)
          try {
            var i = r.name || r.url;
            Object.assign(r, Za(i, t.parse(i, r.data), r.metadata));
          } catch (n) {
            e(n);
            return;
          }
        e();
      }),
      (t.parse = function (r, e) {
        var i = new DataView(e);
        if (!t.validate(r, i)) return null;
        var n = i.getUint32(Ct.ENDIANNESS, !0) === _p,
          s = i.getUint32(Ct.GL_TYPE, n),
          a = i.getUint32(Ct.GL_FORMAT, n),
          o = i.getUint32(Ct.GL_INTERNAL_FORMAT, n),
          h = i.getUint32(Ct.PIXEL_WIDTH, n),
          u = i.getUint32(Ct.PIXEL_HEIGHT, n) || 1,
          f = i.getUint32(Ct.PIXEL_DEPTH, n) || 1,
          c = i.getUint32(Ct.NUMBER_OF_ARRAY_ELEMENTS, n) || 1,
          l = i.getUint32(Ct.NUMBER_OF_FACES, n),
          d = i.getUint32(Ct.NUMBER_OF_MIPMAP_LEVELS, n),
          p = i.getUint32(Ct.BYTES_OF_KEY_VALUE_DATA, n);
        if (u === 0 || f !== 1)
          throw new Error("Only 2D textures are supported");
        if (l !== 1)
          throw new Error("CubeTextures are not supported by KTXLoader yet!");
        if (c !== 1) throw new Error("WebGL does not support array textures");
        var _ = 4,
          v = 4,
          m = (h + 3) & ~3,
          g = (u + 3) & ~3,
          T = new Array(c),
          I = h * u;
        s === 0 && (I = m * g);
        var x;
        if (
          (s !== 0 ? (Qa[s] ? (x = Qa[s] * yp[a]) : (x = gp[s])) : (x = Or[o]),
          x === void 0)
        )
          throw new Error(
            "Unable to resolve the pixel format stored in the *.ktx file!"
          );
        for (
          var y = I * x, C = y, N = h, b = u, R = m, F = g, O = mp + p, k = 0;
          k < d;
          k++
        ) {
          for (var Q = i.getUint32(O, n), A = O + 4, P = 0; P < c; P++) {
            var X = T[P];
            X || (X = T[P] = new Array(d)),
              (X[k] = {
                levelID: k,
                levelWidth: d > 1 ? N : R,
                levelHeight: d > 1 ? b : F,
                levelBuffer: new Uint8Array(e, A, C),
              }),
              (A += C);
          }
          (O += Q + 4),
            (O = O % 4 != 0 ? O + 4 - (O % 4) : O),
            (N = N >> 1 || 1),
            (b = b >> 1 || 1),
            (R = (N + _ - 1) & ~(_ - 1)),
            (F = (b + v - 1) & ~(v - 1)),
            (C = R * F * x);
        }
        if (s !== 0) throw new Error("TODO: Uncompressed");
        return T.map(function (pt) {
          return new $i(null, {
            format: o,
            width: h,
            height: u,
            levels: d,
            levelBuffers: pt,
          });
        });
      }),
      (t.validate = function (r, e) {
        for (var i = 0; i < Ja.length; i++)
          if (e.getUint8(i) !== Ja[i])
            return console.error(r + " is not a valid *.ktx file!"), !1;
        return !0;
      }),
      t
    );
  })();
/*!
 * @pixi/particle-container - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/particle-container is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var Ki =
  function (t, r) {
    return (
      (Ki =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      Ki(t, r)
    );
  };
function to(t, r) {
  Ki(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
(function (t) {
  to(r, t);
  function r(e, i, n, s) {
    e === void 0 && (e = 1500),
      n === void 0 && (n = 16384),
      s === void 0 && (s = !1);
    var a = t.call(this) || this,
      o = 16384;
    return (
      n > o && (n = o),
      (a._properties = [!1, !0, !1, !1, !1]),
      (a._maxSize = e),
      (a._batchSize = n),
      (a._buffers = null),
      (a._bufferUpdateIDs = []),
      (a._updateID = 0),
      (a.interactiveChildren = !1),
      (a.blendMode = U.NORMAL),
      (a.autoResize = s),
      (a.roundPixels = !0),
      (a.baseTexture = null),
      a.setProperties(i),
      (a._tint = 0),
      (a.tintRgb = new Float32Array(4)),
      (a.tint = 16777215),
      a
    );
  }
  return (
    (r.prototype.setProperties = function (e) {
      e &&
        ((this._properties[0] =
          "vertices" in e || "scale" in e
            ? !!e.vertices || !!e.scale
            : this._properties[0]),
        (this._properties[1] =
          "position" in e ? !!e.position : this._properties[1]),
        (this._properties[2] =
          "rotation" in e ? !!e.rotation : this._properties[2]),
        (this._properties[3] = "uvs" in e ? !!e.uvs : this._properties[3]),
        (this._properties[4] =
          "tint" in e || "alpha" in e
            ? !!e.tint || !!e.alpha
            : this._properties[4]));
    }),
    (r.prototype.updateTransform = function () {
      this.displayObjectUpdateTransform();
    }),
    Object.defineProperty(r.prototype, "tint", {
      get: function () {
        return this._tint;
      },
      set: function (e) {
        (this._tint = e), ye(e, this.tintRgb);
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype.render = function (e) {
      var i = this;
      !this.visible ||
        this.worldAlpha <= 0 ||
        !this.children.length ||
        !this.renderable ||
        (this.baseTexture ||
          ((this.baseTexture = this.children[0]._texture.baseTexture),
          this.baseTexture.valid ||
            this.baseTexture.once("update", function () {
              return i.onChildrenChange(0);
            })),
        e.batch.setObjectRenderer(e.plugins.particle),
        e.plugins.particle.render(this));
    }),
    (r.prototype.onChildrenChange = function (e) {
      for (
        var i = Math.floor(e / this._batchSize);
        this._bufferUpdateIDs.length < i;

      )
        this._bufferUpdateIDs.push(0);
      this._bufferUpdateIDs[i] = ++this._updateID;
    }),
    (r.prototype.dispose = function () {
      if (this._buffers) {
        for (var e = 0; e < this._buffers.length; ++e)
          this._buffers[e].destroy();
        this._buffers = null;
      }
    }),
    (r.prototype.destroy = function (e) {
      t.prototype.destroy.call(this, e),
        this.dispose(),
        (this._properties = null),
        (this._buffers = null),
        (this._bufferUpdateIDs = null);
    }),
    r
  );
})(Ft);
var eo = (function () {
    function t(r, e, i) {
      (this.geometry = new He()),
        (this.indexBuffer = null),
        (this.size = i),
        (this.dynamicProperties = []),
        (this.staticProperties = []);
      for (var n = 0; n < r.length; ++n) {
        var s = r[n];
        (s = {
          attributeName: s.attributeName,
          size: s.size,
          uploadFunction: s.uploadFunction,
          type: s.type || G.FLOAT,
          offset: s.offset,
        }),
          e[n] ? this.dynamicProperties.push(s) : this.staticProperties.push(s);
      }
      (this.staticStride = 0),
        (this.staticBuffer = null),
        (this.staticData = null),
        (this.staticDataUint32 = null),
        (this.dynamicStride = 0),
        (this.dynamicBuffer = null),
        (this.dynamicData = null),
        (this.dynamicDataUint32 = null),
        (this._updateID = 0),
        this.initBuffers();
    }
    return (
      (t.prototype.initBuffers = function () {
        var r = this.geometry,
          e = 0;
        (this.indexBuffer = new dt(ql(this.size), !0, !0)),
          r.addIndex(this.indexBuffer),
          (this.dynamicStride = 0);
        for (var i = 0; i < this.dynamicProperties.length; ++i) {
          var n = this.dynamicProperties[i];
          (n.offset = e), (e += n.size), (this.dynamicStride += n.size);
        }
        var s = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
        (this.dynamicData = new Float32Array(s)),
          (this.dynamicDataUint32 = new Uint32Array(s)),
          (this.dynamicBuffer = new dt(this.dynamicData, !1, !1));
        var a = 0;
        this.staticStride = 0;
        for (var i = 0; i < this.staticProperties.length; ++i) {
          var n = this.staticProperties[i];
          (n.offset = a), (a += n.size), (this.staticStride += n.size);
        }
        var o = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
        (this.staticData = new Float32Array(o)),
          (this.staticDataUint32 = new Uint32Array(o)),
          (this.staticBuffer = new dt(this.staticData, !0, !1));
        for (var i = 0; i < this.dynamicProperties.length; ++i) {
          var n = this.dynamicProperties[i];
          r.addAttribute(
            n.attributeName,
            this.dynamicBuffer,
            0,
            n.type === G.UNSIGNED_BYTE,
            n.type,
            this.dynamicStride * 4,
            n.offset * 4
          );
        }
        for (var i = 0; i < this.staticProperties.length; ++i) {
          var n = this.staticProperties[i];
          r.addAttribute(
            n.attributeName,
            this.staticBuffer,
            0,
            n.type === G.UNSIGNED_BYTE,
            n.type,
            this.staticStride * 4,
            n.offset * 4
          );
        }
      }),
      (t.prototype.uploadDynamic = function (r, e, i) {
        for (var n = 0; n < this.dynamicProperties.length; n++) {
          var s = this.dynamicProperties[n];
          s.uploadFunction(
            r,
            e,
            i,
            s.type === G.UNSIGNED_BYTE
              ? this.dynamicDataUint32
              : this.dynamicData,
            this.dynamicStride,
            s.offset
          );
        }
        this.dynamicBuffer._updateID++;
      }),
      (t.prototype.uploadStatic = function (r, e, i) {
        for (var n = 0; n < this.staticProperties.length; n++) {
          var s = this.staticProperties[n];
          s.uploadFunction(
            r,
            e,
            i,
            s.type === G.UNSIGNED_BYTE
              ? this.staticDataUint32
              : this.staticData,
            this.staticStride,
            s.offset
          );
        }
        this.staticBuffer._updateID++;
      }),
      (t.prototype.destroy = function () {
        (this.indexBuffer = null),
          (this.dynamicProperties = null),
          (this.dynamicBuffer = null),
          (this.dynamicData = null),
          (this.dynamicDataUint32 = null),
          (this.staticProperties = null),
          (this.staticBuffer = null),
          (this.staticData = null),
          (this.staticDataUint32 = null),
          this.geometry.destroy();
      }),
      t
    );
  })(),
  Tp = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`,
  bp = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;

attribute vec2 aPositionCoord;
attribute float aRotation;

uniform mat3 translationMatrix;
uniform vec4 uColor;

varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void){
    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);
    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);

    vec2 v = vec2(x, y);
    v = v + aPositionCoord;

    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vColor = aColor * uColor;
}
`,
  Ep = (function (t) {
    to(r, t);
    function r(e) {
      var i = t.call(this, e) || this;
      return (
        (i.shader = null),
        (i.properties = null),
        (i.tempMatrix = new ut()),
        (i.properties = [
          {
            attributeName: "aVertexPosition",
            size: 2,
            uploadFunction: i.uploadVertices,
            offset: 0,
          },
          {
            attributeName: "aPositionCoord",
            size: 2,
            uploadFunction: i.uploadPosition,
            offset: 0,
          },
          {
            attributeName: "aRotation",
            size: 1,
            uploadFunction: i.uploadRotation,
            offset: 0,
          },
          {
            attributeName: "aTextureCoord",
            size: 2,
            uploadFunction: i.uploadUvs,
            offset: 0,
          },
          {
            attributeName: "aColor",
            size: 1,
            type: G.UNSIGNED_BYTE,
            uploadFunction: i.uploadTint,
            offset: 0,
          },
        ]),
        (i.shader = Yt.from(bp, Tp, {})),
        (i.state = he.for2d()),
        i
      );
    }
    return (
      (r.prototype.render = function (e) {
        var i = e.children,
          n = e._maxSize,
          s = e._batchSize,
          a = this.renderer,
          o = i.length;
        if (o !== 0) {
          o > n && !e.autoResize && (o = n);
          var h = e._buffers;
          h || (h = e._buffers = this.generateBuffers(e));
          var u = i[0]._texture.baseTexture;
          (this.state.blendMode = gs(e.blendMode, u.alphaMode)),
            a.state.set(this.state);
          var f = a.gl,
            c = e.worldTransform.copyTo(this.tempMatrix);
          c.prepend(a.globalUniforms.uniforms.projectionMatrix),
            (this.shader.uniforms.translationMatrix = c.toArray(!0)),
            (this.shader.uniforms.uColor = $l(
              e.tintRgb,
              e.worldAlpha,
              this.shader.uniforms.uColor,
              u.alphaMode
            )),
            (this.shader.uniforms.uSampler = u),
            this.renderer.shader.bind(this.shader);
          for (var l = !1, d = 0, p = 0; d < o; d += s, p += 1) {
            var _ = o - d;
            _ > s && (_ = s),
              p >= h.length && h.push(this._generateOneMoreBuffer(e));
            var v = h[p];
            v.uploadDynamic(i, d, _);
            var m = e._bufferUpdateIDs[p] || 0;
            (l = l || v._updateID < m),
              l && ((v._updateID = e._updateID), v.uploadStatic(i, d, _)),
              a.geometry.bind(v.geometry),
              f.drawElements(f.TRIANGLES, _ * 6, f.UNSIGNED_SHORT, 0);
          }
        }
      }),
      (r.prototype.generateBuffers = function (e) {
        for (
          var i = [],
            n = e._maxSize,
            s = e._batchSize,
            a = e._properties,
            o = 0;
          o < n;
          o += s
        )
          i.push(new eo(this.properties, a, s));
        return i;
      }),
      (r.prototype._generateOneMoreBuffer = function (e) {
        var i = e._batchSize,
          n = e._properties;
        return new eo(this.properties, n, i);
      }),
      (r.prototype.uploadVertices = function (e, i, n, s, a, o) {
        for (var h = 0, u = 0, f = 0, c = 0, l = 0; l < n; ++l) {
          var d = e[i + l],
            p = d._texture,
            _ = d.scale.x,
            v = d.scale.y,
            m = p.trim,
            g = p.orig;
          m
            ? ((u = m.x - d.anchor.x * g.width),
              (h = u + m.width),
              (c = m.y - d.anchor.y * g.height),
              (f = c + m.height))
            : ((h = g.width * (1 - d.anchor.x)),
              (u = g.width * -d.anchor.x),
              (f = g.height * (1 - d.anchor.y)),
              (c = g.height * -d.anchor.y)),
            (s[o] = u * _),
            (s[o + 1] = c * v),
            (s[o + a] = h * _),
            (s[o + a + 1] = c * v),
            (s[o + a * 2] = h * _),
            (s[o + a * 2 + 1] = f * v),
            (s[o + a * 3] = u * _),
            (s[o + a * 3 + 1] = f * v),
            (o += a * 4);
        }
      }),
      (r.prototype.uploadPosition = function (e, i, n, s, a, o) {
        for (var h = 0; h < n; h++) {
          var u = e[i + h].position;
          (s[o] = u.x),
            (s[o + 1] = u.y),
            (s[o + a] = u.x),
            (s[o + a + 1] = u.y),
            (s[o + a * 2] = u.x),
            (s[o + a * 2 + 1] = u.y),
            (s[o + a * 3] = u.x),
            (s[o + a * 3 + 1] = u.y),
            (o += a * 4);
        }
      }),
      (r.prototype.uploadRotation = function (e, i, n, s, a, o) {
        for (var h = 0; h < n; h++) {
          var u = e[i + h].rotation;
          (s[o] = u),
            (s[o + a] = u),
            (s[o + a * 2] = u),
            (s[o + a * 3] = u),
            (o += a * 4);
        }
      }),
      (r.prototype.uploadUvs = function (e, i, n, s, a, o) {
        for (var h = 0; h < n; ++h) {
          var u = e[i + h]._texture._uvs;
          u
            ? ((s[o] = u.x0),
              (s[o + 1] = u.y0),
              (s[o + a] = u.x1),
              (s[o + a + 1] = u.y1),
              (s[o + a * 2] = u.x2),
              (s[o + a * 2 + 1] = u.y2),
              (s[o + a * 3] = u.x3),
              (s[o + a * 3 + 1] = u.y3),
              (o += a * 4))
            : ((s[o] = 0),
              (s[o + 1] = 0),
              (s[o + a] = 0),
              (s[o + a + 1] = 0),
              (s[o + a * 2] = 0),
              (s[o + a * 2 + 1] = 0),
              (s[o + a * 3] = 0),
              (s[o + a * 3 + 1] = 0),
              (o += a * 4));
        }
      }),
      (r.prototype.uploadTint = function (e, i, n, s, a, o) {
        for (var h = 0; h < n; ++h) {
          var u = e[i + h],
            f = u._texture.baseTexture.alphaMode > 0,
            c = u.alpha,
            l = c < 1 && f ? ci(u._tintRGB, c) : u._tintRGB + ((c * 255) << 24);
          (s[o] = l),
            (s[o + a] = l),
            (s[o + a * 2] = l),
            (s[o + a * 3] = l),
            (o += a * 4);
        }
      }),
      (r.prototype.destroy = function () {
        t.prototype.destroy.call(this),
          this.shader && (this.shader.destroy(), (this.shader = null)),
          (this.tempMatrix = null);
      }),
      r
    );
  })(Ir);
/*!
 * @pixi/graphics - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/graphics is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Zt;
(function (t) {
  (t.MITER = "miter"), (t.BEVEL = "bevel"), (t.ROUND = "round");
})(Zt || (Zt = {}));
var Kt;
(function (t) {
  (t.BUTT = "butt"), (t.ROUND = "round"), (t.SQUARE = "square");
})(Kt || (Kt = {}));
var qe = {
    adaptive: !0,
    maxLength: 10,
    minSegments: 8,
    maxSegments: 2048,
    epsilon: 1e-4,
    _segmentsCount: function (t, r) {
      if ((r === void 0 && (r = 20), !this.adaptive || !t || isNaN(t)))
        return r;
      var e = Math.ceil(t / this.maxLength);
      return (
        e < this.minSegments
          ? (e = this.minSegments)
          : e > this.maxSegments && (e = this.maxSegments),
        e
      );
    },
  },
  ro = (function () {
    function t() {
      (this.color = 16777215),
        (this.alpha = 1),
        (this.texture = B.WHITE),
        (this.matrix = null),
        (this.visible = !1),
        this.reset();
    }
    return (
      (t.prototype.clone = function () {
        var r = new t();
        return (
          (r.color = this.color),
          (r.alpha = this.alpha),
          (r.texture = this.texture),
          (r.matrix = this.matrix),
          (r.visible = this.visible),
          r
        );
      }),
      (t.prototype.reset = function () {
        (this.color = 16777215),
          (this.alpha = 1),
          (this.texture = B.WHITE),
          (this.matrix = null),
          (this.visible = !1);
      }),
      (t.prototype.destroy = function () {
        (this.texture = null), (this.matrix = null);
      }),
      t
    );
  })();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var Ji =
  function (t, r) {
    return (
      (Ji =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      Ji(t, r)
    );
  };
function Qi(t, r) {
  Ji(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var io = {
    build: function (t) {
      t.points = t.shape.points.slice();
    },
    triangulate: function (t, r) {
      var e = t.points,
        i = t.holes,
        n = r.points,
        s = r.indices;
      if (e.length >= 6) {
        for (var a = [], o = 0; o < i.length; o++) {
          var h = i[o];
          a.push(e.length / 2), (e = e.concat(h.points));
        }
        var u = fs(e, a, 2);
        if (!u) return;
        for (var f = n.length / 2, o = 0; o < u.length; o += 3)
          s.push(u[o] + f), s.push(u[o + 1] + f), s.push(u[o + 2] + f);
        for (var o = 0; o < e.length; o++) n.push(e[o]);
      }
    },
  },
  no = {
    build: function (t) {
      var r = t.shape,
        e = t.points,
        i = r.x,
        n = r.y,
        s,
        a;
      if (((e.length = 0), t.type === ot.CIRC)) (s = r.radius), (a = r.radius);
      else {
        var o = t.shape;
        (s = o.width), (a = o.height);
      }
      if (!(s === 0 || a === 0)) {
        var h =
          Math.floor(30 * Math.sqrt(r.radius)) ||
          Math.floor(15 * Math.sqrt(s + a));
        h /= 2.3;
        for (var u = (Math.PI * 2) / h, f = 0; f < h - 0.5; f++)
          e.push(i + Math.sin(-u * f) * s, n + Math.cos(-u * f) * a);
        e.push(e[0], e[1]);
      }
    },
    triangulate: function (t, r) {
      var e = t.points,
        i = r.points,
        n = r.indices,
        s = i.length / 2,
        a = s,
        o = t.shape,
        h = t.matrix,
        u = o.x,
        f = o.y;
      i.push(
        t.matrix ? h.a * u + h.c * f + h.tx : u,
        t.matrix ? h.b * u + h.d * f + h.ty : f
      );
      for (var c = 0; c < e.length; c += 2)
        i.push(e[c], e[c + 1]), n.push(s++, a, s);
    },
  },
  Ip = {
    build: function (t) {
      var r = t.shape,
        e = r.x,
        i = r.y,
        n = r.width,
        s = r.height,
        a = t.points;
      (a.length = 0), a.push(e, i, e + n, i, e + n, i + s, e, i + s);
    },
    triangulate: function (t, r) {
      var e = t.points,
        i = r.points,
        n = i.length / 2;
      i.push(e[0], e[1], e[2], e[3], e[6], e[7], e[4], e[5]),
        r.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3);
    },
  };
function Re(t, r, e) {
  var i = r - t;
  return t + i * e;
}
function Lr(t, r, e, i, n, s, a) {
  a === void 0 && (a = []);
  for (
    var o = 20, h = a, u = 0, f = 0, c = 0, l = 0, d = 0, p = 0, _ = 0, v = 0;
    _ <= o;
    ++_
  )
    (v = _ / o),
      (u = Re(t, e, v)),
      (f = Re(r, i, v)),
      (c = Re(e, n, v)),
      (l = Re(i, s, v)),
      (d = Re(u, c, v)),
      (p = Re(f, l, v)),
      !(_ === 0 && h[h.length - 2] === d && h[h.length - 1] === p) &&
        h.push(d, p);
  return h;
}
var Rp = {
  build: function (t) {
    var r = t.shape,
      e = t.points,
      i = r.x,
      n = r.y,
      s = r.width,
      a = r.height,
      o = Math.max(0, Math.min(r.radius, Math.min(s, a) / 2));
    (e.length = 0),
      o
        ? (Lr(i, n + o, i, n, i + o, n, e),
          Lr(i + s - o, n, i + s, n, i + s, n + o, e),
          Lr(i + s, n + a - o, i + s, n + a, i + s - o, n + a, e),
          Lr(i + o, n + a, i, n + a, i, n + a - o, e))
        : e.push(i, n, i + s, n, i + s, n + a, i, n + a);
  },
  triangulate: function (t, r) {
    for (
      var e = t.points,
        i = r.points,
        n = r.indices,
        s = i.length / 2,
        a = fs(e, null, 2),
        o = 0,
        h = a.length;
      o < h;
      o += 3
    )
      n.push(a[o] + s), n.push(a[o + 1] + s), n.push(a[o + 2] + s);
    for (var o = 0, h = e.length; o < h; o++) i.push(e[o], e[++o]);
  },
};
function so(t, r, e, i, n, s, a, o) {
  var h = t - e * n,
    u = r - i * n,
    f = t + e * s,
    c = r + i * s,
    l,
    d;
  a ? ((l = i), (d = -e)) : ((l = -i), (d = e));
  var p = h + l,
    _ = u + d,
    v = f + l,
    m = c + d;
  return o.push(p, _), o.push(v, m), 2;
}
function we(t, r, e, i, n, s, a, o) {
  var h = e - t,
    u = i - r,
    f = Math.atan2(h, u),
    c = Math.atan2(n - t, s - r);
  o && f < c ? (f += Math.PI * 2) : !o && f > c && (c += Math.PI * 2);
  var l = f,
    d = c - f,
    p = Math.abs(d),
    _ = Math.sqrt(h * h + u * u),
    v = (((15 * p * Math.sqrt(_)) / Math.PI) >> 0) + 1,
    m = d / v;
  if (((l += m), o)) {
    a.push(t, r), a.push(e, i);
    for (var g = 1, T = l; g < v; g++, T += m)
      a.push(t, r), a.push(t + Math.sin(T) * _, r + Math.cos(T) * _);
    a.push(t, r), a.push(n, s);
  } else {
    a.push(e, i), a.push(t, r);
    for (var g = 1, T = l; g < v; g++, T += m)
      a.push(t + Math.sin(T) * _, r + Math.cos(T) * _), a.push(t, r);
    a.push(n, s), a.push(t, r);
  }
  return v * 2;
}
function wp(t, r) {
  var e = t.shape,
    i = t.points || e.points.slice(),
    n = r.closePointEps;
  if (i.length !== 0) {
    var s = t.lineStyle,
      a = new ht(i[0], i[1]),
      o = new ht(i[i.length - 2], i[i.length - 1]),
      h = e.type !== ot.POLY || e.closeStroke,
      u = Math.abs(a.x - o.x) < n && Math.abs(a.y - o.y) < n;
    if (h) {
      (i = i.slice()),
        u && (i.pop(), i.pop(), o.set(i[i.length - 2], i[i.length - 1]));
      var f = (a.x + o.x) * 0.5,
        c = (o.y + a.y) * 0.5;
      i.unshift(f, c), i.push(f, c);
    }
    var l = r.points,
      d = i.length / 2,
      p = i.length,
      _ = l.length / 2,
      v = s.width / 2,
      m = v * v,
      g = s.miterLimit * s.miterLimit,
      T = i[0],
      I = i[1],
      x = i[2],
      y = i[3],
      C = 0,
      N = 0,
      b = -(I - y),
      R = T - x,
      F = 0,
      O = 0,
      k = Math.sqrt(b * b + R * R);
    (b /= k), (R /= k), (b *= v), (R *= v);
    var Q = s.alignment,
      A = (1 - Q) * 2,
      P = Q * 2;
    h ||
      (s.cap === Kt.ROUND
        ? (p +=
            we(
              T - b * (A - P) * 0.5,
              I - R * (A - P) * 0.5,
              T - b * A,
              I - R * A,
              T + b * P,
              I + R * P,
              l,
              !0
            ) + 2)
        : s.cap === Kt.SQUARE && (p += so(T, I, b, R, A, P, !0, l))),
      l.push(T - b * A, I - R * A),
      l.push(T + b * P, I + R * P);
    for (var X = 1; X < d - 1; ++X) {
      (T = i[(X - 1) * 2]),
        (I = i[(X - 1) * 2 + 1]),
        (x = i[X * 2]),
        (y = i[X * 2 + 1]),
        (C = i[(X + 1) * 2]),
        (N = i[(X + 1) * 2 + 1]),
        (b = -(I - y)),
        (R = T - x),
        (k = Math.sqrt(b * b + R * R)),
        (b /= k),
        (R /= k),
        (b *= v),
        (R *= v),
        (F = -(y - N)),
        (O = x - C),
        (k = Math.sqrt(F * F + O * O)),
        (F /= k),
        (O /= k),
        (F *= v),
        (O *= v);
      var pt = x - T,
        yt = I - y,
        E = x - C,
        L = N - y,
        M = yt * E - L * pt,
        j = M < 0;
      if (Math.abs(M) < 0.1) {
        l.push(x - b * A, y - R * A), l.push(x + b * P, y + R * P);
        continue;
      }
      var Z = (-b + T) * (-R + y) - (-b + x) * (-R + I),
        rt = (-F + C) * (-O + y) - (-F + x) * (-O + N),
        $ = (pt * rt - E * Z) / M,
        lt = (L * Z - yt * rt) / M,
        vt = ($ - x) * ($ - x) + (lt - y) * (lt - y),
        it = x + ($ - x) * A,
        at = y + (lt - y) * A,
        Y = x - ($ - x) * P,
        J = y - (lt - y) * P,
        H = Math.min(pt * pt + yt * yt, E * E + L * L),
        gt = j ? A : P,
        _t = H + gt * gt * m,
        V = vt <= _t;
      V
        ? s.join === Zt.BEVEL || vt / m > g
          ? (j
              ? (l.push(it, at),
                l.push(x + b * P, y + R * P),
                l.push(it, at),
                l.push(x + F * P, y + O * P))
              : (l.push(x - b * A, y - R * A),
                l.push(Y, J),
                l.push(x - F * A, y - O * A),
                l.push(Y, J)),
            (p += 2))
          : s.join === Zt.ROUND
          ? j
            ? (l.push(it, at),
              l.push(x + b * P, y + R * P),
              (p +=
                we(x, y, x + b * P, y + R * P, x + F * P, y + O * P, l, !0) +
                4),
              l.push(it, at),
              l.push(x + F * P, y + O * P))
            : (l.push(x - b * A, y - R * A),
              l.push(Y, J),
              (p +=
                we(x, y, x - b * A, y - R * A, x - F * A, y - O * A, l, !1) +
                4),
              l.push(x - F * A, y - O * A),
              l.push(Y, J))
          : (l.push(it, at), l.push(Y, J))
        : (l.push(x - b * A, y - R * A),
          l.push(x + b * P, y + R * P),
          s.join === Zt.BEVEL ||
            vt / m > g ||
            (s.join === Zt.ROUND
              ? j
                ? (p +=
                    we(
                      x,
                      y,
                      x + b * P,
                      y + R * P,
                      x + F * P,
                      y + O * P,
                      l,
                      !0
                    ) + 2)
                : (p +=
                    we(
                      x,
                      y,
                      x - b * A,
                      y - R * A,
                      x - F * A,
                      y - O * A,
                      l,
                      !1
                    ) + 2)
              : (j
                  ? (l.push(Y, J), l.push(Y, J))
                  : (l.push(it, at), l.push(it, at)),
                (p += 2))),
          l.push(x - F * A, y - O * A),
          l.push(x + F * P, y + O * P),
          (p += 2));
    }
    (T = i[(d - 2) * 2]),
      (I = i[(d - 2) * 2 + 1]),
      (x = i[(d - 1) * 2]),
      (y = i[(d - 1) * 2 + 1]),
      (b = -(I - y)),
      (R = T - x),
      (k = Math.sqrt(b * b + R * R)),
      (b /= k),
      (R /= k),
      (b *= v),
      (R *= v),
      l.push(x - b * A, y - R * A),
      l.push(x + b * P, y + R * P),
      h ||
        (s.cap === Kt.ROUND
          ? (p +=
              we(
                x - b * (A - P) * 0.5,
                y - R * (A - P) * 0.5,
                x - b * A,
                y - R * A,
                x + b * P,
                y + R * P,
                l,
                !1
              ) + 2)
          : s.cap === Kt.SQUARE && (p += so(x, y, b, R, A, P, !1, l)));
    for (
      var Pt = r.indices, de = qe.epsilon * qe.epsilon, X = _;
      X < p + _ - 2;
      ++X
    )
      (T = l[X * 2]),
        (I = l[X * 2 + 1]),
        (x = l[(X + 1) * 2]),
        (y = l[(X + 1) * 2 + 1]),
        (C = l[(X + 2) * 2]),
        (N = l[(X + 2) * 2 + 1]),
        !(Math.abs(T * (y - N) + x * (N - I) + C * (I - y)) < de) &&
          Pt.push(X, X + 1, X + 2);
  }
}
function Cp(t, r) {
  var e = 0,
    i = t.shape,
    n = t.points || i.points,
    s = i.type !== ot.POLY || i.closeStroke;
  if (n.length !== 0) {
    var a = r.points,
      o = r.indices,
      h = n.length / 2,
      u = a.length / 2,
      f = u;
    for (a.push(n[0], n[1]), e = 1; e < h; e++)
      a.push(n[e * 2], n[e * 2 + 1]), o.push(f, f + 1), f++;
    s && o.push(f, u);
  }
}
function ao(t, r) {
  t.lineStyle.native ? Cp(t, r) : wp(t, r);
}
var oo = (function () {
    function t() {}
    return (
      (t.curveTo = function (r, e, i, n, s, a) {
        var o = a[a.length - 2],
          h = a[a.length - 1],
          u = h - e,
          f = o - r,
          c = n - e,
          l = i - r,
          d = Math.abs(u * l - f * c);
        if (d < 1e-8 || s === 0)
          return (
            (a[a.length - 2] !== r || a[a.length - 1] !== e) && a.push(r, e),
            null
          );
        var p = u * u + f * f,
          _ = c * c + l * l,
          v = u * c + f * l,
          m = (s * Math.sqrt(p)) / d,
          g = (s * Math.sqrt(_)) / d,
          T = (m * v) / p,
          I = (g * v) / _,
          x = m * l + g * f,
          y = m * c + g * u,
          C = f * (g + T),
          N = u * (g + T),
          b = l * (m + I),
          R = c * (m + I),
          F = Math.atan2(N - y, C - x),
          O = Math.atan2(R - y, b - x);
        return {
          cx: x + r,
          cy: y + e,
          radius: s,
          startAngle: F,
          endAngle: O,
          anticlockwise: f * c > l * u,
        };
      }),
      (t.arc = function (r, e, i, n, s, a, o, h, u) {
        for (
          var f = o - a,
            c = qe._segmentsCount(
              Math.abs(f) * s,
              Math.ceil(Math.abs(f) / vr) * 40
            ),
            l = f / (c * 2),
            d = l * 2,
            p = Math.cos(l),
            _ = Math.sin(l),
            v = c - 1,
            m = (v % 1) / v,
            g = 0;
          g <= v;
          ++g
        ) {
          var T = g + m * g,
            I = l + a + d * T,
            x = Math.cos(I),
            y = -Math.sin(I);
          u.push((p * x + _ * y) * s + i, (p * -y + _ * x) * s + n);
        }
      }),
      t
    );
  })(),
  Pp = (function () {
    function t() {}
    return (
      (t.curveLength = function (r, e, i, n, s, a, o, h) {
        for (
          var u = 10,
            f = 0,
            c = 0,
            l = 0,
            d = 0,
            p = 0,
            _ = 0,
            v = 0,
            m = 0,
            g = 0,
            T = 0,
            I = 0,
            x = r,
            y = e,
            C = 1;
          C <= u;
          ++C
        )
          (c = C / u),
            (l = c * c),
            (d = l * c),
            (p = 1 - c),
            (_ = p * p),
            (v = _ * p),
            (m = v * r + 3 * _ * c * i + 3 * p * l * s + d * o),
            (g = v * e + 3 * _ * c * n + 3 * p * l * a + d * h),
            (T = x - m),
            (I = y - g),
            (x = m),
            (y = g),
            (f += Math.sqrt(T * T + I * I));
        return f;
      }),
      (t.curveTo = function (r, e, i, n, s, a, o) {
        var h = o[o.length - 2],
          u = o[o.length - 1];
        o.length -= 2;
        var f = qe._segmentsCount(t.curveLength(h, u, r, e, i, n, s, a)),
          c = 0,
          l = 0,
          d = 0,
          p = 0,
          _ = 0;
        o.push(h, u);
        for (var v = 1, m = 0; v <= f; ++v)
          (m = v / f),
            (c = 1 - m),
            (l = c * c),
            (d = l * c),
            (p = m * m),
            (_ = p * m),
            o.push(
              d * h + 3 * l * m * r + 3 * c * p * i + _ * s,
              d * u + 3 * l * m * e + 3 * c * p * n + _ * a
            );
      }),
      t
    );
  })(),
  Ap = (function () {
    function t() {}
    return (
      (t.curveLength = function (r, e, i, n, s, a) {
        var o = r - 2 * i + s,
          h = e - 2 * n + a,
          u = 2 * i - 2 * r,
          f = 2 * n - 2 * e,
          c = 4 * (o * o + h * h),
          l = 4 * (o * u + h * f),
          d = u * u + f * f,
          p = 2 * Math.sqrt(c + l + d),
          _ = Math.sqrt(c),
          v = 2 * c * _,
          m = 2 * Math.sqrt(d),
          g = l / _;
        return (
          (v * p +
            _ * l * (p - m) +
            (4 * d * c - l * l) * Math.log((2 * _ + g + p) / (g + m))) /
          (4 * v)
        );
      }),
      (t.curveTo = function (r, e, i, n, s) {
        for (
          var a = s[s.length - 2],
            o = s[s.length - 1],
            h = qe._segmentsCount(t.curveLength(a, o, r, e, i, n)),
            u = 0,
            f = 0,
            c = 1;
          c <= h;
          ++c
        ) {
          var l = c / h;
          (u = a + (r - a) * l),
            (f = o + (e - o) * l),
            s.push(
              u + (r + (i - r) * l - u) * l,
              f + (e + (n - e) * l - f) * l
            );
        }
      }),
      t
    );
  })(),
  Np = (function () {
    function t() {
      this.reset();
    }
    return (
      (t.prototype.begin = function (r, e, i) {
        this.reset(),
          (this.style = r),
          (this.start = e),
          (this.attribStart = i);
      }),
      (t.prototype.end = function (r, e) {
        (this.attribSize = e - this.attribStart), (this.size = r - this.start);
      }),
      (t.prototype.reset = function () {
        (this.style = null),
          (this.size = 0),
          (this.start = 0),
          (this.attribStart = 0),
          (this.attribSize = 0);
      }),
      t
    );
  })(),
  ce,
  tn =
    ((ce = {}),
    (ce[ot.POLY] = io),
    (ce[ot.CIRC] = no),
    (ce[ot.ELIP] = no),
    (ce[ot.RECT] = Ip),
    (ce[ot.RREC] = Rp),
    ce),
  ho = [],
  Gr = [];
function Op(t) {
  for (var r = t.points, e = 0, i = 0; i < r.length - 2; i += 2)
    e += (r[i + 2] - r[i]) * (r[i + 3] + r[i + 1]);
  return e > 0;
}
var uo = (function () {
    function t(r, e, i, n) {
      e === void 0 && (e = null),
        i === void 0 && (i = null),
        n === void 0 && (n = null),
        (this.points = []),
        (this.holes = []),
        (this.shape = r),
        (this.lineStyle = i),
        (this.fillStyle = e),
        (this.matrix = n),
        (this.type = r.type);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.shape, this.fillStyle, this.lineStyle, this.matrix);
      }),
      (t.prototype.destroy = function () {
        (this.shape = null),
          (this.holes.length = 0),
          (this.holes = null),
          (this.points.length = 0),
          (this.points = null),
          (this.lineStyle = null),
          (this.fillStyle = null);
      }),
      t
    );
  })(),
  Ce = new ht(),
  Sp = new ke(),
  Up = (function (t) {
    Qi(r, t);
    function r() {
      var e = t.call(this) || this;
      return (
        (e.closePointEps = 1e-4),
        (e.boundsPadding = 0),
        (e.uvsFloat32 = null),
        (e.indicesUint16 = null),
        (e.batchable = !1),
        (e.points = []),
        (e.colors = []),
        (e.uvs = []),
        (e.indices = []),
        (e.textureIds = []),
        (e.graphicsData = []),
        (e.drawCalls = []),
        (e.batchDirty = -1),
        (e.batches = []),
        (e.dirty = 0),
        (e.cacheDirty = -1),
        (e.clearDirty = 0),
        (e.shapeIndex = 0),
        (e._bounds = new ke()),
        (e.boundsDirty = -1),
        e
      );
    }
    return (
      Object.defineProperty(r.prototype, "bounds", {
        get: function () {
          return (
            this.boundsDirty !== this.dirty &&
              ((this.boundsDirty = this.dirty), this.calculateBounds()),
            this._bounds
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.invalidate = function () {
        (this.boundsDirty = -1),
          this.dirty++,
          this.batchDirty++,
          (this.shapeIndex = 0),
          (this.points.length = 0),
          (this.colors.length = 0),
          (this.uvs.length = 0),
          (this.indices.length = 0),
          (this.textureIds.length = 0);
        for (var e = 0; e < this.drawCalls.length; e++)
          this.drawCalls[e].texArray.clear(), Gr.push(this.drawCalls[e]);
        this.drawCalls.length = 0;
        for (var e = 0; e < this.batches.length; e++) {
          var i = this.batches[e];
          i.reset(), ho.push(i);
        }
        this.batches.length = 0;
      }),
      (r.prototype.clear = function () {
        return (
          this.graphicsData.length > 0 &&
            (this.invalidate(),
            this.clearDirty++,
            (this.graphicsData.length = 0)),
          this
        );
      }),
      (r.prototype.drawShape = function (e, i, n, s) {
        i === void 0 && (i = null),
          n === void 0 && (n = null),
          s === void 0 && (s = null);
        var a = new uo(e, i, n, s);
        return this.graphicsData.push(a), this.dirty++, this;
      }),
      (r.prototype.drawHole = function (e, i) {
        if ((i === void 0 && (i = null), !this.graphicsData.length))
          return null;
        var n = new uo(e, null, null, i),
          s = this.graphicsData[this.graphicsData.length - 1];
        return (n.lineStyle = s.lineStyle), s.holes.push(n), this.dirty++, this;
      }),
      (r.prototype.destroy = function () {
        t.prototype.destroy.call(this);
        for (var e = 0; e < this.graphicsData.length; ++e)
          this.graphicsData[e].destroy();
        (this.points.length = 0),
          (this.points = null),
          (this.colors.length = 0),
          (this.colors = null),
          (this.uvs.length = 0),
          (this.uvs = null),
          (this.indices.length = 0),
          (this.indices = null),
          this.indexBuffer.destroy(),
          (this.indexBuffer = null),
          (this.graphicsData.length = 0),
          (this.graphicsData = null),
          (this.drawCalls.length = 0),
          (this.drawCalls = null),
          (this.batches.length = 0),
          (this.batches = null),
          (this._bounds = null);
      }),
      (r.prototype.containsPoint = function (e) {
        for (var i = this.graphicsData, n = 0; n < i.length; ++n) {
          var s = i[n];
          if (
            !!s.fillStyle.visible &&
            s.shape &&
            (s.matrix ? s.matrix.applyInverse(e, Ce) : Ce.copyFrom(e),
            s.shape.contains(Ce.x, Ce.y))
          ) {
            var a = !1;
            if (s.holes)
              for (var o = 0; o < s.holes.length; o++) {
                var h = s.holes[o];
                if (h.shape.contains(Ce.x, Ce.y)) {
                  a = !0;
                  break;
                }
              }
            if (!a) return !0;
          }
        }
        return !1;
      }),
      (r.prototype.updateBatches = function (e) {
        if (!this.graphicsData.length) {
          this.batchable = !0;
          return;
        }
        if (!!this.validateBatching()) {
          this.cacheDirty = this.dirty;
          var i = this.uvs,
            n = this.graphicsData,
            s = null,
            a = null;
          this.batches.length > 0 &&
            ((s = this.batches[this.batches.length - 1]), (a = s.style));
          for (var o = this.shapeIndex; o < n.length; o++) {
            this.shapeIndex++;
            var h = n[o],
              u = h.fillStyle,
              f = h.lineStyle,
              c = tn[h.type];
            c.build(h), h.matrix && this.transformPoints(h.points, h.matrix);
            for (var l = 0; l < 2; l++) {
              var d = l === 0 ? u : f;
              if (!!d.visible) {
                var p = d.texture.baseTexture,
                  _ = this.indices.length,
                  v = this.points.length / 2;
                (p.wrapMode = Dt.REPEAT),
                  l === 0 ? this.processFill(h) : this.processLine(h);
                var m = this.points.length / 2 - v;
                m !== 0 &&
                  (s && !this._compareStyles(a, d) && (s.end(_, v), (s = null)),
                  s ||
                    ((s = ho.pop() || new Np()),
                    s.begin(d, _, v),
                    this.batches.push(s),
                    (a = d)),
                  this.addUvs(this.points, i, d.texture, v, m, d.matrix));
              }
            }
          }
          var g = this.indices.length,
            T = this.points.length / 2;
          if ((s && s.end(g, T), this.batches.length === 0)) {
            this.batchable = !0;
            return;
          }
          if (
            this.indicesUint16 &&
            this.indices.length === this.indicesUint16.length
          )
            this.indicesUint16.set(this.indices);
          else {
            var I = T > 65535 && e;
            this.indicesUint16 = I
              ? new Uint32Array(this.indices)
              : new Uint16Array(this.indices);
          }
          (this.batchable = this.isBatchable()),
            this.batchable ? this.packBatches() : this.buildDrawCalls();
        }
      }),
      (r.prototype._compareStyles = function (e, i) {
        return !(
          !e ||
          !i ||
          e.texture.baseTexture !== i.texture.baseTexture ||
          e.color + e.alpha !== i.color + i.alpha ||
          !!e.native != !!i.native
        );
      }),
      (r.prototype.validateBatching = function () {
        if (this.dirty === this.cacheDirty || !this.graphicsData.length)
          return !1;
        for (var e = 0, i = this.graphicsData.length; e < i; e++) {
          var n = this.graphicsData[e],
            s = n.fillStyle,
            a = n.lineStyle;
          if (
            (s && !s.texture.baseTexture.valid) ||
            (a && !a.texture.baseTexture.valid)
          )
            return !1;
        }
        return !0;
      }),
      (r.prototype.packBatches = function () {
        this.batchDirty++, (this.uvsFloat32 = new Float32Array(this.uvs));
        for (var e = this.batches, i = 0, n = e.length; i < n; i++)
          for (var s = e[i], a = 0; a < s.size; a++) {
            var o = s.start + a;
            this.indicesUint16[o] = this.indicesUint16[o] - s.attribStart;
          }
      }),
      (r.prototype.isBatchable = function () {
        if (this.points.length > 65535 * 2) return !1;
        for (var e = this.batches, i = 0; i < e.length; i++)
          if (e[i].style.native) return !1;
        return this.points.length < r.BATCHABLE_SIZE * 2;
      }),
      (r.prototype.buildDrawCalls = function () {
        for (var e = ++W._globalBatch, i = 0; i < this.drawCalls.length; i++)
          this.drawCalls[i].texArray.clear(), Gr.push(this.drawCalls[i]);
        this.drawCalls.length = 0;
        var n = this.colors,
          s = this.textureIds,
          a = Gr.pop();
        a || ((a = new Di()), (a.texArray = new ki())),
          (a.texArray.count = 0),
          (a.start = 0),
          (a.size = 0),
          (a.type = It.TRIANGLES);
        var o = 0,
          h = null,
          u = 0,
          f = !1,
          c = It.TRIANGLES,
          l = 0;
        this.drawCalls.push(a);
        for (var i = 0; i < this.batches.length; i++) {
          var d = this.batches[i],
            p = 8,
            _ = d.style,
            v = _.texture.baseTexture;
          f !== !!_.native &&
            ((f = !!_.native),
            (c = f ? It.LINES : It.TRIANGLES),
            (h = null),
            (o = p),
            e++),
            h !== v &&
              ((h = v),
              v._batchEnabled !== e &&
                (o === p &&
                  (e++,
                  (o = 0),
                  a.size > 0 &&
                    ((a = Gr.pop()),
                    a || ((a = new Di()), (a.texArray = new ki())),
                    this.drawCalls.push(a)),
                  (a.start = l),
                  (a.size = 0),
                  (a.texArray.count = 0),
                  (a.type = c)),
                (v.touched = 1),
                (v._batchEnabled = e),
                (v._batchLocation = o),
                (v.wrapMode = Dt.REPEAT),
                (a.texArray.elements[a.texArray.count++] = v),
                o++)),
            (a.size += d.size),
            (l += d.size),
            (u = v._batchLocation),
            this.addColors(n, _.color, _.alpha, d.attribSize, d.attribStart),
            this.addTextureIds(s, u, d.attribSize, d.attribStart);
        }
        (W._globalBatch = e), this.packAttributes();
      }),
      (r.prototype.packAttributes = function () {
        for (
          var e = this.points,
            i = this.uvs,
            n = this.colors,
            s = this.textureIds,
            a = new ArrayBuffer(e.length * 3 * 4),
            o = new Float32Array(a),
            h = new Uint32Array(a),
            u = 0,
            f = 0;
          f < e.length / 2;
          f++
        )
          (o[u++] = e[f * 2]),
            (o[u++] = e[f * 2 + 1]),
            (o[u++] = i[f * 2]),
            (o[u++] = i[f * 2 + 1]),
            (h[u++] = n[f]),
            (o[u++] = s[f]);
        this._buffer.update(a), this._indexBuffer.update(this.indicesUint16);
      }),
      (r.prototype.processFill = function (e) {
        if (e.holes.length) this.processHoles(e.holes), io.triangulate(e, this);
        else {
          var i = tn[e.type];
          i.triangulate(e, this);
        }
      }),
      (r.prototype.processLine = function (e) {
        ao(e, this);
        for (var i = 0; i < e.holes.length; i++) ao(e.holes[i], this);
      }),
      (r.prototype.processHoles = function (e) {
        for (var i = 0; i < e.length; i++) {
          var n = e[i],
            s = tn[n.type];
          s.build(n), n.matrix && this.transformPoints(n.points, n.matrix);
        }
      }),
      (r.prototype.calculateBounds = function () {
        var e = this._bounds,
          i = Sp,
          n = ut.IDENTITY;
        this._bounds.clear(), i.clear();
        for (var s = 0; s < this.graphicsData.length; s++) {
          var a = this.graphicsData[s],
            o = a.shape,
            h = a.type,
            u = a.lineStyle,
            f = a.matrix || ut.IDENTITY,
            c = 0;
          if (u && u.visible) {
            var l = u.alignment;
            (c = u.width),
              h === ot.POLY
                ? Op(o)
                  ? (c = c * (1 - l))
                  : (c = c * l)
                : (c = c * Math.max(0, l));
          }
          if (
            (n !== f &&
              (i.isEmpty() || (e.addBoundsMatrix(i, n), i.clear()), (n = f)),
            h === ot.RECT || h === ot.RREC)
          ) {
            var d = o;
            i.addFramePad(d.x, d.y, d.x + d.width, d.y + d.height, c, c);
          } else if (h === ot.CIRC) {
            var p = o;
            i.addFramePad(p.x, p.y, p.x, p.y, p.radius + c, p.radius + c);
          } else if (h === ot.ELIP) {
            var _ = o;
            i.addFramePad(_.x, _.y, _.x, _.y, _.width + c, _.height + c);
          } else {
            var v = o;
            e.addVerticesMatrix(n, v.points, 0, v.points.length, c, c);
          }
        }
        i.isEmpty() || e.addBoundsMatrix(i, n),
          e.pad(this.boundsPadding, this.boundsPadding);
      }),
      (r.prototype.transformPoints = function (e, i) {
        for (var n = 0; n < e.length / 2; n++) {
          var s = e[n * 2],
            a = e[n * 2 + 1];
          (e[n * 2] = i.a * s + i.c * a + i.tx),
            (e[n * 2 + 1] = i.b * s + i.d * a + i.ty);
        }
      }),
      (r.prototype.addColors = function (e, i, n, s, a) {
        a === void 0 && (a = 0);
        var o = (i >> 16) + (i & 65280) + ((i & 255) << 16),
          h = ci(o, n);
        e.length = Math.max(e.length, a + s);
        for (var u = 0; u < s; u++) e[a + u] = h;
      }),
      (r.prototype.addTextureIds = function (e, i, n, s) {
        s === void 0 && (s = 0), (e.length = Math.max(e.length, s + n));
        for (var a = 0; a < n; a++) e[s + a] = i;
      }),
      (r.prototype.addUvs = function (e, i, n, s, a, o) {
        o === void 0 && (o = null);
        for (var h = 0, u = i.length, f = n.frame; h < a; ) {
          var c = e[(s + h) * 2],
            l = e[(s + h) * 2 + 1];
          if (o) {
            var d = o.a * c + o.c * l + o.tx;
            (l = o.b * c + o.d * l + o.ty), (c = d);
          }
          h++, i.push(c / f.width, l / f.height);
        }
        var p = n.baseTexture;
        (f.width < p.width || f.height < p.height) &&
          this.adjustUvs(i, n, u, a);
      }),
      (r.prototype.adjustUvs = function (e, i, n, s) {
        for (
          var a = i.baseTexture,
            o = 1e-6,
            h = n + s * 2,
            u = i.frame,
            f = u.width / a.width,
            c = u.height / a.height,
            l = u.x / u.width,
            d = u.y / u.height,
            p = Math.floor(e[n] + o),
            _ = Math.floor(e[n + 1] + o),
            v = n + 2;
          v < h;
          v += 2
        )
          (p = Math.min(p, Math.floor(e[v] + o))),
            (_ = Math.min(_, Math.floor(e[v + 1] + o)));
        (l -= p), (d -= _);
        for (var v = n; v < h; v += 2)
          (e[v] = (e[v] + l) * f), (e[v + 1] = (e[v + 1] + d) * c);
      }),
      (r.BATCHABLE_SIZE = 100),
      r
    );
  })(Ma),
  Fp = (function (t) {
    Qi(r, t);
    function r() {
      var e = (t !== null && t.apply(this, arguments)) || this;
      return (
        (e.width = 0),
        (e.alignment = 0.5),
        (e.native = !1),
        (e.cap = Kt.BUTT),
        (e.join = Zt.MITER),
        (e.miterLimit = 10),
        e
      );
    }
    return (
      (r.prototype.clone = function () {
        var e = new r();
        return (
          (e.color = this.color),
          (e.alpha = this.alpha),
          (e.texture = this.texture),
          (e.matrix = this.matrix),
          (e.visible = this.visible),
          (e.width = this.width),
          (e.alignment = this.alignment),
          (e.native = this.native),
          (e.cap = this.cap),
          (e.join = this.join),
          (e.miterLimit = this.miterLimit),
          e
        );
      }),
      (r.prototype.reset = function () {
        t.prototype.reset.call(this),
          (this.color = 0),
          (this.alignment = 0.5),
          (this.width = 0),
          (this.native = !1);
      }),
      r
    );
  })(ro),
  Lp = new Float32Array(3),
  en = {},
  fo = (function (t) {
    Qi(r, t);
    function r(e) {
      e === void 0 && (e = null);
      var i = t.call(this) || this;
      return (
        (i.shader = null),
        (i.pluginName = "batch"),
        (i.currentPath = null),
        (i.batches = []),
        (i.batchTint = -1),
        (i.batchDirty = -1),
        (i.vertexData = null),
        (i._fillStyle = new ro()),
        (i._lineStyle = new Fp()),
        (i._matrix = null),
        (i._holeMode = !1),
        (i.state = he.for2d()),
        (i._geometry = e || new Up()),
        i._geometry.refCount++,
        (i._transformID = -1),
        (i.tint = 16777215),
        (i.blendMode = U.NORMAL),
        i
      );
    }
    return (
      Object.defineProperty(r.prototype, "geometry", {
        get: function () {
          return this._geometry;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.clone = function () {
        return this.finishPoly(), new r(this._geometry);
      }),
      Object.defineProperty(r.prototype, "blendMode", {
        get: function () {
          return this.state.blendMode;
        },
        set: function (e) {
          this.state.blendMode = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "tint", {
        get: function () {
          return this._tint;
        },
        set: function (e) {
          this._tint = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "fill", {
        get: function () {
          return this._fillStyle;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "line", {
        get: function () {
          return this._lineStyle;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.lineStyle = function (e, i, n, s, a) {
        return (
          e === void 0 && (e = null),
          i === void 0 && (i = 0),
          n === void 0 && (n = 1),
          s === void 0 && (s = 0.5),
          a === void 0 && (a = !1),
          typeof e == "number" &&
            (e = { width: e, color: i, alpha: n, alignment: s, native: a }),
          this.lineTextureStyle(e)
        );
      }),
      (r.prototype.lineTextureStyle = function (e) {
        (e = Object.assign(
          {
            width: 0,
            texture: B.WHITE,
            color: e && e.texture ? 16777215 : 0,
            alpha: 1,
            matrix: null,
            alignment: 0.5,
            native: !1,
            cap: Kt.BUTT,
            join: Zt.MITER,
            miterLimit: 10,
          },
          e
        )),
          this.currentPath && this.startPoly();
        var i = e.width > 0 && e.alpha > 0;
        return (
          i
            ? (e.matrix && ((e.matrix = e.matrix.clone()), e.matrix.invert()),
              Object.assign(this._lineStyle, { visible: i }, e))
            : this._lineStyle.reset(),
          this
        );
      }),
      (r.prototype.startPoly = function () {
        if (this.currentPath) {
          var e = this.currentPath.points,
            i = this.currentPath.points.length;
          i > 2 &&
            (this.drawShape(this.currentPath),
            (this.currentPath = new _r()),
            (this.currentPath.closeStroke = !1),
            this.currentPath.points.push(e[i - 2], e[i - 1]));
        } else
          (this.currentPath = new _r()), (this.currentPath.closeStroke = !1);
      }),
      (r.prototype.finishPoly = function () {
        this.currentPath &&
          (this.currentPath.points.length > 2
            ? (this.drawShape(this.currentPath), (this.currentPath = null))
            : (this.currentPath.points.length = 0));
      }),
      (r.prototype.moveTo = function (e, i) {
        return (
          this.startPoly(),
          (this.currentPath.points[0] = e),
          (this.currentPath.points[1] = i),
          this
        );
      }),
      (r.prototype.lineTo = function (e, i) {
        this.currentPath || this.moveTo(0, 0);
        var n = this.currentPath.points,
          s = n[n.length - 2],
          a = n[n.length - 1];
        return (s !== e || a !== i) && n.push(e, i), this;
      }),
      (r.prototype._initCurve = function (e, i) {
        e === void 0 && (e = 0),
          i === void 0 && (i = 0),
          this.currentPath
            ? this.currentPath.points.length === 0 &&
              (this.currentPath.points = [e, i])
            : this.moveTo(e, i);
      }),
      (r.prototype.quadraticCurveTo = function (e, i, n, s) {
        this._initCurve();
        var a = this.currentPath.points;
        return (
          a.length === 0 && this.moveTo(0, 0), Ap.curveTo(e, i, n, s, a), this
        );
      }),
      (r.prototype.bezierCurveTo = function (e, i, n, s, a, o) {
        return (
          this._initCurve(),
          Pp.curveTo(e, i, n, s, a, o, this.currentPath.points),
          this
        );
      }),
      (r.prototype.arcTo = function (e, i, n, s, a) {
        this._initCurve(e, i);
        var o = this.currentPath.points,
          h = oo.curveTo(e, i, n, s, a, o);
        if (h) {
          var u = h.cx,
            f = h.cy,
            c = h.radius,
            l = h.startAngle,
            d = h.endAngle,
            p = h.anticlockwise;
          this.arc(u, f, c, l, d, p);
        }
        return this;
      }),
      (r.prototype.arc = function (e, i, n, s, a, o) {
        if ((o === void 0 && (o = !1), s === a)) return this;
        !o && a <= s ? (a += vr) : o && s <= a && (s += vr);
        var h = a - s;
        if (h === 0) return this;
        var u = e + Math.cos(s) * n,
          f = i + Math.sin(s) * n,
          c = this._geometry.closePointEps,
          l = this.currentPath ? this.currentPath.points : null;
        if (l) {
          var d = Math.abs(l[l.length - 2] - u),
            p = Math.abs(l[l.length - 1] - f);
          (d < c && p < c) || l.push(u, f);
        } else this.moveTo(u, f), (l = this.currentPath.points);
        return oo.arc(u, f, e, i, n, s, a, o, l), this;
      }),
      (r.prototype.beginFill = function (e, i) {
        return (
          e === void 0 && (e = 0),
          i === void 0 && (i = 1),
          this.beginTextureFill({ texture: B.WHITE, color: e, alpha: i })
        );
      }),
      (r.prototype.beginTextureFill = function (e) {
        (e = Object.assign(
          { texture: B.WHITE, color: 16777215, alpha: 1, matrix: null },
          e
        )),
          this.currentPath && this.startPoly();
        var i = e.alpha > 0;
        return (
          i
            ? (e.matrix && ((e.matrix = e.matrix.clone()), e.matrix.invert()),
              Object.assign(this._fillStyle, { visible: i }, e))
            : this._fillStyle.reset(),
          this
        );
      }),
      (r.prototype.endFill = function () {
        return this.finishPoly(), this._fillStyle.reset(), this;
      }),
      (r.prototype.drawRect = function (e, i, n, s) {
        return this.drawShape(new z(e, i, n, s));
      }),
      (r.prototype.drawRoundedRect = function (e, i, n, s, a) {
        return this.drawShape(new ic(e, i, n, s, a));
      }),
      (r.prototype.drawCircle = function (e, i, n) {
        return this.drawShape(new ec(e, i, n));
      }),
      (r.prototype.drawEllipse = function (e, i, n, s) {
        return this.drawShape(new rc(e, i, n, s));
      }),
      (r.prototype.drawPolygon = function () {
        for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
          i[n] = e[n];
        var s,
          a = !0,
          o = i[0];
        o.points
          ? ((a = o.closeStroke), (s = o.points))
          : Array.isArray(i[0])
          ? (s = i[0])
          : (s = i);
        var h = new _r(s);
        return (h.closeStroke = a), this.drawShape(h), this;
      }),
      (r.prototype.drawShape = function (e) {
        return (
          this._holeMode
            ? this._geometry.drawHole(e, this._matrix)
            : this._geometry.drawShape(
                e,
                this._fillStyle.clone(),
                this._lineStyle.clone(),
                this._matrix
              ),
          this
        );
      }),
      (r.prototype.clear = function () {
        return (
          this._geometry.clear(),
          this._lineStyle.reset(),
          this._fillStyle.reset(),
          this._boundsID++,
          (this._matrix = null),
          (this._holeMode = !1),
          (this.currentPath = null),
          this
        );
      }),
      (r.prototype.isFastRect = function () {
        var e = this._geometry.graphicsData;
        return (
          e.length === 1 &&
          e[0].shape.type === ot.RECT &&
          !e[0].matrix &&
          !e[0].holes.length &&
          !(e[0].lineStyle.visible && e[0].lineStyle.width)
        );
      }),
      (r.prototype._render = function (e) {
        this.finishPoly();
        var i = this._geometry,
          n = e.context.supports.uint32Indices;
        i.updateBatches(n),
          i.batchable
            ? (this.batchDirty !== i.batchDirty && this._populateBatches(),
              this._renderBatched(e))
            : (e.batch.flush(), this._renderDirect(e));
      }),
      (r.prototype._populateBatches = function () {
        var e = this._geometry,
          i = this.blendMode,
          n = e.batches.length;
        (this.batchTint = -1),
          (this._transformID = -1),
          (this.batchDirty = e.batchDirty),
          (this.batches.length = n),
          (this.vertexData = new Float32Array(e.points));
        for (var s = 0; s < n; s++) {
          var a = e.batches[s],
            o = a.style.color,
            h = new Float32Array(
              this.vertexData.buffer,
              a.attribStart * 4 * 2,
              a.attribSize * 2
            ),
            u = new Float32Array(
              e.uvsFloat32.buffer,
              a.attribStart * 4 * 2,
              a.attribSize * 2
            ),
            f = new Uint16Array(e.indicesUint16.buffer, a.start * 2, a.size),
            c = {
              vertexData: h,
              blendMode: i,
              indices: f,
              uvs: u,
              _batchRGB: ye(o),
              _tintRGB: o,
              _texture: a.style.texture,
              alpha: a.style.alpha,
              worldAlpha: 1,
            };
          this.batches[s] = c;
        }
      }),
      (r.prototype._renderBatched = function (e) {
        if (!!this.batches.length) {
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
            this.calculateVertices(),
            this.calculateTints();
          for (var i = 0, n = this.batches.length; i < n; i++) {
            var s = this.batches[i];
            (s.worldAlpha = this.worldAlpha * s.alpha),
              e.plugins[this.pluginName].render(s);
          }
        }
      }),
      (r.prototype._renderDirect = function (e) {
        var i = this._resolveDirectShader(e),
          n = this._geometry,
          s = this.tint,
          a = this.worldAlpha,
          o = i.uniforms,
          h = n.drawCalls;
        (o.translationMatrix = this.transform.worldTransform),
          (o.tint[0] = (((s >> 16) & 255) / 255) * a),
          (o.tint[1] = (((s >> 8) & 255) / 255) * a),
          (o.tint[2] = ((s & 255) / 255) * a),
          (o.tint[3] = a),
          e.shader.bind(i),
          e.geometry.bind(n, i),
          e.state.set(this.state);
        for (var u = 0, f = h.length; u < f; u++)
          this._renderDrawCallDirect(e, n.drawCalls[u]);
      }),
      (r.prototype._renderDrawCallDirect = function (e, i) {
        for (
          var n = i.texArray,
            s = i.type,
            a = i.size,
            o = i.start,
            h = n.count,
            u = 0;
          u < h;
          u++
        )
          e.texture.bind(n.elements[u], u);
        e.geometry.draw(s, a, o);
      }),
      (r.prototype._resolveDirectShader = function (e) {
        var i = this.shader,
          n = this.pluginName;
        if (!i) {
          if (!en[n]) {
            for (
              var s = e.plugins.batch.MAX_TEXTURES,
                a = new Int32Array(s),
                o = 0;
              o < s;
              o++
            )
              a[o] = o;
            var h = {
                tint: new Float32Array([1, 1, 1, 1]),
                translationMatrix: new ut(),
                default: oe.from({ uSamplers: a }, !0),
              },
              u = e.plugins[n]._shader.program;
            en[n] = new Yt(u, h);
          }
          i = en[n];
        }
        return i;
      }),
      (r.prototype._calculateBounds = function () {
        this.finishPoly();
        var e = this._geometry;
        if (!!e.graphicsData.length) {
          var i = e.bounds,
            n = i.minX,
            s = i.minY,
            a = i.maxX,
            o = i.maxY;
          this._bounds.addFrame(this.transform, n, s, a, o);
        }
      }),
      (r.prototype.containsPoint = function (e) {
        return (
          this.worldTransform.applyInverse(e, r._TEMP_POINT),
          this._geometry.containsPoint(r._TEMP_POINT)
        );
      }),
      (r.prototype.calculateTints = function () {
        if (this.batchTint !== this.tint) {
          this.batchTint = this.tint;
          for (var e = ye(this.tint, Lp), i = 0; i < this.batches.length; i++) {
            var n = this.batches[i],
              s = n._batchRGB,
              a = e[0] * s[0] * 255,
              o = e[1] * s[1] * 255,
              h = e[2] * s[2] * 255,
              u = (a << 16) + (o << 8) + (h | 0);
            n._tintRGB = (u >> 16) + (u & 65280) + ((u & 255) << 16);
          }
        }
      }),
      (r.prototype.calculateVertices = function () {
        var e = this.transform._worldID;
        if (this._transformID !== e) {
          this._transformID = e;
          for (
            var i = this.transform.worldTransform,
              n = i.a,
              s = i.b,
              a = i.c,
              o = i.d,
              h = i.tx,
              u = i.ty,
              f = this._geometry.points,
              c = this.vertexData,
              l = 0,
              d = 0;
            d < f.length;
            d += 2
          ) {
            var p = f[d],
              _ = f[d + 1];
            (c[l++] = n * p + a * _ + h), (c[l++] = o * _ + s * p + u);
          }
        }
      }),
      (r.prototype.closePath = function () {
        var e = this.currentPath;
        return e && ((e.closeStroke = !0), this.finishPoly()), this;
      }),
      (r.prototype.setMatrix = function (e) {
        return (this._matrix = e), this;
      }),
      (r.prototype.beginHole = function () {
        return this.finishPoly(), (this._holeMode = !0), this;
      }),
      (r.prototype.endHole = function () {
        return this.finishPoly(), (this._holeMode = !1), this;
      }),
      (r.prototype.destroy = function (e) {
        this._geometry.refCount--,
          this._geometry.refCount === 0 && this._geometry.dispose(),
          (this._matrix = null),
          (this.currentPath = null),
          this._lineStyle.destroy(),
          (this._lineStyle = null),
          this._fillStyle.destroy(),
          (this._fillStyle = null),
          (this._geometry = null),
          (this.shader = null),
          (this.vertexData = null),
          (this.batches.length = 0),
          (this.batches = null),
          t.prototype.destroy.call(this, e);
      }),
      (r._TEMP_POINT = new ht()),
      r
    );
  })(Ft);
/*!
 * @pixi/sprite - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/sprite is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var rn =
  function (t, r) {
    return (
      (rn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      rn(t, r)
    );
  };
function Gp(t, r) {
  rn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Ze = new ht(),
  Bp = new Uint16Array([0, 1, 2, 0, 2, 3]),
  Ke = (function (t) {
    Gp(r, t);
    function r(e) {
      var i = t.call(this) || this;
      return (
        (i._anchor = new Te(
          i._onAnchorUpdate,
          i,
          e ? e.defaultAnchor.x : 0,
          e ? e.defaultAnchor.y : 0
        )),
        (i._texture = null),
        (i._width = 0),
        (i._height = 0),
        (i._tint = null),
        (i._tintRGB = null),
        (i.tint = 16777215),
        (i.blendMode = U.NORMAL),
        (i._cachedTint = 16777215),
        (i.uvs = null),
        (i.texture = e || B.EMPTY),
        (i.vertexData = new Float32Array(8)),
        (i.vertexTrimmedData = null),
        (i._transformID = -1),
        (i._textureID = -1),
        (i._transformTrimmedID = -1),
        (i._textureTrimmedID = -1),
        (i.indices = Bp),
        (i.pluginName = "batch"),
        (i.isSprite = !0),
        (i._roundPixels = S.ROUND_PIXELS),
        i
      );
    }
    return (
      (r.prototype._onTextureUpdate = function () {
        (this._textureID = -1),
          (this._textureTrimmedID = -1),
          (this._cachedTint = 16777215),
          this._width &&
            (this.scale.x =
              (xe(this.scale.x) * this._width) / this._texture.orig.width),
          this._height &&
            (this.scale.y =
              (xe(this.scale.y) * this._height) / this._texture.orig.height);
      }),
      (r.prototype._onAnchorUpdate = function () {
        (this._transformID = -1), (this._transformTrimmedID = -1);
      }),
      (r.prototype.calculateVertices = function () {
        var e = this._texture;
        if (
          !(
            this._transformID === this.transform._worldID &&
            this._textureID === e._updateID
          )
        ) {
          this._textureID !== e._updateID &&
            (this.uvs = this._texture._uvs.uvsFloat32),
            (this._transformID = this.transform._worldID),
            (this._textureID = e._updateID);
          var i = this.transform.worldTransform,
            n = i.a,
            s = i.b,
            a = i.c,
            o = i.d,
            h = i.tx,
            u = i.ty,
            f = this.vertexData,
            c = e.trim,
            l = e.orig,
            d = this._anchor,
            p = 0,
            _ = 0,
            v = 0,
            m = 0;
          if (
            (c
              ? ((_ = c.x - d._x * l.width),
                (p = _ + c.width),
                (m = c.y - d._y * l.height),
                (v = m + c.height))
              : ((_ = -d._x * l.width),
                (p = _ + l.width),
                (m = -d._y * l.height),
                (v = m + l.height)),
            (f[0] = n * _ + a * m + h),
            (f[1] = o * m + s * _ + u),
            (f[2] = n * p + a * m + h),
            (f[3] = o * m + s * p + u),
            (f[4] = n * p + a * v + h),
            (f[5] = o * v + s * p + u),
            (f[6] = n * _ + a * v + h),
            (f[7] = o * v + s * _ + u),
            this._roundPixels)
          )
            for (var g = S.RESOLUTION, T = 0; T < f.length; ++T)
              f[T] = Math.round(((f[T] * g) | 0) / g);
        }
      }),
      (r.prototype.calculateTrimmedVertices = function () {
        if (!this.vertexTrimmedData)
          this.vertexTrimmedData = new Float32Array(8);
        else if (
          this._transformTrimmedID === this.transform._worldID &&
          this._textureTrimmedID === this._texture._updateID
        )
          return;
        (this._transformTrimmedID = this.transform._worldID),
          (this._textureTrimmedID = this._texture._updateID);
        var e = this._texture,
          i = this.vertexTrimmedData,
          n = e.orig,
          s = this._anchor,
          a = this.transform.worldTransform,
          o = a.a,
          h = a.b,
          u = a.c,
          f = a.d,
          c = a.tx,
          l = a.ty,
          d = -s._x * n.width,
          p = d + n.width,
          _ = -s._y * n.height,
          v = _ + n.height;
        (i[0] = o * d + u * _ + c),
          (i[1] = f * _ + h * d + l),
          (i[2] = o * p + u * _ + c),
          (i[3] = f * _ + h * p + l),
          (i[4] = o * p + u * v + c),
          (i[5] = f * v + h * p + l),
          (i[6] = o * d + u * v + c),
          (i[7] = f * v + h * d + l);
      }),
      (r.prototype._render = function (e) {
        this.calculateVertices(),
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
          e.plugins[this.pluginName].render(this);
      }),
      (r.prototype._calculateBounds = function () {
        var e = this._texture.trim,
          i = this._texture.orig;
        !e || (e.width === i.width && e.height === i.height)
          ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData))
          : (this.calculateTrimmedVertices(),
            this._bounds.addQuad(this.vertexTrimmedData));
      }),
      (r.prototype.getLocalBounds = function (e) {
        return this.children.length === 0
          ? (this._localBounds || (this._localBounds = new ke()),
            (this._localBounds.minX =
              this._texture.orig.width * -this._anchor._x),
            (this._localBounds.minY =
              this._texture.orig.height * -this._anchor._y),
            (this._localBounds.maxX =
              this._texture.orig.width * (1 - this._anchor._x)),
            (this._localBounds.maxY =
              this._texture.orig.height * (1 - this._anchor._y)),
            e ||
              (this._localBoundsRect || (this._localBoundsRect = new z()),
              (e = this._localBoundsRect)),
            this._localBounds.getRectangle(e))
          : t.prototype.getLocalBounds.call(this, e);
      }),
      (r.prototype.containsPoint = function (e) {
        this.worldTransform.applyInverse(e, Ze);
        var i = this._texture.orig.width,
          n = this._texture.orig.height,
          s = -i * this.anchor.x,
          a = 0;
        return !!(
          Ze.x >= s &&
          Ze.x < s + i &&
          ((a = -n * this.anchor.y), Ze.y >= a && Ze.y < a + n)
        );
      }),
      (r.prototype.destroy = function (e) {
        t.prototype.destroy.call(this, e),
          this._texture.off("update", this._onTextureUpdate, this),
          (this._anchor = null);
        var i = typeof e == "boolean" ? e : e && e.texture;
        if (i) {
          var n = typeof e == "boolean" ? e : e && e.baseTexture;
          this._texture.destroy(!!n);
        }
        this._texture = null;
      }),
      (r.from = function (e, i) {
        var n = e instanceof B ? e : B.from(e, i);
        return new r(n);
      }),
      Object.defineProperty(r.prototype, "roundPixels", {
        get: function () {
          return this._roundPixels;
        },
        set: function (e) {
          this._roundPixels !== e && (this._transformID = -1),
            (this._roundPixels = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "width", {
        get: function () {
          return Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function (e) {
          var i = xe(this.scale.x) || 1;
          (this.scale.x = (i * e) / this._texture.orig.width),
            (this._width = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "height", {
        get: function () {
          return Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function (e) {
          var i = xe(this.scale.y) || 1;
          (this.scale.y = (i * e) / this._texture.orig.height),
            (this._height = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "anchor", {
        get: function () {
          return this._anchor;
        },
        set: function (e) {
          this._anchor.copyFrom(e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "tint", {
        get: function () {
          return this._tint;
        },
        set: function (e) {
          (this._tint = e),
            (this._tintRGB = (e >> 16) + (e & 65280) + ((e & 255) << 16));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "texture", {
        get: function () {
          return this._texture;
        },
        set: function (e) {
          this._texture !== e &&
            (this._texture &&
              this._texture.off("update", this._onTextureUpdate, this),
            (this._texture = e || B.EMPTY),
            (this._cachedTint = 16777215),
            (this._textureID = -1),
            (this._textureTrimmedID = -1),
            e &&
              (e.baseTexture.valid
                ? this._onTextureUpdate()
                : e.once("update", this._onTextureUpdate, this)));
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(Ft);
/*!
 * @pixi/text - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/text is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var nn =
  function (t, r) {
    return (
      (nn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      nn(t, r)
    );
  };
function Mp(t, r) {
  nn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Je;
(function (t) {
  (t[(t.LINEAR_VERTICAL = 0)] = "LINEAR_VERTICAL"),
    (t[(t.LINEAR_HORIZONTAL = 1)] = "LINEAR_HORIZONTAL");
})(Je || (Je = {}));
var sn = {
    align: "left",
    breakWords: !1,
    dropShadow: !1,
    dropShadowAlpha: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: "black",
    dropShadowDistance: 5,
    fill: "black",
    fillGradientType: Je.LINEAR_VERTICAL,
    fillGradientStops: [],
    fontFamily: "Arial",
    fontSize: 26,
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: "miter",
    miterLimit: 10,
    padding: 0,
    stroke: "black",
    strokeThickness: 0,
    textBaseline: "alphabetic",
    trim: !1,
    whiteSpace: "pre",
    wordWrap: !1,
    wordWrapWidth: 100,
    leading: 0,
  },
  Dp = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"],
  Pe = (function () {
    function t(r) {
      (this.styleID = 0), this.reset(), on(this, r, r);
    }
    return (
      (t.prototype.clone = function () {
        var r = {};
        return on(r, this, sn), new t(r);
      }),
      (t.prototype.reset = function () {
        on(this, sn, sn);
      }),
      Object.defineProperty(t.prototype, "align", {
        get: function () {
          return this._align;
        },
        set: function (r) {
          this._align !== r && ((this._align = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "breakWords", {
        get: function () {
          return this._breakWords;
        },
        set: function (r) {
          this._breakWords !== r && ((this._breakWords = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadow", {
        get: function () {
          return this._dropShadow;
        },
        set: function (r) {
          this._dropShadow !== r && ((this._dropShadow = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadowAlpha", {
        get: function () {
          return this._dropShadowAlpha;
        },
        set: function (r) {
          this._dropShadowAlpha !== r &&
            ((this._dropShadowAlpha = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadowAngle", {
        get: function () {
          return this._dropShadowAngle;
        },
        set: function (r) {
          this._dropShadowAngle !== r &&
            ((this._dropShadowAngle = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadowBlur", {
        get: function () {
          return this._dropShadowBlur;
        },
        set: function (r) {
          this._dropShadowBlur !== r &&
            ((this._dropShadowBlur = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadowColor", {
        get: function () {
          return this._dropShadowColor;
        },
        set: function (r) {
          var e = an(r);
          this._dropShadowColor !== e &&
            ((this._dropShadowColor = e), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "dropShadowDistance", {
        get: function () {
          return this._dropShadowDistance;
        },
        set: function (r) {
          this._dropShadowDistance !== r &&
            ((this._dropShadowDistance = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fill", {
        get: function () {
          return this._fill;
        },
        set: function (r) {
          var e = an(r);
          this._fill !== e && ((this._fill = e), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fillGradientType", {
        get: function () {
          return this._fillGradientType;
        },
        set: function (r) {
          this._fillGradientType !== r &&
            ((this._fillGradientType = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fillGradientStops", {
        get: function () {
          return this._fillGradientStops;
        },
        set: function (r) {
          kp(this._fillGradientStops, r) ||
            ((this._fillGradientStops = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fontFamily", {
        get: function () {
          return this._fontFamily;
        },
        set: function (r) {
          this.fontFamily !== r && ((this._fontFamily = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fontSize", {
        get: function () {
          return this._fontSize;
        },
        set: function (r) {
          this._fontSize !== r && ((this._fontSize = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fontStyle", {
        get: function () {
          return this._fontStyle;
        },
        set: function (r) {
          this._fontStyle !== r && ((this._fontStyle = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fontVariant", {
        get: function () {
          return this._fontVariant;
        },
        set: function (r) {
          this._fontVariant !== r && ((this._fontVariant = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "fontWeight", {
        get: function () {
          return this._fontWeight;
        },
        set: function (r) {
          this._fontWeight !== r && ((this._fontWeight = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "letterSpacing", {
        get: function () {
          return this._letterSpacing;
        },
        set: function (r) {
          this._letterSpacing !== r &&
            ((this._letterSpacing = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "lineHeight", {
        get: function () {
          return this._lineHeight;
        },
        set: function (r) {
          this._lineHeight !== r && ((this._lineHeight = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "leading", {
        get: function () {
          return this._leading;
        },
        set: function (r) {
          this._leading !== r && ((this._leading = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "lineJoin", {
        get: function () {
          return this._lineJoin;
        },
        set: function (r) {
          this._lineJoin !== r && ((this._lineJoin = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "miterLimit", {
        get: function () {
          return this._miterLimit;
        },
        set: function (r) {
          this._miterLimit !== r && ((this._miterLimit = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "padding", {
        get: function () {
          return this._padding;
        },
        set: function (r) {
          this._padding !== r && ((this._padding = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "stroke", {
        get: function () {
          return this._stroke;
        },
        set: function (r) {
          var e = an(r);
          this._stroke !== e && ((this._stroke = e), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "strokeThickness", {
        get: function () {
          return this._strokeThickness;
        },
        set: function (r) {
          this._strokeThickness !== r &&
            ((this._strokeThickness = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "textBaseline", {
        get: function () {
          return this._textBaseline;
        },
        set: function (r) {
          this._textBaseline !== r &&
            ((this._textBaseline = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "trim", {
        get: function () {
          return this._trim;
        },
        set: function (r) {
          this._trim !== r && ((this._trim = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "whiteSpace", {
        get: function () {
          return this._whiteSpace;
        },
        set: function (r) {
          this._whiteSpace !== r && ((this._whiteSpace = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "wordWrap", {
        get: function () {
          return this._wordWrap;
        },
        set: function (r) {
          this._wordWrap !== r && ((this._wordWrap = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "wordWrapWidth", {
        get: function () {
          return this._wordWrapWidth;
        },
        set: function (r) {
          this._wordWrapWidth !== r &&
            ((this._wordWrapWidth = r), this.styleID++);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.toFontString = function () {
        var r =
            typeof this.fontSize == "number"
              ? this.fontSize + "px"
              : this.fontSize,
          e = this.fontFamily;
        Array.isArray(this.fontFamily) || (e = this.fontFamily.split(","));
        for (var i = e.length - 1; i >= 0; i--) {
          var n = e[i].trim();
          !/([\"\'])[^\'\"]+\1/.test(n) &&
            Dp.indexOf(n) < 0 &&
            (n = '"' + n + '"'),
            (e[i] = n);
        }
        return (
          this.fontStyle +
          " " +
          this.fontVariant +
          " " +
          this.fontWeight +
          " " +
          r +
          " " +
          e.join(",")
        );
      }),
      t
    );
  })();
function lo(t) {
  return typeof t == "number"
    ? _s(t)
    : (typeof t == "string" &&
        t.indexOf("0x") === 0 &&
        (t = t.replace("0x", "#")),
      t);
}
function an(t) {
  if (Array.isArray(t)) {
    for (var r = 0; r < t.length; ++r) t[r] = lo(t[r]);
    return t;
  } else return lo(t);
}
function kp(t, r) {
  if (!Array.isArray(t) || !Array.isArray(r) || t.length !== r.length)
    return !1;
  for (var e = 0; e < t.length; ++e) if (t[e] !== r[e]) return !1;
  return !0;
}
function on(t, r, e) {
  for (var i in e) Array.isArray(r[i]) ? (t[i] = r[i].slice()) : (t[i] = r[i]);
}
var bt = (function () {
    function t(r, e, i, n, s, a, o, h, u) {
      (this.text = r),
        (this.style = e),
        (this.width = i),
        (this.height = n),
        (this.lines = s),
        (this.lineWidths = a),
        (this.lineHeight = o),
        (this.maxLineWidth = h),
        (this.fontProperties = u);
    }
    return (
      (t.measureText = function (r, e, i, n) {
        n === void 0 && (n = t._canvas), (i = i == null ? e.wordWrap : i);
        var s = e.toFontString(),
          a = t.measureFont(s);
        a.fontSize === 0 &&
          ((a.fontSize = e.fontSize), (a.ascent = e.fontSize));
        var o = n.getContext("2d");
        o.font = s;
        for (
          var h = i ? t.wordWrap(r, e, n) : r,
            u = h.split(/(?:\r\n|\r|\n)/),
            f = new Array(u.length),
            c = 0,
            l = 0;
          l < u.length;
          l++
        ) {
          var d =
            o.measureText(u[l]).width + (u[l].length - 1) * e.letterSpacing;
          (f[l] = d), (c = Math.max(c, d));
        }
        var p = c + e.strokeThickness;
        e.dropShadow && (p += e.dropShadowDistance);
        var _ = e.lineHeight || a.fontSize + e.strokeThickness,
          v =
            Math.max(_, a.fontSize + e.strokeThickness) +
            (u.length - 1) * (_ + e.leading);
        return (
          e.dropShadow && (v += e.dropShadowDistance),
          new t(r, e, p, v, u, f, _ + e.leading, c, a)
        );
      }),
      (t.wordWrap = function (r, e, i) {
        i === void 0 && (i = t._canvas);
        for (
          var n = i.getContext("2d"),
            s = 0,
            a = "",
            o = "",
            h = Object.create(null),
            u = e.letterSpacing,
            f = e.whiteSpace,
            c = t.collapseSpaces(f),
            l = t.collapseNewlines(f),
            d = !c,
            p = e.wordWrapWidth + u,
            _ = t.tokenize(r),
            v = 0;
          v < _.length;
          v++
        ) {
          var m = _[v];
          if (t.isNewline(m)) {
            if (!l) {
              (o += t.addLine(a)), (d = !c), (a = ""), (s = 0);
              continue;
            }
            m = " ";
          }
          if (c) {
            var g = t.isBreakingSpace(m),
              T = t.isBreakingSpace(a[a.length - 1]);
            if (g && T) continue;
          }
          var I = t.getFromCache(m, u, h, n);
          if (I > p)
            if (
              (a !== "" && ((o += t.addLine(a)), (a = ""), (s = 0)),
              t.canBreakWords(m, e.breakWords))
            )
              for (var x = t.wordWrapSplit(m), y = 0; y < x.length; y++) {
                for (var C = x[y], N = 1; x[y + N]; ) {
                  var b = x[y + N],
                    R = C[C.length - 1];
                  if (!t.canBreakChars(R, b, m, y, e.breakWords)) C += b;
                  else break;
                  N++;
                }
                y += C.length - 1;
                var F = t.getFromCache(C, u, h, n);
                F + s > p && ((o += t.addLine(a)), (d = !1), (a = ""), (s = 0)),
                  (a += C),
                  (s += F);
              }
            else {
              a.length > 0 && ((o += t.addLine(a)), (a = ""), (s = 0));
              var O = v === _.length - 1;
              (o += t.addLine(m, !O)), (d = !1), (a = ""), (s = 0);
            }
          else
            I + s > p && ((d = !1), (o += t.addLine(a)), (a = ""), (s = 0)),
              (a.length > 0 || !t.isBreakingSpace(m) || d) &&
                ((a += m), (s += I));
        }
        return (o += t.addLine(a, !1)), o;
      }),
      (t.addLine = function (r, e) {
        return (
          e === void 0 && (e = !0),
          (r = t.trimRight(r)),
          (r = e
            ? r +
              `
`
            : r),
          r
        );
      }),
      (t.getFromCache = function (r, e, i, n) {
        var s = i[r];
        if (typeof s != "number") {
          var a = r.length * e;
          (s = n.measureText(r).width + a), (i[r] = s);
        }
        return s;
      }),
      (t.collapseSpaces = function (r) {
        return r === "normal" || r === "pre-line";
      }),
      (t.collapseNewlines = function (r) {
        return r === "normal";
      }),
      (t.trimRight = function (r) {
        if (typeof r != "string") return "";
        for (var e = r.length - 1; e >= 0; e--) {
          var i = r[e];
          if (!t.isBreakingSpace(i)) break;
          r = r.slice(0, -1);
        }
        return r;
      }),
      (t.isNewline = function (r) {
        return typeof r != "string"
          ? !1
          : t._newlines.indexOf(r.charCodeAt(0)) >= 0;
      }),
      (t.isBreakingSpace = function (r, e) {
        return typeof r != "string"
          ? !1
          : t._breakingSpaces.indexOf(r.charCodeAt(0)) >= 0;
      }),
      (t.tokenize = function (r) {
        var e = [],
          i = "";
        if (typeof r != "string") return e;
        for (var n = 0; n < r.length; n++) {
          var s = r[n],
            a = r[n + 1];
          if (t.isBreakingSpace(s, a) || t.isNewline(s)) {
            i !== "" && (e.push(i), (i = "")), e.push(s);
            continue;
          }
          i += s;
        }
        return i !== "" && e.push(i), e;
      }),
      (t.canBreakWords = function (r, e) {
        return e;
      }),
      (t.canBreakChars = function (r, e, i, n, s) {
        return !0;
      }),
      (t.wordWrapSplit = function (r) {
        return r.split("");
      }),
      (t.measureFont = function (r) {
        if (t._fonts[r]) return t._fonts[r];
        var e = { ascent: 0, descent: 0, fontSize: 0 },
          i = t._canvas,
          n = t._context;
        n.font = r;
        var s = t.METRICS_STRING + t.BASELINE_SYMBOL,
          a = Math.ceil(n.measureText(s).width),
          o = Math.ceil(n.measureText(t.BASELINE_SYMBOL).width),
          h = Math.ceil(t.HEIGHT_MULTIPLIER * o);
        (o = (o * t.BASELINE_MULTIPLIER) | 0),
          (i.width = a),
          (i.height = h),
          (n.fillStyle = "#f00"),
          n.fillRect(0, 0, a, h),
          (n.font = r),
          (n.textBaseline = "alphabetic"),
          (n.fillStyle = "#000"),
          n.fillText(s, 0, o);
        var u = n.getImageData(0, 0, a, h).data,
          f = u.length,
          c = a * 4,
          l = 0,
          d = 0,
          p = !1;
        for (l = 0; l < o; ++l) {
          for (var _ = 0; _ < c; _ += 4)
            if (u[d + _] !== 255) {
              p = !0;
              break;
            }
          if (!p) d += c;
          else break;
        }
        for (e.ascent = o - l, d = f - c, p = !1, l = h; l > o; --l) {
          for (var _ = 0; _ < c; _ += 4)
            if (u[d + _] !== 255) {
              p = !0;
              break;
            }
          if (!p) d -= c;
          else break;
        }
        return (
          (e.descent = l - o),
          (e.fontSize = e.ascent + e.descent),
          (t._fonts[r] = e),
          e
        );
      }),
      (t.clearMetrics = function (r) {
        r === void 0 && (r = ""), r ? delete t._fonts[r] : (t._fonts = {});
      }),
      t
    );
  })(),
  Br = (function () {
    try {
      var t = new OffscreenCanvas(0, 0),
        r = t.getContext("2d");
      return r && r.measureText ? t : document.createElement("canvas");
    } catch {
      return document.createElement("canvas");
    }
  })();
Br.width = Br.height = 10;
bt._canvas = Br;
bt._context = Br.getContext("2d");
bt._fonts = {};
bt.METRICS_STRING = "|\xC9q\xC5";
bt.BASELINE_SYMBOL = "M";
bt.BASELINE_MULTIPLIER = 1.4;
bt.HEIGHT_MULTIPLIER = 2;
bt._newlines = [10, 13];
bt._breakingSpaces = [
  9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201, 8202, 8287,
  12288,
];
var Xp = { texture: !0, children: !1, baseTexture: !0 },
  co = (function (t) {
    Mp(r, t);
    function r(e, i, n) {
      var s = this,
        a = !1;
      n || ((n = document.createElement("canvas")), (a = !0)),
        (n.width = 3),
        (n.height = 3);
      var o = B.from(n);
      return (
        (o.orig = new z()),
        (o.trim = new z()),
        (s = t.call(this, o) || this),
        (s._ownCanvas = a),
        (s.canvas = n),
        (s.context = s.canvas.getContext("2d")),
        (s._resolution = S.RESOLUTION),
        (s._autoResolution = !0),
        (s._text = null),
        (s._style = null),
        (s._styleListener = null),
        (s._font = ""),
        (s.text = e),
        (s.style = i),
        (s.localStyleID = -1),
        s
      );
    }
    return (
      (r.prototype.updateText = function (e) {
        var i = this._style;
        if (
          (this.localStyleID !== i.styleID &&
            ((this.dirty = !0), (this.localStyleID = i.styleID)),
          !(!this.dirty && e))
        ) {
          this._font = this._style.toFontString();
          var n = this.context,
            s = bt.measureText(
              this._text || " ",
              this._style,
              this._style.wordWrap,
              this.canvas
            ),
            a = s.width,
            o = s.height,
            h = s.lines,
            u = s.lineHeight,
            f = s.lineWidths,
            c = s.maxLineWidth,
            l = s.fontProperties;
          (this.canvas.width = Math.ceil(
            Math.ceil(Math.max(1, a) + i.padding * 2) * this._resolution
          )),
            (this.canvas.height = Math.ceil(
              Math.ceil(Math.max(1, o) + i.padding * 2) * this._resolution
            )),
            n.scale(this._resolution, this._resolution),
            n.clearRect(0, 0, this.canvas.width, this.canvas.height),
            (n.font = this._font),
            (n.lineWidth = i.strokeThickness),
            (n.textBaseline = i.textBaseline),
            (n.lineJoin = i.lineJoin),
            (n.miterLimit = i.miterLimit);
          for (var d, p, _ = i.dropShadow ? 2 : 1, v = 0; v < _; ++v) {
            var m = i.dropShadow && v === 0,
              g = m ? Math.ceil(Math.max(1, o) + i.padding * 2) : 0,
              T = g * this._resolution;
            if (m) {
              (n.fillStyle = "black"), (n.strokeStyle = "black");
              var I = i.dropShadowColor,
                x = ye(typeof I == "number" ? I : ms(I)),
                y = i.dropShadowBlur * this._resolution,
                C = i.dropShadowDistance * this._resolution;
              (n.shadowColor =
                "rgba(" +
                x[0] * 255 +
                "," +
                x[1] * 255 +
                "," +
                x[2] * 255 +
                "," +
                i.dropShadowAlpha +
                ")"),
                (n.shadowBlur = y),
                (n.shadowOffsetX = Math.cos(i.dropShadowAngle) * C),
                (n.shadowOffsetY = Math.sin(i.dropShadowAngle) * C + T);
            } else
              (n.fillStyle = this._generateFillStyle(i, h, s)),
                (n.strokeStyle = i.stroke),
                (n.shadowColor = "black"),
                (n.shadowBlur = 0),
                (n.shadowOffsetX = 0),
                (n.shadowOffsetY = 0);
            var N = (u - l.fontSize) / 2;
            (!r.nextLineHeightBehavior || u - l.fontSize < 0) && (N = 0);
            for (var b = 0; b < h.length; b++)
              (d = i.strokeThickness / 2),
                (p = i.strokeThickness / 2 + b * u + l.ascent + N),
                i.align === "right"
                  ? (d += c - f[b])
                  : i.align === "center" && (d += (c - f[b]) / 2),
                i.stroke &&
                  i.strokeThickness &&
                  this.drawLetterSpacing(
                    h[b],
                    d + i.padding,
                    p + i.padding - g,
                    !0
                  ),
                i.fill &&
                  this.drawLetterSpacing(
                    h[b],
                    d + i.padding,
                    p + i.padding - g
                  );
          }
          this.updateTexture();
        }
      }),
      (r.prototype.drawLetterSpacing = function (e, i, n, s) {
        s === void 0 && (s = !1);
        var a = this._style,
          o = a.letterSpacing,
          h =
            "letterSpacing" in CanvasRenderingContext2D.prototype ||
            "textLetterSpacing" in CanvasRenderingContext2D.prototype;
        if (o === 0 || h) {
          h &&
            ((this.context.letterSpacing = o),
            (this.context.textLetterSpacing = o)),
            s
              ? this.context.strokeText(e, i, n)
              : this.context.fillText(e, i, n);
          return;
        }
        for (
          var u = i,
            f = Array.from ? Array.from(e) : e.split(""),
            c = this.context.measureText(e).width,
            l = 0,
            d = 0;
          d < f.length;
          ++d
        ) {
          var p = f[d];
          s ? this.context.strokeText(p, u, n) : this.context.fillText(p, u, n);
          for (var _ = "", v = d + 1; v < f.length; ++v) _ += f[v];
          (l = this.context.measureText(_).width), (u += c - l + o), (c = l);
        }
      }),
      (r.prototype.updateTexture = function () {
        var e = this.canvas;
        if (this._style.trim) {
          var i = Kl(e);
          i.data &&
            ((e.width = i.width),
            (e.height = i.height),
            this.context.putImageData(i.data, 0, 0));
        }
        var n = this._texture,
          s = this._style,
          a = s.trim ? 0 : s.padding,
          o = n.baseTexture;
        (n.trim.width = n._frame.width = e.width / this._resolution),
          (n.trim.height = n._frame.height = e.height / this._resolution),
          (n.trim.x = -a),
          (n.trim.y = -a),
          (n.orig.width = n._frame.width - a * 2),
          (n.orig.height = n._frame.height - a * 2),
          this._onTextureUpdate(),
          o.setRealSize(e.width, e.height, this._resolution),
          n.updateUvs(),
          this._recursivePostUpdateTransform(),
          (this.dirty = !1);
      }),
      (r.prototype._render = function (e) {
        this._autoResolution &&
          this._resolution !== e.resolution &&
          ((this._resolution = e.resolution), (this.dirty = !0)),
          this.updateText(!0),
          t.prototype._render.call(this, e);
      }),
      (r.prototype.getLocalBounds = function (e) {
        return this.updateText(!0), t.prototype.getLocalBounds.call(this, e);
      }),
      (r.prototype._calculateBounds = function () {
        this.updateText(!0),
          this.calculateVertices(),
          this._bounds.addQuad(this.vertexData);
      }),
      (r.prototype._generateFillStyle = function (e, i, n) {
        var s = e.fill;
        if (Array.isArray(s)) {
          if (s.length === 1) return s[0];
        } else return s;
        var a,
          o = e.dropShadow ? e.dropShadowDistance : 0,
          h = e.padding || 0,
          u = this.canvas.width / this._resolution - o - h * 2,
          f = this.canvas.height / this._resolution - o - h * 2,
          c = s.slice(),
          l = e.fillGradientStops.slice();
        if (!l.length)
          for (var d = c.length + 1, p = 1; p < d; ++p) l.push(p / d);
        if (
          (c.unshift(s[0]),
          l.unshift(0),
          c.push(s[s.length - 1]),
          l.push(1),
          e.fillGradientType === Je.LINEAR_VERTICAL)
        ) {
          a = this.context.createLinearGradient(u / 2, h, u / 2, f + h);
          for (
            var _ = n.fontProperties.fontSize + e.strokeThickness, p = 0;
            p < i.length;
            p++
          ) {
            var v = n.lineHeight * (p - 1) + _,
              m = n.lineHeight * p,
              g = m;
            p > 0 && v > m && (g = (m + v) / 2);
            var T = m + _,
              I = n.lineHeight * (p + 1),
              x = T;
            p + 1 < i.length && I < T && (x = (T + I) / 2);
            for (var y = (x - g) / f, C = 0; C < c.length; C++) {
              var N = 0;
              typeof l[C] == "number" ? (N = l[C]) : (N = C / c.length);
              var b = Math.min(1, Math.max(0, g / f + N * y));
              (b = Number(b.toFixed(5))), a.addColorStop(b, c[C]);
            }
          }
        } else {
          a = this.context.createLinearGradient(h, f / 2, u + h, f / 2);
          for (var R = c.length + 1, F = 1, p = 0; p < c.length; p++) {
            var O = void 0;
            typeof l[p] == "number" ? (O = l[p]) : (O = F / R),
              a.addColorStop(O, c[p]),
              F++;
          }
        }
        return a;
      }),
      (r.prototype.destroy = function (e) {
        typeof e == "boolean" && (e = { children: e }),
          (e = Object.assign({}, Xp, e)),
          t.prototype.destroy.call(this, e),
          this._ownCanvas && (this.canvas.height = this.canvas.width = 0),
          (this.context = null),
          (this.canvas = null),
          (this._style = null);
      }),
      Object.defineProperty(r.prototype, "width", {
        get: function () {
          return (
            this.updateText(!0),
            Math.abs(this.scale.x) * this._texture.orig.width
          );
        },
        set: function (e) {
          this.updateText(!0);
          var i = xe(this.scale.x) || 1;
          (this.scale.x = (i * e) / this._texture.orig.width),
            (this._width = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "height", {
        get: function () {
          return (
            this.updateText(!0),
            Math.abs(this.scale.y) * this._texture.orig.height
          );
        },
        set: function (e) {
          this.updateText(!0);
          var i = xe(this.scale.y) || 1;
          (this.scale.y = (i * e) / this._texture.orig.height),
            (this._height = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "style", {
        get: function () {
          return this._style;
        },
        set: function (e) {
          (e = e || {}),
            e instanceof Pe ? (this._style = e) : (this._style = new Pe(e)),
            (this.localStyleID = -1),
            (this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "text", {
        get: function () {
          return this._text;
        },
        set: function (e) {
          (e = String(e == null ? "" : e)),
            this._text !== e && ((this._text = e), (this.dirty = !0));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "resolution", {
        get: function () {
          return this._resolution;
        },
        set: function (e) {
          (this._autoResolution = !1),
            this._resolution !== e &&
              ((this._resolution = e), (this.dirty = !0));
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.nextLineHeightBehavior = !1),
      r
    );
  })(Ke);
/*!
 * @pixi/prepare - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/prepare is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ S.UPLOADS_PER_FRAME = 4;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var hn =
  function (t, r) {
    return (
      (hn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      hn(t, r)
    );
  };
function Hp(t, r) {
  hn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Vp = (function () {
  function t(r) {
    (this.maxItemsPerFrame = r), (this.itemsLeft = 0);
  }
  return (
    (t.prototype.beginFrame = function () {
      this.itemsLeft = this.maxItemsPerFrame;
    }),
    (t.prototype.allowedToUpload = function () {
      return this.itemsLeft-- > 0;
    }),
    t
  );
})();
function jp(t, r) {
  var e = !1;
  if (t && t._textures && t._textures.length) {
    for (var i = 0; i < t._textures.length; i++)
      if (t._textures[i] instanceof B) {
        var n = t._textures[i].baseTexture;
        r.indexOf(n) === -1 && (r.push(n), (e = !0));
      }
  }
  return e;
}
function zp(t, r) {
  if (t.baseTexture instanceof W) {
    var e = t.baseTexture;
    return r.indexOf(e) === -1 && r.push(e), !0;
  }
  return !1;
}
function Wp(t, r) {
  if (t._texture && t._texture instanceof B) {
    var e = t._texture.baseTexture;
    return r.indexOf(e) === -1 && r.push(e), !0;
  }
  return !1;
}
function Yp(t, r) {
  return r instanceof co ? (r.updateText(!0), !0) : !1;
}
function $p(t, r) {
  if (r instanceof Pe) {
    var e = r.toFontString();
    return bt.measureFont(e), !0;
  }
  return !1;
}
function qp(t, r) {
  if (t instanceof co) {
    r.indexOf(t.style) === -1 && r.push(t.style),
      r.indexOf(t) === -1 && r.push(t);
    var e = t._texture.baseTexture;
    return r.indexOf(e) === -1 && r.push(e), !0;
  }
  return !1;
}
function Zp(t, r) {
  return t instanceof Pe ? (r.indexOf(t) === -1 && r.push(t), !0) : !1;
}
var Kp = (function () {
  function t(r) {
    var e = this;
    (this.limiter = new Vp(S.UPLOADS_PER_FRAME)),
      (this.renderer = r),
      (this.uploadHookHelper = null),
      (this.queue = []),
      (this.addHooks = []),
      (this.uploadHooks = []),
      (this.completes = []),
      (this.ticking = !1),
      (this.delayedTick = function () {
        !e.queue || e.prepareItems();
      }),
      this.registerFindHook(qp),
      this.registerFindHook(Zp),
      this.registerFindHook(jp),
      this.registerFindHook(zp),
      this.registerFindHook(Wp),
      this.registerUploadHook(Yp),
      this.registerUploadHook($p);
  }
  return (
    (t.prototype.upload = function (r, e) {
      typeof r == "function" && ((e = r), (r = null)),
        r && this.add(r),
        this.queue.length
          ? (e && this.completes.push(e),
            this.ticking ||
              ((this.ticking = !0),
              mt.system.addOnce(this.tick, this, Xt.UTILITY)))
          : e && e();
    }),
    (t.prototype.tick = function () {
      setTimeout(this.delayedTick, 0);
    }),
    (t.prototype.prepareItems = function () {
      for (
        this.limiter.beginFrame();
        this.queue.length && this.limiter.allowedToUpload();

      ) {
        var r = this.queue[0],
          e = !1;
        if (r && !r._destroyed) {
          for (var i = 0, n = this.uploadHooks.length; i < n; i++)
            if (this.uploadHooks[i](this.uploadHookHelper, r)) {
              this.queue.shift(), (e = !0);
              break;
            }
        }
        e || this.queue.shift();
      }
      if (this.queue.length) mt.system.addOnce(this.tick, this, Xt.UTILITY);
      else {
        this.ticking = !1;
        var s = this.completes.slice(0);
        this.completes.length = 0;
        for (var i = 0, n = s.length; i < n; i++) s[i]();
      }
    }),
    (t.prototype.registerFindHook = function (r) {
      return r && this.addHooks.push(r), this;
    }),
    (t.prototype.registerUploadHook = function (r) {
      return r && this.uploadHooks.push(r), this;
    }),
    (t.prototype.add = function (r) {
      for (
        var e = 0, i = this.addHooks.length;
        e < i && !this.addHooks[e](r, this.queue);
        e++
      );
      if (r instanceof Ft)
        for (var e = r.children.length - 1; e >= 0; e--)
          this.add(r.children[e]);
      return this;
    }),
    (t.prototype.destroy = function () {
      this.ticking && mt.system.remove(this.tick, this),
        (this.ticking = !1),
        (this.addHooks = null),
        (this.uploadHooks = null),
        (this.renderer = null),
        (this.completes = null),
        (this.queue = null),
        (this.limiter = null),
        (this.uploadHookHelper = null);
    }),
    t
  );
})();
function po(t, r) {
  return r instanceof W
    ? (r._glTextures[t.CONTEXT_UID] || t.texture.bind(r), !0)
    : !1;
}
function Jp(t, r) {
  if (!(r instanceof fo)) return !1;
  var e = r.geometry;
  r.finishPoly(), e.updateBatches();
  for (var i = e.batches, n = 0; n < i.length; n++) {
    var s = i[n].style.texture;
    s && po(t, s.baseTexture);
  }
  return e.batchable || t.geometry.bind(e, r._resolveDirectShader(t)), !0;
}
function Qp(t, r) {
  return t instanceof fo ? (r.push(t), !0) : !1;
}
var tv = (function (t) {
  Hp(r, t);
  function r(e) {
    var i = t.call(this, e) || this;
    return (
      (i.uploadHookHelper = i.renderer),
      i.registerFindHook(Qp),
      i.registerUploadHook(po),
      i.registerUploadHook(Jp),
      i
    );
  }
  return r;
})(Kp);
/*!
 * @pixi/spritesheet - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/spritesheet is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var ev = (function () {
    function t(r, e, i) {
      i === void 0 && (i = null),
        (this._texture = r instanceof B ? r : null),
        (this.baseTexture = r instanceof W ? r : this._texture.baseTexture),
        (this.textures = {}),
        (this.animations = {}),
        (this.data = e);
      var n = this.baseTexture.resource;
      (this.resolution = this._updateResolution(i || (n ? n.url : null))),
        (this._frames = this.data.frames),
        (this._frameKeys = Object.keys(this._frames)),
        (this._batchIndex = 0),
        (this._callback = null);
    }
    return (
      (t.prototype._updateResolution = function (r) {
        r === void 0 && (r = null);
        var e = this.data.meta.scale,
          i = pr(r, null);
        return (
          i === null && (i = e !== void 0 ? parseFloat(e) : 1),
          i !== 1 && this.baseTexture.setResolution(i),
          i
        );
      }),
      (t.prototype.parse = function (r) {
        (this._batchIndex = 0),
          (this._callback = r),
          this._frameKeys.length <= t.BATCH_SIZE
            ? (this._processFrames(0),
              this._processAnimations(),
              this._parseComplete())
            : this._nextBatch();
      }),
      (t.prototype._processFrames = function (r) {
        for (
          var e = r, i = t.BATCH_SIZE;
          e - r < i && e < this._frameKeys.length;

        ) {
          var n = this._frameKeys[e],
            s = this._frames[n],
            a = s.frame;
          if (a) {
            var o = null,
              h = null,
              u = s.trimmed !== !1 && s.sourceSize ? s.sourceSize : s.frame,
              f = new z(
                0,
                0,
                Math.floor(u.w) / this.resolution,
                Math.floor(u.h) / this.resolution
              );
            s.rotated
              ? (o = new z(
                  Math.floor(a.x) / this.resolution,
                  Math.floor(a.y) / this.resolution,
                  Math.floor(a.h) / this.resolution,
                  Math.floor(a.w) / this.resolution
                ))
              : (o = new z(
                  Math.floor(a.x) / this.resolution,
                  Math.floor(a.y) / this.resolution,
                  Math.floor(a.w) / this.resolution,
                  Math.floor(a.h) / this.resolution
                )),
              s.trimmed !== !1 &&
                s.spriteSourceSize &&
                (h = new z(
                  Math.floor(s.spriteSourceSize.x) / this.resolution,
                  Math.floor(s.spriteSourceSize.y) / this.resolution,
                  Math.floor(a.w) / this.resolution,
                  Math.floor(a.h) / this.resolution
                )),
              (this.textures[n] = new B(
                this.baseTexture,
                o,
                f,
                h,
                s.rotated ? 2 : 0,
                s.anchor
              )),
              B.addToCache(this.textures[n], n);
          }
          e++;
        }
      }),
      (t.prototype._processAnimations = function () {
        var r = this.data.animations || {};
        for (var e in r) {
          this.animations[e] = [];
          for (var i = 0; i < r[e].length; i++) {
            var n = r[e][i];
            this.animations[e].push(this.textures[n]);
          }
        }
      }),
      (t.prototype._parseComplete = function () {
        var r = this._callback;
        (this._callback = null),
          (this._batchIndex = 0),
          r.call(this, this.textures);
      }),
      (t.prototype._nextBatch = function () {
        var r = this;
        this._processFrames(this._batchIndex * t.BATCH_SIZE),
          this._batchIndex++,
          setTimeout(function () {
            r._batchIndex * t.BATCH_SIZE < r._frameKeys.length
              ? r._nextBatch()
              : (r._processAnimations(), r._parseComplete());
          }, 0);
      }),
      (t.prototype.destroy = function (r) {
        var e;
        r === void 0 && (r = !1);
        for (var i in this.textures) this.textures[i].destroy();
        (this._frames = null),
          (this._frameKeys = null),
          (this.data = null),
          (this.textures = null),
          r &&
            ((e = this._texture) === null || e === void 0 || e.destroy(),
            this.baseTexture.destroy()),
          (this._texture = null),
          (this.baseTexture = null);
      }),
      (t.BATCH_SIZE = 1e3),
      t
    );
  })(),
  rv = (function () {
    function t() {}
    return (
      (t.use = function (r, e) {
        var i,
          n,
          s = this,
          a = r.name + "_image";
        if (
          !r.data ||
          r.type !== st.TYPE.JSON ||
          !r.data.frames ||
          s.resources[a]
        ) {
          e();
          return;
        }
        var o =
          (n = (i = r.data) === null || i === void 0 ? void 0 : i.meta) ===
            null || n === void 0
            ? void 0
            : n.related_multi_packs;
        if (Array.isArray(o))
          for (
            var h = function (p) {
                if (typeof p != "string") return "continue";
                var _ = p.replace(".json", ""),
                  v = me.resolve(r.url.replace(s.baseUrl, ""), p);
                if (
                  s.resources[_] ||
                  Object.values(s.resources).some(function (g) {
                    return me.format(me.parse(g.url)) === v;
                  })
                )
                  return "continue";
                var m = {
                  crossOrigin: r.crossOrigin,
                  loadType: st.LOAD_TYPE.XHR,
                  xhrType: st.XHR_RESPONSE_TYPE.JSON,
                  parentResource: r,
                  metadata: r.metadata,
                };
                s.add(_, v, m);
              },
              u = 0,
              f = o;
            u < f.length;
            u++
          ) {
            var c = f[u];
            h(c);
          }
        var l = {
            crossOrigin: r.crossOrigin,
            metadata: r.metadata.imageMetadata,
            parentResource: r,
          },
          d = t.getResourcePath(r, s.baseUrl);
        s.add(a, d, l, function (_) {
          if (_.error) {
            e(_.error);
            return;
          }
          var v = new ev(_.texture, r.data, r.url);
          v.parse(function () {
            (r.spritesheet = v), (r.textures = v.textures), e();
          });
        });
      }),
      (t.getResourcePath = function (r, e) {
        return r.isDataUrl
          ? r.data.meta.image
          : me.resolve(r.url.replace(e, ""), r.data.meta.image);
      }),
      t
    );
  })();
/*!
 * @pixi/sprite-tiling - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/sprite-tiling is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var un =
  function (t, r) {
    return (
      (un =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      un(t, r)
    );
  };
function vo(t, r) {
  un(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Qe = new ht();
(function (t) {
  vo(r, t);
  function r(e, i, n) {
    i === void 0 && (i = 100), n === void 0 && (n = 100);
    var s = t.call(this, e) || this;
    return (
      (s.tileTransform = new Ps()),
      (s._width = i),
      (s._height = n),
      (s.uvMatrix = s.texture.uvMatrix || new Gi(e)),
      (s.pluginName = "tilingSprite"),
      (s.uvRespectAnchor = !1),
      s
    );
  }
  return (
    Object.defineProperty(r.prototype, "clampMargin", {
      get: function () {
        return this.uvMatrix.clampMargin;
      },
      set: function (e) {
        (this.uvMatrix.clampMargin = e), this.uvMatrix.update(!0);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "tileScale", {
      get: function () {
        return this.tileTransform.scale;
      },
      set: function (e) {
        this.tileTransform.scale.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "tilePosition", {
      get: function () {
        return this.tileTransform.position;
      },
      set: function (e) {
        this.tileTransform.position.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype._onTextureUpdate = function () {
      this.uvMatrix && (this.uvMatrix.texture = this._texture),
        (this._cachedTint = 16777215);
    }),
    (r.prototype._render = function (e) {
      var i = this._texture;
      !i ||
        !i.valid ||
        (this.tileTransform.updateLocalTransform(),
        this.uvMatrix.update(),
        e.batch.setObjectRenderer(e.plugins[this.pluginName]),
        e.plugins[this.pluginName].render(this));
    }),
    (r.prototype._calculateBounds = function () {
      var e = this._width * -this._anchor._x,
        i = this._height * -this._anchor._y,
        n = this._width * (1 - this._anchor._x),
        s = this._height * (1 - this._anchor._y);
      this._bounds.addFrame(this.transform, e, i, n, s);
    }),
    (r.prototype.getLocalBounds = function (e) {
      return this.children.length === 0
        ? ((this._bounds.minX = this._width * -this._anchor._x),
          (this._bounds.minY = this._height * -this._anchor._y),
          (this._bounds.maxX = this._width * (1 - this._anchor._x)),
          (this._bounds.maxY = this._height * (1 - this._anchor._y)),
          e ||
            (this._localBoundsRect || (this._localBoundsRect = new z()),
            (e = this._localBoundsRect)),
          this._bounds.getRectangle(e))
        : t.prototype.getLocalBounds.call(this, e);
    }),
    (r.prototype.containsPoint = function (e) {
      this.worldTransform.applyInverse(e, Qe);
      var i = this._width,
        n = this._height,
        s = -i * this.anchor._x;
      if (Qe.x >= s && Qe.x < s + i) {
        var a = -n * this.anchor._y;
        if (Qe.y >= a && Qe.y < a + n) return !0;
      }
      return !1;
    }),
    (r.prototype.destroy = function (e) {
      t.prototype.destroy.call(this, e),
        (this.tileTransform = null),
        (this.uvMatrix = null);
    }),
    (r.from = function (e, i) {
      var n = e instanceof B ? e : B.from(e, i);
      return new r(n, i.width, i.height);
    }),
    Object.defineProperty(r.prototype, "width", {
      get: function () {
        return this._width;
      },
      set: function (e) {
        this._width = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "height", {
      get: function () {
        return this._height;
      },
      set: function (e) {
        this._height = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})(Ke);
var iv = `#version 100
#define SHADER_NAME Tiling-Sprite-Simple-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;

void main(void)
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texSample * uColor;
}
`,
  _o = `#version 100
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`,
  nv = `#version 100
#ifdef GL_EXT_shader_texture_lod
    #extension GL_EXT_shader_texture_lod : enable
#endif
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    #ifdef GL_EXT_shader_texture_lod
        vec4 texSample = unclamped == coord
            ? texture2D(uSampler, coord) 
            : texture2DLodEXT(uSampler, coord, 0);
    #else
        vec4 texSample = texture2D(uSampler, coord);
    #endif

    gl_FragColor = texSample * uColor;
}
`,
  sv = `#version 300 es
#define SHADER_NAME Tiling-Sprite-300

precision lowp float;

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

out vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`,
  av = `#version 300 es
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

in vec2 vTextureCoord;

out vec4 fragmentColor;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0

    fragmentColor = texSample * uColor;
}
`,
  Mr = new ut(),
  ov = (function (t) {
    vo(r, t);
    function r(e) {
      var i = t.call(this, e) || this;
      return (
        e.runners.contextChange.add(i),
        (i.quad = new ha()),
        (i.state = he.for2d()),
        i
      );
    }
    return (
      (r.prototype.contextChange = function () {
        var e = this.renderer,
          i = { globals: e.globalUniforms };
        (this.simpleShader = Yt.from(_o, iv, i)),
          (this.shader =
            e.context.webGLVersion > 1
              ? Yt.from(sv, av, i)
              : Yt.from(_o, nv, i));
      }),
      (r.prototype.render = function (e) {
        var i = this.renderer,
          n = this.quad,
          s = n.vertices;
        (s[0] = s[6] = e._width * -e.anchor.x),
          (s[1] = s[3] = e._height * -e.anchor.y),
          (s[2] = s[4] = e._width * (1 - e.anchor.x)),
          (s[5] = s[7] = e._height * (1 - e.anchor.y));
        var a = e.uvRespectAnchor ? e.anchor.x : 0,
          o = e.uvRespectAnchor ? e.anchor.y : 0;
        (s = n.uvs),
          (s[0] = s[6] = -a),
          (s[1] = s[3] = -o),
          (s[2] = s[4] = 1 - a),
          (s[5] = s[7] = 1 - o),
          n.invalidate();
        var h = e._texture,
          u = h.baseTexture,
          f = e.tileTransform.localTransform,
          c = e.uvMatrix,
          l =
            u.isPowerOfTwo &&
            h.frame.width === u.width &&
            h.frame.height === u.height;
        l &&
          (u._glTextures[i.CONTEXT_UID]
            ? (l = u.wrapMode !== Dt.CLAMP)
            : u.wrapMode === Dt.CLAMP && (u.wrapMode = Dt.REPEAT));
        var d = l ? this.simpleShader : this.shader,
          p = h.width,
          _ = h.height,
          v = e._width,
          m = e._height;
        Mr.set(
          (f.a * p) / v,
          (f.b * p) / m,
          (f.c * _) / v,
          (f.d * _) / m,
          f.tx / v,
          f.ty / m
        ),
          Mr.invert(),
          l
            ? Mr.prepend(c.mapCoord)
            : ((d.uniforms.uMapCoord = c.mapCoord.toArray(!0)),
              (d.uniforms.uClampFrame = c.uClampFrame),
              (d.uniforms.uClampOffset = c.uClampOffset)),
          (d.uniforms.uTransform = Mr.toArray(!0)),
          (d.uniforms.uColor = xs(
            e.tint,
            e.worldAlpha,
            d.uniforms.uColor,
            u.alphaMode
          )),
          (d.uniforms.translationMatrix = e.transform.worldTransform.toArray(
            !0
          )),
          (d.uniforms.uSampler = h),
          i.shader.bind(d),
          i.geometry.bind(n),
          (this.state.blendMode = gs(e.blendMode, u.alphaMode)),
          i.state.set(this.state),
          i.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
      }),
      r
    );
  })(Ir);
/*!
 * @pixi/mesh - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/mesh is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var fn =
  function (t, r) {
    return (
      (fn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      fn(t, r)
    );
  };
function ln(t, r) {
  fn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var hv = (function () {
    function t(r, e) {
      (this.uvBuffer = r),
        (this.uvMatrix = e),
        (this.data = null),
        (this._bufferUpdateId = -1),
        (this._textureUpdateId = -1),
        (this._updateID = 0);
    }
    return (
      (t.prototype.update = function (r) {
        if (
          !(
            !r &&
            this._bufferUpdateId === this.uvBuffer._updateID &&
            this._textureUpdateId === this.uvMatrix._updateID
          )
        ) {
          (this._bufferUpdateId = this.uvBuffer._updateID),
            (this._textureUpdateId = this.uvMatrix._updateID);
          var e = this.uvBuffer.data;
          (!this.data || this.data.length !== e.length) &&
            (this.data = new Float32Array(e.length)),
            this.uvMatrix.multiplyUvs(e, this.data),
            this._updateID++;
        }
      }),
      t
    );
  })(),
  cn = new ht(),
  mo = new _r(),
  tr = (function (t) {
    ln(r, t);
    function r(e, i, n, s) {
      s === void 0 && (s = It.TRIANGLES);
      var a = t.call(this) || this;
      return (
        (a.geometry = e),
        (a.shader = i),
        (a.state = n || he.for2d()),
        (a.drawMode = s),
        (a.start = 0),
        (a.size = 0),
        (a.uvs = null),
        (a.indices = null),
        (a.vertexData = new Float32Array(1)),
        (a.vertexDirty = -1),
        (a._transformID = -1),
        (a._roundPixels = S.ROUND_PIXELS),
        (a.batchUvs = null),
        a
      );
    }
    return (
      Object.defineProperty(r.prototype, "geometry", {
        get: function () {
          return this._geometry;
        },
        set: function (e) {
          this._geometry !== e &&
            (this._geometry &&
              (this._geometry.refCount--,
              this._geometry.refCount === 0 && this._geometry.dispose()),
            (this._geometry = e),
            this._geometry && this._geometry.refCount++,
            (this.vertexDirty = -1));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "uvBuffer", {
        get: function () {
          return this.geometry.buffers[1];
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "verticesBuffer", {
        get: function () {
          return this.geometry.buffers[0];
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "material", {
        get: function () {
          return this.shader;
        },
        set: function (e) {
          this.shader = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "blendMode", {
        get: function () {
          return this.state.blendMode;
        },
        set: function (e) {
          this.state.blendMode = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "roundPixels", {
        get: function () {
          return this._roundPixels;
        },
        set: function (e) {
          this._roundPixels !== e && (this._transformID = -1),
            (this._roundPixels = e);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "tint", {
        get: function () {
          return "tint" in this.shader ? this.shader.tint : null;
        },
        set: function (e) {
          this.shader.tint = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "texture", {
        get: function () {
          return "texture" in this.shader ? this.shader.texture : null;
        },
        set: function (e) {
          this.shader.texture = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype._render = function (e) {
        var i = this.geometry.buffers[0].data,
          n = this.shader;
        n.batchable &&
        this.drawMode === It.TRIANGLES &&
        i.length < r.BATCHABLE_SIZE * 2
          ? this._renderToBatch(e)
          : this._renderDefault(e);
      }),
      (r.prototype._renderDefault = function (e) {
        var i = this.shader;
        (i.alpha = this.worldAlpha),
          i.update && i.update(),
          e.batch.flush(),
          (i.uniforms.translationMatrix = this.transform.worldTransform.toArray(
            !0
          )),
          e.shader.bind(i),
          e.state.set(this.state),
          e.geometry.bind(this.geometry, i),
          e.geometry.draw(
            this.drawMode,
            this.size,
            this.start,
            this.geometry.instanceCount
          );
      }),
      (r.prototype._renderToBatch = function (e) {
        var i = this.geometry,
          n = this.shader;
        n.uvMatrix && (n.uvMatrix.update(), this.calculateUvs()),
          this.calculateVertices(),
          (this.indices = i.indexBuffer.data),
          (this._tintRGB = n._tintRGB),
          (this._texture = n.texture);
        var s = this.material.pluginName;
        e.batch.setObjectRenderer(e.plugins[s]), e.plugins[s].render(this);
      }),
      (r.prototype.calculateVertices = function () {
        var e = this.geometry,
          i = e.buffers[0],
          n = i.data,
          s = i._updateID;
        if (
          !(
            s === this.vertexDirty &&
            this._transformID === this.transform._worldID
          )
        ) {
          (this._transformID = this.transform._worldID),
            this.vertexData.length !== n.length &&
              (this.vertexData = new Float32Array(n.length));
          for (
            var a = this.transform.worldTransform,
              o = a.a,
              h = a.b,
              u = a.c,
              f = a.d,
              c = a.tx,
              l = a.ty,
              d = this.vertexData,
              p = 0;
            p < d.length / 2;
            p++
          ) {
            var _ = n[p * 2],
              v = n[p * 2 + 1];
            (d[p * 2] = o * _ + u * v + c), (d[p * 2 + 1] = h * _ + f * v + l);
          }
          if (this._roundPixels)
            for (var m = S.RESOLUTION, p = 0; p < d.length; ++p)
              d[p] = Math.round(((d[p] * m) | 0) / m);
          this.vertexDirty = s;
        }
      }),
      (r.prototype.calculateUvs = function () {
        var e = this.geometry.buffers[1],
          i = this.shader;
        i.uvMatrix.isSimple
          ? (this.uvs = e.data)
          : (this.batchUvs || (this.batchUvs = new hv(e, i.uvMatrix)),
            this.batchUvs.update(),
            (this.uvs = this.batchUvs.data));
      }),
      (r.prototype._calculateBounds = function () {
        this.calculateVertices(),
          this._bounds.addVertexData(
            this.vertexData,
            0,
            this.vertexData.length
          );
      }),
      (r.prototype.containsPoint = function (e) {
        if (!this.getBounds().contains(e.x, e.y)) return !1;
        this.worldTransform.applyInverse(e, cn);
        for (
          var i = this.geometry.getBuffer("aVertexPosition").data,
            n = mo.points,
            s = this.geometry.getIndex().data,
            a = s.length,
            o = this.drawMode === 4 ? 3 : 1,
            h = 0;
          h + 2 < a;
          h += o
        ) {
          var u = s[h] * 2,
            f = s[h + 1] * 2,
            c = s[h + 2] * 2;
          if (
            ((n[0] = i[u]),
            (n[1] = i[u + 1]),
            (n[2] = i[f]),
            (n[3] = i[f + 1]),
            (n[4] = i[c]),
            (n[5] = i[c + 1]),
            mo.contains(cn.x, cn.y))
          )
            return !0;
        }
        return !1;
      }),
      (r.prototype.destroy = function (e) {
        t.prototype.destroy.call(this, e),
          this._cachedTexture &&
            (this._cachedTexture.destroy(), (this._cachedTexture = null)),
          (this.geometry = null),
          (this.shader = null),
          (this.state = null),
          (this.uvs = null),
          (this.indices = null),
          (this.vertexData = null);
      }),
      (r.BATCHABLE_SIZE = 100),
      r
    );
  })(Ft),
  uv = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`,
  fv = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTextureMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;
}
`,
  er = (function (t) {
    ln(r, t);
    function r(e, i) {
      var n = this,
        s = {
          uSampler: e,
          alpha: 1,
          uTextureMatrix: ut.IDENTITY,
          uColor: new Float32Array([1, 1, 1, 1]),
        };
      return (
        (i = Object.assign(
          { tint: 16777215, alpha: 1, pluginName: "batch" },
          i
        )),
        i.uniforms && Object.assign(s, i.uniforms),
        (n = t.call(this, i.program || ze.from(fv, uv), s) || this),
        (n._colorDirty = !1),
        (n.uvMatrix = new Gi(e)),
        (n.batchable = i.program === void 0),
        (n.pluginName = i.pluginName),
        (n.tint = i.tint),
        (n.alpha = i.alpha),
        n
      );
    }
    return (
      Object.defineProperty(r.prototype, "texture", {
        get: function () {
          return this.uniforms.uSampler;
        },
        set: function (e) {
          this.uniforms.uSampler !== e &&
            ((this.uniforms.uSampler = e), (this.uvMatrix.texture = e));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "alpha", {
        get: function () {
          return this._alpha;
        },
        set: function (e) {
          e !== this._alpha && ((this._alpha = e), (this._colorDirty = !0));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "tint", {
        get: function () {
          return this._tint;
        },
        set: function (e) {
          e !== this._tint &&
            ((this._tint = e),
            (this._tintRGB = (e >> 16) + (e & 65280) + ((e & 255) << 16)),
            (this._colorDirty = !0));
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.update = function () {
        if (this._colorDirty) {
          this._colorDirty = !1;
          var e = this.texture.baseTexture;
          xs(this._tint, this._alpha, this.uniforms.uColor, e.alphaMode);
        }
        this.uvMatrix.update() &&
          (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
      }),
      r
    );
  })(Yt),
  Dr = (function (t) {
    ln(r, t);
    function r(e, i, n) {
      var s = t.call(this) || this,
        a = new dt(e),
        o = new dt(i, !0),
        h = new dt(n, !0, !0);
      return (
        s
          .addAttribute("aVertexPosition", a, 2, !1, G.FLOAT)
          .addAttribute("aTextureCoord", o, 2, !1, G.FLOAT)
          .addIndex(h),
        (s._updateId = -1),
        s
      );
    }
    return (
      Object.defineProperty(r.prototype, "vertexDirtyId", {
        get: function () {
          return this.buffers[0]._updateID;
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(He);
/*!
 * @pixi/text-bitmap - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/text-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var dn =
  function (t, r) {
    return (
      (dn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      dn(t, r)
    );
  };
function lv(t, r) {
  dn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var kr = (function () {
    function t() {
      (this.info = []),
        (this.common = []),
        (this.page = []),
        (this.char = []),
        (this.kerning = []),
        (this.distanceField = []);
    }
    return t;
  })(),
  cv = (function () {
    function t() {}
    return (
      (t.test = function (r) {
        return typeof r == "string" && r.indexOf("info face=") === 0;
      }),
      (t.parse = function (r) {
        var e = r.match(/^[a-z]+\s+.+$/gm),
          i = {
            info: [],
            common: [],
            page: [],
            char: [],
            chars: [],
            kerning: [],
            kernings: [],
            distanceField: [],
          };
        for (var n in e) {
          var s = e[n].match(/^[a-z]+/gm)[0],
            a = e[n].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm),
            o = {};
          for (var h in a) {
            var u = a[h].split("="),
              f = u[0],
              c = u[1].replace(/"/gm, ""),
              l = parseFloat(c),
              d = isNaN(l) ? c : l;
            o[f] = d;
          }
          i[s].push(o);
        }
        var p = new kr();
        return (
          i.info.forEach(function (_) {
            return p.info.push({ face: _.face, size: parseInt(_.size, 10) });
          }),
          i.common.forEach(function (_) {
            return p.common.push({ lineHeight: parseInt(_.lineHeight, 10) });
          }),
          i.page.forEach(function (_) {
            return p.page.push({ id: parseInt(_.id, 10), file: _.file });
          }),
          i.char.forEach(function (_) {
            return p.char.push({
              id: parseInt(_.id, 10),
              page: parseInt(_.page, 10),
              x: parseInt(_.x, 10),
              y: parseInt(_.y, 10),
              width: parseInt(_.width, 10),
              height: parseInt(_.height, 10),
              xoffset: parseInt(_.xoffset, 10),
              yoffset: parseInt(_.yoffset, 10),
              xadvance: parseInt(_.xadvance, 10),
            });
          }),
          i.kerning.forEach(function (_) {
            return p.kerning.push({
              first: parseInt(_.first, 10),
              second: parseInt(_.second, 10),
              amount: parseInt(_.amount, 10),
            });
          }),
          i.distanceField.forEach(function (_) {
            return p.distanceField.push({
              distanceRange: parseInt(_.distanceRange, 10),
              fieldType: _.fieldType,
            });
          }),
          p
        );
      }),
      t
    );
  })(),
  pn = (function () {
    function t() {}
    return (
      (t.test = function (r) {
        return (
          r instanceof XMLDocument &&
          r.getElementsByTagName("page").length &&
          r.getElementsByTagName("info")[0].getAttribute("face") !== null
        );
      }),
      (t.parse = function (r) {
        for (
          var e = new kr(),
            i = r.getElementsByTagName("info"),
            n = r.getElementsByTagName("common"),
            s = r.getElementsByTagName("page"),
            a = r.getElementsByTagName("char"),
            o = r.getElementsByTagName("kerning"),
            h = r.getElementsByTagName("distanceField"),
            u = 0;
          u < i.length;
          u++
        )
          e.info.push({
            face: i[u].getAttribute("face"),
            size: parseInt(i[u].getAttribute("size"), 10),
          });
        for (var u = 0; u < n.length; u++)
          e.common.push({
            lineHeight: parseInt(n[u].getAttribute("lineHeight"), 10),
          });
        for (var u = 0; u < s.length; u++)
          e.page.push({
            id: parseInt(s[u].getAttribute("id"), 10) || 0,
            file: s[u].getAttribute("file"),
          });
        for (var u = 0; u < a.length; u++) {
          var f = a[u];
          e.char.push({
            id: parseInt(f.getAttribute("id"), 10),
            page: parseInt(f.getAttribute("page"), 10) || 0,
            x: parseInt(f.getAttribute("x"), 10),
            y: parseInt(f.getAttribute("y"), 10),
            width: parseInt(f.getAttribute("width"), 10),
            height: parseInt(f.getAttribute("height"), 10),
            xoffset: parseInt(f.getAttribute("xoffset"), 10),
            yoffset: parseInt(f.getAttribute("yoffset"), 10),
            xadvance: parseInt(f.getAttribute("xadvance"), 10),
          });
        }
        for (var u = 0; u < o.length; u++)
          e.kerning.push({
            first: parseInt(o[u].getAttribute("first"), 10),
            second: parseInt(o[u].getAttribute("second"), 10),
            amount: parseInt(o[u].getAttribute("amount"), 10),
          });
        for (var u = 0; u < h.length; u++)
          e.distanceField.push({
            fieldType: h[u].getAttribute("fieldType"),
            distanceRange: parseInt(h[u].getAttribute("distanceRange"), 10),
          });
        return e;
      }),
      t
    );
  })(),
  dv = (function () {
    function t() {}
    return (
      (t.test = function (r) {
        if (typeof r == "string" && r.indexOf("<font>") > -1) {
          var e = new self.DOMParser().parseFromString(r, "text/xml");
          return pn.test(e);
        }
        return !1;
      }),
      (t.parse = function (r) {
        var e = new self.DOMParser().parseFromString(r, "text/xml");
        return pn.parse(e);
      }),
      t
    );
  })(),
  vn = [cv, pn, dv];
function yo(t) {
  for (var r = 0; r < vn.length; r++) if (vn[r].test(t)) return vn[r];
  return null;
}
function pv(t, r, e, i, n, s) {
  var a = e.fill;
  if (Array.isArray(a)) {
    if (a.length === 1) return a[0];
  } else return a;
  var o,
    h = e.dropShadow ? e.dropShadowDistance : 0,
    u = e.padding || 0,
    f = t.width / i - h - u * 2,
    c = t.height / i - h - u * 2,
    l = a.slice(),
    d = e.fillGradientStops.slice();
  if (!d.length) for (var p = l.length + 1, _ = 1; _ < p; ++_) d.push(_ / p);
  if (
    (l.unshift(a[0]),
    d.unshift(0),
    l.push(a[a.length - 1]),
    d.push(1),
    e.fillGradientType === Je.LINEAR_VERTICAL)
  ) {
    o = r.createLinearGradient(f / 2, u, f / 2, c + u);
    for (
      var v = 0,
        m = s.fontProperties.fontSize + e.strokeThickness,
        g = m / c,
        _ = 0;
      _ < n.length;
      _++
    )
      for (var T = s.lineHeight * _, I = 0; I < l.length; I++) {
        var x = 0;
        typeof d[I] == "number" ? (x = d[I]) : (x = I / l.length);
        var y = T / c + x * g,
          C = Math.max(v, y);
        (C = Math.min(C, 1)), o.addColorStop(C, l[I]), (v = C);
      }
  } else {
    o = r.createLinearGradient(u, c / 2, f + u, c / 2);
    for (var N = l.length + 1, b = 1, _ = 0; _ < l.length; _++) {
      var R = void 0;
      typeof d[_] == "number" ? (R = d[_]) : (R = b / N),
        o.addColorStop(R, l[_]),
        b++;
    }
  }
  return o;
}
function vv(t, r, e, i, n, s, a) {
  var o = e.text,
    h = e.fontProperties;
  r.translate(i, n), r.scale(s, s);
  var u = a.strokeThickness / 2,
    f = -(a.strokeThickness / 2);
  if (
    ((r.font = a.toFontString()),
    (r.lineWidth = a.strokeThickness),
    (r.textBaseline = a.textBaseline),
    (r.lineJoin = a.lineJoin),
    (r.miterLimit = a.miterLimit),
    (r.fillStyle = pv(t, r, a, s, [o], e)),
    (r.strokeStyle = a.stroke),
    a.dropShadow)
  ) {
    var c = a.dropShadowColor,
      l = ye(typeof c == "number" ? c : ms(c)),
      d = a.dropShadowBlur * s,
      p = a.dropShadowDistance * s;
    (r.shadowColor =
      "rgba(" +
      l[0] * 255 +
      "," +
      l[1] * 255 +
      "," +
      l[2] * 255 +
      "," +
      a.dropShadowAlpha +
      ")"),
      (r.shadowBlur = d),
      (r.shadowOffsetX = Math.cos(a.dropShadowAngle) * p),
      (r.shadowOffsetY = Math.sin(a.dropShadowAngle) * p);
  } else
    (r.shadowColor = "black"),
      (r.shadowBlur = 0),
      (r.shadowOffsetX = 0),
      (r.shadowOffsetY = 0);
  a.stroke &&
    a.strokeThickness &&
    r.strokeText(o, u, f + e.lineHeight - h.descent),
    a.fill && r.fillText(o, u, f + e.lineHeight - h.descent),
    r.setTransform(1, 0, 0, 1, 0, 0),
    (r.fillStyle = "rgba(0, 0, 0, 0)");
}
function go(t) {
  return Array.from ? Array.from(t) : t.split("");
}
function _v(t) {
  typeof t == "string" && (t = [t]);
  for (var r = [], e = 0, i = t.length; e < i; e++) {
    var n = t[e];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error(
          "[BitmapFont]: Invalid character range length, expecting 2 got " +
            n.length +
            "."
        );
      var s = n[0].charCodeAt(0),
        a = n[1].charCodeAt(0);
      if (a < s) throw new Error("[BitmapFont]: Invalid character range.");
      for (var o = s, h = a; o <= h; o++) r.push(String.fromCharCode(o));
    } else r.push.apply(r, go(n));
  }
  if (r.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return r;
}
function Xr(t) {
  return t.codePointAt ? t.codePointAt(0) : t.charCodeAt(0);
}
var Ae = (function () {
    function t(r, e, i) {
      var n,
        s,
        a = r.info[0],
        o = r.common[0],
        h = r.page[0],
        u = r.distanceField[0],
        f = pr(h.file),
        c = {};
      (this._ownsTextures = i),
        (this.font = a.face),
        (this.size = a.size),
        (this.lineHeight = o.lineHeight / f),
        (this.chars = {}),
        (this.pageTextures = c);
      for (var l = 0; l < r.page.length; l++) {
        var d = r.page[l],
          p = d.id,
          _ = d.file;
        (c[p] = e instanceof Array ? e[l] : e[_]),
          (u == null ? void 0 : u.fieldType) &&
            u.fieldType !== "none" &&
            (c[p].baseTexture.alphaMode = Ot.NO_PREMULTIPLIED_ALPHA);
      }
      for (var l = 0; l < r.char.length; l++) {
        var v = r.char[l],
          p = v.id,
          m = v.page,
          g = r.char[l],
          T = g.x,
          I = g.y,
          x = g.width,
          y = g.height,
          C = g.xoffset,
          N = g.yoffset,
          b = g.xadvance;
        (T /= f), (I /= f), (x /= f), (y /= f), (C /= f), (N /= f), (b /= f);
        var R = new z(T + c[m].frame.x / f, I + c[m].frame.y / f, x, y);
        this.chars[p] = {
          xOffset: C,
          yOffset: N,
          xAdvance: b,
          kerning: {},
          texture: new B(c[m].baseTexture, R),
          page: m,
        };
      }
      for (var l = 0; l < r.kerning.length; l++) {
        var F = r.kerning[l],
          O = F.first,
          k = F.second,
          Q = F.amount;
        (O /= f),
          (k /= f),
          (Q /= f),
          this.chars[k] && (this.chars[k].kerning[O] = Q);
      }
      (this.distanceFieldRange = u == null ? void 0 : u.distanceRange),
        (this.distanceFieldType =
          (s =
            (n = u == null ? void 0 : u.fieldType) === null || n === void 0
              ? void 0
              : n.toLowerCase()) !== null && s !== void 0
            ? s
            : "none");
    }
    return (
      (t.prototype.destroy = function () {
        for (var r in this.chars)
          this.chars[r].texture.destroy(), (this.chars[r].texture = null);
        for (var r in this.pageTextures)
          this._ownsTextures && this.pageTextures[r].destroy(!0),
            (this.pageTextures[r] = null);
        (this.chars = null), (this.pageTextures = null);
      }),
      (t.install = function (r, e, i) {
        var n;
        if (r instanceof kr) n = r;
        else {
          var s = yo(r);
          if (!s) throw new Error("Unrecognized data format for font.");
          n = s.parse(r);
        }
        e instanceof B && (e = [e]);
        var a = new t(n, e, i);
        return (t.available[a.font] = a), a;
      }),
      (t.uninstall = function (r) {
        var e = t.available[r];
        if (!e) throw new Error("No font found named '" + r + "'");
        e.destroy(), delete t.available[r];
      }),
      (t.from = function (r, e, i) {
        if (!r) throw new Error("[BitmapFont] Property `name` is required.");
        var n = Object.assign({}, t.defaultOptions, i),
          s = n.chars,
          a = n.padding,
          o = n.resolution,
          h = n.textureWidth,
          u = n.textureHeight,
          f = _v(s),
          c = e instanceof Pe ? e : new Pe(e),
          l = h,
          d = new kr();
        (d.info[0] = { face: c.fontFamily, size: c.fontSize }),
          (d.common[0] = { lineHeight: c.fontSize });
        for (
          var p = 0, _ = 0, v, m, g, T = 0, I = [], x = 0;
          x < f.length;
          x++
        ) {
          v ||
            ((v = document.createElement("canvas")),
            (v.width = h),
            (v.height = u),
            (m = v.getContext("2d")),
            (g = new W(v, { resolution: o })),
            I.push(new B(g)),
            d.page.push({ id: I.length - 1, file: "" }));
          var y = bt.measureText(f[x], c, !1, v),
            C = y.width,
            N = Math.ceil(y.height),
            b = Math.ceil((c.fontStyle === "italic" ? 2 : 1) * C);
          if (_ >= u - N * o) {
            if (_ === 0)
              throw new Error(
                "[BitmapFont] textureHeight " +
                  u +
                  "px is " +
                  ("too small for " + c.fontSize + "px fonts")
              );
            --x, (v = null), (m = null), (g = null), (_ = 0), (p = 0), (T = 0);
            continue;
          }
          if (
            ((T = Math.max(N + y.fontProperties.descent, T)), b * o + p >= l)
          ) {
            --x, (_ += T * o), (_ = Math.ceil(_)), (p = 0), (T = 0);
            continue;
          }
          vv(v, m, y, p, _, o, c);
          var R = Xr(y.text);
          d.char.push({
            id: R,
            page: I.length - 1,
            x: p / o,
            y: _ / o,
            width: b,
            height: N,
            xoffset: 0,
            yoffset: 0,
            xadvance: Math.ceil(
              C -
                (c.dropShadow ? c.dropShadowDistance : 0) -
                (c.stroke ? c.strokeThickness : 0)
            ),
          }),
            (p += (b + 2 * a) * o),
            (p = Math.ceil(p));
        }
        for (var x = 0, F = f.length; x < F; x++)
          for (var O = f[x], k = 0; k < F; k++) {
            var Q = f[k],
              A = m.measureText(O).width,
              P = m.measureText(Q).width,
              X = m.measureText(O + Q).width,
              pt = X - (A + P);
            pt && d.kerning.push({ first: Xr(O), second: Xr(Q), amount: pt });
          }
        var yt = new t(d, I, !0);
        return (
          t.available[r] !== void 0 && t.uninstall(r), (t.available[r] = yt), yt
        );
      }),
      (t.ALPHA = [["a", "z"], ["A", "Z"], " "]),
      (t.NUMERIC = [["0", "9"]]),
      (t.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "]),
      (t.ASCII = [[" ", "~"]]),
      (t.defaultOptions = {
        resolution: 1,
        textureWidth: 512,
        textureHeight: 512,
        padding: 4,
        chars: t.ALPHANUMERIC,
      }),
      (t.available = {}),
      t
    );
  })(),
  mv = `// Pixi texture info\r
varying vec2 vTextureCoord;\r
uniform sampler2D uSampler;\r
\r
// Tint\r
uniform vec4 uColor;\r
\r
// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r
uniform float uFWidth;\r
\r
void main(void) {\r
\r
  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r
  vec4 texColor = texture2D(uSampler, vTextureCoord);\r
\r
  // MSDF\r
  float median = texColor.r + texColor.g + texColor.b -\r
                  min(texColor.r, min(texColor.g, texColor.b)) -\r
                  max(texColor.r, max(texColor.g, texColor.b));\r
  // SDF\r
  median = min(median, texColor.a);\r
\r
  float screenPxDistance = uFWidth * (median - 0.5);\r
  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r
\r
  // NPM Textures, NPM outputs\r
  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r
\r
}\r
`,
  yv = `// Mesh material default fragment\r
attribute vec2 aVertexPosition;\r
attribute vec2 aTextureCoord;\r
\r
uniform mat3 projectionMatrix;\r
uniform mat3 translationMatrix;\r
uniform mat3 uTextureMatrix;\r
\r
varying vec2 vTextureCoord;\r
\r
void main(void)\r
{\r
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r
\r
    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r
}\r
`,
  gv = [],
  xv = [],
  xo = [];
(function (t) {
  lv(r, t);
  function r(e, i) {
    i === void 0 && (i = {});
    var n = t.call(this) || this;
    n._tint = 16777215;
    var s = Object.assign({}, r.styleDefaults, i),
      a = s.align,
      o = s.tint,
      h = s.maxWidth,
      u = s.letterSpacing,
      f = s.fontName,
      c = s.fontSize;
    if (!Ae.available[f]) throw new Error('Missing BitmapFont "' + f + '"');
    return (
      (n._activePagesMeshData = []),
      (n._textWidth = 0),
      (n._textHeight = 0),
      (n._align = a),
      (n._tint = o),
      (n._fontName = f),
      (n._fontSize = c || Ae.available[f].size),
      (n._text = e),
      (n._maxWidth = h),
      (n._maxLineHeight = 0),
      (n._letterSpacing = u),
      (n._anchor = new Te(
        function () {
          n.dirty = !0;
        },
        n,
        0,
        0
      )),
      (n._roundPixels = S.ROUND_PIXELS),
      (n.dirty = !0),
      (n._textureCache = {}),
      n
    );
  }
  return (
    (r.prototype.updateText = function () {
      for (
        var e,
          i = Ae.available[this._fontName],
          n = this._fontSize / i.size,
          s = new ht(),
          a = [],
          o = [],
          h = [],
          u =
            this._text.replace(
              /(?:\r\n|\r)/g,
              `
`
            ) || " ",
          f = go(u),
          c = (this._maxWidth * i.size) / this._fontSize,
          l = i.distanceFieldType === "none" ? gv : xv,
          d = null,
          p = 0,
          _ = 0,
          v = 0,
          m = -1,
          g = 0,
          T = 0,
          I = 0,
          x = 0,
          y = 0;
        y < f.length;
        y++
      ) {
        var C = f[y],
          N = Xr(C);
        if (
          (/(?:\s)/.test(C) && ((m = y), (g = p), x++),
          C === "\r" ||
            C ===
              `
`)
        ) {
          o.push(p),
            h.push(-1),
            (_ = Math.max(_, p)),
            ++v,
            ++T,
            (s.x = 0),
            (s.y += i.lineHeight),
            (d = null),
            (x = 0);
          continue;
        }
        var b = i.chars[N];
        if (!!b) {
          d && b.kerning[d] && (s.x += b.kerning[d]);
          var R = xo.pop() || {
            texture: B.EMPTY,
            line: 0,
            charCode: 0,
            prevSpaces: 0,
            position: new ht(),
          };
          (R.texture = b.texture),
            (R.line = v),
            (R.charCode = N),
            (R.position.x = s.x + b.xOffset + this._letterSpacing / 2),
            (R.position.y = s.y + b.yOffset),
            (R.prevSpaces = x),
            a.push(R),
            (p = R.position.x + b.texture.orig.width),
            (s.x += b.xAdvance + this._letterSpacing),
            (I = Math.max(I, b.yOffset + b.texture.height)),
            (d = N),
            m !== -1 &&
              c > 0 &&
              s.x > c &&
              (++T,
              ge(a, 1 + m - T, 1 + y - m),
              (y = m),
              (m = -1),
              o.push(g),
              h.push(a.length > 0 ? a[a.length - 1].prevSpaces : 0),
              (_ = Math.max(_, g)),
              v++,
              (s.x = 0),
              (s.y += i.lineHeight),
              (d = null),
              (x = 0));
        }
      }
      var F = f[f.length - 1];
      F !== "\r" &&
        F !==
          `
` &&
        (/(?:\s)/.test(F) && (p = g),
        o.push(p),
        (_ = Math.max(_, p)),
        h.push(-1));
      for (var O = [], y = 0; y <= v; y++) {
        var k = 0;
        this._align === "right"
          ? (k = _ - o[y])
          : this._align === "center"
          ? (k = (_ - o[y]) / 2)
          : this._align === "justify" && (k = h[y] < 0 ? 0 : (_ - o[y]) / h[y]),
          O.push(k);
      }
      for (
        var Q = a.length, A = {}, P = [], X = this._activePagesMeshData, y = 0;
        y < X.length;
        y++
      )
        l.push(X[y]);
      for (var y = 0; y < Q; y++) {
        var pt = a[y].texture,
          yt = pt.baseTexture.uid;
        if (!A[yt]) {
          var E = l.pop();
          if (!E) {
            var L = new Dr(),
              M = void 0,
              j = void 0;
            i.distanceFieldType === "none"
              ? ((M = new er(B.EMPTY)), (j = U.NORMAL))
              : ((M = new er(B.EMPTY, {
                  program: ze.from(yv, mv),
                  uniforms: { uFWidth: 0 },
                })),
                (j = U.NORMAL_NPM));
            var Z = new tr(L, M);
            (Z.blendMode = j),
              (E = {
                index: 0,
                indexCount: 0,
                vertexCount: 0,
                uvsCount: 0,
                total: 0,
                mesh: Z,
                vertices: null,
                uvs: null,
                indices: null,
              });
          }
          (E.index = 0),
            (E.indexCount = 0),
            (E.vertexCount = 0),
            (E.uvsCount = 0),
            (E.total = 0);
          var rt = this._textureCache;
          (rt[yt] = rt[yt] || new B(pt.baseTexture)),
            (E.mesh.texture = rt[yt]),
            (E.mesh.tint = this._tint),
            P.push(E),
            (A[yt] = E);
        }
        A[yt].total++;
      }
      for (var y = 0; y < X.length; y++)
        P.indexOf(X[y]) === -1 && this.removeChild(X[y].mesh);
      for (var y = 0; y < P.length; y++)
        P[y].mesh.parent !== this && this.addChild(P[y].mesh);
      this._activePagesMeshData = P;
      for (var y in A) {
        var E = A[y],
          $ = E.total;
        if (
          !(
            ((e = E.indices) === null || e === void 0 ? void 0 : e.length) >
            6 * $
          ) ||
          E.vertices.length < tr.BATCHABLE_SIZE * 2
        )
          (E.vertices = new Float32Array(4 * 2 * $)),
            (E.uvs = new Float32Array(4 * 2 * $)),
            (E.indices = new Uint16Array(6 * $));
        else
          for (
            var lt = E.total, vt = E.vertices, it = lt * 4 * 2;
            it < vt.length;
            it++
          )
            vt[it] = 0;
        E.mesh.size = 6 * $;
      }
      for (var y = 0; y < Q; y++) {
        var C = a[y],
          at =
            C.position.x +
            O[C.line] * (this._align === "justify" ? C.prevSpaces : 1);
        this._roundPixels && (at = Math.round(at));
        var Y = at * n,
          J = C.position.y * n,
          pt = C.texture,
          H = A[pt.baseTexture.uid],
          gt = pt.frame,
          _t = pt._uvs,
          V = H.index++;
        (H.indices[V * 6 + 0] = 0 + V * 4),
          (H.indices[V * 6 + 1] = 1 + V * 4),
          (H.indices[V * 6 + 2] = 2 + V * 4),
          (H.indices[V * 6 + 3] = 0 + V * 4),
          (H.indices[V * 6 + 4] = 2 + V * 4),
          (H.indices[V * 6 + 5] = 3 + V * 4),
          (H.vertices[V * 8 + 0] = Y),
          (H.vertices[V * 8 + 1] = J),
          (H.vertices[V * 8 + 2] = Y + gt.width * n),
          (H.vertices[V * 8 + 3] = J),
          (H.vertices[V * 8 + 4] = Y + gt.width * n),
          (H.vertices[V * 8 + 5] = J + gt.height * n),
          (H.vertices[V * 8 + 6] = Y),
          (H.vertices[V * 8 + 7] = J + gt.height * n),
          (H.uvs[V * 8 + 0] = _t.x0),
          (H.uvs[V * 8 + 1] = _t.y0),
          (H.uvs[V * 8 + 2] = _t.x1),
          (H.uvs[V * 8 + 3] = _t.y1),
          (H.uvs[V * 8 + 4] = _t.x2),
          (H.uvs[V * 8 + 5] = _t.y2),
          (H.uvs[V * 8 + 6] = _t.x3),
          (H.uvs[V * 8 + 7] = _t.y3);
      }
      (this._textWidth = _ * n), (this._textHeight = (s.y + i.lineHeight) * n);
      for (var y in A) {
        var E = A[y];
        if (this.anchor.x !== 0 || this.anchor.y !== 0)
          for (
            var Pt = 0,
              de = this._textWidth * this.anchor.x,
              ir = this._textHeight * this.anchor.y,
              Rn = 0;
            Rn < E.total;
            Rn++
          )
            (E.vertices[Pt++] -= de),
              (E.vertices[Pt++] -= ir),
              (E.vertices[Pt++] -= de),
              (E.vertices[Pt++] -= ir),
              (E.vertices[Pt++] -= de),
              (E.vertices[Pt++] -= ir),
              (E.vertices[Pt++] -= de),
              (E.vertices[Pt++] -= ir);
        this._maxLineHeight = I * n;
        var wn = E.mesh.geometry.getBuffer("aVertexPosition"),
          Cn = E.mesh.geometry.getBuffer("aTextureCoord"),
          Pn = E.mesh.geometry.getIndex();
        (wn.data = E.vertices),
          (Cn.data = E.uvs),
          (Pn.data = E.indices),
          wn.update(),
          Cn.update(),
          Pn.update();
      }
      for (var y = 0; y < a.length; y++) xo.push(a[y]);
    }),
    (r.prototype.updateTransform = function () {
      this.validate(), this.containerUpdateTransform();
    }),
    (r.prototype._render = function (e) {
      var i = Ae.available[this._fontName],
        n = i.distanceFieldRange,
        s = i.distanceFieldType,
        a = i.size;
      if (s !== "none")
        for (
          var o = this.worldTransform,
            h = o.a,
            u = o.b,
            f = o.c,
            c = o.d,
            l = Math.sqrt(h * h + u * u),
            d = Math.sqrt(f * f + c * c),
            p = (Math.abs(l) + Math.abs(d)) / 2,
            _ = this._fontSize / a,
            v = 0,
            m = this._activePagesMeshData;
          v < m.length;
          v++
        ) {
          var g = m[v];
          g.mesh.shader.uniforms.uFWidth = p * n * _ * e.resolution;
        }
      t.prototype._render.call(this, e);
    }),
    (r.prototype.getLocalBounds = function () {
      return this.validate(), t.prototype.getLocalBounds.call(this);
    }),
    (r.prototype.validate = function () {
      this.dirty && (this.updateText(), (this.dirty = !1));
    }),
    Object.defineProperty(r.prototype, "tint", {
      get: function () {
        return this._tint;
      },
      set: function (e) {
        if (this._tint !== e) {
          this._tint = e;
          for (var i = 0; i < this._activePagesMeshData.length; i++)
            this._activePagesMeshData[i].mesh.tint = e;
        }
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "align", {
      get: function () {
        return this._align;
      },
      set: function (e) {
        this._align !== e && ((this._align = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "fontName", {
      get: function () {
        return this._fontName;
      },
      set: function (e) {
        if (!Ae.available[e]) throw new Error('Missing BitmapFont "' + e + '"');
        this._fontName !== e && ((this._fontName = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "fontSize", {
      get: function () {
        return this._fontSize;
      },
      set: function (e) {
        this._fontSize !== e && ((this._fontSize = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "anchor", {
      get: function () {
        return this._anchor;
      },
      set: function (e) {
        typeof e == "number" ? this._anchor.set(e) : this._anchor.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "text", {
      get: function () {
        return this._text;
      },
      set: function (e) {
        (e = String(e == null ? "" : e)),
          this._text !== e && ((this._text = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "maxWidth", {
      get: function () {
        return this._maxWidth;
      },
      set: function (e) {
        this._maxWidth !== e && ((this._maxWidth = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "maxLineHeight", {
      get: function () {
        return this.validate(), this._maxLineHeight;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "textWidth", {
      get: function () {
        return this.validate(), this._textWidth;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "letterSpacing", {
      get: function () {
        return this._letterSpacing;
      },
      set: function (e) {
        this._letterSpacing !== e &&
          ((this._letterSpacing = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "roundPixels", {
      get: function () {
        return this._roundPixels;
      },
      set: function (e) {
        e !== this._roundPixels && ((this._roundPixels = e), (this.dirty = !0));
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "textHeight", {
      get: function () {
        return this.validate(), this._textHeight;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype.destroy = function (e) {
      var i = this._textureCache;
      for (var n in i) {
        var s = i[n];
        s.destroy(), delete i[n];
      }
      (this._textureCache = null), t.prototype.destroy.call(this, e);
    }),
    (r.styleDefaults = {
      align: "left",
      tint: 16777215,
      maxWidth: 0,
      letterSpacing: 0,
    }),
    r
  );
})(Ft);
var Tv = (function () {
  function t() {}
  return (
    (t.add = function () {
      st.setExtensionXhrType("fnt", st.XHR_RESPONSE_TYPE.TEXT);
    }),
    (t.use = function (r, e) {
      var i = yo(r.data);
      if (!i) {
        e();
        return;
      }
      for (
        var n = t.getBaseUrl(this, r),
          s = i.parse(r.data),
          a = {},
          o = function (_) {
            (a[_.metadata.pageFile] = _.texture),
              Object.keys(a).length === s.page.length &&
                ((r.bitmapFont = Ae.install(s, a, !0)), e());
          },
          h = 0;
        h < s.page.length;
        ++h
      ) {
        var u = s.page[h].file,
          f = n + u,
          c = !1;
        for (var l in this.resources) {
          var d = this.resources[l];
          if (d.url === f) {
            (d.metadata.pageFile = u),
              d.texture ? o(d) : d.onAfterMiddleware.add(o),
              (c = !0);
            break;
          }
        }
        if (!c) {
          var p = {
            crossOrigin: r.crossOrigin,
            loadType: st.LOAD_TYPE.IMAGE,
            metadata: Object.assign({ pageFile: u }, r.metadata.imageMetadata),
            parentResource: r,
          };
          this.add(f, p, o);
        }
      }
    }),
    (t.getBaseUrl = function (r, e) {
      var i = e.isDataUrl ? "" : t.dirname(e.url);
      return (
        e.isDataUrl &&
          (i === "." && (i = ""),
          r.baseUrl &&
            i &&
            r.baseUrl.charAt(r.baseUrl.length - 1) === "/" &&
            (i += "/")),
        (i = i.replace(r.baseUrl, "")),
        i && i.charAt(i.length - 1) !== "/" && (i += "/"),
        i
      );
    }),
    (t.dirname = function (r) {
      var e = r
        .replace(/\\/g, "/")
        .replace(/\/$/, "")
        .replace(/\/[^\/]*$/, "");
      return e === r ? "." : e === "" ? "/" : e;
    }),
    t
  );
})();
/*!
 * @pixi/filter-alpha - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-alpha is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var _n =
  function (t, r) {
    return (
      (_n =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      _n(t, r)
    );
  };
function bv(t, r) {
  _n(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Ev = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
(function (t) {
  bv(r, t);
  function r(e) {
    e === void 0 && (e = 1);
    var i = t.call(this, Rd, Ev, { uAlpha: 1 }) || this;
    return (i.alpha = e), i;
  }
  return (
    Object.defineProperty(r.prototype, "alpha", {
      get: function () {
        return this.uniforms.uAlpha;
      },
      set: function (e) {
        this.uniforms.uAlpha = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})($t);
/*!
 * @pixi/filter-blur - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var mn =
  function (t, r) {
    return (
      (mn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      mn(t, r)
    );
  };
function To(t, r) {
  mn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Iv = `
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function Rv(t, r) {
  var e = Math.ceil(t / 2),
    i = Iv,
    n = "",
    s;
  r
    ? (s =
        "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);")
    : (s =
        "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);");
  for (var a = 0; a < t; a++) {
    var o = s.replace("%index%", a.toString());
    (o = o.replace("%sampleIndex%", a - (e - 1) + ".0")),
      (n += o),
      (n += `
`);
  }
  return (
    (i = i.replace("%blur%", n)), (i = i.replace("%size%", t.toString())), i
  );
}
var wv = {
    5: [0.153388, 0.221461, 0.250301],
    7: [0.071303, 0.131514, 0.189879, 0.214607],
    9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
    11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
    13: [0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
    15: [
      489e-6, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697,
      0.197448,
    ],
  },
  Cv = [
    "varying vec2 vBlurTexCoords[%size%];",
    "uniform sampler2D uSampler;",
    "void main(void)",
    "{",
    "    gl_FragColor = vec4(0.0);",
    "    %blur%",
    "}",
  ].join(`
`);
function Pv(t) {
  for (
    var r = wv[t],
      e = r.length,
      i = Cv,
      n = "",
      s =
        "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;",
      a,
      o = 0;
    o < t;
    o++
  ) {
    var h = s.replace("%index%", o.toString());
    (a = o),
      o >= e && (a = t - o - 1),
      (h = h.replace("%value%", r[a].toString())),
      (n += h),
      (n += `
`);
  }
  return (
    (i = i.replace("%blur%", n)), (i = i.replace("%size%", t.toString())), i
  );
}
/*!
 * @pixi/constants - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var bo;
(function (t) {
  (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.WEBGL2 = 2)] = "WEBGL2");
})(bo || (bo = {}));
var Eo;
(function (t) {
  (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.CANVAS = 2)] = "CANVAS");
})(Eo || (Eo = {}));
var Io;
(function (t) {
  (t[(t.COLOR = 16384)] = "COLOR"),
    (t[(t.DEPTH = 256)] = "DEPTH"),
    (t[(t.STENCIL = 1024)] = "STENCIL");
})(Io || (Io = {}));
var Ro;
(function (t) {
  (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.ADD = 1)] = "ADD"),
    (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
    (t[(t.SCREEN = 3)] = "SCREEN"),
    (t[(t.OVERLAY = 4)] = "OVERLAY"),
    (t[(t.DARKEN = 5)] = "DARKEN"),
    (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
    (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
    (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
    (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
    (t[(t.HUE = 13)] = "HUE"),
    (t[(t.SATURATION = 14)] = "SATURATION"),
    (t[(t.COLOR = 15)] = "COLOR"),
    (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
    (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
    (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (t[(t.NONE = 20)] = "NONE"),
    (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
    (t[(t.SRC_IN = 21)] = "SRC_IN"),
    (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
    (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
    (t[(t.DST_OVER = 24)] = "DST_OVER"),
    (t[(t.DST_IN = 25)] = "DST_IN"),
    (t[(t.DST_OUT = 26)] = "DST_OUT"),
    (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
    (t[(t.ERASE = 26)] = "ERASE"),
    (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
    (t[(t.XOR = 29)] = "XOR");
})(Ro || (Ro = {}));
var wo;
(function (t) {
  (t[(t.POINTS = 0)] = "POINTS"),
    (t[(t.LINES = 1)] = "LINES"),
    (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
    (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
    (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
    (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
})(wo || (wo = {}));
var Co;
(function (t) {
  (t[(t.RGBA = 6408)] = "RGBA"),
    (t[(t.RGB = 6407)] = "RGB"),
    (t[(t.RG = 33319)] = "RG"),
    (t[(t.RED = 6403)] = "RED"),
    (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (t[(t.ALPHA = 6406)] = "ALPHA"),
    (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
    (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
})(Co || (Co = {}));
var Po;
(function (t) {
  (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z");
})(Po || (Po = {}));
var Ao;
(function (t) {
  (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (t[(t.BYTE = 5120)] = "BYTE"),
    (t[(t.SHORT = 5122)] = "SHORT"),
    (t[(t.INT = 5124)] = "INT"),
    (t[(t.FLOAT = 5126)] = "FLOAT"),
    (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
})(Ao || (Ao = {}));
var No;
(function (t) {
  (t[(t.FLOAT = 0)] = "FLOAT"),
    (t[(t.INT = 1)] = "INT"),
    (t[(t.UINT = 2)] = "UINT");
})(No || (No = {}));
var Oo;
(function (t) {
  (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
})(Oo || (Oo = {}));
var So;
(function (t) {
  (t[(t.CLAMP = 33071)] = "CLAMP"),
    (t[(t.REPEAT = 10497)] = "REPEAT"),
    (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
})(So || (So = {}));
var Uo;
(function (t) {
  (t[(t.OFF = 0)] = "OFF"),
    (t[(t.POW2 = 1)] = "POW2"),
    (t[(t.ON = 2)] = "ON"),
    (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
})(Uo || (Uo = {}));
var Fo;
(function (t) {
  (t[(t.NPM = 0)] = "NPM"),
    (t[(t.UNPACK = 1)] = "UNPACK"),
    (t[(t.PMA = 2)] = "PMA"),
    (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
})(Fo || (Fo = {}));
var rr;
(function (t) {
  (t[(t.NO = 0)] = "NO"),
    (t[(t.YES = 1)] = "YES"),
    (t[(t.AUTO = 2)] = "AUTO"),
    (t[(t.BLEND = 0)] = "BLEND"),
    (t[(t.CLEAR = 1)] = "CLEAR"),
    (t[(t.BLIT = 2)] = "BLIT");
})(rr || (rr = {}));
var Lo;
(function (t) {
  (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
})(Lo || (Lo = {}));
var Go;
(function (t) {
  (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
})(Go || (Go = {}));
var Bo;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.SCISSOR = 1)] = "SCISSOR"),
    (t[(t.STENCIL = 2)] = "STENCIL"),
    (t[(t.SPRITE = 3)] = "SPRITE");
})(Bo || (Bo = {}));
var Mo;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LOW = 2)] = "LOW"),
    (t[(t.MEDIUM = 4)] = "MEDIUM"),
    (t[(t.HIGH = 8)] = "HIGH");
})(Mo || (Mo = {}));
var Do;
(function (t) {
  (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
    (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
})(Do || (Do = {}));
var ko = (function (t) {
  To(r, t);
  function r(e, i, n, s, a) {
    i === void 0 && (i = 8),
      n === void 0 && (n = 4),
      s === void 0 && (s = S.FILTER_RESOLUTION),
      a === void 0 && (a = 5);
    var o = this,
      h = Rv(a, e),
      u = Pv(a);
    return (
      (o = t.call(this, h, u) || this),
      (o.horizontal = e),
      (o.resolution = s),
      (o._quality = 0),
      (o.quality = n),
      (o.blur = i),
      o
    );
  }
  return (
    (r.prototype.apply = function (e, i, n, s) {
      if (
        (n
          ? this.horizontal
            ? (this.uniforms.strength = (1 / n.width) * (n.width / i.width))
            : (this.uniforms.strength = (1 / n.height) * (n.height / i.height))
          : this.horizontal
          ? (this.uniforms.strength =
              (1 / e.renderer.width) * (e.renderer.width / i.width))
          : (this.uniforms.strength =
              (1 / e.renderer.height) * (e.renderer.height / i.height)),
        (this.uniforms.strength *= this.strength),
        (this.uniforms.strength /= this.passes),
        this.passes === 1)
      )
        e.applyFilter(this, i, n, s);
      else {
        var a = e.getFilterTexture(),
          o = e.renderer,
          h = i,
          u = a;
        (this.state.blend = !1), e.applyFilter(this, h, u, rr.CLEAR);
        for (var f = 1; f < this.passes - 1; f++) {
          e.bindAndClear(h, rr.BLIT), (this.uniforms.uSampler = u);
          var c = u;
          (u = h), (h = c), o.shader.bind(this), o.geometry.draw(5);
        }
        (this.state.blend = !0),
          e.applyFilter(this, u, n, s),
          e.returnFilterTexture(a);
      }
    }),
    Object.defineProperty(r.prototype, "blur", {
      get: function () {
        return this.strength;
      },
      set: function (e) {
        (this.padding = 1 + Math.abs(e) * 2), (this.strength = e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "quality", {
      get: function () {
        return this._quality;
      },
      set: function (e) {
        (this._quality = e), (this.passes = e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})($t);
(function (t) {
  To(r, t);
  function r(e, i, n, s) {
    e === void 0 && (e = 8),
      i === void 0 && (i = 4),
      n === void 0 && (n = S.FILTER_RESOLUTION),
      s === void 0 && (s = 5);
    var a = t.call(this) || this;
    return (
      (a.blurXFilter = new ko(!0, e, i, n, s)),
      (a.blurYFilter = new ko(!1, e, i, n, s)),
      (a.resolution = n),
      (a.quality = i),
      (a.blur = e),
      (a.repeatEdgePixels = !1),
      a
    );
  }
  return (
    (r.prototype.apply = function (e, i, n, s) {
      var a = Math.abs(this.blurXFilter.strength),
        o = Math.abs(this.blurYFilter.strength);
      if (a && o) {
        var h = e.getFilterTexture();
        this.blurXFilter.apply(e, i, h, rr.CLEAR),
          this.blurYFilter.apply(e, h, n, s),
          e.returnFilterTexture(h);
      } else
        o
          ? this.blurYFilter.apply(e, i, n, s)
          : this.blurXFilter.apply(e, i, n, s);
    }),
    (r.prototype.updatePadding = function () {
      this._repeatEdgePixels
        ? (this.padding = 0)
        : (this.padding =
            Math.max(
              Math.abs(this.blurXFilter.strength),
              Math.abs(this.blurYFilter.strength)
            ) * 2);
    }),
    Object.defineProperty(r.prototype, "blur", {
      get: function () {
        return this.blurXFilter.blur;
      },
      set: function (e) {
        (this.blurXFilter.blur = this.blurYFilter.blur = e),
          this.updatePadding();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "quality", {
      get: function () {
        return this.blurXFilter.quality;
      },
      set: function (e) {
        this.blurXFilter.quality = this.blurYFilter.quality = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "blurX", {
      get: function () {
        return this.blurXFilter.blur;
      },
      set: function (e) {
        (this.blurXFilter.blur = e), this.updatePadding();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "blurY", {
      get: function () {
        return this.blurYFilter.blur;
      },
      set: function (e) {
        (this.blurYFilter.blur = e), this.updatePadding();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "blendMode", {
      get: function () {
        return this.blurYFilter.blendMode;
      },
      set: function (e) {
        this.blurYFilter.blendMode = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "repeatEdgePixels", {
      get: function () {
        return this._repeatEdgePixels;
      },
      set: function (e) {
        (this._repeatEdgePixels = e), this.updatePadding();
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})($t);
/*!
 * @pixi/filter-color-matrix - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-color-matrix is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var yn =
  function (t, r) {
    return (
      (yn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      yn(t, r)
    );
  };
function Av(t, r) {
  yn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Nv = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float m[20];
uniform float uAlpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    if (uAlpha == 0.0) {
        gl_FragColor = c;
        return;
    }

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.rgb /= c.a;
    }

    vec4 result;

    result.r = (m[0] * c.r);
        result.r += (m[1] * c.g);
        result.r += (m[2] * c.b);
        result.r += (m[3] * c.a);
        result.r += m[4];

    result.g = (m[5] * c.r);
        result.g += (m[6] * c.g);
        result.g += (m[7] * c.b);
        result.g += (m[8] * c.a);
        result.g += m[9];

    result.b = (m[10] * c.r);
       result.b += (m[11] * c.g);
       result.b += (m[12] * c.b);
       result.b += (m[13] * c.a);
       result.b += m[14];

    result.a = (m[15] * c.r);
       result.a += (m[16] * c.g);
       result.a += (m[17] * c.b);
       result.a += (m[18] * c.a);
       result.a += m[19];

    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    gl_FragColor = vec4(rgb, result.a);
}
`,
  Xo = (function (t) {
    Av(r, t);
    function r() {
      var e = this,
        i = {
          m: new Float32Array([
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
          ]),
          uAlpha: 1,
        };
      return (e = t.call(this, Ba, Nv, i) || this), (e.alpha = 1), e;
    }
    return (
      (r.prototype._loadMatrix = function (e, i) {
        i === void 0 && (i = !1);
        var n = e;
        i &&
          (this._multiply(n, this.uniforms.m, e), (n = this._colorMatrix(n))),
          (this.uniforms.m = n);
      }),
      (r.prototype._multiply = function (e, i, n) {
        return (
          (e[0] = i[0] * n[0] + i[1] * n[5] + i[2] * n[10] + i[3] * n[15]),
          (e[1] = i[0] * n[1] + i[1] * n[6] + i[2] * n[11] + i[3] * n[16]),
          (e[2] = i[0] * n[2] + i[1] * n[7] + i[2] * n[12] + i[3] * n[17]),
          (e[3] = i[0] * n[3] + i[1] * n[8] + i[2] * n[13] + i[3] * n[18]),
          (e[4] =
            i[0] * n[4] + i[1] * n[9] + i[2] * n[14] + i[3] * n[19] + i[4]),
          (e[5] = i[5] * n[0] + i[6] * n[5] + i[7] * n[10] + i[8] * n[15]),
          (e[6] = i[5] * n[1] + i[6] * n[6] + i[7] * n[11] + i[8] * n[16]),
          (e[7] = i[5] * n[2] + i[6] * n[7] + i[7] * n[12] + i[8] * n[17]),
          (e[8] = i[5] * n[3] + i[6] * n[8] + i[7] * n[13] + i[8] * n[18]),
          (e[9] =
            i[5] * n[4] + i[6] * n[9] + i[7] * n[14] + i[8] * n[19] + i[9]),
          (e[10] = i[10] * n[0] + i[11] * n[5] + i[12] * n[10] + i[13] * n[15]),
          (e[11] = i[10] * n[1] + i[11] * n[6] + i[12] * n[11] + i[13] * n[16]),
          (e[12] = i[10] * n[2] + i[11] * n[7] + i[12] * n[12] + i[13] * n[17]),
          (e[13] = i[10] * n[3] + i[11] * n[8] + i[12] * n[13] + i[13] * n[18]),
          (e[14] =
            i[10] * n[4] +
            i[11] * n[9] +
            i[12] * n[14] +
            i[13] * n[19] +
            i[14]),
          (e[15] = i[15] * n[0] + i[16] * n[5] + i[17] * n[10] + i[18] * n[15]),
          (e[16] = i[15] * n[1] + i[16] * n[6] + i[17] * n[11] + i[18] * n[16]),
          (e[17] = i[15] * n[2] + i[16] * n[7] + i[17] * n[12] + i[18] * n[17]),
          (e[18] = i[15] * n[3] + i[16] * n[8] + i[17] * n[13] + i[18] * n[18]),
          (e[19] =
            i[15] * n[4] +
            i[16] * n[9] +
            i[17] * n[14] +
            i[18] * n[19] +
            i[19]),
          e
        );
      }),
      (r.prototype._colorMatrix = function (e) {
        var i = new Float32Array(e);
        return (i[4] /= 255), (i[9] /= 255), (i[14] /= 255), (i[19] /= 255), i;
      }),
      (r.prototype.brightness = function (e, i) {
        var n = [e, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(n, i);
      }),
      (r.prototype.tint = function (e, i) {
        var n = (e >> 16) & 255,
          s = (e >> 8) & 255,
          a = e & 255,
          o = [
            n / 255,
            0,
            0,
            0,
            0,
            0,
            s / 255,
            0,
            0,
            0,
            0,
            0,
            a / 255,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
          ];
        this._loadMatrix(o, i);
      }),
      (r.prototype.greyscale = function (e, i) {
        var n = [e, e, e, 0, 0, e, e, e, 0, 0, e, e, e, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(n, i);
      }),
      (r.prototype.blackAndWhite = function (e) {
        var i = [
          0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0,
          0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.hue = function (e, i) {
        e = ((e || 0) / 180) * Math.PI;
        var n = Math.cos(e),
          s = Math.sin(e),
          a = Math.sqrt,
          o = 1 / 3,
          h = a(o),
          u = n + (1 - n) * o,
          f = o * (1 - n) - h * s,
          c = o * (1 - n) + h * s,
          l = o * (1 - n) + h * s,
          d = n + o * (1 - n),
          p = o * (1 - n) - h * s,
          _ = o * (1 - n) - h * s,
          v = o * (1 - n) + h * s,
          m = n + o * (1 - n),
          g = [u, f, c, 0, 0, l, d, p, 0, 0, _, v, m, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(g, i);
      }),
      (r.prototype.contrast = function (e, i) {
        var n = (e || 0) + 1,
          s = -0.5 * (n - 1),
          a = [n, 0, 0, 0, s, 0, n, 0, 0, s, 0, 0, n, 0, s, 0, 0, 0, 1, 0];
        this._loadMatrix(a, i);
      }),
      (r.prototype.saturate = function (e, i) {
        e === void 0 && (e = 0);
        var n = (e * 2) / 3 + 1,
          s = (n - 1) * -0.5,
          a = [n, s, s, 0, 0, s, n, s, 0, 0, s, s, n, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(a, i);
      }),
      (r.prototype.desaturate = function () {
        this.saturate(-1);
      }),
      (r.prototype.negative = function (e) {
        var i = [-1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(i, e);
      }),
      (r.prototype.sepia = function (e) {
        var i = [
          0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999, 0.16799999, 0,
          0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0, 0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.technicolor = function (e) {
        var i = [
          1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0,
          11.793603434377337, -0.3087833385928097, 1.7658908555458428,
          -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616,
          -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0,
          0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.polaroid = function (e) {
        var i = [
          1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016,
          -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.toBGR = function (e) {
        var i = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(i, e);
      }),
      (r.prototype.kodachrome = function (e) {
        var i = [
          1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0,
          63.72958762196502, -0.16404339962244616, 1.0835251566291304,
          -0.05498805115633132, 0, 24.732407896706203, -0.16786010706155763,
          -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0,
          0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.browni = function (e) {
        var i = [
          0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0,
          47.43192855600873, -0.037703249837783157, 0.8609577587992641,
          0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335,
          -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283, 0,
          0, 0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.vintage = function (e) {
        var i = [
          0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0,
          9.651285835294123, 0.02578397704808868, 0.6441188644374771,
          0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719,
          -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296, 0, 0,
          0, 1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.colorTone = function (e, i, n, s, a) {
        (e = e || 0.2),
          (i = i || 0.15),
          (n = n || 16770432),
          (s = s || 3375104);
        var o = ((n >> 16) & 255) / 255,
          h = ((n >> 8) & 255) / 255,
          u = (n & 255) / 255,
          f = ((s >> 16) & 255) / 255,
          c = ((s >> 8) & 255) / 255,
          l = (s & 255) / 255,
          d = [
            0.3,
            0.59,
            0.11,
            0,
            0,
            o,
            h,
            u,
            e,
            0,
            f,
            c,
            l,
            i,
            0,
            o - f,
            h - c,
            u - l,
            0,
            0,
          ];
        this._loadMatrix(d, a);
      }),
      (r.prototype.night = function (e, i) {
        e = e || 0.1;
        var n = [
          e * -2,
          -e,
          0,
          0,
          0,
          -e,
          0,
          e,
          0,
          0,
          0,
          e,
          e * 2,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
        ];
        this._loadMatrix(n, i);
      }),
      (r.prototype.predator = function (e, i) {
        var n = [
          11.224130630493164 * e,
          -4.794486999511719 * e,
          -2.8746118545532227 * e,
          0 * e,
          0.40342438220977783 * e,
          -3.6330697536468506 * e,
          9.193157196044922 * e,
          -2.951810836791992 * e,
          0 * e,
          -1.316135048866272 * e,
          -3.2184197902679443 * e,
          -4.2375030517578125 * e,
          7.476448059082031 * e,
          0 * e,
          0.8044459223747253 * e,
          0,
          0,
          0,
          1,
          0,
        ];
        this._loadMatrix(n, i);
      }),
      (r.prototype.lsd = function (e) {
        var i = [
          2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0, 0, 0,
          1, 0,
        ];
        this._loadMatrix(i, e);
      }),
      (r.prototype.reset = function () {
        var e = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(e, !1);
      }),
      Object.defineProperty(r.prototype, "matrix", {
        get: function () {
          return this.uniforms.m;
        },
        set: function (e) {
          this.uniforms.m = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "alpha", {
        get: function () {
          return this.uniforms.uAlpha;
        },
        set: function (e) {
          this.uniforms.uAlpha = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })($t);
Xo.prototype.grayscale = Xo.prototype.greyscale;
/*!
 * @pixi/filter-displacement - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-displacement is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var gn =
  function (t, r) {
    return (
      (gn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      gn(t, r)
    );
  };
function Ov(t, r) {
  gn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Sv = `varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform vec2 scale;
uniform mat2 rotation;
uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(mapSampler, vFilterCoord);

  map -= 0.5;
  map.xy = scale * inputSize.zw * (rotation * map.xy);

  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));
}
`,
  Uv = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;
}
`;
(function (t) {
  Ov(r, t);
  function r(e, i) {
    var n = this,
      s = new ut();
    return (
      (e.renderable = !1),
      (n =
        t.call(this, Uv, Sv, {
          mapSampler: e._texture,
          filterMatrix: s,
          scale: { x: 1, y: 1 },
          rotation: new Float32Array([1, 0, 0, 1]),
        }) || this),
      (n.maskSprite = e),
      (n.maskMatrix = s),
      i == null && (i = 20),
      (n.scale = new ht(i, i)),
      n
    );
  }
  return (
    (r.prototype.apply = function (e, i, n, s) {
      (this.uniforms.filterMatrix = e.calculateSpriteMatrix(
        this.maskMatrix,
        this.maskSprite
      )),
        (this.uniforms.scale.x = this.scale.x),
        (this.uniforms.scale.y = this.scale.y);
      var a = this.maskSprite.worldTransform,
        o = Math.sqrt(a.a * a.a + a.b * a.b),
        h = Math.sqrt(a.c * a.c + a.d * a.d);
      o !== 0 &&
        h !== 0 &&
        ((this.uniforms.rotation[0] = a.a / o),
        (this.uniforms.rotation[1] = a.b / o),
        (this.uniforms.rotation[2] = a.c / h),
        (this.uniforms.rotation[3] = a.d / h)),
        e.applyFilter(this, i, n, s);
    }),
    Object.defineProperty(r.prototype, "map", {
      get: function () {
        return this.uniforms.mapSampler;
      },
      set: function (e) {
        this.uniforms.mapSampler = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})($t);
/*!
 * @pixi/filter-fxaa - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-fxaa is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var xn =
  function (t, r) {
    return (
      (xn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      xn(t, r)
    );
  };
function Fv(t, r) {
  xn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Lv = `
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void texcoords(vec2 fragCoord, vec2 inverseVP,
               out vec2 v_rgbNW, out vec2 v_rgbNE,
               out vec2 v_rgbSW, out vec2 v_rgbSE,
               out vec2 v_rgbM) {
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
}

void main(void) {

   gl_Position = filterVertexPosition();

   vFragCoord = aVertexPosition * outputFrame.zw;

   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`,
  Gv = `varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`;
(function (t) {
  Fv(r, t);
  function r() {
    return t.call(this, Lv, Gv) || this;
  }
  return r;
})($t);
/*!
 * @pixi/filter-noise - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/filter-noise is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var Tn =
  function (t, r) {
    return (
      (Tn =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      Tn(t, r)
    );
  };
function Bv(t, r) {
  Tn(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var Mv = `precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) * uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    gl_FragColor = color;
}
`;
(function (t) {
  Bv(r, t);
  function r(e, i) {
    e === void 0 && (e = 0.5), i === void 0 && (i = Math.random());
    var n = t.call(this, Ba, Mv, { uNoise: 0, uSeed: 0 }) || this;
    return (n.noise = e), (n.seed = i), n;
  }
  return (
    Object.defineProperty(r.prototype, "noise", {
      get: function () {
        return this.uniforms.uNoise;
      },
      set: function (e) {
        this.uniforms.uNoise = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "seed", {
      get: function () {
        return this.uniforms.uSeed;
      },
      set: function (e) {
        this.uniforms.uSeed = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})($t);
/*!
 * @pixi/mixin-cache-as-bitmap - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*!
 * @pixi/constants - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ var Ho;
(function (t) {
  (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.WEBGL2 = 2)] = "WEBGL2");
})(Ho || (Ho = {}));
var Vo;
(function (t) {
  (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
    (t[(t.WEBGL = 1)] = "WEBGL"),
    (t[(t.CANVAS = 2)] = "CANVAS");
})(Vo || (Vo = {}));
var jo;
(function (t) {
  (t[(t.COLOR = 16384)] = "COLOR"),
    (t[(t.DEPTH = 256)] = "DEPTH"),
    (t[(t.STENCIL = 1024)] = "STENCIL");
})(jo || (jo = {}));
var zo;
(function (t) {
  (t[(t.NORMAL = 0)] = "NORMAL"),
    (t[(t.ADD = 1)] = "ADD"),
    (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
    (t[(t.SCREEN = 3)] = "SCREEN"),
    (t[(t.OVERLAY = 4)] = "OVERLAY"),
    (t[(t.DARKEN = 5)] = "DARKEN"),
    (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
    (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
    (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
    (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
    (t[(t.HUE = 13)] = "HUE"),
    (t[(t.SATURATION = 14)] = "SATURATION"),
    (t[(t.COLOR = 15)] = "COLOR"),
    (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
    (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
    (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (t[(t.NONE = 20)] = "NONE"),
    (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
    (t[(t.SRC_IN = 21)] = "SRC_IN"),
    (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
    (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
    (t[(t.DST_OVER = 24)] = "DST_OVER"),
    (t[(t.DST_IN = 25)] = "DST_IN"),
    (t[(t.DST_OUT = 26)] = "DST_OUT"),
    (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
    (t[(t.ERASE = 26)] = "ERASE"),
    (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
    (t[(t.XOR = 29)] = "XOR");
})(zo || (zo = {}));
var Wo;
(function (t) {
  (t[(t.POINTS = 0)] = "POINTS"),
    (t[(t.LINES = 1)] = "LINES"),
    (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
    (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
    (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
    (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
})(Wo || (Wo = {}));
var Yo;
(function (t) {
  (t[(t.RGBA = 6408)] = "RGBA"),
    (t[(t.RGB = 6407)] = "RGB"),
    (t[(t.RG = 33319)] = "RG"),
    (t[(t.RED = 6403)] = "RED"),
    (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (t[(t.ALPHA = 6406)] = "ALPHA"),
    (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
    (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
})(Yo || (Yo = {}));
var $o;
(function (t) {
  (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z");
})($o || ($o = {}));
var qo;
(function (t) {
  (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (t[(t.BYTE = 5120)] = "BYTE"),
    (t[(t.SHORT = 5122)] = "SHORT"),
    (t[(t.INT = 5124)] = "INT"),
    (t[(t.FLOAT = 5126)] = "FLOAT"),
    (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
})(qo || (qo = {}));
var Zo;
(function (t) {
  (t[(t.FLOAT = 0)] = "FLOAT"),
    (t[(t.INT = 1)] = "INT"),
    (t[(t.UINT = 2)] = "UINT");
})(Zo || (Zo = {}));
var Ko;
(function (t) {
  (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
})(Ko || (Ko = {}));
var Jo;
(function (t) {
  (t[(t.CLAMP = 33071)] = "CLAMP"),
    (t[(t.REPEAT = 10497)] = "REPEAT"),
    (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
})(Jo || (Jo = {}));
var Qo;
(function (t) {
  (t[(t.OFF = 0)] = "OFF"),
    (t[(t.POW2 = 1)] = "POW2"),
    (t[(t.ON = 2)] = "ON"),
    (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
})(Qo || (Qo = {}));
var th;
(function (t) {
  (t[(t.NPM = 0)] = "NPM"),
    (t[(t.UNPACK = 1)] = "UNPACK"),
    (t[(t.PMA = 2)] = "PMA"),
    (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
})(th || (th = {}));
var eh;
(function (t) {
  (t[(t.NO = 0)] = "NO"),
    (t[(t.YES = 1)] = "YES"),
    (t[(t.AUTO = 2)] = "AUTO"),
    (t[(t.BLEND = 0)] = "BLEND"),
    (t[(t.CLEAR = 1)] = "CLEAR"),
    (t[(t.BLIT = 2)] = "BLIT");
})(eh || (eh = {}));
var rh;
(function (t) {
  (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
})(rh || (rh = {}));
var ih;
(function (t) {
  (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
})(ih || (ih = {}));
var nh;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.SCISSOR = 1)] = "SCISSOR"),
    (t[(t.STENCIL = 2)] = "STENCIL"),
    (t[(t.SPRITE = 3)] = "SPRITE");
})(nh || (nh = {}));
var bn;
(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LOW = 2)] = "LOW"),
    (t[(t.MEDIUM = 4)] = "MEDIUM"),
    (t[(t.HIGH = 8)] = "HIGH");
})(bn || (bn = {}));
var sh;
(function (t) {
  (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
    (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
})(sh || (sh = {}));
var ah = new ut();
ft.prototype._cacheAsBitmap = !1;
ft.prototype._cacheData = null;
ft.prototype._cacheAsBitmapResolution = null;
ft.prototype._cacheAsBitmapMultisample = bn.NONE;
var Dv = (function () {
  function t() {
    (this.textureCacheId = null),
      (this.originalRender = null),
      (this.originalRenderCanvas = null),
      (this.originalCalculateBounds = null),
      (this.originalGetLocalBounds = null),
      (this.originalUpdateTransform = null),
      (this.originalDestroy = null),
      (this.originalMask = null),
      (this.originalFilterArea = null),
      (this.originalContainsPoint = null),
      (this.sprite = null);
  }
  return t;
})();
Object.defineProperties(ft.prototype, {
  cacheAsBitmapResolution: {
    get: function () {
      return this._cacheAsBitmapResolution;
    },
    set: function (t) {
      t !== this._cacheAsBitmapResolution &&
        ((this._cacheAsBitmapResolution = t),
        this.cacheAsBitmap &&
          ((this.cacheAsBitmap = !1), (this.cacheAsBitmap = !0)));
    },
  },
  cacheAsBitmapMultisample: {
    get: function () {
      return this._cacheAsBitmapMultisample;
    },
    set: function (t) {
      t !== this._cacheAsBitmapMultisample &&
        ((this._cacheAsBitmapMultisample = t),
        this.cacheAsBitmap &&
          ((this.cacheAsBitmap = !1), (this.cacheAsBitmap = !0)));
    },
  },
  cacheAsBitmap: {
    get: function () {
      return this._cacheAsBitmap;
    },
    set: function (t) {
      if (this._cacheAsBitmap !== t) {
        this._cacheAsBitmap = t;
        var r;
        t
          ? (this._cacheData || (this._cacheData = new Dv()),
            (r = this._cacheData),
            (r.originalRender = this.render),
            (r.originalRenderCanvas = this.renderCanvas),
            (r.originalUpdateTransform = this.updateTransform),
            (r.originalCalculateBounds = this.calculateBounds),
            (r.originalGetLocalBounds = this.getLocalBounds),
            (r.originalDestroy = this.destroy),
            (r.originalContainsPoint = this.containsPoint),
            (r.originalMask = this._mask),
            (r.originalFilterArea = this.filterArea),
            (this.render = this._renderCached),
            (this.renderCanvas = this._renderCachedCanvas),
            (this.destroy = this._cacheAsBitmapDestroy))
          : ((r = this._cacheData),
            r.sprite && this._destroyCachedDisplayObject(),
            (this.render = r.originalRender),
            (this.renderCanvas = r.originalRenderCanvas),
            (this.calculateBounds = r.originalCalculateBounds),
            (this.getLocalBounds = r.originalGetLocalBounds),
            (this.destroy = r.originalDestroy),
            (this.updateTransform = r.originalUpdateTransform),
            (this.containsPoint = r.originalContainsPoint),
            (this._mask = r.originalMask),
            (this.filterArea = r.originalFilterArea));
      }
    },
  },
});
ft.prototype._renderCached = function (r) {
  !this.visible ||
    this.worldAlpha <= 0 ||
    !this.renderable ||
    (this._initCachedDisplayObject(r),
    (this._cacheData.sprite.transform._worldID = this.transform._worldID),
    (this._cacheData.sprite.worldAlpha = this.worldAlpha),
    this._cacheData.sprite._render(r));
};
ft.prototype._initCachedDisplayObject = function (r) {
  var e;
  if (!(this._cacheData && this._cacheData.sprite)) {
    var i = this.alpha;
    (this.alpha = 1), r.batch.flush();
    var n = this.getLocalBounds(null, !0).clone();
    if (this.filters && this.filters.length) {
      var s = this.filters[0].padding;
      n.pad(s);
    }
    n.ceil(S.RESOLUTION);
    var a = r.renderTexture.current,
      o = r.renderTexture.sourceFrame.clone(),
      h = r.renderTexture.destinationFrame.clone(),
      u = r.projection.transform,
      f = ae.create({
        width: n.width,
        height: n.height,
        resolution: this.cacheAsBitmapResolution || r.resolution,
        multisample:
          (e = this.cacheAsBitmapMultisample) !== null && e !== void 0
            ? e
            : r.multisample,
      }),
      c = "cacheAsBitmap_" + Qt();
    (this._cacheData.textureCacheId = c),
      W.addToCache(f.baseTexture, c),
      B.addToCache(f, c);
    var l = this.transform.localTransform
      .copyTo(ah)
      .invert()
      .translate(-n.x, -n.y);
    (this.render = this._cacheData.originalRender),
      r.render(this, {
        renderTexture: f,
        clear: !0,
        transform: l,
        skipUpdateTransform: !1,
      }),
      r.framebuffer.blit(),
      (r.projection.transform = u),
      r.renderTexture.bind(a, o, h),
      (this.render = this._renderCached),
      (this.updateTransform = this.displayObjectUpdateTransform),
      (this.calculateBounds = this._calculateCachedBounds),
      (this.getLocalBounds = this._getCachedLocalBounds),
      (this._mask = null),
      (this.filterArea = null),
      (this.alpha = i);
    var d = new Ke(f);
    (d.transform.worldTransform = this.transform.worldTransform),
      (d.anchor.x = -(n.x / n.width)),
      (d.anchor.y = -(n.y / n.height)),
      (d.alpha = i),
      (d._bounds = this._bounds),
      (this._cacheData.sprite = d),
      (this.transform._parentID = -1),
      this.parent
        ? this.updateTransform()
        : (this.enableTempParent(),
          this.updateTransform(),
          this.disableTempParent(null)),
      (this.containsPoint = d.containsPoint.bind(d));
  }
};
ft.prototype._renderCachedCanvas = function (r) {
  !this.visible ||
    this.worldAlpha <= 0 ||
    !this.renderable ||
    (this._initCachedDisplayObjectCanvas(r),
    (this._cacheData.sprite.worldAlpha = this.worldAlpha),
    this._cacheData.sprite._renderCanvas(r));
};
ft.prototype._initCachedDisplayObjectCanvas = function (r) {
  if (!(this._cacheData && this._cacheData.sprite)) {
    var e = this.getLocalBounds(null, !0),
      i = this.alpha;
    this.alpha = 1;
    var n = r.context,
      s = r._projTransform;
    e.ceil(S.RESOLUTION);
    var a = ae.create({ width: e.width, height: e.height }),
      o = "cacheAsBitmap_" + Qt();
    (this._cacheData.textureCacheId = o),
      W.addToCache(a.baseTexture, o),
      B.addToCache(a, o);
    var h = ah;
    this.transform.localTransform.copyTo(h),
      h.invert(),
      (h.tx -= e.x),
      (h.ty -= e.y),
      (this.renderCanvas = this._cacheData.originalRenderCanvas),
      r.render(this, {
        renderTexture: a,
        clear: !0,
        transform: h,
        skipUpdateTransform: !1,
      }),
      (r.context = n),
      (r._projTransform = s),
      (this.renderCanvas = this._renderCachedCanvas),
      (this.updateTransform = this.displayObjectUpdateTransform),
      (this.calculateBounds = this._calculateCachedBounds),
      (this.getLocalBounds = this._getCachedLocalBounds),
      (this._mask = null),
      (this.filterArea = null),
      (this.alpha = i);
    var u = new Ke(a);
    (u.transform.worldTransform = this.transform.worldTransform),
      (u.anchor.x = -(e.x / e.width)),
      (u.anchor.y = -(e.y / e.height)),
      (u.alpha = i),
      (u._bounds = this._bounds),
      (this._cacheData.sprite = u),
      (this.transform._parentID = -1),
      this.parent
        ? this.updateTransform()
        : ((this.parent = r._tempDisplayObjectParent),
          this.updateTransform(),
          (this.parent = null)),
      (this.containsPoint = u.containsPoint.bind(u));
  }
};
ft.prototype._calculateCachedBounds = function () {
  this._bounds.clear(),
    (this._cacheData.sprite.transform._worldID = this.transform._worldID),
    this._cacheData.sprite._calculateBounds(),
    (this._bounds.updateID = this._boundsID);
};
ft.prototype._getCachedLocalBounds = function () {
  return this._cacheData.sprite.getLocalBounds(null);
};
ft.prototype._destroyCachedDisplayObject = function () {
  this._cacheData.sprite._texture.destroy(!0),
    (this._cacheData.sprite = null),
    W.removeFromCache(this._cacheData.textureCacheId),
    B.removeFromCache(this._cacheData.textureCacheId),
    (this._cacheData.textureCacheId = null);
};
ft.prototype._cacheAsBitmapDestroy = function (r) {
  (this.cacheAsBitmap = !1), this.destroy(r);
};
/*!
 * @pixi/mixin-get-child-by-name - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/mixin-get-child-by-name is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ ft.prototype.name = null;
Ft.prototype.getChildByName = function (r, e) {
  for (var i = 0, n = this.children.length; i < n; i++)
    if (this.children[i].name === r) return this.children[i];
  if (e)
    for (var i = 0, n = this.children.length; i < n; i++) {
      var s = this.children[i];
      if (!!s.getChildByName) {
        var a = this.children[i].getChildByName(r, !0);
        if (a) return a;
      }
    }
  return null;
};
/*!
 * @pixi/mixin-get-global-position - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/mixin-get-global-position is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ ft.prototype.getGlobalPosition = function (r, e) {
  return (
    r === void 0 && (r = new ht()),
    e === void 0 && (e = !1),
    this.parent
      ? this.parent.toGlobal(this.position, r, e)
      : ((r.x = this.position.x), (r.y = this.position.y)),
    r
  );
};
/*!
 * @pixi/mesh-extras - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/mesh-extras is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var En =
  function (t, r) {
    return (
      (En =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      En(t, r)
    );
  };
function Ne(t, r) {
  En(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
var kv = (function (t) {
    Ne(r, t);
    function r(e, i, n, s) {
      e === void 0 && (e = 100),
        i === void 0 && (i = 100),
        n === void 0 && (n = 10),
        s === void 0 && (s = 10);
      var a = t.call(this) || this;
      return (
        (a.segWidth = n),
        (a.segHeight = s),
        (a.width = e),
        (a.height = i),
        a.build(),
        a
      );
    }
    return (
      (r.prototype.build = function () {
        for (
          var e = this.segWidth * this.segHeight,
            i = [],
            n = [],
            s = [],
            a = this.segWidth - 1,
            o = this.segHeight - 1,
            h = this.width / a,
            u = this.height / o,
            f = 0;
          f < e;
          f++
        ) {
          var c = f % this.segWidth,
            l = (f / this.segWidth) | 0;
          i.push(c * h, l * u), n.push(c / a, l / o);
        }
        for (var d = a * o, f = 0; f < d; f++) {
          var p = f % a,
            _ = (f / a) | 0,
            v = _ * this.segWidth + p,
            m = _ * this.segWidth + p + 1,
            g = (_ + 1) * this.segWidth + p,
            T = (_ + 1) * this.segWidth + p + 1;
          s.push(v, m, g, m, T, g);
        }
        (this.buffers[0].data = new Float32Array(i)),
          (this.buffers[1].data = new Float32Array(n)),
          (this.indexBuffer.data = new Uint16Array(s)),
          this.buffers[0].update(),
          this.buffers[1].update(),
          this.indexBuffer.update();
      }),
      r
    );
  })(Dr),
  Xv = (function (t) {
    Ne(r, t);
    function r(e, i, n) {
      e === void 0 && (e = 200), n === void 0 && (n = 0);
      var s =
        t.call(
          this,
          new Float32Array(i.length * 4),
          new Float32Array(i.length * 4),
          new Uint16Array((i.length - 1) * 6)
        ) || this;
      return (s.points = i), (s._width = e), (s.textureScale = n), s.build(), s;
    }
    return (
      Object.defineProperty(r.prototype, "width", {
        get: function () {
          return this._width;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype.build = function () {
        var e = this.points;
        if (!!e) {
          var i = this.getBuffer("aVertexPosition"),
            n = this.getBuffer("aTextureCoord"),
            s = this.getIndex();
          if (!(e.length < 1)) {
            i.data.length / 4 !== e.length &&
              ((i.data = new Float32Array(e.length * 4)),
              (n.data = new Float32Array(e.length * 4)),
              (s.data = new Uint16Array((e.length - 1) * 6)));
            var a = n.data,
              o = s.data;
            (a[0] = 0), (a[1] = 0), (a[2] = 0), (a[3] = 1);
            for (
              var h = 0,
                u = e[0],
                f = this._width * this.textureScale,
                c = e.length,
                l = 0;
              l < c;
              l++
            ) {
              var d = l * 4;
              if (this.textureScale > 0) {
                var p = u.x - e[l].x,
                  _ = u.y - e[l].y,
                  v = Math.sqrt(p * p + _ * _);
                (u = e[l]), (h += v / f);
              } else h = l / (c - 1);
              (a[d] = h), (a[d + 1] = 0), (a[d + 2] = h), (a[d + 3] = 1);
            }
            for (var m = 0, l = 0; l < c - 1; l++) {
              var d = l * 2;
              (o[m++] = d),
                (o[m++] = d + 1),
                (o[m++] = d + 2),
                (o[m++] = d + 2),
                (o[m++] = d + 1),
                (o[m++] = d + 3);
            }
            n.update(), s.update(), this.updateVertices();
          }
        }
      }),
      (r.prototype.updateVertices = function () {
        var e = this.points;
        if (!(e.length < 1)) {
          for (
            var i = e[0],
              n,
              s = 0,
              a = 0,
              o = this.buffers[0].data,
              h = e.length,
              u = 0;
            u < h;
            u++
          ) {
            var f = e[u],
              c = u * 4;
            u < e.length - 1 ? (n = e[u + 1]) : (n = f),
              (a = -(n.x - i.x)),
              (s = n.y - i.y);
            var l = Math.sqrt(s * s + a * a),
              d =
                this.textureScale > 0
                  ? (this.textureScale * this._width) / 2
                  : this._width / 2;
            (s /= l),
              (a /= l),
              (s *= d),
              (a *= d),
              (o[c] = f.x + s),
              (o[c + 1] = f.y + a),
              (o[c + 2] = f.x - s),
              (o[c + 3] = f.y - a),
              (i = f);
          }
          this.buffers[0].update();
        }
      }),
      (r.prototype.update = function () {
        this.textureScale > 0 ? this.build() : this.updateVertices();
      }),
      r
    );
  })(Dr);
(function (t) {
  Ne(r, t);
  function r(e, i, n) {
    n === void 0 && (n = 0);
    var s = this,
      a = new Xv(e.height, i, n),
      o = new er(e);
    return (
      n > 0 && (e.baseTexture.wrapMode = Dt.REPEAT),
      (s = t.call(this, a, o) || this),
      (s.autoUpdate = !0),
      s
    );
  }
  return (
    (r.prototype._render = function (e) {
      var i = this.geometry;
      (this.autoUpdate || i._width !== this.shader.texture.height) &&
        ((i._width = this.shader.texture.height), i.update()),
        t.prototype._render.call(this, e);
    }),
    r
  );
})(tr);
var Hv = (function (t) {
  Ne(r, t);
  function r(e, i, n) {
    var s = this,
      a = new kv(e.width, e.height, i, n),
      o = new er(B.WHITE);
    return (
      (s = t.call(this, a, o) || this), (s.texture = e), (s.autoResize = !0), s
    );
  }
  return (
    (r.prototype.textureUpdated = function () {
      this._textureID = this.shader.texture._updateID;
      var e = this.geometry,
        i = this.shader.texture,
        n = i.width,
        s = i.height;
      this.autoResize &&
        (e.width !== n || e.height !== s) &&
        ((e.width = this.shader.texture.width),
        (e.height = this.shader.texture.height),
        e.build());
    }),
    Object.defineProperty(r.prototype, "texture", {
      get: function () {
        return this.shader.texture;
      },
      set: function (e) {
        this.shader.texture !== e &&
          ((this.shader.texture = e),
          (this._textureID = -1),
          e.baseTexture.valid
            ? this.textureUpdated()
            : e.once("update", this.textureUpdated, this));
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype._render = function (e) {
      this._textureID !== this.shader.texture._updateID &&
        this.textureUpdated(),
        t.prototype._render.call(this, e);
    }),
    (r.prototype.destroy = function (e) {
      this.shader.texture.off("update", this.textureUpdated, this),
        t.prototype.destroy.call(this, e);
    }),
    r
  );
})(tr);
(function (t) {
  Ne(r, t);
  function r(e, i, n, s, a) {
    e === void 0 && (e = B.EMPTY);
    var o = this,
      h = new Dr(i, n, s);
    h.getBuffer("aVertexPosition").static = !1;
    var u = new er(e);
    return (o = t.call(this, h, u, null, a) || this), (o.autoUpdate = !0), o;
  }
  return (
    Object.defineProperty(r.prototype, "vertices", {
      get: function () {
        return this.geometry.getBuffer("aVertexPosition").data;
      },
      set: function (e) {
        this.geometry.getBuffer("aVertexPosition").data = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype._render = function (e) {
      this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(),
        t.prototype._render.call(this, e);
    }),
    r
  );
})(tr);
var Hr = 10;
(function (t) {
  Ne(r, t);
  function r(e, i, n, s, a) {
    i === void 0 && (i = Hr),
      n === void 0 && (n = Hr),
      s === void 0 && (s = Hr),
      a === void 0 && (a = Hr);
    var o = t.call(this, B.WHITE, 4, 4) || this;
    return (
      (o._origWidth = e.orig.width),
      (o._origHeight = e.orig.height),
      (o._width = o._origWidth),
      (o._height = o._origHeight),
      (o._leftWidth = i),
      (o._rightWidth = s),
      (o._topHeight = n),
      (o._bottomHeight = a),
      (o.texture = e),
      o
    );
  }
  return (
    (r.prototype.textureUpdated = function () {
      (this._textureID = this.shader.texture._updateID), this._refresh();
    }),
    Object.defineProperty(r.prototype, "vertices", {
      get: function () {
        return this.geometry.getBuffer("aVertexPosition").data;
      },
      set: function (e) {
        this.geometry.getBuffer("aVertexPosition").data = e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype.updateHorizontalVertices = function () {
      var e = this.vertices,
        i = this._getMinScale();
      (e[9] = e[11] = e[13] = e[15] = this._topHeight * i),
        (e[17] = e[19] = e[21] = e[23] = this._height - this._bottomHeight * i),
        (e[25] = e[27] = e[29] = e[31] = this._height);
    }),
    (r.prototype.updateVerticalVertices = function () {
      var e = this.vertices,
        i = this._getMinScale();
      (e[2] = e[10] = e[18] = e[26] = this._leftWidth * i),
        (e[4] = e[12] = e[20] = e[28] = this._width - this._rightWidth * i),
        (e[6] = e[14] = e[22] = e[30] = this._width);
    }),
    (r.prototype._getMinScale = function () {
      var e = this._leftWidth + this._rightWidth,
        i = this._width > e ? 1 : this._width / e,
        n = this._topHeight + this._bottomHeight,
        s = this._height > n ? 1 : this._height / n,
        a = Math.min(i, s);
      return a;
    }),
    Object.defineProperty(r.prototype, "width", {
      get: function () {
        return this._width;
      },
      set: function (e) {
        (this._width = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "height", {
      get: function () {
        return this._height;
      },
      set: function (e) {
        (this._height = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "leftWidth", {
      get: function () {
        return this._leftWidth;
      },
      set: function (e) {
        (this._leftWidth = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "rightWidth", {
      get: function () {
        return this._rightWidth;
      },
      set: function (e) {
        (this._rightWidth = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "topHeight", {
      get: function () {
        return this._topHeight;
      },
      set: function (e) {
        (this._topHeight = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "bottomHeight", {
      get: function () {
        return this._bottomHeight;
      },
      set: function (e) {
        (this._bottomHeight = e), this._refresh();
      },
      enumerable: !1,
      configurable: !0,
    }),
    (r.prototype._refresh = function () {
      var e = this.texture,
        i = this.geometry.buffers[1].data;
      (this._origWidth = e.orig.width), (this._origHeight = e.orig.height);
      var n = 1 / this._origWidth,
        s = 1 / this._origHeight;
      (i[0] = i[8] = i[16] = i[24] = 0),
        (i[1] = i[3] = i[5] = i[7] = 0),
        (i[6] = i[14] = i[22] = i[30] = 1),
        (i[25] = i[27] = i[29] = i[31] = 1),
        (i[2] = i[10] = i[18] = i[26] = n * this._leftWidth),
        (i[4] = i[12] = i[20] = i[28] = 1 - n * this._rightWidth),
        (i[9] = i[11] = i[13] = i[15] = s * this._topHeight),
        (i[17] = i[19] = i[21] = i[23] = 1 - s * this._bottomHeight),
        this.updateHorizontalVertices(),
        this.updateVerticalVertices(),
        this.geometry.buffers[0].update(),
        this.geometry.buffers[1].update();
    }),
    r
  );
})(Hv);
/*!
 * @pixi/sprite-animated - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * @pixi/sprite-animated is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ var In =
  function (t, r) {
    return (
      (In =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, i) {
            e.__proto__ = i;
          }) ||
        function (e, i) {
          for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n]);
        }),
      In(t, r)
    );
  };
function Vv(t, r) {
  In(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype =
    r === null ? Object.create(r) : ((e.prototype = r.prototype), new e());
}
(function (t) {
  Vv(r, t);
  function r(e, i) {
    i === void 0 && (i = !0);
    var n = t.call(this, e[0] instanceof B ? e[0] : e[0].texture) || this;
    return (
      (n._textures = null),
      (n._durations = null),
      (n._autoUpdate = i),
      (n._isConnectedToTicker = !1),
      (n.animationSpeed = 1),
      (n.loop = !0),
      (n.updateAnchor = !1),
      (n.onComplete = null),
      (n.onFrameChange = null),
      (n.onLoop = null),
      (n._currentTime = 0),
      (n._playing = !1),
      (n._previousFrame = null),
      (n.textures = e),
      n
    );
  }
  return (
    (r.prototype.stop = function () {
      !this._playing ||
        ((this._playing = !1),
        this._autoUpdate &&
          this._isConnectedToTicker &&
          (mt.shared.remove(this.update, this),
          (this._isConnectedToTicker = !1)));
    }),
    (r.prototype.play = function () {
      this._playing ||
        ((this._playing = !0),
        this._autoUpdate &&
          !this._isConnectedToTicker &&
          (mt.shared.add(this.update, this, Xt.HIGH),
          (this._isConnectedToTicker = !0)));
    }),
    (r.prototype.gotoAndStop = function (e) {
      this.stop();
      var i = this.currentFrame;
      (this._currentTime = e), i !== this.currentFrame && this.updateTexture();
    }),
    (r.prototype.gotoAndPlay = function (e) {
      var i = this.currentFrame;
      (this._currentTime = e),
        i !== this.currentFrame && this.updateTexture(),
        this.play();
    }),
    (r.prototype.update = function (e) {
      if (!!this._playing) {
        var i = this.animationSpeed * e,
          n = this.currentFrame;
        if (this._durations !== null) {
          var s = (this._currentTime % 1) * this._durations[this.currentFrame];
          for (s += (i / 60) * 1e3; s < 0; )
            this._currentTime--, (s += this._durations[this.currentFrame]);
          var a = Math.sign(this.animationSpeed * e);
          for (
            this._currentTime = Math.floor(this._currentTime);
            s >= this._durations[this.currentFrame];

          )
            (s -= this._durations[this.currentFrame] * a),
              (this._currentTime += a);
          this._currentTime += s / this._durations[this.currentFrame];
        } else this._currentTime += i;
        this._currentTime < 0 && !this.loop
          ? (this.gotoAndStop(0), this.onComplete && this.onComplete())
          : this._currentTime >= this._textures.length && !this.loop
          ? (this.gotoAndStop(this._textures.length - 1),
            this.onComplete && this.onComplete())
          : n !== this.currentFrame &&
            (this.loop &&
              this.onLoop &&
              (this.animationSpeed > 0 && this.currentFrame < n
                ? this.onLoop()
                : this.animationSpeed < 0 &&
                  this.currentFrame > n &&
                  this.onLoop()),
            this.updateTexture());
      }
    }),
    (r.prototype.updateTexture = function () {
      var e = this.currentFrame;
      this._previousFrame !== e &&
        ((this._previousFrame = e),
        (this._texture = this._textures[e]),
        (this._textureID = -1),
        (this._textureTrimmedID = -1),
        (this._cachedTint = 16777215),
        (this.uvs = this._texture._uvs.uvsFloat32),
        this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor),
        this.onFrameChange && this.onFrameChange(this.currentFrame));
    }),
    (r.prototype.destroy = function (e) {
      this.stop(),
        t.prototype.destroy.call(this, e),
        (this.onComplete = null),
        (this.onFrameChange = null),
        (this.onLoop = null);
    }),
    (r.fromFrames = function (e) {
      for (var i = [], n = 0; n < e.length; ++n) i.push(B.from(e[n]));
      return new r(i);
    }),
    (r.fromImages = function (e) {
      for (var i = [], n = 0; n < e.length; ++n) i.push(B.from(e[n]));
      return new r(i);
    }),
    Object.defineProperty(r.prototype, "totalFrames", {
      get: function () {
        return this._textures.length;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "textures", {
      get: function () {
        return this._textures;
      },
      set: function (e) {
        if (e[0] instanceof B) (this._textures = e), (this._durations = null);
        else {
          (this._textures = []), (this._durations = []);
          for (var i = 0; i < e.length; i++)
            this._textures.push(e[i].texture), this._durations.push(e[i].time);
        }
        (this._previousFrame = null), this.gotoAndStop(0), this.updateTexture();
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "currentFrame", {
      get: function () {
        var e = Math.floor(this._currentTime) % this._textures.length;
        return e < 0 && (e += this._textures.length), e;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "playing", {
      get: function () {
        return this._playing;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(r.prototype, "autoUpdate", {
      get: function () {
        return this._autoUpdate;
      },
      set: function (e) {
        e !== this._autoUpdate &&
          ((this._autoUpdate = e),
          !this._autoUpdate && this._isConnectedToTicker
            ? (mt.shared.remove(this.update, this),
              (this._isConnectedToTicker = !1))
            : this._autoUpdate &&
              !this._isConnectedToTicker &&
              this._playing &&
              (mt.shared.add(this.update, this),
              (this._isConnectedToTicker = !0)));
      },
      enumerable: !1,
      configurable: !0,
    }),
    r
  );
})(Ke);
/*!
 * pixi.js - v6.2.2
 * Compiled Wed, 26 Jan 2022 16:23:27 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */ qt.registerPlugin("accessibility", dc);
qt.registerPlugin("extract", Ld);
qt.registerPlugin("interaction", gc);
qt.registerPlugin("particle", Ep);
qt.registerPlugin("prepare", tv);
qt.registerPlugin("batch", Ad);
qt.registerPlugin("tilingSprite", ov);
Lt.registerPlugin(Tv);
Lt.registerPlugin(Jd);
Lt.registerPlugin(vp);
Lt.registerPlugin(xp);
Lt.registerPlugin(rv);
Vi.registerPlugin(pc);
Vi.registerPlugin(jd);
export { Vi as A, fo as G };
