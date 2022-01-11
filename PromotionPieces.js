class PromotionPieces {
    constructor(image, x, y, value) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.value = value;
	}

    display = function() {
        image(this.image,this.x,this.y);
    }

    move = function() {
        this.x = this.x + random(-1,1);
        this.y = this.y + random(-1,1);
    }

	click = function() {
		let distance = dist(mouseX, mouseY, this.x+20, this.y+20);
		if(distance < this.image.width / 2){
			changedPieceType = this.value;
		}
    }
}