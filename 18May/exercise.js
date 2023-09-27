const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
}
webgl.clearColor(0, 1, 0.2, 0.3);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,

  // Face arrière
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,

  // Face supérieure
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,

  // Face inférieure
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,

  // Face droite
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,

  // Face gauche
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
]);


const buffer = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);


const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec3 pos;  //vertices 
  
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
