const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("webGL not supported");
}
gl.clearColor(1, 0, 1, 1); // background color
gl.clear(gl.COLOR_BUFFER_BIT); // activating the background color

var dots = 10;
var array = [0, 0];
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

const buff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buff);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//..........black code run on the CPU...........
//.............shaders run in GPU.........
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
    attribute vec3 pos;//pos.x and pos.y
    uniform float shift;
    uniform mat4 rotating;
    uniform mat4 translating;
    void main(){
    
        gl_Position = translating*rotating*vec4(pos*0.5 ,1) ;

    //gl_Position = vec4(pos ,1)  + vec4(shift, 0 , 0.0, 1.0);
    gl_PointSize = 2.0; 
    }
    `
);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
    void main(){
    gl_FragColor = vec4(0,0,1,1); //Color of the inside shape...
    }
     `
);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, "pos");
const uniformLocation = gl.getUniformLocation(program, `shift`);

const translatingLocation = gl.getUniformLocation(program, `translating`);
const rotatingLocation = gl.getUniformLocation(program, `rotating`);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

var myshift = 0;
var shift = 0.01;

draw();
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  myshift += shift;
  rotating = rotx(myshift);
  gl.uniform1f(uniformLocation, myshift);
  gl.uniformMatrix4fv(rotatingLocation, false, rotating);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `translating`),
    false,
    translate(0.3, -0.2, 1)
  );

  gl.drawArrays(gl.LINE_LOOP, 0, array.length / 2);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `translating`),
    false,
    translate(-0.3, -0.2, 1)
  );
  gl.drawArrays(gl.LINE_POINTS, 0, array.length / 2);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `translating`),
    false,
    translate(0, 0.3, 1)
  );
  gl.drawArrays(gl.TRIANGLE_FAN, 0, array.length / 2);

  window.requestAnimationFrame(draw);
}

function stop() {
  shift = shift * 0;
}
function start() {
  shift = 0.01;
}
// if want ot pass the data from the two shaders we us the word varying

function rotx(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}
function translate(tx, ty, tz) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
}
