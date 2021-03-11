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

        this.isBlank(destinationX,destinationY) ? move_sound.play():eat_sound.play();

        let temp = board[sourceX][sourceY];
        let flag = (sourceX+sourceY)%2 == 0;
        board[sourceX][sourceY] = {"image":flag ? b_img:w_img,"type":pieces.EMPTY,"color":flag ? "b":"w"}
        board[destinationX][destinationY] = temp;
        boardNotation = this.replaceAt(boardNotation,sourceX*8+sourceY,"_");
        boardNotation = this.replaceAt(boardNotation,destinationX*8+destinationY,temp.type);
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
        let step;
        let crossStep;
        switch(sourceType.toLowerCase()){
            case pieces.PAWN:
                let stepValue =  sourceColor == "w" ? 1:-1;
                if(sourceY == destinationY && destinationX-sourceX == stepValue){
                    pawnUtil.checkEnPassant(s);
                    board[sourceX][sourceY].moveInfo = null;
                }
                if((sourceY == destinationY && (destinationX-sourceX == stepValue || pawnUtil.checkFirstStepForPawn(s,d,stepValue)) && destinationType == pieces.EMPTY) ||
                        (this.checkCrossMove(s,d) > 0 && destinationType != pieces.EMPTY)){
                            kingLocation = this.check(board[sourceX][sourceY].color,pawnUtil.getTargetCells(s,d));
                            return true;
                        }
                break;

            case pieces.BISHOP:
                crossStep = Math.abs(this.checkCrossMove(s,d));
                if(crossStep > 0  && this.checkPiecesOnCrossDiagonal(s,d,crossStep) && this.checkTypeAndColor(destinationType,destinationColor,sourceColor)){
                    kingLocation = this.check(board[sourceX][sourceY].color,bishopUtil.getTargetCells(s,d));
                    return true;
                }
                break;

            case pieces.ROOK:
                step = this.checkVerticalAndHorizantalMove(s,d);
                if(step > 0 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s,d,step) && this.checkTypeAndColor(destinationType,destinationColor,sourceColor)){
                    console.log(rookUtil.getTargetCells(s,d));
                    return true;
                }
                break;

            case pieces.QUEEN:
                step = this.checkVerticalAndHorizantalMove(s,d);
                crossStep = this.checkCrossMove(s,d);
                if(((crossStep > 0  && this.checkPiecesOnCrossDiagonal(s,d,crossStep)) || (step > 0 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s,d,step))) && this.checkTypeAndColor(destinationType,destinationColor,sourceColor))
                    return true;
                break;

            case pieces.KNIGHT:
                let x = Math.abs(sourceX-destinationX);
                let y = Math.abs(sourceY-destinationY);
                if(((x==1 && y==2) || (x==2 && y==1)) && this.checkTypeAndColor(destinationType,destinationColor,sourceColor)){
                    kingLocation = this.check(board[sourceX][sourceY].color,knightUtil.getTargetCells(s,d));
                    return true;
                }
                break;

            case pieces.KING:
                step = this.checkVerticalAndHorizantalMove(s,d);
                crossStep = this.checkCrossMove(s,d);
                if(((crossStep == 1  && this.checkPiecesOnCrossDiagonal(s,d,crossStep)) || (step == 1 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s,d,step))) && this.checkTypeAndColor(destinationType,destinationColor,sourceColor) && kingUtil.checkOtherKingOnAround(s,d)){
                    kingLocation = null; //not check anymore
                    return true;
                }
                break;
            default:
                destination = null;
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

    this.checkPiecesOnCrossDiagonal = function(s,d,step){
        let sourceX = s[0];
        let sourceY = s[1];
        let stepX = d[0] - sourceX > 0 ? 1:-1;
        let stepY = d[1] - sourceY > 0 ? 1:-1;
        for(var i=0;i<step-1;i++){
            if(board[sourceX += stepX][sourceY += stepY].type != pieces.EMPTY)
                return false;
        }
        return true;
    }

    this.checkVerticalAndHorizantalMove = function(s,d){
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        if(sourceX != destinationX && sourceY != destinationY)
            return 0;
        return parseInt(sourceX==destinationX ? Math.abs(destinationY-sourceY):Math.abs(destinationX-sourceX));
    }

    this.checkPiecesOnVerticalAndHorizantalDiagonal = function(s,d,step){
        let sourceX = s[0];
        let sourceY = s[1];
        let stepX = this.getStepValue(sourceX, d[0]);
        let stepY = this.getStepValue(sourceY, d[1]);
        for(var i=0;i<step-1;i++){
            if(board[sourceX += stepX][sourceY += stepY].type != pieces.EMPTY)
                return false;
        }
        return true;
    }

    this.check = function(color,targets){
        console.log(color,targets)
        for(var i=0;i<targets.length;i++){
            let cell = board[targets[i][0]][targets[i][1]];
            if(cell.type.toLowerCase() == pieces.KING && cell.color != color)
                return targets[i];//king location
        }
        return null;
    }

    this.getStepValue = function(s,d){
        if(d - s > 0)
            return 1;
        else if(d - s < 0)
            return -1;
        else
            return 0;
    }

    this.checkTypeAndColor = function(destinationType,destinationColor,sourceColor){
        return destinationType == pieces.EMPTY || destinationColor != sourceColor;
    }
}