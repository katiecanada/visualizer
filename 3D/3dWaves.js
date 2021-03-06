

// the main three.js components
var camera, scene, renderer, ticks, composer, vlight
var initComposer

//variables used to draw waves, kaleido, and dots
var numLines;
var lineLength; 
var vlightx, vlighty, vlightz;
var xpos, ypos, zpos;
var fov = 150;
var near = 1; 
var far = 4000;
var vlightRadius;
var vlightDetail;

//array to hold all of the lines in the scene
lines = [];


function WavesInit() {
	//initialize the variables to draw the waves
	vlightx = 500;
	vlighty = 1200;
	vlightz = 500;
	zpos = 800;
	ypos = 1200;
	xpos = 500;
	numLines = 10;
	lineLength = 4000;
	ticks=0;
	vlightRadius = 200;
	vlightDetail = 3;

	initCanvasWebGL(); //this allows for 3D context //ADT

	initCamera();
	drawWaves();
	drawvLight();
				
	//camera.lookAt(vlight);  WHY DOESN'T THIS WORK
	initRenderer();
	
	initComposer();
	
    	composer.render();


}

//inits the THREE camera and addis it to a new THREE scene
function initCamera(){
	var width = canvWebGL.width; //references to the 3D context //ADT
	var height = canvWebGL.height; //ADT
	camera = new THREE.PerspectiveCamera(fov, width / height, near, far );
	camera.position.z = zpos;
	camera.position.y= ypos;
	camera.position.x= xpos;
	scene = new THREE.Scene();

	scene.add(camera);

}

//initializes a THREE renderer and adds its DOM element to the screen
function initRenderer(){
	var width = canvWebGL.width; //ADT
	var height = canvWebGL.height; //ADT

	renderer = new THREE.WebGLRenderer({canvas: canvWebGL}); //ADT
	//renderer = new THREE.CanvasRenderer({ canvas : canv });
	renderer.setSize(width, height );
	//document.getElementById("screen").appendChild( renderer.domElement); //this isn't needed //ADT

}


//draws the voluminous light object that leads the waves
//uses a Icosahedron geometry with high enough detail that it appears sphere
function drawvLight(){
	vlight = new THREE.Mesh(
   	 	new THREE.IcosahedronGeometry(vlightRadius, vlightDetail),
   	 	new THREE.MeshBasicMaterial({
   	     	color: getNeonColor()
   		 })
   	);
	vlight.position.y = vlighty;
	vlight.position.x= vlightx;
	vlight.position.z= vlightz;
	scene.add( vlight );
}


// the main update function, called 30 times a second
//updates each line's y value to show the sound wave form
//line stays a constant length, just shifts to add each new value to the end
function WaveUpdate(visArray, waveArray, beat) {
	ticks+=30;

	for(var i=0; i<waveArray.length;i+=100){
	for(var l=0;l<lines.length;l++){
		var curLine = lines[l];
		var randSwitch = Math.random() * (5 - 0) + 0;
		var randLine =  Math.random() * (l - 0) + 0;
		if(randLine%1==0){
					lines[l]=lines[randLine];
					lines[randLine]=curLine;
		}
		curLine.geometry.vertices.shift();
		curLine.geometry.vertices.push(new THREE.Vector3(700+ticks, waveArray[i]*10, 200-l*30));
		curLine.geometry.verticesNeedUpdate=true;
		
		  vlight.position.set(750+ticks, waveArray[i]*10, 200-lines.length/2*30 );

		
		}
	}
	//camera.position.x=camera.position.x+27;
    camera.position.x=100+ticks;
   //scene.remove(light);
	//scene.add(light);

	if(beat){
		var options = 5;
		var rand = Math.random() * (5 - 0) + 0;
		var rot = Math.random() * (.2 +.2) - .2;
		//if(rand<1)

		//rotate camera
		
	/*	var delta = 2;
	camera.position.y += delta;
	if (camera.position.y > 1500) {
		camera.position.z = 1500;

	}
	if (camera.position.z < -1500) {
		camera.position.z = -1500;

	}*/


	//camera.position.y = Math.sqrt((800 * 800) - (camera.position.z * camera.position.z));
	//var upVector = new THREE.Vector3();
	//upVector.copy(camera.position);
	//upVector.cross(yUpTorus).normalize();
	
	//camera.up = upVector;
	//camera.lookAt(200+ticks, 1200, 200);		// WHY DOESN'T THIS WORK EITHER??????


		
		//end

	}
//renderer.render( scene, camera );
composer.render(.1);

}

//creates the line objects and adds them to the scene when the scene is intiailized
function drawWaves(){
	var  lineColor;

     for(var n=0; n<numLines;n++){
          var geometry = new THREE.Geometry();
          geometry.dynamic=true;
          
          	
			var color = getNeonColor();
			var material = new THREE.LineBasicMaterial({
			  color: color,
			  ambient: color,  
			  linewidth: 3,			  
		});

     for(var i=0;i<lineLength;i++){	
	 		geometry.vertices.push(new THREE.Vector3(-1000+i, 600, 500-100*n));
	 	}
	 	 line = new THREE.Line(geometry, material);
	     scene.add(line);
		 lines.push(line);
	 }
	 
	
}

//specifies the init and draw functions for the waves mode
function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = wavesComposer;
	setupControlPanelWaves();
	initSound();
}

function setupControlPanelWaves() {
	document.getElementById("controlPanelHeader").innerHTML="Waves";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands: none";
}


//This function applies several THREE.JS shaders to apply the 
//illuminated effect to the waves 
function wavesComposer(){
	composer = new THREE.EffectComposer( renderer );
	
	//causes the scene to be rendered by the composer
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	//bloom pass creates the glowing look
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
}

