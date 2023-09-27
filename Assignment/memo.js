const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`); 
//------------------------1
webgl.clearColor(0.9,0.9,0.9,0);
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);
webgl.enable(webgl.BLEND);
//-----------------------------2


webgl.enable(webgl.BLEND); //you will need Lines 3 and 4 in for your alpha value to change
webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);//alpha (a)value is transparency/opacity in your fragment shader rgba
let xslider = document.getElementById("xslider");
let xsliderLabel = document.getElementById("xsliderLabel");
let yslider = document.getElementById("yslider");
let ysliderLabel = document.getElementById("ysliderLabel");
let zslider = document.getElementById("zslider");
let zsliderLabel = document.getElementById("zsliderLabel");
let alpha = 1.0;
let sizevalue = 0.25;
let alphaslider = document.getElementById("alpha");
let alphaLabel = document.getElementById("alphaLabel");
let size =document.getElementById("size");
let sizeLabel = document.getElementById("sizeLabel");
let buttonx = document.getElementById("x");
let buttony = document.getElementById("y");
let buttonz = document.getElementById("z");
let movexLabel = document.getElementById("movexLabel");
let movex =document.getElementById("movex");
let moveyLabel = document.getElementById("moveyLabel");
let movey =document.getElementById("movey");


/*   Box that fills  the whole 3-D canvas*/
        //1 FRONT FACE  RED

   //--------------------------------- 3    
    let vertices = new Float32Array([
   //----------------------------------------

      -1,1,1,     1,0,0,
    -1,-1,1,     1,0,0,
    1,-1,1,       1,0,0,
	1,1,1,     1,0,0,
  -1,1,1,     1,0,0,
  1,-1,1,       1,0,0,

    //2 RIGHT FACE  YELLOW
    1,1,1,         1,0,1,
     1,-1,1,         1,0,1,
     1,1,-1,          1,0,1, 
    1,-1,1,         1,0,1,
     1,1,-1,         1,0,1,
      1,-1,-1,           1,0,1,

    //3 BACK FACE  BLUE
    -1,1,-1,         0,0,1,
    -1,-1,-1,         0,0,1,
    1,-1,-1,           0,0,1,
	1,1,-1,         0,0,1,
  -1,1,-1,         0,0,1,
  1,-1,-1,          0,0,1, 

    //4 LEFT FACE GREEN 
    -1,1,1,         0,1,0,
    -1,-1,1,         0,1,0,
    -1,1,-1,           0,1,0,
    -1,-1,1,         0,1,0,
    -1,1,-1,         0,1,0,
    -1,-1,-1,          0,1,0, 

    //5 BOTTOM FACE  GREEN + BLUE
    -1,-1,1,         0,1,1,
    1,-1,1,         0,1,1,
    -1,-1,-1,          0,1,1, 
    -1,-1,-1,         0,1,1,
    1,-1,-1,         0,1,1,
    1,-1,1,           0,1,1,

    //6 TOP FACE  RED + GREEN
    -1,1,1,         1,1,0,
    1,1,1,         1,1,0,
    -1,1,-1,          1,1,0, 
    -1,1,-1,         1,1,0,
    1,1,-1,         1,1,0,
    1,1,1,           1,1,0,
  //---------------------
  ]);
  //------------------------------4

//-------------------------------------------------5
const buffer = webgl.createBuffer(); //create buffer
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices,webgl.STATIC_DRAW);
//------------------------------------------

 //----------------------------------------------------------6
  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);//creating vertex shader
  webgl.shaderSource(vertexShader, 
      `attribute vec3 pos,color;
      uniform float valpha,size;
      varying vec3 fragcolor;
      varying float alpha;
      void main()
      {  
          fragcolor = color;
          gl_Position = vec4(size*pos,1) ;
          alpha = valpha;          
      }`);
      webgl.compileShader(vertexShader);
      if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
          console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
      }

      const fragmentShader =  webgl.createShader(webgl.FRAGMENT_SHADER);//creating a fragment shader
    webgl.shaderSource(fragmentShader, 
    `precision mediump float;
   varying vec3 fragcolor;
   varying float alpha;
    void main()
    {
        gl_FragColor = vec4(fragcolor,alpha); 
    }`);
  webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling Fragment shader", webgl.getShaderInfoLog(fragmentShader));
}
   //------------------------------------------------------------   


   //-----------------------------------------------7
   const program = webgl.createProgram(); 
   webgl.attachShader(program, vertexShader); 
   webgl.attachShader(program, fragmentShader); 
   webgl.linkProgram(program);
   webgl.useProgram(program);
  //---------------------------------------------------------


  //---------------------------------8
  const positionLocation = webgl.getAttribLocation(program, `pos`);
  webgl.enableVertexAttribArray(positionLocation);
  webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 6*4, 0);
  const colorLocation = webgl.getAttribLocation(program, `color`);
  webgl.enableVertexAttribArray(colorLocation);
  webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 6*4, 3*4);


  //------------------------------------------9
  draw();
  function draw()
  {
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `size`), sizevalue);
    webgl.uniform1f(webgl.getUniformLocation(program, `valpha`), alpha);
    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length/6); 
    window.requestAnimationFrame(draw);

  }



//if you use degrees for your angle you need to change it to radians     
let degTorad = 2*Math.PI/360;
//adding even listeners
xslider.oninput = function() {
    xsliderLabel.innerHTML = this.value;//this changes the value on the html
    xr = this.value *degTorad; //this changes the value to radians
    //rotate along the x
  }
  yslider.oninput = function() {
    ysliderLabel.innerHTML = this.value;//this changes the value on the html
    xy = this.value *degTorad;
    //rotate along the y
  }
  zslider.oninput = function() {
    zsliderLabel.innerHTML = this.value;//this changes the value on the html
    xz = this.value *degTorad;
    //rotate along the z
  }

  //------------------------------
  size.oninput = function() {
    sizeLabel.innerHTML = this.value;//this changes the value on the html
    sizevalue = this.value;//-----------10
    
  }
//---------------
  alphaslider.oninput = function() {
    alphaLabel.innerHTML = this.value; //this changes the value on the html
    alpha= this.value;//------------------11
    //set the size of the alpha
  }

   
  movex.oninput = function() {
    movexLabel.innerHTML = this.value;
    xt = this.value;
    
  }
  movey.oninput = function() {
    moveyLabel.innerHTML = this.value;
    yt = this.value;
    
  }
 
 //This is to remind you what a rotation along x,y and z matrices look like
function roty(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      c,0, -s,0,
      0,1, 0,0,
      s,0,c,0,
	  0,0, 0,1,
    ]);
  }

function rotx(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s,c, 0,
	  0, 0, 0, 1,
    ]);
  }
 
 function rotz(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      c,-s,0,0,
      s, c,0,0,
      0, 0,1,0,
	  0, 0,0,1,
    ]);
  }
  function trans(tx,ty,tz){
      return new Float32Array([
          1,0,0,tx, 
          0,1,0,ty, 
          0,0,1,tz,
          0,0,0,1
        ]);
      }

//hopefully you have your own
function multiply(a,b){

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

      }
