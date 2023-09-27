const canvas = document.getElementById("mycanvas");
const webgl = canvas.getContext(`webgl`);

webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);

webgl.clearColor(1, 0.4, 0.3, 1);

if (!webgl) {
  throw new Error("WebGL NOT supported by this browser");
}
var r = 0.5;
let image = document.getElementById("myImage");

var vertices = new Float32Array([
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

var texCoords = new Float32Array([
  //front
  1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0,

  //back
  0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,

  //top
  1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,

  //bottom
  1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,

  //left
  1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1,

  //right
  0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
]);

const positionBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const texCoordBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, texCoords, webgl.STATIC_DRAW);

const texturebuffer = webgl.createTexture();
webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
webgl.texParameteri(
  webgl.TEXTURE_2D,
  webgl.TEXTURE_WRAP_S,
  webgl.CLAMP_TO_EDGE
);
webgl.texParameteri(
  webgl.TEXTURE_2D,
  webgl.TEXTURE_WRAP_T,
  webgl.CLAMP_TO_EDGE
);

webgl.texImage2D(
  webgl.TEXTURE_2D,
  0,
  webgl.RGBA,
  webgl.RGBA,
  webgl.UNSIGNED_BYTE,
  image
);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `uniform mat4 model;
	attribute vec2 vtexture ;
	attribute vec3 pos;
	varying vec2 fragtexture;
	

    void main()
    {
	   gl_Position = model* vec4(pos*0.5,1)+ vec4(-0.6,-0.2,0,0);  
	   fragtexture = vtexture;
    }`
);
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
	varying vec2 fragtexture;
	uniform sampler2D fragsampler;
	void main()
    {
      
    gl_FragColor = texture2D(fragsampler,fragtexture);
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

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

const textureLocation = webgl.getAttribLocation(program, `vtexture`);
webgl.enableVertexAttribArray(textureLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);

let xt = 0;
let yt = 0;
let uniform = webgl.uniformMatrix4fv(
  webgl.getUniformLocation(program, `model`),
  false,
  rotationY(xt)
);

drawCube();
function drawCube() {
  // webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
  webgl.activeTexture(webgl.TEXTURE0);

  uniform;
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);

  window.requestAnimationFrame(drawCube);
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

document.addEventListener("keydown", (e) => {
  console.log(e.key);

  if (e.key == "w") {
    xt++;

    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationX(xt)
    );
  }
  if (e.key == "q") {
    yt++;

    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationY(yt)
    );
  }
});
