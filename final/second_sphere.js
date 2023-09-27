const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(0, 1, 0.2, 0.3);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const jsarray = [0, 0, 0];
var x, y, z;
var deltaP = (2 * Math.PI) / 60;
var arch = 2 * Math.PI;
for (z = -1; z <= 1; z += 0.1) {
  var r = Math.cos(z * (Math.PI / 2));

  for (p = 0; p <= arch; p += deltaP) {
    x = r * Math.cos(p);
    y = r * Math.sin(p);

    jsarray.push(x);
    jsarray.push(y);
    jsarray.push(z);
  }
}

const vertices = new Float32Array(jsarray);
const buffer = webgl.createBuffer();

const colors = new Float32Array(jsarray);
const colorBuffer = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec3 pos;
    attribute vec3 color;   //color
       varying vec3 fragcolor;
    void main() { 
        gl_PointSize= 3.0; 
        gl_Position = vec4(pos*0.25,1)+ vec4(0.5, 0,0,0);
        fragcolor =color; 
       }`
);
webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `precision mediump float;
        varying vec3 fragcolor;   
        void main() { gl_FragColor = vec4(fragcolor,1);}`
);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);

webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);

const colorLocation = webgl.getAttribLocation(program, `color`); //color
webgl.enableVertexAttribArray(colorLocation);
webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 0, 0);

draw();
function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.drawArrays(webgl.TRIANGLE_FAN, 0, jsarray.length / 3);
  window.requestAnimationFrame(draw);
}
