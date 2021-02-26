var w_pawn;
var b_pawn;
var w_king;
var b_king;
var board;
var w_img;
var b_img;
let size = 90;
var offset = 200;
function preload(){
	w_pawn = loadImage('./images/pawn.png');
	b_pawn = loadImage('./images/pawn2.png');
	w_king = loadImage('./images/king.png');
	b_king = loadImage('./images/king2.png');
	w_img = createImage(10,10);
	b_img = createImage(10,10);
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
			if(j==1 || j==6)
				board[i][j] = j==1 ? w_pawn:b_pawn;
			else if(j==0 || j==7)
				board[i][j] = j==0 ? w_king:b_king;
			else
				board[i][j] = flag ? b_img:w_img;
		}
	}
	console.log(board)
}

function draw() {
	background(100,75,124)
	w_pawn.resize(50, 50);
	b_pawn.resize(50, 50);
	w_king.resize(50, 50);
	b_king.resize(50, 50);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j) % 2 == 0;
			makeCell((i*size)+offset/2,(j*size)+offset/2,flag ? 150:255);
			image(board[i][j],(i*size)+(offset+size)/2-25,(j*size)+(offset+size)/2-25)
		}
	}
}

const findIndex = () =>{
	var blank_area = offset/2;
	if(mouseX<blank_area || mouseX>blank_area+8*size || mouseY<blank_area || mouseY>blank_area+8*size){
		//alert("oyun dışı")
		return;
	}
	let posX = Math.floor((mouseX-blank_area)/size+1)
	let posY = Math.floor((mouseY-blank_area)/size+1)
	console.log(board[posX-1][posY-1].height != 10)
	//alert(posX+","+posY,"-")
}

const make2Darray = (cols,rows) =>{
	var arr = new Array(cols);
	for(var i=0;i<cols;i++){
		arr[i] = new Array(rows);
	}
	return arr;
}

const makeCell = (x,y,color) =>{
	fill(color)
	return rect(x,y,size,size);
}
