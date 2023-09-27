const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}

webgl.clearColor(0.1, 0.3, 0.1, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);
const vertices = new Float32Array([0, 1, -1, -1, 1, -1]);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);

webgl.shaderSource(
  vertexShader,
  `attribute vec2 pos;
    uniform float shiftX;
    uniform float shiftY;
    void main() { gl_Position = vec4(pos*0.05,0,1)+ vec4(shiftX,shiftY,0,0)+ vec4(-0.97,0,0,0); }`
);

webgl.compileShader(vertexShader);
const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `void main() { gl_FragColor = vec4(1,0,0,1); }`
);
webgl.compileShader(fragmentShader);
const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);
const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

const uniformLocationX = webgl.getUniformLocation(program, `shiftX`);
const uniformLocationY = webgl.getUniformLocation(program, `shiftY`);

let myshift_x = 0;
let myshift_y = 0;

let shift1 = 0.01;

let up = 0;
let start = 1;

draw();
function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  if (start == 1) {
    if (up == 1) {
      myshift_y += shift1;
    } else {
      myshift_x += shift1;
    }
  }

  if (myshift_x >= 1.9) {
    shift1 *= -1;
  }
  if (myshift_x < 0) {
    shift1 *= -1;
  }
  if (myshift_y >= 0.97) {
    shift1 *= -1;
  }
  if (myshift_y < -0.95) {
    shift1 *= -1;
  }

  webgl.uniform1f(uniformLocationX, myshift_x);
  webgl.uniform1f(uniformLocationY, myshift_y);

  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
  window.requestAnimationFrame(draw);
}

function stop() {
  start = 0;
}

function start1() {
  start = 1;
}

function up1() {
  up = 1;
}
