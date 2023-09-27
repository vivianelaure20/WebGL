const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(0, 1, 0.2, 0.3);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Face arrière
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Face supérieure
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Face inférieure
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Face droite
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Face gauche
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
]);

const colors = new Float32Array([
  0.5, 0.3, 0.7, 0.5, 0.3, 0.7, 0.5, 0.3, 0.7, 0.5, 0.3, 0.7, 1, 0.2, 0.3, 1,
  0.2, 0.3, 1, 0.2, 0.3, 1, 0.2, 0.3, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0,
  0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0,
  1, 1, 0, 1, 1, 0, 1, 1,
]);

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
]);

const buffer = webgl.createBuffer();
const colorBuffer = webgl.createBuffer();
const index_buffer = webgl.createBuffer();

webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, index_buffer);
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indices, webgl.STATIC_DRAW);

webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec3 pos;  //vertices 
    attribute vec3 color;   //color
    varying vec3 fragcolor;  //bring to the fragment shader
    uniform float shift;
    float x,y,z;
    void main() { 
        //x=pos.x*cos(shift)-pos.y*sin(shift); // z axis
        //y=pos.x*sin(shift)+pos.y*cos(shift);

        y=pos.y*cos(shift)-pos.z*sin(shift); //x axis
        z=pos.y*sin(shift)+pos.z*cos(shift);

        //z=pos.z*cos(shift)-pos.x*sin(shift); // y axis
        //x=pos.z*sin(shift)+pos.x*cos(shift);

    fragcolor =color; 

       gl_Position = vec4((pos.x)*0.5,y*0.5,z*0.5,1); // x axis
        //gl_Position = vec4(x*0.5,(pos.y)*0.5,z*0.5,1); //y axis
       // gl_Position = vec4(x*0.5,y*0.5,(pos.z)*0.5,1);  //z axis
             }`
); //vertices

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
varying vec3 fragcolor;  //color 
void main() { gl_FragColor = vec4(fragcolor,1); }`
);

if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
  console.error(
    "Error compiling fragment shader",
    webgl.getShaderInfoLog(fragmentShader)
  );
}
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`); //vertices
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 3 * 4, 0);

webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);

const colorLocation = webgl.getAttribLocation(program, `color`); //color
webgl.enableVertexAttribArray(colorLocation);
webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 0, 0);

let myshift = -1;

draw();
function draw() {
  myshift += 0.01;
  webgl.uniform1f(webgl.getUniformLocation(program, `shift`), myshift);

  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.enable(webgl.DEPTH_TEST);
  webgl.drawElements(webgl.TRIANGLES, indices.length, webgl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(draw);
}
