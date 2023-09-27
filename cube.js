const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  var vertices = [
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
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    -1,
  ];

  var colors = [
    5,
    3,
    7,
    5,
    3,
    7,
    5,
    3,
    7,
    5,
    3,
    7,
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    1,
    3,
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
  ];

  var indices = [
    0,
    1,
    2,
    0,
    2,
    3,
    4,
    5,
    6,
    4,
    6,
    7,
    8,
    9,
    10,
    8,
    10,
    11,
    12,
    13,
    14,
    12,
    14,
    15,
    16,
    17,
    18,
    16,
    18,
    19,
    20,
    21,
    22,
    20,
    22,
    23,
  ];

  // Create and store data into vertex buffer
  var vertex_buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, vertex_buffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(vertices),
    webgl.STATIC_DRAW
  );

  // Create and store data into color buffer
  var color_buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, color_buffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(colors),
    webgl.STATIC_DRAW
  );

  // Create and store data into index buffer
  var index_buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, index_buffer);
  webgl.bufferData(
    webgl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    webgl.STATIC_DRAW
  );

  /*=================== Shaders =========================*/

  var vertCode =
    "attribute vec3 position;" +
    "uniform mat4 Pmatrix;" +
    "uniform mat4 Vmatrix;" +
    "uniform mat4 Mmatrix;" +
    "attribute vec3 color;" + //the color of the point
    "varying vec3 vColor;" +
    "void main(void) { " + //pre-built function
    "gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);" +
    "vColor = color;" +
    "}";

  var fragCode =
    "precision mediump float;" +
    "varying vec3 vColor;" +
    "void main(void) {" +
    "gl_FragColor = vec4(vColor, 1.);" +
    "}";

  var vertShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(vertShader, vertCode);
  webgl.compileShader(vertShader);

  var fragShader = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(fragShader, fragCode);
  webgl.compileShader(fragShader);

  var shaderProgram = webgl.createProgram();
  webgl.attachShader(shaderProgram, vertShader);
  webgl.attachShader(shaderProgram, fragShader);
  webgl.linkProgram(shaderProgram);

  /* ====== Associating attributes to vertex shader =====*/
  var Pmatrix = webgl.getUniformLocation(shaderProgram, "Pmatrix");
  var Vmatrix = webgl.getUniformLocation(shaderProgram, "Vmatrix");
  var Mmatrix = webgl.getUniformLocation(shaderProgram, "Mmatrix");

  webgl.bindBuffer(webgl.ARRAY_BUFFER, vertex_buffer);
  var position = webgl.getAttribLocation(shaderProgram, "position");
  webgl.vertexAttribPointer(position, 3, webgl.FLOAT, false, 0, 0);

  // Position
  webgl.enableVertexAttribArray(position);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, color_buffer);
  var color = webgl.getAttribLocation(shaderProgram, "color");
  webgl.vertexAttribPointer(color, 3, webgl.FLOAT, false, 0, 0);

  // Color
  webgl.enableVertexAttribArray(color);
  webgl.useProgram(shaderProgram);

  /*==================== MATRIX =====================*/

  function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle * 1 * Math.PI) / 360); //angle*.5
    return [
      0.5 / ang,
      0,
      0,
      0,
      0,
      (0.5 * a) / ang,
      0,
      0,
      0,
      0,
      -(zMax + zMin) / (zMax - zMin),
      -1,
      0,
      0,
      (-2 * zMax * zMin) / (zMax - zMin),
      0,
    ];
  }

  var proj_matrix = get_projection(30, canvas.width / canvas.height, 1, 100);

  var mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  // translating z
  view_matrix[14] = view_matrix[14] - 6; //zoom

  /*==================== Rotation ====================*/

  function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0],
      mv4 = m[4],
      mv8 = m[8];

    m[0] = c * m[0] - s * m[1];
    m[4] = c * m[4] - s * m[5];
    m[8] = c * m[8] - s * m[9];

    m[1] = c * m[1] + s * mv0;
    m[5] = c * m[5] + s * mv4;
    m[9] = c * m[9] + s * mv8;
  }

  function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1],
      mv5 = m[5],
      mv9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + mv1 * s;
    m[6] = m[6] * c + mv5 * s;
    m[10] = m[10] * c + mv9 * s;
  }

  function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0],
      mv4 = m[4],
      mv8 = m[8];

    m[0] = c * m[0] + s * m[2];
    m[4] = c * m[4] + s * m[6];
    m[8] = c * m[8] + s * m[10];

    m[2] = c * m[2] - s * mv0;
    m[6] = c * m[6] - s * mv4;
    m[10] = c * m[10] - s * mv8;
  }

  /*================= Drawing ===========================*/
  var time_old = 0;

  var animate = function (time) {
    var dt = time - time_old;
    rotateZ(mov_matrix, dt * 0.001); //time
    rotateY(mov_matrix, dt * 0.001);
    rotateX(mov_matrix, dt * 0.001);
    time_old = time;

    webgl.enable(webgl.DEPTH_TEST);
    webgl.depthFunc(webgl.LEQUAL);
    webgl.clearColor(0.5, 0.5, 0.5, 0.9);
    webgl.clearDepth(1.0);

    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    webgl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    webgl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, index_buffer);
    webgl.drawElements(
      webgl.TRIANGLES,
      indices.length,
      webgl.UNSIGNED_SHORT,
      0
    );

    window.requestAnimationFrame(animate);
  };
  animate(0);
}
