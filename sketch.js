var w_pawn;
var b_pawn;
var w_king;
var b_king;
var board;
var w_img;
var b_img;
let size = 90;
var offset = 200;
var source;
var destination;
var blankSize = 10;
var move_sound;
var eat_sound;
function preload(){
	w_pawn = loadImage('./images/pawn.png');
	b_pawn = loadImage('./images/pawn2.png');
	w_king = loadImage('./images/king.png');
	b_king = loadImage('./images/king2.png');
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
	background(0,0,second()*8)
	w_pawn.resize(50, 50);
	b_pawn.resize(50, 50);
	w_king.resize(50, 50);
	b_king.resize(50, 50);
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			let flag = (i+j) % 2 == 0;
			drawCell((i*size)+offset/2,(j*size)+offset/2,flag ? 150:255);
			image(board[i][j],(i*size)+(offset+size)/2-25,(j*size)+(offset+size)/2-25)
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
	console.log(isBlank(posX,posY))
	if(!source && isBlank(posX,posY))
		return;
	if(!source){
		source = new Array(posX,posY);
		console.log(source);
		return;
	}
	if(!destination){
		destination = new Array(posX,posY);
		console.log(destination);
	}

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
	console.log(temp)
	let flag = (sourceX+sourceY)%2 == 0;
	board[sourceX][sourceY] = flag ? b_img:w_img;
	board[destinationX][destinationY] = temp;
	source = null;
	destination = null;
}

const isBlank = (x,y) =>{
	return board[x][y].height == blankSize;
}
