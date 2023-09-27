const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  let size = document.getElementById("size");
  let sizeLabel = document.getElementById("sizeLabel");
  let movexLabel = document.getElementById("movexLabel");
  let movex = document.getElementById("movex");
  let moveyLabel = document.getElementById("moveyLabel");
  let movey = document.getElementById("movey");
  let xslider = document.getElementById("xslider");
  let xsliderLabel = document.getElementById("xsliderLabel");
  let yslider = document.getElementById("yslider");
  let ysliderLabel = document.getElementById("ysliderLabel");
  let zslider = document.getElementById("zslider");
  let zsliderLabel = document.getElementById("zsliderLabel");
  let sizevalue = 0.25;
  let xt = 0;
  let yt = 0;
  let xr = 0;
  let yr = 0;
  let startX = 1;
  let startY = 1;
  let startZ = 1;

  let model = new Float32Array();

  const vertices = new Float32Array([
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
    -1,
    -1,
    1,
    1,
    1,
    1,

    1,
    -1,
    1,
    1,
    1,
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
    -1,
    -1,
    -1,
    1,
    1,
    -1,

    -1,
    -1,
    1,
    -1,
    1,
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
    -1,

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
     uniform float valpha,size,shiftX,shiftY;
     uniform mat4 model;
   void main() { 

    //ROTATION ALONG THE Y- AXIS 

    //z = pos.z*cos(shift) -pos.x*sin(shift);
    //x = pos.z*sin(shift) +pos.x*cos(shift);

    //ROTATION ALONG THE X- AXIS 

    // y=pos.y*cos(shift)-pos.z*sin(shift); 
    // z=pos.y*sin(shift)+pos.z*cos(shift);

   fragcolor=color;
  //gl_Position = vec4(x*0.5,(pos.y)*0.5,z*0.5,1);//Y-AXIS
    //gl_Position = vec4((pos.x)*0.5,y*0.5,z*0.5,1);//X-AXIS

    //gl_position = vec4(modelMatrix*vec4(pos,1));

    gl_Position = (model * vec4(size*pos,1)) +vec4(shiftX,shiftY,0,0);
  
 }`
  );
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
  varying vec3 fragcolor;
  void main() { gl_FragColor = vec4(fragcolor,1); }`
  );

  //portion of code to get any error in c
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

  //let myshift = -1;

  var angle = 10.0;
  var angleInRadians = (2 * Math.PI) / 360;

  //let model =[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
  //let model = createmat4();
  let uniform;
  draw();
  function draw() {
    //myshift+=0.01;
    // model=multiply(model,rotationX(angleInRadians));
    //let model =createmat4();
    angleInRadians = angleInRadians + 0.01;
    if (startX == 1) {
      uniform = webgl.uniformMatrix4fv(
        webgl.getUniformLocation(program, `model`),
        false,
        rotationX(angleInRadians)
      );
    }
    //   if(startY == 1){
    //     uniform = webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,rotationY(angleInRadians));

    //   }
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    // webgl.uniform1f(webgl.getUniformLocation(program, `shift`), myshift);
    webgl.uniform1f(webgl.getUniformLocation(program, `size`), sizevalue);
    webgl.uniform1f(webgl.getUniformLocation(program, `shiftX`), xt);
    webgl.uniform1f(webgl.getUniformLocation(program, `shiftY`), yt);

    // webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,rotationX(xr));
    uniform;

    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
    window.requestAnimationFrame(draw);
  }

  function x_axis() {
    startX *= -1;
  }
  function y_axis() {
    startY *= -1;
  }
  function rotationX(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    var r = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    //    console.log(r);?
    return r;
  }

  function rotationY(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }
  function rotationZ(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    return new Float32Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  size.oninput = function () {
    sizeLabel.innerHTML = this.value; //this changes the value on the html
    sizevalue = this.value; //-----------10
  };

  movex.oninput = function () {
    movexLabel.innerHTML = this.value; //this changes the value on the html
    xt = this.value; //-----------10
  };
  movey.oninput = function () {
    moveyLabel.innerHTML = this.value;
    yt = this.value;
  };
  movey.oninput = function () {
    moveyLabel.innerHTML = this.value;
    yt = this.value;
  };
  xslider.oninput = function () {
    xsliderLabel.innerHTML = this.value; //this changes the value on the html
    xr = this.value * angleInRadians; //this changes the value to radians
    // console.log(xr);
    //rotate along the x
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationX(xr)
    );
  };
  console.log(model);

  yslider.oninput = function () {
    ysliderLabel.innerHTML = this.value; //this changes the value on the html
    yr = this.value * angleInRadians; //this changes the value to radians
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationY(yr)
    );
  };
  zslider.oninput = function () {
    zsliderLabel.innerHTML = this.value; //this changes the value on the html
    zr = this.value * angleInRadians; //this changes the value to radians
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationZ(zr)
    );
  };

  /*
function multiply(a,b){

   let r =[];
r[0] =a[0]*b[0]; + a[1]*b[4]; + a[2]*b[8]; + a[3]*b[12];
r[1] =a[0]*b[1]; + a[1]*b[5]; + a[2]*b[9]; + a[3]*b[13];
r[2] =a[0]*b[2]; + a[1]*b[6]; + a[2]*b[10]; + a[3]*b[14];
r[3] =a[0]*b[3]; + a[1]*b[7]; + a[2]*b[11]; + a[3]*b[15];

r[4] =a[4]*b[0]; + a[5]*b[4]; + a[6]*b[8]; + a[7]*b[12];
r[5] =a[4]*b[1]; + a[5]*b[5]; + a[6]*b[9]; + a[7]*b[13];
r[6] =a[4]*b[2]; + a[5]*b[6]; + a[6]*b[10]; + a[7]*b[14];
r[7] =a[4]*b[3]; + a[5]*b[7]; + a[6]*b[11]; + a[7]*b[15];

r[8] =a[8]*b[0]; + a[9]*b[4]; + a[10]*b[8]; + a[11]*b[12];
r[9] =a[8]*b[1]; + a[9]*b[5]; + a[10]*b[9]; + a[11]*b[13];
r[10] =a[8]*b[2]; + a[9]*b[6]; + a[10]*b[10]; + a[11]*b[14];
r[11] =a[8]*b[3]; + a[9]*b[7]; + a[10]*b[11]; + a[11]*b[15];

r[12] =a[12]*b[0]; + a[13]*b[4]; + a[14]*b[8]; + a[15]*b[12];
r[13] =a[12]*b[1]; + a[13]*b[5]; + a[14]*b[9]; + a[15]*b[13];
r[14] =a[12]*b[2]; + a[13]*b[6]; + a[14]*b[10]; + a[15]*b[14];
r[15] =a[12]*b[3]; + a[13]*b[7]; + a[14]*b[11]; + a[15]*b[15];

return r;
     }*/

  /*function createmat4(){

   return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}*/
}
