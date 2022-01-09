var boardDarkColor;
var boardLightColor;
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
let size = 60;
var offset = 200;
var source;
var destination;
var blankSize = 10;
var move_sound;
var eat_sound;
var check_sound;
let pawnUtil;
let boardUtil;
let kingUtil;
let knightUtil;
let bishopUtil;
let rookUtil;
let queenUtil;
let moveCount = 0;
var changedPieceForPawn = false;
let kingLocation = null;
const pieces = {
	KING:"k",
	QUEEN:"q",
	ROOK:"r",
	KNIGHT:"n",
	BISHOP:"b",
	PAWN:"p",
	EMPTY:"e"
}

const colors = {
	WHITE:"w",
	BLACK:"b"
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
//let boardNotation = "rnbqkbnrpppppppp"+"_".repeat(32)+"PPPPPPPPRNBQKBNR";
let boardNotation = "r______rppP_k_Bp___pp_p__________P__q_Pn_____p_P_P__nP_BPR___QRK_";
//let boardNotation = "r_q_r_k_pp__K_Bp___pp_p____P__________Pn__P__p_P_P__nP_BPR___QR__";
function preload(){
	loadImages()
	move_sound = loadSound('./sounds/move.wav',()=>move_sound.play())
	eat_sound = loadSound('./sounds/eat.mp3');
	check_sound = loadSound('./sounds/check.mp3');
	w_img = createImage(blankSize,blankSize);
	b_img = createImage(blankSize,blankSize);
	w_img.loadPixels();
	b_img.loadPixels();
	for (let i = 0; i < w_img.width; i++) {
		for (let j = 0; j < w_img.height; j++) {
			w_img.set(i, j, boardLightColor);
			b_img.set(i, j, boardDarkColor);
		}
	}
	w_img.updatePixels();
	b_img.updatePixels();
}
function setup() {
	pawnUtil = new PawnUtil();
	boardUtil = new BoardUtil();
	kingUtil = new KingUtil();
	knightUtil = new KnightUtil();
	bishopUtil = new BishopUtil();
	rookUtil = new RookUtil();
	queenUtil = new QueenUtil();
	var wh = size*8+offset;
	let cnv = createCanvas(wh,wh);
	cnv.mousePressed(findIndex);
	board = boardUtil.make2Darray(8,8);
	boardDarkColor = color(0,255,0);
	boardLightColor = color(255,255,255);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j)%2==0;
			let notation = boardNotation[i*8+j]
			if(notation != "_")
				board[i][j] = {"image":pieces_images[notation],"type":notation,"color":notation == notation.toLowerCase() ? colors.WHITE:colors.BLACK,"moveInfo":null};
			else
				board[i][j] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? colors.BLACK:colors.WHITE}
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
			drawCell((i*size)+offset/2,(j*size)+offset/2,flag ? boardDarkColor:boardLightColor);
			image(board[i][j].image,(i*size)+(offset+size)/2-25,(j*size)+(offset+size)/2-25)
			fill(255,2,0)
			text(i+","+j,(i*size)+offset/2,(j*size)+offset/2+size)
		}
	}
	textSize(50)
	fill(255)
	text(moveCount%2==0 ? "Hamle Beyazın":"Hamle Siyahın",0,50)
	{kingLocation && text("Check!!",750,50)}
	textSize(15)
	if(changedPieceForPawn){
		let color = board[changedPieceForPawn[0]][changedPieceForPawn[1]].color;
		var changedPieceType = prompt("Please enter your piece type:", "Queen,Rook,Knight,Bishop").substring(0,1);
		changedPieceType = changedPieceType == "K" ? "N":changedPieceType;//k is king not knight(n)
		changedPieceType = color == colors.WHITE ? changedPieceType.toLowerCase():changedPieceType.toUpperCase();
		
		if(pieces_images[changedPieceType]){
			let pX = changedPieceForPawn[0];
			let pY = changedPieceForPawn[1];
			let d = new Array(pX,pY);
			let s = new Array(pX + (color == colors.WHITE ? -1 : 1),pY);
			kingLocation = kingUtil.checkByPieceType(changedPieceType, color, s, d);
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
		let moveFlag = color == colors.WHITE ? 0:1;
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
		let notation = String.fromCharCode(97+destination[1])+(destination[0]+1);
		let pieceType = board[source[0]][source[1]].type;
		let eatFlag = board[destination[0]][destination[1]].type.toLowerCase() == pieces.EMPTY;
		notation = eatFlag ? notation:((pieceType.toLowerCase()==pieces.PAWN ? String.fromCharCode(97+source[1]):"")+"x"+notation);
		console.log(pieceType.toLowerCase()==pieces.PAWN ? notation:pieceType.toUpperCase()+notation);//notation for moves
		boardUtil.move(source,destination);
		moveCount++;
	}
}

const drawCell = (x,y,color) =>{
	if(source && x==source[0]*size+offset/2 && y==source[1]*size+offset/2)
		fill(0,200,50) //selection
	else if(kingLocation && x==kingLocation[0]*size+offset/2 && y==kingLocation[1]*size+offset/2){
		fill(250,150,100) //check
	}
	else
		fill(color) //default
	rect(x,y,size,size);
}