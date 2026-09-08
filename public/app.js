// node_modules/lucide/dist/esm/createElement.js
var createElement = (tag, attrs, children = []) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((name) => {
    element.setAttribute(name, String(attrs[name]));
  });
  if (children.length) {
    children.forEach((child) => {
      const childElement = createElement(...child);
      element.appendChild(childElement);
    });
  }
  return element;
};
var createElement$1 = ([tag, attrs, children]) => createElement(tag, attrs, children);

// node_modules/lucide/dist/esm/replaceElement.js
var getAttrs = (element) => Array.from(element.attributes).reduce((attrs, attr) => {
  attrs[attr.name] = attr.value;
  return attrs;
}, {});
var getClassNames = (attrs) => {
  if (typeof attrs === "string")
    return attrs;
  if (!attrs || !attrs.class)
    return "";
  if (attrs.class && typeof attrs.class === "string") {
    return attrs.class.split(" ");
  }
  if (attrs.class && Array.isArray(attrs.class)) {
    return attrs.class;
  }
  return "";
};
var combineClassNames = (arrayOfClassnames) => {
  const classNameArray = arrayOfClassnames.flatMap(getClassNames);
  return classNameArray.map((classItem) => classItem.trim()).filter(Boolean).filter((value, index, self) => self.indexOf(value) === index).join(" ");
};
var toPascalCase = (string) => string.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
var replaceElement = (element, { nameAttr, icons: icons2, attrs }) => {
  const iconName = element.getAttribute(nameAttr);
  if (iconName == null)
    return;
  const ComponentName = toPascalCase(iconName);
  const iconNode = icons2[ComponentName];
  if (!iconNode) {
    return console.warn(
      `${element.outerHTML} icon name was not found in the provided icons object.`
    );
  }
  const elementAttrs = getAttrs(element);
  const [tag, iconAttributes, children] = iconNode;
  const iconAttrs = {
    ...iconAttributes,
    "data-lucide": iconName,
    ...attrs,
    ...elementAttrs
  };
  const classNames = combineClassNames(["lucide", `lucide-${iconName}`, elementAttrs, attrs]);
  if (classNames) {
    Object.assign(iconAttrs, {
      class: classNames
    });
  }
  const svgElement = createElement$1([tag, iconAttrs, children]);
  return element.parentNode?.replaceChild(svgElement, element);
};

// node_modules/lucide/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

// node_modules/lucide/dist/esm/icons/audio-waveform.js
var AudioWaveform = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
      }
    ]
  ]
];

// node_modules/lucide/dist/esm/icons/cloud-upload.js
var CloudUpload = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M12 13v8" }],
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "m8 17 4-4 4 4" }]
  ]
];

// node_modules/lucide/dist/esm/icons/download.js
var Download = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "7 10 12 15 17 10" }],
    ["line", { x1: "12", x2: "12", y1: "15", y2: "3" }]
  ]
];

// node_modules/lucide/dist/esm/icons/file-audio.js
var FileAudio = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
      "path",
      {
        d: "M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"
      }
    ]
  ]
];

// node_modules/lucide/dist/esm/icons/folder-plus.js
var FolderPlus = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M12 10v6" }],
    ["path", { d: "M9 13h6" }],
    [
      "path",
      {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      }
    ]
  ]
];

// node_modules/lucide/dist/esm/icons/gauge.js
var Gauge = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "m12 14 4-4" }],
    ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }]
  ]
];

// node_modules/lucide/dist/esm/icons/hard-drive.js
var HardDrive = [
  "svg",
  defaultAttributes,
  [
    ["line", { x1: "22", x2: "2", y1: "12", y2: "12" }],
    [
      "path",
      {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
      }
    ],
    ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16" }],
    ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16" }]
  ]
];

// node_modules/lucide/dist/esm/icons/history.js
var History = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["path", { d: "M12 7v5l4 2" }]
  ]
];

// node_modules/lucide/dist/esm/icons/list-end.js
var ListEnd = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M16 12H3" }],
    ["path", { d: "M16 6H3" }],
    ["path", { d: "M10 18H3" }],
    ["path", { d: "M21 6v10a2 2 0 0 1-2 2h-5" }],
    ["path", { d: "m16 16-2 2 2 2" }]
  ]
];

// node_modules/lucide/dist/esm/icons/maximize.js
var Maximize = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }],
    ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }],
    ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" }]
  ]
];

// node_modules/lucide/dist/esm/icons/music-2.js
var Music2 = [
  "svg",
  defaultAttributes,
  [
    ["circle", { cx: "8", cy: "18", r: "4" }],
    ["path", { d: "M12 18V2l7 4" }]
  ]
];

// node_modules/lucide/dist/esm/icons/music.js
var Music = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M9 18V5l12-2v13" }],
    ["circle", { cx: "6", cy: "18", r: "3" }],
    ["circle", { cx: "18", cy: "16", r: "3" }]
  ]
];

// node_modules/lucide/dist/esm/icons/panel-left.js
var PanelLeft = [
  "svg",
  defaultAttributes,
  [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }]
  ]
];

// node_modules/lucide/dist/esm/icons/pause.js
var Pause = [
  "svg",
  defaultAttributes,
  [
    ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1" }],
    ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1" }]
  ]
];

// node_modules/lucide/dist/esm/icons/play.js
var Play = ["svg", defaultAttributes, [["polygon", { points: "6 3 20 12 6 21 6 3" }]]];

// node_modules/lucide/dist/esm/icons/plus.js
var Plus = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }]
  ]
];

// node_modules/lucide/dist/esm/icons/refresh-cw.js
var RefreshCw = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
    ["path", { d: "M8 16H3v5" }]
  ]
];

// node_modules/lucide/dist/esm/icons/repeat-2.js
var Repeat2 = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "m2 9 3-3 3 3" }],
    ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "m22 15-3 3-3-3" }],
    ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10" }]
  ]
];

// node_modules/lucide/dist/esm/icons/rotate-ccw.js
var RotateCcw = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }]
  ]
];

// node_modules/lucide/dist/esm/icons/settings-2.js
var Settings2 = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M20 7h-9" }],
    ["path", { d: "M14 17H5" }],
    ["circle", { cx: "17", cy: "17", r: "3" }],
    ["circle", { cx: "7", cy: "7", r: "3" }]
  ]
];

// node_modules/lucide/dist/esm/icons/skip-back.js
var SkipBack = [
  "svg",
  defaultAttributes,
  [
    ["polygon", { points: "19 20 9 12 19 4 19 20" }],
    ["line", { x1: "5", x2: "5", y1: "19", y2: "5" }]
  ]
];

// node_modules/lucide/dist/esm/icons/square.js
var Square = [
  "svg",
  defaultAttributes,
  [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]]
];

// node_modules/lucide/dist/esm/icons/timer.js
var Timer = [
  "svg",
  defaultAttributes,
  [
    ["line", { x1: "10", x2: "14", y1: "2", y2: "2" }],
    ["line", { x1: "12", x2: "15", y1: "14", y2: "11" }],
    ["circle", { cx: "12", cy: "14", r: "8" }]
  ]
];

// node_modules/lucide/dist/esm/icons/trash-2.js
var Trash2 = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17" }]
  ]
];

// node_modules/lucide/dist/esm/icons/upload.js
var Upload = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "17 8 12 3 7 8" }],
    ["line", { x1: "12", x2: "12", y1: "3", y2: "15" }]
  ]
];

// node_modules/lucide/dist/esm/icons/volume-2.js
var Volume2 = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      }
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
    ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }]
  ]
];

// node_modules/lucide/dist/esm/icons/volume-x.js
var VolumeX = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      }
    ],
    ["line", { x1: "22", x2: "16", y1: "9", y2: "15" }],
    ["line", { x1: "16", x2: "22", y1: "9", y2: "15" }]
  ]
];

// node_modules/lucide/dist/esm/icons/x.js
var X = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ]
];

// node_modules/lucide/dist/esm/icons/youtube.js
var Youtube = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
      }
    ],
    ["path", { d: "m10 15 5-3-5-3z" }]
  ]
];

// node_modules/lucide/dist/esm/lucide.js
var createIcons = ({ icons: icons2 = {}, nameAttr = "data-lucide", attrs = {} } = {}) => {
  if (!Object.values(icons2).length) {
    throw new Error(
      "Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`"
    );
  }
  if (typeof document === "undefined") {
    throw new Error("`createIcons()` only works in a browser environment.");
  }
  const elementsToReplace = document.querySelectorAll(`[${nameAttr}]`);
  Array.from(elementsToReplace).forEach(
    (element) => replaceElement(element, { nameAttr, icons: icons2, attrs })
  );
  if (nameAttr === "data-lucide") {
    const deprecatedElements = document.querySelectorAll("[icon-name]");
    if (deprecatedElements.length > 0) {
      console.warn(
        "[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"
      );
      Array.from(deprecatedElements).forEach(
        (element) => replaceElement(element, { nameAttr: "icon-name", icons: icons2, attrs })
      );
    }
  }
};

// node_modules/wavesurfer.js/dist/wavesurfer.esm.js
function t(t3, e3, i3, n3) {
  return new (i3 || (i3 = Promise))((function(s3, r3) {
    function o3(t4) {
      try {
        l3(n3.next(t4));
      } catch (t5) {
        r3(t5);
      }
    }
    function a3(t4) {
      try {
        l3(n3.throw(t4));
      } catch (t5) {
        r3(t5);
      }
    }
    function l3(t4) {
      var e4;
      t4.done ? s3(t4.value) : (e4 = t4.value, e4 instanceof i3 ? e4 : new i3((function(t5) {
        t5(e4);
      }))).then(o3, a3);
    }
    l3((n3 = n3.apply(t3, e3 || [])).next());
  }));
}
var e = class {
  constructor() {
    this.listeners = {};
  }
  on(t3, e3, i3) {
    if (this.listeners[t3] || (this.listeners[t3] = /* @__PURE__ */ new Set()), null == i3 ? void 0 : i3.once) {
      const i4 = (...n3) => {
        this.un(t3, i4), e3(...n3);
      };
      return this.listeners[t3].add(i4), () => this.un(t3, i4);
    }
    return this.listeners[t3].add(e3), () => this.un(t3, e3);
  }
  un(t3, e3) {
    var i3;
    null === (i3 = this.listeners[t3]) || void 0 === i3 || i3.delete(e3);
  }
  once(t3, e3) {
    return this.on(t3, e3, { once: true });
  }
  unAll() {
    this.listeners = {};
  }
  emit(t3, ...e3) {
    this.listeners[t3] && this.listeners[t3].forEach(((t4) => t4(...e3)));
  }
};
var i = { decode: function(e3, i3) {
  return t(this, void 0, void 0, (function* () {
    const t3 = new AudioContext({ sampleRate: i3 });
    try {
      return yield t3.decodeAudioData(e3);
    } finally {
      "closed" !== t3.state && (yield t3.close().catch((() => {
      })));
    }
  }));
}, createBuffer: function(t3, e3) {
  if (!t3 || 0 === t3.length) throw new Error("channelData must be a non-empty array");
  if (e3 <= 0) throw new Error("duration must be greater than 0");
  if ("number" == typeof t3[0] && (t3 = [t3]), !t3[0] || 0 === t3[0].length) throw new Error("channelData must contain non-empty channel arrays");
  !(function(t4) {
    const e4 = t4[0];
    if (e4.some(((t5) => t5 > 1 || t5 < -1))) {
      const i4 = e4.length;
      let n3 = 0;
      for (let t5 = 0; t5 < i4; t5++) {
        const i5 = Math.abs(e4[t5]);
        i5 > n3 && (n3 = i5);
      }
      for (const e5 of t4) for (let t5 = 0; t5 < i4; t5++) e5[t5] /= n3;
    }
  })(t3);
  const i3 = t3.map(((t4) => t4 instanceof Float32Array ? t4 : Float32Array.from(t4)));
  return { duration: e3, length: i3[0].length, sampleRate: i3[0].length / e3, numberOfChannels: i3.length, getChannelData: (t4) => {
    const e4 = i3[t4];
    if (!e4) throw new Error(`Channel ${t4} not found`);
    return e4;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function n(t3, e3) {
  const i3 = e3.xmlns ? document.createElementNS(e3.xmlns, t3) : document.createElement(t3);
  for (const [t4, s3] of Object.entries(e3)) if ("children" === t4 && s3) for (const [t5, e4] of Object.entries(s3)) e4 instanceof Node ? i3.appendChild(e4) : "string" == typeof e4 ? i3.appendChild(document.createTextNode(e4)) : i3.appendChild(n(t5, e4));
  else "style" === t4 ? Object.assign(i3.style, s3) : "textContent" === t4 ? i3.textContent = s3 : i3.setAttribute(t4, s3.toString());
  return i3;
}
function s(t3, e3, i3) {
  const s3 = n(t3, e3 || {});
  return null == i3 || i3.appendChild(s3), s3;
}
function r(t3) {
  return t3 instanceof HTMLElement || "object" == typeof t3 && null !== t3 && t3.nodeType === Node.ELEMENT_NODE && "object" == typeof t3.style;
}
var o = Object.freeze({ __proto__: null, createElement: s, default: s, isHTMLElement: r });
var a = { fetchBlob: function(e3, i3, n3) {
  return t(this, void 0, void 0, (function* () {
    var s3;
    const r3 = yield fetch(e3, n3);
    if (r3.status >= 400) throw new Error(`Failed to fetch ${e3}: ${r3.status} (${r3.statusText})`);
    return (function(e4, i4, n4) {
      t(this, void 0, void 0, (function* () {
        var t3;
        if (!e4.body || !e4.headers) return;
        const s4 = e4.body.getReader(), r4 = Number(e4.headers.get("Content-Length")) || 0;
        let o3 = 0;
        const a3 = () => {
          s4.cancel();
        };
        if (n4) {
          if (n4.aborted) return void s4.cancel();
          n4.addEventListener("abort", a3, { once: true });
        }
        try {
          for (; ; ) {
            const e5 = yield s4.read();
            if (e5.done) break;
            if (o3 += (null === (t3 = e5.value) || void 0 === t3 ? void 0 : t3.length) || 0, r4 > 0) {
              const t4 = Math.round(o3 / r4 * 100);
              i4(t4);
            }
          }
        } catch (t4) {
          if (t4 instanceof DOMException && "AbortError" === t4.name) return;
          console.warn("Progress tracking error:", t4);
        } finally {
          n4 && n4.removeEventListener("abort", a3);
        }
      }));
    })(r3.clone(), i3, null !== (s3 = null == n3 ? void 0 : n3.signal) && void 0 !== s3 ? s3 : void 0), r3.blob();
  }));
} };
function l(t3) {
  let e3 = t3;
  const i3 = /* @__PURE__ */ new Set();
  return { get value() {
    return e3;
  }, set(t4) {
    Object.is(e3, t4) || (e3 = t4, i3.forEach(((t5) => t5(e3))));
  }, update(t4) {
    this.set(t4(e3));
  }, subscribe: (t4) => (i3.add(t4), () => i3.delete(t4)) };
}
function h(t3, e3) {
  const i3 = l(t3());
  return e3.forEach(((e4) => e4.subscribe((() => {
    const e5 = t3();
    Object.is(i3.value, e5) || i3.set(e5);
  })))), { get value() {
    return i3.value;
  }, subscribe: (t4) => i3.subscribe(t4) };
}
function c(t3, e3) {
  let i3;
  const n3 = () => {
    i3 && (i3(), i3 = void 0), i3 = t3();
  }, s3 = e3.map(((t4) => t4.subscribe(n3)));
  return n3(), () => {
    i3 && (i3(), i3 = void 0), s3.forEach(((t4) => t4()));
  };
}
var u = class extends e {
  get isPlayingSignal() {
    return this._isPlaying;
  }
  get currentTimeSignal() {
    return this._currentTime;
  }
  get durationSignal() {
    return this._duration;
  }
  get volumeSignal() {
    return this._volume;
  }
  get mutedSignal() {
    return this._muted;
  }
  get playbackRateSignal() {
    return this._playbackRate;
  }
  get seekingSignal() {
    return this._seeking;
  }
  constructor(t3) {
    super(), this.isExternalMedia = false, this._ownBlobUrl = null, this.reactiveMediaEventCleanups = [], t3.media ? (this.media = t3.media, this.isExternalMedia = true) : this.media = document.createElement("audio"), this._isPlaying = l(false), this._currentTime = l(0), this._duration = l(0), this._volume = l(this.media.volume), this._muted = l(this.media.muted), this._playbackRate = l(this.media.playbackRate || 1), this._seeking = l(false), this.setupReactiveMediaEvents(), t3.mediaControls && (this.media.controls = true), t3.autoplay && (this.media.autoplay = true), null != t3.playbackRate && this.onMediaEvent("canplay", (() => {
      null != t3.playbackRate && (this.media.playbackRate = t3.playbackRate);
    }), { once: true });
  }
  setupReactiveMediaEvents() {
    this.reactiveMediaEventCleanups.push(this.onMediaEvent("play", (() => {
      this._isPlaying.set(true);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause", (() => {
      this._isPlaying.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended", (() => {
      this._isPlaying.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate", (() => {
      this._currentTime.set(this.media.currentTime);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking", (() => {
      this._seeking.set(true);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked", (() => {
      this._seeking.set(false);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange", (() => {
      this._volume.set(this.media.volume), this._muted.set(this.media.muted);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange", (() => {
      this._playbackRate.set(this.media.playbackRate);
    })));
  }
  onMediaEvent(t3, e3, i3) {
    return this.media.addEventListener(t3, e3, i3), () => this.media.removeEventListener(t3, e3, i3);
  }
  getSrc() {
    return this.media.currentSrc || this.media.src || "";
  }
  revokeSrc() {
    this._ownBlobUrl && (URL.revokeObjectURL(this._ownBlobUrl), this._ownBlobUrl = null);
  }
  canPlayType(t3) {
    return "" !== this.media.canPlayType(t3);
  }
  setSrc(t3, e3) {
    const i3 = this.getSrc();
    if (t3 && i3 === t3) return;
    this.revokeSrc();
    const n3 = e3 instanceof Blob && (this.canPlayType(e3.type) || !t3) ? URL.createObjectURL(e3) : t3;
    if (n3 !== t3 && (this._ownBlobUrl = n3), i3 && this.media.removeAttribute("src"), n3 || t3) try {
      this.media.src = n3;
    } catch (e4) {
      this.media.src = t3;
    }
  }
  destroy() {
    this.reactiveMediaEventCleanups.forEach(((t3) => t3())), this.reactiveMediaEventCleanups = [], this.revokeSrc(), this.unAll(), this.isExternalMedia || (this.media.pause(), this.media.removeAttribute("src"), this.media.load(), this.media.remove());
  }
  setMediaElement(t3) {
    this.reactiveMediaEventCleanups.forEach(((t4) => t4())), this.reactiveMediaEventCleanups = [], this.media = t3, this.setupReactiveMediaEvents();
  }
  play() {
    return t(this, void 0, void 0, (function* () {
      try {
        return yield this.media.play();
      } catch (t3) {
        if (t3 instanceof DOMException && "AbortError" === t3.name) return;
        throw t3;
      }
    }));
  }
  pause() {
    this.media.pause();
  }
  isPlaying() {
    return !this.media.paused && !this.media.ended;
  }
  setTime(t3) {
    this.media.currentTime = Math.max(0, Math.min(t3, this.getDuration()));
  }
  getDuration() {
    return this.media.duration;
  }
  getCurrentTime() {
    return this.media.currentTime;
  }
  getVolume() {
    return this.media.volume;
  }
  setVolume(t3) {
    this.media.volume = t3;
  }
  getMuted() {
    return this.media.muted;
  }
  setMuted(t3) {
    this.media.muted = t3;
  }
  getPlaybackRate() {
    return this.media.playbackRate;
  }
  isSeeking() {
    return this.media.seeking;
  }
  setPlaybackRate(t3, e3) {
    null != e3 && (this.media.preservesPitch = e3), this.media.playbackRate = t3;
  }
  getMediaElement() {
    return this.media;
  }
  setSinkId(t3) {
    return this.media.setSinkId(t3);
  }
};
function d({ maxTop: t3, maxBottom: e3, halfHeight: i3, vScale: n3, barMinHeight: s3 = 0, barAlign: r3 }) {
  let o3 = Math.round(t3 * i3 * n3);
  let a3 = o3 + Math.round(e3 * i3 * n3) || 1;
  return a3 < s3 && (a3 = s3, r3 || (o3 = a3 / 2)), { topHeight: o3, totalHeight: a3 };
}
function p({ barAlign: t3, halfHeight: e3, topHeight: i3, totalHeight: n3, canvasHeight: s3 }) {
  return "top" === t3 ? 0 : "bottom" === t3 ? s3 - n3 : e3 - i3;
}
function m(t3, e3, i3) {
  const n3 = e3 - t3.left, s3 = i3 - t3.top;
  return [n3 / t3.width, s3 / t3.height];
}
function g(t3) {
  return Boolean(t3.barWidth || t3.barGap || t3.barAlign);
}
function f(t3, e3) {
  if (!g(e3)) return t3;
  const i3 = e3.barWidth || 0.5, n3 = i3 + (e3.barGap || i3 / 2);
  return 0 === n3 ? t3 : Math.floor(t3 / n3) * n3;
}
function v({ scrollLeft: t3, totalWidth: e3, numCanvases: i3 }) {
  if (0 === e3) return [0];
  const n3 = t3 / e3, s3 = Math.floor(n3 * i3);
  return [s3 - 1, s3, s3 + 1];
}
function b(t3) {
  const e3 = t3._cleanup;
  "function" == typeof e3 && e3();
}
function y(t3) {
  const e3 = l({ scrollLeft: t3.scrollLeft, scrollWidth: t3.scrollWidth, clientWidth: t3.clientWidth }), i3 = h((() => (function(t4) {
    const { scrollLeft: e4, scrollWidth: i4, clientWidth: n4 } = t4;
    if (0 === i4) return { startX: 0, endX: 1 };
    const s4 = e4 / i4, r3 = (e4 + n4) / i4;
    return { startX: Math.max(0, Math.min(1, s4)), endX: Math.max(0, Math.min(1, r3)) };
  })(e3.value)), [e3]), n3 = h((() => (function(t4) {
    return { left: t4.scrollLeft, right: t4.scrollLeft + t4.clientWidth };
  })(e3.value)), [e3]), s3 = () => {
    e3.set({ scrollLeft: t3.scrollLeft, scrollWidth: t3.scrollWidth, clientWidth: t3.clientWidth });
  };
  t3.addEventListener("scroll", s3, { passive: true });
  return { scrollData: e3, percentages: i3, bounds: n3, cleanup: () => {
    t3.removeEventListener("scroll", s3), b(e3);
  } };
}
var C = class extends e {
  constructor(t3, e3) {
    super(), this.timeouts = [], this.isScrollable = false, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = false, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.containerInlinePadding = 0, this.onClickWrapper = (t4) => {
      const e4 = this.wrapper.getBoundingClientRect(), [i4, n4] = m(e4, t4.clientX, t4.clientY);
      this.emit("click", i4, n4);
    }, this.onDblClickWrapper = (t4) => {
      const e4 = this.wrapper.getBoundingClientRect(), [i4, n4] = m(e4, t4.clientX, t4.clientY);
      this.emit("dblclick", i4, n4);
    }, this.subscriptions = [], this.options = t3;
    const i3 = this.parentFromOptionsContainer(t3.container);
    this.parent = i3;
    const [n3, s3] = this.initHtml();
    i3.appendChild(n3), this.container = n3, this.scrollContainer = s3.querySelector(".scroll"), this.wrapper = s3.querySelector(".wrapper"), this.canvasWrapper = s3.querySelector(".canvases"), this.progressWrapper = s3.querySelector(".progress"), this.cursor = s3.querySelector(".cursor"), this.calculateInlinePadding(), e3 && s3.appendChild(e3), this.initEvents();
  }
  parentFromOptionsContainer(t3) {
    let e3;
    if ("string" == typeof t3 ? e3 = document.querySelector(t3) : r(t3) && (e3 = t3), !e3) throw new Error("Container not found");
    return e3;
  }
  initEvents() {
    this.wrapper.addEventListener("click", this.onClickWrapper), this.wrapper.addEventListener("dblclick", this.onDblClickWrapper), true !== this.options.dragToSeek && "object" != typeof this.options.dragToSeek || this.initDrag(), this.scrollStream = y(this.scrollContainer);
    const t3 = c((() => {
      const { startX: t4, endX: e3 } = this.scrollStream.percentages.value, { left: i3, right: n3 } = this.scrollStream.bounds.value;
      this.emit("scroll", t4, e3, i3, n3);
    }), [this.scrollStream.percentages, this.scrollStream.bounds]);
    if (this.subscriptions.push(t3), "function" == typeof ResizeObserver) {
      const t4 = this.createDelay(100);
      this.resizeObserver = new ResizeObserver((() => {
        t4().then((() => this.onContainerResize())).catch((() => {
        }));
      })), this.resizeObserver.observe(this.scrollContainer);
    }
  }
  onContainerResize() {
    const t3 = this.parent.clientWidth;
    this.calculateInlinePadding(), t3 === this.lastContainerWidth && "auto" !== this.options.height || (this.lastContainerWidth = t3, this.reRender(), this.emit("resize"));
  }
  initDrag() {
    if (this.dragStream) return;
    this.dragStream = (function(t4, e3 = {}) {
      const { threshold: i3 = 3, mouseButton: n3 = 0, touchDelay: s3 = 100 } = e3, r3 = l(null), o3 = /* @__PURE__ */ new Map(), a3 = matchMedia("(pointer: coarse)").matches;
      let h3 = () => {
      };
      const c2 = (e4) => {
        if (e4.button !== n3) return;
        if (o3.has(e4.pointerId)) return;
        if (o3.set(e4.pointerId, e4), o3.size > 1) return;
        const l3 = e4.pointerId;
        let c3 = e4.clientX, u2 = e4.clientY, d3 = false;
        const p2 = Date.now(), m2 = t4.getBoundingClientRect(), { left: g2, top: f2 } = m2, v2 = (t5) => {
          if (t5.pointerId !== l3) return;
          if (t5.defaultPrevented || o3.size > 1) return;
          if (a3 && Date.now() - p2 < s3) return;
          const e5 = t5.clientX, n4 = t5.clientY, h4 = e5 - c3, m3 = n4 - u2;
          (d3 || Math.abs(h4) > i3 || Math.abs(m3) > i3) && (t5.preventDefault(), t5.stopPropagation(), d3 || (r3.set({ type: "start", x: c3 - g2, y: u2 - f2 }), d3 = true), r3.set({ type: "move", x: e5 - g2, y: n4 - f2, deltaX: h4, deltaY: m3 }), c3 = e5, u2 = n4);
        }, b2 = (t5) => {
          if (o3.delete(t5.pointerId)) {
            if (t5.pointerId === l3 && d3) {
              const e5 = t5.clientX, i4 = t5.clientY;
              r3.set({ type: "end", x: e5 - g2, y: i4 - f2 });
            }
            0 === o3.size && h3();
          }
        }, y2 = (t5) => {
          t5.relatedTarget && t5.relatedTarget !== document.documentElement || b2(t5);
        }, C2 = (t5) => {
          d3 && (t5.stopPropagation(), t5.preventDefault());
        }, S2 = (t5) => {
          t5.defaultPrevented || o3.size > 1 || d3 && t5.preventDefault();
        };
        document.addEventListener("pointermove", v2), document.addEventListener("pointerup", b2), document.addEventListener("pointerout", y2), document.addEventListener("pointercancel", y2), document.addEventListener("touchmove", S2, { passive: false }), document.addEventListener("click", C2, { capture: true }), h3 = () => {
          document.removeEventListener("pointermove", v2), document.removeEventListener("pointerup", b2), document.removeEventListener("pointerout", y2), document.removeEventListener("pointercancel", y2), document.removeEventListener("touchmove", S2), setTimeout((() => {
            document.removeEventListener("click", C2, { capture: true });
          }), 10);
        };
      };
      return t4.addEventListener("pointerdown", c2), { signal: r3, cleanup: () => {
        h3(), t4.removeEventListener("pointerdown", c2), o3.clear(), b(r3);
      } };
    })(this.wrapper);
    const t3 = c((() => {
      const t4 = this.dragStream.signal.value;
      if (!t4) return;
      const e3 = this.wrapper.getBoundingClientRect().width, i3 = (n3 = t4.x / e3) < 0 ? 0 : n3 > 1 ? 1 : n3;
      var n3;
      "start" === t4.type ? (this.isDragging = true, this.emit("dragstart", i3)) : "move" === t4.type ? this.emit("drag", i3) : "end" === t4.type && (this.isDragging = false, this.emit("dragend", i3));
    }), [this.dragStream.signal]);
    this.subscriptions.push(t3);
  }
  calculateInlinePadding() {
    const { paddingLeft: t3, paddingRight: e3 } = getComputedStyle(this.scrollContainer), i3 = parseFloat(t3) + parseFloat(e3);
    this.containerInlinePadding = Number.isNaN(i3) ? 0 : i3;
  }
  initHtml() {
    const t3 = document.createElement("div"), e3 = t3.attachShadow({ mode: "open" }), i3 = this.options.cspNonce && "string" == typeof this.options.cspNonce ? this.options.cspNonce.replace(/"/g, "") : "";
    return e3.innerHTML = `
      <style${i3 ? ` nonce="${i3}"` : ""}>
        :host {
          user-select: none;
          min-width: 1px;
        }
        :host audio {
          display: block;
          width: 100%;
        }
        :host .scroll {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          position: relative;
        }
        :host .noScrollbar {
          scrollbar-color: transparent;
          scrollbar-width: none;
        }
        :host .noScrollbar::-webkit-scrollbar {
          display: none;
          -webkit-appearance: none;
        }
        :host .wrapper {
          position: relative;
          overflow: visible;
          z-index: 2;
        }
        :host .canvases {
          min-height: ${this.getHeight(this.options.height, this.options.splitChannels)}px;
          pointer-events: none;
        }
        :host .canvases > div {
          position: relative;
        }
        :host canvas {
          display: block;
          position: absolute;
          top: 0;
          image-rendering: pixelated;
        }
        :host .progress {
          pointer-events: none;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
        }
        :host .progress > div {
          position: relative;
        }
        :host .cursor {
          pointer-events: none;
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 2px;
        }
      </style>

      <div class="scroll" part="scroll">
        <div class="wrapper" part="wrapper">
          <div class="canvases" part="canvases"></div>
          <div class="progress" part="progress"></div>
          <div class="cursor" part="cursor"></div>
        </div>
      </div>
    `, [t3, e3];
  }
  setOptions(t3) {
    var e3;
    if (this.options.container !== t3.container) {
      const e4 = this.parentFromOptionsContainer(t3.container);
      e4.appendChild(this.container), this.parent = e4;
    }
    true === t3.dragToSeek || "object" == typeof this.options.dragToSeek ? this.initDrag() : (null === (e3 = this.dragStream) || void 0 === e3 || e3.cleanup(), this.dragStream = null), this.options = t3, this.reRender();
  }
  getWrapper() {
    return this.wrapper;
  }
  getWidth() {
    return this.scrollContainer.clientWidth - this.containerInlinePadding;
  }
  getScroll() {
    return this.scrollContainer.scrollLeft;
  }
  setScroll(t3) {
    this.scrollContainer.scrollLeft = t3;
  }
  setScrollPercentage(t3) {
    const { scrollWidth: e3 } = this.scrollContainer, i3 = e3 * t3;
    this.setScroll(i3);
  }
  destroy() {
    var t3;
    this.wrapper.removeEventListener("click", this.onClickWrapper), this.wrapper.removeEventListener("dblclick", this.onDblClickWrapper), this.timeouts.forEach(((t4) => t4())), this.timeouts = [], this.subscriptions.forEach(((t4) => t4())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), null === (t3 = this.unsubscribeOnScroll) || void 0 === t3 || t3.forEach(((t4) => t4())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(t3 = 10) {
    let e3, i3;
    const n3 = () => {
      e3 && (clearTimeout(e3), e3 = void 0), i3 && (i3(), i3 = void 0);
    };
    return this.timeouts.push(n3), () => new Promise(((s3, r3) => {
      n3(), i3 = r3, e3 = setTimeout((() => {
        e3 = void 0, i3 = void 0, s3();
      }), t3);
    }));
  }
  getHeight(t3, e3) {
    var i3;
    const n3 = (null === (i3 = this.audioData) || void 0 === i3 ? void 0 : i3.numberOfChannels) || 1;
    return (function({ optionsHeight: t4, optionsSplitChannels: e4, parentHeight: i4, numberOfChannels: n4, defaultHeight: s3 = 128 }) {
      if (null == t4) return s3;
      const r3 = Number(t4);
      if (!isNaN(r3)) return r3;
      if ("auto" === t4) {
        const t5 = i4 || s3;
        return (null == e4 ? void 0 : e4.every(((t6) => !t6.overlay))) ? t5 / n4 : t5;
      }
      return s3;
    })({ optionsHeight: t3, optionsSplitChannels: e3, parentHeight: this.parent.clientHeight, numberOfChannels: n3, defaultHeight: 128 });
  }
  convertColorValues(t3, e3) {
    return (function(t4, e4, i3) {
      if (!Array.isArray(t4)) return t4 || "";
      if (0 === t4.length) return "#999";
      if (t4.length < 2) return t4[0] || "";
      const n3 = document.createElement("canvas"), s3 = n3.getContext("2d");
      if (!s3) return t4[0] || "";
      const r3 = i3 || n3.height * e4, o3 = s3.createLinearGradient(0, 0, 0, r3), a3 = 1 / (t4.length - 1);
      return t4.forEach(((t5, e5) => {
        o3.addColorStop(e5 * a3, t5);
      })), o3;
    })(t3, this.getPixelRatio(), null == e3 ? void 0 : e3.canvas.height);
  }
  getPixelRatio() {
    return t3 = window.devicePixelRatio, Math.max(1, t3 || 1);
    var t3;
  }
  renderBarWaveform(t3, e3, i3, n3) {
    const { width: s3, height: r3 } = i3.canvas, { halfHeight: o3, barWidth: a3, barRadius: l3, barIndexScale: h3, barSpacing: c2, barMinHeight: u2 } = (function({ width: t4, height: e4, length: i4, options: n4, pixelRatio: s4 }) {
      const r4 = e4 / 2, o4 = n4.barWidth ? n4.barWidth * s4 : 1, a4 = n4.barGap ? n4.barGap * s4 : n4.barWidth ? o4 / 2 : 0, l4 = o4 + a4 || 1;
      return { halfHeight: r4, barWidth: o4, barGap: a4, barRadius: n4.barRadius || 0, barMinHeight: n4.barMinHeight ? n4.barMinHeight * s4 : 0, barIndexScale: i4 > 0 ? t4 / l4 / i4 : 0, barSpacing: l4 };
    })({ width: s3, height: r3, length: (t3[0] || []).length, options: e3, pixelRatio: this.getPixelRatio() }), m2 = (function({ channelData: t4, barIndexScale: e4, barSpacing: i4, barWidth: n4, halfHeight: s4, vScale: r4, canvasHeight: o4, barAlign: a4, barMinHeight: l4 }) {
      const h4 = t4[0] || [], c3 = t4[1] || h4, u3 = h4.length, m3 = [];
      let g2 = 0, f2 = 0, v2 = 0;
      for (let t5 = 0; t5 <= u3; t5++) {
        const u4 = Math.round(t5 * e4);
        if (u4 > g2) {
          const { topHeight: t6, totalHeight: e5 } = d({ maxTop: f2, maxBottom: v2, halfHeight: s4, vScale: r4, barMinHeight: l4, barAlign: a4 }), h5 = p({ barAlign: a4, halfHeight: s4, topHeight: t6, totalHeight: e5, canvasHeight: o4 });
          m3.push({ x: g2 * i4, y: h5, width: n4, height: e5 }), g2 = u4, f2 = 0, v2 = 0;
        }
        const b2 = Math.abs(h4[t5] || 0), y2 = Math.abs(c3[t5] || 0);
        b2 > f2 && (f2 = b2), y2 > v2 && (v2 = y2);
      }
      return m3;
    })({ channelData: t3, barIndexScale: h3, barSpacing: c2, barWidth: a3, halfHeight: o3, vScale: n3, canvasHeight: r3, barAlign: e3.barAlign, barMinHeight: u2 });
    i3.beginPath();
    for (const t4 of m2) l3 && "roundRect" in i3 ? i3.roundRect(t4.x, t4.y, t4.width, t4.height, l3) : i3.rect(t4.x, t4.y, t4.width, t4.height);
    i3.fill(), i3.closePath();
  }
  renderLineWaveform(t3, e3, i3, n3) {
    const { width: s3, height: r3 } = i3.canvas, o3 = (function({ channelData: t4, width: e4, height: i4, vScale: n4 }) {
      const s4 = i4 / 2, r4 = t4[0] || [];
      return [r4, t4[1] || r4].map(((t5, i5) => {
        const r5 = t5.length, o4 = r5 ? e4 / r5 : 0, a3 = s4, l3 = 0 === i5 ? -1 : 1, h3 = [{ x: 0, y: a3 }];
        let c2 = 0, u2 = 0;
        for (let e5 = 0; e5 <= r5; e5++) {
          const i6 = Math.round(e5 * o4);
          if (i6 > c2) {
            const t6 = a3 + (Math.round(u2 * s4 * n4) || 1) * l3;
            h3.push({ x: c2, y: t6 }), c2 = i6, u2 = 0;
          }
          const r6 = Math.abs(t5[e5] || 0);
          r6 > u2 && (u2 = r6);
        }
        return h3.push({ x: c2, y: a3 }), h3;
      }));
    })({ channelData: t3, width: s3, height: r3, vScale: n3 });
    i3.beginPath();
    for (const t4 of o3) if (t4.length) {
      i3.moveTo(t4[0].x, t4[0].y);
      for (let e4 = 1; e4 < t4.length; e4++) {
        const n4 = t4[e4];
        i3.lineTo(n4.x, n4.y);
      }
    }
    i3.fill(), i3.closePath();
  }
  renderWaveform(t3, e3, i3) {
    if (i3.fillStyle = this.convertColorValues(e3.waveColor, i3), e3.renderFunction) return void e3.renderFunction(t3, i3);
    const n3 = (function({ channelData: t4, barHeight: e4, normalize: i4, maxPeak: n4 }) {
      var s3;
      const r3 = e4 || 1;
      if (!i4) return r3;
      const o3 = t4[0];
      if (!o3 || 0 === o3.length) return r3;
      let a3 = null != n4 ? n4 : 0;
      if (!n4) for (let t5 = 0; t5 < o3.length; t5++) {
        const e5 = null !== (s3 = o3[t5]) && void 0 !== s3 ? s3 : 0, i5 = Math.abs(e5);
        i5 > a3 && (a3 = i5);
      }
      return a3 ? r3 / a3 : r3;
    })({ channelData: t3, barHeight: e3.barHeight, normalize: e3.normalize, maxPeak: e3.maxPeak });
    g(e3) ? this.renderBarWaveform(t3, e3, i3, n3) : this.renderLineWaveform(t3, e3, i3, n3);
  }
  renderSingleCanvas(t3, e3, i3, n3, s3, r3, o3) {
    const a3 = this.getPixelRatio(), l3 = document.createElement("canvas");
    l3.width = Math.round(i3 * a3), l3.height = Math.round(n3 * a3), l3.style.width = `${i3}px`, l3.style.height = `${n3}px`, l3.style.left = `${Math.round(s3)}px`, r3.appendChild(l3);
    const h3 = l3.getContext("2d");
    if (e3.renderFunction ? (h3.fillStyle = this.convertColorValues(e3.waveColor, h3), e3.renderFunction(t3, h3)) : this.renderWaveform(t3, e3, h3), l3.width > 0 && l3.height > 0) {
      const t4 = l3.cloneNode(), i4 = t4.getContext("2d");
      i4.drawImage(l3, 0, 0), i4.globalCompositeOperation = "source-in", i4.fillStyle = this.convertColorValues(e3.progressColor, i4), i4.fillRect(0, 0, l3.width, l3.height), o3.appendChild(t4);
    }
  }
  renderMultiCanvas(t3, e3, i3, n3, s3, r3) {
    const o3 = this.getPixelRatio(), { clientWidth: a3 } = this.scrollContainer, l3 = i3 / o3, h3 = (function({ clientWidth: t4, totalWidth: e4, options: i4 }) {
      return f(Math.min(8e3, t4, e4), i4);
    })({ clientWidth: a3, totalWidth: l3, options: e3 });
    let c2 = {};
    if (0 === h3) return;
    const u2 = (i4) => {
      if (i4 < 0 || i4 >= d3) return;
      if (c2[i4]) return;
      c2[i4] = true;
      const o4 = i4 * h3;
      let a4 = Math.min(l3 - o4, h3);
      if (a4 = f(a4, e3), a4 <= 0) return;
      const u3 = (function({ channelData: t4, offset: e4, clampedWidth: i5, totalWidth: n4 }) {
        return t4.map(((t5) => {
          const s4 = Math.floor(e4 / n4 * t5.length), r4 = Math.floor((e4 + i5) / n4 * t5.length);
          return t5.slice(s4, r4);
        }));
      })({ channelData: t3, offset: o4, clampedWidth: a4, totalWidth: l3 });
      this.renderSingleCanvas(u3, e3, a4, n3, o4, s3, r3);
    }, d3 = Math.ceil(l3 / h3);
    if (!this.isScrollable) {
      for (let t4 = 0; t4 < d3; t4++) u2(t4);
      return;
    }
    if (v({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: l3, numCanvases: d3 }).forEach(((t4) => u2(t4))), d3 > 1) {
      const t4 = this.on("scroll", (() => {
        const { scrollLeft: t5 } = this.scrollContainer;
        Object.keys(c2).length > 10 && (s3.innerHTML = "", r3.innerHTML = "", c2 = {}), v({ scrollLeft: t5, totalWidth: l3, numCanvases: d3 }).forEach(((t6) => u2(t6)));
      }));
      this.unsubscribeOnScroll.push(t4);
    }
  }
  renderChannel(t3, e3, i3, n3) {
    var { overlay: s3 } = e3, r3 = (function(t4, e4) {
      var i4 = {};
      for (var n4 in t4) Object.prototype.hasOwnProperty.call(t4, n4) && e4.indexOf(n4) < 0 && (i4[n4] = t4[n4]);
      if (null != t4 && "function" == typeof Object.getOwnPropertySymbols) {
        var s4 = 0;
        for (n4 = Object.getOwnPropertySymbols(t4); s4 < n4.length; s4++) e4.indexOf(n4[s4]) < 0 && Object.prototype.propertyIsEnumerable.call(t4, n4[s4]) && (i4[n4[s4]] = t4[n4[s4]]);
      }
      return i4;
    })(e3, ["overlay"]);
    const o3 = document.createElement("div"), a3 = this.getHeight(r3.height, r3.splitChannels);
    o3.style.height = `${a3}px`, s3 && n3 > 0 && (o3.style.marginTop = `-${a3}px`), this.canvasWrapper.style.minHeight = `${a3}px`, this.canvasWrapper.appendChild(o3);
    const l3 = o3.cloneNode();
    this.progressWrapper.appendChild(l3), this.renderMultiCanvas(t3, r3, i3, a3, o3, l3);
  }
  render(e3) {
    return t(this, void 0, void 0, (function* () {
      var t3;
      this.timeouts.forEach(((t4) => t4())), this.timeouts = [], this.unsubscribeOnScroll.forEach(((t4) => t4())), this.unsubscribeOnScroll = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", null != this.options.width && (this.scrollContainer.style.width = "number" == typeof this.options.width ? `${this.options.width}px` : this.options.width);
      const i3 = this.getPixelRatio(), n3 = this.scrollContainer.clientWidth - this.containerInlinePadding, { scrollWidth: s3, isScrollable: r3, useParentWidth: o3, width: a3 } = (function({ duration: t4, minPxPerSec: e4 = 0, parentWidth: i4, fillParent: n4, pixelRatio: s4 }) {
        const r4 = Math.ceil(t4 * e4), o4 = r4 > i4, a4 = Boolean(n4 && !o4);
        return { scrollWidth: r4, isScrollable: o4, useParentWidth: a4, width: (a4 ? i4 : r4) * s4 };
      })({ duration: e3.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: n3, fillParent: this.options.fillParent, pixelRatio: i3 });
      if (this.isScrollable = r3, this.wrapper.style.width = o3 ? "100%" : `${s3}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e3, this.emit("render"), this.options.splitChannels) for (let i4 = 0; i4 < e3.numberOfChannels; i4++) {
        const n4 = Object.assign(Object.assign({}, this.options), null === (t3 = this.options.splitChannels) || void 0 === t3 ? void 0 : t3[i4]);
        this.renderChannel([e3.getChannelData(i4)], n4, a3, i4);
      }
      else {
        const t4 = [e3.getChannelData(0)];
        e3.numberOfChannels > 1 && t4.push(e3.getChannelData(1)), this.renderChannel(t4, this.options, a3, 0);
      }
      Promise.resolve().then((() => this.emit("rendered")));
    }));
  }
  reRender() {
    if (this.unsubscribeOnScroll.forEach(((t4) => t4())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: t3 } = this.scrollContainer, { right: e3 } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), !this.isScrollable && this.scrollContainer.scrollLeft) this.scrollContainer.scrollLeft = 0;
    else if (this.isScrollable && t3 !== this.scrollContainer.scrollWidth) {
      const { right: t4 } = this.progressWrapper.getBoundingClientRect(), i3 = (function(t5) {
        const e4 = 2 * t5;
        return (e4 < 0 ? Math.floor(e4) : Math.ceil(e4)) / 2;
      })(t4 - e3);
      this.scrollContainer.scrollLeft += i3;
    }
  }
  zoom(t3) {
    this.options.minPxPerSec = t3, this.reRender();
  }
  scrollIntoView(t3, e3 = false) {
    var i3;
    const { scrollLeft: n3, scrollWidth: s3, clientWidth: r3 } = this.scrollContainer, o3 = t3 * s3, a3 = n3, l3 = n3 + r3, h3 = r3 / 2;
    if (this.isDragging) {
      const t4 = 30;
      o3 + t4 > l3 ? this.scrollContainer.scrollLeft += t4 : o3 - t4 < a3 && (this.scrollContainer.scrollLeft -= t4);
    } else {
      (o3 < a3 || o3 > l3) && (this.scrollContainer.scrollLeft = o3 - (this.options.autoCenter ? h3 : 0));
      const t4 = o3 - n3 - h3;
      if (e3 && this.options.autoCenter && t4 > 0) {
        const e4 = null === (i3 = this.audioData) || void 0 === i3 ? void 0 : i3.duration;
        if (void 0 === e4 || e4 <= 0) return void (this.scrollContainer.scrollLeft += t4);
        const n4 = s3 / e4;
        this.scrollContainer.scrollLeft += n4 <= 600 ? Math.min(t4, 10) : t4;
      }
    }
  }
  renderProgress(t3, e3) {
    if (isNaN(t3)) return;
    const i3 = 100 * t3;
    this.canvasWrapper.style.clipPath = `polygon(${i3}% 0%, 100% 0%, 100% 100%, ${i3}% 100%)`, this.progressWrapper.style.width = `${i3}%`, this.cursor.style.left = `${i3}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${t3 * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(t3, e3);
  }
  exportImage(e3, i3, n3) {
    return t(this, void 0, void 0, (function* () {
      const t3 = this.canvasWrapper.querySelectorAll("canvas");
      if (!t3.length) throw new Error("No waveform data");
      if ("dataURL" === n3) {
        const n4 = Array.from(t3).map(((t4) => t4.toDataURL(e3, i3)));
        return Promise.resolve(n4);
      }
      return Promise.all(Array.from(t3).map(((t4) => new Promise(((n4, s3) => {
        t4.toBlob(((t5) => {
          t5 ? n4(t5) : s3(new Error("Could not export image"));
        }), e3, i3);
      })))));
    }));
  }
};
var S = class extends e {
  constructor() {
    super(...arguments), this.animationFrameId = null, this.isRunning = false;
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const t3 = () => {
      this.isRunning && (this.emit("tick"), this.animationFrameId = requestAnimationFrame(t3));
    };
    t3();
  }
  stop() {
    this.isRunning = false, null !== this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
  destroy() {
    this.stop(), this.unAll();
  }
};
var E = class extends e {
  constructor(t3) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playbackPosition = 0, this._muted = false, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = true, this.crossOrigin = null, this.seeking = false, this.autoplay = false, this.addEventListener = this.on, this.removeEventListener = this.un, this._destroyed = false, (function() {
      const t4 = globalThis.navigator;
      if (null == t4 ? void 0 : t4.audioSession) try {
        t4.audioSession.type = "playback";
      } catch (t5) {
        console.warn("Setting navigator.audioSession.type failed:", t5);
      }
    })(), this.audioContext = t3 || new AudioContext(), this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return t(this, void 0, void 0, (function* () {
    }));
  }
  remove() {
    this.destroy();
  }
  destroy() {
    if (!this._destroyed) {
      if (this._destroyed = true, this.currentSrc = "", this.bufferNode) {
        this.bufferNode.onended = null;
        try {
          this.bufferNode.stop();
        } catch (t3) {
        }
        this.bufferNode.disconnect(), this.bufferNode = null;
      }
      this.gainNode.disconnect(), "function" == typeof this.audioContext.close && Promise.resolve(this.audioContext.close.call(this.audioContext)).catch((() => {
      })), this.buffer = null, this.unAll();
    }
  }
  get src() {
    return this.currentSrc;
  }
  set src(t3) {
    if (this.currentSrc = t3, this._duration = void 0, !t3) return this.buffer = null, void this.emit("emptied");
    fetch(t3).then(((e3) => {
      if (e3.status >= 400) throw new Error(`Failed to fetch ${t3}: ${e3.status} (${e3.statusText})`);
      return e3.arrayBuffer();
    })).then(((e3) => this.currentSrc !== t3 ? null : this.audioContext.decodeAudioData(e3))).then(((e3) => {
      this.currentSrc === t3 && (this.buffer = e3, this.emit("loadedmetadata"), this.emit("canplay"), this.autoplay && this.play());
    })).catch(((t4) => {
      console.error("WebAudioPlayer load error:", t4);
    }));
  }
  _play() {
    if (!this.paused) return;
    this.paused = false, this.bufferNode && (this.bufferNode.onended = null, this.bufferNode.disconnect()), this.bufferNode = this.audioContext.createBufferSource(), this.buffer && (this.bufferNode.buffer = this.buffer), this.bufferNode.playbackRate.value = this._playbackRate, this.bufferNode.connect(this.gainNode);
    let t3 = this.playbackPosition;
    (t3 >= this.duration || t3 < 0) && (t3 = 0, this.playbackPosition = 0), this.bufferNode.start(this.audioContext.currentTime, t3), this.playStartTime = this.audioContext.currentTime, this.bufferNode.onended = () => {
      !this.paused && this.duration - this.currentTime < 0.01 && (this.pause(), this.emit("ended"));
    };
  }
  _pause() {
    if (this.paused = true, this.bufferNode) {
      this.bufferNode.onended = null;
      try {
        this.bufferNode.stop();
      } catch (t3) {
      }
    }
    this.playbackPosition += (this.audioContext.currentTime - this.playStartTime) * this._playbackRate;
  }
  play() {
    return t(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(t3) {
    const e3 = (t3 - this.currentTime) / this._playbackRate, i3 = this.bufferNode;
    null == i3 || i3.stop(this.audioContext.currentTime + e3), null == i3 || i3.addEventListener("ended", (() => {
      i3 === this.bufferNode && (this.bufferNode = null, this.pause(), this.playbackPosition = Math.min(t3, this.duration), this.emit("timeupdate"));
    }), { once: true });
  }
  setSinkId(e3) {
    return t(this, void 0, void 0, (function* () {
      return this.audioContext.setSinkId(e3);
    }));
  }
  get playbackRate() {
    return this._playbackRate;
  }
  set playbackRate(t3) {
    const e3 = !this.paused;
    e3 && this._pause(), this._playbackRate = t3, e3 && this._play(), this.bufferNode && (this.bufferNode.playbackRate.value = t3);
  }
  get currentTime() {
    return this.paused ? this.playbackPosition : this.playbackPosition + (this.audioContext.currentTime - this.playStartTime) * this._playbackRate;
  }
  set currentTime(t3) {
    const e3 = !this.paused;
    e3 && this._pause(), this.playbackPosition = t3, e3 && this._play(), this.emit("seeking"), this.emit("timeupdate");
  }
  get duration() {
    var t3, e3;
    return null !== (t3 = this._duration) && void 0 !== t3 ? t3 : (null === (e3 = this.buffer) || void 0 === e3 ? void 0 : e3.duration) || 0;
  }
  set duration(t3) {
    this._duration = t3;
  }
  get volume() {
    return this.gainNode.gain.value;
  }
  set volume(t3) {
    this.gainNode.gain.value = t3, this.emit("volumechange");
  }
  get muted() {
    return this._muted;
  }
  set muted(t3) {
    this._muted !== t3 && (this._muted = t3, this._muted ? this.gainNode.disconnect() : this.gainNode.connect(this.audioContext.destination));
  }
  canPlayType(t3) {
    return /^(audio|video)\//.test(t3);
  }
  getGainNode() {
    return this.gainNode;
  }
  getChannelData() {
    const t3 = [];
    if (!this.buffer) return t3;
    const e3 = this.buffer.numberOfChannels;
    for (let i3 = 0; i3 < e3; i3++) t3.push(this.buffer.getChannelData(i3));
    return t3;
  }
  removeAttribute(t3) {
    switch (t3) {
      case "src":
        this.src = "";
        break;
      case "playbackRate":
        this.playbackRate = 0;
        break;
      case "currentTime":
        this.currentTime = 0;
        break;
      case "duration":
        this.duration = 0;
        break;
      case "volume":
        this.volume = 0;
        break;
      case "muted":
        this.muted = false;
    }
  }
};
var P = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: true, interact: true, dragToSeek: false, autoScroll: true, autoCenter: true, sampleRate: 8e3 };
var w = class _w extends u {
  static create(t3) {
    return new _w(t3);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(t3) {
    const e3 = t3.media || ("WebAudio" === t3.backend ? new E() : void 0);
    super({ media: e3, mediaControls: t3.mediaControls, autoplay: t3.autoplay, playbackRate: t3.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this._isDestroyed = false, this._loadVersion = 0, this.reactiveCleanups = [], this.options = Object.assign({}, P, t3);
    const { state: i3, actions: n3 } = (function(t4) {
      var e4, i4, n4, s4, r4, o3;
      const a3 = null !== (e4 = null == t4 ? void 0 : t4.currentTime) && void 0 !== e4 ? e4 : l(0), c2 = null !== (i4 = null == t4 ? void 0 : t4.duration) && void 0 !== i4 ? i4 : l(0), u2 = null !== (n4 = null == t4 ? void 0 : t4.isPlaying) && void 0 !== n4 ? n4 : l(false), d3 = null !== (s4 = null == t4 ? void 0 : t4.isSeeking) && void 0 !== s4 ? s4 : l(false), p2 = null !== (r4 = null == t4 ? void 0 : t4.volume) && void 0 !== r4 ? r4 : l(1), m2 = null !== (o3 = null == t4 ? void 0 : t4.playbackRate) && void 0 !== o3 ? o3 : l(1), g2 = l(null), f2 = l(null), v2 = l(""), b2 = l(0), y2 = l(0), C2 = h((() => !u2.value), [u2]), S2 = h((() => null !== g2.value), [g2]), E2 = h((() => S2.value && c2.value > 0), [S2, c2]), P2 = h((() => a3.value), [a3]), w2 = h((() => c2.value > 0 ? a3.value / c2.value : 0), [a3, c2]);
      return { state: { currentTime: a3, duration: c2, isPlaying: u2, isPaused: C2, isSeeking: d3, volume: p2, playbackRate: m2, audioBuffer: g2, peaks: f2, url: v2, zoom: b2, scrollPosition: y2, canPlay: S2, isReady: E2, progress: P2, progressPercent: w2 }, actions: { setCurrentTime: (t5) => {
        const e5 = Math.max(0, Math.min(c2.value || 1 / 0, t5));
        a3.set(e5);
      }, setDuration: (t5) => {
        c2.set(Math.max(0, t5));
      }, setPlaying: (t5) => {
        u2.set(t5);
      }, setSeeking: (t5) => {
        d3.set(t5);
      }, setVolume: (t5) => {
        const e5 = Math.max(0, Math.min(1, t5));
        p2.set(e5);
      }, setPlaybackRate: (t5) => {
        const e5 = Math.max(0.1, Math.min(16, t5));
        m2.set(e5);
      }, setAudioBuffer: (t5) => {
        g2.set(t5), t5 && c2.set(t5.duration);
      }, setPeaks: (t5) => {
        f2.set(t5);
      }, setUrl: (t5) => {
        v2.set(t5);
      }, setZoom: (t5) => {
        b2.set(Math.max(0, t5));
      }, setScrollPosition: (t5) => {
        y2.set(Math.max(0, t5));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i3, this.wavesurferActions = n3, this.timer = new S();
    const s3 = e3 ? void 0 : this.getMediaElement();
    this.renderer = new C(this.options, s3), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const r3 = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: t4, duration: e4 } = this.options;
      (r3 || t4 && e4) && this.load(r3, t4, e4).catch((() => {
      }));
    }));
  }
  updateProgress(t3 = this.getCurrentTime()) {
    return this.renderer.renderProgress(t3 / this.getDuration(), this.isPlaying()), t3;
  }
  initTimerEvents() {
    this.subscriptions.push(this.timer.on("tick", (() => {
      if (!this.isSeeking()) {
        const t3 = this.updateProgress();
        if (this.emit("timeupdate", t3), this.emit("audioprocess", t3), null != this.stopAtPosition && this.isPlaying() && t3 >= this.stopAtPosition) {
          const t4 = this.stopAtPosition;
          this.pause(), this.setTime(t4);
        }
      }
    })));
  }
  initReactiveState() {
    this.reactiveCleanups.push((function(t3, e3) {
      const i3 = [];
      i3.push(c((() => {
        const i4 = t3.isPlaying.value;
        e3.emit(i4 ? "play" : "pause");
      }), [t3.isPlaying])), i3.push(c((() => {
        const i4 = t3.currentTime.value;
        e3.emit("timeupdate", i4), t3.isPlaying.value && e3.emit("audioprocess", i4);
      }), [t3.currentTime, t3.isPlaying])), i3.push(c((() => {
        t3.isSeeking.value && e3.emit("seeking", t3.currentTime.value);
      }), [t3.isSeeking, t3.currentTime]));
      let n3 = false;
      i3.push(c((() => {
        t3.isReady.value && !n3 && (n3 = true, e3.emit("ready", t3.duration.value));
      }), [t3.isReady, t3.duration])), i3.push(c((() => {
        null === t3.audioBuffer.value && (n3 = false);
      }), [t3.audioBuffer]));
      let s3 = false;
      return i3.push(c((() => {
        const i4 = t3.isPlaying.value, n4 = t3.currentTime.value, r3 = t3.duration.value, o3 = r3 > 0 && n4 >= r3;
        s3 && !i4 && o3 && e3.emit("finish"), s3 = i4 && o3;
      }), [t3.isPlaying, t3.currentTime, t3.duration])), i3.push(c((() => {
        const i4 = t3.zoom.value;
        i4 > 0 && e3.emit("zoom", i4);
      }), [t3.zoom])), () => {
        i3.forEach(((t4) => t4()));
      };
    })(this.wavesurferState, { emit: this.emit.bind(this) }));
  }
  initPlayerEvents() {
    this.isPlaying() && (this.emit("play"), this.timer.start()), this.mediaSubscriptions.push(this.onMediaEvent("timeupdate", (() => {
      const t3 = this.updateProgress();
      this.emit("timeupdate", t3);
    })), this.onMediaEvent("play", (() => {
      this.emit("play"), this.timer.start();
    })), this.onMediaEvent("pause", (() => {
      this.emit("pause"), this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("emptied", (() => {
      this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("ended", (() => {
      this.emit("timeupdate", this.getDuration()), this.emit("finish"), this.stopAtPosition = null;
    })), this.onMediaEvent("seeking", (() => {
      this.emit("seeking", this.getCurrentTime());
    })), this.onMediaEvent("error", (() => {
      var t3;
      this.emit("error", null !== (t3 = this.getMediaElement().error) && void 0 !== t3 ? t3 : new Error("Media error")), this.stopAtPosition = null;
    })));
  }
  initRendererEvents() {
    this.subscriptions.push(this.renderer.on("click", ((t3, e3) => {
      this.options.interact && (this.seekTo(t3), this.emit("interaction", t3 * this.getDuration()), this.emit("click", t3, e3));
    })), this.renderer.on("dblclick", ((t3, e3) => {
      this.emit("dblclick", t3, e3);
    })), this.renderer.on("scroll", ((t3, e3, i3, n3) => {
      const s3 = this.getDuration();
      this.emit("scroll", t3 * s3, e3 * s3, i3, n3);
    })), this.renderer.on("render", (() => {
      this.emit("redraw");
    })), this.renderer.on("rendered", (() => {
      this.emit("redrawcomplete");
    })), this.renderer.on("dragstart", ((t3) => {
      this.emit("dragstart", t3);
    })), this.renderer.on("dragend", ((t3) => {
      this.emit("dragend", t3);
    })), this.renderer.on("resize", (() => {
      this.emit("resize");
    })));
    {
      let t3;
      const e3 = this.renderer.on("drag", ((e4) => {
        var i3;
        if (!this.options.interact) return;
        this.renderer.renderProgress(e4), clearTimeout(t3);
        let n3 = 0;
        const s3 = this.options.dragToSeek;
        this.isPlaying() ? n3 = 0 : true === s3 ? n3 = 200 : s3 && "object" == typeof s3 && (n3 = null !== (i3 = s3.debounceTime) && void 0 !== i3 ? i3 : 200), t3 = setTimeout((() => {
          this.seekTo(e4);
        }), n3), this.emit("interaction", e4 * this.getDuration()), this.emit("drag", e4);
      }));
      this.subscriptions.push((() => {
        clearTimeout(t3), e3();
      }));
    }
  }
  initPlugins() {
    var t3;
    (null === (t3 = this.options.plugins) || void 0 === t3 ? void 0 : t3.length) && this.options.plugins.forEach(((t4) => {
      this.registerPlugin(t4);
    }));
  }
  unsubscribePlayerEvents() {
    this.mediaSubscriptions.forEach(((t3) => t3())), this.mediaSubscriptions = [];
  }
  setOptions(t3) {
    this.options = Object.assign({}, this.options, t3), t3.duration && !t3.peaks && (this.decodedData = i.createBuffer(this.exportPeaks(), t3.duration)), t3.peaks && t3.duration && (this.decodedData = i.createBuffer(t3.peaks, t3.duration)), this.renderer.setOptions(this.options), t3.audioRate && this.setPlaybackRate(t3.audioRate), null != t3.mediaControls && (this.getMediaElement().controls = t3.mediaControls);
  }
  registerPlugin(t3) {
    if (this.plugins.includes(t3)) return t3;
    t3._init(this), this.plugins.push(t3);
    const e3 = t3.once("destroy", (() => {
      this.plugins = this.plugins.filter(((e4) => e4 !== t3)), this.subscriptions = this.subscriptions.filter(((t4) => t4 !== e3));
    }));
    return this.subscriptions.push(e3), t3;
  }
  unregisterPlugin(t3) {
    this.plugins = this.plugins.filter(((e3) => e3 !== t3)), t3.destroy();
  }
  getWrapper() {
    return this.renderer.getWrapper();
  }
  getWidth() {
    return this.renderer.getWidth();
  }
  getScroll() {
    return this.renderer.getScroll();
  }
  setScroll(t3) {
    return this.renderer.setScroll(t3);
  }
  setScrollTime(t3) {
    const e3 = t3 / this.getDuration();
    this.renderer.setScrollPercentage(e3);
  }
  getActivePlugins() {
    return this.plugins;
  }
  loadAudio(e3, n3, s3, r3) {
    return t(this, void 0, void 0, (function* () {
      var t3;
      const o3 = ++this._loadVersion;
      if (this._isDestroyed = false, this.emit("load", e3), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, null === (t3 = this.abortController) || void 0 === t3 || t3.abort(), this.abortController = null, !n3 && !s3) {
        const t4 = this.options.fetchParams || {};
        window.AbortController && !t4.signal && (this.abortController = new AbortController(), t4.signal = this.abortController.signal);
        const i3 = (t5) => this.emit("loading", t5);
        if (n3 = yield a.fetchBlob(e3, i3, t4), this._isDestroyed || o3 !== this._loadVersion) return;
        const s4 = this.options.blobMimeType;
        s4 && (n3 = new Blob([n3], { type: s4 }));
      }
      if (this._isDestroyed || o3 !== this._loadVersion) return;
      this.setSrc(e3, n3);
      const l3 = yield new Promise(((t4) => {
        const e4 = r3 || this.getDuration();
        e4 ? t4(e4) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => t4(this.getDuration())), { once: true }));
      }));
      if (!this._isDestroyed && o3 === this._loadVersion) {
        if (!e3 && !n3) {
          const t4 = this.getMediaElement();
          t4 instanceof E && (t4.duration = l3);
        }
        if (s3) this.decodedData = i.createBuffer(s3, l3 || 0);
        else if (n3) {
          const t4 = yield n3.arrayBuffer();
          if (this._isDestroyed || o3 !== this._loadVersion) return;
          this.decodedData = yield i.decode(t4, this.options.sampleRate);
        }
        this._isDestroyed || o3 !== this._loadVersion || (this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration()));
      }
    }));
  }
  load(e3, i3, n3) {
    return t(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e3, void 0, i3, n3);
      } catch (t3) {
        throw this.emit("error", t3), t3;
      }
    }));
  }
  loadBlob(e3, i3, n3) {
    return t(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e3, i3, n3);
      } catch (t3) {
        throw this.emit("error", t3), t3;
      }
    }));
  }
  zoom(t3) {
    if (!this.decodedData) throw new Error("No audio loaded");
    this.renderer.zoom(t3), this.emit("zoom", t3);
  }
  getDecodedData() {
    return this.decodedData;
  }
  exportPeaks({ channels: t3 = 2, maxLength: e3 = 8e3, precision: i3 = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const n3 = Math.min(t3, this.decodedData.numberOfChannels), s3 = [];
    for (let t4 = 0; t4 < n3; t4++) {
      const n4 = this.decodedData.getChannelData(t4), r3 = [], o3 = n4.length / e3;
      for (let t5 = 0; t5 < e3; t5++) {
        const e4 = n4.slice(Math.floor(t5 * o3), Math.ceil((t5 + 1) * o3));
        let s4 = 0;
        for (let t6 = 0; t6 < e4.length; t6++) {
          const i4 = e4[t6];
          Math.abs(i4) > Math.abs(s4) && (s4 = i4);
        }
        r3.push(Math.round(s4 * i3) / i3);
      }
      s3.push(r3);
    }
    return s3;
  }
  getDuration() {
    let t3 = super.getDuration() || 0;
    return 0 !== t3 && t3 !== 1 / 0 || !this.decodedData || (t3 = this.decodedData.duration), t3;
  }
  toggleInteraction(t3) {
    this.options.interact = t3;
  }
  setTime(t3) {
    this.stopAtPosition = null, super.setTime(t3), this.updateProgress(t3), this.emit("timeupdate", t3);
  }
  seekTo(t3) {
    const e3 = this.getDuration() * t3;
    this.setTime(e3);
  }
  play(e3, i3) {
    const n3 = Object.create(null, { play: { get: () => super.play } });
    return t(this, void 0, void 0, (function* () {
      null != e3 && this.setTime(e3);
      const t3 = yield n3.play.call(this);
      return null != i3 && (this.media instanceof E ? this.media.stopAt(i3) : this.stopAtPosition = i3), t3;
    }));
  }
  playPause() {
    return t(this, void 0, void 0, (function* () {
      return this.isPlaying() ? this.pause() : this.play();
    }));
  }
  stop() {
    this.pause(), this.setTime(0);
  }
  skip(t3) {
    this.setTime(this.getCurrentTime() + t3);
  }
  empty() {
    this.load("", [[0]], 1e-3);
  }
  setMediaElement(t3) {
    this.unsubscribePlayerEvents(), super.setMediaElement(t3), this.initPlayerEvents();
  }
  exportImage() {
    return t(this, arguments, void 0, (function* (t3 = "image/png", e3 = 1, i3 = "dataURL") {
      return this.renderer.exportImage(t3, e3, i3);
    }));
  }
  destroy() {
    var t3;
    this._isDestroyed = true, this.emit("destroy"), null === (t3 = this.abortController) || void 0 === t3 || t3.abort(), this.plugins.forEach(((t4) => t4.destroy())), this.subscriptions.forEach(((t4) => t4())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t4) => t4())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
};
w.BasePlugin = class extends e {
  constructor(t3) {
    super(), this.subscriptions = [], this.isDestroyed = false, this.options = t3;
  }
  onInit() {
  }
  _init(t3) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = false), this.wavesurfer = t3, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((t3) => t3())), this.subscriptions = [], this.isDestroyed = true, this.wavesurfer = void 0;
  }
}, w.dom = o;

// node_modules/wavesurfer.js/dist/plugins/regions.esm.js
var t2 = class {
  constructor() {
    this.listeners = {};
  }
  on(t3, e3, i3) {
    if (this.listeners[t3] || (this.listeners[t3] = /* @__PURE__ */ new Set()), null == i3 ? void 0 : i3.once) {
      const i4 = (...n3) => {
        this.un(t3, i4), e3(...n3);
      };
      return this.listeners[t3].add(i4), () => this.un(t3, i4);
    }
    return this.listeners[t3].add(e3), () => this.un(t3, e3);
  }
  un(t3, e3) {
    var i3;
    null === (i3 = this.listeners[t3]) || void 0 === i3 || i3.delete(e3);
  }
  once(t3, e3) {
    return this.on(t3, e3, { once: true });
  }
  unAll() {
    this.listeners = {};
  }
  emit(t3, ...e3) {
    this.listeners[t3] && this.listeners[t3].forEach(((t4) => t4(...e3)));
  }
};
var e2 = class extends t2 {
  constructor(t3) {
    super(), this.subscriptions = [], this.isDestroyed = false, this.options = t3;
  }
  onInit() {
  }
  _init(t3) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = false), this.wavesurfer = t3, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((t3) => t3())), this.subscriptions = [], this.isDestroyed = true, this.wavesurfer = void 0;
  }
};
function i2(t3, e3) {
  const n3 = e3.xmlns ? document.createElementNS(e3.xmlns, t3) : document.createElement(t3);
  for (const [t4, s3] of Object.entries(e3)) if ("children" === t4 && s3) for (const [t5, e4] of Object.entries(s3)) e4 instanceof Node ? n3.appendChild(e4) : "string" == typeof e4 ? n3.appendChild(document.createTextNode(e4)) : n3.appendChild(i2(t5, e4));
  else "style" === t4 ? Object.assign(n3.style, s3) : "textContent" === t4 ? n3.textContent = s3 : n3.setAttribute(t4, s3.toString());
  return n3;
}
function n2(t3, e3, n3) {
  const s3 = i2(t3, e3 || {});
  return null == n3 || n3.appendChild(s3), s3;
}
function s2(t3) {
  let e3 = t3;
  const i3 = /* @__PURE__ */ new Set();
  return { get value() {
    return e3;
  }, set(t4) {
    Object.is(e3, t4) || (e3 = t4, i3.forEach(((t5) => t5(e3))));
  }, update(t4) {
    this.set(t4(e3));
  }, subscribe: (t4) => (i3.add(t4), () => i3.delete(t4)) };
}
function r2(t3, e3) {
  let i3;
  const n3 = () => {
    i3 && (i3(), i3 = void 0), i3 = t3();
  }, s3 = e3.map(((t4) => t4.subscribe(n3)));
  return n3(), () => {
    i3 && (i3(), i3 = void 0), s3.forEach(((t4) => t4()));
  };
}
function o2(t3, e3) {
  const i3 = s2(null), n3 = (t4) => {
    i3.set(t4);
  };
  return t3.addEventListener(e3, n3), i3._cleanup = () => {
    t3.removeEventListener(e3, n3);
  }, i3;
}
function l2(t3) {
  const e3 = t3._cleanup;
  "function" == typeof e3 && e3();
}
function h2(t3, e3 = {}) {
  const { threshold: i3 = 3, mouseButton: n3 = 0, touchDelay: r3 = 100 } = e3, o3 = s2(null), h3 = /* @__PURE__ */ new Map(), a3 = matchMedia("(pointer: coarse)").matches;
  let d3 = () => {
  };
  const c2 = (e4) => {
    if (e4.button !== n3) return;
    if (h3.has(e4.pointerId)) return;
    if (h3.set(e4.pointerId, e4), h3.size > 1) return;
    const s3 = e4.pointerId;
    let l3 = e4.clientX, c3 = e4.clientY, u2 = false;
    const p2 = Date.now(), v2 = t3.getBoundingClientRect(), { left: g2, top: m2 } = v2, f2 = (t4) => {
      if (t4.pointerId !== s3) return;
      if (t4.defaultPrevented || h3.size > 1) return;
      if (a3 && Date.now() - p2 < r3) return;
      const e5 = t4.clientX, n4 = t4.clientY, d4 = e5 - l3, v3 = n4 - c3;
      (u2 || Math.abs(d4) > i3 || Math.abs(v3) > i3) && (t4.preventDefault(), t4.stopPropagation(), u2 || (o3.set({ type: "start", x: l3 - g2, y: c3 - m2 }), u2 = true), o3.set({ type: "move", x: e5 - g2, y: n4 - m2, deltaX: d4, deltaY: v3 }), l3 = e5, c3 = n4);
    }, b2 = (t4) => {
      if (h3.delete(t4.pointerId)) {
        if (t4.pointerId === s3 && u2) {
          const e5 = t4.clientX, i4 = t4.clientY;
          o3.set({ type: "end", x: e5 - g2, y: i4 - m2 });
        }
        0 === h3.size && d3();
      }
    }, E2 = (t4) => {
      t4.relatedTarget && t4.relatedTarget !== document.documentElement || b2(t4);
    }, C2 = (t4) => {
      u2 && (t4.stopPropagation(), t4.preventDefault());
    }, L = (t4) => {
      t4.defaultPrevented || h3.size > 1 || u2 && t4.preventDefault();
    };
    document.addEventListener("pointermove", f2), document.addEventListener("pointerup", b2), document.addEventListener("pointerout", E2), document.addEventListener("pointercancel", E2), document.addEventListener("touchmove", L, { passive: false }), document.addEventListener("click", C2, { capture: true }), d3 = () => {
      document.removeEventListener("pointermove", f2), document.removeEventListener("pointerup", b2), document.removeEventListener("pointerout", E2), document.removeEventListener("pointercancel", E2), document.removeEventListener("touchmove", L), setTimeout((() => {
        document.removeEventListener("click", C2, { capture: true });
      }), 10);
    };
  };
  t3.addEventListener("pointerdown", c2);
  return { signal: o3, cleanup: () => {
    d3(), t3.removeEventListener("pointerdown", c2), h3.clear(), l2(o3);
  } };
}
var a2 = class extends t2 {
  constructor(t3, e3, i3 = 0) {
    var n3, s3, r3, o3, l3, h3, a3, d3, c2, u2;
    super(), this.totalDuration = e3, this.numberOfChannels = i3, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = false, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = false, this.subscriptions = [], this.id = t3.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(t3.start), this.end = this.clampPosition(null !== (n3 = t3.end) && void 0 !== n3 ? n3 : t3.start), this.drag = null === (s3 = t3.drag) || void 0 === s3 || s3, this.resize = null === (r3 = t3.resize) || void 0 === r3 || r3, this.resizeStart = null === (o3 = t3.resizeStart) || void 0 === o3 || o3, this.resizeEnd = null === (l3 = t3.resizeEnd) || void 0 === l3 || l3, this.color = null !== (h3 = t3.color) && void 0 !== h3 ? h3 : "rgba(0, 0, 0, 0.1)", this.minLength = null !== (a3 = t3.minLength) && void 0 !== a3 ? a3 : this.minLength, this.maxLength = null !== (d3 = t3.maxLength) && void 0 !== d3 ? d3 : this.maxLength, this.channelIdx = null !== (c2 = t3.channelIdx) && void 0 !== c2 ? c2 : -1, this.contentEditable = null !== (u2 = t3.contentEditable) && void 0 !== u2 ? u2 : this.contentEditable, this.element = this.initElement(), this.setContent(t3.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
  }
  clampPosition(t3) {
    return Math.max(0, Math.min(this.totalDuration, t3));
  }
  setPart() {
    var t3;
    const e3 = this.start === this.end;
    null === (t3 = this.element) || void 0 === t3 || t3.setAttribute("part", `${e3 ? "marker" : "region"} ${this.id}`);
  }
  addResizeHandles(t3) {
    const e3 = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i3 = n2("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, e3), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, t3), s3 = n2("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, e3), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, t3), o3 = h2(i3, { threshold: 1 }), l3 = h2(s3, { threshold: 1 }), a3 = r2((() => {
      const t4 = o3.signal.value;
      t4 && ("move" === t4.type && void 0 !== t4.deltaX ? this.onResize(t4.deltaX, "start") : "end" === t4.type && this.onEndResizing("start"));
    }), [o3.signal]), d3 = r2((() => {
      const t4 = l3.signal.value;
      t4 && ("move" === t4.type && void 0 !== t4.deltaX ? this.onResize(t4.deltaX, "end") : "end" === t4.type && this.onEndResizing("end"));
    }), [l3.signal]);
    this.subscriptions.push((() => {
      a3(), d3(), o3.cleanup(), l3.cleanup();
    }));
  }
  removeResizeHandles(t3) {
    const e3 = t3.querySelector('[part*="region-handle-left"]'), i3 = t3.querySelector('[part*="region-handle-right"]');
    e3 && t3.removeChild(e3), i3 && t3.removeChild(i3);
  }
  initElement() {
    if (this.isRemoved) return null;
    const t3 = this.start === this.end;
    let e3 = 0, i3 = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (i3 = 100 / this.numberOfChannels, e3 = i3 * this.channelIdx);
    const s3 = n2("div", { style: { position: "absolute", top: `${e3}%`, height: `${i3}%`, backgroundColor: t3 ? "none" : this.color, borderLeft: t3 ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !t3 && this.resize && this.addResizeHandles(s3), s3;
  }
  renderPosition() {
    if (!this.element) return;
    const t3 = this.start / this.totalDuration, e3 = (this.totalDuration - this.end) / this.totalDuration;
    this.element.style.left = 100 * t3 + "%", this.element.style.right = 100 * e3 + "%";
  }
  toggleCursor(t3) {
    var e3;
    this.drag && (null === (e3 = this.element) || void 0 === e3 ? void 0 : e3.style) && (this.element.style.cursor = t3 ? "grabbing" : "grab");
  }
  initMouseEvents() {
    const { element: t3 } = this;
    if (!t3) return;
    const e3 = o2(t3, "click"), i3 = o2(t3, "mouseenter"), n3 = o2(t3, "mouseleave"), s3 = o2(t3, "dblclick"), a3 = o2(t3, "pointerdown"), d3 = o2(t3, "pointerup"), c2 = e3.subscribe(((t4) => t4 && this.emit("click", t4))), u2 = i3.subscribe(((t4) => t4 && this.emit("over", t4))), p2 = n3.subscribe(((t4) => t4 && this.emit("leave", t4))), v2 = s3.subscribe(((t4) => t4 && this.emit("dblclick", t4))), g2 = a3.subscribe(((t4) => t4 && this.toggleCursor(true))), m2 = d3.subscribe(((t4) => t4 && this.toggleCursor(false)));
    this.subscriptions.push((() => {
      c2(), u2(), p2(), v2(), g2(), m2(), l2(e3), l2(i3), l2(n3), l2(s3), l2(a3), l2(d3);
    }));
    const f2 = h2(t3), b2 = r2((() => {
      const t4 = f2.signal.value;
      t4 && ("start" === t4.type ? this.toggleCursor(true) : "move" === t4.type && void 0 !== t4.deltaX ? this.onMove(t4.deltaX) : "end" === t4.type && (this.toggleCursor(false), this.drag && this.emit("update-end")));
    }), [f2.signal]);
    this.subscriptions.push((() => {
      b2(), f2.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (t4) => this.onContentClick(t4), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(t3, e3, i3) {
    var n3;
    if (!(null === (n3 = this.element) || void 0 === n3 ? void 0 : n3.parentElement)) return;
    const { width: s3 } = this.element.parentElement.getBoundingClientRect(), r3 = t3 / s3 * this.totalDuration;
    let o3 = e3 && "start" !== e3 ? this.start : this.start + r3, l3 = e3 && "end" !== e3 ? this.end : this.end + r3;
    const h3 = void 0 !== i3;
    h3 && this.updatingSide && this.updatingSide !== e3 && ("start" === this.updatingSide ? o3 = i3 : l3 = i3), o3 = Math.max(0, o3), l3 = Math.min(this.totalDuration, l3);
    const a3 = l3 - o3;
    this.updatingSide = e3;
    const d3 = a3 >= this.minLength && a3 <= this.maxLength;
    o3 <= l3 && (d3 || h3) && (this.start = o3, this.end = l3, this.renderPosition(), this.emit("update", e3));
  }
  onMove(t3) {
    this.drag && this._onUpdate(t3);
  }
  onResize(t3, e3) {
    this.resize && (this.resizeStart || "start" !== e3) && (this.resizeEnd || "end" !== e3) && this._onUpdate(t3, e3);
  }
  onEndResizing(t3) {
    this.resize && (this.emit("update-end", t3), this.updatingSide = void 0);
  }
  onContentClick(t3) {
    t3.stopPropagation();
    t3.target.focus(), this.emit("click", t3);
  }
  onContentBlur() {
    this.emit("update-end");
  }
  _setTotalDuration(t3) {
    this.totalDuration = t3, this.renderPosition();
  }
  play(t3) {
    this.emit("play", t3 && this.end !== this.start ? this.end : void 0);
  }
  getContent(t3 = false) {
    var e3;
    return t3 ? this.content || void 0 : this.element instanceof HTMLElement ? (null === (e3 = this.content) || void 0 === e3 ? void 0 : e3.innerHTML) || void 0 : "";
  }
  setContent(t3) {
    var e3;
    if (this.element) if (this.content && this.contentEditable && (this.contentClickListener && this.content.removeEventListener("click", this.contentClickListener), this.contentBlurListener && this.content.removeEventListener("blur", this.contentBlurListener)), null === (e3 = this.content) || void 0 === e3 || e3.remove(), t3) {
      if ("string" == typeof t3) {
        const e4 = this.start === this.end;
        this.content = n2("div", { style: { padding: `0.2em ${e4 ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: t3 });
      } else this.content = t3;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (t4) => this.onContentClick(t4), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(t3) {
    var e3, i3;
    if (this.element) {
      if (t3.color && (this.color = t3.color, this.element.style.backgroundColor = this.color), void 0 !== t3.drag && (this.drag = t3.drag, this.element.style.cursor = this.drag ? "grab" : "default"), void 0 !== t3.start || void 0 !== t3.end) {
        const n3 = this.start === this.end;
        this.start = this.clampPosition(null !== (e3 = t3.start) && void 0 !== e3 ? e3 : this.start), this.end = this.clampPosition(null !== (i3 = t3.end) && void 0 !== i3 ? i3 : n3 ? this.start : this.end), this.renderPosition(), this.setPart(), this.emit("render");
      }
      if (t3.content && this.setContent(t3.content), t3.id && (this.id = t3.id, this.setPart()), void 0 !== t3.resize && t3.resize !== this.resize) {
        const e4 = this.start === this.end;
        this.resize = t3.resize, this.resize && !e4 ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      void 0 !== t3.resizeStart && (this.resizeStart = t3.resizeStart), void 0 !== t3.resizeEnd && (this.resizeEnd = t3.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = true, this.emit("remove"), this.subscriptions.forEach(((t3) => t3())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
};
var d2 = class _d extends e2 {
  constructor(t3) {
    super(t3), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(t3) {
    return new _d(t3);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t4) => {
      this.regions.forEach(((e3) => e3._setTotalDuration(t4)));
    })));
    let t3 = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((e3) => {
      const i3 = this.regions.filter(((t4) => t4.start <= e3 && (t4.end === t4.start ? t4.start + 0.05 : t4.end) >= e3));
      i3.forEach(((e4) => {
        t3.includes(e4) || this.emit("region-in", e4);
      })), t3.forEach(((t4) => {
        i3.includes(t4) || this.emit("region-out", t4);
      })), t3 = i3;
    })));
  }
  initRegionsContainer() {
    return n2("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(t3) {
    t3.content && !t3.isRemoved && setTimeout((() => {
      if (!t3.content) return;
      const e3 = t3.content;
      e3.style.marginTop = "0";
      const i3 = e3.getBoundingClientRect(), n3 = this.regions.indexOf(t3);
      if (n3 < 0) return;
      const s3 = this.regions.slice(0, n3).filter(((t4) => !t4.isRemoved)).reduce(((e4, n4) => {
        if (n4 === t3 || !n4.content) return e4;
        const s4 = n4.content.getBoundingClientRect();
        return i3.left < s4.right && s4.left < i3.right && e4.push(s4), e4;
      }), []).sort(((t4, e4) => t4.top - e4.top)).reduce(((t4, e4) => {
        const n4 = i3.top + t4, s4 = n4 + i3.height;
        return n4 < e4.bottom && e4.top < s4 ? e4.bottom - i3.top + 2 : t4;
      }), 0);
      e3.style.marginTop = `${s3}px`;
    }), 10);
  }
  avoidOverlappingAll() {
    this.regions.forEach(((t3) => this.avoidOverlapping(t3)));
  }
  adjustScroll(t3) {
    var e3, i3;
    if (!t3.element) return;
    const n3 = null === (i3 = null === (e3 = this.wavesurfer) || void 0 === e3 ? void 0 : e3.getWrapper()) || void 0 === i3 ? void 0 : i3.parentElement;
    if (!n3) return;
    const { clientWidth: s3, scrollWidth: r3 } = n3;
    if (r3 <= s3) return;
    const o3 = n3.getBoundingClientRect(), l3 = t3.element.getBoundingClientRect(), h3 = l3.left - o3.left, a3 = l3.right - o3.left;
    h3 < 0 ? n3.scrollLeft += h3 : a3 > s3 && (n3.scrollLeft += a3 - s3);
  }
  virtualAppend(t3, e3, i3) {
    const n3 = () => {
      if (!this.wavesurfer) return;
      const n4 = this.wavesurfer.getWidth(), s3 = this.wavesurfer.getScroll(), r3 = e3.clientWidth, o3 = this.wavesurfer.getDuration(), l3 = Math.round(t3.start / o3 * r3), h3 = l3 + (Math.round((t3.end - t3.start) / o3 * r3) || 1) > s3 && l3 < s3 + n4;
      h3 && !i3.parentElement ? e3.appendChild(i3) : !h3 && i3.parentElement && i3.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !t3.element) return;
      n3();
      const e4 = this.wavesurfer.on("scroll", n3), i4 = this.wavesurfer.on("zoom", n3), s3 = this.wavesurfer.on("resize", n3), r3 = t3.on("render", n3), o3 = [e4, i4, s3, r3];
      this.subscriptions.push(...o3), t3.once("remove", (() => {
        e4(), i4(), s3(), r3(), this.subscriptions = this.subscriptions.filter(((t4) => !o3.includes(t4)));
      }));
    }), 0);
  }
  saveRegion(t3) {
    if (!t3.element) return;
    this.virtualAppend(t3, this.regionsContainer, t3.element), this.avoidOverlapping(t3), this.regions.push(t3);
    const e3 = [t3.on("update", ((e4) => {
      e4 || this.adjustScroll(t3), this.emit("region-update", t3, e4);
    })), t3.on("update-end", ((e4) => {
      this.avoidOverlappingAll(), this.emit("region-updated", t3, e4);
    })), t3.on("play", ((e4) => {
      var i3;
      null === (i3 = this.wavesurfer) || void 0 === i3 || i3.play(t3.start, e4);
    })), t3.on("click", ((e4) => {
      this.emit("region-clicked", t3, e4);
    })), t3.on("dblclick", ((e4) => {
      this.emit("region-double-clicked", t3, e4);
    })), t3.on("content-changed", (() => {
      this.emit("region-content-changed", t3);
    })), t3.once("remove", (() => {
      e3.forEach(((t4) => t4())), this.subscriptions = this.subscriptions.filter(((t4) => !e3.includes(t4))), this.regions = this.regions.filter(((e4) => e4 !== t3)), this.emit("region-removed", t3);
    }))];
    this.subscriptions.push(...e3), this.emit("region-created", t3);
  }
  addRegion(t3) {
    var e3, i3;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const n3 = this.wavesurfer.getDuration(), s3 = null === (i3 = null === (e3 = this.wavesurfer) || void 0 === e3 ? void 0 : e3.getDecodedData()) || void 0 === i3 ? void 0 : i3.numberOfChannels, r3 = new a2(t3, n3, s3);
    if (this.emit("region-initialized", r3), n3) this.saveRegion(r3);
    else {
      const t4 = this.wavesurfer.once("ready", ((e4) => {
        r3._setTotalDuration(e4), this.saveRegion(r3), this.subscriptions = this.subscriptions.filter(((e5) => e5 !== t4));
      }));
      this.subscriptions.push(t4);
    }
    return r3;
  }
  enableDragSelection(t3, e3 = 3) {
    var i3;
    const n3 = null === (i3 = this.wavesurfer) || void 0 === i3 ? void 0 : i3.getWrapper();
    if (!(n3 && n3 instanceof HTMLElement)) return () => {
    };
    let s3 = null, o3 = 0, l3 = 0;
    const d3 = h2(n3, { threshold: e3 }), c2 = r2((() => {
      var e4, i4;
      const n4 = d3.signal.value;
      if (n4) if ("start" === n4.type) {
        if (o3 = n4.x, !this.wavesurfer) return;
        const r3 = this.wavesurfer.getDuration(), h3 = null === (i4 = null === (e4 = this.wavesurfer) || void 0 === e4 ? void 0 : e4.getDecodedData()) || void 0 === i4 ? void 0 : i4.numberOfChannels, { width: d4 } = this.wavesurfer.getWrapper().getBoundingClientRect();
        l3 = o3 / d4 * r3;
        const c3 = n4.x / d4 * r3, u2 = (n4.x + 5) / d4 * r3;
        s3 = new a2(Object.assign(Object.assign({}, t3), { start: c3, end: u2 }), r3, h3), this.emit("region-initialized", s3), s3.element && this.regionsContainer.appendChild(s3.element);
      } else "move" === n4.type && void 0 !== n4.deltaX ? s3 && s3._onUpdate(n4.deltaX, n4.x > o3 ? "end" : "start", l3) : "end" === n4.type && s3 && (this.saveRegion(s3), s3.updatingSide = void 0, s3 = null);
    }), [d3.signal]);
    return () => {
      c2(), d3.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((t3) => t3.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
};

// frontend/src/vendor.js
var icons = {
  AudioWaveform,
  CloudUpload,
  Download,
  FileAudio,
  FolderPlus,
  Gauge,
  ListEnd,
  HardDrive,
  History,
  Maximize,
  Music,
  Music2,
  PanelLeft,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Repeat2,
  RotateCcw,
  Settings2,
  SkipBack,
  Square,
  Timer,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  X,
  Youtube
};
var renderIcons = () => createIcons({ icons });

// frontend/src/app-dialog.js
var createAppDialog = (elements) => {
  let queue = Promise.resolve();
  const open = ({
    type,
    title,
    message,
    defaultValue = "",
    confirmLabel = "OK",
    cancelLabel = "\u30AD\u30E3\u30F3\u30BB\u30EB",
    danger = false,
    inputType = "text",
    readOnly = false
  }) => new Promise((resolve) => {
    const previouslyFocused = document.activeElement;
    elements.title.textContent = title;
    elements.message.textContent = message || "";
    elements.message.hidden = !message;
    const hasInput = type === "prompt" || type === "reveal";
    elements.inputWrap.hidden = !hasInput;
    elements.input.type = inputType;
    elements.input.readOnly = readOnly;
    elements.input.value = defaultValue;
    elements.cancel.hidden = type === "alert" || type === "reveal";
    elements.cancel.textContent = cancelLabel;
    elements.confirm.textContent = confirmLabel;
    elements.confirm.classList.toggle("danger", danger);
    elements.close.onclick = () => elements.dialog.close("cancel");
    elements.cancel.onclick = () => elements.dialog.close("cancel");
    const finish = () => {
      const accepted = elements.dialog.returnValue === "confirm";
      elements.dialog.removeEventListener("close", finish);
      elements.dialog.removeEventListener("cancel", handleCancel);
      previouslyFocused?.focus?.();
      elements.input.type = "text";
      elements.input.readOnly = false;
      if (type === "prompt") resolve(accepted ? elements.input.value : null);
      else resolve(type === "alert" ? void 0 : accepted);
    };
    const handleCancel = (event) => {
      event.preventDefault();
      elements.dialog.close("cancel");
    };
    elements.dialog.addEventListener("close", finish);
    elements.dialog.addEventListener("cancel", handleCancel);
    elements.dialog.returnValue = "cancel";
    elements.dialog.showModal();
    requestAnimationFrame(() => {
      if (hasInput) {
        elements.input.focus();
        elements.input.select();
      } else {
        elements.confirm.focus();
      }
    });
  });
  const enqueue = (options) => {
    const result = queue.then(() => open(options), () => open(options));
    queue = result.catch(() => {
    });
    return result;
  };
  return {
    alert: (message, options = {}) => enqueue({
      type: "alert",
      title: options.title || "\u304A\u77E5\u3089\u305B",
      message,
      confirmLabel: options.confirmLabel || "OK"
    }),
    confirm: (message, options = {}) => enqueue({
      type: "confirm",
      title: options.title || "\u78BA\u8A8D",
      message,
      confirmLabel: options.confirmLabel || "OK",
      cancelLabel: options.cancelLabel || "\u30AD\u30E3\u30F3\u30BB\u30EB",
      danger: options.danger || false
    }),
    prompt: (message, defaultValue = "", options = {}) => enqueue({
      type: "prompt",
      title: options.title || "\u5165\u529B",
      message,
      defaultValue,
      confirmLabel: options.confirmLabel || "\u4FDD\u5B58",
      cancelLabel: options.cancelLabel || "\u30AD\u30E3\u30F3\u30BB\u30EB",
      inputType: options.inputType || "text",
      readOnly: options.readOnly || false
    }),
    reveal: (message, value, options = {}) => enqueue({
      type: "reveal",
      title: options.title || "\u78BA\u8A8D",
      message,
      defaultValue: value,
      confirmLabel: options.confirmLabel || "\u9589\u3058\u308B",
      inputType: "text",
      readOnly: true
    })
  };
};

// frontend/src/library.js
var filterLibraryItems = (items, { query = "" } = {}) => {
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");
  return items.filter((item) => {
    if (!normalizedQuery) return true;
    const haystack = [item.title, ...item.tags || []].join(" ").toLocaleLowerCase("ja");
    return haystack.includes(normalizedQuery);
  });
};
var sortLibraryItems = (items, mode = "manual") => {
  if (mode === "manual") return items;
  const sorted = [...items];
  if (mode === "recent") {
    sorted.sort((left, right) => String(right.lastOpenedAt || "").localeCompare(String(left.lastOpenedAt || "")));
  } else if (mode === "added") {
    sorted.sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));
  } else if (mode === "title") {
    sorted.sort((left, right) => String(left.title || "").localeCompare(String(right.title || ""), "ja"));
  }
  return sorted;
};
var shouldUseStaticLibrary = ({ mode = "", hostname = "" } = {}) => mode === "static" || String(hostname).toLowerCase().endsWith(".r2.dev");

// frontend/src/loop-playback.js
var LOOP_START_TOLERANCE_SECONDS = 0.1;
var MIN_CUSTOM_LOOP_SECONDS = 0.1;
var clampCustomLoopRange = (start, end, duration) => {
  const mediaDuration = Number(duration);
  const rangeStart = Number(start);
  const rangeEnd = Number(end);
  if (!(mediaDuration > 0) || !Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd)) return null;
  const clampedStart = Math.min(mediaDuration, Math.max(0, rangeStart));
  const clampedEnd = Math.min(mediaDuration, Math.max(clampedStart, rangeEnd));
  if (clampedEnd - clampedStart < MIN_CUSTOM_LOOP_SECONDS) return null;
  return { start: clampedStart, end: clampedEnd, kind: "custom" };
};
var moveCustomLoopRange = (range, delta, duration) => {
  const rangeDuration = range.end - range.start;
  if (!(rangeDuration > 0) || !(duration > 0) || !Number.isFinite(delta)) return null;
  const start = Math.min(
    Math.max(0, range.start + delta),
    Math.max(0, duration - rangeDuration)
  );
  return { start, end: start + rangeDuration, kind: "custom" };
};
var shouldRestartLoop = (time, range) => {
  if (!range || !Number.isFinite(time)) return false;
  const start = Number(range.start);
  const end = Number(range.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
  return time < start - LOOP_START_TOLERANCE_SECONDS || time >= end;
};

// frontend/src/section-editor.js
var mutateSectionDraft = (draft, index, action) => {
  const next = draft.map((section2) => ({ ...section2 }));
  const section = next[index];
  if (!section) return next;
  if (action === "split" && section.startBar < section.endBar) {
    const midpoint = Math.floor((section.startBar + section.endBar) / 2);
    next.splice(
      index,
      1,
      { ...section, endBar: midpoint },
      { ...section, startBar: midpoint + 1 }
    );
  } else if (action === "merge" && next[index + 1]) {
    next.splice(index, 2, { ...section, endBar: next[index + 1].endBar });
  } else if (action === "delete" && next.length > 1) {
    if (index > 0) next[index - 1].endBar = section.endBar;
    else next[index + 1].startBar = section.startBar;
    next.splice(index, 1);
  }
  return next;
};
var normalizeSectionDraft = (draft, totalBars) => {
  const limit = Math.max(0, Math.round(Number(totalBars) || 0));
  if (!draft.length || limit < 1 || draft.length > limit) return draft.map((section) => ({ ...section }));
  let nextStart = 1;
  return draft.map((section, index) => {
    const remaining = draft.length - index - 1;
    const maxEnd = limit - remaining;
    const rawEnd = Math.round(Number(section.endBar) || nextStart);
    const endBar = index === draft.length - 1 ? limit : Math.max(nextStart, Math.min(maxEnd, rawEnd));
    const normalized = { ...section, startBar: nextStart, endBar };
    nextStart = endBar + 1;
    return normalized;
  });
};

// frontend/src/storage.js
var formatBytes = (bytes) => {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = value / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unit]}`;
};

// frontend/src/waveform-peaks.js
var extractWaveformPeaks = (audioBuffer, width) => {
  const pixelCount = Math.max(1, Math.floor(width));
  const channels = Number(audioBuffer?.numberOfChannels || 0);
  const samples = Number(audioBuffer?.length || 0);
  if (!channels || !samples || typeof audioBuffer.getChannelData !== "function") return new Float32Array(pixelCount);
  const channelData = Array.from({ length: channels }, (_, index) => audioBuffer.getChannelData(index));
  const peaks = new Float32Array(pixelCount);
  let strongest = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const start = Math.floor(pixel / pixelCount * samples);
    const end = Math.max(start + 1, Math.floor((pixel + 1) / pixelCount * samples));
    const step = Math.max(1, Math.floor((end - start) / 96));
    let peak = 0;
    for (let sample = start; sample < end; sample += step) {
      for (const data of channelData) peak = Math.max(peak, Math.abs(data[sample] || 0));
    }
    peaks[pixel] = peak;
    strongest = Math.max(strongest, peak);
  }
  if (strongest > 0) {
    for (let index = 0; index < peaks.length; index += 1) peaks[index] /= strongest;
  }
  return peaks;
};

// frontend/src/playback-sync.js
var clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
var planStemPlayback = ({ stemNames, mix, mobile, activated }) => {
  if (mobile && !activated) {
    return { useOriginalMix: true, activeStems: [] };
  }
  const activeStems = stemNames.filter((name) => Number(mix?.[name] ?? 0) > 0);
  return {
    useOriginalMix: false,
    activeStems
  };
};
var mediaSyncAction = ({
  masterTime,
  mediaTime,
  playbackRate: playbackRate2 = 1,
  force = false,
  hardDriftSeconds = 0.2,
  softDriftSeconds = 0.035,
  maxRateCorrection = 0.04
}) => {
  const baseRate = Math.max(0.01, Number(playbackRate2) || 1);
  const drift = Number(mediaTime) - Number(masterTime);
  if (!Number.isFinite(drift)) return { playbackRate: baseRate, seekTo: null, drift: 0 };
  if (force || Math.abs(drift) >= hardDriftSeconds) {
    return { playbackRate: baseRate, seekTo: Math.max(0, Number(masterTime) || 0), drift };
  }
  if (Math.abs(drift) < softDriftSeconds) {
    return { playbackRate: baseRate, seekTo: null, drift };
  }
  const correction = clamp(-drift * 0.2, -maxRateCorrection, maxRateCorrection);
  return {
    playbackRate: baseRate * (1 + correction),
    seekTo: null,
    drift
  };
};

// frontend/src/stem-transport.js
var createStemTransport = ({ getTime, getRate, isPlaying, onChange, onSync = () => {
}, holdMaster = () => () => {
} }) => {
  let players = {};
  let mix = {};
  let plan = { useOriginalMix: true, activeStems: [] };
  let state = "original";
  let failures = [];
  let manualOriginal = false;
  let masterWaiting = false;
  let generation = 0;
  let volume = 1;
  let releaseMaster = null;
  const preparations = /* @__PURE__ */ new Set();
  const cancelPreparation = (resume = false) => {
    for (const cancel of [...preparations]) cancel();
    const release = releaseMaster;
    releaseMaster = null;
    release?.(resume);
  };
  const prepare = (player, time) => new Promise((resolve, reject) => {
    let timeout;
    const finish = (error) => {
      clearTimeout(timeout);
      preparations.delete(cancel);
      for (const event of ["seeked", "canplay", "error"]) player.removeEventListener(event, ready);
      error ? reject(error) : resolve();
    };
    const cancel = () => finish(new Error("Superseded playback"));
    const ready = () => {
      if (player.error) finish(new Error("Stem unavailable"));
      else if (player.readyState >= 3 && !player.seeking) finish();
    };
    preparations.add(cancel);
    for (const event of ["seeked", "canplay", "error"]) player.addEventListener(event, ready);
    timeout = setTimeout(() => finish(new Error("Stem seek timed out")), 5e3);
    if (Math.abs(player.currentTime - time) > 5e-3) {
      try {
        player.currentTime = time;
      } catch (error) {
        finish(error);
        return;
      }
    }
    ready();
  });
  const blocked = /* @__PURE__ */ new Set();
  const listeners = [];
  const snapshot = () => ({ state, failures: [...failures], useOriginalMix: state !== "stems" && state !== "silent" });
  const notify = () => onChange(snapshot());
  const silencePlayers = () => {
    for (const player of Object.values(players)) {
      player.muted = true;
      player.pause();
    }
  };
  const sync = (time = getTime(), { force = false } = {}) => {
    let maximumDrift = 0;
    for (const name of plan.activeStems) {
      const player = players[name];
      if (!player) continue;
      if (Math.abs(player.playbackRate - getRate()) > 1e-3) player.playbackRate = getRate();
      if (force && player.readyState >= 1) {
        maximumDrift = Math.max(maximumDrift, Math.abs(player.currentTime - time));
        if (Math.abs(player.currentTime - time) > 0.02) {
          try {
            player.currentTime = time;
          } catch {
          }
        }
      }
    }
    if (force && plan.activeStems.length) onSync(time, maximumDrift, plan.activeStems.length);
  };
  const baseState = () => plan.useOriginalMix ? "original" : !plan.activeStems.length ? "silent" : manualOriginal ? "original" : failures.length ? "failed" : masterWaiting || blocked.size ? "waiting" : "ready";
  const fail = (names) => {
    failures = [.../* @__PURE__ */ new Set([...failures, ...names])];
    generation += 1;
    cancelPreparation(true);
    silencePlayers();
    state = baseState();
    notify();
  };
  const play = async () => {
    if (state === "starting") return false;
    if (state === "stems") return true;
    const token = ++generation;
    silencePlayers();
    state = baseState();
    if (state !== "ready" || !isPlaying()) {
      notify();
      return false;
    }
    state = "starting";
    notify();
    sync(getTime(), { force: true });
    const names = [...plan.activeStems];
    const results = await Promise.allSettled(names.map((name) => {
      const player = players[name];
      return player ? player.play() : Promise.reject(new Error("Missing stem"));
    }));
    if (token !== generation) return false;
    const failed = names.filter((_, i3) => results[i3].status === "rejected");
    if (failed.length) {
      fail(failed);
      return false;
    }
    if (!isPlaying()) {
      pause();
      return false;
    }
    releaseMaster = holdMaster();
    silencePlayers();
    const anchor = getTime();
    const prepared = await Promise.allSettled(names.map((name) => prepare(players[name], anchor)));
    if (token !== generation) return false;
    const unavailable = names.filter((_, i3) => prepared[i3].status === "rejected");
    if (unavailable.length) {
      fail(unavailable);
      return false;
    }
    const resumed = names.map((name) => players[name].play());
    const release = releaseMaster;
    releaseMaster = null;
    release?.(true);
    const started = await Promise.allSettled(resumed);
    if (token !== generation) return false;
    const rejected = names.filter((_, i3) => started[i3].status === "rejected");
    if (rejected.length) {
      fail(rejected);
      return false;
    }
    state = "stems";
    notify();
    for (const name of names) players[name].muted = false;
    notify();
    return true;
  };
  const pause = () => {
    generation += 1;
    cancelPreparation();
    silencePlayers();
    masterWaiting = false;
    state = baseState();
    notify();
  };
  const setMix = (nextPlan, nextMix, nextVolume) => {
    const changed = plan.useOriginalMix !== nextPlan.useOriginalMix || plan.activeStems.join() !== nextPlan.activeStems.join();
    plan = nextPlan;
    mix = nextMix;
    volume = nextVolume;
    failures = failures.filter((name) => plan.activeStems.includes(name));
    for (const name of [...blocked]) if (!plan.activeStems.includes(name)) blocked.delete(name);
    for (const [name, player] of Object.entries(players)) {
      player.volume = volume * Math.min(100, Math.max(0, Number(mix[name]) || 0)) / 100;
    }
    if (changed) {
      generation += 1;
      cancelPreparation(true);
      silencePlayers();
      state = baseState();
      if (isPlaying()) void play();
      else pause();
    }
  };
  const setPlayers = (next) => {
    destroy();
    players = next;
    manualOriginal = false;
    failures = [];
    for (const [name, player] of Object.entries(players)) {
      const listen = (event, handler) => {
        player.addEventListener(event, handler);
        listeners.push(() => player.removeEventListener(event, handler));
      };
      listen("error", () => {
        if (plan.activeStems.includes(name)) fail([name]);
      });
      const waiting = () => {
        if (state !== "stems" || player.seeking || !plan.activeStems.includes(name) || player.readyState >= 3) return;
        blocked.add(name);
        generation += 1;
        silencePlayers();
        state = "waiting";
        notify();
      };
      listen("waiting", waiting);
      listen("stalled", waiting);
      listen("canplay", () => {
        if (!blocked.has(name)) return;
        blocked.delete(name);
        if (!blocked.size && !masterWaiting && isPlaying()) void play();
      });
    }
    state = baseState();
    notify();
  };
  const setMasterWaiting = (waiting) => {
    if (masterWaiting === waiting) return;
    masterWaiting = waiting;
    if (waiting) {
      generation += 1;
      silencePlayers();
      state = baseState();
      notify();
    } else if (isPlaying()) void play();
  };
  const retry = () => {
    generation += 1;
    cancelPreparation(true);
    failures = [];
    manualOriginal = false;
    blocked.clear();
    silencePlayers();
    state = baseState();
    for (const player of Object.values(players)) if (player.error) player.load();
    return play();
  };
  const useOriginal = () => {
    manualOriginal = true;
    generation += 1;
    cancelPreparation(true);
    silencePlayers();
    state = baseState();
    notify();
  };
  const destroy = () => {
    generation += 1;
    cancelPreparation();
    listeners.splice(0).forEach((remove) => remove());
    silencePlayers();
    players = {};
    blocked.clear();
    failures = [];
    masterWaiting = false;
    manualOriginal = false;
    state = "original";
  };
  return { setPlayers, setMix, play, pause, sync, retry, useOriginal, setMasterWaiting, destroy, snapshot };
};

// frontend/src/aligned-click.js
var clickWave = (sampleRate) => {
  const wave = new Float32Array(Math.ceil(sampleRate * 0.055));
  let previous = 0, filtered = 0;
  const alpha = Math.exp(-2 * Math.PI * 700 / sampleRate);
  for (let i3 = 0; i3 < wave.length; i3++) {
    const t3 = i3 / sampleRate;
    const square = Math.sin(2 * Math.PI * 1800 * t3) >= 0 ? 1 : -1;
    filtered = alpha * (filtered + square - previous);
    previous = square;
    const envelope = t3 < 3e-3 ? 1e-4 * (0.9 / 1e-4) ** (t3 / 3e-3) : 0.9 * (1e-4 / 0.9) ** ((t3 - 3e-3) / 0.042);
    wave[i3] = filtered * envelope;
  }
  return wave;
};
var alignedWav = async (buffer, beats, { signal, yieldTask = () => new Promise((resolve) => setTimeout(resolve, 0)) } = {}) => {
  const { sampleRate, length } = buffer;
  const channels = 3, bytesPerFrame = channels * 4;
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  const text = (offset, value) => [...value].forEach((char, i3) => view.setUint8(offset + i3, char.charCodeAt(0)));
  if (length * bytesPerFrame + 36 > 4294967295) throw new Error("\u97F3\u6E90\u304C\u9577\u3059\u304E\u307E\u3059");
  text(0, "RIFF");
  view.setUint32(4, 36 + length * bytesPerFrame, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerFrame, true);
  view.setUint16(32, bytesPerFrame, true);
  view.setUint16(34, 32, true);
  text(36, "data");
  view.setUint32(40, length * bytesPerFrame, true);
  const left = buffer.getChannelData(0), right = buffer.getChannelData(Math.min(1, buffer.numberOfChannels - 1));
  const click = clickWave(sampleRate);
  const positions = [...new Set(beats.filter(Number.isFinite).filter((t3) => t3 >= 0).map((t3) => Math.round(t3 * sampleRate)))].sort((a3, b2) => a3 - b2);
  const chunks = [header];
  let beatIndex = 0;
  for (let start = 0; start < length; start += sampleRate) {
    signal?.throwIfAborted();
    const count = Math.min(sampleRate, length - start);
    const samples = new Float32Array(count * channels);
    for (let i3 = 0; i3 < count; i3++) {
      samples[i3 * 3] = left[start + i3];
      samples[i3 * 3 + 1] = right[start + i3];
    }
    while (beatIndex < positions.length && positions[beatIndex] + click.length <= start) beatIndex++;
    for (let j = beatIndex; j < positions.length && positions[j] < start + count; j++) {
      const offset = positions[j] - start;
      for (let k = Math.max(0, -offset); k < click.length && offset + k < count; k++) samples[(offset + k) * 3 + 2] += click[k];
    }
    chunks.push(samples);
    if (start % (sampleRate * 8) === 0) await yieldTask();
  }
  signal?.throwIfAborted();
  return new Blob(chunks, { type: "audio/wav" });
};
var connectAlignedOutput = (ctx, source, media) => {
  const splitter = ctx.createChannelSplitter(3);
  const stereo = ctx.createChannelMerger(2);
  const music = ctx.createGain(), click = ctx.createGain();
  source.connect(splitter);
  splitter.connect(stereo, 0, 0);
  splitter.connect(stereo, 1, 1);
  stereo.connect(music);
  music.connect(ctx.destination);
  splitter.connect(click, 2);
  click.gain.value = 0;
  click.connect(ctx.destination);
  let volume = media.volume, muted = media.muted;
  media.volume = 1;
  media.muted = false;
  const update = () => {
    music.gain.value = muted ? 0 : volume;
  };
  Object.defineProperty(media, "volume", { configurable: true, get: () => volume, set: (value) => {
    volume = Math.max(0, Math.min(1, Number(value) || 0));
    update();
  } });
  Object.defineProperty(media, "muted", { configurable: true, get: () => muted, set: (value) => {
    muted = !!value;
    update();
  } });
  update();
  return { click, destroy() {
    for (const node of [splitter, stereo, music, click]) node.disconnect();
    delete media.volume;
    delete media.muted;
    media.volume = volume;
    media.muted = muted;
  } };
};

// frontend/src/playback-clock.js
var selectPlaybackClock = ({ master, players = {}, activeStems = [], state }) => {
  if (state === "stems") {
    for (const name of activeStems) {
      const media = players[name];
      if (media && !media.paused && !media.seeking && !media.muted && media.volume > 0 && media.readyState >= 3) {
        return { media, name };
      }
    }
  }
  return { media: master, name: "original" };
};

// frontend/src/video-gestures.js
var videoClickAction = ({ pendingSingleClick = false, coarsePointer = false } = {}) => {
  if (!pendingSingleClick) return "wait";
  return coarsePointer ? "seek" : "fullscreen";
};

// frontend/src/app.js
var lucide = { createIcons: renderIcons };
var COLORS = {
  intro: "#94a3b8",
  verse: "#60a5fa",
  "pre-chorus": "#a78bfa",
  chorus: "#f97316",
  bridge: "#34d399",
  outro: "#94a3b8"
};
var LEGACY_SETTINGS_KEY = "music_structure_v1";
var SETTINGS_KEY = "practice_lab_v1";
var SCORE_HISTORY_KEY = "practice_lab_score_history_v1";
var APP_CONFIG = window.PRACTICE_LAB_CONFIG || {};
var DEFAULT_LIBRARY_BASE_URL = "sessions";
var LIBRARY_BASE_URL = (APP_CONFIG.libraryBaseUrl || DEFAULT_LIBRARY_BASE_URL).replace(/\/$/, "");
var STATIC_MANIFEST_URL = APP_CONFIG.manifestUrl || (LIBRARY_BASE_URL ? `${LIBRARY_BASE_URL}/manifest.json` : "");
var STATIC_FOLDERS_URL = APP_CONFIG.foldersUrl || (LIBRARY_BASE_URL ? `${LIBRARY_BASE_URL}/folders.json` : "");
var VIDEO_ASSET_VERSION = "20260517-h264";
var STEM_NAMES = ["vocals", "drums", "bass", "other"];
var DEFAULT_STEM_MIX = { vocals: 100, drums: 100, bass: 100, other: 100 };
var SELECTORS = {
  sidebar: document.getElementById("sidebar"),
  sidebarScrim: document.getElementById("sidebar-scrim"),
  btnMobileLibrary: document.getElementById("btn-mobile-library"),
  sessionPanel: document.getElementById("session-panel"),
  sidebarList: document.getElementById("sidebar-list"),
  sessionSearch: document.getElementById("session-search"),
  sessionSort: document.getElementById("session-sort"),
  scoreHistoryPanel: document.getElementById("score-history-panel"),
  scoreHistoryList: document.getElementById("score-history-list"),
  contextMenu: document.getElementById("context-menu"),
  queueDock: document.getElementById("queue-dock"),
  queueList: document.getElementById("queue-list"),
  queueCount: document.getElementById("queue-count"),
  queueClearInterrupted: document.getElementById("queue-clear-interrupted"),
  queueToggle: document.getElementById("queue-toggle"),
  btnJobHistory: document.getElementById("btn-job-history"),
  jobHistoryRefresh: document.getElementById("job-history-refresh"),
  jobHistorySummary: document.getElementById("job-history-summary"),
  jobHistoryList: document.getElementById("job-history-list"),
  btnAddFolder: document.getElementById("btn-add-folder"),
  btnStorage: document.getElementById("btn-storage"),
  btnSettings: document.getElementById("btn-settings"),
  btnTopSettings: document.getElementById("btn-top-settings"),
  appDialog: document.getElementById("app-dialog"),
  appDialogTitle: document.getElementById("app-dialog-title"),
  appDialogMessage: document.getElementById("app-dialog-message"),
  appDialogInputWrap: document.getElementById("app-dialog-input-wrap"),
  appDialogInput: document.getElementById("app-dialog-input"),
  appDialogClose: document.getElementById("app-dialog-close"),
  appDialogCancel: document.getElementById("app-dialog-cancel"),
  appDialogConfirm: document.getElementById("app-dialog-confirm"),
  storageTotal: document.getElementById("storage-total"),
  storageList: document.getElementById("storage-list"),
  settingsDialog: document.getElementById("settings-dialog"),
  settingsTitle: document.getElementById("settings-title"),
  settingsClose: document.getElementById("settings-close"),
  settingsCancel: document.getElementById("settings-cancel"),
  settingsSave: document.getElementById("settings-save"),
  settingsSaveStatus: document.getElementById("settings-save-status"),
  settingsAutoUpdate: document.getElementById("settings-auto-update"),
  settingsAutoUpdateDescription: document.getElementById("settings-auto-update-description"),
  settingsDataPath: document.getElementById("settings-data-path"),
  settingsOpenData: document.getElementById("settings-open-data"),
  settingsAnalysisStatus: document.getElementById("settings-analysis-status"),
  settingsAnalysisModes: document.getElementById("settings-analysis-modes"),
  settingsAnalysisCpu: document.getElementById("settings-analysis-cpu"),
  settingsAnalysisNvidia: document.getElementById("settings-analysis-nvidia"),
  settingsCpuSetup: document.getElementById("settings-cpu-setup"),
  settingsNvidiaSetup: document.getElementById("settings-nvidia-setup"),
  settingsFeatureCpu: document.getElementById("settings-feature-cpu"),
  settingsFeatureCpuStatus: document.getElementById("settings-feature-cpu-status"),
  settingsFeatureCpuInstall: document.getElementById("settings-feature-cpu-install"),
  settingsFeatureCpuRemove: document.getElementById("settings-feature-cpu-remove"),
  settingsFeatureScore: document.getElementById("settings-feature-score"),
  settingsFeatureScoreStatus: document.getElementById("settings-feature-score-status"),
  settingsFeatureScoreInstall: document.getElementById("settings-feature-score-install"),
  settingsFeatureScoreRemove: document.getElementById("settings-feature-score-remove"),
  settingsCloudEnabled: document.getElementById("settings-cloud-enabled"),
  settingsCloudFields: document.getElementById("settings-cloud-fields"),
  settingsCloudAccount: document.getElementById("settings-cloud-account"),
  settingsCloudBucket: document.getElementById("settings-cloud-bucket"),
  settingsCloudAccessKey: document.getElementById("settings-cloud-access-key"),
  settingsCloudSecret: document.getElementById("settings-cloud-secret"),
  settingsCloudPublicUrl: document.getElementById("settings-cloud-public-url"),
  settingsCloudPrefix: document.getElementById("settings-cloud-prefix"),
  settingsCloudEndpoint: document.getElementById("settings-cloud-endpoint"),
  settingsCloudState: document.getElementById("settings-cloud-state"),
  settingsCloudExport: document.getElementById("settings-cloud-export"),
  settingsCloudImport: document.getElementById("settings-cloud-import"),
  settingsStorageRefresh: document.getElementById("settings-storage-refresh"),
  settingsVersion: document.getElementById("settings-version"),
  settingsCheckUpdate: document.getElementById("settings-check-update"),
  settingsCheckUpdateLabel: document.getElementById("settings-check-update-label"),
  settingsUpdateStatus: document.getElementById("settings-update-status"),
  sidebarSelectionCount: document.getElementById("sidebar-selection-count"),
  btnDeleteSessionSelection: document.getElementById("btn-delete-session-selection"),
  btnClearSessionSelection: document.getElementById("btn-clear-session-selection"),
  analysisDialog: document.getElementById("analysis-dialog"),
  analysisDialogEyebrow: document.getElementById("analysis-dialog-eyebrow"),
  analysisDialogTitle: document.getElementById("analysis-dialog-title"),
  analysisDialogDescription: document.getElementById("analysis-dialog-description"),
  analysisDialogClose: document.getElementById("analysis-dialog-close"),
  inputCard: document.getElementById("input-card"),
  structureWorkspace: document.getElementById("structure-workspace"),
  playerCard: document.getElementById("player-card"),
  stemPanel: document.getElementById("stem-panel"),
  btnGenerateStems: document.getElementById("btn-generate-stems"),
  btnResetStemMix: document.getElementById("btn-reset-stem-mix"),
  stemExportActions: document.getElementById("stem-export-actions"),
  stemExportScope: document.getElementById("stem-export-scope"),
  stemExportClick: document.getElementById("stem-export-click"),
  btnExportStemMix: document.getElementById("btn-export-stem-mix"),
  stemStatus: document.getElementById("stem-status"),
  stemMixer: document.getElementById("stem-mixer"),
  topbarSong: document.getElementById("topbar-song"),
  topbarActions: document.querySelector(".topbar-actions"),
  offlineBadge: document.getElementById("offline-badge"),
  desktopUpdate: document.getElementById("desktop-update"),
  desktopStatus: document.getElementById("desktop-status"),
  desktopStatusTitle: document.getElementById("desktop-status-title"),
  desktopStatusMessage: document.getElementById("desktop-status-message"),
  desktopStatusAction: document.getElementById("desktop-status-action"),
  analyzeBtn: document.getElementById("analyze-btn"),
  btnAudioFile: document.getElementById("btn-audio-file"),
  audioFileInput: document.getElementById("audio-file-input"),
  audioDropHint: document.getElementById("audio-drop-hint"),
  analysisTimeMode: document.getElementById("analysis-time-mode"),
  analysisTimeRange: document.getElementById("analysis-time-range"),
  analysisStartTime: document.getElementById("analysis-start-time"),
  analysisEndTime: document.getElementById("analysis-end-time"),
  status: document.getElementById("status"),
  jobCard: document.getElementById("job-card"),
  jobStage: document.getElementById("job-stage"),
  jobElapsed: document.getElementById("job-elapsed"),
  jobMessage: document.getElementById("job-message"),
  urlInput: document.getElementById("url-input"),
  waveformWrap: document.querySelector(".waveform-wrap"),
  videoWrap: document.getElementById("video-wrap"),
  videoPlayer: document.getElementById("video-player"),
  btnVideoFullscreen: document.getElementById("btn-video-fullscreen"),
  btnVideoExit: document.getElementById("btn-video-exit"),
  btnFsPlay: document.getElementById("btn-fs-play"),
  btnFsRestart: document.getElementById("btn-fs-restart"),
  btnFsLoop: document.getElementById("btn-fs-loop"),
  btnFsAutoNext: document.getElementById("btn-fs-auto-next"),
  btnFsMetro: document.getElementById("btn-fs-metro"),
  videoNote: document.getElementById("video-note"),
  btnReanalyze: document.getElementById("btn-reanalyze"),
  btnNewUrl: document.getElementById("btn-new-url"),
  btnAutoNext: document.getElementById("btn-auto-next"),
  btnYouTube: document.getElementById("btn-yt"),
  btnScoreExtractor: document.getElementById("btn-score-extractor"),
  btnCloudSync: document.getElementById("btn-cloud-sync"),
  btnLoop: document.getElementById("btn-loop"),
  btnMetro: document.getElementById("btn-metro"),
  btnBpmHalf: document.getElementById("btn-bpm-half"),
  btnBpmDouble: document.getElementById("btn-bpm-double"),
  btnBpmReset: document.getElementById("btn-bpm-reset"),
  btnBpmSave: document.getElementById("btn-bpm-save"),
  btnClickOffset: document.getElementById("btn-click-offset"),
  btnPlay: document.getElementById("btn-play"),
  btnRestart: document.getElementById("btn-restart"),
  sections: document.getElementById("sections"),
  btnEditSections: document.getElementById("btn-edit-sections"),
  sectionEditor: document.getElementById("section-editor"),
  sectionEditorRows: document.getElementById("section-editor-rows"),
  sectionEditorError: document.getElementById("section-editor-error"),
  sectionEditorSelectionNumber: document.getElementById("section-editor-selection-number"),
  sectionEditorLabel: document.getElementById("section-editor-label"),
  sectionEditorStart: document.getElementById("section-editor-start"),
  sectionEditorEnd: document.getElementById("section-editor-end"),
  sectionEditorPreview: document.getElementById("section-editor-preview"),
  sectionEditorPlayerToggle: document.getElementById("section-editor-player-toggle"),
  sectionEditorScrub: document.getElementById("section-editor-scrub"),
  sectionEditorWaveform: document.getElementById("section-editor-waveform"),
  sectionEditorSelectedRange: document.getElementById("section-editor-selected-range"),
  sectionEditorPlayhead: document.getElementById("section-editor-playhead"),
  sectionEditorCurrentTime: document.getElementById("section-editor-current-time"),
  sectionEditorDuration: document.getElementById("section-editor-duration"),
  btnSaveSections: document.getElementById("btn-save-sections"),
  btnRestoreSections: document.getElementById("btn-restore-sections"),
  metaBpm: document.getElementById("meta-bpm"),
  metaBars: document.getElementById("meta-bars"),
  loopInfo: document.getElementById("loop-info"),
  btnClearRange: document.getElementById("btn-clear-range"),
  timeCur: document.getElementById("time-cur"),
  timeTot: document.getElementById("time-tot"),
  waveform: document.getElementById("waveform"),
  waveformLoading: document.getElementById("waveform-loading"),
  volMusic: document.getElementById("vol-music"),
  volMusicVal: document.getElementById("vol-music-val"),
  volMetro: document.getElementById("vol-metro"),
  volMetroVal: document.getElementById("vol-metro-val"),
  playbackRate: document.getElementById("playback-rate"),
  playbackRateVal: document.getElementById("playback-rate-val"),
  btnSpeedReset: document.getElementById("btn-speed-reset"),
  stemControls: {
    vocals: {
      enabled: document.getElementById("stem-vocals-enabled"),
      solo: document.getElementById("stem-vocals-solo"),
      focus: document.getElementById("stem-vocals-focus"),
      volume: document.getElementById("stem-vocals-volume"),
      value: document.getElementById("stem-vocals-value")
    },
    drums: {
      enabled: document.getElementById("stem-drums-enabled"),
      solo: document.getElementById("stem-drums-solo"),
      focus: document.getElementById("stem-drums-focus"),
      volume: document.getElementById("stem-drums-volume"),
      value: document.getElementById("stem-drums-value")
    },
    bass: {
      enabled: document.getElementById("stem-bass-enabled"),
      solo: document.getElementById("stem-bass-solo"),
      focus: document.getElementById("stem-bass-focus"),
      volume: document.getElementById("stem-bass-volume"),
      value: document.getElementById("stem-bass-value")
    },
    other: {
      enabled: document.getElementById("stem-other-enabled"),
      solo: document.getElementById("stem-other-solo"),
      focus: document.getElementById("stem-other-focus"),
      volume: document.getElementById("stem-other-volume"),
      value: document.getElementById("stem-other-value")
    }
  },
  audioNote: document.getElementById("audio-note"),
  tabStructure: document.getElementById("tab-structure"),
  tabScore: document.getElementById("tab-score"),
  structurePanel: document.getElementById("structure-panel"),
  scorePanel: document.getElementById("score-panel"),
  scoreFormKicker: document.getElementById("score-form-kicker"),
  scoreFormTitle: document.getElementById("score-form-title"),
  scoreUrlInput: document.getElementById("score-url-input"),
  scoreTitleInput: document.getElementById("score-title-input"),
  scoreRegionPreset: document.getElementById("score-region-preset"),
  scoreRegionPercent: document.getElementById("score-region-percent"),
  scoreTimeMode: document.getElementById("score-time-mode"),
  scoreTimeRange: document.getElementById("score-time-range"),
  scoreStartTime: document.getElementById("score-start-time"),
  scoreEndTime: document.getElementById("score-end-time"),
  scoreTrimStart: document.getElementById("score-trim-start"),
  scoreTrimEnd: document.getElementById("score-trim-end"),
  scoreLayout: document.getElementById("score-layout"),
  scoreProcessingMode: document.getElementById("score-processing-mode"),
  scoreContent: document.getElementById("score-content"),
  scoreVerticalScrollMode: document.getElementById("score-vertical-scroll-mode"),
  scoreHorizontalScrollMode: document.getElementById("score-horizontal-scroll-mode"),
  scoreMeasuresPerRow: document.getElementById("score-measures-per-row"),
  scoreMeasureNumbers: document.getElementById("score-measure-numbers"),
  scoreChordSymbols: document.getElementById("score-chord-symbols"),
  scoreKeyEstimate: document.getElementById("score-key-estimate"),
  scoreBpm: document.getElementById("score-bpm"),
  scorePreviewBtn: document.getElementById("score-preview-btn"),
  scoreExtractBtn: document.getElementById("score-extract-btn"),
  scoreStatus: document.getElementById("score-status"),
  scorePreview: document.getElementById("score-preview"),
  scorePreviewStage: document.getElementById("score-preview-stage"),
  scorePreviewImg: document.getElementById("score-preview-img"),
  scoreRegionBox: document.getElementById("score-region-box"),
  scorePreviewMeta: document.getElementById("score-preview-meta"),
  scoreResultSection: document.getElementById("score-result-section"),
  scoreResultTitleInput: document.getElementById("score-result-title-input"),
  scoreResultStatus: document.getElementById("score-result-status"),
  scoreEditSettingsBtn: document.getElementById("score-edit-settings-btn"),
  scoreRegenerateBtn: document.getElementById("score-regenerate-btn"),
  scoreResult: document.getElementById("score-result")
};
var appDialog = createAppDialog({
  dialog: SELECTORS.appDialog,
  title: SELECTORS.appDialogTitle,
  message: SELECTORS.appDialogMessage,
  inputWrap: SELECTORS.appDialogInputWrap,
  input: SELECTORS.appDialogInput,
  close: SELECTORS.appDialogClose,
  cancel: SELECTORS.appDialogCancel,
  confirm: SELECTORS.appDialogConfirm
});
var showAlert = (message, options) => appDialog.alert(message, options);
var showConfirm = (message, options) => appDialog.confirm(message, options);
var showPrompt = (message, defaultValue, options) => appDialog.prompt(message, defaultValue, options);
var showReveal = (message, value, options) => appDialog.reveal(message, value, options);
var setScoreFeatureVisible = (visible) => {
  SELECTORS.tabScore.hidden = !visible;
  SELECTORS.scorePanel.hidden = true;
  if (!visible && currentFeature === "score") setActiveTab("structure");
};
var ws = null;
var hasServer = false;
var isPublishedR2Viewer = shouldUseStaticLibrary({
  mode: APP_CONFIG.mode,
  hostname: window.location.hostname
});
var staticLibraryMode = isPublishedR2Viewer;
var cloudStatus = { configured: false, bucket: null, viewerUrl: null };
var desktopSettings = null;
var currentData = null;
var currentId = null;
var analysisForce = false;
var currentSidebarItems = [];
var currentPlaybackGroup = null;
var currentJobId = null;
var currentJobStartedAt = null;
var jobPollTimer = null;
var queuePollTimer = null;
var trackedJobs = /* @__PURE__ */ new Map();
var selectedIdxs = /* @__PURE__ */ new Set();
var loopOn = false;
var metroOn = false;
var autoNextOn = false;
var bpmFactor = 1;
var clickOffsetHalfBeat = false;
var playingIdx = -1;
var audioAvailable = true;
var audioReady = false;
var videoAvailable = true;
var playbackRate = 1;
var audioCtx = null;
var audioPreparation = null;
var alignedAssetUrls = [];
var alignedOutputs = /* @__PURE__ */ new Map();
var playbackRawAssets = null;
var masterSourceNode = null;
var stemSourceNodes = /* @__PURE__ */ new Map();
var customLoopRange = null;
var waveformSelectionEl = null;
var waveformSectionSelectionEls = [];
var waveformBarGridEls = [];
var waveformDrag = null;
var waveformSeekRafId = 0;
var pendingWaveformSeekTime = null;
var currentFeature = "structure";
var sidebarItemsCount = 0;
var sharedFolders = null;
var scorePreviewData = null;
var scoreRegion = null;
var scoreRegionDrag = null;
var currentScoreResult = null;
var editingScoreResult = null;
var lastVideoSyncAt = 0;
var videoClickTimer = 0;
var stemPlayers = {};
var stemReady = false;
var stemPreparationVersion = 0;
var stemHoldingMaster = false;
var currentStemAssets = null;
var mobileStemMixActivated = false;
var stemExportInProgress = false;
var selectedSessionIds = /* @__PURE__ */ new Set();
var lastSelectedSessionId = null;
var sidebarSessionDrag = null;
var suppressSidebarClickUntil = 0;
var logPlaybackDiagnostic = (type, details = {}) => {
  window.practiceLabDesktop?.logPlaybackEvent?.({
    type,
    sessionId: currentId,
    ...details
  });
};
var mediaDiagnosticDetails = (media) => {
  const time = Number(media?.currentTime) || 0;
  let bufferedAhead = 0;
  try {
    for (let index = 0; index < media.buffered.length; index += 1) {
      if (media.buffered.start(index) <= time && media.buffered.end(index) >= time) {
        bufferedAhead = media.buffered.end(index) - time;
        break;
      }
    }
  } catch {
  }
  return {
    audioTime: time,
    duration: Number(media?.duration) || 0,
    playbackRate: Number(media?.playbackRate) || playbackRate,
    readyState: Number(media?.readyState) || 0,
    networkState: Number(media?.networkState) || 0,
    bufferedAhead
  };
};
var isMobileViewport = () => window.matchMedia("(max-width: 680px), (pointer: coarse)").matches;
var currentStemPlaybackPlan = () => planStemPlayback({
  stemNames: STEM_NAMES,
  mix: getStemMix(),
  mobile: isMobileViewport(),
  activated: mobileStemMixActivated
});
var closeMobileSidebar = () => {
  document.body.classList.remove("sidebar-open");
  SELECTORS.sidebarScrim.hidden = true;
};
var openMobileSidebar = () => {
  document.body.classList.add("sidebar-open");
  SELECTORS.sidebarScrim.hidden = false;
};
var desktopCfgCache;
var desktopCfgFlushTimer = null;
var localCfg = () => {
  try {
    const current = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    if (Object.keys(current).length > 0) return current;
    const legacy = JSON.parse(localStorage.getItem(LEGACY_SETTINGS_KEY)) || {};
    if (Object.keys(legacy).length > 0) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(legacy));
      return legacy;
    }
    return {};
  } catch {
    return {};
  }
};
var flushDesktopCfg = () => {
  if (!window.practiceLabDesktop?.savePlayerSettings || !desktopCfgCache) return;
  if (desktopCfgFlushTimer) {
    clearTimeout(desktopCfgFlushTimer);
    desktopCfgFlushTimer = null;
  }
  const result = window.practiceLabDesktop.savePlayerSettings(desktopCfgCache);
  if (result?.ok === false) console.warn("\u518D\u751F\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F", result.message);
};
var scheduleDesktopCfgFlush = () => {
  if (!window.practiceLabDesktop?.savePlayerSettings) return;
  if (desktopCfgFlushTimer) clearTimeout(desktopCfgFlushTimer);
  desktopCfgFlushTimer = setTimeout(flushDesktopCfg, 120);
};
var cfg = () => {
  const browserSettings = localCfg();
  if (!window.practiceLabDesktop?.getPlayerSettings) return browserSettings;
  if (desktopCfgCache === void 0) {
    const saved = window.practiceLabDesktop.getPlayerSettings();
    desktopCfgCache = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    if (Object.keys(desktopCfgCache).length === 0 && Object.keys(browserSettings).length > 0) {
      desktopCfgCache = { ...browserSettings };
      flushDesktopCfg();
    }
  }
  return desktopCfgCache;
};
var saveCfg = (key, value) => {
  const valueMap = cfg();
  valueMap[key] = value;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(valueMap));
  } catch {
  }
  scheduleDesktopCfgFlush();
};
window.addEventListener("beforeunload", flushDesktopCfg);
var bpmCorrectionKey = (id) => `bpmFactor:${id}`;
var clickOffsetKey = (id) => `clickOffsetHalfBeat:${id}`;
var foldersKey = "sidebarFolders";
var folderCollapsedKey = "sidebarFolderCollapsed";
var rootOrderKey = "sidebarRootOrder";
var autoNextKey = "autoNext";
var lastStructureSessionKey = "lastStructureSessionId";
var getStoredBpmFactor = (id) => Number(cfg()[bpmCorrectionKey(id)] ?? 1) || 1;
var getStoredClickOffset = (id) => !!cfg()[clickOffsetKey(id)];
var getDisplayBpm = (item) => {
  const value = Number(item?.bpm || 0) * getStoredBpmFactor(item?.id);
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
};
var localizeEstimatedKey = (value) => String(value || "").replace(/ Natural Minor$/u, "\u30DE\u30A4\u30CA\u30FC").replace(/ Major$/u, "\u30E1\u30B8\u30E3\u30FC").replace(/ Minor$/u, "\u30DE\u30A4\u30CA\u30FC");
var scoreOptionEnabled = (data, key) => data?.[key] ?? data?.showMusicalAnalysis ?? true;
var getStoredFolderCollapsed = () => {
  const value = cfg()[folderCollapsedKey];
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};
var applyStoredFolderCollapsed = (folders) => {
  const collapsedById = getStoredFolderCollapsed();
  return folders.map((folder) => Object.prototype.hasOwnProperty.call(collapsedById, folder.id) ? { ...folder, collapsed: !!collapsedById[folder.id] } : folder);
};
var saveFolderCollapsed = (folderId, collapsed) => {
  saveCfg(folderCollapsedKey, { ...getStoredFolderCollapsed(), [folderId]: !!collapsed });
};
var forgetFolderCollapsed = (folderId) => {
  const collapsedById = { ...getStoredFolderCollapsed() };
  delete collapsedById[folderId];
  saveCfg(folderCollapsedKey, collapsedById);
};
var getFolders = () => {
  if (sharedFolders) return applyStoredFolderCollapsed(sharedFolders);
  const value = cfg()[foldersKey];
  return applyStoredFolderCollapsed(Array.isArray(value) ? value : []);
};
var saveFoldersRemote = (folders) => {
  if (!hasServer || staticLibraryMode) return;
  fetch("/library/folders", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(folders)
  }).catch(() => {
  });
};
var saveFolders = (folders, { remote = true } = {}) => {
  sharedFolders = folders;
  saveCfg(foldersKey, folders);
  if (remote) saveFoldersRemote(folders);
};
var makeFolderId = () => `folder:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`;
var cleanFolders = (folders, items) => {
  const validIds = new Set(items.map((item) => item.id));
  const used = /* @__PURE__ */ new Set();
  return folders.map((folder) => {
    const sessionIds = (folder.sessionIds || []).filter((id) => {
      if (!validIds.has(id) || used.has(id)) return false;
      used.add(id);
      return true;
    });
    return { ...folder, sessionIds };
  });
};
var loadSharedFolders = async () => {
  const localFolders = (() => {
    const value = cfg()[foldersKey];
    return Array.isArray(value) ? value : [];
  })();
  if (!cfg()[folderCollapsedKey] && localFolders.length > 0) {
    saveCfg(folderCollapsedKey, Object.fromEntries(localFolders.map((folder) => [folder.id, !!folder.collapsed])));
  }
  const urls = [];
  if (staticLibraryMode) urls.push(STATIC_FOLDERS_URL);
  if (hasServer) urls.push("/library/folders");
  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data)) {
        if (hasServer && data.length === 0 && localFolders.length > 0) {
          sharedFolders = localFolders;
          saveFoldersRemote(localFolders);
        } else {
          sharedFolders = applyStoredFolderCollapsed(data);
          saveCfg(foldersKey, sharedFolders);
        }
        return;
      }
    } catch {
    }
  }
  sharedFolders = null;
};
var getRootOrder = (items, folderedIds) => {
  const looseIds = items.map((item) => item.id).filter((id) => !folderedIds.has(id));
  const looseSet = new Set(looseIds);
  const saved = Array.isArray(cfg()[rootOrderKey]) ? cfg()[rootOrderKey] : [];
  const ordered = saved.filter((id) => looseSet.has(id));
  for (const id of looseIds) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered;
};
var getSidebarOrderedSessionIds = (items) => {
  const folders = cleanFolders(getFolders(), items);
  const folderedIds = new Set(folders.flatMap((folder) => folder.sessionIds || []));
  return [
    ...folders.flatMap((folder) => folder.sessionIds || []),
    ...getRootOrder(items, folderedIds)
  ];
};
var updateSidebarSelectionUI = () => {
  document.querySelectorAll(".si").forEach((row) => {
    const selected = selectedSessionIds.has(row.dataset.id);
    row.classList.toggle("selected", selected);
    row.setAttribute("aria-selected", String(selected));
  });
  const count = selectedSessionIds.size;
  SELECTORS.sidebarSelectionCount.hidden = count === 0;
  SELECTORS.sidebarSelectionCount.textContent = `${count}\u4EF6\u9078\u629E\u4E2D`;
  SELECTORS.btnDeleteSessionSelection.hidden = count === 0 || !hasServer;
  SELECTORS.btnClearSessionSelection.hidden = count === 0;
};
var toggleSessionSelection = (sessionId, items, { range = false } = {}) => {
  if (range && lastSelectedSessionId) {
    const order = getSidebarOrderedSessionIds(items);
    const anchorIndex = order.indexOf(lastSelectedSessionId);
    const targetIndex = order.indexOf(sessionId);
    if (anchorIndex >= 0 && targetIndex >= 0) {
      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);
      for (const id of order.slice(start, end + 1)) selectedSessionIds.add(id);
    }
  } else if (selectedSessionIds.has(sessionId)) {
    selectedSessionIds.delete(sessionId);
  } else {
    selectedSessionIds.add(sessionId);
  }
  lastSelectedSessionId = sessionId;
  updateSidebarSelectionUI();
};
var clearSidebarDropMarkers = () => {
  document.querySelectorAll(".si.drop-before, .si.drop-after, .si.dragging").forEach((row) => {
    row.classList.remove("drop-before", "drop-after", "dragging");
  });
  document.querySelectorAll(".sf.drop, .sf.drop-before, .sf.drop-after, .sf.dragging").forEach((group) => {
    group.classList.remove("drop", "drop-before", "drop-after", "dragging");
  });
};
var hasDragType = (event, type) => Array.from(event.dataTransfer?.types || []).includes(type);
var reorderSessions = (sessionIds, targetId, containerId, items, { after = false } = {}) => {
  const movingSet = new Set(sessionIds || []);
  const moving = getSidebarOrderedSessionIds(items).filter((id) => movingSet.has(id));
  if (!moving.length || movingSet.has(targetId)) return;
  const originalFolders = cleanFolders(getFolders(), items);
  const originalFolderedIds = new Set(originalFolders.flatMap((folder) => folder.sessionIds || []));
  const originalRootOrder = getRootOrder(items, originalFolderedIds);
  const folders = originalFolders.map((folder) => ({
    ...folder,
    sessionIds: (folder.sessionIds || []).filter((id) => !movingSet.has(id))
  }));
  if (containerId === "root") {
    const order = originalRootOrder.filter((id) => !movingSet.has(id));
    const targetIndex = targetId ? order.indexOf(targetId) : -1;
    const insertAt = targetIndex >= 0 ? targetIndex + (after ? 1 : 0) : order.length;
    order.splice(insertAt, 0, ...moving);
    saveCfg(rootOrderKey, order);
  } else {
    const target = folders.find((folder) => folder.id === containerId);
    if (!target) return;
    const ids = target.sessionIds || [];
    const targetIndex = targetId ? ids.indexOf(targetId) : -1;
    const insertAt = targetIndex >= 0 ? targetIndex + (after ? 1 : 0) : ids.length;
    ids.splice(insertAt, 0, ...moving);
    target.sessionIds = ids;
    saveCfg(rootOrderKey, originalRootOrder.filter((id) => !movingSet.has(id)));
  }
  saveFolders(folders);
  renderSidebar(items);
};
var getDraggedSessionIds = (event) => {
  try {
    const value = JSON.parse(event.dataTransfer.getData("application/x-practice-lab-sessions") || "[]");
    if (Array.isArray(value) && value.length) return value;
  } catch {
  }
  const sessionId = event.dataTransfer.getData("application/x-practice-lab-session") || event.dataTransfer.getData("text/plain");
  return sessionId ? [sessionId] : [];
};
var updatePointerSessionDropTarget = (clientX, clientY) => {
  if (!sidebarSessionDrag?.active) return;
  document.querySelectorAll(".si.drop-before, .si.drop-after").forEach((row2) => {
    row2.classList.remove("drop-before", "drop-after");
  });
  document.querySelectorAll(".sf.drop").forEach((group2) => group2.classList.remove("drop"));
  const element = document.elementFromPoint(clientX, clientY);
  const row = element?.closest?.(".si");
  if (row && !sidebarSessionDrag.sessionIds.includes(row.dataset.id)) {
    const rect = row.getBoundingClientRect();
    const after = clientY > rect.top + rect.height / 2;
    row.classList.toggle("drop-before", !after);
    row.classList.toggle("drop-after", after);
    sidebarSessionDrag.target = {
      targetId: row.dataset.id,
      containerId: row.dataset.containerId || "root",
      after
    };
    return;
  }
  const group = element?.closest?.(".sf");
  if (group) {
    group.classList.add("drop");
    sidebarSessionDrag.target = {
      targetId: null,
      containerId: group.classList.contains("sf-root") ? "root" : group.dataset.folderId,
      after: false
    };
    return;
  }
  sidebarSessionDrag.target = null;
};
var finishSidebarSessionDrag = (pointerId) => {
  const drag = sidebarSessionDrag;
  if (!drag || drag.pointerId !== pointerId) return;
  if (drag.active && drag.target) {
    reorderSessions(drag.sessionIds, drag.target.targetId, drag.target.containerId, drag.items, {
      after: drag.target.after
    });
  }
  if (drag.active) suppressSidebarClickUntil = performance.now() + 300;
  sidebarSessionDrag = null;
  clearSidebarDropMarkers();
};
var finishPointerSessionDrag = (event) => {
  if (sidebarSessionDrag?.active) updatePointerSessionDropTarget(event.clientX, event.clientY);
  finishSidebarSessionDrag(event.pointerId);
};
document.addEventListener("pointerup", finishPointerSessionDrag);
document.addEventListener("pointercancel", finishPointerSessionDrag);
document.addEventListener("mouseup", (event) => {
  if (sidebarSessionDrag?.active) {
    updatePointerSessionDropTarget(event.clientX, event.clientY);
    finishSidebarSessionDrag(sidebarSessionDrag.pointerId);
  }
});
var reorderFolder = (folderId, targetId, items, { after = false } = {}) => {
  if (!folderId || folderId === targetId) return;
  const folders = cleanFolders(getFolders(), items);
  const moving = folders.find((folder) => folder.id === folderId);
  if (!moving) return;
  const next = folders.filter((folder) => folder.id !== folderId);
  const targetIndex = targetId ? next.findIndex((folder) => folder.id === targetId) : -1;
  const insertAt = targetIndex >= 0 ? targetIndex + (after ? 1 : 0) : next.length;
  next.splice(insertAt, 0, moving);
  saveFolders(next);
  renderSidebar(items);
};
var buildPlaybackGroups = (items) => {
  const folders = cleanFolders(getFolders(), items);
  const itemById = new Map(items.map((item) => [item.id, item]));
  const folderedIds = new Set(folders.flatMap((folder) => folder.sessionIds || []));
  const groups = [];
  for (const folder of folders) {
    const orderedItems = (folder.sessionIds || []).map((id) => itemById.get(id)).filter(Boolean);
    if (orderedItems.length) groups.push({ id: folder.id, name: folder.name, items: orderedItems });
  }
  const rootItems = getRootOrder(items, folderedIds).map((id) => itemById.get(id)).filter(Boolean);
  if (rootItems.length) groups.push({ id: "root", name: "\u672A\u5206\u985E", items: rootItems });
  return groups;
};
var findPlaybackGroupForSession = (sessionId, items = currentSidebarItems) => buildPlaybackGroups(items).find((group) => group.items.some((item) => item.id === sessionId)) || null;
var playNextInGroup = async () => {
  if (!autoNextOn || loopOn || !currentId) return false;
  const group = findPlaybackGroupForSession(currentId, currentSidebarItems);
  if (!group) return false;
  const index = group.items.findIndex((item) => item.id === currentId);
  const next = index >= 0 ? group.items[index + 1] : null;
  if (!next) return false;
  await loadResult(next, { autoplay: true });
  return true;
};
var escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[char]);
var safeAssetUrl = (value) => {
  try {
    const url = new URL(String(value || ""), window.location.href);
    if (url.origin === window.location.origin || url.protocol === "https:") return url.href;
  } catch {
  }
  return "";
};
var hideContextMenu = () => {
  if (!SELECTORS.contextMenu) return;
  SELECTORS.contextMenu.hidden = true;
  SELECTORS.contextMenu.innerHTML = "";
};
var showContextMenu = (event, actions) => {
  if (!SELECTORS.contextMenu || actions.length === 0) return;
  event.preventDefault();
  event.stopPropagation();
  SELECTORS.contextMenu.innerHTML = "";
  for (const action of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.className = action.danger ? "danger" : "";
    button.onclick = () => {
      hideContextMenu();
      action.run();
    };
    SELECTORS.contextMenu.appendChild(button);
  }
  SELECTORS.contextMenu.hidden = false;
  const menuRect = SELECTORS.contextMenu.getBoundingClientRect();
  const left = Math.min(event.clientX, window.innerWidth - menuRect.width - 8);
  const top = Math.min(event.clientY, window.innerHeight - menuRect.height - 8);
  SELECTORS.contextMenu.style.left = `${Math.max(8, left)}px`;
  SELECTORS.contextMenu.style.top = `${Math.max(8, top)}px`;
};
var mergeLibraryMetadata = (sessionId, updated) => {
  const metadata = {
    tags: Array.isArray(updated.tags) ? updated.tags : [],
    lastOpenedAt: updated.lastOpenedAt || null
  };
  currentSidebarItems = currentSidebarItems.map((item) => item.id === sessionId ? { ...item, ...metadata } : item);
  if (currentData?.id === sessionId) currentData = { ...currentData, ...metadata };
  renderSidebar(currentSidebarItems);
};
var saveLibraryMetadata = async (sessionId, payload) => {
  const response = await fetch(`/results/${encodeURIComponent(sessionId)}/library`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const updated = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(updated.detail || "\u30E9\u30A4\u30D6\u30E9\u30EA\u60C5\u5831\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
  mergeLibraryMetadata(sessionId, updated);
  return updated;
};
var editSessionTags = async (item) => {
  const value = await showPrompt("\u30BF\u30B0\u3092\u30AB\u30F3\u30DE\u533A\u5207\u308A\u3067\u5165\u529B", (item.tags || []).join(", "), { title: "\u30BF\u30B0\u3092\u7DE8\u96C6" });
  if (value === null) return;
  const tags = value.split(/[,、]/).map((tag) => tag.trim()).filter(Boolean);
  try {
    await saveLibraryMetadata(item.id, { tags });
  } catch (error) {
    await showAlert(error.message, { title: "\u30BF\u30B0\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  }
};
var markSessionOpened = (id) => {
  const openedAt = (/* @__PURE__ */ new Date()).toISOString();
  const timestamps = { ...cfg().lastOpenedAt || {}, [id]: openedAt };
  const ids = new Set(currentSidebarItems.map((item) => item.id));
  saveCfg("lastOpenedAt", Object.fromEntries(Object.entries(timestamps).filter(([key]) => ids.has(key))));
  currentSidebarItems = currentSidebarItems.map((item) => item.id === id ? { ...item, lastOpenedAt: openedAt } : item);
  renderSidebar(currentSidebarItems);
  if (hasServer && !staticLibraryMode) void saveLibraryMetadata(id, { opened: true }).catch(() => {
  });
};
var createSessionRow = (item, items, containerId = "root") => {
  const row = document.createElement("div");
  row.className = "si";
  row.dataset.id = item.id;
  row.dataset.date = item.date || "";
  row.dataset.containerId = containerId;
  row.draggable = false;
  const tags = Array.isArray(item.tags) ? item.tags : [];
  row.innerHTML = `<div class="si-body"><div class="si-title">${escapeHtml(item.title)}</div><div class="si-meta">\u2669${escapeHtml(getDisplayBpm(item))} \xB7 ${escapeHtml(item.date)}${tags.length ? ` \xB7 <span class="si-tags">${escapeHtml(tags.join(" / "))}</span>` : ""}</div></div>`;
  row.addEventListener("pointerdown", (event) => {
    if (!hasServer || event.button !== 0 || event.pointerType === "touch" || event.ctrlKey || event.metaKey || event.shiftKey) return;
    sidebarSessionDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      target: null,
      items,
      itemId: item.id,
      sessionIds: []
    };
    row.setPointerCapture?.(event.pointerId);
  });
  row.addEventListener("pointermove", (event) => {
    const drag = sidebarSessionDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >= 6) {
      if (!selectedSessionIds.has(drag.itemId)) {
        selectedSessionIds = /* @__PURE__ */ new Set([drag.itemId]);
        lastSelectedSessionId = drag.itemId;
        updateSidebarSelectionUI();
      }
      drag.sessionIds = getSidebarOrderedSessionIds(items).filter((id) => selectedSessionIds.has(id));
      drag.active = true;
      document.querySelectorAll(".si").forEach((element) => {
        if (selectedSessionIds.has(element.dataset.id)) element.classList.add("dragging");
      });
    }
    if (!drag.active) return;
    event.preventDefault();
    updatePointerSessionDropTarget(event.clientX, event.clientY);
  });
  row.addEventListener("pointerup", finishPointerSessionDrag);
  row.addEventListener("pointercancel", finishPointerSessionDrag);
  row.onclick = (event) => {
    if (performance.now() < suppressSidebarClickUntil) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (!selectedSessionIds.size && currentId && currentId !== item.id && items.some((entry) => entry.id === currentId)) {
        selectedSessionIds.add(currentId);
        lastSelectedSessionId = currentId;
      }
      toggleSessionSelection(item.id, items, { range: event.shiftKey });
      return;
    }
    if (selectedSessionIds.size) {
      selectedSessionIds.clear();
      lastSelectedSessionId = null;
      updateSidebarSelectionUI();
    }
    loadResult(item, { autoplay: true });
    closeMobileSidebar();
  };
  if (hasServer) {
    row.addEventListener("contextmenu", (event) => {
      showContextMenu(event, [
        { label: "\u540D\u524D\u3092\u5909\u66F4", run: () => renameSession(item, items) },
        { label: "\u30BF\u30B0\u3092\u7DE8\u96C6", run: () => editSessionTags(item) },
        { label: "\u524A\u9664", danger: true, run: () => deleteResult(item.id, items) }
      ]);
    });
  }
  return row;
};
var fmt = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
var staticAssetUrl = (sessionId, filename) => LIBRARY_BASE_URL ? `${LIBRARY_BASE_URL}/${sessionId}/${filename}` : "";
var versionedVideoUrl = (url) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${VIDEO_ASSET_VERSION}`;
};
var sessionAssets = (session) => {
  const hasExplicitVideo = !!session?.assets && Object.prototype.hasOwnProperty.call(session.assets, "video");
  if (!staticLibraryMode) {
    const localStems = session?.assets?.stems ? Object.fromEntries(STEM_NAMES.map((stem) => [stem, `stems/${session.id}/${stem}.mp3`])) : null;
    return {
      result: `results/${session.id}.json`,
      audio: `audio/${session.id}.mp3`,
      video: hasExplicitVideo && !session.assets.video ? "" : versionedVideoUrl(`video/${session.id}.mp4`),
      stems: localStems
    };
  }
  const staticVideo = hasExplicitVideo ? session.assets.video : staticAssetUrl(session.id, "video.mp4");
  return {
    result: session?.assets?.result || staticAssetUrl(session.id, "session.json"),
    audio: session?.assets?.audio || staticAssetUrl(session.id, "audio.mp3"),
    video: staticVideo ? versionedVideoUrl(staticVideo) : "",
    stems: session?.assets?.stems || null
  };
};
var closeAnalysisDialog = () => {
  if (SELECTORS.analysisDialog?.open) SELECTORS.analysisDialog.close();
};
var setAnalysisRangeInputs = ({ startSec = null, endSec = null } = {}) => {
  const hasRange = startSec !== null || endSec !== null;
  SELECTORS.analysisTimeMode.value = hasRange ? "range" : "full";
  SELECTORS.analysisTimeRange.hidden = !hasRange;
  SELECTORS.analysisStartTime.value = hasRange && startSec !== null ? fmt(startSec) : "";
  SELECTORS.analysisEndTime.value = hasRange && endSec !== null ? fmt(endSec) : "";
};
var openAnalysisDialog = ({ reanalyze = false, openAudioPicker = false } = {}) => {
  if (!hasServer || !SELECTORS.analysisDialog) return;
  analysisForce = reanalyze;
  SELECTORS.inputCard.hidden = false;
  SELECTORS.status.className = "status";
  SELECTORS.status.textContent = "";
  SELECTORS.jobCard.hidden = true;
  SELECTORS.analysisDialogEyebrow.textContent = reanalyze ? "\u518D\u89E3\u6790" : "\u65B0\u3057\u3044\u89E3\u6790";
  SELECTORS.analysisDialogTitle.textContent = reanalyze ? "\u3053\u306E\u66F2\u3092\u518D\u89E3\u6790" : "\u7DF4\u7FD2\u3057\u305F\u3044\u66F2\u3092\u8FFD\u52A0";
  SELECTORS.analysisDialogDescription.textContent = reanalyze ? "\u89E3\u6790\u7BC4\u56F2\u3092\u78BA\u8A8D\u3057\u3066\u3001\u73FE\u5728\u306E\u66F2\u3092\u3082\u3046\u4E00\u5EA6\u89E3\u6790\u3057\u307E\u3059\u3002" : "YouTube\u306EURL\u3001\u307E\u305F\u306F\u624B\u5143\u306E\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u304B\u3089\u89E3\u6790\u3092\u59CB\u3081\u307E\u3059\u3002";
  SELECTORS.analyzeBtn.textContent = reanalyze ? "\u518D\u89E3\u6790\u3092\u958B\u59CB" : "\u89E3\u6790\u3092\u958B\u59CB";
  if (reanalyze) {
    const sourceVideoId = currentData?.sourceVideoId || currentId;
    SELECTORS.urlInput.value = sourceVideoId ? `https://www.youtube.com/watch?v=${sourceVideoId}` : "";
    setAnalysisRangeInputs({
      startSec: currentData?.analysisStartSec ?? null,
      endSec: currentData?.analysisEndSec ?? null
    });
  } else {
    SELECTORS.urlInput.value = "";
    setAnalysisRangeInputs();
  }
  if (!SELECTORS.analysisDialog.open) SELECTORS.analysisDialog.showModal();
  if (openAudioPicker) SELECTORS.audioFileInput.click();
  else SELECTORS.urlInput.focus({ preventScroll: true });
};
var MIN_PLAYBACK_RATE = 0.25;
var MAX_PLAYBACK_RATE = 1.25;
var PLAYBACK_RATE_STEP = 0.05;
var DEFAULT_PLAYBACK_RATE = 1;
var clampPlaybackRate = (value) => Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, Number(value) || DEFAULT_PLAYBACK_RATE));
var formatPlaybackRate = (value) => `${clampPlaybackRate(value).toFixed(2)}x`;
var getStemMix = () => ({ ...DEFAULT_STEM_MIX, ...cfg().stemMix || {} });
var saveStemMix = (mix) => saveCfg("stemMix", mix);
var getStemLastVolumes = () => ({ ...DEFAULT_STEM_MIX, ...cfg().stemLastVolume || {} });
var saveStemLastVolumes = (volumes) => saveCfg("stemLastVolume", volumes);
var getStemMixMode = () => {
  const mode = cfg().stemMixMode;
  return STEM_NAMES.includes(mode?.stem) && ["solo", "focus"].includes(mode?.type) ? mode : null;
};
var clearStemMixMode = () => {
  saveCfg("stemMixMode", null);
  saveCfg("stemMixRestore", null);
};
var setStemMixMode = (stem, type) => {
  const currentMode = getStemMixMode();
  if (currentMode?.stem === stem && currentMode.type === type) {
    saveStemMix({ ...DEFAULT_STEM_MIX, ...cfg().stemMixRestore || {} });
    clearStemMixMode();
    activateMobileStemMix();
    applyStemMix();
    return;
  }
  if (!currentMode) saveCfg("stemMixRestore", getStemMix());
  saveCfg("stemMixMode", { stem, type });
  saveStemMix(Object.fromEntries(STEM_NAMES.map((name) => [name, name === stem ? 100 : type === "focus" ? 20 : 0])));
  activateMobileStemMix();
  applyStemMix();
};
var hasStemAssets = (assets) => !!assets?.stems && STEM_NAMES.every((stem) => typeof assets.stems[stem] === "string" && assets.stems[stem]);
var stemTransport = createStemTransport({
  getTime: () => ws?.getCurrentTime() ?? 0,
  getRate: () => playbackRate,
  isPlaying: () => stemHoldingMaster || !!ws?.isPlaying(),
  holdMaster: () => {
    const master = ws;
    const resume = !!master?.isPlaying();
    stemHoldingMaster = true;
    stopMetro();
    pauseVideo();
    master?.pause();
    return (shouldResume) => {
      stemHoldingMaster = false;
      if (shouldResume && resume && ws === master) void master.play();
    };
  },
  onChange: () => {
    updateOriginalVolume();
    updateStemPlaybackStatus();
    if (ws) updateAlignedClickOutput();
  },
  onSync: (audioTime, drift, stemCount) => logPlaybackDiagnostic("stem-resync", {
    audioTime,
    drift,
    stemCount,
    playbackRate,
    forced: 1
  })
});
var updateOriginalVolume = () => {
  const volume = Math.min(1, Math.max(0, Number(isMobileViewport() ? 100 : SELECTORS.volMusic.value) / 100));
  ws?.setVolume(!stemReady || stemTransport.snapshot().useOriginalMix ? volume : 0);
};
var destroyStemPlayers = () => {
  stemPreparationVersion += 1;
  stemTransport.destroy();
  for (const player of Object.values(stemPlayers)) {
    alignedOutputs.get(player)?.destroy();
    alignedOutputs.delete(player);
  }
  for (const source of stemSourceNodes.values()) source.disconnect();
  stemSourceNodes.clear();
  for (const player of Object.values(stemPlayers)) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }
  stemPlayers = {};
  stemReady = false;
};
var updateStemPlaybackStatus = () => {
  if (!SELECTORS.stemStatus || !currentStemAssets) return;
  const { state, failures } = stemTransport.snapshot();
  const labels = { vocals: "\u30DC\u30FC\u30AB\u30EB", drums: "\u30C9\u30E9\u30E0", bass: "\u30D9\u30FC\u30B9", other: "\u305D\u306E\u4ED6" };
  SELECTORS.stemStatus.className = failures.length ? "stem-status err" : "stem-status ok";
  SELECTORS.stemStatus.textContent = state === "silent" ? "\u5168\u30D1\u30FC\u30C8\u3092\u30DF\u30E5\u30FC\u30C8\u4E2D" : failures.length ? `${failures.map((name) => labels[name]).join("\u30FB")}\u3092\u518D\u751F\u3067\u304D\u307E\u305B\u3093 \xB7 \u5143\u97F3\u6E90\u3092\u518D\u751F` : state === "starting" ? "\u30D1\u30FC\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D \xB7 \u5143\u97F3\u6E90\u3092\u518D\u751F" : state === "waiting" ? "\u8AAD\u307F\u8FBC\u307F\u5F85\u3061 \xB7 \u5FA9\u5E30\u6642\u306B\u30D1\u30FC\u30C8\u3092\u540C\u671F" : state === "original" ? "\u5143\u97F3\u6E90\u3092\u4F7F\u7528" : "\u30D1\u30FC\u30C8\u518D\u751F \xB7 \u81EA\u52D5\u540C\u671F";
  if (isMobileViewport() && !mobileStemMixActivated) SELECTORS.stemStatus.textContent = "\u8EFD\u91CF\u518D\u751F \xB7 \u5143\u97F3\u6E90\u3092\u4F7F\u7528\uFF08\u30D1\u30FC\u30C8\u64CD\u4F5C\u3067\u5207\u66FF\uFF09";
  document.getElementById("stem-recovery-actions").hidden = !failures.length && state !== "waiting" && !(state === "original" && stemReady);
};
var activateMobileStemMix = () => {
  if (!isMobileViewport() || mobileStemMixActivated || !currentStemAssets) return;
  mobileStemMixActivated = true;
  if (!stemReady) initStemPlayers(currentStemAssets);
  applyMusicVolume(SELECTORS.volMusic.value);
  updateStemPlaybackStatus();
  if (ws?.isPlaying()) void playStems();
};
var deactivateMobileStemMix = () => {
  if (!isMobileViewport()) return;
  mobileStemMixActivated = false;
  destroyStemPlayers();
  applyMusicVolume(SELECTORS.volMusic.value);
  updateStemPlaybackStatus();
};
var applyStemMix = () => {
  const mix = getStemMix();
  const mode = getStemMixMode();
  const playbackPlan = currentStemPlaybackPlan();
  const effectiveMusicValue = isMobileViewport() ? 100 : SELECTORS.volMusic.value;
  const masterVolume = Math.min(1, Math.max(0, (Number(effectiveMusicValue) || 0) / 100));
  for (const stem of STEM_NAMES) {
    const value = Math.min(100, Math.max(0, Number(mix[stem] ?? DEFAULT_STEM_MIX[stem])));
    const controls = SELECTORS.stemControls[stem];
    if (controls) {
      controls.volume.value = String(value);
      controls.enabled.classList.toggle("active", value === 0);
      controls.enabled.setAttribute("aria-pressed", String(value === 0));
      const stemLabel = { vocals: "\u30DC\u30FC\u30AB\u30EB", drums: "\u30C9\u30E9\u30E0", bass: "\u30D9\u30FC\u30B9", other: "\u305D\u306E\u4ED6" }[stem] || stem;
      controls.enabled.title = value === 0 ? `${stemLabel}\u306E\u30DF\u30E5\u30FC\u30C8\u3092\u89E3\u9664` : `${stemLabel}\u3092\u30DF\u30E5\u30FC\u30C8`;
      controls.enabled.setAttribute("aria-label", controls.enabled.title);
      const soloActive = mode?.type === "solo" && mode.stem === stem;
      const focusActive = mode?.type === "focus" && mode.stem === stem;
      controls.solo.classList.toggle("active", soloActive);
      controls.solo.setAttribute("aria-pressed", String(soloActive));
      controls.focus.classList.toggle("active", focusActive);
      controls.focus.setAttribute("aria-pressed", String(focusActive));
      controls.value.textContent = `${value}%`;
    }
  }
  if (stemReady) stemTransport.setMix(playbackPlan, mix, masterVolume);
  updateOriginalVolume();
  updateAlignedClickOutput();
};
var updateStemExportScopeAvailability = () => {
  if (!SELECTORS.stemExportScope) return;
  const selectionOption = SELECTORS.stemExportScope.querySelector('option[value="selection"]');
  const hasSelection = !!getLoopRange();
  if (selectionOption) selectionOption.disabled = !hasSelection;
  if (!hasSelection && SELECTORS.stemExportScope.value === "selection") {
    SELECTORS.stemExportScope.value = "full";
  }
};
var safeDownloadName = (value) => String(value || "practice").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "practice";
var stemMixFilename = (title, stemVolumes, { selection = false, click = false } = {}) => {
  const base = safeDownloadName(title);
  const enabled = STEM_NAMES.filter((stem) => Number(stemVolumes[stem]) > 0);
  const disabled = STEM_NAMES.filter((stem) => !enabled.includes(stem));
  let stemSuffix = "";
  if (enabled.length === 1) stemSuffix = `_only_${enabled[0]}`;
  else if (enabled.length === 2) stemSuffix = `_${enabled.join("_")}`;
  else if (disabled.length === 1) stemSuffix = `_no_${disabled[0]}`;
  const rangeSuffix = selection ? "_selection" : "";
  const clickSuffix = click ? "_click" : "";
  return `${base}${stemSuffix}${rangeSuffix}${clickSuffix}.mp3`;
};
var exportStemMix = async () => {
  if (!currentId || !hasServer || stemExportInProgress) return;
  const stemVolumes = getStemMix();
  if (!STEM_NAMES.some((stem) => Number(stemVolumes[stem]) > 0)) {
    SELECTORS.stemStatus.className = "stem-status err";
    SELECTORS.stemStatus.textContent = "\u5C11\u306A\u304F\u3068\u30821\u3064\u306E\u30D1\u30FC\u30C8\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044";
    return;
  }
  const range = SELECTORS.stemExportScope.value === "selection" ? getLoopRange() : null;
  if (SELECTORS.stemExportScope.value === "selection" && !range) {
    SELECTORS.stemStatus.className = "stem-status err";
    SELECTORS.stemStatus.textContent = "\u5148\u306B\u7BC4\u56F2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
    return;
  }
  const includeClick = SELECTORS.stemExportClick.checked;
  const rangeStart = range?.start ?? 0;
  const rangeEnd = range?.end ?? Infinity;
  const clickTimes = includeClick ? getAdjustedBeats().filter((time) => time >= rangeStart && time <= rangeEnd).map((time) => time - rangeStart) : [];
  const downloadName = stemMixFilename(currentData?.title || currentId, stemVolumes, {
    selection: !!range,
    click: includeClick
  });
  stemExportInProgress = true;
  SELECTORS.btnExportStemMix.disabled = true;
  SELECTORS.stemStatus.className = "stem-status";
  SELECTORS.stemStatus.innerHTML = `<span class="spin"></span>\u66F8\u304D\u51FA\u3057\u3092\u51E6\u7406\u4E00\u89A7\u3078\u8FFD\u52A0\u4E2D`;
  try {
    const response = await fetch(`/results/${encodeURIComponent(currentId)}/stems/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stemVolumes,
        startSec: range?.start ?? null,
        endSec: range?.end ?? null,
        clickTimes,
        clickVolume: includeClick ? Number(SELECTORS.volMetro.value) : 0,
        outputFilename: downloadName
      })
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557\u3057\u307E\u3057\u305F (${response.status})`);
    trackQueuedJob(submitted.jobId, {
      label: `\u30D1\u30FC\u30C8\u66F8\u304D\u51FA\u3057 \xB7 ${currentData?.title || currentId}`,
      kind: "stem-export",
      retainDone: true,
      onError: (error) => {
        SELECTORS.stemStatus.className = "stem-status err";
        SELECTORS.stemStatus.textContent = error.message;
      }
    });
    SELECTORS.stemStatus.className = "stem-status ok";
    SELECTORS.stemStatus.textContent = "\u66F8\u304D\u51FA\u3057\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002\u5B8C\u4E86\u5F8C\u306B\u51E6\u7406\u4E00\u89A7\u304B\u3089\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3067\u304D\u307E\u3059";
  } catch (error) {
    SELECTORS.stemStatus.className = "stem-status err";
    SELECTORS.stemStatus.textContent = error.message;
  } finally {
    stemExportInProgress = false;
    SELECTORS.btnExportStemMix.disabled = false;
  }
};
var syncStemPlayers = (time = ws?.getCurrentTime() ?? 0, options = {}) => stemTransport.sync(time, options);
var playStems = () => stemReady ? stemTransport.play() : Promise.resolve(false);
var pauseStems = () => stemTransport.pause();
var applyMusicVolume = (value) => {
  SELECTORS.videoPlayer.volume = Math.min(1, Math.max(0, Number(isMobileViewport() ? 100 : value) / 100));
  applyStemMix();
  updateOriginalVolume();
};
var preserveMediaPitch = (media) => {
  if (!media) return;
  media.preservesPitch = true;
  media.mozPreservesPitch = true;
  media.webkitPreservesPitch = true;
};
var applyPlaybackRate = (value) => {
  playbackRate = clampPlaybackRate(value);
  SELECTORS.playbackRate.value = playbackRate.toFixed(2);
  SELECTORS.playbackRateVal.textContent = formatPlaybackRate(playbackRate);
  saveCfg("playbackRate", playbackRate);
  ws?.setPlaybackRate?.(playbackRate, true);
  preserveMediaPitch(ws?.getMediaElement?.());
  preserveMediaPitch(SELECTORS.videoPlayer);
  SELECTORS.videoPlayer.playbackRate = playbackRate;
  syncStemPlayers(ws?.getCurrentTime?.() ?? 0);
  updateAlignedClickOutput();
};
var nudgePlaybackRate = (delta) => {
  const next = Math.round((playbackRate + delta) / PLAYBACK_RATE_STEP) * PLAYBACK_RATE_STEP;
  applyPlaybackRate(next);
};
var applyCurrentPlaybackRate = () => {
  ws?.setPlaybackRate?.(playbackRate, true);
  preserveMediaPitch(ws?.getMediaElement?.());
  preserveMediaPitch(SELECTORS.videoPlayer);
  SELECTORS.videoPlayer.playbackRate = playbackRate;
  syncStemPlayers(ws?.getCurrentTime?.() ?? 0);
};
var syncVideoToAudio = (time, { force = false } = {}) => {
  if (!videoAvailable || !SELECTORS.videoPlayer.src) return;
  const video = SELECTORS.videoPlayer;
  if (video.readyState < 1) return;
  const now = performance.now();
  const minInterval = isMobileViewport() ? 320 : 450;
  if (!force && now - lastVideoSyncAt < minInterval) return;
  lastVideoSyncAt = now;
  const action = mediaSyncAction({
    masterTime: time,
    mediaTime: video.currentTime,
    playbackRate,
    force,
    hardDriftSeconds: isMobileViewport() ? 0.2 : 0.28,
    softDriftSeconds: isMobileViewport() ? 0.04 : 0.06,
    maxRateCorrection: isMobileViewport() ? 0.04 : 0.025
  });
  if (action.seekTo !== null && !force) {
    logPlaybackDiagnostic("video-resync", {
      audioTime: time,
      drift: action.drift,
      playbackRate
    });
  }
  if (action.seekTo !== null) {
    try {
      video.currentTime = action.seekTo;
    } catch {
    }
  }
  if (Math.abs(video.playbackRate - action.playbackRate) > 1e-3) video.playbackRate = action.playbackRate;
};
var playVideo = () => {
  if (!videoAvailable || !SELECTORS.videoPlayer.src) return;
  SELECTORS.videoPlayer.play().catch(() => {
  });
};
var pauseVideo = () => {
  if (!SELECTORS.videoPlayer.src) return;
  SELECTORS.videoPlayer.pause();
};
var setVideoFullscreen = (enabled) => {
  if (enabled && (!videoAvailable || !SELECTORS.videoPlayer.src)) return;
  document.body.classList.toggle("video-fullscreen-mode", enabled);
};
var toggleVideoFullscreen = () => {
  setVideoFullscreen(!document.body.classList.contains("video-fullscreen-mode"));
};
var setActiveTab = (tab) => {
  if (staticLibraryMode && tab === "score") tab = "structure";
  const scoreActive = tab === "score";
  currentFeature = scoreActive ? "score" : "structure";
  if (scoreActive && ws?.isPlaying()) ws.pause();
  SELECTORS.tabStructure.classList.toggle("active", !scoreActive);
  SELECTORS.tabScore.classList.toggle("active", scoreActive);
  SELECTORS.structurePanel.hidden = scoreActive;
  SELECTORS.scorePanel.hidden = !scoreActive;
  SELECTORS.sessionPanel.hidden = scoreActive || sidebarItemsCount === 0 && !staticLibraryMode;
  SELECTORS.scoreHistoryPanel.hidden = !scoreActive;
  SELECTORS.topbarSong.hidden = scoreActive || !currentId;
  SELECTORS.topbarActions.hidden = scoreActive || !currentId;
  SELECTORS.btnNewUrl.hidden = scoreActive || !hasServer;
};
var getScoreHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(SCORE_HISTORY_KEY) || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};
var renderScoreHistory = () => {
  if (!SELECTORS.scoreHistoryList) return;
  const history = getScoreHistory();
  if (!history.length) {
    SELECTORS.scoreHistoryList.innerHTML = `<div class="score-history-empty">\u62BD\u51FA\u304C\u5B8C\u4E86\u3057\u305F\u697D\u8B5C\u304C\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002</div>`;
    return;
  }
  SELECTORS.scoreHistoryList.innerHTML = history.map((item) => {
    const result = item.result || {};
    const title = result.title || result.videoId || "\u62BD\u51FA\u6E08\u307F\u697D\u8B5C";
    const previewOutputs = Array.isArray(result.pageOutputs) && result.pageOutputs.length ? result.pageOutputs : result.outputs;
    const pages = Array.isArray(previewOutputs) ? previewOutputs.length : 0;
    const sheets = result.layout === "a3_2up" && Array.isArray(result.outputs) ? result.outputs.length : 0;
    const measures = Number(result.labeledMeasures || 0);
    const musical = result.musicalAnalysis || {};
    const date = item.completedAt ? new Date(item.completedAt).toLocaleString() : "";
    return `<div class="score-history-item" data-score-history-id="${escapeHtml(item.id)}" tabindex="0" role="button">
      <div class="score-history-actions">
        <button class="score-history-action score-history-edit" type="button" data-score-history-edit="${escapeHtml(item.id)}" aria-label="\u8A2D\u5B9A\u3092\u5909\u3048\u3066\u518D\u751F\u6210" title="\u8A2D\u5B9A\u3092\u5909\u3048\u3066\u518D\u751F\u6210"><i data-lucide="settings-2"></i></button>
        <button class="score-history-action score-history-regenerate" type="button" data-score-history-regenerate="${escapeHtml(item.id)}" aria-label="\u540C\u3058\u8A2D\u5B9A\u3067\u518D\u751F\u6210" title="\u540C\u3058\u8A2D\u5B9A\u3067\u518D\u751F\u6210"><i data-lucide="refresh-cw"></i></button>
        <button class="score-history-action score-history-remove" type="button" data-score-history-remove="${escapeHtml(item.id)}" aria-label="\u5C65\u6B74\u304B\u3089\u524A\u9664" title="\u5C65\u6B74\u304B\u3089\u524A\u9664">\xD7</button>
      </div>
      <div class="score-history-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
      <div class="score-history-meta">${measures ? `${measures}\u5C0F\u7BC0 \xB7 ` : ""}${pages}\u30DA\u30FC\u30B8${sheets ? ` \xB7 A3 ${sheets}\u679A` : ""}${scoreOptionEnabled(result, "showBpm") && musical.bpm ? ` \xB7 BPM ${escapeHtml(musical.bpm)}` : ""}${scoreOptionEnabled(result, "showKeyEstimate") && musical.key ? ` \xB7 \u63A8\u5B9A\u30AD\u30FC ${escapeHtml(localizeEstimatedKey(musical.key))}` : ""}</div>
      <div class="score-history-date">${escapeHtml(date)}</div>
    </div>`;
  }).join("");
  lucide.createIcons();
};
var saveScoreHistory = (result) => {
  if (!result?.videoId || !Array.isArray(result.outputs)) return;
  const history = getScoreHistory().filter((item) => item.result?.videoId !== result.videoId);
  history.unshift({
    id: `${result.videoId}-${Date.now()}`,
    completedAt: Date.now(),
    result
  });
  localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  renderScoreHistory();
};
var removeScoreHistory = (id) => {
  const history = getScoreHistory().filter((item) => item.id !== id);
  localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(history));
  renderScoreHistory();
};
var updateScoreHistoryResult = (id, result) => {
  const history = getScoreHistory();
  const index = history.findIndex((item) => item.id === id);
  if (index < 0) return;
  history[index] = { ...history[index], result };
  localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(history));
};
var fetchLatestScoreResult = async (result) => {
  if (!result?.videoId) return result;
  try {
    const response = await fetch(`/score/${encodeURIComponent(result.videoId)}/metadata.json?t=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) return result;
    const latest = await response.json();
    return Array.isArray(latest?.outputs) ? latest : result;
  } catch {
    return result;
  }
};
var scoreRegenerationPayload = (data) => ({
  url: `https://www.youtube.com/watch?v=${data.videoId}`,
  title: data.title || null,
  startSec: data.startSec ?? null,
  endSec: data.endSec ?? null,
  region: data.region,
  trimStartFrames: Number(data.trimStartFrames || 0),
  trimEndFrames: Number(data.trimEndFrames || 0),
  layout: data.layout || "a3_2up",
  processingMode: data.processingMode || "auto",
  scoreContent: data.scoreContent || "tab",
  verticalScrollMode: data.verticalScrollMode || "auto",
  horizontalScrollMode: data.horizontalScrollMode || "auto",
  measuresPerRow: Number(data.measuresPerRow || 4),
  showMeasureNumbers: !!data.showMeasureNumbers,
  showChordSymbols: scoreOptionEnabled(data, "showChordSymbols"),
  showKeyEstimate: scoreOptionEnabled(data, "showKeyEstimate"),
  showBpm: scoreOptionEnabled(data, "showBpm")
});
var regenerateScore = async (data = currentScoreResult) => {
  if (!data?.videoId || !data?.region) return;
  const editedTitle = SELECTORS.scoreResultTitleInput.value.trim();
  const regenerationData = { ...data, title: editedTitle || data.title };
  currentScoreResult = regenerationData;
  SELECTORS.scoreResultSection.hidden = false;
  SELECTORS.scoreResultTitleInput.value = regenerationData.title || data.videoId || "";
  SELECTORS.scoreRegenerateBtn.disabled = true;
  SELECTORS.scoreResultStatus.className = "score-status score-result-status";
  SELECTORS.scoreResultStatus.innerHTML = `<span class="spin"></span>\u540C\u3058\u8A2D\u5B9A\u3067\u518D\u751F\u6210\u3092\u8FFD\u52A0\u3057\u3066\u3044\u307E\u3059...`;
  try {
    const response = await fetch("/score/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreRegenerationPayload(regenerationData))
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    trackQueuedJob(submitted.jobId, {
      label: `\u697D\u8B5C\u3092\u518D\u751F\u6210 \xB7 ${data.videoId}`,
      kind: "score-extract",
      retainDone: true,
      onDone: (result) => {
        saveScoreHistory(result);
        if (currentScoreResult?.videoId === result.videoId) renderScoreOutputs(result);
      }
    });
    SELECTORS.scoreResultStatus.className = "score-status score-result-status ok";
    SELECTORS.scoreResultStatus.textContent = "\u518D\u751F\u6210\u3092\u51E6\u7406\u4E00\u89A7\u3078\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002\u5B8C\u4E86\u5F8C\u306B\u3053\u306E\u697D\u8B5C\u3092\u66F4\u65B0\u3057\u307E\u3059\u3002";
  } catch (error) {
    SELECTORS.scoreResultStatus.className = "score-status score-result-status err";
    SELECTORS.scoreResultStatus.textContent = error.message;
  } finally {
    SELECTORS.scoreRegenerateBtn.disabled = false;
  }
};
var renderScoreOutputs = (data) => {
  currentScoreResult = data;
  const region = data.region || { x: 0, y: 0, width: 0, height: 0 };
  const previewOutputs = Array.isArray(data.outputs) && data.outputs.length ? data.outputs : data.pageOutputs;
  const outputUnit = data.layout === "a3_2up" ? "\u679A" : "\u30DA\u30FC\u30B8";
  const outputFormat = data.layout === "a3_2up" ? "A3" : data.layout === "a4" ? "A4" : "\u7E26\u9577";
  const zipUrl = safeAssetUrl(data.zipUrl);
  const safePreviewOutputs = (Array.isArray(previewOutputs) ? previewOutputs : []).map(safeAssetUrl).filter(Boolean);
  const download = zipUrl ? `<a class="btn-analyze" href="${escapeHtml(zipUrl)}" download>PNG\u3092\u307E\u3068\u3081\u3066\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9</a>` : "";
  const actions = download ? `<div class="score-download">${download}</div>` : "";
  const badges = [
    `${outputFormat}\u51FA\u529B`,
    scoreOptionEnabled(data, "showBpm") && data.musicalAnalysis?.bpm ? `BPM ${data.musicalAnalysis.bpm}` : null,
    scoreOptionEnabled(data, "showKeyEstimate") && data.musicalAnalysis?.key ? `\u63A8\u5B9A\u30AD\u30FC ${localizeEstimatedKey(data.musicalAnalysis.key)}` : null,
    scoreOptionEnabled(data, "showChordSymbols") && Number(data.musicalAnalysis?.analyzedMeasures || 0) > 0 ? `TAB\u753B\u50CF\u30B3\u30FC\u30C9 ${data.musicalAnalysis.analyzedMeasures}\u5C0F\u7BC0` : null,
    data.processingMode === "simple" ? "\u5143\u306E\u6BB5\u7D44\u307F\u3092\u7DAD\u6301" : "\u81EA\u52D5\u518D\u69CB\u6210\u6E08\u307F",
    data.scoreContent === "paired" ? "\u4E94\u7DDA\u8B5C\uFF0BTAB" : data.scoreContent === "tab" ? "TAB\u306E\u307F" : null,
    Number(data.verticalScrollSystems || 0) > 0 ? "\u7E26\u30B9\u30AF\u30ED\u30FC\u30EB\u3092\u691C\u51FA" : null,
    data.horizontalScrollMode === "off" ? "\u6A2A\u30B9\u30AF\u30ED\u30FC\u30EB\u88DC\u6B63\u306A\u3057" : null,
    Number(data.measuresPerRow || 0) > 0 ? `1\u884C${data.measuresPerRow}\u5C0F\u7BC0` : null
  ].filter(Boolean);
  const summary = badges.length ? `<div class="score-result-summary">${badges.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div>` : "";
  SELECTORS.scoreResultSection.hidden = false;
  SELECTORS.scoreResultTitleInput.value = data.title || data.videoId || "";
  SELECTORS.scoreResult.innerHTML = `${summary}${actions}${safePreviewOutputs.map((url, index) => `
    <div class="score-output">
      <div class="score-output-head">
        <span>${index + 1}/${safePreviewOutputs.length}${outputUnit} \xB7 ${escapeHtml(outputFormat)} \xB7 \u63A1\u7528 ${Number(data.keptFrames || 0)} \xB7 \u9664\u5916 ${Number(data.skippedFrames || 0)}</span>
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">PNG\u3092\u958B\u304F</a>
      </div>
      <img src="${escapeHtml(url)}${url.includes("?") ? "&" : "?"}t=${Date.now()}" alt="\u62BD\u51FA\u6E08\u307F\u697D\u8B5C ${index + 1}\u30DA\u30FC\u30B8\u76EE">
    </div>
  `).join("")}`;
  SELECTORS.scoreResultStatus.className = "score-status score-result-status ok";
  SELECTORS.scoreResultStatus.textContent = `\u5B8C\u4E86 \xB7 \u7BC4\u56F2 ${region.x},${region.y},${region.width}x${region.height}`;
  lucide.createIcons();
};
var editScoreSettings = async (data = currentScoreResult) => {
  if (!data?.videoId || !data?.region) return;
  const editedTitle = SELECTORS.scoreResultTitleInput.value.trim();
  editingScoreResult = { ...data, title: editedTitle || data.title };
  scorePreviewData = null;
  scoreRegion = null;
  SELECTORS.scorePreview.hidden = true;
  SELECTORS.scoreUrlInput.value = `https://www.youtube.com/watch?v=${data.videoId}`;
  SELECTORS.scoreTitleInput.value = editingScoreResult.title || "";
  const duration = Number(data.videoDurationSec || 0);
  const start = Number(data.startSec || 0);
  const end = Number(data.endSec || duration || 0);
  const usesRange = start > 0 || duration > 0 && end < duration - 0.5;
  SELECTORS.scoreTimeMode.value = usesRange ? "range" : "full";
  SELECTORS.scoreTimeRange.hidden = !usesRange;
  SELECTORS.scoreStartTime.value = usesRange ? fmt(start) : "";
  SELECTORS.scoreEndTime.value = usesRange ? fmt(end) : "";
  SELECTORS.scoreTrimStart.value = Number(data.trimStartFrames || 0);
  SELECTORS.scoreTrimEnd.value = Number(data.trimEndFrames || 0);
  SELECTORS.scoreLayout.value = data.layout || "a3_2up";
  SELECTORS.scoreProcessingMode.value = data.processingMode || "auto";
  SELECTORS.scoreContent.value = data.scoreContent || "tab";
  SELECTORS.scoreVerticalScrollMode.value = data.verticalScrollMode || "auto";
  SELECTORS.scoreHorizontalScrollMode.value = data.horizontalScrollMode || "auto";
  SELECTORS.scoreMeasuresPerRow.value = Number(data.measuresPerRow || 4);
  SELECTORS.scoreMeasureNumbers.checked = !!data.showMeasureNumbers;
  SELECTORS.scoreChordSymbols.checked = scoreOptionEnabled(data, "showChordSymbols");
  SELECTORS.scoreKeyEstimate.checked = scoreOptionEnabled(data, "showKeyEstimate");
  SELECTORS.scoreBpm.checked = scoreOptionEnabled(data, "showBpm");
  syncScoreOptionAvailability();
  SELECTORS.scoreFormKicker.textContent = "\u518D\u751F\u6210\u8A2D\u5B9A";
  SELECTORS.scoreFormTitle.textContent = "\u8A2D\u5B9A\u3092\u5909\u66F4\u3057\u3066\u518D\u751F\u6210";
  SELECTORS.scoreExtractBtn.textContent = "\u518D\u751F\u6210\u958B\u59CB";
  SELECTORS.scoreEditSettingsBtn.disabled = true;
  SELECTORS.scoreStatus.className = "score-status";
  SELECTORS.scoreStatus.textContent = "\u4FDD\u5B58\u6E08\u307F\u8A2D\u5B9A\u3068\u30D7\u30EC\u30D3\u30E5\u30FC\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u3059...";
  SELECTORS.scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    await loadScorePreview();
    if (!scorePreviewData) return;
    scoreRegion = clampScoreRegion(data.region);
    const video = scorePreviewData.video;
    SELECTORS.scoreRegionPercent.value = Math.max(
      5,
      Math.min(90, Math.round(scoreRegion.height / video.height * 100))
    );
    SELECTORS.scoreRegionPreset.value = scoreRegion.y + scoreRegion.height / 2 < video.height / 2 ? "top" : "bottom";
    renderScoreRegion();
    SELECTORS.scoreStatus.className = "score-status ok";
    SELECTORS.scoreStatus.textContent = "\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\u3002\u5909\u66F4\u5F8C\u306B\u300C\u518D\u751F\u6210\u958B\u59CB\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  } finally {
    SELECTORS.scoreEditSettingsBtn.disabled = false;
  }
};
var resetScoreWorkspace = () => {
  editingScoreResult = null;
  scorePreviewData = null;
  scoreRegion = null;
  SELECTORS.scoreUrlInput.value = "";
  SELECTORS.scoreTitleInput.value = "";
  SELECTORS.scoreTimeMode.value = "full";
  SELECTORS.scoreTimeRange.hidden = true;
  SELECTORS.scoreStartTime.value = "";
  SELECTORS.scoreEndTime.value = "";
  SELECTORS.scorePreview.hidden = true;
  SELECTORS.scorePreviewImg.removeAttribute("src");
  SELECTORS.scorePreviewMeta.textContent = "";
  SELECTORS.scoreFormKicker.textContent = "\u65B0\u898F\u4F5C\u6210";
  SELECTORS.scoreFormTitle.textContent = "\u65B0\u3057\u3044\u697D\u8B5C\u3092\u62BD\u51FA";
  SELECTORS.scoreExtractBtn.textContent = "\u62BD\u51FA\u958B\u59CB";
  SELECTORS.scoreStatus.className = "score-status";
  SELECTORS.scoreStatus.textContent = "\u6B21\u306E\u697D\u8B5C\u52D5\u753BURL\u3092\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002";
  SELECTORS.scoreUrlInput.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => SELECTORS.scoreUrlInput.focus(), 250);
};
var clampScoreRegion = (region) => {
  if (!scorePreviewData?.video) return region;
  const video = scorePreviewData.video;
  const minSize = 8;
  const x = Math.max(0, Math.min(video.width - minSize, Math.round(region.x)));
  const y2 = Math.max(0, Math.min(video.height - minSize, Math.round(region.y)));
  const width = Math.max(minSize, Math.min(video.width - x, Math.round(region.width)));
  const height = Math.max(minSize, Math.min(video.height - y2, Math.round(region.height)));
  return { x, y: y2, width, height };
};
var regionFromEdges = (edges) => {
  if (!scorePreviewData?.video) return scoreRegion;
  const video = scorePreviewData.video;
  const minSize = 8;
  let left = Math.max(0, Math.min(video.width - minSize, edges.left));
  let top = Math.max(0, Math.min(video.height - minSize, edges.top));
  let right = Math.max(minSize, Math.min(video.width, edges.right));
  let bottom = Math.max(minSize, Math.min(video.height, edges.bottom));
  if (right - left < minSize) {
    if (edges.anchorX === "left") right = Math.min(video.width, left + minSize);
    else left = Math.max(0, right - minSize);
  }
  if (bottom - top < minSize) {
    if (edges.anchorY === "top") bottom = Math.min(video.height, top + minSize);
    else top = Math.max(0, bottom - minSize);
  }
  return clampScoreRegion({
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  });
};
var renderScoreRegion = () => {
  if (!scorePreviewData?.video || !scoreRegion) return;
  const video = scorePreviewData.video;
  const box = SELECTORS.scoreRegionBox;
  box.style.left = `${scoreRegion.x / video.width * 100}%`;
  box.style.top = `${scoreRegion.y / video.height * 100}%`;
  box.style.width = `${scoreRegion.width / video.width * 100}%`;
  box.style.height = `${scoreRegion.height / video.height * 100}%`;
  const selectedTime = scorePreviewData.startSec > 0 || scorePreviewData.endSec < video.durationSec ? ` \xB7 \u62BD\u51FA ${fmt(scorePreviewData.startSec)}\u2013${fmt(scorePreviewData.endSec)}` : ` \xB7 \u5168\u4F53 ${fmt(video.durationSec)}`;
  SELECTORS.scorePreviewMeta.textContent = `\u7BC4\u56F2 ${scoreRegion.x},${scoreRegion.y},${scoreRegion.width}x${scoreRegion.height} \xB7 \u52D5\u753B ${video.width}x${video.height}${selectedTime}`;
};
var parseScoreTime = (value, label) => {
  const text = value.trim();
  if (!text) return null;
  const parts = text.split(":");
  if (parts.length > 3 || parts.some((part) => part === "" || !/^\d+(?:\.\d+)?$/.test(part))) {
    throw new Error(`${label}\u306F\u300C\u5206:\u79D2\u300D\u307E\u305F\u306F\u79D2\u6570\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);
  }
  const values = parts.map(Number);
  if (values.some((value2) => !Number.isFinite(value2) || value2 < 0)) {
    throw new Error(`${label}\u306B\u306F0\u4EE5\u4E0A\u306E\u6642\u9593\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);
  }
  if (parts.length > 1 && values.slice(1).some((value2) => value2 >= 60)) {
    throw new Error(`${label}\u306E\u5206\u30FB\u79D2\u306F60\u672A\u6E80\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);
  }
  return values.reduce((total, value2) => total * 60 + value2, 0);
};
var getScoreTimePayload = () => {
  if (SELECTORS.scoreTimeMode.value !== "range") return { startSec: null, endSec: null };
  const startSec = parseScoreTime(SELECTORS.scoreStartTime.value, "\u958B\u59CB\u6642\u9593");
  const endSec = parseScoreTime(SELECTORS.scoreEndTime.value, "\u7D42\u4E86\u6642\u9593");
  if (startSec !== null && endSec !== null && endSec <= startSec) {
    throw new Error("\u7D42\u4E86\u6642\u9593\u306F\u958B\u59CB\u6642\u9593\u3088\u308A\u5F8C\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
  }
  return { startSec, endSec };
};
var getAnalysisTimePayload = () => {
  if (SELECTORS.analysisTimeMode.value !== "range") return { startSec: null, endSec: null };
  const startSec = parseScoreTime(SELECTORS.analysisStartTime.value, "\u958B\u59CB\u6642\u9593");
  const endSec = parseScoreTime(SELECTORS.analysisEndTime.value, "\u7D42\u4E86\u6642\u9593");
  if (startSec !== null && endSec !== null && endSec <= startSec) {
    throw new Error("\u7D42\u4E86\u6642\u9593\u306F\u958B\u59CB\u6642\u9593\u3088\u308A\u5F8C\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
  }
  return { startSec, endSec };
};
var getScorePreviewPoint = (event) => {
  const rect = SELECTORS.scorePreviewImg.getBoundingClientRect();
  const video = scorePreviewData.video;
  return {
    x: Math.max(0, Math.min(video.width, (event.clientX - rect.left) / rect.width * video.width)),
    y: Math.max(0, Math.min(video.height, (event.clientY - rect.top) / rect.height * video.height))
  };
};
var loadScorePreview = async () => {
  const url = SELECTORS.scoreUrlInput.value.trim();
  SELECTORS.scorePreviewBtn.disabled = true;
  SELECTORS.scoreExtractBtn.disabled = true;
  SELECTORS.scoreStatus.className = "score-status";
  SELECTORS.scoreStatus.innerHTML = `<span class="spin"></span>\u30D7\u30EC\u30D3\u30E5\u30FC\u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...`;
  try {
    const timeRange = getScoreTimePayload();
    const response = await fetch("/score/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        title: SELECTORS.scoreTitleInput.value.trim() || null,
        regionPreset: SELECTORS.scoreRegionPreset.value,
        regionPercent: Number(SELECTORS.scoreRegionPercent.value),
        ...timeRange
      })
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    trackQueuedJob(submitted.jobId, { label: "\u697D\u8B5C\u30D7\u30EC\u30D3\u30E5\u30FC" });
    const data = await waitForJobResult(submitted.jobId);
    scorePreviewData = data;
    scoreRegion = clampScoreRegion(data.region);
    SELECTORS.scorePreview.hidden = false;
    SELECTORS.scorePreviewImg.src = `${data.previewFrameUrl}?t=${Date.now()}`;
    SELECTORS.scoreStatus.className = "score-status ok";
    SELECTORS.scoreStatus.textContent = "\u30D7\u30EC\u30D3\u30E5\u30FC\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\u3002\u30AA\u30EC\u30F3\u30B8\u306E\u67A0\u3092\u52D5\u304B\u3057\u3066\u697D\u8B5C\u7BC4\u56F2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
    SELECTORS.scorePreviewImg.onload = renderScoreRegion;
    renderScoreRegion();
  } catch (error) {
    SELECTORS.scoreStatus.className = "score-status err";
    SELECTORS.scoreStatus.textContent = error.message;
  } finally {
    SELECTORS.scorePreviewBtn.disabled = false;
    SELECTORS.scoreExtractBtn.disabled = false;
  }
};
var extractScore = async () => {
  const url = SELECTORS.scoreUrlInput.value.trim();
  const regeneratingWithChanges = !!editingScoreResult;
  if (!scoreRegion) {
    await loadScorePreview();
    if (!scoreRegion) return;
  }
  SELECTORS.scoreExtractBtn.disabled = true;
  SELECTORS.scoreStatus.className = "score-status";
  SELECTORS.scoreStatus.innerHTML = `<span class="spin"></span>\u62BD\u51FA\u3092\u51E6\u7406\u4E00\u89A7\u3078\u8FFD\u52A0\u4E2D...`;
  try {
    const timeRange = getScoreTimePayload();
    const response = await fetch("/score/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        title: SELECTORS.scoreTitleInput.value.trim() || null,
        regionPreset: SELECTORS.scoreRegionPreset.value,
        regionPercent: Number(SELECTORS.scoreRegionPercent.value),
        ...timeRange,
        trimStartFrames: Number(SELECTORS.scoreTrimStart.value),
        trimEndFrames: Number(SELECTORS.scoreTrimEnd.value),
        layout: SELECTORS.scoreLayout.value,
        processingMode: SELECTORS.scoreProcessingMode.value,
        scoreContent: SELECTORS.scoreContent.value,
        verticalScrollMode: SELECTORS.scoreVerticalScrollMode.value,
        horizontalScrollMode: SELECTORS.scoreHorizontalScrollMode.value,
        measuresPerRow: Number(SELECTORS.scoreMeasuresPerRow.value),
        showMeasureNumbers: SELECTORS.scoreMeasureNumbers.checked,
        showChordSymbols: SELECTORS.scoreChordSymbols.checked,
        showKeyEstimate: SELECTORS.scoreKeyEstimate.checked,
        showBpm: SELECTORS.scoreBpm.checked,
        region: scoreRegion
      })
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    const videoId = extractVideoId(url);
    trackQueuedJob(submitted.jobId, {
      label: regeneratingWithChanges ? `\u697D\u8B5C\u3092\u518D\u751F\u6210 \xB7 ${videoId || "\u8A2D\u5B9A\u5909\u66F4"}` : videoId ? `\u697D\u8B5C\u62BD\u51FA \xB7 ${videoId}` : "\u697D\u8B5C\u62BD\u51FA",
      kind: "score-extract",
      retainDone: true,
      onDone: saveScoreHistory
    });
    resetScoreWorkspace();
    SELECTORS.scoreStatus.className = "score-status ok";
    SELECTORS.scoreStatus.textContent = regeneratingWithChanges ? "\u5909\u66F4\u3057\u305F\u8A2D\u5B9A\u3067\u518D\u751F\u6210\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002" : "\u62BD\u51FA\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002\u7D9A\u3051\u3066\u6B21\u306E\u697D\u8B5C\u52D5\u753BURL\u3092\u8CBC\u308A\u4ED8\u3051\u3089\u308C\u307E\u3059\u3002";
  } catch (error) {
    SELECTORS.scoreStatus.className = "score-status err";
    SELECTORS.scoreStatus.textContent = error.message;
  } finally {
    SELECTORS.scoreExtractBtn.disabled = false;
  }
};
var syncScoreOptionAvailability = () => {
  const automatic = SELECTORS.scoreProcessingMode.value === "auto";
  [
    SELECTORS.scoreContent,
    SELECTORS.scoreVerticalScrollMode,
    SELECTORS.scoreHorizontalScrollMode,
    SELECTORS.scoreMeasuresPerRow
  ].forEach((control) => {
    control.disabled = !automatic;
  });
};
var extractVideoId = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.replace(/^\//, "").split("?")[0] || null;
    if (["www.youtube.com", "youtube.com", "m.youtube.com"].includes(parsed.hostname)) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
};
var sectionColorKey = (label) => {
  const normalized = String(label || "").toLowerCase();
  const aliases = [
    ["pre-chorus", "pre-chorus"],
    ["b\u30E1\u30ED", "pre-chorus"],
    ["intro", "intro"],
    ["\u30A4\u30F3\u30C8\u30ED", "intro"],
    ["verse", "verse"],
    ["a\u30E1\u30ED", "verse"],
    ["chorus", "chorus"],
    ["\u30B5\u30D3", "chorus"],
    ["bridge", "bridge"],
    ["c\u30E1\u30ED", "bridge"],
    ["outro", "outro"],
    ["\u30A2\u30A6\u30C8\u30ED", "outro"],
    ["interlude", "intro"],
    ["instrumental", "intro"],
    ["inst", "intro"],
    ["\u9593\u594F", "intro"]
  ];
  return aliases.find(([alias]) => normalized.includes(alias))?.[1];
};
var secColor = (label) => COLORS[sectionColorKey(label)] ?? "#94a3b8";
var localizeSectionLabel = (label) => {
  const raw = String(label || "");
  const normalized = raw.toLowerCase();
  const labels = [
    ["pre-chorus", "B\u30E1\u30ED"],
    ["post-chorus", "\u5F8C\u30B5\u30D3"],
    ["intro", "\u30A4\u30F3\u30C8\u30ED"],
    ["verse", "A\u30E1\u30ED"],
    ["chorus", "\u30B5\u30D3"],
    ["bridge", "C\u30E1\u30ED"],
    ["interlude", "\u9593\u594F"],
    ["instrumental", "\u9593\u594F"],
    ["inst", "\u9593\u594F"],
    ["solo", "\u30BD\u30ED"],
    ["start", "\u958B\u59CB"],
    ["outro", "\u30A2\u30A6\u30C8\u30ED"],
    ["ending", "\u30A8\u30F3\u30C7\u30A3\u30F3\u30B0"],
    ["end", "\u30A2\u30A6\u30C8\u30ED"]
  ];
  const match = labels.find(([key]) => normalized.includes(key));
  return match ? raw.replace(new RegExp(match[0], "i"), match[1]) : raw;
};
var rgba = (hex, alpha) => {
  const [r3, g2, b2] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  return `rgba(${r3},${g2},${b2},${alpha})`;
};
var getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};
var prepareAlignedAsset = async (url, beats, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`\u97F3\u6E90\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093 (${response.status})`);
  const buffer = await getCtx().decodeAudioData(await response.arrayBuffer());
  const blob = await alignedWav(buffer, beats, { signal });
  return URL.createObjectURL(blob);
};
var initStemPlayers = async (stemAssets) => {
  destroyStemPlayers();
  const preparationVersion = stemPreparationVersion;
  if (hasStemAssets({ stems: stemAssets }) && !STEM_NAMES.every((name) => alignedAssetUrls.includes(stemAssets[name]))) {
    const preparation = audioPreparation;
    const urls = [];
    try {
      const prepared = {};
      for (const name of STEM_NAMES) {
        prepared[name] = await prepareAlignedAsset(stemAssets[name], getAdjustedBeats(), preparation?.signal);
        urls.push(prepared[name]);
        if (preparationVersion !== stemPreparationVersion) {
          for (const url of urls) URL.revokeObjectURL(url);
          return false;
        }
      }
      preparation?.signal.throwIfAborted();
      alignedAssetUrls.push(...urls);
      currentStemAssets = stemAssets = prepared;
    } catch (error) {
      for (const url of urls) URL.revokeObjectURL(url);
      if (!preparation?.signal.aborted) {
        SELECTORS.stemStatus.className = "stem-status err";
        SELECTORS.stemStatus.textContent = "\u30D1\u30FC\u30C8\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093 \xB7 \u5143\u97F3\u6E90\u3092\u518D\u751F";
      }
      return false;
    }
  }
  if (!hasStemAssets({ stems: stemAssets })) return false;
  for (const stem of STEM_NAMES) {
    const player = new Audio();
    player.crossOrigin = "anonymous";
    player.src = stemAssets[stem];
    player.dataset.stem = stem;
    const source = getCtx().createMediaElementSource(player);
    if (alignedAssetUrls.includes(player.src)) alignedOutputs.set(player, connectAlignedOutput(getCtx(), source, player));
    else source.connect(getCtx().destination);
    stemSourceNodes.set(stem, source);
    player.preload = isMobileViewport() ? "metadata" : "auto";
    preserveMediaPitch(player);
    player.playbackRate = playbackRate;
    stemPlayers[stem] = player;
  }
  stemReady = true;
  stemTransport.setPlayers(stemPlayers);
  applyStemMix();
  return true;
};
var audiblePlaybackClock = () => selectPlaybackClock({
  master: ws?.getMediaElement(),
  players: stemPlayers,
  activeStems: currentStemPlaybackPlan().activeStems,
  state: stemTransport.snapshot().state
});
var updateAlignedClickOutput = () => {
  const reference = audiblePlaybackClock().media;
  const volume = metroOn && ws?.isPlaying() && reference && !reference.paused && !reference.seeking ? Number(SELECTORS.volMetro.value) / 100 : 0;
  for (const [media, output] of alignedOutputs) output.click.gain.value = media === reference ? volume : 0;
};
var startMetro = () => updateAlignedClickOutput();
var stopMetro = () => {
  for (const output of alignedOutputs.values()) output.click.gain.value = 0;
};
setInterval(() => {
  if (!ws?.isPlaying()) return;
  const { media, name } = audiblePlaybackClock();
  const range = getLoopRange();
  logPlaybackDiagnostic("playback-clock", {
    audioTime: ws.getCurrentTime(),
    referenceTime: media?.currentTime,
    reference: name,
    playbackRate,
    contextTime: audioCtx?.currentTime,
    outputContextTime: audioCtx?.getOutputTimestamp?.().contextTime,
    outputLatency: audioCtx?.outputLatency,
    baseLatency: audioCtx?.baseLatency,
    clickEnabled: Number(metroOn),
    loopEnabled: Number(loopOn),
    loopStart: range?.start,
    loopEnd: range?.end,
    ...Object.fromEntries(STEM_NAMES.map((stem) => [`${stem}Time`, stemPlayers[stem]?.currentTime]))
  });
}, 1e3);
var rebuildAlignedClicks = async () => {
  if (!playbackRawAssets) return;
  const time = ws?.getCurrentTime() ?? 0, playing = !!ws?.isPlaying();
  const { audio, video, stems } = playbackRawAssets;
  const player = await initWaveSurfer(audio, video, stems);
  if (!player || player !== ws) return;
  player.once("ready", () => {
    if (ws !== player) return;
    seekAudio(time, { respectLoopRange: false });
    if (playing) void player.play();
  });
};
var seekAudio = (targetTime, { respectLoopRange = true } = {}) => {
  if (!ws) return;
  const duration = ws.getDuration();
  if (!(duration > 0)) return;
  let clampedTime = Math.min(duration, Math.max(0, targetTime));
  if (respectLoopRange && loopOn) {
    const loopRange = getLoopRange();
    if (loopRange && clampedTime < loopRange.start) clampedTime = loopRange.start;
  }
  stopMetro();
  syncVideoToAudio(clampedTime, { force: true });
  ws.seekTo(clampedTime / duration);
  syncStemPlayers(clampedTime, { force: true });
};
var cancelWaveformPreviewSeek = () => {
  if (waveformSeekRafId) cancelAnimationFrame(waveformSeekRafId);
  waveformSeekRafId = 0;
  pendingWaveformSeekTime = null;
};
var scheduleWaveformPreviewSeek = (time) => {
  pendingWaveformSeekTime = time;
  if (waveformSeekRafId) return;
  waveformSeekRafId = requestAnimationFrame(() => {
    waveformSeekRafId = 0;
    const target = pendingWaveformSeekTime;
    pendingWaveformSeekTime = null;
    if (Number.isFinite(target)) seekAudio(target, { respectLoopRange: false });
  });
};
var medianNumber = (values) => {
  const sorted = values.filter((value) => Number.isFinite(value) && value > 0).sort((left, right) => left - right);
  if (!sorted.length) return 0;
  return sorted[Math.floor(sorted.length / 2)];
};
var applyClickOffset = (beats) => {
  if (!clickOffsetHalfBeat || beats.length < 2) return beats;
  const interval = medianNumber(beats.slice(1).map((beat, index) => beat - beats[index]));
  if (!(interval > 0)) return beats;
  const offset = -interval / 2;
  return beats.map((beat) => Math.max(0, beat + offset));
};
var getAdjustedBeats = () => {
  const beats = currentData?.beats ?? [];
  if (!beats.length) return [];
  if (bpmFactor === 1) return applyClickOffset(beats);
  let adjusted = [...beats];
  let factor = bpmFactor;
  while (factor > 1) {
    const expanded = [];
    for (let i3 = 0; i3 < adjusted.length; i3 += 1) {
      const beat = adjusted[i3];
      expanded.push(beat);
      const next = adjusted[i3 + 1];
      if (next != null) expanded.push((beat + next) / 2);
    }
    adjusted = expanded;
    factor /= 2;
  }
  while (factor < 1) {
    adjusted = adjusted.filter((_, index) => index % 2 === 0);
    factor *= 2;
  }
  return applyClickOffset(adjusted);
};
var getLoopRange = () => {
  if (customLoopRange) return customLoopRange;
  if (!selectedIdxs.size || !currentData) return null;
  const indexes = [...selectedIdxs].sort((left, right) => left - right);
  return {
    start: currentData.sections[indexes[0]].start_time,
    end: currentData.sections[indexes.at(-1)].end_time,
    labels: indexes.map((index) => localizeSectionLabel(currentData.sections[index].label))
  };
};
var updateSelectionUI = () => {
  document.querySelectorAll(".sec-row").forEach((row, index) => {
    const selected = selectedIdxs.has(index);
    row.classList.toggle("selected", selected && loopOn);
    row.classList.toggle("preview-selected", selected && !loopOn);
  });
  SELECTORS.btnClearRange.hidden = !customLoopRange;
  renderCustomLoopRange();
  renderSectionSelectionRanges();
  updateStemExportScopeAvailability();
  if (!loopOn) {
    SELECTORS.loopInfo.textContent = "";
    return;
  }
  const loopRange = getLoopRange();
  if (!loopRange) {
    SELECTORS.loopInfo.textContent = "\u21BB \u66F2\u5168\u4F53";
    return;
  }
  if (loopRange.kind === "custom") {
    if (loopRange.labels?.length) {
      const label2 = loopRange.labels.length === 1 ? loopRange.labels[0] : `${loopRange.labels[0]} \u2192 ${loopRange.labels.at(-1)}`;
      SELECTORS.loopInfo.textContent = `\u21BB ${label2} ${fmt(loopRange.start)}-${fmt(loopRange.end)}`;
      return;
    }
    SELECTORS.loopInfo.textContent = `\u21BB \u7BC4\u56F2 ${fmt(loopRange.start)}-${fmt(loopRange.end)}`;
    return;
  }
  const label = loopRange.labels.length === 1 ? loopRange.labels[0] : `${loopRange.labels[0]} \u2192 ${loopRange.labels.at(-1)}`;
  SELECTORS.loopInfo.textContent = `\u21BB ${label} ${fmt(loopRange.start)}-${fmt(loopRange.end)}`;
};
var updatePlayButton = () => {
  const isPlaying = stemHoldingMaster || !!ws?.isPlaying();
  for (const button of [SELECTORS.btnPlay, SELECTORS.btnFsPlay]) {
    button.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-label", isPlaying ? "\u4E00\u6642\u505C\u6B62" : "\u518D\u751F");
  }
};
var updatePlaybackModeButtons = () => {
  for (const button of [SELECTORS.btnLoop, SELECTORS.btnFsLoop]) {
    button.classList.toggle("active", loopOn);
    button.setAttribute("aria-pressed", String(loopOn));
  }
  for (const button of [SELECTORS.btnAutoNext, SELECTORS.btnFsAutoNext]) {
    button.classList.toggle("active", autoNextOn);
    button.setAttribute("aria-pressed", String(autoNextOn));
    button.title = loopOn ? "\u30EB\u30FC\u30D7\u4E2D\u306F\u81EA\u52D5\u3067\u6B21\u3078\u306E\u6A5F\u80FD\u3092\u505C\u6B62\u3057\u307E\u3059" : "\u66F2\u304C\u7D42\u308F\u308B\u3068\u6B21\u306E\u66F2\u3092\u518D\u751F\u3057\u307E\u3059";
  }
  for (const button of [SELECTORS.btnMetro, SELECTORS.btnFsMetro]) {
    button.classList.toggle("active", metroOn);
    button.setAttribute("aria-pressed", String(metroOn));
  }
};
var canPlayAudio = () => !!ws && audioAvailable && audioReady;
var togglePlayback = () => {
  if (stemHoldingMaster) {
    pauseStems();
    pauseVideo();
    stopMetro();
    updatePlayButton();
    return;
  }
  if (!ws || !ws.isPlaying() && !canPlayAudio()) return;
  getCtx();
  if (ws.isPlaying()) {
    ws.pause();
    return;
  }
  ws.play();
};
var playFromTime = (time) => {
  if (!canPlayAudio()) return;
  getCtx();
  seekAudio(time);
  ws.play();
};
var playFromBeginning = () => playFromTime(0);
var seekVideoByClickSide = (event) => {
  if (!ws) return;
  const rect = SELECTORS.videoPlayer.getBoundingClientRect();
  const fullscreenPortrait = document.body.classList.contains("video-fullscreen-mode") && window.matchMedia("(max-width: 680px) and (orientation: portrait)").matches;
  const position = fullscreenPortrait ? (event.clientY - rect.top) / rect.height : (event.clientX - rect.left) / rect.width;
  const delta = position < 0.5 ? -5 : 5;
  seekAudio(ws.getCurrentTime() + delta);
};
var handleVideoClick = (event) => {
  event.preventDefault();
  const action = videoClickAction({
    pendingSingleClick: !!videoClickTimer,
    coarsePointer: window.matchMedia("(hover: none) and (pointer: coarse)").matches
  });
  if (action !== "wait") {
    clearTimeout(videoClickTimer);
    videoClickTimer = 0;
    if (action === "seek") seekVideoByClickSide(event);
    else toggleVideoFullscreen();
    return;
  }
  videoClickTimer = window.setTimeout(() => {
    videoClickTimer = 0;
    togglePlayback();
  }, 240);
};
var adjustBarValue = (value) => Math.max(1, Math.round(value * bpmFactor));
var adjustBarRange = (startBar, endBar) => {
  const start = Math.max(1, Math.round((startBar - 1) * bpmFactor) + 1);
  const end = Math.max(start, Math.round(endBar * bpmFactor));
  return { start, end, count: end - start + 1 };
};
var applyBpmDisplay = () => {
  if (!currentData) return;
  const value = Number(currentData.bpm || 0) * bpmFactor;
  SELECTORS.metaBpm.textContent = Number.isInteger(value) ? String(value) : value.toFixed(1);
  SELECTORS.metaBars.textContent = adjustBarValue(currentData.total_bars || 0);
  document.querySelectorAll(".sec-row").forEach((row, index) => {
    const section = currentData.sections[index];
    if (!section) return;
    const { count: barCount } = adjustBarRange(section.start_bar, section.end_bar);
    const bars = row.querySelector(".sec-bars");
    if (bars) {
      bars.innerHTML = `<span class="subtle">${barCount}\u5C0F\u7BC0</span>`;
    }
  });
  document.querySelectorAll(".si").forEach((row) => {
    if (row.dataset.id !== currentId) return;
    const meta = row.querySelector(".si-meta");
    if (meta) {
      const date = row.dataset.date || "";
      meta.textContent = `\u2669${SELECTORS.metaBpm.textContent}${date ? ` \xB7 ${date}` : ""}`;
    }
  });
  renderFourBarGrid();
};
var stopJobPolling = () => {
  if (jobPollTimer) {
    clearInterval(jobPollTimer);
    jobPollTimer = null;
  }
};
var renderJobStatus = (job) => {
  if (!job) return;
  SELECTORS.jobCard.hidden = true;
  SELECTORS.jobStage.textContent = localizeJobStage(job.stage);
  const startedAt = job.started_at ?? currentJobStartedAt ?? Date.now() / 1e3;
  currentJobStartedAt = startedAt;
  const elapsed = Math.max(0, Math.floor(Date.now() / 1e3 - startedAt));
  SELECTORS.jobElapsed.textContent = `${elapsed}\u79D2`;
  SELECTORS.jobMessage.textContent = job.error || localizeJobMessage(job.message);
};
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var fetchJobStatus = async (jobId) => {
  const response = await fetch(`/jobs/${encodeURIComponent(jobId)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`\u30B8\u30E7\u30D6\u72B6\u614B\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093 (${response.status})`);
  return response.json();
};
var queueItemClass = (job) => {
  if (job?.canceled || job?.stage === "canceled") return "canceled";
  if (job?.error) return "error";
  if (job?.done) return "done";
  if (job?.stage === "queued") return "queued";
  return "running";
};
var localizeJobStage = (stage) => ({
  queued: "\u5F85\u6A5F\u4E2D",
  running: "\u51E6\u7406\u4E2D",
  processing: "\u51E6\u7406\u4E2D",
  downloading: "\u7D20\u6750\u6E96\u5099",
  inferencing: "\u66F2\u69CB\u6210\u3092\u89E3\u6790\u4E2D",
  saving: "\u4FDD\u5B58\u4E2D",
  stems: "\u30D1\u30FC\u30C8\u5206\u96E2\u4E2D",
  exporting: "\u66F8\u304D\u51FA\u3057\u4E2D",
  uploading: "\u540C\u671F\u4E2D",
  canceling: "\u30AD\u30E3\u30F3\u30BB\u30EB\u4E2D",
  canceled: "\u30AD\u30E3\u30F3\u30BB\u30EB\u6E08\u307F",
  interrupted: "\u518D\u958B\u5F85\u3061",
  done: "\u5B8C\u4E86",
  error: "\u30A8\u30E9\u30FC"
})[String(stage || "").toLowerCase()] || stage || "\u5F85\u6A5F\u4E2D";
var localizeJobMessage = (message) => {
  const raw = String(message || "");
  const exact = {
    "Complete": "\u5B8C\u4E86\u3057\u307E\u3057\u305F",
    "Canceled": "\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F",
    "Cancel requested": "\u30AD\u30E3\u30F3\u30BB\u30EB\u3092\u8981\u6C42\u3057\u307E\u3057\u305F",
    "Application restarted; resume when ready": "\u524D\u56DE\u306E\u7D42\u4E86\u6642\u306B\u4E2D\u65AD\u3055\u308C\u307E\u3057\u305F\u3002\u6E96\u5099\u304C\u3067\u304D\u305F\u3089\u518D\u958B\u3057\u3066\u304F\u3060\u3055\u3044",
    "Queued": "\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued analysis": "\u89E3\u6790\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued local audio analysis": "\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u306E\u89E3\u6790\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued stem separation": "\u30D1\u30FC\u30C8\u5206\u96E2\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued stem mix export": "\u30D1\u30FC\u30C8\u66F8\u304D\u51FA\u3057\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued cloud sync": "\u7AEF\u672B\u9593\u540C\u671F\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued score preview": "\u697D\u8B5C\u30D7\u30EC\u30D3\u30E5\u30FC\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Queued score extraction": "\u697D\u8B5C\u62BD\u51FA\u3092\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F",
    "Rendering stem mix": "\u30D1\u30FC\u30C8\u306E\u30DF\u30C3\u30AF\u30B9\u3092\u66F8\u304D\u51FA\u3057\u3066\u3044\u307E\u3059",
    "Analysis timed out": "\u89E3\u6790\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F",
    "Separating stems": "\u30D1\u30FC\u30C8\u3092\u5206\u96E2\u3057\u3066\u3044\u307E\u3059",
    "Loaded from cache": "\u4FDD\u5B58\u6E08\u307F\u306E\u89E3\u6790\u7D50\u679C\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F",
    "Fetching title": "\u52D5\u753B\u30BF\u30A4\u30C8\u30EB\u3092\u53D6\u5F97\u3057\u3066\u3044\u307E\u3059",
    "Downloading audio": "\u97F3\u58F0\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u3066\u3044\u307E\u3059",
    "Using cached audio": "\u4FDD\u5B58\u6E08\u307F\u306E\u97F3\u58F0\u3092\u4F7F\u7528\u3057\u307E\u3059",
    "Downloading video": "\u52D5\u753B\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u3066\u3044\u307E\u3059",
    "Using cached video": "\u4FDD\u5B58\u6E08\u307F\u306E\u52D5\u753B\u3092\u4F7F\u7528\u3057\u307E\u3059",
    "Preparing playback mp3": "\u518D\u751F\u7528\u306E\u97F3\u58F0\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059",
    "Preparing uploaded audio": "\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u3092\u5909\u63DB\u3057\u3066\u3044\u307E\u3059",
    "Preparing playback video": "\u518D\u751F\u7528\u306E\u52D5\u753B\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059",
    "Saving results": "\u89E3\u6790\u7D50\u679C\u3092\u4FDD\u5B58\u3057\u3066\u3044\u307E\u3059",
    "Analysis complete": "\u89E3\u6790\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F",
    "Preparing cloud asset URLs": "\u30AF\u30E9\u30A6\u30C9\u7528URL\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059",
    "Uploading session assets to R2": "\u697D\u66F2\u30C7\u30FC\u30BF\u3092\u30AF\u30E9\u30A6\u30C9\u3078\u9001\u4FE1\u3057\u3066\u3044\u307E\u3059",
    "Stems ready": "\u30D1\u30FC\u30C8\u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F",
    "Exporting static assets": "\u516C\u958B\u7528\u30C7\u30FC\u30BF\u3092\u66F8\u304D\u51FA\u3057\u3066\u3044\u307E\u3059",
    "Updating R2 CORS": "\u30AF\u30E9\u30A6\u30C9\u306E\u63A5\u7D9A\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u3066\u3044\u307E\u3059",
    "Uploading manifest": "\u697D\u66F2\u4E00\u89A7\u3092\u30AF\u30E9\u30A6\u30C9\u3078\u9001\u4FE1\u3057\u3066\u3044\u307E\u3059",
    "Uploading folders": "\u30D5\u30A9\u30EB\u30C0\u30FC\u60C5\u5831\u3092\u30AF\u30E9\u30A6\u30C9\u3078\u9001\u4FE1\u3057\u3066\u3044\u307E\u3059",
    "Uploading static app": "\u30A2\u30D7\u30EA\u3092\u30AF\u30E9\u30A6\u30C9\u3078\u9001\u4FE1\u3057\u3066\u3044\u307E\u3059"
  };
  if (exact[raw]) return exact[raw];
  if (/^Starting WSL analyzer on /i.test(raw)) return "\u66F2\u69CB\u6210\u306E\u89E3\u6790\u3092\u958B\u59CB\u3057\u3066\u3044\u307E\u3059";
  if (/^Analyzer running for (\d+)s$/i.test(raw)) {
    return `AI\u3067\u66F2\u69CB\u6210\u3092\u89E3\u6790\u4E2D\u3067\u3059\uFF08${raw.match(/(\d+)s$/)?.[1] || 0}\u79D2\u7D4C\u904E\uFF09`;
  }
  if (/^Analyzer still running; no output for (\d+)s$/i.test(raw)) {
    return `AI\u3067\u66F2\u69CB\u6210\u3092\u89E3\u6790\u4E2D\u3067\u3059\uFF08${raw.match(/(\d+)s$/)?.[1] || 0}\u79D2\u7D4C\u904E\uFF09`;
  }
  if (/^Encoding /i.test(raw)) {
    const stem = raw.replace(/^Encoding /i, "").toLowerCase();
    return `${{ vocals: "\u30DC\u30FC\u30AB\u30EB", drums: "\u30C9\u30E9\u30E0", bass: "\u30D9\u30FC\u30B9", other: "\u305D\u306E\u4ED6" }[stem] || stem}\u3092\u5909\u63DB\u3057\u3066\u3044\u307E\u3059`;
  }
  if (/^Uploading /i.test(raw)) return `${raw.replace(/^Uploading /i, "")}\u3092\u30AF\u30E9\u30A6\u30C9\u3078\u9001\u4FE1\u3057\u3066\u3044\u307E\u3059`;
  return raw;
};
var formatJobDuration = (seconds) => {
  if (!Number.isFinite(Number(seconds))) return "\u8A08\u6E2C\u306A\u3057";
  const value = Math.max(0, Number(seconds));
  if (value < 60) return `${value < 10 ? value.toFixed(1) : Math.round(value)}\u79D2`;
  const total = Math.round(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const remainder = total % 60;
  return hours ? `${hours}\u6642\u9593 ${minutes}\u5206 ${remainder}\u79D2` : `${minutes}\u5206 ${remainder}\u79D2`;
};
var jobHistoryTitle = (job, libraryItems = currentSidebarItems) => {
  const labels = {
    analysis: "\u66F2\u69CB\u6210\u306E\u89E3\u6790",
    stems: "\u30D1\u30FC\u30C8\u5206\u96E2",
    "stem-export": "\u30D1\u30FC\u30C8\u66F8\u304D\u51FA\u3057",
    "cloud-sync": "\u7AEF\u672B\u9593\u540C\u671F",
    "score-preview": "\u697D\u8B5C\u30D7\u30EC\u30D3\u30E5\u30FC",
    "score-extract": "\u697D\u8B5C\u62BD\u51FA"
  };
  const operation = labels[job.kind] || localizeJobMessage(job.description) || "\u51E6\u7406";
  const stableId = String(job.source_job_id || job.id || "").split(":history:")[0];
  const sessionId = stableId.replace(/:(?:stems|stem-export|score-preview|score-extract).*$/, "");
  const sourceId = sessionId.split("-clip-")[0];
  const libraryItem = libraryItems.find((item) => item.id === sessionId) || libraryItems.find((item) => item.id === sourceId || item.id.startsWith(`${sourceId}-clip-`));
  const title = job.display_title || libraryItem?.title;
  return title ? `${operation} \xB7 ${title}` : `${operation} \xB7 \u5BFE\u8C61\u60C5\u5831\u306A\u3057`;
};
var renderJobHistory = (jobs, libraryItems = currentSidebarItems) => {
  const completed = jobs.filter((job) => job.done && !job.error && !job.canceled).length;
  const failed = jobs.filter((job) => job.error).length;
  const running = jobs.filter((job) => !job.done).length;
  SELECTORS.jobHistorySummary.innerHTML = `
    <span><b>${jobs.length}</b>\u4EF6</span>
    <span class="success"><b>${completed}</b>\u6210\u529F</span>
    ${failed ? `<span class="error"><b>${failed}</b>\u5931\u6557</span>` : ""}
    ${running ? `<span class="running"><b>${running}</b>\u51E6\u7406\u4E2D</span>` : ""}
  `;
  if (!jobs.length) {
    SELECTORS.jobHistoryList.innerHTML = `<div class="job-history-empty">\u307E\u3060\u51E6\u7406\u5C65\u6B74\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u4ECA\u5F8C\u306E\u51E6\u7406\u306F\u3053\u3053\u3078\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002</div>`;
    return;
  }
  SELECTORS.jobHistoryList.innerHTML = jobs.map((job) => {
    const stateClass = job.canceled ? "canceled" : job.error ? "error" : job.done ? "success" : "running";
    const state = job.canceled ? "\u30AD\u30E3\u30F3\u30BB\u30EB" : job.error ? "\u5931\u6557" : job.done ? "\u6210\u529F" : "\u51E6\u7406\u4E2D";
    const started = job.started_at ? new Date(job.started_at * 1e3).toLocaleString("ja-JP", { dateStyle: "short", timeStyle: "short" }) : "\u65E5\u6642\u4E0D\u660E";
    const duration = job.duration_seconds ?? (job.done && job.started_at && job.updated_at ? job.updated_at - job.started_at : null);
    return `<article class="job-history-item ${stateClass}">
      <div class="job-history-item-main">
        <strong>${escapeHtml(jobHistoryTitle(job, libraryItems))}</strong>
        <span class="job-history-state">${state}</span>
      </div>
      <div class="job-history-meta"><span>${escapeHtml(started)}</span><span class="job-history-duration"><i data-lucide="timer"></i>${escapeHtml(formatJobDuration(duration))}</span></div>
      <p title="${escapeHtml(job.error || localizeJobMessage(job.message))}">${escapeHtml(job.error || localizeJobMessage(job.message))}</p>
    </article>`;
  }).join("");
  lucide.createIcons();
};
var loadJobHistory = async () => {
  if (!hasServer || !SELECTORS.jobHistoryList) return;
  SELECTORS.jobHistoryRefresh.disabled = true;
  try {
    const [response, manifestResponse] = await Promise.all([
      fetch("/jobs/history", { cache: "no-store" }),
      fetch("results/manifest.json", { cache: "no-store" }).catch(() => null)
    ]);
    if (!response.ok) throw new Error(`\u5C65\u6B74\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093 (${response.status})`);
    const libraryItems = manifestResponse?.ok ? await manifestResponse.json().catch(() => currentSidebarItems) : currentSidebarItems;
    renderJobHistory(await response.json(), Array.isArray(libraryItems) ? libraryItems : currentSidebarItems);
  } catch (error) {
    SELECTORS.jobHistoryList.innerHTML = `<div class="job-history-empty error">${escapeHtml(error.message)}</div>`;
  } finally {
    SELECTORS.jobHistoryRefresh.disabled = false;
  }
};
var openJobHistory = () => {
  if (!hasServer) return;
  void openSettings("history");
};
var queueOperationLabel = (kind) => ({
  analysis: "\u66F2\u69CB\u6210\u306E\u89E3\u6790",
  stems: "\u30D1\u30FC\u30C8\u5206\u96E2",
  "stem-export": "\u30D1\u30FC\u30C8\u66F8\u304D\u51FA\u3057",
  "score-preview": "\u697D\u8B5C\u30D7\u30EC\u30D3\u30E5\u30FC",
  "score-extract": "\u697D\u8B5C\u62BD\u51FA",
  "cloud-sync": "\u7AEF\u672B\u9593\u540C\u671F"
})[kind] || "\u51E6\u7406";
var QUEUE_MINIMIZED_KEY = "practice_lab_queue_minimized_v1";
var setQueueMinimized = (minimized, { persist = true } = {}) => {
  if (!SELECTORS.queueDock || !SELECTORS.queueToggle) return;
  SELECTORS.queueDock.classList.toggle("minimized", minimized);
  SELECTORS.queueToggle.setAttribute("aria-expanded", String(!minimized));
  SELECTORS.queueToggle.setAttribute("aria-label", minimized ? "\u51E6\u7406\u4E00\u89A7\u3092\u8868\u793A" : "\u51E6\u7406\u4E00\u89A7\u3092\u6700\u5C0F\u5316");
  SELECTORS.queueToggle.title = minimized ? "\u51E6\u7406\u4E00\u89A7\u3092\u8868\u793A" : "\u51E6\u7406\u4E00\u89A7\u3092\u6700\u5C0F\u5316";
  if (persist) localStorage.setItem(QUEUE_MINIMIZED_KEY, minimized ? "1" : "0");
};
var renderQueueDock = () => {
  if (!SELECTORS.queueDock || !SELECTORS.queueList || !SELECTORS.queueCount) return;
  const jobs = [...trackedJobs.values()].sort((a3, b2) => b2.createdAt - a3.createdAt);
  SELECTORS.queueDock.hidden = jobs.length === 0;
  const interruptedJobs = jobs.filter((item) => item.status?.interrupted && item.status?.resumable);
  if (SELECTORS.queueClearInterrupted) SELECTORS.queueClearInterrupted.hidden = interruptedJobs.length === 0;
  SELECTORS.queueCount.textContent = String(jobs.filter((item) => !item.status?.done || item.status?.resumable).length);
  SELECTORS.queueList.innerHTML = jobs.map((item) => {
    const status = item.status || { stage: "queued", message: "\u30B5\u30FC\u30D0\u30FC\u3092\u5F85\u3063\u3066\u3044\u307E\u3059" };
    const startedAt = status.started_at || item.createdAt / 1e3;
    const elapsed = Math.max(0, Math.floor(Date.now() / 1e3 - startedAt));
    const stageText = status.resumable ? localizeJobStage(status.stage) : `${localizeJobStage(status.stage)} \xB7 ${elapsed}\u79D2`;
    return `
      <div class="queue-item ${queueItemClass(status)}">
        <div class="queue-title" title="${escapeHtml(status.display_title || item.label)}">${escapeHtml(status.display_title ? `${queueOperationLabel(item.kind)} \xB7 ${status.display_title}${item.rangeLabel || ""}` : item.label)}</div>
        <div class="queue-stage">${escapeHtml(stageText)}</div>
        <div class="queue-message">${escapeHtml(status.error || localizeJobMessage(status.message))}</div>
        ${status.resumable ? `<div class="queue-actions"><button class="queue-cancel queue-resume" type="button" data-job-id="${escapeHtml(item.id)}" data-job-action="resume">\u518D\u958B</button><button class="queue-cancel queue-discard" type="button" data-job-id="${escapeHtml(item.id)}" data-job-action="discard" title="\u518D\u958B\u60C5\u5831\u3092\u7834\u68C4\u3057\u3066\u30AD\u30E3\u30F3\u30BB\u30EB">\u30AD\u30E3\u30F3\u30BB\u30EB</button></div>` : item.kind === "stem-export" && status.done && status.result?.downloadUrl ? `<a class="queue-cancel queue-download" href="${escapeHtml(status.result.downloadUrl)}" download="${escapeHtml(status.result.filename || "stem-mix.mp3")}">\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9</a>` : item.kind === "score-extract" && status.done && status.result ? `<button class="queue-cancel queue-view-result" type="button" data-job-id="${escapeHtml(item.id)}" data-job-action="view-score">\u7D50\u679C\u3092\u898B\u308B</button>` : `<button class="queue-cancel" type="button" data-job-id="${escapeHtml(item.id)}" data-job-action="cancel" ${status.done || status.cancel_requested ? "disabled" : ""}>\u30AD\u30E3\u30F3\u30BB\u30EB</button>`}
      </div>
    `;
  }).join("");
};
var stopQueuePollingIfIdle = () => {
  if ([...trackedJobs.values()].some((item) => !item.status?.done)) return;
  if (queuePollTimer) {
    clearInterval(queuePollTimer);
    queuePollTimer = null;
  }
};
var pollTrackedJobs = async () => {
  const now = Date.now();
  for (const [jobId, item] of trackedJobs.entries()) {
    if (item.status?.done) {
      if (!item.retainDone && (item.doneAt || now) + 9e3 < now) trackedJobs.delete(jobId);
      continue;
    }
    try {
      const status = await fetchJobStatus(jobId);
      item.status = status;
      if (status.done) {
        item.doneAt = now;
        if (status.canceled) {
        } else if (status.error) item.onError?.(new Error(status.error));
        else item.onDone?.(status.result);
      }
    } catch (error) {
      item.status = { stage: "error", message: error.message, done: true, error: error.message };
      item.doneAt = now;
      item.onError?.(error);
    }
  }
  renderQueueDock();
  stopQueuePollingIfIdle();
};
var trackQueuedJob = (jobId, options = {}) => {
  if (!jobId) return;
  trackedJobs.set(jobId, {
    id: jobId,
    label: options.label || jobId,
    onDone: options.onDone,
    onError: options.onError,
    kind: options.kind,
    rangeLabel: options.rangeLabel || "",
    retainDone: Boolean(options.retainDone),
    createdAt: Date.now(),
    status: { stage: "queued", message: "\u51E6\u7406\u4E00\u89A7\u306B\u8FFD\u52A0\u3057\u307E\u3057\u305F", done: false }
  });
  renderQueueDock();
  if (!queuePollTimer) queuePollTimer = setInterval(pollTrackedJobs, 1e3);
  pollTrackedJobs();
};
var cancelQueuedJob = async (jobId) => {
  if (!jobId || !trackedJobs.has(jobId)) return;
  const item = trackedJobs.get(jobId);
  item.status = { ...item.status || {}, stage: "canceling", message: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3092\u8981\u6C42\u3057\u307E\u3057\u305F", cancel_requested: true, done: false };
  renderQueueDock();
  try {
    const response = await fetch(`/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" });
    const status = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(status.detail || "\u30AD\u30E3\u30F3\u30BB\u30EB\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
    item.status = status;
    if (status.done) item.doneAt = Date.now();
  } catch (error) {
    item.status = { stage: "error", message: error.message, done: true, error: error.message };
    item.doneAt = Date.now();
  }
  renderQueueDock();
  if (!queuePollTimer) queuePollTimer = setInterval(pollTrackedJobs, 1e3);
};
var resumeQueuedJob = async (jobId) => {
  const item = trackedJobs.get(jobId);
  if (!item) return;
  try {
    const response = await fetch(`/jobs/${encodeURIComponent(jobId)}/resume`, { method: "POST" });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || "\u30B8\u30E7\u30D6\u3092\u518D\u958B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    item.status = { stage: submitted.stage, message: submitted.message, done: false, resumable: false };
    item.doneAt = null;
    item.retainDone = true;
    renderQueueDock();
    if (!queuePollTimer) queuePollTimer = setInterval(pollTrackedJobs, 1e3);
    pollTrackedJobs();
  } catch (error) {
    item.status = { ...item.status || {}, error: error.message };
    renderQueueDock();
  }
};
var discardInterruptedJob = async (jobId) => {
  const response = await fetch(`/jobs/${encodeURIComponent(jobId)}/cancel-interrupted`, { method: "DELETE" });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 404 || response.status === 405) {
    throw new Error("\u3053\u306E\u30A2\u30D7\u30EA\u306F\u30AD\u30E3\u30F3\u30BB\u30EB\u51E6\u7406\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002\u30D0\u30C3\u30AF\u30A8\u30F3\u30C9\u3092\u542B\u3080\u4FEE\u6B63\u7248\u3078\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044");
  }
  if (!response.ok) throw new Error(payload.detail || "\u518D\u958B\u5F85\u3061\u306E\u51E6\u7406\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
  trackedJobs.delete(jobId);
  renderQueueDock();
};
var discardAllInterruptedJobs = async () => {
  const ids = [...trackedJobs.values()].filter((item) => item.status?.interrupted && item.status?.resumable).map((item) => item.id);
  SELECTORS.queueClearInterrupted.disabled = true;
  try {
    await Promise.all(ids.map(discardInterruptedJob));
  } catch (error) {
    await showAlert(error.message, { title: "\u51E6\u7406\u4E00\u89A7" });
  } finally {
    SELECTORS.queueClearInterrupted.disabled = false;
  }
};
var restoredJobLabel = (status) => {
  const operation = queueOperationLabel(status.kind);
  const stableId = String(status.source_job_id || status.id || "").split(":history:")[0];
  const sessionId = stableId.replace(/:(?:stems|stem-export|score-preview|score-extract).*$/, "");
  const libraryTitle = currentSidebarItems.find((item) => item.id === sessionId)?.title;
  const title = status.display_title || libraryTitle;
  return title ? `${operation} \xB7 ${title}` : `${operation} \xB7 \u5BFE\u8C61\u60C5\u5831\u306A\u3057`;
};
var restoreInterruptedJobs = async () => {
  if (!hasServer || staticLibraryMode) return;
  try {
    const response = await fetch("/jobs?recoverable=true", { cache: "no-store" });
    if (!response.ok) return;
    const jobs = await response.json();
    for (const status of jobs) {
      trackedJobs.set(status.id, {
        id: status.id,
        label: restoredJobLabel(status),
        kind: status.kind,
        retainDone: true,
        createdAt: Date.now(),
        status
      });
    }
    renderQueueDock();
  } catch {
  }
};
var SETTINGS_SECTION_TITLES = {
  general: "\u4E00\u822C\u8A2D\u5B9A",
  analysis: "\u89E3\u6790\u74B0\u5883",
  features: "\u8FFD\u52A0\u6A5F\u80FD",
  cloud: "\u30AF\u30E9\u30A6\u30C9\u9023\u643A",
  storage: "\u30B9\u30C8\u30EC\u30FC\u30B8",
  history: "\u51E6\u7406\u5C65\u6B74",
  updates: "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8",
  about: "\u3053\u306E\u30A2\u30D7\u30EA\u306B\u3064\u3044\u3066"
};
var selectSettingsSection = (section) => {
  const selected = SETTINGS_SECTION_TITLES[section] ? section : "general";
  document.querySelectorAll("[data-settings-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.settingsSection === selected);
  });
  document.querySelectorAll("[data-settings-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.settingsPanel === selected);
  });
  SELECTORS.settingsTitle.textContent = SETTINGS_SECTION_TITLES[selected];
  const editable = selected === "general" || selected === "cloud" || selected === "analysis" && desktopSettings?.platform === "win32";
  SELECTORS.settingsSave.hidden = !editable;
  SELECTORS.settingsCancel.textContent = editable ? "\u30AD\u30E3\u30F3\u30BB\u30EB" : "\u9589\u3058\u308B";
  SELECTORS.settingsSaveStatus.textContent = "";
};
var syncCloudFieldsState = () => {
  SELECTORS.settingsCloudFields?.classList.toggle("disabled", !SELECTORS.settingsCloudEnabled?.checked);
};
var renderCloudStatus = (status) => {
  cloudStatus = status || { configured: false };
  if (!SELECTORS.btnCloudSync || staticLibraryMode) return;
  if (cloudStatus.configured) {
    SELECTORS.btnCloudSync.innerHTML = `<span class="topbar-sync-content"><i data-lucide="refresh-cw"></i><span>\u7AEF\u672B\u9593\u540C\u671F</span></span>`;
    SELECTORS.btnCloudSync.title = cloudStatus.bucket ? `${cloudStatus.bucket}\u3092\u4ECB\u3057\u3066\u7AEF\u672B\u9593\u540C\u671F` : "\u81EA\u5206\u306ER2\u3092\u4ECB\u3057\u3066\u7AEF\u672B\u9593\u540C\u671F";
  } else {
    SELECTORS.btnCloudSync.innerHTML = `<span class="topbar-sync-content"><i data-lucide="cloud"></i><span>\u30AF\u30E9\u30A6\u30C9\u9023\u643A</span></span>`;
    SELECTORS.btnCloudSync.title = "\u81EA\u5206\u306ECloudflare R2\u3092\u9023\u643A";
  }
  lucide.createIcons();
};
var refreshCloudStatus = async () => {
  if (!hasServer || staticLibraryMode) return;
  try {
    const response = await fetch("/cloud/status", { cache: "no-store" });
    if (response.ok) renderCloudStatus(await response.json());
  } catch {
  }
};
var refreshSettingsAnalysisStatus = async () => {
  if (!SELECTORS.settingsAnalysisStatus) return;
  SELECTORS.settingsAnalysisStatus.className = "settings-status-card";
  SELECTORS.settingsAnalysisStatus.innerHTML = `<span class="spin"></span>\u89E3\u6790\u74B0\u5883\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059`;
  try {
    const response = await fetch("/system/status", { cache: "no-store" });
    const status = await response.json();
    if (!response.ok) throw new Error("\u89E3\u6790\u74B0\u5883\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    SELECTORS.settingsAnalysisStatus.className = `settings-status-card${status.ready ? " ok" : ""}`;
    if (status.ready && status.analysisMode === "nvidia") {
      SELECTORS.settingsAnalysisStatus.textContent = `${status.nvidia?.name || "NVIDIA GPU"} \xB7 WSL2 CUDA \xB7 \u89E3\u6790\u30E9\u30A4\u30D6\u30E9\u30EA\u78BA\u8A8D\u6E08\u307F`;
    } else if (status.ready) {
      SELECTORS.settingsAnalysisStatus.textContent = `${status.analysisLabel || "CPU"} \xB7 \u89E3\u6790\u30E9\u30A4\u30D6\u30E9\u30EA\u78BA\u8A8D\u6E08\u307F`;
    } else {
      SELECTORS.settingsAnalysisStatus.textContent = status.message || "\u9078\u629E\u3057\u305F\u89E3\u6790\u74B0\u5883\u306E\u6E96\u5099\u304C\u5FC5\u8981\u3067\u3059";
    }
    SELECTORS.settingsCpuSetup.hidden = !status.cpuSetupSupported || status.ready;
    SELECTORS.settingsNvidiaSetup.hidden = !status.setupSupported;
  } catch (error) {
    SELECTORS.settingsAnalysisStatus.textContent = error.message;
    SELECTORS.settingsCpuSetup.hidden = true;
    SELECTORS.settingsNvidiaSetup.hidden = true;
  }
};
var renderOptionalFeatures = (features) => {
  const cpu = features?.["windows-cpu"] || {};
  const macAnalysis = features?.["mac-analysis"] || {};
  const analysis = cpu.available ? cpu : macAnalysis;
  const analysisKey = cpu.available ? "windows-cpu" : "mac-analysis";
  const score = features?.score || {};
  SELECTORS.settingsFeatureCpu.hidden = !analysis.available;
  SELECTORS.settingsFeatureCpu.dataset.featureKey = analysisKey;
  SELECTORS.settingsFeatureCpuStatus.textContent = analysis.installed ? `\u8FFD\u52A0\u6E08\u307F${analysis.bytes ? ` \xB7 ${formatBytes(analysis.bytes)}` : ""}` : "\u672A\u8FFD\u52A0 \xB7 \u66F2\u69CB\u6210\u89E3\u6790\u3068\u30D1\u30FC\u30C8\u5206\u96E2\u3092\u4F7F\u3046\u5834\u5408\u306B\u5FC5\u8981\u3067\u3059";
  SELECTORS.settingsFeatureCpuInstall.hidden = !!analysis.installed;
  SELECTORS.settingsFeatureCpuRemove.hidden = !analysis.installed;
  SELECTORS.settingsFeatureScore.hidden = !score.available;
  SELECTORS.settingsFeatureScoreStatus.textContent = score.installed ? `\u8FFD\u52A0\u6E08\u307F${score.bytes ? ` \xB7 ${formatBytes(score.bytes)}` : ""}` : "\u672A\u8FFD\u52A0 \xB7 \u57FA\u672C\u30A2\u30D7\u30EA\u306E\u5BB9\u91CF\u306B\u306F\u542B\u307E\u308C\u307E\u305B\u3093";
  SELECTORS.settingsFeatureScoreInstall.hidden = !!score.installed;
  SELECTORS.settingsFeatureScoreRemove.hidden = !score.installed;
  setScoreFeatureVisible(!!score.installed);
};
var loadOptionalFeatures = async () => {
  if (!hasServer || staticLibraryMode) return;
  try {
    const response = await fetch("/features", { cache: "no-store" });
    const features = await response.json();
    if (!response.ok) throw new Error(features.detail || "\u8FFD\u52A0\u6A5F\u80FD\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    renderOptionalFeatures(features);
  } catch (error) {
    SELECTORS.settingsFeatureScoreStatus.textContent = error.message;
  }
};
var startScoreFeatureSetup = async () => {
  SELECTORS.settingsFeatureScoreInstall.disabled = true;
  try {
    const response = await fetch("/features/score/install", { method: "POST" });
    const submitted = await response.json();
    if (!response.ok) throw new Error(submitted.detail || "\u697D\u8B5C\u62BD\u51FA\u6A5F\u80FD\u3092\u8FFD\u52A0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    trackQueuedJob(submitted.jobId, {
      label: "\u697D\u8B5C\u62BD\u51FA\u6A5F\u80FD\u3092\u8FFD\u52A0",
      retainDone: true,
      onDone: loadOptionalFeatures
    });
    SELECTORS.settingsFeatureScoreStatus.textContent = "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3092\u958B\u59CB\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u4E00\u89A7\u3067\u9032\u884C\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002";
  } catch (error) {
    await showAlert(error.message, { title: "\u697D\u8B5C\u62BD\u51FA\u6A5F\u80FD" });
  } finally {
    SELECTORS.settingsFeatureScoreInstall.disabled = false;
  }
};
var removeOptionalFeature = async (feature) => {
  const label = feature === "score" ? "\u697D\u8B5C\u62BD\u51FA\u6A5F\u80FD" : "\u89E3\u6790\u6A5F\u80FD";
  if (!await showConfirm(`${label}\u3092\u3053\u306EPC\u304B\u3089\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u4FDD\u5B58\u6E08\u307F\u306E\u66F2\u3084\u6210\u679C\u7269\u306F\u524A\u9664\u3055\u308C\u307E\u305B\u3093\u3002`, {
    title: `${label}\u3092\u524A\u9664`,
    confirmLabel: "\u524A\u9664\u3059\u308B",
    danger: true
  })) return;
  const response = await fetch(`/features/${feature}`, { method: "DELETE" });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    await showAlert(result.detail || `${label}\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F`, { title: label });
    return;
  }
  await loadOptionalFeatures();
  await refreshSettingsAnalysisStatus();
};
var openSettings = async (section = "general") => {
  const desktop = window.practiceLabDesktop;
  if (!desktop?.getSettings) {
    await showAlert("\u8A2D\u5B9A\u306F\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u30A2\u30D7\u30EA\u3067\u5229\u7528\u3067\u304D\u307E\u3059\u3002", { title: "\u8A2D\u5B9A" });
    return;
  }
  desktopSettings = await desktop.getSettings();
  const cloud = desktopSettings.cloud || {};
  const isWindows = desktopSettings.platform === "win32";
  SELECTORS.settingsAnalysisModes.hidden = !isWindows;
  SELECTORS.settingsAnalysisCpu.checked = desktopSettings.analysisMode !== "nvidia";
  SELECTORS.settingsAnalysisNvidia.checked = desktopSettings.analysisMode === "nvidia";
  SELECTORS.settingsCpuSetup.hidden = true;
  SELECTORS.settingsNvidiaSetup.hidden = true;
  SELECTORS.settingsAutoUpdate.checked = desktopSettings.autoUpdate !== false;
  const manualUpdates = desktopSettings.updateMode === "manual";
  SELECTORS.settingsAutoUpdate.disabled = manualUpdates;
  if (manualUpdates) SELECTORS.settingsAutoUpdate.checked = false;
  if (SELECTORS.settingsAutoUpdateDescription) {
    SELECTORS.settingsAutoUpdateDescription.textContent = manualUpdates ? "\u672A\u7F72\u540D\u306EMac\u7248\u306F\u3001GitHub\u306E\u914D\u5E03\u30DA\u30FC\u30B8\u304B\u3089\u624B\u52D5\u3067\u66F4\u65B0\u3057\u307E\u3059\u3002" : "\u8D77\u52D5\u6642\u306B\u65B0\u3057\u3044\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002";
  }
  if (SELECTORS.settingsCheckUpdateLabel) {
    SELECTORS.settingsCheckUpdateLabel.textContent = manualUpdates ? "\u6700\u65B0\u7248\u306E\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u958B\u304F" : "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u78BA\u8A8D";
  }
  if (SELECTORS.settingsUpdateStatus) {
    SELECTORS.settingsUpdateStatus.hidden = !manualUpdates;
    SELECTORS.settingsUpdateStatus.className = "settings-update-status";
    SELECTORS.settingsUpdateStatus.textContent = manualUpdates ? "Mac\u7248\u306F\u624B\u52D5\u66F4\u65B0\u3067\u3059\u3002\u30DC\u30BF\u30F3\u304B\u3089\u6700\u65B0\u7248\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002" : "";
  }
  SELECTORS.settingsDataPath.textContent = desktopSettings.dataPath || "";
  SELECTORS.settingsVersion.textContent = `PracticeLab ${desktopSettings.version || ""}`;
  SELECTORS.settingsCloudEnabled.checked = !!cloud.enabled;
  SELECTORS.settingsCloudAccount.value = cloud.accountId || "";
  SELECTORS.settingsCloudBucket.value = cloud.bucket || "";
  SELECTORS.settingsCloudAccessKey.value = cloud.accessKeyId || "";
  SELECTORS.settingsCloudSecret.value = "";
  SELECTORS.settingsCloudSecret.placeholder = cloud.hasSecret ? "\u4FDD\u5B58\u6E08\u307F\uFF08\u5909\u66F4\u3059\u308B\u5834\u5408\u3060\u3051\u5165\u529B\uFF09" : "\u30B7\u30FC\u30AF\u30EC\u30C3\u30C8\u30A2\u30AF\u30BB\u30B9\u30AD\u30FC";
  SELECTORS.settingsCloudPublicUrl.value = cloud.publicBaseUrl || "";
  SELECTORS.settingsCloudPrefix.value = cloud.prefix || "sessions";
  SELECTORS.settingsCloudEndpoint.value = cloud.endpointUrl || "";
  SELECTORS.settingsCloudState.className = `settings-cloud-state${cloudStatus.configured ? " ok" : ""}`;
  SELECTORS.settingsCloudState.textContent = cloudStatus.configured ? `${cloudStatus.bucket || "R2"}\u3068\u9023\u643A\u6E08\u307F${cloudStatus.viewerUrl ? ` \xB7 ${cloudStatus.viewerUrl}` : ""}` : "\u672A\u9023\u643A\u3067\u3059\u3002\u8A2D\u5B9A\u306F\u5229\u7528\u8005\u3054\u3068\u306B\u3053\u306EPC\u3078\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002";
  SELECTORS.settingsCloudExport.disabled = !cloud.enabled || !cloud.hasSecret;
  SELECTORS.settingsCloudExport.title = cloud.enabled && cloud.hasSecret ? "\u4FDD\u5B58\u6E08\u307F\u306E\u30AF\u30E9\u30A6\u30C9\u9023\u643A\u8A2D\u5B9A\u3092\u66F8\u304D\u51FA\u3059" : "\u5148\u306B\u30AF\u30E9\u30A6\u30C9\u9023\u643A\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044";
  SELECTORS.settingsSaveStatus.textContent = "";
  syncCloudFieldsState();
  selectSettingsSection(section);
  SELECTORS.settingsDialog.showModal();
  lucide.createIcons();
  if (section === "analysis") void refreshSettingsAnalysisStatus();
  if (section === "features") void loadOptionalFeatures();
  if (section === "storage") void loadStorageReport();
  if (section === "history") void loadJobHistory();
};
var closeSettings = () => SELECTORS.settingsDialog?.close();
var saveSettings = async () => {
  const desktop = window.practiceLabDesktop;
  if (!desktop?.saveSettings) return;
  const enabled = SELECTORS.settingsCloudEnabled.checked;
  if (enabled && !SELECTORS.settingsCloudSecret.value && !desktopSettings?.cloud?.hasSecret) {
    SELECTORS.settingsSaveStatus.textContent = "\u30B7\u30FC\u30AF\u30EC\u30C3\u30C8\u30A2\u30AF\u30BB\u30B9\u30AD\u30FC\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
    return;
  }
  SELECTORS.settingsSave.disabled = true;
  SELECTORS.settingsSaveStatus.textContent = "\u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u3066\u3044\u307E\u3059...";
  try {
    localStorage.setItem("practice_lab_settings_saved", enabled ? "test-cloud" : "saved");
    await desktop.saveSettings({
      activateCloud: document.querySelector("[data-settings-section].active")?.dataset.settingsSection === "cloud",
      autoUpdate: SELECTORS.settingsAutoUpdate.checked,
      analysisMode: SELECTORS.settingsAnalysisNvidia?.checked ? "nvidia" : "cpu",
      cloud: {
        enabled,
        accountId: SELECTORS.settingsCloudAccount.value,
        bucket: SELECTORS.settingsCloudBucket.value,
        accessKeyId: SELECTORS.settingsCloudAccessKey.value,
        secretAccessKey: SELECTORS.settingsCloudSecret.value,
        publicBaseUrl: SELECTORS.settingsCloudPublicUrl.value,
        prefix: SELECTORS.settingsCloudPrefix.value,
        endpointUrl: SELECTORS.settingsCloudEndpoint.value
      }
    });
    SELECTORS.settingsSaveStatus.textContent = "\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002\u8A2D\u5B9A\u3092\u53CD\u6620\u3057\u307E\u3059...";
    setTimeout(closeSettings, 150);
  } catch (error) {
    SELECTORS.settingsSaveStatus.textContent = error.message;
    localStorage.removeItem("practice_lab_settings_saved");
  } finally {
    SELECTORS.settingsSave.disabled = false;
  }
};
var exportCloudConnection = async () => {
  const desktop = window.practiceLabDesktop;
  if (!desktop?.exportCloudConnection) return;
  SELECTORS.settingsCloudExport.disabled = true;
  SELECTORS.settingsSaveStatus.textContent = "\u6697\u53F7\u5316\u63A5\u7D9A\u30D5\u30A1\u30A4\u30EB\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059...";
  try {
    const exported = await desktop.exportCloudConnection();
    if (exported.canceled) {
      SELECTORS.settingsSaveStatus.textContent = "";
      return;
    }
    SELECTORS.settingsSaveStatus.textContent = `${exported.fileName}\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002`;
    await showReveal(
      `\u3053\u306E\u5FA9\u53F7\u30B3\u30FC\u30C9\u3092Mac\u3067\u5165\u529B\u3057\u307E\u3059\u3002\u63A5\u7D9A\u30D5\u30A1\u30A4\u30EB\u3068\u306F\u5225\u306E\u65B9\u6CD5\u3067\u6E21\u3057\u3001\u8AAD\u307F\u8FBC\u307F\u5F8C\u306F\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002`,
      exported.code,
      { title: "\u63A5\u7D9A\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F", confirmLabel: "\u9589\u3058\u308B" }
    );
  } catch (error) {
    SELECTORS.settingsSaveStatus.textContent = error.message;
  } finally {
    SELECTORS.settingsCloudExport.disabled = !desktopSettings?.cloud?.enabled || !desktopSettings?.cloud?.hasSecret;
  }
};
var importCloudConnection = async () => {
  const desktop = window.practiceLabDesktop;
  if (!desktop?.chooseCloudConnection || !desktop?.importCloudConnection) return;
  SELECTORS.settingsCloudImport.disabled = true;
  SELECTORS.settingsSaveStatus.textContent = "";
  try {
    const selected = await desktop.chooseCloudConnection();
    if (selected.canceled) return;
    const code = await showPrompt(
      `${selected.fileName}\u306E\u66F8\u304D\u51FA\u3057\u5143\u306B\u8868\u793A\u3055\u308C\u305F\u5FA9\u53F7\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`,
      "",
      { title: "\u63A5\u7D9A\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3080", confirmLabel: "\u8AAD\u307F\u8FBC\u3080", inputType: "password" }
    );
    if (code === null) return;
    SELECTORS.settingsSaveStatus.textContent = "\u63A5\u7D9A\u60C5\u5831\u3092\u5FA9\u53F7\u3057\u3066\u4FDD\u5B58\u3057\u3066\u3044\u307E\u3059...";
    localStorage.setItem("practice_lab_settings_saved", "test-cloud");
    desktopSettings = await desktop.importCloudConnection({ selectionId: selected.selectionId, code });
    SELECTORS.settingsSaveStatus.textContent = "\u63A5\u7D9A\u60C5\u5831\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002\u8A2D\u5B9A\u3092\u53CD\u6620\u3057\u307E\u3059...";
    setTimeout(closeSettings, 150);
  } catch (error) {
    localStorage.removeItem("practice_lab_settings_saved");
    SELECTORS.settingsSaveStatus.textContent = error.message;
  } finally {
    SELECTORS.settingsCloudImport.disabled = false;
  }
};
var verifySavedCloudSettings = async () => {
  const action = localStorage.getItem("practice_lab_settings_saved");
  if (!action) return;
  localStorage.removeItem("practice_lab_settings_saved");
  if (action !== "test-cloud") return;
  try {
    const response = await fetch("/cloud/test", { method: "POST" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.detail || "R2\u3078\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    await refreshCloudStatus();
    await showAlert(`${payload.bucket}\u3078\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002`, { title: "\u30AF\u30E9\u30A6\u30C9\u9023\u643A\u5B8C\u4E86" });
  } catch (error) {
    await showAlert(`${error.message}
\u8A2D\u5B9A\u753B\u9762\u304B\u3089\u5165\u529B\u5185\u5BB9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002`, { title: "\u30AF\u30E9\u30A6\u30C9\u3078\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  }
};
var syncCloudLibrary = async () => {
  if (!hasServer || staticLibraryMode) return;
  if (window.practiceLabDesktop?.prepareCloud) {
    try {
      await window.practiceLabDesktop.prepareCloud();
      await refreshCloudStatus();
    } catch (error) {
      await showAlert(error.message, { title: "\u30AF\u30E9\u30A6\u30C9\u9023\u643A\u3092\u6709\u52B9\u306B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
      return;
    }
  }
  if (!cloudStatus.configured) {
    await openSettings("cloud");
    return;
  }
  const destination = cloudStatus.bucket ? `\u300C${cloudStatus.bucket}\u300D` : "\u81EA\u5206\u306ER2";
  const approved = await showConfirm(
    `\u3053\u306E\u7AEF\u672B\u3068${destination}\u306E\u66F2\u30FB\u89E3\u6790\u7D50\u679C\u30FB\u97F3\u58F0\u30FB\u52D5\u753B\u30FB\u30D1\u30FC\u30C8\u97F3\u58F0\u30FB\u30D5\u30A9\u30EB\u30C0\u30FC\u3092\u53CC\u65B9\u5411\u306B\u540C\u671F\u3057\u307E\u3059\u3002\u5225\u7AEF\u672B\u3067\u660E\u793A\u7684\u306B\u524A\u9664\u3057\u305F\u66F2\u306F\u3001\u3053\u306E\u7AEF\u672B\u304B\u3089\u3082\u524A\u9664\u3055\u308C\u307E\u3059\u3002\u7D9A\u3051\u307E\u3059\u304B\uFF1F`,
    { title: "\u7AEF\u672B\u9593\u540C\u671F", confirmLabel: "\u540C\u671F\u3059\u308B" }
  );
  if (!approved) return;
  SELECTORS.btnCloudSync.disabled = true;
  try {
    const response = await fetch("/cloud/sync", {
      method: "POST"
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F (${response.status})`);
    trackQueuedJob(submitted.jobId, {
      label: "\u7AEF\u672B\u9593\u540C\u671F",
      onDone: async (result) => {
        await loadHistory();
        const deletedSessionIds = Array.isArray(result?.deletedSessionIds) ? result.deletedSessionIds : [];
        const currentSessionWasDeleted = currentId && deletedSessionIds.includes(currentId);
        const conflicts = Array.isArray(result?.conflicts) ? result.conflicts.length : 0;
        const summary = [
          `\u9001\u4FE1 ${Number(result?.uploaded || 0)}\u4EF6`,
          `\u53D7\u4FE1 ${Number(result?.downloaded || 0)}\u66F2`,
          `\u524A\u9664\u53CD\u6620 ${Number(result?.deleted || 0)}\u66F2`,
          `\u63A5\u7D9A\u7AEF\u672B ${Number(result?.deviceCount || 1)}\u53F0`
        ];
        if (conflicts) summary.push(`\u7AF6\u5408 ${conflicts}\u4EF6\uFF08\u65B0\u3057\u3044\u5909\u66F4\u3092\u63A1\u7528\uFF09`);
        await showAlert(summary.join(" \xB7 "), { title: "\u7AEF\u672B\u9593\u540C\u671F\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F" });
        if (currentSessionWasDeleted) window.location.reload();
      }
    });
  } catch (error) {
    await showAlert(error.message, { title: "\u30AF\u30E9\u30A6\u30C9\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F" });
  } finally {
    SELECTORS.btnCloudSync.disabled = false;
  }
};
var waitForJobResult = async (jobId) => {
  if (!jobId) throw new Error("\u30B8\u30E7\u30D6ID\u304C\u3042\u308A\u307E\u305B\u3093");
  currentJobId = jobId;
  currentJobStartedAt = Date.now() / 1e3;
  stopJobPolling();
  while (true) {
    const job = await fetchJobStatus(jobId);
    renderJobStatus(job);
    if (job.done) {
      if (job.canceled) throw new Error("\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F");
      if (job.error) throw new Error(job.error);
      return job.result;
    }
    await sleep(1e3);
  }
};
var updatePlayingRow = (time) => {
  if (!currentData) return;
  let index = -1;
  for (let i3 = 0; i3 < currentData.sections.length; i3 += 1) {
    const section = currentData.sections[i3];
    if (time >= section.start_time && time < section.end_time) {
      index = i3;
      break;
    }
  }
  if (index === playingIdx) return;
  playingIdx = index;
  document.querySelectorAll(".sec-row").forEach((row, rowIndex) => {
    row.classList.toggle("playing", rowIndex === index);
  });
};
var ensureWaveformSelectionEl = () => {
  if (waveformSelectionEl?.isConnected) return waveformSelectionEl;
  waveformSelectionEl = document.createElement("div");
  waveformSelectionEl.className = "loop-selection";
  waveformSelectionEl.hidden = true;
  for (const side of ["start", "end"]) {
    const handle = document.createElement("span");
    handle.className = `loop-selection-handle ${side}`;
    handle.dataset.loopHandle = side;
    handle.title = side === "start" ? "\u30EB\u30FC\u30D7\u958B\u59CB\u4F4D\u7F6E\u3092\u8ABF\u6574" : "\u30EB\u30FC\u30D7\u7D42\u4E86\u4F4D\u7F6E\u3092\u8ABF\u6574";
    waveformSelectionEl.appendChild(handle);
  }
  SELECTORS.waveform.appendChild(waveformSelectionEl);
  return waveformSelectionEl;
};
var clearSectionSelectionRanges = () => {
  waveformSectionSelectionEls.forEach((element) => element.remove());
  waveformSectionSelectionEls = [];
};
var clearFourBarGrid = () => {
  waveformBarGridEls.forEach((element) => element.remove());
  waveformBarGridEls = [];
};
var renderFourBarGrid = () => {
  clearFourBarGrid();
  if (!SELECTORS.waveform || !currentData?.sections?.length) return;
  const duration = ws?.getDuration() ?? currentData.duration ?? 0;
  if (!(duration > 0)) return;
  for (const section of currentData.sections) {
    const start = Math.max(0, Math.min(duration, section.start_time));
    const end = Math.max(start, Math.min(duration, section.end_time));
    const { count: barCount } = adjustBarRange(section.start_bar, section.end_bar);
    if (!(end > start) || barCount < 1) continue;
    for (let barOffset = 0; barOffset < barCount; barOffset += 4) {
      const time = start + (end - start) * barOffset / barCount;
      const element = document.createElement("span");
      element.className = "four-bar-grid-line";
      element.style.left = `${time / duration * 100}%`;
      SELECTORS.waveform.appendChild(element);
      waveformBarGridEls.push(element);
    }
  }
};
var renderSectionSelectionRanges = () => {
  clearSectionSelectionRanges();
  if (!SELECTORS.waveform || loopOn || customLoopRange || !selectedIdxs.size || !currentData?.sections?.length) return;
  const duration = ws?.getDuration() ?? currentData.duration ?? 0;
  if (!(duration > 0)) return;
  [...selectedIdxs].sort((left, right) => left - right).forEach((index) => {
    const section = currentData.sections[index];
    if (!section) return;
    const start = Math.max(0, Math.min(duration, section.start_time));
    const end = Math.max(start, Math.min(duration, section.end_time));
    if (end - start < 0.05) return;
    const element = document.createElement("div");
    element.className = "section-selection preview";
    element.style.left = `${start / duration * 100}%`;
    element.style.width = `${Math.max(0.2, (end - start) / duration * 100)}%`;
    SELECTORS.waveform.appendChild(element);
    waveformSectionSelectionEls.push(element);
  });
};
var renderCustomLoopRange = (previewRange) => {
  const selection = ensureWaveformSelectionEl();
  const duration = ws?.getDuration() ?? currentData?.duration ?? 0;
  const range = previewRange ?? (loopOn ? getLoopRange() : customLoopRange);
  if (!(duration > 0) || !range || range.end - range.start < 0.05) {
    selection.hidden = true;
    selection.style.left = "0%";
    selection.style.width = "0%";
    return;
  }
  const start = Math.max(0, Math.min(duration, range.start));
  const end = Math.max(start, Math.min(duration, range.end));
  selection.hidden = false;
  selection.style.left = `${start / duration * 100}%`;
  selection.style.width = `${Math.max(0.2, (end - start) / duration * 100)}%`;
};
var getWaveformTimeFromClientX = (clientX) => {
  if (!ws) return 0;
  const rect = SELECTORS.waveform.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return (ws.getDuration() || 0) * ratio;
};
var getMovedLoopRange = (drag, clientX) => {
  const duration = ws?.getDuration() ?? 0;
  const delta = getWaveformTimeFromClientX(clientX) - drag.startTime;
  return moveCustomLoopRange({ start: drag.rangeStart, end: drag.rangeEnd }, delta, duration);
};
var clearCustomLoopRange = ({ clearSelection = false } = {}) => {
  customLoopRange = null;
  if (clearSelection) selectedIdxs.clear();
  renderCustomLoopRange();
  updateSelectionUI();
};
var applySectionLoopRange = (indexes) => {
  if (!currentData || !indexes.length) return;
  const sorted = [...indexes].sort((left, right) => left - right);
  const startIndex = sorted[0];
  const endIndex = sorted.at(-1);
  const startSection = currentData.sections[startIndex];
  const endSection = currentData.sections[endIndex];
  if (!startSection || !endSection) return;
  selectedIdxs = new Set(sorted);
  customLoopRange = {
    start: startSection.start_time,
    end: endSection.end_time,
    kind: "custom",
    labels: sorted.map((sectionIndex) => currentData.sections[sectionIndex].label)
  };
  renderCustomLoopRange();
  updateSelectionUI();
};
var applyCustomLoopRange = (start, end) => {
  const duration = ws?.getDuration() ?? 0;
  const range = clampCustomLoopRange(start, end, duration);
  if (!range) {
    clearCustomLoopRange();
    return;
  }
  selectedIdxs = /* @__PURE__ */ new Set();
  customLoopRange = range;
  renderCustomLoopRange();
  updateSelectionUI();
  playFromTime(range.start);
};
var renderStemPanel = (assets) => {
  const available = hasStemAssets(assets);
  SELECTORS.stemPanel.classList.toggle("missing", !available);
  SELECTORS.btnGenerateStems.textContent = available ? "\u518D\u751F\u6210" : "\u751F\u6210";
  SELECTORS.btnGenerateStems.hidden = !hasServer || staticLibraryMode;
  SELECTORS.btnGenerateStems.disabled = !currentId || !hasServer;
  SELECTORS.stemExportActions.hidden = !available || !hasServer;
  SELECTORS.stemExportClick.disabled = !currentData?.beats?.length;
  if (SELECTORS.stemExportClick.disabled) SELECTORS.stemExportClick.checked = false;
  SELECTORS.btnExportStemMix.disabled = !available || stemExportInProgress;
  SELECTORS.stemStatus.className = available ? "stem-status ok" : "stem-status";
  SELECTORS.stemStatus.textContent = available ? isMobileViewport() && !mobileStemMixActivated ? "\u8EFD\u91CF\u518D\u751F \xB7 \u5143\u97F3\u6E90\u3092\u4F7F\u7528\uFF08\u30D1\u30FC\u30C8\u64CD\u4F5C\u3067\u5207\u66FF\uFF09" : "\u30D1\u30FC\u30C8\u518D\u751F \xB7 \u81EA\u52D5\u540C\u671F" : hasServer ? "\u30D1\u30FC\u30C8\u751F\u6210\u307E\u3067\u306F\u5143\u97F3\u6E90\u3092\u518D\u751F\u3057\u307E\u3059" : "\u5143\u97F3\u6E90";
  applyStemMix();
  updateStemPlaybackStatus();
  document.getElementById("stem-recovery-actions").hidden = !available || document.getElementById("stem-recovery-actions").hidden;
  updateStemExportScopeAvailability();
};
var initVideoPlayer = (videoUrl) => {
  const video = SELECTORS.videoPlayer;
  video.pause();
  if (videoClickTimer) {
    clearTimeout(videoClickTimer);
    videoClickTimer = 0;
  }
  video.onclick = handleVideoClick;
  video.ondblclick = (event) => event.preventDefault();
  video.onerror = null;
  video.removeAttribute("src");
  video.load();
  videoAvailable = !!videoUrl;
  lastVideoSyncAt = 0;
  SELECTORS.videoWrap.classList.toggle("no-video", !videoUrl);
  SELECTORS.videoNote.hidden = !!videoUrl;
  SELECTORS.btnVideoFullscreen.hidden = !videoUrl;
  if (!videoUrl) return;
  video.src = videoUrl;
  preserveMediaPitch(video);
  video.playbackRate = playbackRate;
  video.onerror = () => {
    videoAvailable = false;
    setVideoFullscreen(false);
    video.removeAttribute("src");
    video.load();
    SELECTORS.videoWrap.classList.add("no-video");
    SELECTORS.videoNote.hidden = false;
    SELECTORS.btnVideoFullscreen.hidden = true;
  };
};
var initWaveSurfer = async (audioUrl, videoUrl, stemAssets = null) => {
  playbackRawAssets = { audio: audioUrl, video: videoUrl, stems: stemAssets };
  audioPreparation?.abort();
  const preparation = new AbortController();
  audioPreparation = preparation;
  audioReady = false;
  for (const button of [SELECTORS.btnPlay, SELECTORS.btnFsPlay, SELECTORS.btnMetro, SELECTORS.btnFsMetro]) button.disabled = true;
  SELECTORS.waveformLoading.hidden = false;
  for (const output of alignedOutputs.values()) output.destroy();
  alignedOutputs.clear();
  if (ws) {
    stopMetro();
    masterSourceNode?.disconnect();
    masterSourceNode = null;
    ws.destroy();
    ws = null;
  }
  destroyStemPlayers();
  initVideoPlayer(videoUrl);
  for (const url of alignedAssetUrls) URL.revokeObjectURL(url);
  alignedAssetUrls = [];
  const preparedUrls = [];
  const beats = getAdjustedBeats();
  const prepareAsset = async (url) => {
    const prepared = await prepareAlignedAsset(url, beats, preparation.signal);
    preparedUrls.push(prepared);
    return prepared;
  };
  try {
    audioUrl = await prepareAsset(audioUrl);
    if (hasStemAssets({ stems: stemAssets }) && !isMobileViewport()) {
      const preparedStems = {};
      for (const name of STEM_NAMES) {
        try {
          preparedStems[name] = await prepareAsset(stemAssets[name]);
        } catch (error) {
          preparation.signal.throwIfAborted();
          const unavailable = URL.createObjectURL(new Blob([], { type: "audio/wav" }));
          preparedUrls.push(unavailable);
          preparedStems[name] = unavailable;
        }
      }
      stemAssets = preparedStems;
    }
    preparation.signal.throwIfAborted();
  } catch (error) {
    for (const url of preparedUrls) URL.revokeObjectURL(url);
    if (preparation.signal.aborted) return null;
    SELECTORS.waveformLoading.hidden = true;
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = error.message;
    return null;
  }
  alignedAssetUrls = preparedUrls;
  currentStemAssets = hasStemAssets({ stems: stemAssets }) ? stemAssets : null;
  mobileStemMixActivated = false;
  waveformDrag = null;
  cancelWaveformPreviewSeek();
  SELECTORS.timeCur.textContent = "00:00";
  playingIdx = -1;
  document.querySelectorAll(".sec-row").forEach((row) => row.classList.remove("playing"));
  updatePlayButton();
  updateSelectionUI();
  ws = w.create({
    container: "#waveform",
    waveColor: "#2e2e2e",
    progressColor: "#f97316",
    url: audioUrl,
    height: isMobileViewport() ? 44 : 64,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    plugins: [d2.create()]
  });
  masterSourceNode = getCtx().createMediaElementSource(ws.getMediaElement());
  alignedOutputs.set(ws.getMediaElement(), connectAlignedOutput(getCtx(), masterSourceNode, ws.getMediaElement()));
  if (currentStemAssets && !isMobileViewport()) initStemPlayers(currentStemAssets);
  applyMusicVolume(SELECTORS.volMusic.value);
  ws.setPlaybackRate?.(playbackRate, true);
  preserveMediaPitch(ws.getMediaElement?.());
  let handlingFinish = false;
  const handlePlaybackFinished = async () => {
    if (handlingFinish) return;
    handlingFinish = true;
    try {
      if (loopOn) {
        const loopRange = getLoopRange();
        if (loopRange) {
          seekAudio(loopRange.start);
          ws.play();
          return;
        }
        seekAudio(0);
        ws.play();
        return;
      }
      if (await playNextInGroup()) return;
      pauseVideo();
      pauseStems();
      stopMetro();
      updatePlayButton();
    } finally {
      handlingFinish = false;
    }
  };
  const audioMedia = ws.getMediaElement?.();
  audioMedia?.addEventListener("ended", handlePlaybackFinished);
  for (const type of ["waiting", "stalled", "playing", "seeking", "seeked", "ratechange", "abort", "error"]) {
    audioMedia?.addEventListener(type, () => {
      logPlaybackDiagnostic(`audio-${type}`, mediaDiagnosticDetails(audioMedia));
    });
  }
  const sourceWs = ws;
  const onMasterWaiting = () => {
    if (ws !== sourceWs || !sourceWs.isPlaying() || audioMedia.readyState >= 3) return;
    stemTransport.setMasterWaiting(true);
    stopMetro();
    pauseVideo();
  };
  audioMedia?.addEventListener("waiting", onMasterWaiting);
  audioMedia?.addEventListener("stalled", onMasterWaiting);
  audioMedia?.addEventListener("playing", () => {
    if (ws !== sourceWs) return;
    stemTransport.setMasterWaiting(false);
    syncVideoToAudio(sourceWs.getCurrentTime(), { force: true });
    playVideo();
    if (metroOn) startMetro();
  });
  const getRegions = () => ws.getActivePlugins()[0];
  const disableTransport = (disabled) => {
    for (const button of [SELECTORS.btnPlay, SELECTORS.btnRestart, SELECTORS.btnLoop, SELECTORS.btnAutoNext, SELECTORS.btnMetro, SELECTORS.btnFsPlay, SELECTORS.btnFsRestart, SELECTORS.btnFsLoop, SELECTORS.btnFsAutoNext, SELECTORS.btnFsMetro]) {
      button.disabled = disabled;
    }
  };
  audioAvailable = true;
  audioReady = false;
  SELECTORS.audioNote.hidden = true;
  SELECTORS.waveformLoading.hidden = false;
  disableTransport(true);
  ensureWaveformSelectionEl();
  renderCustomLoopRange();
  SELECTORS.waveformWrap.onpointerdown = (event) => {
    if (!ws || event.button !== 0) return;
    const rect = SELECTORS.waveform.getBoundingClientRect();
    if (rect.width <= 0) return;
    const handle = event.target.closest?.(".loop-selection-handle");
    const selection = event.target.closest?.(".loop-selection");
    if (handle && customLoopRange) {
      event.preventDefault();
      const mode = handle.dataset.loopHandle === "start" ? "resize-start" : "resize-end";
      waveformDrag = {
        pointerId: event.pointerId,
        mode,
        anchorTime: mode === "resize-start" ? customLoopRange.end : customLoopRange.start,
        startX: event.clientX,
        currentX: event.clientX,
        moved: true
      };
      SELECTORS.waveformWrap.setPointerCapture?.(event.pointerId);
      SELECTORS.waveformWrap.classList.add("resizing-loop");
      return;
    }
    if (selection && customLoopRange) {
      event.preventDefault();
      waveformDrag = {
        pointerId: event.pointerId,
        mode: "move",
        startX: event.clientX,
        currentX: event.clientX,
        startTime: getWaveformTimeFromClientX(event.clientX),
        rangeStart: customLoopRange.start,
        rangeEnd: customLoopRange.end,
        moved: false
      };
      SELECTORS.waveformWrap.setPointerCapture?.(event.pointerId);
      SELECTORS.waveformWrap.classList.add("moving-loop");
      return;
    }
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
    event.preventDefault();
    waveformDrag = {
      pointerId: event.pointerId,
      mode: "create",
      startX: event.clientX,
      currentX: event.clientX,
      moved: false
    };
    SELECTORS.waveformWrap.setPointerCapture?.(event.pointerId);
  };
  SELECTORS.waveformWrap.onpointermove = (event) => {
    if (!waveformDrag || waveformDrag.pointerId !== event.pointerId) return;
    waveformDrag.currentX = event.clientX;
    if (waveformDrag.mode === "resize-start" || waveformDrag.mode === "resize-end") {
      const edge = getWaveformTimeFromClientX(waveformDrag.currentX);
      const start2 = Math.min(waveformDrag.anchorTime, edge);
      const end2 = Math.max(waveformDrag.anchorTime, edge);
      renderCustomLoopRange({
        start: start2,
        end: end2,
        kind: "custom"
      });
      if (waveformDrag.mode === "resize-start") scheduleWaveformPreviewSeek(start2);
      return;
    }
    if (waveformDrag.mode === "move") {
      if (Math.abs(waveformDrag.currentX - waveformDrag.startX) >= 4) waveformDrag.moved = true;
      if (waveformDrag.moved) renderCustomLoopRange(getMovedLoopRange(waveformDrag, waveformDrag.currentX));
      return;
    }
    if (Math.abs(waveformDrag.currentX - waveformDrag.startX) >= 12) waveformDrag.moved = true;
    if (!waveformDrag.moved) return;
    const start = getWaveformTimeFromClientX(Math.min(waveformDrag.startX, waveformDrag.currentX));
    const end = getWaveformTimeFromClientX(Math.max(waveformDrag.startX, waveformDrag.currentX));
    renderCustomLoopRange({ start, end, kind: "custom" });
  };
  SELECTORS.waveformWrap.onpointerup = (event) => {
    if (!waveformDrag || waveformDrag.pointerId !== event.pointerId) return;
    const drag = waveformDrag;
    const startX = waveformDrag.startX;
    const endX = waveformDrag.currentX;
    const moved = waveformDrag.moved;
    waveformDrag = null;
    cancelWaveformPreviewSeek();
    SELECTORS.waveformWrap.releasePointerCapture?.(event.pointerId);
    SELECTORS.waveformWrap.classList.remove("resizing-loop");
    SELECTORS.waveformWrap.classList.remove("moving-loop");
    if (drag.mode === "resize-start" || drag.mode === "resize-end") {
      const edge = getWaveformTimeFromClientX(endX);
      applyCustomLoopRange(
        Math.min(drag.anchorTime, edge),
        Math.max(drag.anchorTime, edge)
      );
      return;
    }
    if (drag.mode === "move") {
      if (!moved) {
        renderCustomLoopRange();
        seekAudio(getWaveformTimeFromClientX(event.clientX));
        return;
      }
      const range = getMovedLoopRange(drag, endX);
      applyCustomLoopRange(range.start, range.end);
      return;
    }
    if (!moved) {
      renderCustomLoopRange();
      seekAudio(getWaveformTimeFromClientX(event.clientX));
      return;
    }
    applyCustomLoopRange(
      getWaveformTimeFromClientX(Math.min(startX, endX)),
      getWaveformTimeFromClientX(Math.max(startX, endX))
    );
  };
  SELECTORS.waveformWrap.onpointercancel = (event) => {
    if (!waveformDrag || waveformDrag.pointerId !== event.pointerId) return;
    waveformDrag = null;
    cancelWaveformPreviewSeek();
    SELECTORS.waveformWrap.releasePointerCapture?.(event.pointerId);
    SELECTORS.waveformWrap.classList.remove("resizing-loop");
    SELECTORS.waveformWrap.classList.remove("moving-loop");
    renderCustomLoopRange();
  };
  ws.on("decode", () => {
    audioReady = true;
    SELECTORS.waveformLoading.hidden = true;
    disableTransport(false);
    applyCurrentPlaybackRate();
    const duration = ws.getDuration();
    SELECTORS.timeTot.textContent = fmt(duration);
    for (const section of currentData.sections) {
      const color = secColor(section.label);
      getRegions().addRegion({
        start: section.start_time,
        end: Math.min(section.end_time, duration),
        content: localizeSectionLabel(section.label),
        color: rgba(color, 0.15),
        drag: false,
        resize: false
      });
    }
    renderFourBarGrid();
    if (SELECTORS.sectionEditor?.open) {
      drawSectionEditorWaveform();
      syncSectionEditorPlaybackAvailability();
      updateSectionEditorPlayer();
    }
  });
  ws.on("timeupdate", (time) => {
    SELECTORS.timeCur.textContent = fmt(time);
    updatePlayingRow(time);
    syncVideoToAudio(time);
    syncStemPlayers(time);
    updateAlignedClickOutput();
    if (SELECTORS.sectionEditor?.open) updateSectionEditorPlayer(time);
    if (loopOn && ws.isPlaying() && !SELECTORS.sectionEditor?.open) {
      const loopRange = getLoopRange();
      if (shouldRestartLoop(time, loopRange)) {
        seekAudio(loopRange.start);
      }
    }
  });
  ws.on("play", () => {
    logPlaybackDiagnostic("audio-play", mediaDiagnosticDetails(audioMedia));
    applyCurrentPlaybackRate();
    syncVideoToAudio(ws.getCurrentTime(), { force: true });
    playVideo();
    playStems();
    if (metroOn) startMetro();
    updatePlayButton();
    if (SELECTORS.sectionEditor?.open) updateSectionEditorPlayer();
  });
  ws.on("pause", () => {
    if (stemHoldingMaster || ws.isPlaying()) return;
    logPlaybackDiagnostic("audio-pause", mediaDiagnosticDetails(audioMedia));
    pauseVideo();
    pauseStems();
    stopMetro();
    updatePlayButton();
    if (SELECTORS.sectionEditor?.open) updateSectionEditorPlayer();
  });
  ws.on("seeking", () => {
    const time = ws.getCurrentTime();
    stopMetro();
    syncVideoToAudio(time, { force: true });
    syncStemPlayers(time, { force: true });
  });
  ws.on("finish", handlePlaybackFinished);
  ws.on("error", () => {
    audioAvailable = false;
    audioReady = false;
    SELECTORS.waveformLoading.hidden = true;
    pauseVideo();
    pauseStems();
    stopMetro();
    disableTransport(true);
    SELECTORS.audioNote.hidden = false;
    updatePlayButton();
  });
  return ws;
};
var setupControls = () => {
  SELECTORS.btnPlay.onclick = togglePlayback;
  SELECTORS.btnFsPlay.onclick = togglePlayback;
  SELECTORS.btnRestart.onclick = playFromBeginning;
  SELECTORS.btnFsRestart.onclick = playFromBeginning;
  SELECTORS.btnVideoFullscreen.onclick = toggleVideoFullscreen;
  SELECTORS.btnVideoExit.onclick = () => setVideoFullscreen(false);
  SELECTORS.btnLoop.onclick = () => {
    loopOn = !loopOn;
    saveCfg("loop", loopOn);
    if (loopOn && autoNextOn) {
      autoNextOn = false;
      saveCfg(autoNextKey, false);
    }
    updatePlaybackModeButtons();
    if (!loopOn) {
      clearCustomLoopRange();
      return;
    }
    if (selectedIdxs.size) {
      applySectionLoopRange([...selectedIdxs]);
      return;
    }
    updateSelectionUI();
  };
  SELECTORS.btnFsLoop.onclick = SELECTORS.btnLoop.onclick;
  SELECTORS.btnClearRange.onclick = () => clearCustomLoopRange({ clearSelection: true });
  SELECTORS.btnMetro.onclick = () => {
    metroOn = !metroOn;
    saveCfg("metro", metroOn);
    updatePlaybackModeButtons();
    if (metroOn && ws?.isPlaying()) startMetro();
    else stopMetro();
  };
  SELECTORS.btnFsMetro.onclick = SELECTORS.btnMetro.onclick;
  SELECTORS.btnReanalyze.onclick = () => openAnalysisDialog({ reanalyze: true });
  SELECTORS.btnNewUrl.onclick = () => openAnalysisDialog();
  SELECTORS.btnAutoNext.onclick = () => {
    autoNextOn = !autoNextOn;
    saveCfg(autoNextKey, autoNextOn);
    if (autoNextOn && loopOn) {
      loopOn = false;
      saveCfg("loop", false);
      clearCustomLoopRange();
    }
    updatePlaybackModeButtons();
  };
  SELECTORS.btnFsAutoNext.onclick = SELECTORS.btnAutoNext.onclick;
  SELECTORS.btnGenerateStems.onclick = () => generateStems();
  document.getElementById("btn-retry-stems").onclick = () => stemTransport.retry();
  document.getElementById("btn-original-mix").onclick = () => stemTransport.useOriginal();
  SELECTORS.btnExportStemMix.onclick = () => exportStemMix();
  SELECTORS.btnBpmHalf.onclick = () => {
    if (!currentId) return;
    bpmFactor /= 2;
    saveCfg(bpmCorrectionKey(currentId), bpmFactor);
    applyBpmDisplay();
    void rebuildAlignedClicks();
  };
  SELECTORS.btnBpmDouble.onclick = () => {
    if (!currentId) return;
    bpmFactor *= 2;
    saveCfg(bpmCorrectionKey(currentId), bpmFactor);
    applyBpmDisplay();
    void rebuildAlignedClicks();
  };
  SELECTORS.btnBpmReset.onclick = () => {
    if (!currentId) return;
    bpmFactor = 1;
    saveCfg(bpmCorrectionKey(currentId), bpmFactor);
    applyBpmDisplay();
    void rebuildAlignedClicks();
  };
  SELECTORS.btnClickOffset.onclick = () => {
    if (!currentId) return;
    clickOffsetHalfBeat = !clickOffsetHalfBeat;
    saveCfg(clickOffsetKey(currentId), clickOffsetHalfBeat);
    SELECTORS.btnClickOffset.classList.toggle("active", clickOffsetHalfBeat);
    void rebuildAlignedClicks();
  };
  SELECTORS.btnBpmSave.onclick = async () => {
    if (!currentId || !hasServer) return;
    try {
      SELECTORS.btnBpmSave.disabled = true;
      const response = await fetch(`/results/${currentId}/bpm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factor: bpmFactor })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
      saveCfg(bpmCorrectionKey(currentId), 1);
      showResult(data, data.id);
      SELECTORS.status.className = "status ok";
      SELECTORS.status.textContent = "\u2713 BPM\u88DC\u6B63\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F";
      await loadHistory();
    } catch (error) {
      SELECTORS.status.className = "status err";
      SELECTORS.status.textContent = error.message;
    } finally {
      SELECTORS.btnBpmSave.disabled = false;
    }
  };
  SELECTORS.btnYouTube.onclick = () => {
    const sourceVideoId = currentData?.sourceVideoId || currentId;
    if (sourceVideoId) window.open(`https://www.youtube.com/watch?v=${sourceVideoId}`, "_blank");
  };
  SELECTORS.btnScoreExtractor.onclick = () => {
    const sourceVideoId = currentData?.sourceVideoId || currentId;
    if (!sourceVideoId) return;
    SELECTORS.scoreUrlInput.value = `https://www.youtube.com/watch?v=${sourceVideoId}`;
    setActiveTab("score");
    SELECTORS.scoreUrlInput.focus();
  };
  const setVol = (slider, label, configKey, apply) => {
    const saved = cfg()[configKey] ?? parseInt(slider.value, 10);
    slider.value = saved;
    label.textContent = `${saved}%`;
    apply(saved);
    slider.oninput = () => {
      const value = parseInt(slider.value, 10);
      label.textContent = `${value}%`;
      saveCfg(configKey, value);
      apply(value);
    };
  };
  setVol(SELECTORS.volMusic, SELECTORS.volMusicVal, "volMusic", applyMusicVolume);
  setVol(SELECTORS.volMetro, SELECTORS.volMetroVal, "volMetro", updateAlignedClickOutput);
  SELECTORS.playbackRate.oninput = () => applyPlaybackRate(SELECTORS.playbackRate.value);
  SELECTORS.btnSpeedReset.onclick = () => applyPlaybackRate(DEFAULT_PLAYBACK_RATE);
  for (const stem of STEM_NAMES) {
    const controls = SELECTORS.stemControls[stem];
    controls.enabled.onclick = () => {
      clearStemMixMode();
      const mix = getStemMix();
      const lastVolumes = getStemLastVolumes();
      const current = Number(mix[stem] ?? DEFAULT_STEM_MIX[stem]) || 0;
      if (current > 0) {
        lastVolumes[stem] = current;
        mix[stem] = 0;
      } else {
        mix[stem] = Math.max(1, Number(lastVolumes[stem]) || DEFAULT_STEM_MIX[stem]);
      }
      saveStemLastVolumes(lastVolumes);
      saveStemMix(mix);
      activateMobileStemMix();
      applyStemMix();
    };
    controls.volume.oninput = () => {
      clearStemMixMode();
      const mix = getStemMix();
      const value = Number(controls.volume.value) || 0;
      mix[stem] = value;
      if (value > 0) {
        const lastVolumes = getStemLastVolumes();
        lastVolumes[stem] = value;
        saveStemLastVolumes(lastVolumes);
      }
      saveStemMix(mix);
      activateMobileStemMix();
      applyStemMix();
    };
    controls.solo.onclick = () => setStemMixMode(stem, "solo");
    controls.focus.onclick = () => setStemMixMode(stem, "focus");
  }
  SELECTORS.btnResetStemMix.onclick = () => {
    clearStemMixMode();
    saveStemMix({ ...DEFAULT_STEM_MIX });
    saveStemLastVolumes({ ...DEFAULT_STEM_MIX });
    deactivateMobileStemMix();
    applyStemMix();
  };
};
var showResult = (data, id, { autoplay = false } = {}) => {
  currentData = data;
  currentId = id;
  SELECTORS.btnEditSections.hidden = !hasServer || staticLibraryMode;
  SELECTORS.btnEditSections.disabled = !data.sections?.length || !data.total_bars;
  saveCfg(lastStructureSessionKey, id);
  currentPlaybackGroup = findPlaybackGroupForSession(id);
  const assets = sessionAssets(data);
  const isLocalAudio = data.sourceType === "local_audio";
  selectedIdxs = /* @__PURE__ */ new Set();
  customLoopRange = null;
  playingIdx = -1;
  audioAvailable = true;
  audioReady = false;
  videoAvailable = true;
  loopOn = cfg().loop ?? false;
  metroOn = cfg().metro ?? false;
  autoNextOn = cfg()[autoNextKey] ?? false;
  bpmFactor = getStoredBpmFactor(id);
  clickOffsetHalfBeat = getStoredClickOffset(id);
  playbackRate = clampPlaybackRate(cfg().playbackRate ?? 1);
  SELECTORS.structureWorkspace.hidden = false;
  SELECTORS.playerCard.hidden = false;
  SELECTORS.inputCard.hidden = true;
  SELECTORS.topbarSong.hidden = false;
  SELECTORS.topbarActions.hidden = false;
  SELECTORS.topbarSong.textContent = data.title || "";
  SELECTORS.timeCur.textContent = "00:00";
  SELECTORS.timeTot.textContent = fmt(data.duration || 0);
  updatePlaybackModeButtons();
  SELECTORS.loopInfo.textContent = "";
  SELECTORS.btnNewUrl.hidden = !hasServer;
  SELECTORS.btnAutoNext.hidden = false;
  SELECTORS.btnYouTube.hidden = !hasServer || isLocalAudio;
  SELECTORS.btnScoreExtractor.hidden = !hasServer || isLocalAudio;
  SELECTORS.btnCloudSync.hidden = !hasServer || staticLibraryMode;
  SELECTORS.btnReanalyze.hidden = !hasServer || isLocalAudio;
  SELECTORS.btnClearRange.hidden = true;
  SELECTORS.btnBpmSave.hidden = !hasServer;
  SELECTORS.btnClickOffset.classList.toggle("active", clickOffsetHalfBeat);
  applyPlaybackRate(playbackRate);
  const playerInitialization = initWaveSurfer(assets.audio, assets.video, assets.stems);
  renderStemPanel(assets);
  setupControls();
  const maxBars = Math.max(...data.sections.map((section) => section.bar_count));
  SELECTORS.sections.innerHTML = "";
  data.sections.forEach((section, index) => {
    const color = secColor(section.label);
    const row = document.createElement("div");
    row.className = "sec-row";
    row.innerHTML = `
      <span class="sec-num">${String(index + 1).padStart(2, "0")}</span>
      <span class="sec-dot" style="background:${color}"></span>
      <span class="sec-label">${escapeHtml(localizeSectionLabel(section.label))}</span>
      <span class="sec-bars"><span class="subtle">${Number(section.bar_count || 0)}\u5C0F\u7BC0</span></span>
      <div class="sec-vis"><div class="sec-vis-fill" style="width:${Math.round(Number(section.bar_count || 0) / maxBars * 100)}%;background:${color}"></div></div>
      <span class="sec-time">${escapeHtml(section.start_time_str)}</span>
    `;
    row.onclick = (event) => {
      if (event.shiftKey && selectedIdxs.size > 0) {
        const indexes = [...selectedIdxs, index];
        const min = Math.min(...indexes);
        const max = Math.max(...indexes);
        const nextIndexes = [];
        for (let i3 = min; i3 <= max; i3 += 1) nextIndexes.push(i3);
        if (loopOn) {
          applySectionLoopRange(nextIndexes);
        } else {
          clearCustomLoopRange();
          selectedIdxs = new Set(nextIndexes);
          updateSelectionUI();
        }
      } else {
        if (loopOn) {
          applySectionLoopRange([index]);
        } else {
          clearCustomLoopRange();
          selectedIdxs = /* @__PURE__ */ new Set([index]);
          updateSelectionUI();
        }
        if (canPlayAudio()) {
          const wasPlaying = ws.isPlaying();
          seekAudio(section.start_time);
          if (!wasPlaying) ws.play();
        }
      }
    };
    SELECTORS.sections.appendChild(row);
  });
  applyBpmDisplay();
  document.querySelectorAll(".si").forEach((element) => {
    element.classList.toggle("active", element.dataset.id === id);
  });
  if (autoplay) {
    const startWhenReady = () => {
      if (!canPlayAudio()) return;
      ws.play();
    };
    if (audioReady) startWhenReady();
    else void playerInitialization.then((player) => {
      if (player && player === ws) player.once("ready", startWhenReady);
    });
  }
};
var sectionEditorDraft = [];
var sectionEditorSelectedIndex = 0;
var sectionEditorBoundaryDrag = null;
var sectionEditorPreviewTimer = null;
var sectionEditorPreviewEndTime = null;
var sectionEditorScrubPointerId = null;
var sectionEditorPlayheadPointerId = null;
var sectionEditorScrubState = null;
var updateSectionEditorPlayer = (time = ws?.getCurrentTime?.() || 0) => {
  if (!SELECTORS.sectionEditorPlayerToggle) return;
  const duration = ws?.getDuration?.() || currentData?.duration || 0;
  const progress = duration > 0 ? Math.max(0, Math.min(1, time / duration)) : 0;
  SELECTORS.sectionEditorCurrentTime.textContent = fmt(time);
  SELECTORS.sectionEditorDuration.textContent = fmt(duration);
  SELECTORS.sectionEditorPlayhead.style.left = `${progress * 100}%`;
  SELECTORS.sectionEditorScrub.setAttribute("aria-valuemax", String(Math.round(duration * 100) / 100));
  SELECTORS.sectionEditorScrub.setAttribute("aria-valuenow", String(Math.round(time * 100) / 100));
  SELECTORS.sectionEditorPlayhead.setAttribute("aria-valuemax", String(Math.round(duration * 100) / 100));
  SELECTORS.sectionEditorPlayhead.setAttribute("aria-valuenow", String(Math.round(time * 100) / 100));
  const playing = !!ws?.isPlaying?.();
  if (SELECTORS.sectionEditorPlayerToggle.dataset.playing !== String(playing)) {
    SELECTORS.sectionEditorPlayerToggle.dataset.playing = String(playing);
    SELECTORS.sectionEditorPlayerToggle.setAttribute("aria-label", playing ? "\u4E00\u6642\u505C\u6B62" : "\u518D\u751F");
    SELECTORS.sectionEditorPlayerToggle.innerHTML = playing ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
    lucide.createIcons();
  }
};
var drawSectionEditorWaveform = () => {
  const canvas = SELECTORS.sectionEditorWaveform;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  const peaks = extractWaveformPeaks(ws?.getDecodedData?.(), Math.floor(rect.width));
  const middle = rect.height / 2;
  context.strokeStyle = "rgba(226, 232, 240, .76)";
  context.lineWidth = 1;
  context.beginPath();
  for (let x = 0; x < peaks.length; x += 1) {
    const amplitude = Math.max(1, peaks[x] * (middle - 5));
    context.moveTo(x + 0.5, middle - amplitude);
    context.lineTo(x + 0.5, middle + amplitude);
  }
  context.stroke();
};
var updateSectionEditorSelectedRange = () => {
  const section = sectionEditorDraft[sectionEditorSelectedIndex];
  const duration = ws?.getDuration?.() || currentData?.duration || 0;
  if (!section || duration <= 0) {
    SELECTORS.sectionEditorSelectedRange.hidden = true;
    return;
  }
  const start = sectionEditorTimeAtBoundary(section.startBar - 1);
  const end = sectionEditorTimeAtBoundary(section.endBar);
  SELECTORS.sectionEditorSelectedRange.hidden = false;
  SELECTORS.sectionEditorSelectedRange.style.left = `${Math.max(0, Math.min(1, start / duration)) * 100}%`;
  SELECTORS.sectionEditorSelectedRange.style.width = `${Math.max(0, Math.min(1, (end - start) / duration)) * 100}%`;
};
var sectionEditorTimeFromClientX = (clientX) => {
  if (!canPlayAudio()) return;
  const rect = SELECTORS.sectionEditorScrub.getBoundingClientRect();
  if (rect.width <= 0) return;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return (ws?.getDuration?.() || currentData?.duration || 0) * ratio;
};
var beginSectionEditorScrub = (clientX) => {
  if (!canPlayAudio()) return false;
  stopSectionEditorPreview({ pause: false });
  const wasPlaying = ws.isPlaying();
  if (wasPlaying) ws.pause();
  else {
    pauseVideo();
    pauseStems();
    stopMetro();
  }
  sectionEditorScrubState = {
    wasPlaying,
    time: ws.getCurrentTime()
  };
  previewSectionEditorScrub(clientX);
  return true;
};
var previewSectionEditorScrub = (clientX) => {
  if (!sectionEditorScrubState) return;
  const time = sectionEditorTimeFromClientX(clientX);
  if (!Number.isFinite(time)) return;
  sectionEditorScrubState.time = time;
  updateSectionEditorPlayer(time);
  syncVideoToAudio(time, { force: true });
};
var finishSectionEditorSilentScrub = () => {
  if (!sectionEditorScrubState) return;
  const { time, wasPlaying } = sectionEditorScrubState;
  sectionEditorScrubState = null;
  seekAudio(time, { respectLoopRange: false });
  updateSectionEditorPlayer(time);
  if (wasPlaying) ws.play();
};
var toggleSectionEditorPlayback = () => {
  if (!canPlayAudio()) return;
  stopSectionEditorPreview({ pause: false });
  if (ws.isPlaying()) ws.pause();
  else ws.play();
};
var syncSectionEditorPlaybackAvailability = () => {
  const disabled = !canPlayAudio();
  SELECTORS.sectionEditorPlayerToggle.disabled = disabled;
  SELECTORS.sectionEditorPreview.disabled = disabled;
};
var setSectionEditorPreviewState = (playing) => {
  if (!SELECTORS.sectionEditorPreview) return;
  SELECTORS.sectionEditorPreview.classList.toggle("active", playing);
  SELECTORS.sectionEditorPreview.innerHTML = playing ? '<i data-lucide="square"></i><span>\u505C\u6B62</span>' : '<i data-lucide="play"></i><span>\u9078\u629E\u3060\u3051\u518D\u751F</span>';
  lucide.createIcons();
};
var stopSectionEditorPreview = ({ pause = true } = {}) => {
  if (sectionEditorPreviewTimer) window.clearInterval(sectionEditorPreviewTimer);
  sectionEditorPreviewTimer = null;
  sectionEditorPreviewEndTime = null;
  if (pause && ws?.isPlaying()) ws.pause();
  setSectionEditorPreviewState(false);
};
var sectionEditorTimeAtBoundary = (boundaryBar) => {
  const sourceSections = currentData?.sections || [];
  const source = sourceSections.find((section) => boundaryBar >= section.start_bar - 1 && boundaryBar <= section.end_bar);
  if (source) {
    const count = Math.max(1, source.end_bar - source.start_bar + 1);
    const progress = Math.max(0, Math.min(1, (boundaryBar - (source.start_bar - 1)) / count));
    return source.start_time + (source.end_time - source.start_time) * progress;
  }
  return (currentData?.duration || 0) * boundaryBar / sectionEditorTotalBars();
};
var previewSelectedSection = () => {
  if (!canPlayAudio()) return;
  if (sectionEditorPreviewTimer && ws.isPlaying()) {
    stopSectionEditorPreview();
    return;
  }
  syncSectionEditorSelectionFromFields();
  const section = sectionEditorDraft[sectionEditorSelectedIndex];
  if (!section) return;
  const start = sectionEditorTimeAtBoundary(section.startBar - 1);
  const end = sectionEditorTimeAtBoundary(section.endBar);
  stopSectionEditorPreview({ pause: false });
  sectionEditorPreviewEndTime = end;
  playFromTime(start);
  setSectionEditorPreviewState(true);
  sectionEditorPreviewTimer = window.setInterval(() => {
    if (!ws?.isPlaying() || ws.getCurrentTime() >= sectionEditorPreviewEndTime - 0.02) {
      stopSectionEditorPreview();
    }
  }, 40);
};
var syncSectionEditorSelectionFromFields = () => {
  const section = sectionEditorDraft[sectionEditorSelectedIndex];
  if (!section) return;
  section.label = SELECTORS.sectionEditorLabel.value.trim() || section.label;
};
var sectionEditorTotalBars = () => Math.max(1, ...sectionEditorDraft.map((section) => section.endBar));
var renderSectionEditorInspector = () => {
  sectionEditorSelectedIndex = Math.min(Math.max(0, sectionEditorSelectedIndex), sectionEditorDraft.length - 1);
  const section = sectionEditorDraft[sectionEditorSelectedIndex];
  if (!section) return;
  SELECTORS.sectionEditorSelectionNumber.textContent = String(sectionEditorSelectedIndex + 1).padStart(2, "0");
  SELECTORS.sectionEditorLabel.value = localizeSectionLabel(section.label);
  SELECTORS.sectionEditorStart.value = String(section.startBar);
  SELECTORS.sectionEditorEnd.value = String(section.endBar);
  SELECTORS.sectionEditorStart.disabled = sectionEditorSelectedIndex === 0;
  SELECTORS.sectionEditorEnd.disabled = sectionEditorSelectedIndex === sectionEditorDraft.length - 1;
  SELECTORS.sectionEditorStart.min = String(sectionEditorSelectedIndex > 0 ? sectionEditorDraft[sectionEditorSelectedIndex - 1].startBar + 1 : 1);
  SELECTORS.sectionEditorStart.max = String(section.endBar);
  SELECTORS.sectionEditorEnd.min = String(section.startBar);
  SELECTORS.sectionEditorEnd.max = String(sectionEditorSelectedIndex < sectionEditorDraft.length - 1 ? sectionEditorDraft[sectionEditorSelectedIndex + 1].endBar - 1 : sectionEditorTotalBars());
  const tools = SELECTORS.sectionEditor.querySelector(".section-editor-tools");
  tools.querySelector("[data-section-action='split']").disabled = section.startBar >= section.endBar;
  tools.querySelector("[data-section-action='merge']").disabled = sectionEditorSelectedIndex === sectionEditorDraft.length - 1;
  tools.querySelector("[data-section-action='delete']").disabled = sectionEditorDraft.length === 1;
  syncSectionEditorPlaybackAvailability();
  updateSectionEditorSelectedRange();
};
var renderSectionEditor = () => {
  const totalBars = sectionEditorTotalBars();
  const segments = sectionEditorDraft.map((section, index) => {
    const startPercent = (section.startBar - 1) / totalBars * 100;
    const widthPercent = (section.endBar - section.startBar + 1) / totalBars * 100;
    const color = secColor(section.label);
    return `
      <button class="section-editor-segment${index === sectionEditorSelectedIndex ? " selected" : ""}"
        type="button" data-section-index="${index}"
        style="--section-left:${startPercent}%;--section-width:${widthPercent}%;--section-color:${color}"
        aria-label="${escapeHtml(localizeSectionLabel(section.label))} ${section.startBar}\u5C0F\u7BC0\u304B\u3089${section.endBar}\u5C0F\u7BC0">
        <strong>${escapeHtml(localizeSectionLabel(section.label))}</strong>
        <small>${section.startBar}\u2013${section.endBar}\u5C0F\u7BC0</small>
      </button>
    `;
  }).join("");
  const boundaries = sectionEditorDraft.slice(0, -1).map((section, index) => `
    <button class="section-editor-boundary" type="button" data-boundary-index="${index}"
      style="--boundary-left:${section.endBar / totalBars * 100}%"
      aria-label="${section.endBar}\u5C0F\u7BC0\u3068${section.endBar + 1}\u5C0F\u7BC0\u306E\u5883\u754C">
      <span></span>
    </button>
  `).join("");
  const ruler = Array.from({ length: Math.ceil(totalBars / 4) + 1 }, (_, index) => {
    const bar = Math.min(index * 4 + 1, totalBars);
    const left = (bar - 1) / totalBars * 100;
    return `<span style="left:${left}%">${bar}</span>`;
  }).join("");
  SELECTORS.sectionEditorRows.innerHTML = `
    <div class="section-editor-grid section-editor-grid-minor" style="--editor-bars:${totalBars}" aria-hidden="true"></div>
    <div class="section-editor-grid section-editor-grid-major" style="--editor-bars:${totalBars}" aria-hidden="true"></div>
    ${segments}${boundaries}
    <div class="section-editor-ruler" aria-hidden="true">${ruler}</div>
  `;
  renderSectionEditorInspector();
};
var updateSectionEditorBoundary = (boundaryIndex, endBar) => {
  const left = sectionEditorDraft[boundaryIndex];
  const right = sectionEditorDraft[boundaryIndex + 1];
  if (!left || !right) return;
  const snappedBar = Math.max(left.startBar, Math.min(right.endBar - 1, Math.round(endBar)));
  left.endBar = snappedBar;
  right.startBar = snappedBar + 1;
};
var updateSectionEditorSelectedBounds = (edge, value) => {
  const index = sectionEditorSelectedIndex;
  const section = sectionEditorDraft[index];
  if (!section || !Number.isFinite(value)) return;
  if (edge === "start" && index > 0) {
    const previous = sectionEditorDraft[index - 1];
    const startBar = Math.max(previous.startBar + 1, Math.min(section.endBar, Math.round(value)));
    previous.endBar = startBar - 1;
    section.startBar = startBar;
  } else if (edge === "end" && index < sectionEditorDraft.length - 1) {
    const next = sectionEditorDraft[index + 1];
    const endBar = Math.max(section.startBar, Math.min(next.endBar - 1, Math.round(value)));
    section.endBar = endBar;
    next.startBar = endBar + 1;
  }
  renderSectionEditor();
};
var openSectionEditor = () => {
  if (!hasServer || !currentData?.sections?.length) return;
  stopSectionEditorPreview();
  sectionEditorDraft = normalizeSectionDraft(currentData.sections.map((section) => ({
    label: localizeSectionLabel(section.label),
    startBar: section.start_bar,
    endBar: section.end_bar
  })), currentData.total_bars);
  sectionEditorSelectedIndex = 0;
  sectionEditorBoundaryDrag = null;
  SELECTORS.sectionEditorError.textContent = "";
  SELECTORS.btnRestoreSections.disabled = !currentData.automaticSections?.length;
  renderSectionEditor();
  SELECTORS.sectionEditor.showModal();
  lucide.createIcons();
  window.requestAnimationFrame(() => {
    drawSectionEditorWaveform();
    syncSectionEditorPlaybackAvailability();
    updateSectionEditorPlayer();
    updateSectionEditorSelectedRange();
  });
};
var applySectionDraftAction = (index, action) => {
  stopSectionEditorPreview();
  syncSectionEditorSelectionFromFields();
  sectionEditorDraft = mutateSectionDraft(sectionEditorDraft, index, action);
  if (action === "split") sectionEditorSelectedIndex = Math.min(index + 1, sectionEditorDraft.length - 1);
  else sectionEditorSelectedIndex = Math.min(index, sectionEditorDraft.length - 1);
  renderSectionEditor();
};
var saveSectionEditor = async () => {
  syncSectionEditorSelectionFromFields();
  SELECTORS.sectionEditorError.textContent = "";
  SELECTORS.btnSaveSections.disabled = true;
  try {
    const response = await fetch(`/results/${encodeURIComponent(currentId)}/sections`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: sectionEditorDraft })
    });
    const updated = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(updated.detail || "\u30BB\u30AF\u30B7\u30E7\u30F3\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    SELECTORS.sectionEditor.close();
    showResult(updated, currentId);
  } catch (error) {
    SELECTORS.sectionEditorError.textContent = error.message;
  } finally {
    SELECTORS.btnSaveSections.disabled = false;
  }
};
var restoreAutomaticSections = async () => {
  if (!await showConfirm("\u7DE8\u96C6\u5185\u5BB9\u3092\u7834\u68C4\u3057\u3066\u81EA\u52D5\u89E3\u6790\u7D50\u679C\u3078\u623B\u3057\u307E\u3059\u304B\uFF1F", { title: "\u81EA\u52D5\u89E3\u6790\u3078\u623B\u3059", confirmLabel: "\u623B\u3059", danger: true })) return;
  SELECTORS.sectionEditorError.textContent = "";
  try {
    const response = await fetch(`/results/${encodeURIComponent(currentId)}/sections`, { method: "DELETE" });
    const updated = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(updated.detail || "\u81EA\u52D5\u89E3\u6790\u7D50\u679C\u3078\u623B\u305B\u307E\u305B\u3093\u3067\u3057\u305F");
    SELECTORS.sectionEditor.close();
    showResult(updated, currentId);
  } catch (error) {
    SELECTORS.sectionEditorError.textContent = error.message;
  }
};
var renderStorageReport = (report) => {
  SELECTORS.storageTotal.textContent = `\u5408\u8A08 ${formatBytes(report.totalBytes)}`;
  SELECTORS.storageList.innerHTML = (report.categories || []).map((category) => `
    <div class="storage-row">
      <span>${escapeHtml(category.label)}</span>
      <span class="storage-size">${formatBytes(category.bytes)} \xB7 ${Number(category.files || 0)}\u4EF6</span>
      ${category.cleanup || category.desktopCleanup ? `<button class="storage-clean" type="button" data-storage-clean="${escapeHtml(category.key)}">\u6574\u7406</button>` : "<span></span>"}
    </div>
  `).join("");
};
var loadStorageReport = async () => {
  if (!hasServer || staticLibraryMode) return;
  SELECTORS.storageTotal.textContent = "\u8A08\u7B97\u4E2D...";
  SELECTORS.storageList.innerHTML = "";
  lucide.createIcons();
  try {
    const response = await fetch("/storage", { cache: "no-store" });
    const report = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(report.detail || "\u5BB9\u91CF\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    renderStorageReport(report);
  } catch (error) {
    SELECTORS.storageTotal.textContent = error.message;
  }
};
var openStorageSettings = () => openSettings("storage");
var cleanStorageCategory = async (key) => {
  if (!await showConfirm("\u518D\u751F\u6210\u53EF\u80FD\u306A\u30AD\u30E3\u30C3\u30B7\u30E5\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", { title: "\u30AD\u30E3\u30C3\u30B7\u30E5\u3092\u6574\u7406", confirmLabel: "\u6574\u7406\u3059\u308B", danger: true })) return;
  const button = SELECTORS.storageList.querySelector(`[data-storage-clean="${CSS.escape(key)}"]`);
  if (button) button.disabled = true;
  try {
    if (key === "browser-cache" && window.practiceLabDesktop?.clearCache) {
      const result2 = await window.practiceLabDesktop.clearCache();
      await loadStorageReport();
      SELECTORS.storageTotal.textContent += `\uFF08${formatBytes(result2.removedBytes)}\u524A\u9664\uFF09`;
      return;
    }
    const response = await fetch("/storage/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: [key] })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.detail || "\u30AD\u30E3\u30C3\u30B7\u30E5\u3092\u6574\u7406\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    renderStorageReport(result.report);
    SELECTORS.storageTotal.textContent += `\uFF08${formatBytes(result.removedBytes)}\u524A\u9664\uFF09`;
  } catch (error) {
    await showAlert(error.message, { title: "\u30AD\u30E3\u30C3\u30B7\u30E5\u3092\u6574\u7406\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  } finally {
    if (button) button.disabled = false;
  }
};
var renderSidebar = (items, { error = "" } = {}) => {
  currentSidebarItems = items;
  SELECTORS.sidebarList.innerHTML = "";
  const visibleItems = filterLibraryItems(items, {
    query: SELECTORS.sessionSearch?.value || ""
  });
  sidebarItemsCount = visibleItems.length;
  const validIds = new Set(items.map((item) => item.id));
  selectedSessionIds = new Set([...selectedSessionIds].filter((id) => validIds.has(id)));
  if (!selectedSessionIds.has(lastSelectedSessionId)) lastSelectedSessionId = null;
  SELECTORS.sessionPanel.hidden = currentFeature === "score" || items.length === 0 && !staticLibraryMode;
  if (items.length === 0) {
    SELECTORS.sidebarList.innerHTML = error ? `<div class="library-empty library-empty-error"><strong>\u66F2\u4E00\u89A7\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F</strong><span>${escapeHtml(error)}</span><button class="mini-btn" id="btn-library-retry" type="button">\u518D\u8AAD\u307F\u8FBC\u307F</button></div>` : `<div class="library-empty"><strong>\u307E\u3060\u66F2\u304C\u3042\u308A\u307E\u305B\u3093</strong><span>\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u30A2\u30D7\u30EA\u304B\u3089\u30AF\u30E9\u30A6\u30C9\u540C\u671F\u3059\u308B\u3068\u3001\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002</span></div>`;
    SELECTORS.sidebarList.querySelector("#btn-library-retry")?.addEventListener("click", async () => {
      await loadHistory();
      if (isMobileViewport()) openMobileSidebar();
    });
    return;
  }
  if (visibleItems.length === 0) {
    SELECTORS.sidebarList.innerHTML = `<div class="library-empty">\u6761\u4EF6\u306B\u4E00\u81F4\u3059\u308B\u66F2\u304C\u3042\u308A\u307E\u305B\u3093</div>`;
    return;
  }
  const folders = cleanFolders(getFolders(), items);
  saveFolders(folders, { remote: false });
  const itemById = new Map(visibleItems.map((item) => [item.id, item]));
  const folderedIds = new Set(folders.flatMap((folder) => folder.sessionIds || []));
  const toggleFolder = (folderId) => {
    const next = folders.map((item) => item.id === folderId ? { ...item, collapsed: !item.collapsed } : item);
    const toggled = next.find((item) => item.id === folderId);
    if (toggled) saveFolderCollapsed(folderId, toggled.collapsed);
    saveFolders(next);
    renderSidebar(items);
  };
  const deleteFolder = async (folder) => {
    if (!await showConfirm(`\u30D5\u30A9\u30EB\u30C0\u30FC\u300C${folder.name}\u300D\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F
\u30BB\u30C3\u30B7\u30E7\u30F3\u306F\u672A\u5206\u985E\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002`, { title: "\u30D5\u30A9\u30EB\u30C0\u30FC\u3092\u524A\u9664", confirmLabel: "\u524A\u9664", danger: true })) return;
    const next = folders.filter((item) => item.id !== folder.id);
    forgetFolderCollapsed(folder.id);
    saveFolders(next);
    renderSidebar(items);
  };
  const renameFolder = async (folder) => {
    const name = (await showPrompt("\u30D5\u30A9\u30EB\u30C0\u30FC\u540D", folder.name, { title: "\u30D5\u30A9\u30EB\u30C0\u30FC\u540D\u3092\u5909\u66F4" }))?.trim();
    if (!name || name === folder.name) return;
    const next = folders.map((item) => item.id === folder.id ? { ...item, name } : item);
    saveFolders(next);
    renderSidebar(items);
  };
  folders.forEach((folder) => {
    const group = document.createElement("div");
    group.className = "sf";
    group.dataset.folderId = folder.id;
    const folderName = escapeHtml(folder.name);
    group.innerHTML = `
      <div class="sf-head">
        <button class="sf-toggle" title="${folder.collapsed ? "\u5C55\u958B" : "\u6298\u308A\u305F\u305F\u3080"}">${folder.collapsed ? "\u25B8" : "\u25BE"}</button>
        <button class="sf-name" title="${folder.collapsed ? "\u30D5\u30A9\u30EB\u30C0\u30FC\u3092\u5C55\u958B" : "\u30D5\u30A9\u30EB\u30C0\u30FC\u3092\u6298\u308A\u305F\u305F\u3080"}">${folderName}</button>
      </div>
      <div class="sf-items"></div>
    `;
    const folderItems = group.querySelector(".sf-items");
    const folderHead = group.querySelector(".sf-head");
    folderItems.hidden = !!folder.collapsed;
    const folderVisibleItems = sortLibraryItems((folder.sessionIds || []).map((id) => itemById.get(id)).filter(Boolean), SELECTORS.sessionSort?.value || "manual");
    for (const item of folderVisibleItems) {
      folderItems.appendChild(createSessionRow(item, items, folder.id));
    }
    if (hasServer) {
      folderHead.draggable = true;
      folderHead.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("application/x-practice-lab-folder", folder.id);
        event.dataTransfer.effectAllowed = "move";
        group.classList.add("dragging");
      });
      folderHead.addEventListener("dragend", clearSidebarDropMarkers);
      group.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (hasDragType(event, "application/x-practice-lab-folder")) {
          const rect = group.getBoundingClientRect();
          const after = event.clientY > rect.top + rect.height / 2;
          group.classList.toggle("drop-before", !after);
          group.classList.toggle("drop-after", after);
          group.classList.remove("drop");
          return;
        }
        group.classList.add("drop");
      });
      group.addEventListener("dragleave", () => group.classList.remove("drop", "drop-before", "drop-after"));
      group.addEventListener("drop", (event) => {
        event.preventDefault();
        group.classList.remove("drop", "drop-before", "drop-after");
        const draggedFolderId = event.dataTransfer.getData("application/x-practice-lab-folder");
        if (draggedFolderId) {
          const rect = group.getBoundingClientRect();
          reorderFolder(draggedFolderId, folder.id, items, { after: event.clientY > rect.top + rect.height / 2 });
          clearSidebarDropMarkers();
          return;
        }
        const sessionIds = getDraggedSessionIds(event);
        if (sessionIds.length) reorderSessions(sessionIds, null, folder.id, items);
        clearSidebarDropMarkers();
      });
    }
    group.querySelector(".sf-toggle").onclick = () => toggleFolder(folder.id);
    group.querySelector(".sf-name").onclick = () => toggleFolder(folder.id);
    if (hasServer) {
      folderHead.addEventListener("contextmenu", (event) => {
        const actions = [
          { label: "\u540D\u524D\u3092\u5909\u66F4", run: () => renameFolder(folder) },
          { label: "\u524A\u9664", danger: true, run: () => deleteFolder(folder) }
        ];
        if (selectedSessionIds.size) {
          actions.unshift({
            label: `\u9078\u629E\u4E2D\u306E${selectedSessionIds.size}\u4EF6\u3092\u3053\u3053\u3078\u79FB\u52D5`,
            run: () => reorderSessions([...selectedSessionIds], null, folder.id, items)
          });
        }
        showContextMenu(event, actions);
      });
    }
    SELECTORS.sidebarList.appendChild(group);
  });
  const looseOrder = getRootOrder(items, folderedIds);
  const looseItems = sortLibraryItems(looseOrder.map((id) => itemById.get(id)).filter(Boolean), SELECTORS.sessionSort?.value || "manual");
  const loose = document.createElement("div");
  loose.className = "sf sf-root";
  loose.innerHTML = `<div class="sf-head"><span class="sf-root-name">\u672A\u5206\u985E</span></div><div class="sf-items"></div>`;
  const looseList = loose.querySelector(".sf-items");
  if (hasServer) {
    loose.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (hasDragType(event, "application/x-practice-lab-folder")) {
        loose.classList.add("drop-before");
        loose.classList.remove("drop");
        return;
      }
      loose.classList.add("drop");
    });
    loose.addEventListener("dragleave", () => loose.classList.remove("drop", "drop-before"));
    loose.addEventListener("drop", (event) => {
      event.preventDefault();
      loose.classList.remove("drop", "drop-before");
      const draggedFolderId = event.dataTransfer.getData("application/x-practice-lab-folder");
      if (draggedFolderId) {
        reorderFolder(draggedFolderId, null, items);
        clearSidebarDropMarkers();
        return;
      }
      const sessionIds = getDraggedSessionIds(event);
      if (!sessionIds.length) return;
      reorderSessions(sessionIds, null, "root", items);
      clearSidebarDropMarkers();
    });
  }
  looseItems.forEach((item) => looseList.appendChild(createSessionRow(item, items, "root")));
  SELECTORS.sidebarList.appendChild(loose);
  updateSidebarSelectionUI();
};
var addFolder = async () => {
  const name = (await showPrompt("\u30D5\u30A9\u30EB\u30C0\u30FC\u540D", "\u65B0\u3057\u3044\u30D5\u30A9\u30EB\u30C0\u30FC", { title: "\u30D5\u30A9\u30EB\u30C0\u30FC\u3092\u8FFD\u52A0", confirmLabel: "\u8FFD\u52A0" }))?.trim();
  if (!name) return;
  const folders = getFolders();
  folders.push({ id: makeFolderId(), name, collapsed: false, sessionIds: [] });
  saveFolders(folders);
  await loadHistory();
};
if (SELECTORS.btnAddFolder) {
  SELECTORS.btnAddFolder.onclick = addFolder;
}
SELECTORS.btnDeleteSessionSelection.onclick = () => deleteSelectedResults(currentSidebarItems);
SELECTORS.btnClearSessionSelection.onclick = () => {
  selectedSessionIds.clear();
  lastSelectedSessionId = null;
  updateSidebarSelectionUI();
};
SELECTORS.btnMobileLibrary.onclick = openMobileSidebar;
SELECTORS.sidebarScrim.onclick = closeMobileSidebar;
SELECTORS.tabStructure.onclick = () => setActiveTab("structure");
if (!staticLibraryMode) {
  SELECTORS.tabScore.onclick = () => setActiveTab("score");
  SELECTORS.scorePreviewBtn.onclick = loadScorePreview;
  SELECTORS.scoreExtractBtn.onclick = extractScore;
  SELECTORS.scoreUrlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadScorePreview();
  });
  SELECTORS.scoreRegionPreset.onchange = () => {
    if (scorePreviewData) loadScorePreview();
  };
  SELECTORS.scoreRegionPercent.onchange = () => {
    if (scorePreviewData) loadScorePreview();
  };
  SELECTORS.scoreTimeMode.onchange = () => {
    SELECTORS.scoreTimeRange.hidden = SELECTORS.scoreTimeMode.value !== "range";
    if (scorePreviewData) loadScorePreview();
  };
  SELECTORS.scoreRegionBox.onpointerdown = (event) => {
    if (!scorePreviewData || !scoreRegion) return;
    event.preventDefault();
    event.stopPropagation();
    const point = getScorePreviewPoint(event);
    const handle = event.target.dataset.handle || "";
    scoreRegionDrag = {
      pointerId: event.pointerId,
      mode: handle ? "resize" : "move",
      handle,
      startPoint: point,
      startRegion: { ...scoreRegion }
    };
    SELECTORS.scoreRegionBox.classList.toggle("resizing", !!handle);
    SELECTORS.scoreRegionBox.classList.toggle("dragging", !handle);
    SELECTORS.scoreRegionBox.setPointerCapture?.(event.pointerId);
  };
  SELECTORS.scoreRegionBox.onpointermove = (event) => {
    if (!scoreRegionDrag || scoreRegionDrag.pointerId !== event.pointerId) return;
    const point = getScorePreviewPoint(event);
    const dx = point.x - scoreRegionDrag.startPoint.x;
    const dy = point.y - scoreRegionDrag.startPoint.y;
    const start = scoreRegionDrag.startRegion;
    if (scoreRegionDrag.mode === "resize") {
      const handle = scoreRegionDrag.handle;
      const startLeft = start.x;
      const startTop = start.y;
      const startRight = start.x + start.width;
      const startBottom = start.y + start.height;
      scoreRegion = regionFromEdges({
        left: handle.includes("w") ? startLeft + dx : startLeft,
        top: handle.includes("n") ? startTop + dy : startTop,
        right: handle.includes("e") ? startRight + dx : startRight,
        bottom: handle.includes("s") ? startBottom + dy : startBottom,
        anchorX: handle.includes("e") ? "left" : "right",
        anchorY: handle.includes("s") ? "top" : "bottom"
      });
    } else {
      scoreRegion = clampScoreRegion({
        ...start,
        x: start.x + dx,
        y: start.y + dy
      });
    }
    renderScoreRegion();
  };
  SELECTORS.scoreRegionBox.onpointerup = (event) => {
    if (!scoreRegionDrag || scoreRegionDrag.pointerId !== event.pointerId) return;
    scoreRegionDrag = null;
    SELECTORS.scoreRegionBox.classList.remove("dragging", "resizing");
    SELECTORS.scoreRegionBox.releasePointerCapture?.(event.pointerId);
  };
  SELECTORS.scoreRegionBox.onpointercancel = (event) => {
    if (!scoreRegionDrag || scoreRegionDrag.pointerId !== event.pointerId) return;
    scoreRegionDrag = null;
    SELECTORS.scoreRegionBox.classList.remove("dragging", "resizing");
    SELECTORS.scoreRegionBox.releasePointerCapture?.(event.pointerId);
  };
}
var loadHistory = async () => {
  try {
    const manifestUrl = staticLibraryMode ? STATIC_MANIFEST_URL : "results/manifest.json";
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error("\u66F2\u4E00\u89A7\u306E\u5F62\u5F0F\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093");
    const timestamps = cfg().lastOpenedAt || {};
    const restored = items.map((item) => ({ ...item, lastOpenedAt: [item.lastOpenedAt || "", timestamps[item.id] || ""].sort().at(-1) || null }));
    SELECTORS.sessionSort.value = cfg().librarySort || "recent";
    renderSidebar(restored);
    return restored;
  } catch (error) {
    renderSidebar([], { error: error?.message || "\u901A\u4FE1\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304F\u3060\u3055\u3044" });
    if (staticLibraryMode && isMobileViewport()) openMobileSidebar();
  }
  return [];
};
var restoreLastStructureSession = async (items) => {
  if (!Array.isArray(items) || items.length === 0 || currentId) {
    if (staticLibraryMode && isMobileViewport() && !currentId) openMobileSidebar();
    return;
  }
  setActiveTab("structure");
  const lastId = cfg()[lastStructureSessionKey];
  if (staticLibraryMode && isMobileViewport() && !lastId) {
    openMobileSidebar();
    return;
  }
  const session = items.find((item) => item.id === lastId) || items[0];
  await loadResult(session);
};
var loadResult = async (session, { autoplay = false } = {}) => {
  const id = typeof session === "string" ? session : session.id;
  const assets = sessionAssets(typeof session === "string" ? { id } : session);
  const response = await fetch(assets.result, { cache: "no-store" });
  if (!response.ok) {
    if (hasServer && await showConfirm("\u89E3\u6790\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u518D\u89E3\u6790\u3057\u307E\u3059\u304B\uFF1F", { title: "\u89E3\u6790\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093", confirmLabel: "\u518D\u89E3\u6790" })) {
      await doAnalyze(`https://www.youtube.com/watch?v=${id}`, true);
    }
    return;
  }
  showResult(await response.json(), id, { autoplay });
  markSessionOpened(id);
};
var deleteResult = async (id, currentList) => {
  if (!hasServer) {
    await showAlert("\u30B5\u30FC\u30D0\u30FC\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059", { title: "\u64CD\u4F5C\u3067\u304D\u307E\u305B\u3093" });
    return;
  }
  if (!await showConfirm("\u3053\u306E\u30BB\u30C3\u30B7\u30E7\u30F3\u3068\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", { title: "\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u524A\u9664", confirmLabel: "\u524A\u9664", danger: true })) return;
  try {
    const response = await fetch(`/results/${encodeURIComponent(id)}`, { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    selectedSessionIds.delete(id);
    renderSidebar(currentList.filter((item) => item.id !== id));
  } catch (error) {
    await showAlert(`\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`, { title: "\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  }
};
var deleteSelectedResults = async (currentList) => {
  if (!hasServer) {
    await showAlert("\u30B5\u30FC\u30D0\u30FC\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059", { title: "\u64CD\u4F5C\u3067\u304D\u307E\u305B\u3093" });
    return;
  }
  const ids = getSidebarOrderedSessionIds(currentList).filter((id) => selectedSessionIds.has(id));
  if (!ids.length) return;
  if (!await showConfirm(`\u9078\u629E\u3057\u305F${ids.length}\u4EF6\u306E\u30BB\u30C3\u30B7\u30E7\u30F3\u3068\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F`, { title: "\u8907\u6570\u306E\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u524A\u9664", confirmLabel: `${ids.length}\u4EF6\u3092\u524A\u9664`, danger: true })) return;
  SELECTORS.btnDeleteSessionSelection.disabled = true;
  try {
    const response = await fetch("/results", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    const deletedIds = new Set(payload.deleted || ids);
    selectedSessionIds = new Set([...selectedSessionIds].filter((id) => !deletedIds.has(id)));
    lastSelectedSessionId = null;
    renderSidebar(currentList.filter((item) => !deletedIds.has(item.id)));
  } catch (error) {
    await showAlert(`\u4E00\u62EC\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`, { title: "\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  } finally {
    SELECTORS.btnDeleteSessionSelection.disabled = false;
  }
};
var renameSession = async (item, currentList) => {
  if (!hasServer) {
    await showAlert("\u30B5\u30FC\u30D0\u30FC\u63A5\u7D9A\u304C\u5FC5\u8981\u3067\u3059", { title: "\u64CD\u4F5C\u3067\u304D\u307E\u305B\u3093" });
    return;
  }
  const title = (await showPrompt("\u30BB\u30C3\u30B7\u30E7\u30F3\u540D", item.title, { title: "\u30BB\u30C3\u30B7\u30E7\u30F3\u540D\u3092\u5909\u66F4" }))?.trim();
  if (!title || title === item.title) return;
  const nextList = currentList.map((entry) => entry.id === item.id ? { ...entry, title } : entry);
  renderSidebar(nextList);
  const previousData = currentId === item.id ? currentData : null;
  if (currentId === item.id) {
    currentData = { ...currentData, title };
    SELECTORS.topbarSong.textContent = title;
  }
  try {
    const response = await fetch(`/results/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "\u540D\u524D\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
    if (currentId === item.id) currentData = data;
  } catch (error) {
    renderSidebar(currentList);
    if (currentId === item.id && previousData) {
      currentData = previousData;
      SELECTORS.topbarSong.textContent = previousData.title || item.title;
    }
    await showAlert(error.message, { title: "\u540D\u524D\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F" });
  }
};
var queueStemGeneration = async (sessionId, { title = "", silent = false, refreshCurrent = false } = {}) => {
  if (!sessionId || !hasServer || staticLibraryMode) return null;
  if (refreshCurrent) {
    SELECTORS.btnGenerateStems.disabled = true;
    SELECTORS.stemStatus.className = "stem-status";
    SELECTORS.stemStatus.innerHTML = `<span class="spin"></span>\u751F\u6210\u4E2D`;
  }
  SELECTORS.status.className = "status";
  if (!silent) SELECTORS.status.innerHTML = `<span class="spin"></span>\u30D1\u30FC\u30C8\u3092\u751F\u6210\u4E2D...`;
  try {
    const response = await fetch(`/results/${sessionId}/stems`, { method: "POST" });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    trackQueuedJob(submitted.jobId, { label: `\u30D1\u30FC\u30C8\u751F\u6210 \xB7 ${title || sessionId}` });
    const data = await waitForJobResult(submitted.jobId);
    if (refreshCurrent || currentId === data.id) showResult(data, data.id);
    SELECTORS.status.className = "status ok";
    SELECTORS.status.textContent = "\u2713 \u30D1\u30FC\u30C8\u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F";
    SELECTORS.jobCard.hidden = false;
    SELECTORS.jobStage.textContent = "\u5B8C\u4E86";
    SELECTORS.jobMessage.textContent = "\u30D1\u30FC\u30C8\u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F";
    await loadHistory();
    return data;
  } catch (error) {
    stopJobPolling();
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = error.message;
    if (refreshCurrent || currentId === sessionId) {
      SELECTORS.stemStatus.className = "stem-status err";
      SELECTORS.stemStatus.textContent = error.message;
    }
    SELECTORS.jobCard.hidden = false;
    SELECTORS.jobStage.textContent = "\u30A8\u30E9\u30FC";
    SELECTORS.jobMessage.textContent = error.message;
    return null;
  } finally {
    if (refreshCurrent) SELECTORS.btnGenerateStems.disabled = false;
  }
};
var generateStems = async ({ silent = false } = {}) => queueStemGeneration(currentId, { title: currentData?.title || currentId, silent, refreshCurrent: true });
var doAnalyze = async (url, force = false, rangeOverride = null) => {
  if (!url) return;
  const videoId = extractVideoId(url);
  let range;
  try {
    range = rangeOverride || getAnalysisTimePayload();
  } catch (error) {
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = error.message;
    return;
  }
  SELECTORS.inputCard.hidden = false;
  SELECTORS.analyzeBtn.disabled = true;
  SELECTORS.status.className = "status";
  SELECTORS.status.innerHTML = `<span class="spin"></span>${force ? "\u518D\u89E3\u6790\u3092\u51E6\u7406\u4E00\u89A7\u3078\u8FFD\u52A0\u4E2D..." : "\u89E3\u6790\u3092\u51E6\u7406\u4E00\u89A7\u3078\u8FFD\u52A0\u4E2D..."} `;
  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, force, ...range })
    });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    SELECTORS.status.className = "status ok";
    SELECTORS.status.textContent = `\u2713 ${force ? "\u518D\u89E3\u6790" : "\u89E3\u6790"}\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F`;
    closeAnalysisDialog();
    trackQueuedJob(submitted.jobId, {
      label: `${force ? "\u518D\u89E3\u6790" : "\u89E3\u6790"} \xB7 YouTube\u52D5\u753B${range.startSec !== null || range.endSec !== null ? ` \xB7 ${range.startSec ?? 0}\u79D2\u2013${range.endSec ?? "\u672B\u5C3E"}` : ""}`,
      kind: "analysis",
      rangeLabel: range.startSec !== null || range.endSec !== null ? ` \xB7 ${range.startSec ?? 0}\u79D2\u2013${range.endSec ?? "\u672B\u5C3E"}` : "",
      onDone: async (data) => {
        if (!data) return;
        showResult(data, data.id);
        SELECTORS.status.className = data.cached ? "status ok" : "status";
        SELECTORS.status.textContent = data.cached ? "\u2713 \u4FDD\u5B58\u6E08\u307F\u306E\u89E3\u6790\u7D50\u679C\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F" : "\u2713 \u89E3\u6790\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F";
        await loadHistory();
        if (force || !hasStemAssets(data.assets)) {
          await queueStemGeneration(data.id, { title: data.title || data.id, silent: true });
        }
      },
      onError: (error) => {
        SELECTORS.status.className = "status err";
        SELECTORS.status.textContent = error.message;
      }
    });
  } catch (error) {
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = error.message;
  } finally {
    SELECTORS.analyzeBtn.disabled = false;
  }
};
var doAnalyzeFile = async (file) => {
  if (!file) return;
  if (!/\.(wav|m4a|mp3|flac|aac|ogg)$/i.test(file.name)) {
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = "WAV\u3001M4A\u3001MP3\u3001FLAC\u3001AAC\u3001OGG\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u3059";
    return;
  }
  if (file.size > 500 * 1024 * 1024) {
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = "\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u306F500MB\u4EE5\u4E0B\u306B\u3057\u3066\u304F\u3060\u3055\u3044";
    return;
  }
  SELECTORS.inputCard.hidden = false;
  SELECTORS.analyzeBtn.disabled = true;
  SELECTORS.btnAudioFile.disabled = true;
  SELECTORS.status.className = "status";
  SELECTORS.status.innerHTML = `<span class="spin"></span>\u300C${escapeHtml(file.name)}\u300D\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u3044\u307E\u3059...`;
  try {
    const body = new FormData();
    body.append("file", file, file.name);
    const response = await fetch("/analyze-file", { method: "POST", body });
    const submitted = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(submitted.detail || `\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC (${response.status})`);
    SELECTORS.status.className = "status ok";
    SELECTORS.status.textContent = "\u2713 \u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u306E\u89E3\u6790\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F";
    closeAnalysisDialog();
    trackQueuedJob(submitted.jobId, {
      label: `\u97F3\u58F0\u89E3\u6790 \xB7 ${file.name}`,
      onDone: async (data) => {
        if (!data) return;
        showResult(data, data.id);
        SELECTORS.status.className = "status ok";
        SELECTORS.status.textContent = "\u2713 \u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u306E\u89E3\u6790\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F";
        await loadHistory();
        if (!hasStemAssets(data.assets)) {
          await queueStemGeneration(data.id, { title: data.title || data.id, silent: true });
        }
      },
      onError: (error) => {
        SELECTORS.status.className = "status err";
        SELECTORS.status.textContent = error.message;
      }
    });
  } catch (error) {
    SELECTORS.status.className = "status err";
    SELECTORS.status.textContent = error.message;
  } finally {
    SELECTORS.analyzeBtn.disabled = false;
    SELECTORS.btnAudioFile.disabled = false;
    SELECTORS.audioFileInput.value = "";
  }
};
var detectServer = async () => {
  if (isPublishedR2Viewer) {
    hasServer = false;
    staticLibraryMode = true;
  } else {
    try {
      const response = await fetch("/healthz", { signal: AbortSignal.timeout(2e3) });
      hasServer = response.ok;
      staticLibraryMode = !hasServer && !!STATIC_MANIFEST_URL;
    } catch {
      hasServer = false;
      staticLibraryMode = !!STATIC_MANIFEST_URL;
    }
  }
  if (staticLibraryMode) {
    setActiveTab("structure");
    SELECTORS.inputCard.hidden = true;
    SELECTORS.offlineBadge.hidden = false;
    SELECTORS.offlineBadge.textContent = "\u30E9\u30A4\u30D6\u30E9\u30EA";
    SELECTORS.btnReanalyze.hidden = true;
    SELECTORS.btnCloudSync.hidden = true;
    SELECTORS.btnBpmSave.hidden = true;
    SELECTORS.btnAddFolder.hidden = true;
    SELECTORS.btnStorage.hidden = true;
    if (SELECTORS.btnJobHistory) SELECTORS.btnJobHistory.hidden = true;
    setScoreFeatureVisible(false);
    SELECTORS.status.className = "status ok";
    SELECTORS.status.textContent = "\u9759\u7684\u30E9\u30A4\u30D6\u30E9\u30EA\u30E2\u30FC\u30C9";
    return;
  }
  if (!hasServer) {
    SELECTORS.inputCard.hidden = true;
    SELECTORS.offlineBadge.hidden = false;
    SELECTORS.btnReanalyze.hidden = true;
    SELECTORS.btnCloudSync.hidden = true;
    SELECTORS.btnStorage.hidden = true;
    if (SELECTORS.btnJobHistory) SELECTORS.btnJobHistory.hidden = true;
    return;
  }
  SELECTORS.btnCloudSync.hidden = false;
  SELECTORS.btnStorage.hidden = false;
  if (SELECTORS.btnJobHistory) SELECTORS.btnJobHistory.hidden = false;
  SELECTORS.btnNewUrl.hidden = currentFeature === "score";
};
var renderDesktopSystemStatus = (status) => {
  if (!status?.desktop || !SELECTORS.desktopStatus) return;
  if (status.ready) {
    SELECTORS.desktopStatus.hidden = true;
    return;
  }
  SELECTORS.desktopStatus.hidden = false;
  SELECTORS.desktopStatus.classList.remove("ready");
  if (status.analysisMode === "cpu") {
    SELECTORS.desktopStatus.classList.remove("error");
    SELECTORS.desktopStatusAction.hidden = !status.cpuSetupSupported;
    SELECTORS.desktopStatusAction.dataset.setupKind = "cpu";
    SELECTORS.desktopStatusAction.textContent = "CPU\u89E3\u6790\u6A5F\u80FD\u3092\u8FFD\u52A0";
    SELECTORS.desktopStatusTitle.textContent = "CPU\u89E3\u6790\u6A5F\u80FD\u306E\u8FFD\u52A0\u304C\u5FC5\u8981\u3067\u3059";
    SELECTORS.desktopStatusMessage.textContent = status.message || "NVIDIA\u74B0\u5883\u306A\u3057\u3067\u4F7F\u3048\u308BCPU\u89E3\u6790\u6A5F\u80FD\u3092\u6E96\u5099\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
    return;
  }
  SELECTORS.desktopStatus.classList.toggle("error", !status.nvidia?.available);
  SELECTORS.desktopStatusAction.dataset.setupKind = "nvidia";
  SELECTORS.desktopStatusAction.hidden = !status.setupSupported;
  if (!status.nvidia?.available) {
    SELECTORS.desktopStatusTitle.textContent = "NVIDIA GPU\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093";
    SELECTORS.desktopStatusMessage.textContent = "NVIDIA\u30C9\u30E9\u30A4\u30D0\u30FC\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u307E\u305F\u306F\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
    SELECTORS.desktopStatusAction.textContent = "\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D";
    return;
  }
  if (!status.wsl?.available) {
    SELECTORS.desktopStatusTitle.textContent = "WSL2\u306E\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u304C\u5FC5\u8981\u3067\u3059";
    SELECTORS.desktopStatusMessage.textContent = `${status.nvidia.name}\u3092\u691C\u51FA\u3057\u307E\u3057\u305F\u3002\u89E3\u6790\u7528\u306EUbuntu\u74B0\u5883\u3092\u6E96\u5099\u3057\u307E\u3059\u3002`;
  } else if (!status.wsl.cudaAvailable) {
    SELECTORS.desktopStatusTitle.textContent = "WSL2\u304B\u3089GPU\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093";
    SELECTORS.desktopStatusMessage.textContent = "NVIDIA\u30C9\u30E9\u30A4\u30D0\u30FC\u3068Windows\u3092\u66F4\u65B0\u3057\u3001\u518D\u8D77\u52D5\u5F8C\u306B\u3082\u3046\u4E00\u5EA6\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  } else {
    SELECTORS.desktopStatusTitle.textContent = "CUDA\u89E3\u6790\u30E9\u30A4\u30D6\u30E9\u30EA\u3092\u6E96\u5099\u3057\u3066\u304F\u3060\u3055\u3044";
    SELECTORS.desktopStatusMessage.textContent = `${status.nvidia.name}\u3068WSL2 CUDA\u306F\u5229\u7528\u3067\u304D\u307E\u3059\u3002\u521D\u56DE\u306E\u307F\u89E3\u6790\u74B0\u5883\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3057\u307E\u3059\u3002`;
  }
  SELECTORS.desktopStatusAction.textContent = "NVIDIA\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7";
};
var refreshDesktopSystemStatus = async () => {
  if (!hasServer) return;
  try {
    const response = await fetch("/system/status");
    if (!response.ok) return;
    renderDesktopSystemStatus(await response.json());
  } catch {
  }
};
var startDesktopNvidiaSetup = async () => {
  SELECTORS.desktopStatusAction.disabled = true;
  try {
    const current = await fetch("/system/status").then((response2) => response2.json());
    if (!current.nvidia?.available) {
      await refreshDesktopSystemStatus();
      return;
    }
    const response = await fetch("/system/setup-nvidia", {
      method: "POST"
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || "\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u3092\u958B\u59CB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    SELECTORS.desktopStatusTitle.textContent = "NVIDIA\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u3092\u8D77\u52D5\u3057\u307E\u3057\u305F";
    SELECTORS.desktopStatusMessage.textContent = "\u5225\u30A6\u30A3\u30F3\u30C9\u30A6\u306E\u6848\u5185\u306B\u5F93\u3063\u3066\u304F\u3060\u3055\u3044\u3002\u5B8C\u4E86\u5F8C\u306BPracticeLab\u3092\u518D\u8D77\u52D5\u3057\u307E\u3059\u3002";
  } catch (error) {
    await showAlert(error.message, { title: "NVIDIA\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7" });
  } finally {
    SELECTORS.desktopStatusAction.disabled = false;
  }
};
var startDesktopCpuSetup = async () => {
  SELECTORS.settingsCpuSetup.disabled = true;
  SELECTORS.desktopStatusAction.disabled = true;
  try {
    const feature = SELECTORS.settingsFeatureCpu?.dataset.featureKey || (desktopSystemStatus?.platform === "Darwin" ? "mac-analysis" : "windows-cpu");
    const response = await fetch(`/features/${feature}/install`, { method: "POST" });
    const submitted = await response.json();
    if (!response.ok) throw new Error(submitted.detail || "CPU\u89E3\u6790\u6A5F\u80FD\u3092\u8FFD\u52A0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
    trackQueuedJob(submitted.jobId, {
      label: "CPU\u89E3\u6790\u6A5F\u80FD\u3092\u8FFD\u52A0",
      retainDone: true,
      onDone: async () => {
        await refreshDesktopSystemStatus();
        await refreshSettingsAnalysisStatus();
        await loadOptionalFeatures();
      }
    });
    SELECTORS.settingsAnalysisStatus.textContent = "CPU\u89E3\u6790\u6A5F\u80FD\u306E\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3092\u958B\u59CB\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u4E00\u89A7\u3067\u9032\u884C\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002";
  } catch (error) {
    await showAlert(error.message, { title: "CPU\u89E3\u6790\u6A5F\u80FD" });
  } finally {
    SELECTORS.settingsCpuSetup.disabled = false;
    SELECTORS.desktopStatusAction.disabled = false;
  }
};
var startDesktopAnalysisSetup = () => SELECTORS.desktopStatusAction?.dataset.setupKind === "cpu" ? startDesktopCpuSetup() : startDesktopNvidiaSetup();
var initDesktopUpdates = () => {
  const desktop = window.practiceLabDesktop;
  if (!desktop || !SELECTORS.desktopUpdate) return;
  let updateReady = false;
  const renderSettingsUpdateStatus = (status) => {
    if (!SELECTORS.settingsCheckUpdate || !SELECTORS.settingsUpdateStatus) return;
    const state = status?.state || "idle";
    SELECTORS.settingsCheckUpdate.disabled = ["checking", "available", "downloading"].includes(state);
    SELECTORS.settingsUpdateStatus.hidden = state === "idle";
    SELECTORS.settingsUpdateStatus.classList.toggle("ok", ["current", "downloaded"].includes(state));
    SELECTORS.settingsUpdateStatus.classList.toggle("error", state === "error");
    if (SELECTORS.settingsCheckUpdateLabel) {
      SELECTORS.settingsCheckUpdateLabel.textContent = state === "downloaded" ? "\u518D\u8D77\u52D5\u3057\u3066\u66F4\u65B0" : state === "manual" ? "\u6700\u65B0\u7248\u306E\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u958B\u304F" : "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u78BA\u8A8D";
    }
    if (state === "checking") SELECTORS.settingsUpdateStatus.textContent = "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u2026";
    else if (state === "current") SELECTORS.settingsUpdateStatus.textContent = "\u73FE\u5728\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u6700\u65B0\u3067\u3059\u3002";
    else if (state === "available") SELECTORS.settingsUpdateStatus.textContent = `\u30D0\u30FC\u30B8\u30E7\u30F3 ${status.version} \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u3066\u3044\u307E\u3059\u2026`;
    else if (state === "downloading") SELECTORS.settingsUpdateStatus.textContent = `\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u3066\u3044\u307E\u3059\u2026 ${status.percent || 0}%`;
    else if (state === "downloaded") SELECTORS.settingsUpdateStatus.textContent = `\u30D0\u30FC\u30B8\u30E7\u30F3 ${status.version} \u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F\u3002`;
    else if (state === "unsupported") SELECTORS.settingsUpdateStatus.textContent = status.message || "\u958B\u767A\u7248\u3067\u306F\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002";
    else if (state === "manual") SELECTORS.settingsUpdateStatus.textContent = status.message || "\u6700\u65B0\u7248\u306E\u914D\u5E03\u30DA\u30FC\u30B8\u3092\u958B\u304D\u307E\u3057\u305F\u3002";
    else if (state === "error") {
      const message = String(status.message || "");
      SELECTORS.settingsUpdateStatus.textContent = /404|latest[^\s]*\.yml|no published|release/i.test(message) ? "\u516C\u958B\u6E08\u307F\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002" : "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u6642\u9593\u3092\u304A\u3044\u3066\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
    }
  };
  desktop.onUpdateStatus((status) => {
    updateReady = status.state === "downloaded" ? true : updateReady;
    renderSettingsUpdateStatus(status);
    if (status.state === "available" || status.state === "downloading") {
      SELECTORS.desktopUpdate.hidden = false;
      SELECTORS.desktopUpdate.disabled = true;
      SELECTORS.desktopUpdate.textContent = status.state === "downloading" ? `\u66F4\u65B0\u3092\u53D6\u5F97\u4E2D ${status.percent || 0}%` : `v${status.version}\u3092\u53D6\u5F97\u4E2D`;
    } else if (status.state === "downloaded") {
      SELECTORS.desktopUpdate.hidden = false;
      SELECTORS.desktopUpdate.disabled = false;
      SELECTORS.desktopUpdate.textContent = `v${status.version}\u3078\u518D\u8D77\u52D5\u3057\u3066\u66F4\u65B0`;
    } else if (status.state === "error") {
      console.warn("Desktop update check failed", status.message);
    }
  });
  SELECTORS.desktopUpdate.addEventListener("click", () => desktop.installUpdate());
  SELECTORS.settingsCheckUpdate?.addEventListener("click", async () => {
    if (updateReady) {
      await desktop.installUpdate();
      return;
    }
    renderSettingsUpdateStatus({ state: "checking" });
    const result = await desktop.checkForUpdates();
    if (["error", "unsupported", "manual", "current", "downloaded"].includes(result?.state)) renderSettingsUpdateStatus(result);
  });
};
var initDesktopCommands = () => {
  const desktop = window.practiceLabDesktop;
  if (!desktop?.onCommand) return;
  desktop.onCommand((command) => {
    if (command === "new-analysis") {
      setActiveTab("structure");
      openAnalysisDialog();
    } else if (command === "open-audio") {
      setActiveTab("structure");
      openAnalysisDialog({ openAudioPicker: true });
    } else if (command === "open-settings") {
      void openSettings("general");
    } else if (command === "about") {
      void openSettings("about");
    }
  });
};
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideContextMenu();
    setVideoFullscreen(false);
    closeMobileSidebar();
  }
  if (event.key === "Escape" && customLoopRange) {
    clearCustomLoopRange();
    return;
  }
  if (event.code === "Space" && event.target.tagName !== "INPUT") {
    event.preventDefault();
    if (currentFeature !== "structure") return;
    togglePlayback();
  }
  if (event.shiftKey && event.target.tagName !== "INPUT" && (event.key === ">" || event.code === "Period")) {
    event.preventDefault();
    nudgePlaybackRate(PLAYBACK_RATE_STEP);
    return;
  }
  if (event.shiftKey && event.target.tagName !== "INPUT" && (event.key === "<" || event.code === "Comma")) {
    event.preventDefault();
    nudgePlaybackRate(-PLAYBACK_RATE_STEP);
    return;
  }
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && event.target.tagName !== "INPUT") {
    if (currentFeature !== "structure" || !ws) return;
    event.preventDefault();
    seekAudio(ws.getCurrentTime() + (event.key === "ArrowRight" ? 5 : -5));
  }
});
document.addEventListener("click", hideContextMenu);
SELECTORS.contextMenu?.addEventListener("click", (event) => event.stopPropagation());
SELECTORS.analyzeBtn.addEventListener("click", () => doAnalyze(SELECTORS.urlInput.value.trim(), analysisForce));
SELECTORS.analysisDialogClose?.addEventListener("click", closeAnalysisDialog);
SELECTORS.analysisTimeMode.addEventListener("change", () => {
  SELECTORS.analysisTimeRange.hidden = SELECTORS.analysisTimeMode.value !== "range";
});
SELECTORS.btnAudioFile.addEventListener("click", () => SELECTORS.audioFileInput.click());
SELECTORS.audioFileInput.addEventListener("change", () => doAnalyzeFile(SELECTORS.audioFileInput.files?.[0]));
var audioDragDepth = 0;
SELECTORS.inputCard.addEventListener("dragenter", (event) => {
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
  audioDragDepth += 1;
  SELECTORS.inputCard.classList.add("audio-drag");
});
SELECTORS.inputCard.addEventListener("dragover", (event) => {
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});
SELECTORS.inputCard.addEventListener("dragleave", () => {
  audioDragDepth = Math.max(0, audioDragDepth - 1);
  if (!audioDragDepth) SELECTORS.inputCard.classList.remove("audio-drag");
});
SELECTORS.inputCard.addEventListener("drop", (event) => {
  event.preventDefault();
  audioDragDepth = 0;
  SELECTORS.inputCard.classList.remove("audio-drag");
  doAnalyzeFile(event.dataTransfer?.files?.[0]);
});
SELECTORS.scoreProcessingMode?.addEventListener("change", syncScoreOptionAvailability);
SELECTORS.btnCloudSync?.addEventListener("click", syncCloudLibrary);
SELECTORS.btnStorage?.addEventListener("click", openStorageSettings);
SELECTORS.btnJobHistory?.addEventListener("click", openJobHistory);
SELECTORS.jobHistoryRefresh?.addEventListener("click", loadJobHistory);
SELECTORS.btnSettings?.addEventListener("click", () => openSettings("general"));
SELECTORS.btnTopSettings?.addEventListener("click", () => openSettings("general"));
SELECTORS.settingsClose?.addEventListener("click", closeSettings);
SELECTORS.settingsCancel?.addEventListener("click", closeSettings);
SELECTORS.settingsSave?.addEventListener("click", saveSettings);
SELECTORS.settingsCloudExport?.addEventListener("click", exportCloudConnection);
SELECTORS.settingsCloudImport?.addEventListener("click", importCloudConnection);
SELECTORS.settingsCloudEnabled?.addEventListener("change", syncCloudFieldsState);
SELECTORS.settingsDialog?.querySelectorAll("[data-settings-section]").forEach((button) => {
  button.addEventListener("click", () => {
    selectSettingsSection(button.dataset.settingsSection);
    if (button.dataset.settingsSection === "analysis") void refreshSettingsAnalysisStatus();
    if (button.dataset.settingsSection === "features") void loadOptionalFeatures();
    if (button.dataset.settingsSection === "storage") void loadStorageReport();
    if (button.dataset.settingsSection === "history") void loadJobHistory();
  });
});
SELECTORS.settingsOpenData?.addEventListener("click", () => window.practiceLabDesktop?.openDataFolder());
SELECTORS.settingsStorageRefresh?.addEventListener("click", loadStorageReport);
SELECTORS.settingsNvidiaSetup?.addEventListener("click", startDesktopNvidiaSetup);
SELECTORS.settingsCpuSetup?.addEventListener("click", startDesktopCpuSetup);
SELECTORS.settingsFeatureCpuInstall?.addEventListener("click", startDesktopCpuSetup);
SELECTORS.settingsFeatureCpuRemove?.addEventListener("click", () => removeOptionalFeature(
  SELECTORS.settingsFeatureCpu?.dataset.featureKey || "windows-cpu"
));
SELECTORS.settingsFeatureScoreInstall?.addEventListener("click", startScoreFeatureSetup);
SELECTORS.settingsFeatureScoreRemove?.addEventListener("click", () => removeOptionalFeature("score"));
SELECTORS.storageList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-storage-clean]");
  if (button) cleanStorageCategory(button.dataset.storageClean);
});
SELECTORS.btnEditSections?.addEventListener("click", openSectionEditor);
SELECTORS.btnSaveSections?.addEventListener("click", saveSectionEditor);
SELECTORS.btnRestoreSections?.addEventListener("click", restoreAutomaticSections);
SELECTORS.sectionEditorPreview?.addEventListener("click", previewSelectedSection);
SELECTORS.sectionEditorPlayerToggle?.addEventListener("click", toggleSectionEditorPlayback);
SELECTORS.sectionEditorScrub?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  if (!beginSectionEditorScrub(event.clientX)) return;
  sectionEditorScrubPointerId = event.pointerId;
  SELECTORS.sectionEditorScrub.setPointerCapture?.(event.pointerId);
});
SELECTORS.sectionEditorScrub?.addEventListener("pointermove", (event) => {
  if (sectionEditorScrubPointerId !== event.pointerId) return;
  previewSectionEditorScrub(event.clientX);
});
var finishSectionEditorScrub = (event) => {
  if (sectionEditorScrubPointerId !== event.pointerId) return;
  sectionEditorScrubPointerId = null;
  SELECTORS.sectionEditorScrub.releasePointerCapture?.(event.pointerId);
  previewSectionEditorScrub(event.clientX);
  finishSectionEditorSilentScrub();
};
SELECTORS.sectionEditorScrub?.addEventListener("pointerup", finishSectionEditorScrub);
SELECTORS.sectionEditorScrub?.addEventListener("pointercancel", finishSectionEditorScrub);
var handleSectionEditorScrubKey = (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || !canPlayAudio()) return;
  event.preventDefault();
  const duration = ws?.getDuration?.() || 0;
  const next = event.key === "Home" ? 0 : event.key === "End" ? duration : ws.getCurrentTime() + (event.key === "ArrowRight" ? 5 : -5);
  stopSectionEditorPreview({ pause: false });
  seekAudio(Math.max(0, Math.min(duration, next)), { respectLoopRange: false });
};
SELECTORS.sectionEditorScrub?.addEventListener("keydown", handleSectionEditorScrubKey);
SELECTORS.sectionEditorPlayhead?.addEventListener("keydown", handleSectionEditorScrubKey);
SELECTORS.sectionEditorPlayhead?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  if (!beginSectionEditorScrub(event.clientX)) return;
  sectionEditorPlayheadPointerId = event.pointerId;
  SELECTORS.sectionEditorPlayhead.classList.add("dragging");
  SELECTORS.sectionEditorPlayhead.setPointerCapture?.(event.pointerId);
});
SELECTORS.sectionEditorPlayhead?.addEventListener("pointermove", (event) => {
  if (sectionEditorPlayheadPointerId !== event.pointerId) return;
  previewSectionEditorScrub(event.clientX);
});
var finishSectionEditorPlayheadDrag = (event) => {
  if (sectionEditorPlayheadPointerId !== event.pointerId) return;
  sectionEditorPlayheadPointerId = null;
  SELECTORS.sectionEditorPlayhead.classList.remove("dragging");
  SELECTORS.sectionEditorPlayhead.releasePointerCapture?.(event.pointerId);
  previewSectionEditorScrub(event.clientX);
  finishSectionEditorSilentScrub();
};
SELECTORS.sectionEditorPlayhead?.addEventListener("pointerup", finishSectionEditorPlayheadDrag);
SELECTORS.sectionEditorPlayhead?.addEventListener("pointercancel", finishSectionEditorPlayheadDrag);
SELECTORS.sectionEditor?.addEventListener("close", () => {
  sectionEditorScrubPointerId = null;
  sectionEditorPlayheadPointerId = null;
  sectionEditorScrubState = null;
  SELECTORS.sectionEditorPlayhead?.classList.remove("dragging");
  stopSectionEditorPreview();
});
SELECTORS.sectionEditor?.addEventListener("click", (event) => {
  const segment = event.target.closest("[data-section-index]");
  if (segment && !event.target.closest("[data-boundary-index]")) {
    stopSectionEditorPreview({ pause: false });
    syncSectionEditorSelectionFromFields();
    sectionEditorSelectedIndex = Number(segment.dataset.sectionIndex);
    renderSectionEditor();
    return;
  }
  const button = event.target.closest("[data-section-action]");
  if (!button) return;
  applySectionDraftAction(sectionEditorSelectedIndex, button.dataset.sectionAction);
});
SELECTORS.sectionEditorLabel?.addEventListener("change", () => {
  syncSectionEditorSelectionFromFields();
  renderSectionEditor();
});
SELECTORS.sectionEditorStart?.addEventListener("change", () => updateSectionEditorSelectedBounds("start", Number(SELECTORS.sectionEditorStart.value)));
SELECTORS.sectionEditorEnd?.addEventListener("change", () => updateSectionEditorSelectedBounds("end", Number(SELECTORS.sectionEditorEnd.value)));
SELECTORS.sectionEditorRows?.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-boundary-index]");
  if (!handle) return;
  event.preventDefault();
  stopSectionEditorPreview({ pause: false });
  syncSectionEditorSelectionFromFields();
  sectionEditorBoundaryDrag = { pointerId: event.pointerId, boundaryIndex: Number(handle.dataset.boundaryIndex) };
  SELECTORS.sectionEditorRows.setPointerCapture?.(event.pointerId);
  SELECTORS.sectionEditorRows.classList.add("dragging-boundary");
});
SELECTORS.sectionEditorRows?.addEventListener("pointermove", (event) => {
  if (!sectionEditorBoundaryDrag || sectionEditorBoundaryDrag.pointerId !== event.pointerId) return;
  const rect = SELECTORS.sectionEditorRows.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  updateSectionEditorBoundary(sectionEditorBoundaryDrag.boundaryIndex, ratio * sectionEditorTotalBars());
  renderSectionEditor();
});
var finishSectionEditorBoundaryDrag = (event) => {
  if (!sectionEditorBoundaryDrag || sectionEditorBoundaryDrag.pointerId !== event.pointerId) return;
  sectionEditorBoundaryDrag = null;
  SELECTORS.sectionEditorRows.releasePointerCapture?.(event.pointerId);
  SELECTORS.sectionEditorRows.classList.remove("dragging-boundary");
};
SELECTORS.sectionEditorRows?.addEventListener("pointerup", finishSectionEditorBoundaryDrag);
SELECTORS.sectionEditorRows?.addEventListener("pointercancel", finishSectionEditorBoundaryDrag);
SELECTORS.sessionSearch?.addEventListener("input", () => renderSidebar(currentSidebarItems));
SELECTORS.sessionSort?.addEventListener("change", () => {
  saveCfg("librarySort", SELECTORS.sessionSort.value);
  renderSidebar(currentSidebarItems);
});
SELECTORS.queueList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-job-id]");
  if (!button) return;
  if (button.dataset.jobAction === "view-score") {
    const item = trackedJobs.get(button.dataset.jobId);
    const result = item?.status?.result;
    if (!result) return;
    renderScoreOutputs(result);
    SELECTORS.scoreResult.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (button.dataset.jobAction === "resume") {
    resumeQueuedJob(button.dataset.jobId);
    return;
  }
  if (button.dataset.jobAction === "discard") {
    discardInterruptedJob(button.dataset.jobId).catch((error) => showAlert(error.message, { title: "\u51E6\u7406\u4E00\u89A7" }));
    return;
  }
  cancelQueuedJob(button.dataset.jobId);
});
SELECTORS.queueClearInterrupted?.addEventListener("click", discardAllInterruptedJobs);
SELECTORS.queueToggle?.addEventListener("click", () => {
  setQueueMinimized(!SELECTORS.queueDock.classList.contains("minimized"));
});
setQueueMinimized(localStorage.getItem(QUEUE_MINIMIZED_KEY) === "1", { persist: false });
SELECTORS.scoreRegenerateBtn?.addEventListener("click", () => regenerateScore());
SELECTORS.scoreEditSettingsBtn?.addEventListener("click", () => editScoreSettings());
SELECTORS.scoreHistoryList?.addEventListener("click", async (event) => {
  const remove = event.target.closest("[data-score-history-remove]");
  if (remove) {
    event.stopPropagation();
    removeScoreHistory(remove.dataset.scoreHistoryRemove);
    return;
  }
  const edit = event.target.closest("[data-score-history-edit]");
  if (edit) {
    event.stopPropagation();
    const item2 = getScoreHistory().find((entry) => entry.id === edit.dataset.scoreHistoryEdit);
    if (!item2?.result) return;
    const result2 = await fetchLatestScoreResult(item2.result);
    if (result2 !== item2.result) updateScoreHistoryResult(item2.id, result2);
    renderScoreOutputs(result2);
    closeMobileSidebar();
    await editScoreSettings(result2);
    return;
  }
  const regenerate = event.target.closest("[data-score-history-regenerate]");
  if (regenerate) {
    event.stopPropagation();
    const item2 = getScoreHistory().find((entry) => entry.id === regenerate.dataset.scoreHistoryRegenerate);
    if (!item2?.result) return;
    const result2 = await fetchLatestScoreResult(item2.result);
    if (result2 !== item2.result) updateScoreHistoryResult(item2.id, result2);
    renderScoreOutputs(result2);
    closeMobileSidebar();
    await regenerateScore(result2);
    return;
  }
  const row = event.target.closest("[data-score-history-id]");
  if (!row) return;
  const item = getScoreHistory().find((entry) => entry.id === row.dataset.scoreHistoryId);
  if (!item?.result) return;
  const result = await fetchLatestScoreResult(item.result);
  if (result !== item.result) updateScoreHistoryResult(item.id, result);
  renderScoreOutputs(result);
  SELECTORS.scoreResult.scrollIntoView({ behavior: "smooth", block: "start" });
  closeMobileSidebar();
});
SELECTORS.scoreHistoryList?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const row = event.target.closest("[data-score-history-id]");
  if (!row) return;
  event.preventDefault();
  row.click();
});
SELECTORS.urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") doAnalyze(SELECTORS.urlInput.value.trim(), analysisForce);
});
SELECTORS.desktopStatusAction?.addEventListener("click", startDesktopAnalysisSetup);
lucide.createIcons();
syncScoreOptionAvailability();
renderScoreHistory();
await detectServer();
if (SELECTORS.btnTopSettings) {
  SELECTORS.btnTopSettings.hidden = !window.practiceLabDesktop?.getSettings || staticLibraryMode;
}
initDesktopUpdates();
initDesktopCommands();
await refreshCloudStatus();
if (window.practiceLabDesktop?.getSettings) setScoreFeatureVisible(false);
await loadOptionalFeatures();
await loadSharedFolders();
var initialHistory = await loadHistory();
void refreshDesktopSystemStatus();
await restoreInterruptedJobs();
await restoreLastStructureSession(initialHistory);
void verifySavedCloudSettings();
/*! Bundled license information:

lucide/dist/esm/createElement.js:
lucide/dist/esm/replaceElement.js:
lucide/dist/esm/defaultAttributes.js:
lucide/dist/esm/icons/audio-waveform.js:
lucide/dist/esm/icons/cloud-upload.js:
lucide/dist/esm/icons/download.js:
lucide/dist/esm/icons/file-audio.js:
lucide/dist/esm/icons/folder-plus.js:
lucide/dist/esm/icons/gauge.js:
lucide/dist/esm/icons/hard-drive.js:
lucide/dist/esm/icons/history.js:
lucide/dist/esm/icons/list-end.js:
lucide/dist/esm/icons/maximize.js:
lucide/dist/esm/icons/music-2.js:
lucide/dist/esm/icons/music.js:
lucide/dist/esm/icons/panel-left.js:
lucide/dist/esm/icons/pause.js:
lucide/dist/esm/icons/play.js:
lucide/dist/esm/icons/plus.js:
lucide/dist/esm/icons/refresh-cw.js:
lucide/dist/esm/icons/repeat-2.js:
lucide/dist/esm/icons/rotate-ccw.js:
lucide/dist/esm/icons/settings-2.js:
lucide/dist/esm/icons/skip-back.js:
lucide/dist/esm/icons/square.js:
lucide/dist/esm/icons/timer.js:
lucide/dist/esm/icons/trash-2.js:
lucide/dist/esm/icons/upload.js:
lucide/dist/esm/icons/volume-2.js:
lucide/dist/esm/icons/volume-x.js:
lucide/dist/esm/icons/x.js:
lucide/dist/esm/icons/youtube.js:
lucide/dist/esm/lucide.js:
  (**
   * @license lucide v0.468.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
