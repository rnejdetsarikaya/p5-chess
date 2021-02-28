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
let pawnUtil;
let boardUtil;
let moveCount = 0;
var changedPieceForPawn = false;
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
	pawnUtil = new PawnUtil();
	boardUtil = new BoardUtil();
	var wh = size*8+offset;
	let cnv = createCanvas(wh,wh);
	cnv.mousePressed(findIndex);
	board = boardUtil.make2Darray(8,8);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j)%2==0;
			if(boardNotation[i*8+j] != "_")
				board[i][j] = {"image":pieces_images[boardNotation[i*8+j]],"type":boardNotation[i*8+j],"color":i==0||i==1 ? "w":"b","moveInfo":null};
			else
				board[i][j] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
		}
	}
	console.log(board)
}

function draw() {
	background(second()*8,0,0);
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
	textSize(50)
	fill(255)
	text(moveCount%2==0 ? "Hamle Beyazın":"Hamle Siyahın",0,50)
	textSize(15)
	if(changedPieceForPawn){
		let color = board[changedPieceForPawn[0]][changedPieceForPawn[1]].color;
		var changedPieceType = prompt("Please enter your piece type:", "Queen,Rook,Knight,Bishop").substring(0,1);
		changedPieceType = color == "w" ? changedPieceType.toLowerCase():changedPieceType.toUpperCase();
		if(pieces_images[changedPieceType]){
			board[changedPieceForPawn[0]][changedPieceForPawn[1]] = {"image":pieces_images[changedPieceType],"type":changedPieceType,"color":color,"moveInfo":null}
			boardNotation = boardUtil.replaceAt(boardNotation,destinationX*8+destinationY,changedPieceType);
			changedPieceForPawn = null;
		}
	}

	for(var i=0;i<8;i++){
		text(String.fromCharCode(65+i),60,offset*3/4+size*i)
		text(i+1,offset*2/3+size*i,850)
	}
}

const findIndex = () =>{
	var blank_area = offset/2;
	let color;
	if(mouseX<blank_area || mouseX>blank_area+8*size || mouseY<blank_area || mouseY>blank_area+8*size){
		//alert("oyun dışı")
		return;
	}
	let posX = Math.floor((mouseX-blank_area)/size)
	let posY = Math.floor((mouseY-blank_area)/size)
	if(!source && boardUtil.isBlank(posX,posY))
		return;
	if(!source){
		color = board[posX][posY].color;
		let moveFlag = color == "w" ? 0:1;
		if(moveCount%2 != moveFlag)//move control- white first than black
			return;
		source = new Array(posX,posY);
		return;
	}
	if(source[0] == posX && source[1] == posY){//same piece again select
		source = null;
		return;
	}
	if(!destination){
		destination = new Array(posX,posY);
	}
	if(boardUtil.checkMove(source,destination)){
		let type = board[source[0]][source[1]].type.toLowerCase();
		if((posX == 0 || posX == 7) && type == pieces.PAWN)
			changedPieceForPawn = destination;
		boardUtil.move(source,destination);
		moveCount++;
	}
}

const drawCell = (x,y,color) =>{
	if(source && x==source[0]*size+offset/2 && y==source[1]*size+offset/2)
		fill(0,200,50)
	else
		fill(color)
	rect(x,y,size,size);
}