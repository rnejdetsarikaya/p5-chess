function PawnUtil(){

    this.boardUtil = new BoardUtil();
    
    this.checkFirstStepForPawn = function(s,d,stepValue){
        let destinationX = d[0];
        let sourceX = s[0];
        let sourceY = s[1];
        let otherPawn;
        if((sourceX == 6 || sourceX == 1) && Math.abs(destinationX-sourceX) == Math.abs(stepValue*2)){
            otherPawn = this.getPawnSameVertical(d,s);
            if(otherPawn)
                board[sourceX][sourceY].moveInfo = "2x";//first move 2 step,en passant
            return true;
        }
        return false;
    }

    this.getPawnSameVertical = function(s,d){
        let sourceX = s[0];
        let sourceY = s[1];
        let sourceColor
        if(d){
            sourceColor = board[d[0]][d[1]].color;
        }else{
            sourceColor = board[sourceX][sourceY].color;
        }
        let otherPawnColor = sourceColor == "w" ? "b":"w";
        if(sourceY-1 >= 0){
            otherPiece = board[sourceX][sourceY-1];
            console.log(otherPiece)
            if(otherPiece.type.toLowerCase() == pieces.PAWN && otherPiece.color==otherPawnColor){
                return otherPiece;
            }
        }
        if(sourceY+1 <= 7){
            otherPiece = board[sourceX][sourceY+1];
            if(otherPiece.type.toLowerCase() == pieces.PAWN && otherPiece.color==otherPawnColor){
                return otherPiece;
            }
        }
        return null;
    }

    this.checkEnPassant = function(s){
        let sourceX = s[0];
        let sourceY = s[1];
        let flag = (sourceX+sourceY)%2 != 0;
        let color = board[sourceX][sourceY].color;
        let otherPiece;
        
        otherPiece = this.getPawnSameVertical(s,null);
        if(!otherPiece)
            return;
        if(sourceY-1 >= 0 && board[sourceX][sourceY-1].moveInfo){
            board[sourceX][sourceY-1] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
            boardNotation = boardUtil.replaceAt(boardNotation,(sourceX)*8+sourceY-1,"_");
            return;
        }
        if(sourceY+1 <= 7 && board[sourceX][sourceY+1].moveInfo){
            board[sourceX][sourceY+1] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
            boardNotation = boardUtil.replaceAt(boardNotation,(sourceX)*8+sourceY+1,"_");
        }
    }   
    
    this.getTargetCells = function(s,d){
        let targets = [];
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];

        let color = board[sourceX][sourceY].color;
        let stepValue =  color == "w" ? 1:-1;
        let x = destinationX+stepValue;
        if(destinationY+1 <= 7 && (board[x][destinationY+1].type == pieces.EMPTY || board[x][destinationY+1].color != color))
            targets.push([x,destinationY+1])
        if(destinationY-1 >= 0 && (board[x][destinationY-1].type == pieces.EMPTY || board[x][destinationY-1].color != color))
            targets.push([x,destinationY-1])
        console.log(targets)
        return targets;
    }
}