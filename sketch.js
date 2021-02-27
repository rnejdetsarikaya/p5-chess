var w_pawn;
var b_pawn;
var w_king;
var b_king;
var board;
var w_img;
var b_img;
var w_rook;
var b_rook;
var w_knight;
var b_knight;
var w_bishop;
var b_bishop;
var w_queen;
var b_queen;
let size = 90;
var offset = 200;
var source;
var destination;
var blankSize = 10;
var move_sound;
var eat_sound;
const pieces = {
	KING:"k",
	QUEEN:"q",
	ROOK:"r",
	KNIGHT:"n",
	BISHOP:"b",
	PAWN:"p",
	EMPTY:"e"
}
var pieces_images;

const loadImages = () =>{
	w_pawn = loadImage('./images/pawn.svg');
	b_pawn = loadImage('./images/pawn2.svg');
	w_king = loadImage('./images/king.svg');
	b_king = loadImage('./images/king2.svg');
	w_rook = loadImage('./images/rook.svg');
	b_rook = loadImage('./images/rook2.svg');
	w_knight = loadImage('./images/knight.svg');
	b_knight = loadImage('./images/knight2.svg');
	w_bishop = loadImage('./images/bishop.svg');
	b_bishop = loadImage('./images/bishop2.svg');
	w_queen = loadImage('./images/queen.svg');
	b_queen = loadImage('./images/queen2.svg');
	pieces_images ={
		"r":w_rook,
		"n":w_knight,
		"b":w_bishop,
		"q":w_queen,
		"k":w_king,
		"p":w_pawn,
		"R":b_rook,
		"N":b_knight,
		"B":b_bishop,
		"Q":b_queen,
		"K":b_king,
		"P":b_pawn
	}
}
let boardNotation = "rnbqkbnrpppppppp________________________________PPPPPPPPRNBQKBNR";
//var sampleNotation = "r__qr_k_pp____Bp___pp_p____P_________Pn__P__p_P_P__nP_BPR___QRK_";
function preload(){
	loadImages()
	move_sound = loadSound('./sounds/move.wav',()=>move_sound.play())
	eat_sound = loadSound('./sounds/eat.mp3');
	w_img = createImage(blankSize,blankSize);
	b_img = createImage(blankSize,blankSize);
	w_img.loadPixels();
	b_img.loadPixels();
	for (let i = 0; i < w_img.width; i++) {
		for (let j = 0; j < w_img.height; j++) {
			w_img.set(i, j, color(255));
			b_img.set(i, j, color(150));
		}
	}
	w_img.updatePixels();
	b_img.updatePixels();
}
function setup() {
	var wh = size*8+offset;
	let cnv = createCanvas(wh,wh);
	cnv.mousePressed(findIndex);
	board = make2Darray(8,8);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j)%2==0;
			if(boardNotation[i*8+j] != "_")
				board[i][j] = {"image":pieces_images[boardNotation[i*8+j]],"type":boardNotation[i*8+j],"color":i==0||i==1 ? "w":"b"};
			else
				board[i][j] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
		}
	}
	console.log(board)
}

function draw() {
	background(second()*8,0,0)
	w_pawn.resize(50, 50);
	b_pawn.resize(50, 50);
	w_king.resize(50, 50);
	b_king.resize(50, 50);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j) % 2 == 0;
			drawCell((i*size)+offset/2,(j*size)+offset/2,flag ? 150:255);
			image(board[i][j].image,(i*size)+(offset+size)/2-25,(j*size)+(offset+size)/2-25)
			fill(255,2,0)
			text(i+","+j,(i*size)+offset/2,(j*size)+offset/2+size)
		}
	}
}

const findIndex = () =>{
	var blank_area = offset/2;
	if(mouseX<blank_area || mouseX>blank_area+8*size || mouseY<blank_area || mouseY>blank_area+8*size){
		//alert("oyun dışı")
		return;
	}
	let posX = Math.floor((mouseX-blank_area)/size)
	let posY = Math.floor((mouseY-blank_area)/size)
	if(!source && isBlank(posX,posY))
		return;
	if(!source){
		source = new Array(posX,posY);
		return;
	}
	if(!destination){
		if(source[0] == posX && source[1] == posY){//same piece again select
			source = null;
			return;
		}
	
		destination = new Array(posX,posY);
		console.log(destination);
	}
	if(checkMove(source,destination))
		move(source,destination);
	//alert(posX+","+posY,"-")
}

const make2Darray = (cols,rows) =>{
	var arr = new Array(cols);
	for(var i=0;i<cols;i++){
		arr[i] = new Array(rows);
	}
	return arr;
}

const drawCell = (x,y,color) =>{
	if(source && x==source[0]*size+offset/2 && y==source[1]*size+offset/2)
		fill(0,200,50)
	else
		fill(color)
	rect(x,y,size,size);
}

const move = (s,d) =>{
	if(!s)
		return;
	sourceX = s[0];
	sourceY = s[1];
	destinationX = d[0];
	destinationY = d[1];
	console.log("move!!")
	if(!isBlank(destinationX,destinationY))
		eat_sound.play()
	else
		move_sound.play()
	
	let temp = board[sourceX][sourceY];
	let flag = (sourceX+sourceY)%2 == 0;
	board[sourceX][sourceY] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
	board[destinationX][destinationY] = temp;
	boardNotation = replaceAt(boardNotation,sourceX*8+sourceY,"_");
	boardNotation = replaceAt(boardNotation,destinationX*8+destinationY,temp.type);
	source = null;
	destination = null;
	console.log(board)
}

const checkMove = (s,d) =>{
	let sourceX = s[0];
	let sourceY = s[1];
	let destinationX = d[0];
	let destinationY = d[1];
	let destinationType = board[destinationX][destinationY].type;
	let sourceType = board[sourceX][sourceY].type;
	let color = board[sourceX][sourceY].color;
	console.log("aaaa");
	switch(sourceType.toLowerCase()){
		case pieces.PAWN:
			console.log("source: "+source);
			console.log("dest: "+destination);
			let stepValue =  color == "w" ? 1:-1;
			console.log(checkFirstStepForPawn(destinationX,sourceX,stepValue))
			console.log(checkCrossMove(s,d))
			if((sourceY == destinationY && (destinationX-sourceX == stepValue || checkFirstStepForPawn(destinationX,sourceX,stepValue)) && destinationType == pieces.EMPTY) ||
					(checkCrossMove(s,d) > 0 && destinationType != pieces.EMPTY))
				return true;
			break;
		default:
			return true;
	}
	destination = null;
	return false;
}

const checkFirstStepForPawn = (destinationX,sourceX,stepValue)=>{
	if((sourceX == 6 || sourceX == 1) && Math.abs(destinationX-sourceX) == Math.abs(stepValue*2))
		return true;
	return false;
}

const checkCrossMove = (s,d) =>{
	let sourceX = s[0];
	let sourceY = s[1];
	let destinationX = d[0];
	let destinationY = d[1];
	let color = board[sourceX][sourceY].color;
	if(destinationX==sourceX || destinationY==sourceY)
		return 0;
	if(Math.abs(destinationX-sourceX) != Math.abs(destinationY-sourceY) || Math.abs(sourceX-destinationX)!=Math.abs(sourceY-destinationY))
		return 0;
	else
		return parseInt(color == "w" ? destinationX-sourceX:sourceX-destinationX);
}

const isBlank = (x,y) =>{
	return board[x][y].image.height == blankSize;
}

const replaceAt = (str,index, replacement) =>{
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}
