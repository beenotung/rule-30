document.title = 'rule 30';

let style: HTMLStyleElement = document.createElement('style');
style.textContent = `
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
`;
document.body.appendChild(style);

let canvas: HTMLCanvasElement = document.createElement('canvas');
document.body.appendChild(canvas);
let w = canvas.width = screen.availWidth;
let h = canvas.height = screen.availHeight;
let context = canvas.getContext("2d");
let imageData = context.createImageData(w, h);

function render() {
  context.putImageData(imageData, 0, 0);
}

function setPixel(x, y, isBlack) {
  let offset = (x + y * w) * 4;
  let color = isBlack ? 0 : 255;
  imageData.data[offset + 0] = color;
  imageData.data[offset + 1] = color;
  imageData.data[offset + 2] = color;
  imageData.data[offset + 3] = 255;
}

let {round} = Math;
let x = 0;
/* x -> y -> isBlack */
let halfH = round(h / 2);
let states: number[][] = [[]];
states[0][halfH] = 1;
setPixel(0, halfH, 1);
let startY = halfH;
let endY = halfH;

/* -1 -> 0 -> 1 -> result */
let rules: number[][][] = [];
for (let r1 = 0; r1 < 2; r1++) {
  rules[r1] = [];
  for (let r2 = 0; r2 < 2; r2++) {
    rules[r1][r2] = [];
    for (let r3 = 0; r3 < 2; r3++) {
      rules[r1][r2][r3] = 0;
    }
  }
}
rules[1][0][0] = 1;
rules[0][1][1] = 1;
rules[0][1][0] = 1;
rules[0][0][1] = 1;

function getPrevRule(x, y) {
  x--;
  let s = states[x];
  return [
    s[y - 1] || 0,
    s[y] || 0,
    s[y + 1] || 0,
  ]
}

function getResult(x, y) {
  let [r1, r2, r3] = getPrevRule(x, y);
  return rules[r1][r2][r3];
}

let isStop = false;

function update() {
  // if (x === w) {
  //   isStop = true;
  //   return
  // }
  x++;
  startY--;
  endY++;
  states.push([]);
  let screenX = x % w;
  for (let y = startY; y <= endY; y++) {
    let isBlack = getResult(x, y);
    states[x][y] = isBlack;
    if (y >= 0 && y <= h) {
      setPixel(screenX, y, isBlack);
    }
  }
  render();
}

// let timer = setInterval(update, 1000 / 30);
// update();
function loop() {
  if (isStop) {
    return
  }
  update();
  requestAnimationFrame(loop)
}

loop();
