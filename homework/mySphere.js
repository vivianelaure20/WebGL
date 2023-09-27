const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);

if (!webgl) {
  throw new Error("webGL not supported");
}
webgl.clearColor(0, 1, 0.2, 0.3); // background color
webgl.clear(webgl.COLOR_BUFFER_BIT); // activating the background color

var dots = 10;
const jarray = [0, 0];
var x, y, z, k;
var r = 0.5;

var arch = 2 * Math.PI;
var aspect = 400 / 300;

for (let theta = 0; theta <= arch; theta += Math.PI / dots) {
  z = r * Math.cos(theta);
  k = r * Math.sin(theta);

  for (theta = 0; theta <= arch; theta += (2 * Math.PI) / 64) {
    x = k * Math.cos(theta);
    y = k * Math.sin(theta);
    jarray.push(x);
    jarray.push(y);
    jarray.push(z);
  }
}
const vertices = new Float32Array(jarray);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
    attribute vec3 pos;//pos.x and pos.y
    uniform float shift;
    uniform mat4 rotating;
    uniform mat4 translating;
    void main(){
    
        gl_Position = rotating*translating*vec4(pos*0.3 ,1) ;

    // gl_Position = vec4(pos ,1)  + vec4(shift, 0 , 0.0, 1.0);
     gl_PointSize = 2.0; 
    }
    `
);
webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `
    void main(){
      gl_FragColor = vec4(0.6,0.7,0.5,1); //Color of the inside shape...
    }
     `
);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
const uniformLocation = webgl.getUniformLocation(program, `shift`);

const translatingLocation = webgl.getUniformLocation(program, `translating`);
const rotatingLocation = webgl.getUniformLocation(program, `rotating`);

webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

webgl.useProgram(program);

var myshift = 0;
var shift = 0.01;

draw();
function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  myshift += shift;
  rotating = rotx(myshift);
  webgl.uniform1f(uniformLocation, myshift);
  webgl.uniformMatrix4fv(rotatingLocation, false, rotating);

  webgl.uniformMatrix4fv(
    webgl.getUniformLocation(program, `translating`),
    false,
    translate(0.3, -0.2, 1)
  );

  webgl.drawArrays(webgl.LINE_LOOP, 0, jarray.length / 2);

  webgl.uniformMatrix4fv(
    webgl.getUniformLocation(program, `translating`),
    false,
    translate(-0.3, -0.2, 1)
  );
  webgl.drawArrays(webgl.LINE_POINTS, 0, jarray.length / 2);

  webgl.uniformMatrix4fv(
    webgl.getUniformLocation(program, `translating`),
    false,
    translate(0, 0.3, 1)
  );
  webgl.drawArrays(webgl.TRIANGLE_FAN, 0, jarray.length / 2);

  window.requestAnimationFrame(draw);
}

function stop() {
  shift = shift * 0;
}
function start() {
  shift = 0.01;
}
// if want ot pass the data from the two shaders we us the word varying
function createmat4() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
function rotx(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}
function translate(tx, ty, tz) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
}
