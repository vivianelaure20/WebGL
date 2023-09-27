const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.clearColor(1,0.9,0.9,1);


if(!webgl)
{
    throw new Error("WebGL NOT supported by this browser");
}
else{
    
  const jsarray = [0,0,0];
    var x,y,z;
    var deltaP =(2*Math.PI)/64;
    var arch = 2*Math.PI;
    var r;
 var zincrement =0.1;
for(z=-1; z<=1; z+=0.1){
    
    r = Math.cos(z*(Math.PI/2));

    for (p=0; p<=arch; p+=deltaP){

        x= (r*Math.cos(p));
        y= (r*Math.sin(p));

        jsarray.push(x);
        jsarray.push(y);
        jsarray.push(z);

    }
}
webgl.clearColor(0.5,0.3,0.7,1);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertices1 = new Float32Array(jsarray);

const buffer1 = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer1);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices1, webgl.STATIC_DRAW);

const vertexShader1 = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader1,
`attribute vec3 pos;
void main() { 
    gl_PointSize =2.0;
    gl_Position = vec4(pos*0.25,1)+vec4(-0.5,0,0,0); }` );
webgl.compileShader(vertexShader1);

const fragmentShader1 = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader1,
`void main() { gl_FragColor = vec4(0.6,0.7,0.5,1); }`);
webgl.compileShader(fragmentShader1);

const program1 = webgl.createProgram();
webgl.attachShader(program1, vertexShader1);
webgl.attachShader(program1, fragmentShader1);
webgl.linkProgram(program1);
webgl.useProgram(program1);

const positionLocation1 = webgl.getAttribLocation(program1, `pos`);
webgl.enableVertexAttribArray(positionLocation1);
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer1);
webgl.vertexAttribPointer(positionLocation1, 3, webgl.FLOAT, false, 0, 0);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, vertices1.length/3);

// const positionLocation = webgl.getAttribLocation(program, `pos`);//getting pos location
// webgl.enableVertexAttribArray(positionLocation);  
// webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
// webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);



    var r =0.5;
 let image = document.getElementById("myImage");
 
	var vertices = new Float32Array([
	//front
	r,r,r,
	r,-r,r,
	-r,r,r,
	-r,r,r,
	r,-r,r,
	-r,-r,r,
	
	//back
	r,r,-r,
	r,-r,-r,
	-r,r,-r,
	-r,r,-r,
	r,-r,-r,
	-r,-r,-r,
	
	//top
	r,r,r,
	-r,r,r,
	-r,r,-r,
	r,r,r,
	-r,r,-r,
	r,r,-r,	
	
	//bottom
	r,-r,r,
	-r,-r,r,
	-r,-r,-r,
	r,-r,r,
	-r,-r,-r,
	r,-r,-r,

	//left
	-r,-r,r,
	-r,r,r,
	-r,-r,-r,
	-r,-r,-r,
	-r,r,r,
	-r,r,-r,	
	
	//right
	r,-r,r,
	r,r,r,
	r,-r,-r,
	r,-r,-r,
	r,r,r,
	r,r,-r,	
	
	]);
	
var texCoords = new Float32Array([
	//front
	1,1,
	1,0,
	0,1,
	0,1,
	1,0,
	0,0,
		
	//back
	0,1,
	0,0,
	1,1,
	1,1,
	0,0,
	1,0,
	
	//top
	1,0,
	0,0,
	0,1,
	1,0,
	0,1,
	1,1,
	
	//bottom
	1,1,
	0,1,
	0,0,
	1,1,
	0,0,
	1,0,

	//left
	1,0,
	1,1,
	0,0,
	0,0,
	1,1,
	0,1,
	
	
		
	//right
	0,0,
	0,1,
	1,0,
	1,0,
	0,1,
	1,1,
	
	
	]);
	
	
    const positionBuffer = webgl.createBuffer(); 
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
	webgl.bufferData(webgl.ARRAY_BUFFER, vertices,webgl.STATIC_DRAW); 

	const texCoordBuffer = webgl.createBuffer(); 
    webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
	webgl.bufferData(webgl.ARRAY_BUFFER, texCoords,webgl.STATIC_DRAW); 
	
	const texturebuffer = webgl.createTexture();
  webgl.bindTexture(webgl.TEXTURE_2D,texturebuffer); 
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);/**/
	
	webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGBA,webgl.RGBA,webgl.UNSIGNED_BYTE,image);
  
const vertexShader = webgl.createShader(webgl.VERTEX_SHADER); 
webgl.shaderSource(vertexShader, 
    `
	attribute vec2 vtexture ;
	attribute vec3 pos;
	varying vec2 fragtexture;
	

    void main()
    {
	   gl_Position = vec4(pos*0.5,1)+ vec4(0.5,0,0,0);  
	   fragtexture = vtexture;
    }`);
webgl.compileShader(vertexShader);

if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
}

const fragmentShader =  webgl.createShader(webgl.FRAGMENT_SHADER);//creating a fragment shader
webgl.shaderSource(fragmentShader, 
    `precision mediump float;
	varying vec2 fragtexture;
	uniform sampler2D fragsampler;
	void main()
    {
      
       	   gl_FragColor = texture2D(fragsampler,fragtexture);
    }`);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling fragment Shader", webgl.getShaderInfoLog(fragmentShader));
}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader  );
webgl.attachShader(program, fragmentShader  );
webgl.linkProgram(program);
webgl.useProgram(program);
webgl.enable(webgl.DEPTH_TEST);

//enable vertex and color attributes
const positionLocation = webgl.getAttribLocation(program, `pos`);//getting pos location
webgl.enableVertexAttribArray(positionLocation);  
webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);

const textureLocation = webgl.getAttribLocation(program, `vtexture`);
webgl.enableVertexAttribArray(textureLocation);    
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length/3);

    webgl.bindTexture(webgl.TEXTURE_2D,texturebuffer);
	webgl.activeTexture(webgl.TEXTURE0);

}
