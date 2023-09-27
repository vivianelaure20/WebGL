const canvas = document.querySelector(`canvas`);
const gl = canvas.getContext(`webgl`);

if (!gl) {
  throw new Error("webgl not available");
}
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

var dots = 10;
var array = [0, 0];
let shift = 0.05;
var x, y, z, k;
var r = 0.5;
aspect = 400 / 300;

for (let phi = 0; phi <= Math.PI; phi += Math.PI / dots) {
  z = r * Math.cos(phi);
  k = r * Math.sin(phi);

  for (theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / 64) {
    x = k * Math.cos(theta);
    y = k * Math.sin(theta);
    array.push(x);
    array.push(y);
    array.push(z);
  }
}
const vertices = new Float32Array(array);
// CREATE VERTEX SHADERS
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
attribute vec3 pos;
uniform mat4 translating;

void main()
{
  gl_Position = translating*vec4(pos*0.4, 1);
 
}
`
);
// CREATE FRAGMENT SHADER
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
void main()
{
  gl_FragColor = vec4(1, 0, 0, 1);

}
`
);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "pos");
const uniformLocation = gl.getUniformLocation(program, `shift`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
gl.useProgram(program);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);

const translatingLocation = gl.getUniformLocation(program, `translating`);

var myshift = 0;
//var shift = 0.01;

draw();
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  myshift += shift;
  gl.uniform1f(uniformLocation, myshift);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `translating`),
    false,
    translate(0, 0.3, 1)
  );
  gl.drawArrays(gl.LINE_STRIP, 0, array.length / 2);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `translating`),
    false,
    translate(-0.3, -0.2, 1)
  );
  gl.drawArrays(gl.LINES, 0, array.length / 2);

  window.requestAnimationFrame(draw);
}
function translate(tx, ty, tz) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
}
