function KingUtil(){
    this.checkOtherKingOnAround = function(s,d){
        let destinationX = d[0];
        let destinationY = d[1];
        let sourceX = s[0];
        let sourceY = s[1];
        let color = board[s[0]][s[1]].color == colors.WHITE ? colors.BLACK:colors.WHITE;
        let sourceType = board[sourceX][sourceY].type;
        let type = sourceType == sourceType.toUpperCase() ? sourceType.toLowerCase():sourceType.toUpperCase();
        for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
                let x = destinationX+i;
                let y = destinationY+j;
                if(x<0 || y<0 || x > 7 || y>7 || (x==destinationX && y==destinationY))
                    continue;
                if(board[x][y].type == type && board[x][y].color == color)
                    return false;
            }
        }
        return true;
    }

    this.check = function(color,targets){
        console.log(color, targets)
        for(var i=0;i<targets.length;i++){
            let cell = board[targets[i][0]][targets[i][1]];
            if(cell.type.toLowerCase() == pieces.KING && cell.color != color){
                check_sound.rate(2);
                check_sound.play();
                return targets[i];//king location
            }
        }
        return null;
    }

    this.checkDanger = function(d, color, targets, pieceList) {
        let destinationX = d[0];
        let destinationY = d[1];
        let direction = colors.WHITE == color ? 1 : -1;
        for(var i=0;i<targets.length;i++){
            for(var j=1;j<8;j++){
                let x = destinationX + targets[i][0]*j;
                let y = destinationY + targets[i][1]*j;
                if(x < 0 || x > 7 || y < 0 || y > 7){
                    continue;
                }

                let type = board[x][y].type.toLowerCase();
                if(type == pieces.EMPTY){
                    continue;
                }
                if(board[x][y].color != color  && (pieceList.includes(type) || (this.checkPawnDanger(j, type) && direction == x-destinationX))){
                    console.log(type, x,y)
                    return true;
                }
                break;
            }
        }
        return false;
    }

    this.checkPawnDanger = function(step, type) {
        if(pieces.PAWN == type && step == 1) {
            return true;
        }
        
        return false;
    }

    this.checkCastling = function(destinationY, color) {
        let x = color == colors.WHITE ? 0 : 7;
        if(destinationY == 2 && this.checkRookAvailableForCastling(x, 0)) {
            return board[x][1].type == pieces.EMPTY && board[x][3].type == pieces.EMPTY && board[x][2].type == pieces.EMPTY;
        }
        if(destinationY == 6 && this.checkRookAvailableForCastling(x, 7)) {
            return board[x][5].type == pieces.EMPTY && board[x][6].type;
        }
        return false;
    }

    this.checkRookAvailableForCastling = function(x, y) {
        return board[x][y].type.toLowerCase() == pieces.ROOK;
    }

    this.checkByPieceType = function(piece, color, s, d) {//Queen,Rook,Knight,Bishop
        switch(piece.toLowerCase()){
            case pieces.QUEEN:
                return this.check(color,queenUtil.getTargetCells(s,d, color));
            case pieces.ROOK:
                return this.check(color,rookUtil.getTargetCells(s,d, color));
            case pieces.KNIGHT:
                return this.check(color,knightUtil.getTargetCells(s,d, color));
            case pieces.BISHOP:
                return this.check(color,bishopUtil.getTargetCells(s,d, color));
            default:
                return null;
        }
    } 
}