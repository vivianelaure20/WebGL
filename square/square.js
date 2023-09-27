const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(1, 1, 1, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);
const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
const buffer = webgl.createBuffer();
const vertices2 = new Float32Array([-0.5, 0, -1, 0, -0.5, -0.5]);
const buffer2 = webgl.createBuffer();
const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec2 pos;
 void main() { gl_Position = vec4(pos*0.5,0,1); }`
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
const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);
webgl.drawArrays(webgl.TRIANGLE_FAN, 0, vertices.length / 2);
