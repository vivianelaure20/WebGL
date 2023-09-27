const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  const vertices = new Float32Array([
    -1,
    -1, //BOTTOM LEFT
    1,

    1,
    -1, //BOTTOM RIGHT
    1,

    1,
    1, //TOP RIGHT
    1,

    -1,
    1, //TOP LEFT
    1,

    -1,
    -1, //BOTTOM LEFT
    1,

    1,
    1, //TOP RIGHT
    1,
    //THIS IS THE RIGHT FACE

    1,
    -1, //BOTTOM RIGHT
    1,

    1,
    1, //TOP RIGHT
    1,

    1,
    -1, //BOTTOM RIGHT WHERE Z=-1
    -1,

    1,
    1, //TOP RIGHT WHERE Z=-1
    -1,

    1,
    1, //TOP RIGHT
    1,

    1,
    -1, //BOTTOM RIGHT WHERE Z=-1
    -1,

    //THIS IS THE BACK FACE
    -1,
    -1, //BOTTOM LEFT
    -1,

    1,
    -1, //BOTTOM RIGHT
    -1,

    1,
    1, //TOP RIGHT
    -1,

    -1,
    1, //TOP LEFT
    -1,

    -1,
    -1, //BOTTOM LEFT
    -1,

    1,
    1, //TOP RIGHT
    -1,

    //THIS IS THE LEFT FACE

    -1,
    -1, //BOTTOM RIGHT
    1,

    -1,
    1, //TOP RIGHT
    1,

    -1,
    -1, //BOTTOM RIGHT WHERE Z=-1
    -1,

    -1,
    1, //TOP RIGHT WHERE Z=-1
    -1,

    -1,
    1, //TOP RIGHT
    1,

    -1,
    -1, //BOTTOM RIGHT WHERE Z=-1
    -1,

    //THIS IS THE TOP FACE

    1,
    1,
    -1,

    -1,
    1,
    1,

    -1,
    1,
    -1,

    1,
    1,
    -1,

    -1,
    1,
    1,

    1,
    1,
    1,

    //THIS IS THE BOTTOM FACE

    1,
    -1,
    -1,

    -1,
    -1,
    1,

    -1,
    -1,
    -1,

    1,
    -1,
    -1,

    -1,
    -1,
    1,

    1,
    -1,
    1,
  ]);

  const colors = new Float32Array([
    1,
    0,
    0,

    1,
    0,
    0,

    1,
    0,
    0,

    1,
    0,
    0,

    1,
    0,
    0,

    1,
    0,
    0,

    0,
    1,
    0,

    0,
    1,
    0,

    0,
    1,
    0,

    0,
    1,
    0,

    0,
    1,
    0,

    0,
    1,
    0,

    0,
    0,
    1,

    0,
    0,
    1,

    0,
    0,
    1,

    0,
    0,
    1,

    0,
    0,
    1,

    0,
    0,
    1,

    1,
    1,
    1,

    1,
    1,
    1,

    1,
    1,
    1,

    1,
    1,
    1,

    1,
    1,
    1,

    1,
    1,
    1,

    0,
    0,
    0,

    0,
    0,
    0,

    0,
    0,
    0,

    0,
    0,
    0,

    0,
    0,
    0,

    0,
    0,
    0,

    1,
    0,
    1,

    1,
    0,
    1,

    1,
    0,
    1,

    1,
    0,
    1,

    1,
    0,
    1,

    1,
    0,
    1,
  ]);

  const buffer = webgl.createBuffer();
  const colorbuffer = webgl.createBuffer();

  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader,
    `attribute vec3 pos;
     attribute vec3 color;
     varying vec3 fragcolor;
     uniform float shift;
     float x,y,z;
   void main() { 

    //ROTATION ALONG THE Y- AXIS 
    
    y=pos.y;
    z = pos.z*cos(shift) -pos.x*sin(shift);
    x = pos.z*sin(shift) +pos.x*cos(shift);
    // z=y*cos(0.9)-(z)*sin(0.9);
    y=y*sin(0.9)+(z)*cos(0.9);

    //ROTATION ALONG THE X- AXIS 

    // y=pos.y*cos(shift)-pos.z*sin(shift); 
    // z=pos.y*sin(shift)+pos.z*cos(shift);

   fragcolor=color;
  gl_Position = vec4(x*0.4,y*0.4,z*0.4,1);//Y-AXIS
    //gl_Position = vec4((pos.x)*0.5,y*0.5,z*0.5,1);//X-AXIS


  
 }`
  );
  webgl.compileShader(vertexShader);
  const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader,
    `precision mediump float;
  varying vec3 fragcolor;
  void main() { gl_FragColor = vec4(fragcolor,1); }`
  );
  webgl.compileShader(fragmentShader);
  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);
  //POSITIONS
  const positionLocation = webgl.getAttribLocation(program, `pos`);
  webgl.enableVertexAttribArray(positionLocation);
  webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 3 * 4, 0);

  webgl.bindBuffer(webgl.ARRAY_BUFFER, colorbuffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);
  //COLORS
  const colorLocation = webgl.getAttribLocation(program, `color`);
  webgl.enableVertexAttribArray(colorLocation);
  webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 3 * 4, 0);
  webgl.useProgram(program);

  webgl.enable(webgl.DEPTH_TEST);

  let myshift = -1;

  draw();
  function draw() {
    myshift += 0.01;
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `shift`), myshift);
    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
    window.requestAnimationFrame(draw);
  }
} //end of else
