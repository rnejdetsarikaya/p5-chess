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

    this.checkDanger = function(color, targets, pieceList) {
        for(var i=0;i<targets.length;i++){
            let cell = board[targets[i][0]][targets[i][1]];
            console.log("cell",cell)
            if(pieceList.includes(cell.type.toLowerCase()) && cell.color != color){
                return true;//king location
            }
        }
        return false;
    }
}