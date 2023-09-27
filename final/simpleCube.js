const canvas2 = document.querySelector(`canvas`);
const gl = canvas2.getContext(`webgl`);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.clearColor(0.7, 0.5, 0.7, 1);

if (!gl) {
  throw new Error("WebGL NOT supported by this browser");
} else {
  var r = 0.5;
  let image = document.getElementById("myImage");

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

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

  const texturebuffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader,
    `uniform mat4 model;
	attribute vec2 vtexture ;
	attribute vec3 pos;
	varying vec2 fragtexture;
	

    void main()
    {
	   gl_Position = model*vec4(pos*0.5,1)+ vec4(0.6,0.4,0,0);  
	   fragtexture = vtexture;
    }`
  );
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling vertex shader",
      gl.getShaderInfoLog(vertexShader)
    );
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //creating a fragment shader
  gl.shaderSource(
    fragmentShader,
    `precision mediump float;
	varying vec2 fragtexture;
	uniform sampler2D fragsampler;
	void main()
    {
      
       	   gl_FragColor = texture2D(fragsampler,fragtexture);
    }`
  );
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling fragment Shader",
      gl.getShaderInfoLog(fragmentShader)
    );
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);

  //enable vertex and color attributes
  const positionLocation = gl.getAttribLocation(program, `pos`); //getting pos location
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const textureLocation = gl.getAttribLocation(program, `vtexture`);
  gl.enableVertexAttribArray(textureLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
  gl.activeTexture(gl.TEXTURE0);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

  let xt = 0;
  let yt = 0;
  let uniform = gl.uniformMatrix4fv(
    gl.getUniformLocation(program, `model`),
    false,
    rotationY(xt)
  );

  //   draw();
  //   function draw() {
  //     // webgl.clear(webgl.COLOR_BUFFER_BIT);
  //     gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
  //     gl.activeTexture(gl.TEXTURE0);

  //     // uniform;

  //     gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

  //     window.requestAnimationFrame(draw);
  //   }

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
      uniform = gl.uniformMatrix4fv(
        gl.getUniformLocation(program, `model`),
        false,
        rotationX(xt)
      );
    }

    if (e.key == "Q") {
      yt = yt + 0.1;
      uniform = gl.uniformMatrix4fv(
        gl.getUniformLocation(program, `model`),
        false,
        rotationY(yt)
      );
    }
  });
}
