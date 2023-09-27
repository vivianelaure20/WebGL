const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.enable(webgl.DEPTH_TEST);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}

webgl.clearColor(1, 1, 1, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);
let image = document.getElementById("myImage");
const vertices = new Float32Array([
  -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
]);
var texCoords = new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1]);

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
  `attribute vec2 pos;
 attribute vec2 vtexture ;
 varying vec2 fragtexture;
void main() { gl_Position = vec4(pos*0.5,0,1);
   fragtexture = vtexture;
}`
);

webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `precision mediump float;
varying vec2 fragtexture;
uniform sampler2D fragsampler;
void main() { 
    gl_FragColor = texture2D(fragsampler,fragtexture); }`
);

webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

const textureLocation = webgl.getAttribLocation(program, `vtexture`);
webgl.enableVertexAttribArray(textureLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);

webgl.useProgram(program);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length);
