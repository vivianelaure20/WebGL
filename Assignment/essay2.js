const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
let xslider = document.getElementById("xslider");
let xsliderLabel = document.getElementById("xsliderLabel");
let yslider = document.getElementById("yslider");
let ysliderLabel = document.getElementById("ysliderLabel");
let zslider = document.getElementById("zslider");
let zsliderLabel = document.getElementById("zsliderLabel");
let alpha = 1.0;
let sizevalue = 0.25;
let xt = 0.0;
let yt = 0.0;
let xr = 0.0;
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
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.enable(webgl.BLEND);
  webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);

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
     uniform float valpha,size;
     varying float alpha;
     varying vec3 fragcolor;
     uniform float shiftX;
     uniform float shiftY;
    
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

    // gl_position = vec4(modelMatrix*vec4(pos,1));
   
     gl_Position = (model * vec4(size*pos,1))+vec4(shiftX,shiftY,0,0);
    alpha = valpha; 
    // gl_Position = vec4(size*pos,1) ;
  
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
  varying float alpha;

  void main() { gl_FragColor = vec4(fragcolor,alpha); }`
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

  let degTorad = (2 * Math.PI) / 360;
  let uniform = webgl.uniformMatrix4fv(
    webgl.getUniformLocation(program, `model`),
    false,
    rotationX(xr)
  );

  draw();
  function draw() {
    degTorad = degTorad + 0.01;
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    webgl.uniform1f(webgl.getUniformLocation(program, `size`), sizevalue);
    webgl.uniform1f(webgl.getUniformLocation(program, `valpha`), alpha);
    webgl.uniform1f(webgl.getUniformLocation(program, `shiftX`), xt);
    webgl.uniform1f(webgl.getUniformLocation(program, `shiftY`), yt);

    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
    window.requestAnimationFrame(draw);
  }

  xslider.oninput = function () {
    xsliderLabel.innerHTML = this.value;
    xr = this.value * degTorad;
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationX(xr)
    );
  };
  yslider.oninput = function () {
    ysliderLabel.innerHTML = this.value;
    xy = this.value * degTorad;
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationY(xy)
    );
  };
  zslider.oninput = function () {
    zsliderLabel.innerHTML = this.value;
    xz = this.value * degTorad;
    uniform = webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      rotationZ(xz)
    );
  };
  size.oninput = function () {
    sizeLabel.innerHTML = this.value;
    sizevalue = this.value;
  };

  alphaslider.oninput = function () {
    alphaLabel.innerHTML = this.value;
    alpha = this.value;
  };

  movex.oninput = function () {
    movexLabel.innerHTML = this.value;
    xt = this.value;
  };
  movey.oninput = function () {
    moveyLabel.innerHTML = this.value;
    yt = this.value;
  };

  function rotationX(degTorad) {
    var c = Math.cos(degTorad);
    var s = Math.sin(degTorad);
    var r = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    return r;
  }
  function rotationY(degTorad) {
    var c = Math.cos(degTorad);
    var s = Math.sin(degTorad);
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }

  function rotationZ(degTorad) {
    var c = Math.cos(degTorad);
    var s = Math.sin(degTorad);
    return new Float32Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  function trans(tx, ty, tz) {
    return new Float32Array([
      1,
      0,
      0,
      tx,
      0,
      1,
      0,
      ty,
      0,
      0,
      1,
      tz,
      0,
      0,
      0,
      1,
    ]);
  }
}
