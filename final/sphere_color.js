const canvas = document.getElementById("mycanvas");
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL NOT supported by this browser");
} else {
  webgl.clearColor(0.4, 0.8, 0.1, 0.5);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  const vertices = new Float32Array([
    1, -1, 1, 0, 1, 0, -1, -1, 1,

    //Upper left
    -1, -1, 1, 0, 1, 0, -1, -1, -1,

    //Upper back
    -1, -1, -1, 0, 1, 0, 1, -1, -1,

    //Upper right
    1, -1, -1, 0, 1, 0, 1, -1, 1,

    //Lower top
    1, -1, 1, 0, -3, 0, -1, -1, 1,

    //Lower left
    -1, -1, 1, 0, -3, 0, -1, -1, -1,

    //Lower back
    -1, -1, -1, 0, -3, 0, 1, -1, -1,

    //Lower right
    1, -1, -1, 0, -3, 0, 1, -1, 1,
  ]);

  const buffer = webgl.createBuffer();

  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader,
    `attribute vec3 pos;
	uniform float shiftX;
	uniform float shiftY;
    uniform mat4 model;
	attribute vec3 color;
	varying vec3 fragcolor;

    void main()
    {
       gl_PointSize= 3.0; 
	   gl_Position = model*vec4(pos*0.20,1)+vec4(shiftX,shiftY,0,0);  
	   fragcolor = color; 
    }`
  );

  webgl.compileShader(vertexShader);

  const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader,
    `
	precision mediump float;
	varying vec3 fragcolor;

	void main()
    {
      
     gl_FragColor = vec4(fragcolor,1);
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

  const positionLocation = webgl.getAttribLocation(program, `pos`); //getting pos location
  webgl.enableVertexAttribArray(positionLocation);
  webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

  const colorLocation = webgl.getAttribLocation(program, `color`); //getting pos location
  webgl.enableVertexAttribArray(colorLocation);
  webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 0, 0);

  const uniformLocationX = webgl.getUniformLocation(program, `shiftX`);
  const uniformLocationY = webgl.getUniformLocation(program, `shiftY`);
  const rotate = webgl.getUniformLocation(program, `model`);

  let myShiftX = 0;
  let myShiftY = 0;
  let rotateXY = 0;

  let shift1 = 0.01;
  let start = 1;
  let shiftx = 0;
  let shifty = 0;
  let uniform = webgl.uniformMatrix4fv(rotate, false, rotationX(rotateXY));

  draw();

  function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    if (start == 1) {
      rotateXY = rotateXY + 0.1;
      if (shiftx == 1) {
        myShiftX += shift1;
      }
      if (shifty == 1) {
        myShiftY += shift1;
      }
      if (shiftx == 1 && shifty == 1) {
        myShiftX += shift1;
        myShiftY += shift1;
      }
    }

    if (myShiftX >= -0.8) {
      shift1 *= -1;
    }
    if (myShiftX <= 0.8) {
      shift1 *= -1;
    }
    if (myShiftY >= 0.8) {
      shift1 *= -1;
    }
    if (myShiftY < -0.4) {
      shift1 *= -1;
    }

    webgl.uniform1f(uniformLocationX, myShiftX);
    webgl.uniform1f(uniformLocationY, myShiftY);

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
    if (e.key == "X") {
      uniform = webgl.uniformMatrix4fv(
        webgl.getUniformLocation(program, `model`),
        false,
        rotationX(rotateXY)
      );
    }

    if (e.key == "Y") {
      uniform = webgl.uniformMatrix4fv(
        webgl.getUniformLocation(program, `model`),
        false,
        rotationY(rotateXY)
      );
    }

    if (e.key == "ArrowRight") {
      shiftx = 1;
      shifty = 0;
    }

    if (e.key == "ArrowUp") {
      shifty = 1;
      shiftx = 0;
    }

    if (e.key == "D") {
      shifty = 1;
      shiftx = 1;
    }
  });
}
