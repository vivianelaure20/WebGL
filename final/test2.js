const canvas = document.getElementById("mycanvas1");
const webgl = canvas.getContext(`webgl`);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.clearColor(0.7, 0.5, 0.7, 1);

if (!webgl) {
  throw new Error("WebGL NOT supported by this browser");
} else {
  var r = 0.5;
  let image = document.getElementById("flag");

  var vertices = new Float32Array([
    //front
    r,
    r,
    r,
    r,
    -r,
    r,
    -r,
    r,
    r,
    -r,
    r,
    r,
    r,
    -r,
    r,
    -r,
    -r,
    r,

    //back
    r,
    r,
    -r,
    r,
    -r,
    -r,
    -r,
    r,
    -r,
    -r,
    r,
    -r,
    r,
    -r,
    -r,
    -r,
    -r,
    -r,

    //top
    r,
    r,
    r,
    -r,
    r,
    r,
    -r,
    r,
    -r,
    r,
    r,
    r,
    -r,
    r,
    -r,
    r,
    r,
    -r,

    //bottom
    r,
    -r,
    r,
    -r,
    -r,
    r,
    -r,
    -r,
    -r,
    r,
    -r,
    r,
    -r,
    -r,
    -r,
    r,
    -r,
    -r,

    //left
    -r,
    -r,
    r,
    -r,
    r,
    r,
    -r,
    -r,
    -r,
    -r,
    -r,
    -r,
    -r,
    r,
    r,
    -r,
    r,
    -r,

    //right
    r,
    -r,
    r,
    r,
    r,
    r,
    r,
    -r,
    -r,
    r,
    -r,
    -r,
    r,
    r,
    r,
    r,
    r,
    -r,
  ]);

  var texCoords = new Float32Array([
    //front
    1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0,

    //back
    0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,

    //top
    1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,

    //bottom
    1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,

    //left
    1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1,

    //right
    0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
  ]);

  const positionBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

  const texCoordBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, texCoords, webgl.STATIC_DRAW);

  const texturebuffer = webgl.createTexture();
  webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
  webgl.texParameteri(
    webgl.TEXTURE_2D,
    webgl.TEXTURE_WRAP_S,
    webgl.CLAMP_TO_EDGE
  );
  webgl.texParameteri(
    webgl.TEXTURE_2D,
    webgl.TEXTURE_WRAP_T,
    webgl.CLAMP_TO_EDGE
  );

  webgl.texImage2D(
    webgl.TEXTURE_2D,
    0,
    webgl.RGBA,
    webgl.RGBA,
    webgl.UNSIGNED_BYTE,
    image
  );

  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader,
    `uniform mat4 model;
	attribute vec2 vtexture ;
	attribute vec3 pos;
	varying vec2 fragtexture;
	

    void main()
    {
	   gl_Position = model*vec4(pos*0.5,1);  
	   fragtexture = vtexture;
    }`
  );
  webgl.compileShader(vertexShader);

  if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error(
      "Error compiling vertex shader",
      webgl.getShaderInfoLog(vertexShader)
    );
  }

  const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER); //creating a fragment shader
  webgl.shaderSource(
    fragmentShader,
    `precision mediump float;
	varying vec2 fragtexture;
	uniform sampler2D fragsampler;
	void main()
    {
      
       	   gl_FragColor = texture2D(fragsampler,fragtexture);
    }`
  );
  webgl.compileShader(fragmentShader);
  if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error(
      "Error compiling fragment Shader",
      webgl.getShaderInfoLog(fragmentShader)
    );
  }

  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);
  webgl.useProgram(program);
  webgl.enable(webgl.DEPTH_TEST);

  //enable vertex and color attributes
  const positionLocation = webgl.getAttribLocation(program, `pos`); //getting pos location
  webgl.enableVertexAttribArray(positionLocation);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
  webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

  const textureLocation = webgl.getAttribLocation(program, `vtexture`);
  webgl.enableVertexAttribArray(textureLocation);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
  webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);

  let xt = 0;
  let yt = 0;
  let uniform = webgl.uniformMatrix4fv(
    webgl.getUniformLocation(program, `model`),
    false,
    rotationY(xt)
  );

  draw();
  function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.bindTexture(webgl.TEXTURE_2D, texturebuffer);
    webgl.activeTexture(webgl.TEXTURE0);

    //     uniform;

    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 3);

    window.requestAnimationFrame(draw);
  }

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

  document.addEventListener("keydown", (e) => {
    console.log(e.key);

    if (e.key == "W") {
      xt = xt - 0.1;
      uniform = webgl.uniformMatrix4fv(
        webgl.getUniformLocation(program, `model`),
        false,
        rotationX(xt)
      );
    }

    if (e.key == "Q") {
      yt = yt + 0.1;
      uniform = webgl.uniformMatrix4fv(
        webgl.getUniformLocation(program, `model`),
        false,
        rotationY(yt)
      );
    }
  });
}
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const canvas1 = document.getElementById("mycanvas2");
const gl = canvas1.getContext(`webgl`);
if (!gl) {
  throw new Error("WebGL NOT supported by this browser");
} else {
  gl.clearColor(0.4, 0.8, 0.1, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const jsarray = [0, 0, 0];
  var x, y, z;
  var deltaP = (2 * Math.PI) / 60;
  var arch = 2 * Math.PI;
  for (z = -1; z <= 1; z += 0.1) {
    var r = Math.cos(z * (Math.PI / 2));

    for (p = 0; p <= arch; p += deltaP) {
      x = r * Math.cos(p);
      y = r * Math.sin(p);

      jsarray.push(x);
      jsarray.push(y);
      jsarray.push(z);
    }
  }

  const vertices = new Float32Array(jsarray);

  const colors = new Float32Array(jsarray);

  const buffer1 = gl.createBuffer();
  const vertices2 = new Float32Array(jsarray);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);

  const vertexShader1 = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader1,
    `attribute vec3 pos;
	uniform float shiftX;
	uniform float shiftY;
    uniform mat4 model;
	attribute vec3 color;
	varying vec3 fragcolor;

	
    void main()
    {
        gl_PointSize= 3.0; 
	   gl_Position = model*vec4(pos*0.25,1)+vec4(shiftX,0.25,0,0);  
	   fragcolor = color; 
    }`
  );

  gl.compileShader(vertexShader1);

  const fragmentShader1 = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fragmentShader1,
    `
	precision mediump float;
	varying vec3 fragcolor;

	void main()
    {
      
       	   gl_FragColor = vec4(fragcolor,1);
    }`
  );
  gl.compileShader(fragmentShader1);
  if (!gl.getShaderParameter(fragmentShader1, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling fragment Shader",
      gl.getShaderInfoLog(fragmentShader1)
    );
  }

  const program1 = gl.createProgram();
  gl.attachShader(program1, vertexShader1);
  gl.attachShader(program1, fragmentShader1);
  gl.linkProgram(program1);
  gl.useProgram(program1);
  gl.enable(gl.DEPTH_TEST);

  const positionLocation1 = gl.getAttribLocation(program1, `pos`); //getting pos location
  gl.enableVertexAttribArray(positionLocation1);
  gl.vertexAttribPointer(positionLocation1, 3, gl.FLOAT, false, 0, 0);

  const colorLocation1 = gl.getAttribLocation(program1, `color`); //getting pos location
  gl.enableVertexAttribArray(colorLocation1);
  gl.vertexAttribPointer(colorLocation1, 3, gl.FLOAT, false, 0, 0);

  const uniformLocationX = gl.getUniformLocation(program1, `shiftX`);
  const uniformLocationY = gl.getUniformLocation(program1, `shiftY`);
  const rotate = gl.getUniformLocation(program1, `model`);

  let myShiftX = 0;
  let myShiftY = 0;
  let rotateX = 0;

  let shift1 = 0.01;
  let up = 0;
  let start = 1;
  draw();
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (start == 1) {
      rotateX = rotateX + 0.1;
      myShiftX += shift1;
    }

    if (myShiftX >= -0.75) {
      shift1 *= -1;
    }
    if (myShiftX <= 0.75) {
      shift1 *= -1;
    }
    if (myShiftY >= 0.95) {
      shift1 *= -1;
    }
    if (myShiftY < -0) {
      shift1 *= -1;
    }

    gl.uniform1f(uniformLocationX, myShiftX);
    gl.uniform1f(uniformLocationY, myShiftY);
    gl.uniformMatrix4fv(rotate, false, rotationY(rotateX));

    gl.drawArrays(webgl.POINTS, 0, jsarray.length / 3);

    window.requestAnimationFrame(draw);
  }

  function rotationX(angleInRadian) {
    var c = Math.cos(angleInRadian);
    var s = Math.sin(angleInRadian);
    var r = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    return r;
  }
}
