p5.disableFriendlyErrors = true;

let worldCanvas;

let fr = 0, averageFramerate = 0;

let gravity;
let origin, left, right, up, down, front, back;

let pointerLocked;

let player;

let loggedIn = false;
let tabFocused = true;

let font, openSans, noobFont;
function preload(){
  	font = loadFont('assets/font.ttf');
  	openSans = loadFont('assets/OpenSans.ttf');
	noobFont = loadFont("assets/noobFont.ttf");
}

function setup(){
	worldCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
	worldCanvas.style("z-index", "-1");

	frameRate(60);
	networkSetup();

	origin = createVector(0, 0, 0);left = createVector(-1, 0, 0);right = createVector(1, 0, 0);up = createVector(0, -1, 0);down = createVector(0, 1, 0);front = createVector(0, 0, -1);back = createVector(0, 0, 1);
  	gravity = down.copy().mult(0.1);

  	makeLogIn();
	document.addEventListener("dragenter", () => {youtube_player.textbox_hover = true;youtube_player.textbox_tempval = youtube_player.textbox.value();});
	document.addEventListener("dragend"  , () => {youtube_player.textbox_hover = true;youtube_player.textbox_tempval = youtube_player.textbox.value();});
}

function draw(){
	if (!loggedIn)return;
	if (disconnected){makeDisconnect(); hud_pointer.remove(); remove(); return;}

	pointerLocked = document.pointerLockElement === canvas || document.mozPointerLockElement === canvas;
	fr += frameRate();if (frameCount % 50 == 0){averageFramerate = floor(fr/50);fr = 0;}
	background(0);

	player.update();

	keybindDraw();
	mapDraw();
	shatterDraw();
	enemyDraw();

	enemyTransparentDraw();
}

function mousePressed(){
	if (!loggedIn)return;

	if(mousebindPress[mouseButton])mousebindPress[mouseButton]();
}
function mouseReleased(){
	if (!loggedIn)return;

	if(mousebindRelease[mouseButton])mousebindRelease[mouseButton]();
}
function keyPressed(){
	if (!loggedIn)return;

	if(keybindPress[keyCode] && pointerLocked) keybindPress[keyCode]();
}
function keyReleased(){
	if (!loggedIn)return;

	if (keybindRelease[keyCode] && pointerLocked) keybindRelease[keyCode]();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	if (!loggedIn)return;
    player.camera.perspective(player.fov, width/height, 1, 10000);
}

window.onfocus = function(){
    tabFocused = true;
};
window.onblur = function(){
    tabFocused = false;
}