const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
 if(!webgl){ throw new Error("WebGL not available/supported");}
 webgl.clearColor(0,0.7,0.7,1);
// webgl.clearColor(0.1, 0.3, 0.1, 1);
// let primitiveOptions = document.getElementById('options');
// let primitive;

const jsarray = [0, 0,0];
  var x, y, z;
  var deltaP = (2 * Math.PI) / 60; // nombre de point dans le cercle 
  var arch = 2 * Math.PI;// full cercle
//   var r = 1; // rayon
for(z=-1; z<=1; z+=0.1){

   var r = Math.cos(z*(Math.PI/2));

    for (p = 0; p <= arch; p += deltaP) {
        x = r * Math.cos(p);
        y = r * Math.sin(p);
    
        jsarray.push(x);
        jsarray.push(y);
        jsarray.push(z);

      }
}


 const vertices2 = new Float32Array(jsarray);
 const buffer2 = webgl.createBuffer();
 const vertexShader2 = webgl.createShader(webgl.VERTEX_SHADER);
 webgl.shaderSource(vertexShader2,
 `attribute vec3 pos;
    uniform mat4 model;
 void main() { 
     gl_PointSize= 3.0; 
     gl_Position = model*vec4(pos*0.5,1)+vec4(0,0,1,0); }` );

   

 webgl.compileShader(vertexShader2);
 const fragmentShader2 = webgl.createShader(webgl.FRAGMENT_SHADER);
 webgl.shaderSource(fragmentShader2,
    `void main() { gl_FragColor = vec4(1,0,.9,1); }`);

 webgl.compileShader(fragmentShader2);
 if(!webgl.getShaderParameter(fragmentShader2, webgl.COMPILE_STATUS)){
     console.error("Error compiling vertex shader", webgl.getShaderInfoLog(fragmentShader2));
 }


 webgl.compileShader(fragmentShader2);
 const program2 = webgl.createProgram();
 webgl.attachShader(program2, vertexShader2);
 webgl.attachShader(program2, fragmentShader2);
 webgl.linkProgram(program2);
 webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer2); 
 webgl.bufferData(webgl.ARRAY_BUFFER, vertices2, webgl.STATIC_DRAW);
 const positionLocation2 = webgl.getAttribLocation(program2, `pos`);
 webgl.enableVertexAttribArray(positionLocation2);
 webgl.vertexAttribPointer(positionLocation2, 3, webgl.FLOAT, false, 0, 0);
 webgl.useProgram(program2);

 
 let xt=0;
 let yt=0;
 let uniform =webgl.uniformMatrix4fv(webgl.getUniformLocation(program2,`model`),false,rotationY(xt));

draw();

 function draw(){
  
uniform;
  webgl.clear(webgl.COLOR_BUFFER_BIT);
 
  if(primitive =="triangles"){  webgl.drawArrays(webgl.TRIANGLE_FAN, 0, jsarray.length/3);
  }
if(primitive =="points"){ webgl.drawArrays(webgl.POINTS, 0, jsarray.length/3);
  }

  if(primitive =="lines"){ webgl.drawArrays(webgl.LINE_LOOP, 0, jsarray.length/3);

  }

  window.requestAnimationFrame(draw);

}

function rotationX(angleInRadian) {
  var c = Math.cos(angleInRadian);
  var s = Math.sin(angleInRadian);
  var r= new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s,c, 0,
    0, 0, 0, 1,
  ]);
  return r;

}
function rotationY(angleInRadian) {
var c = Math.cos(angleInRadian);
var s = Math.sin(angleInRadian);
var r= new Float32Array([
    c,0, -s,0,
    0,1, 0,0,
    s,0,c,0,
    0,0, 0,1,
  ]);
return  r;
}



document.addEventListener("keydown", e=>
{console.log(e.key);

    if(e.key == "ArrowUp")
    {
        xt++
        uniform =    webgl.uniformMatrix4fv(webgl.getUniformLocation(program2,`model`),false,rotationX(xt));
    }
    if(e.key == "ArrowDown")
    {
        uniform =    webgl.uniformMatrix4fv(webgl.getUniformLocation(program2,`model`),false,rotationX(xt));
        xt--
    }
    if(e.key == "ArrowLeft")
    {
        yt++
        uniform =    webgl.uniformMatrix4fv(webgl.getUniformLocation(program2,`model`),false,rotationY(yt));

    }
    if(e.key == "ArrowRight")
    {
        uniform =    webgl.uniformMatrix4fv(webgl.getUniformLocation(program2,`model`),false,rotationY(yt));
        yt--

    }



});
var primitive;
 var options = document.getElementById("options");


 function choosePrimitive() {

     primitive = options.value;
 
}