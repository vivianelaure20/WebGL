const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(0.7, 1, 0.2, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);

var vertices = new Float32Array([0, 1, -1, -1, 1, -1]);
var colors = new Float32Array([1, 1, 0, 1, 0, 0, 0, 0, 1]);

const buffer = webgl.createBuffer();
const colorBuffer = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec2 pos;  //vertices 
attribute vec3 color;   //color
varying vec3 fragcolor;  //bring to the fragment shader
uniform float shift,shiftX,shiftY,startX,startY;
float x,y;

void main() { 
    x=pos.x*cos(shift)-pos.y*sin(shift);
    y=pos.x*sin(shift)+pos.y*cos(shift);

    fragcolor =color; 
    gl_Position = vec4(x*0.05,y*0.05,0,1)+ vec4(shiftX,shiftY,0,0)+ vec4(startX,startY,0,0); }`
); //vertices

webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
  console.error(
    "Error compiling vertex shader",
    webgl.getShaderInfoLog(vertexShader)
  );
}
const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `precision mediump float;
varying vec3 fragcolor;  //color 
void main() { gl_FragColor = vec4(fragcolor,1); }`
);

if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
  console.error(
    "Error compiling fragment shader",
    webgl.getShaderInfoLog(fragmentShader)
  );
}
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`); //vertices
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);
const colorLocation = webgl.getAttribLocation(program, `color`); //color
webgl.enableVertexAttribArray(colorLocation);
webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 0, 0);

let myshift = -1;
let start = 1;
let up = 0;
let moveX = 0;
let moveY = 0;

let myshiftXY = 0.01;

draw();
function draw() {
  /* if(start==1){
    myshift+=0.1
    }
    */
  if (start == 1) {
    if (up == 1) {
      myshift += 0.1;
      moveY += myshiftXY;
    } else {
      myshift += 0.1;
      moveX += myshiftXY;
    }
  }
  if (moveX >= 1.85) {
    myshiftXY *= -1;
  }
  if (moveX < -0.05) {
    myshiftXY *= -1;
  }
  if (moveY >= 0.95) {
    myshiftXY *= -1;
  }
  if (moveY < -0.95) {
    myshiftXY *= -1;
  }
  // if (moveX>=1.85){
  //   myshiftXY*=-1;
  //   }
  //  if (moveX<-0.05){
  //   myshiftXY*=-1;
  //   }
  //  if (moveY>=1.85){
  //   myshiftXY*=-1;
  //   }
  //  if (moveY<-0.05){
  //   myshiftXY*=-1;
  //   }
  webgl.uniform1f(webgl.getUniformLocation(program, `shift`), myshift);
  webgl.uniform1f(webgl.getUniformLocation(program, `shiftX`), moveX);
  webgl.uniform1f(webgl.getUniformLocation(program, `shiftY`), moveY);
  webgl.uniform1f(webgl.getUniformLocation(program, `startX`), -0.9);
  webgl.uniform1f(webgl.getUniformLocation(program, `startY`), 0);
  // webgl.uniform1f(webgl.getUniformLocation(program,`startX`),-0.9);
  // webgl.uniform1f(webgl.getUniformLocation(program,`startY`),-0.9);

  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
  window.requestAnimationFrame(draw);
}
function stop() {
  start = 0;
}
function start1() {
  start = 1;
}
function upanddown() {
  up = 1;
}

//webgl.useProgram(program);
//webgl.drawArrays(webgl.TRIANGLES, 0, 3);
