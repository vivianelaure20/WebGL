const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  //SPHERE USING TRIANGLE FAN
  const jsarray = [0, 0, 0];
  var x, y, z;
  var deltaP = (2 * Math.PI) / 64;
  var arch = 2 * Math.PI;
  var r;

  for (z = -1; z <= 1; z += 0.1) {
    r = Math.cos(z * (Math.PI / 2));
    for (p = 0; p <= arch; p += deltaP) {
      x = r * Math.cos(p);
      y = r * Math.sin(p);

      jsarray.push(x);
      jsarray.push(y);
      jsarray.push(z);
    }
  }
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  const vertices = new Float32Array(jsarray);
  const buffer = webgl.createBuffer();

  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader,
    `attribute vec3 pos;
void main() { 

    gl_Position = vec4(pos*0.25,1)+vec4(-0.5,-0.25,0,0); }`
  );
  webgl.compileShader(vertexShader);

  const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader,
    `void main() { gl_FragColor = vec4(1,0,1,1); }`
  );
  webgl.compileShader(fragmentShader);

  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);
  webgl.useProgram(program);
  const positionLocation = webgl.getAttribLocation(program, `pos`);
  webgl.enableVertexAttribArray(positionLocation);
  webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.drawArrays(webgl.TRIANGLE_FAN, 0, vertices.length / 3);

  //SPHERE USING POINTS

  const jsarray2 = [0, 0, 0];
  var x2, y2, z2;
  var r2;

  for (z2 = -1; z2 <= 1; z2 += 0.1) {
    r2 = Math.cos(z2 * (Math.PI / 2));
    for (p2 = 0; p2 <= arch; p2 += deltaP) {
      x2 = r2 * Math.cos(p2);
      y2 = r2 * Math.sin(p2);
      jsarray2.push(x2);
      jsarray2.push(y2);
      jsarray2.push(z2);
    }
  }
  const vertices2 = new Float32Array(jsarray2);
  const buffer2 = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer2);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);

  const vertexShader2 = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader2,
    `attribute vec3 pos;
  void main() {
    gl_PointSize = 3.0;
      gl_Position = vec4(pos*0.25,1)+vec4(0,0.5,0,0); }`
  );
  webgl.compileShader(vertexShader2);

  const fragmentShader2 = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader2,
    `void main() { gl_FragColor = vec4(1,0,1,1); }`
  );
  webgl.compileShader(fragmentShader2);

  const program2 = webgl.createProgram();
  webgl.attachShader(program2, vertexShader2);
  webgl.attachShader(program2, fragmentShader2);
  webgl.linkProgram(program2);
  webgl.useProgram(program2);
  const positionLocation2 = webgl.getAttribLocation(program2, `pos`);
  webgl.enableVertexAttribArray(positionLocation2);
  webgl.vertexAttribPointer(positionLocation2, 3, webgl.FLOAT, false, 0, 0);
  webgl.drawArrays(webgl.POINTS, 0, vertices2.length / 3);

  //SPHERE USING LINES LOOP

  const jsarray3 = [0, 0, 0];
  var x3, y3, z3;
  var r3;

  for (z3 = -1; z3 <= 1; z3 += 0.1) {
    r3 = Math.cos(z3 * (Math.PI / 2));
    for (p3 = 0; p3 <= arch; p3 += deltaP) {
      x3 = r3 * Math.cos(p3);
      y3 = r3 * Math.sin(p3);
      jsarray3.push(x3);
      jsarray3.push(y3);
      jsarray3.push(z3);
    }
  }

  const vertices3 = new Float32Array(jsarray3);
  const buffer3 = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer3);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices3, webgl.STATIC_DRAW);

  const vertexShader3 = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader3,
    `attribute vec3 pos;
    void main() {
    
        gl_Position = vec4(pos*0.25,1)+vec4(0.5,-0.25,0,0); }`
  );
  webgl.compileShader(vertexShader3);

  const fragmentShader3 = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader3,
    `void main() { gl_FragColor = vec4(1,0,1,1); }`
  );
  webgl.compileShader(fragmentShader3);

  const program3 = webgl.createProgram();
  webgl.attachShader(program3, vertexShader3);
  webgl.attachShader(program3, fragmentShader3);
  webgl.linkProgram(program3);
  webgl.useProgram(program3);
  const positionLocation3 = webgl.getAttribLocation(program3, `pos`);
  webgl.enableVertexAttribArray(positionLocation3);
  webgl.vertexAttribPointer(positionLocation3, 3, webgl.FLOAT, false, 0, 0);
  webgl.drawArrays(webgl.LINE_LOOP, 0, vertices3.length / 3);
}
