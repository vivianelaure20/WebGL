const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);

let xslider = document.getElementById("xslider");
let xsliderLabel = document.getElementById("xsliderLabel");
let yslider = document.getElementById("yslider");
let ysliderLabel = document.getElementById("ysliderLabel");
let zslider = document.getElementById("zslider");
let zsliderLabel = document.getElementById("zsliderLabel");
let alpha = 1.0;
let alphaslider = document.getElementById("alpha");
let alphaLabel = document.getElementById("alphaLabel");
let size = document.getElementById("size");
let sizeLabel = document.getElementById("sizeLabel");
let buttonx = document.getElementById("x");
let buttony = document.getElementById("y");
let buttonz = document.getElementById("z");
let movexLabel = document.getElementById("movexLabel");
let movex = document.getElementById("movex");
let moveyLabel = document.getElementById("moveyLabel");
let movey = document.getElementById("movey");

if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  webgl.clearColor(0.5, 1, 0.8, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  const vertices = new Float32Array([
    //1 FRONT FACE
    -1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    1,
    1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1,

    //2 RIGHT FACE
    1,
    1,
    1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1,
    -1,
    -1,

    //3 BACK FACE
    -1,
    1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,

    //4 LEFT FACE
    -1,
    1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    -1,
    -1,

    //5 BOTTOM FACE
    -1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    1,

    //6 TOP FACE
    -1,
    1,
    1,
    1,
    1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1,
    1,
    1,
  ]);

  const colors = new Float32Array([
    //1 FRONT FACE
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

    //2 RIGHT FACE
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

    //3 BACK FACE
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

    //4 LEFT FACE
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

    //5 BOTTOM FACE
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

    //6 TOP FACE
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
    y=y*sin(0.9)+z*cos(0.9);

    //ROTATION ALONG THE X- AXIS 

   // y=pos.y*cos(shift)-pos.z*sin(shift); 
    //z=pos.y*sin(shift)+pos.z*cos(shift);

    //ROTATION ALONG THE Z-AXIS   
    //x = pos.x*cos(shift) - pos.y*sin(shift);
    //y =pos.x*sin(shift) + pos.y*cos(shift);
   fragcolor=color;

   fragcolor=color;
gl_Position = vec4(x*0.3,y*0.3,z*0.3,1);//Y-AXIS
    //gl_Position = vec4((pos.x)*0.3,y*0.3,z*0.3,1);//X-AXIS
    //gl_Position = vec4(0.3*x,0.3*y,0,1);//Z-AXIS
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

  webgl.enable(webgl.BLEND);
  webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);

  webgl.enable(webgl.DEPTH_TEST);

  const uniformLocation = webgl.getUniformLocation(program, `shift`);
  let myshift = 0;
  let myshift_X = 0;
  let myshift_Y = 0;

  let shift = 0.01;
  let start = 1;
  var degTorad = (2 * Math.PI) / 360;
  draw();
  function draw() {
    if (start == 1) {
      myshift += shift;
    }
    if (myshift_X >= 1.9) {
      shift *= -1;
    }
    if (myshift_X < 0) {
      shift *= -1;
    }
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(uniformLocation, myshift);
    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
    window.requestAnimationFrame(draw);
  }
  xslider.oninput = function () {
    xsliderLabel.innerHTML = this.value; //this changes the value on the html
    myshift_X = this.value * degTorad; //this changes the value to radians
    webgl.uniform1f(webgl.getUniformLocation(program, `shift`), xr);
    //rotate along the x
  };
  yslider.oninput = function () {
    ysliderLabel.innerHTML = this.value; //this changes the value on the html
    xy = this.value * degTorad;
    webgl.uniform1f(webgl.getUniformLocation(program, `shift`), xy);
    //rotate along the y
  };
  zslider.oninput = function () {
    zsliderLabel.innerHTML = this.value; //this changes the value on the html
    xz = this.value * degTorad;
    //rotate along the z
  };
  size.oninput = function () {
    sizeLabel.innerHTML = this.value; //this changes the value on the html
    //set the size of the model
  };
  alphaslider.oninput = function () {
    alphaLabel.innerHTML = this.value; //this changes the value on the html
    //set the size of the alpha
  };

  movex.oninput = function () {
    movexLabel.innerHTML = this.value;
    xt = this.value;
  };
  movey.oninput = function () {
    moveyLabel.innerHTML = this.value;
    yt = this.value;
  };
  function stoptartx() {
    start *= -1;
  }
  function stopstarty() {
    start *= -1;
  }
  function stopstartz() {
    start *= -1;
  }
} //end of else
