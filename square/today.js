const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.enable(webgl.DEPTH_TEST);
if (!webgl) {
  throw new Error("WebGL NOT supported by this browser");
}
let image = document.getElementById("myImage");
var vertices = new Float32Array([
  -1,
  -1, //bottom left
  -1,

  -1,
  1, //top left
  -1,

  1,
  -1, //bottom right
  -1,

  -1,
  1, //top left
  -1,

  1,
  -1, //bottom right
  -1,

  1,
  1, //top right
  -1,
]);
var texCoords = new Float32Array([
  0,
  0, //bottom left coordinate(u,v)or (s,t) of the image

  0,
  1, //top left coordinate(u,v)or (s,t) of the image

  1,
  0, //bottom right coordinate(u,v)or (s,t) of the image

  0,
  1, //top left coordinate(u,v)or (s,t) of the image

  1,
  0, //bottom right coordinate(u,v)or (s,t) of the image

  1,
  1, //top right coordinate(u,v)or (s,t) of the image
]);
var pmanvertices = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0]);
const positionBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
const texCoordBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, texCoords, webgl.STATIC_DRAW);

const pmanbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, pmanbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, pmanvertices, webgl.STATIC_DRAW);

const texturebuffer = webgl.createTexture();
webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
/*  if your dimensions are not powers of two then comment out line 56 and uncomment 50-53	*/
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
); /**/

webgl.texImage2D(
  webgl.TEXTURE_2D,
  0,
  webgl.RGBA,
  webgl.RGBA,
  webgl.UNSIGNED_BYTE,
  image
);
//webgl.generateMipmap(webgl.TEXTURE_2D); 767 x 450=2^x.2^y

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
let vtxsh = `
attribute vec2 vtexture ;
attribute vec3 pos;
varying vec2 fragtexture;

void main()
{
   gl_Position = vec4(pos,1);  
   fragtexture = vtexture;
}`;
let frgmtsh = `precision mediump float;
varying vec2 fragtexture;
uniform sampler2D fragsampler;
void main()
{
  
          gl_FragColor = texture2D(fragsampler,fragtexture);
}`;
/*webgl.shaderSource(vertexShader, vtxsh );
webgl.compileShader(vertexShader);
logShaderError(vertexShader,"vertex1");

const fragmentShader =  webgl.createShader(webgl.FRAGMENT_SHADER);//creating a fragment shader
webgl.shaderSource(fragmentShader, frgmtsh  );
webgl.compileShader(fragmentShader);
logShaderError(fragmentShader,"fragment1");

*/
const program = webgl.createProgram();
initProgram(program, vtxsh, frgmtsh);
/*webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);*/
webgl.useProgram(program);

let pvsource = `
attribute vec3 pos;
void main(){ gl_Position = vec4(pos,1);}`;
let pfsource = `void main(){ gl_FragColor = vec4(1,0,1,1);}`;
const pmanprogram = webgl.createProgram();
initProgram(pmanprogram, pvsource, pfsource);

//enable vertex and color attributes

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

const pacmanLocation = webgl.getAttribLocation(pmanprogram, `pos`);
webgl.enableVertexAttribArray(pacmanLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, pmanbuffer);
webgl.vertexAttribPointer(pacmanLocation, 3, webgl.FLOAT, false, 0, 0);

const textureLocation = webgl.getAttribLocation(program, `vtexture`);
webgl.enableVertexAttribArray(textureLocation);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);

/*draw();
function draw()
{  */
//webgl.enable(webgl.CULL_FACE);
webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
webgl.cullFace(webgl.BACK);
webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
webgl.activeTexture(webgl.TEXTURE0);
webgl.useProgram(program);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
//window.requestAnimationFrame(draw);
webgl.enable(webgl.CULL_FACE);
webgl.cullFace(webgl.FRONT);
webgl.useProgram(pmanprogram);
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);
webgl.enableVertexAttribArray(positionLocation);

webgl.drawArrays(webgl.TRIANGLES, 0, pmanvertices.length / 3);

//}

function initProgram(prog, vSource, fSource) {
  let vs = webgl.createShader(webgl.FRAGMENT_SHADER);
  let fs = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(vs, vSource);
  webgl.shaderSource(fs, fSource);
  webgl.compileShader(vs);
  webgl.compileShader(fs);
  webgl.attachShader(prog, vs);
  webgl.attachShader(prog, fs);
  webgl.linkProgram(prog);
}

function logShaderError(shader, sname) {
  if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
    console.error(
      "Error compiling " + sname + " Shader",
      webgl.getShaderInfoLog(fragmentShader)
    );
  }
}
