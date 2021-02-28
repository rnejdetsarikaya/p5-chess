function BoardUtil(){
    
    this.make2Darray = function(cols,rows){
        var arr = new Array(cols);
        for(var i=0;i<cols;i++){
            arr[i] = new Array(rows);
        }
        return arr;
    }

    this.isBlank = function(x,y){
        return board[x][y].image.height == blankSize;
    }
    
    this.replaceAt = function(str,index, replacement){
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    this.move = function(s,d){
        if(!s)
            return;
        sourceX = s[0];
        sourceY = s[1];
        destinationX = d[0];
        destinationY = d[1];
        if(!boardUtil.isBlank(destinationX,destinationY))
            eat_sound.play()
        else
            move_sound.play()
        
        let temp = board[sourceX][sourceY];
        let flag = (sourceX+sourceY)%2 == 0;
        board[sourceX][sourceY] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
        board[destinationX][destinationY] = temp;
        boardNotation = boardUtil.replaceAt(boardNotation,sourceX*8+sourceY,"_");
        boardNotation = boardUtil.replaceAt(boardNotation,destinationX*8+destinationY,temp.type);
        source = null;
        destination = null;
        console.log(boardNotation)
    }

    this.checkMove = function(s,d){
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        let destinationType = board[destinationX][destinationY].type;
        let destinationColor = board[destinationX][destinationY].color;
        let sourceType = board[sourceX][sourceY].type;
        let sourceColor = board[sourceX][sourceY].color;
        switch(sourceType.toLowerCase()){
            case pieces.PAWN:
                let stepValue =  sourceColor == "w" ? 1:-1;
                if(sourceY == destinationY && destinationX-sourceX == stepValue){
                    pawnUtil.checkEnPassant(s);
                    board[sourceX][sourceY].moveInfo = null;
                }
                if((sourceY == destinationY && (destinationX-sourceX == stepValue || pawnUtil.checkFirstStepForPawn(s,d,stepValue)) && destinationType == pieces.EMPTY) ||
                        (this.checkCrossMove(s,d) > 0 && destinationType != pieces.EMPTY))
                    return true;
                break;
            case pieces.BISHOP:
                let croosStep = Math.abs(this.checkCrossMove(s,d));
                console.log(sourceColor,destinationColor)
                if(croosStep > 0  && this.checkPiecesOnCrossDiagonal(s,d,croosStep) && (destinationType == pieces.EMPTY || destinationColor != sourceColor))
                    return true;
                break;
            default:
                return false;
        }
        destination = null;
        return false;
    }
    
    this.checkCrossMove = function(s,d){
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

    this.checkPiecesOnCrossDiagonal = function(s,d,croosStep){
        let sourceX = s[0];
        let sourceY = s[1];
        let croosX = d[0] - sourceX > 0 ? 1:-1;
        let crossY = d[1] - sourceY > 0 ? 1:-1;
        for(var i=0;i<croosStep-1;i++){
            console.log(sourceX+croosX+i,sourceY+crossY+i)
            if(board[sourceX+croosX][sourceY+crossY].type != pieces.EMPTY)
                return false;
        }
        return true;
    }
}