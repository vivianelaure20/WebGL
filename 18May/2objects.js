const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(1, 1, 1, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
  0.5, 0, 1, 0, 0.5, 0.5, 1, 0, 1, 0.5, 0.5, 0.5,
]);
const buffer = webgl.createBuffer();

const vertices2 = new Float32Array([-0.5, 0, -1, 0, -0.5, -0.5]);
//const buffer2 = webgl.createBuffer();

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec2 pos;
 void main() { gl_Position = vec4(pos,0,1); }`
);
webgl.compileShader(vertexShader);
const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `void main() { gl_FragColor = vec4(0,0,.7,1); }`
);
webgl.compileShader(fragmentShader);
const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);
//webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length/2);

//------------For the second image (vertices2)------------------
//const vertices2 = new Float32Array([-0.5, 0, -1, 0, -0.5, -0.5]);
//const buffer2 = webgl.createBuffer();
/*const vertexShader2 = webgl.createShader(webgl.VERTEX_SHADER);
 webgl.shaderSource(vertexShader2,
 `attribute vec2 pos;
 void main() { gl_Position = vec4(pos,0,1); }` );
 webgl.compileShader(vertexShader2);
 const fragmentShader2 = webgl.createShader(webgl.FRAGMENT_SHADER);
 webgl.shaderSource(fragmentShader2,
 `void main() { gl_FragColor = vec4(1,0,0,1); }`);
 webgl.compileShader(fragmentShader2);
 const program2 = webgl.createProgram();
 webgl.attachShader(program2, vertexShader2);
 webgl.attachShader(program2, fragmentShader2);
 webgl.linkProgram(program2);
 webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer2);
 //webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);
 webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);
 const positionLocation2 = webgl.getAttribLocation(program2, `pos`);
 webgl.enableVertexAttribArray(positionLocation2);
 webgl.vertexAttribPointer(positionLocation2, 2, webgl.FLOAT, false, 0, 0);
 webgl.useProgram(program2);*/
//webgl.drawArrays(webgl.TRIANGLES, 0, vertices2.length/2);

draw();
function draw() {
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);

  webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices2.length / 2);

  window.requestAnimationFrame(draw);
}
