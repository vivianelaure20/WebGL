const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.clearColor(1, 0.9, 0.9, 1);

if (!webgl) {
  throw new Error("WebGL NOT supported by this browser");
}

var r = 0.5;
let image = document.getElementById("myImage");

var vertices1 = new Float32Array([
  //front
  r,
  r,
  r,
  r,
  -r,
  r,
  -r,
  r,
  r,
  -r,
  r,
  r,
  r,
  -r,
  r,
  -r,
  -r,
  r,

  //back
  r,
  r,
  -r,
  r,
  -r,
  -r,
  -r,
  r,
  -r,
  -r,
  r,
  -r,
  r,
  -r,
  -r,
  -r,
  -r,
  -r,

  //top
  r,
  r,
  r,
  -r,
  r,
  r,
  -r,
  r,
  -r,
  r,
  r,
  r,
  -r,
  r,
  -r,
  r,
  r,
  -r,

  //bottom
  r,
  -r,
  r,
  -r,
  -r,
  r,
  -r,
  -r,
  -r,
  r,
  -r,
  r,
  -r,
  -r,
  -r,
  r,
  -r,
  -r,

  //left
  -r,
  -r,
  r,
  -r,
  r,
  r,
  -r,
  -r,
  -r,
  -r,
  -r,
  -r,
  -r,
  r,
  r,
  -r,
  r,
  -r,

  //right
  r,
  -r,
  r,
  r,
  r,
  r,
  r,
  -r,
  -r,
  r,
  -r,
  -r,
  r,
  r,
  r,
  r,
  r,
  -r,
]);

const jsarray = [0, 0, 0];
var x, y, z;
var deltaP = (2 * Math.PI) / 64;
var arch = 2 * Math.PI;
var r;
var zincrement = 0.1;
for (z = -1; z <= 1; z += 0.1) {
  r = Math.cos(z * (Math.PI / 2));

  for (p = 0; p <= arch; p += deltaP) {
    x = r * Math.cos(p);
    y = r * Math.sin(p);

    jsarray.push(x);
    jsarray.push(y);
    jsarray.push(z);
  }
}

const vertices1 = new Float32Array(jsarray);
const buffer1 = webgl.createBuffer();

const positionBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
//webgl.bufferData(webgl.ARRAY_BUFFER, vertices,webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
	attribute vec3 pos;
    void main()
    {
	   gl_Position = vec4(pos*0.5,1)+ vec4(0.5,0,0,0);  
    }`
);
webgl.compileShader(vertexShader);

if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
  console.error(
    "Error compiling vertex shader",
    webgl.getShaderInfoLog(vertexShader)
  );
}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER); //creating a fragment shader
webgl.shaderSource(
  fragmentShader,
  `
	void main()
    {
      
        gl_FragColor = vec4(0.6,0.7,0.5,1);
    }`
);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
  console.error(
    "Error compiling fragment Shader",
    webgl.getShaderInfoLog(fragmentShader)
  );
}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);
webgl.enable(webgl.DEPTH_TEST);

//enable vertex and color attributes
const positionLocation = webgl.getAttribLocation(program, `pos`); //getting pos location
webgl.enableVertexAttribArray(positionLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

webgl.enable(webgl.DEPTH_TEST);

webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer1);
//webgl.bufferData(webgl.ARRAY_BUFFER, vertices1 , webgl.STATIC_DRAW);

const vertexShader1 = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader1,
  `attribute vec3 pos;
void main() { 
  gl_PointSize = 3.0;
    gl_Position = vec4(pos*0.25,1)+vec4(-0.5,0,0,0); }`
);
webgl.compileShader(vertexShader1);

const fragmentShader1 = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader1,
  `void main() { gl_FragColor = vec4(0.6,0.7,0.5,1); }`
);
webgl.compileShader(fragmentShader1);

const program1 = webgl.createProgram();
webgl.attachShader(program1, vertexShader1);
webgl.attachShader(program1, fragmentShader1);
webgl.linkProgram(program1);
webgl.useProgram(program1);
const positionLocation1 = webgl.getAttribLocation(program1, `pos`);
webgl.enableVertexAttribArray(positionLocation1);
webgl.vertexAttribPointer(positionLocation1, 3, webgl.FLOAT, false, 0, 0);

draw();
function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  webgl.bufferData(webgl.ARRAY_BUFFER, vertices1, webgl.STATIC_DRAW);
  webgl.drawArrays(webgl.POINTS, 0, jsarray.length / 3);

  webgl.bufferData(webgl.ARRAY_BUFFER, vertices1, webgl.STATIC_DRAW);
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices1.length / 3);

  window.requestAnimationFrame(draw);
}
