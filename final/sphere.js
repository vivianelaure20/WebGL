//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const canvas1 = document.getElementById("mycanvas");
const gl = canvas1.getContext(`webgl`);
if (!gl) {
  throw new Error("WebGL NOT supported by this browser");
}
gl.clearColor(0.4, 0.8, 0.1, 0.5);
gl.clear(gl.COLOR_BUFFER_BIT);
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

const colors = new Float32Array(jsarray);

const buffer1 = gl.createBuffer();
const vertices2 = new Float32Array(jsarray);

gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);

const vertexShader1 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader1,
  `attribute vec3 pos;
	uniform float shiftX;
	uniform float shiftY;
    uniform mat4 model;
	attribute vec3 color;
	varying vec3 fragcolor;

	
    void main()
    {
        gl_PointSize= 3.0; 
	   gl_Position = model*vec4(pos*0.25,1)+vec4(shiftX,0.25,0,0);  
	   fragcolor = color; 
    }`
);

gl.compileShader(vertexShader1);

const fragmentShader1 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader1,
  `
	precision mediump float;
	varying vec3 fragcolor;

	void main()
    {
      
       	   gl_FragColor = vec4(fragcolor,1);
    }`
);
gl.compileShader(fragmentShader1);
if (!gl.getShaderParameter(fragmentShader1, gl.COMPILE_STATUS)) {
  console.error(
    "Error compiling fragment Shader",
    gl.getShaderInfoLog(fragmentShader1)
  );
}

const program1 = gl.createProgram();
gl.attachShader(program1, vertexShader1);
gl.attachShader(program1, fragmentShader1);
gl.linkProgram(program1);
gl.useProgram(program1);
gl.enable(gl.DEPTH_TEST);

const positionLocation1 = gl.getAttribLocation(program1, `pos`); //getting pos location
gl.enableVertexAttribArray(positionLocation1);
gl.vertexAttribPointer(positionLocation1, 3, gl.FLOAT, false, 0, 0);

const colorLocation1 = gl.getAttribLocation(program1, `color`); //getting pos location
gl.enableVertexAttribArray(colorLocation1);
gl.vertexAttribPointer(colorLocation1, 3, gl.FLOAT, false, 0, 0);

const uniformLocationX = gl.getUniformLocation(program1, `shiftX`);
const uniformLocationY = gl.getUniformLocation(program1, `shiftY`);
const rotate = gl.getUniformLocation(program1, `model`);

let myShiftX = 0;
let myShiftY = 0;
let rotateX = 0;

let shift1 = 0.01;
let up = 0;
let start = 1;
draw();
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (start == 1) {
    rotateX = rotateX + 0.1;
    myShiftX += shift1;
  }

  if (myShiftX >= -0.75) {
    shift1 *= -1;
  }
  if (myShiftX <= 0.75) {
    shift1 *= -1;
  }
  if (myShiftY >= 0.95) {
    shift1 *= -1;
  }
  if (myShiftY < -0) {
    shift1 *= -1;
  }

  gl.uniform1f(uniformLocationX, myShiftX);
  gl.uniform1f(uniformLocationY, myShiftY);
  gl.uniformMatrix4fv(rotate, false, rotationY(rotateX));

  gl.drawArrays(webgl.POINTS, 0, jsarray.length / 3);

  window.requestAnimationFrame(draw);
}

function rotationX(angleInRadian) {
  var c = Math.cos(angleInRadian);
  var s = Math.sin(angleInRadian);
  var r = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  return r;
}
function rotationY(angleInRadian) {
  var c = Math.cos(angleInRadian);
  var s = Math.sin(angleInRadian);
  var r = new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  return r;
}
