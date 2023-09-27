const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.enable(webgl.DEPTH_TEST);

  webgl.enable(webgl.BLEND); //you will need Lines 3 and 4 in for your alpha value to change
  webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
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
    `attribute vec3 pos,color;
    uniform float valpha, size, movex, movey;
    varying vec3 fragcolor;
    varying float alpha;
    uniform mat4 model;

    void main()
    {  
        fragcolor = color;
        gl_Position = model*vec4(size*pos,1) + vec4(movex,movey,0,0) ;
        alpha = valpha;          
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
  void main()
  {
      gl_FragColor = vec4(fragcolor,alpha); 
  }`
  );
  webgl.compileShader(fragmentShader);
  if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error(
      "Error compiling Fragment shader",
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

  var angle = 10.0;
  var angleInRadians = (Math.PI * angle) / 180;
  let start = 1;
  let rotX = -1;
  let rotY = -1;
  let rotZ = -1;

  let model = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  draw();
  function draw() {
    /* if(start==1){
       model =createmat4();
    }*/
    if (rotX == 1) {
      model = rotationX(angleInRadians);
    }

    if (rotY == 1) {
      model = rotationY(angleInRadians);
    }
    if (rotZ == 1) {
      model = rotationZ(angleInRadians);
    }

    angleInRadians = angleInRadians + 0.01;
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `size`), sizevalue);
    webgl.uniform1f(webgl.getUniformLocation(program, `valpha`), alpha);

    webgl.uniform1f(webgl.getUniformLocation(program, `movex`), xt);
    webgl.uniform1f(webgl.getUniformLocation(program, `movey`), yt);
    webgl.uniformMatrix4fv(
      webgl.getUniformLocation(program, `model`),
      false,
      model
    );

    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);
    window.requestAnimationFrame(draw);
  }

  let degTorad = (2 * Math.PI) / 360;
  //adding even listeners
  xslider.oninput = function () {
    xsliderLabel.innerHTML = this.value; //this changes the value on the html
    xr = this.value * degTorad; //this changes the value to radians
    //rotate along the x
  };
  yslider.oninput = function () {
    ysliderLabel.innerHTML = this.value; //this changes the value on the html
    xy = this.value * degTorad;

    //rotate along the y
  };
  zslider.oninput = function () {
    zsliderLabel.innerHTML = this.value; //this changes the value on the html
    xz = this.value * degTorad;

    //rotate along the z
  };

  //------------------------------
  size.oninput = function () {
    sizeLabel.innerHTML = this.value; //this changes the value on the html
    sizevalue = this.value; //-----------10
  };
  //---------------
  alphaslider.oninput = function () {
    alphaLabel.innerHTML = this.value; //this changes the value on the html
    alpha = this.value; //------------------11
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

  function rotationX(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    var r = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    return r;
  }
  function rotationY(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    var r = new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
    return r;
  }
  function rotationZ(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    var r = new Float32Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return r;
  }

  function createmat4() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  function x_axis() {
    rotX *= -1;
  }
  function y_axis() {
    rotY *= -1;
  }
  function z_axis() {
    rotZ *= -1;
  }
}
