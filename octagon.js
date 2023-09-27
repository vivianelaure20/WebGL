const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(0, 1, 0.2, 0.3);
webgl.clear(webgl.COLOR_BUFFER_BIT);
const vertices = new Float32Array([
  //FIRST TRIANGLE ABC
  0.3,
  0,

  0,
  0.3,

  0,
  0.7,

  //SECOND TRIANGLE ACD

  0.3,
  0,

  0,
  0.7,

  0.3,
  1,

  ///THIRD TRIANGLE ADE
  0.3,
  0,

  0.3,
  1,

  0.7,
  1,

  ////FOURTH TRIANGLE AEH

  0.3,
  0,

  0.7,
  1,

  0.7,
  0,

  /////FIFTH TRIANGLE EFH

  0.7,
  1,

  1,
  0.7,

  0.7,
  0,

  //////SIXTH TRIANGLE FGH
  1,
  0.7,

  1,
  0.3,

  0.7,
  0,
]);
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
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
const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);
webgl.drawArrays(webgl.TRIANGLES, 0, 18);
