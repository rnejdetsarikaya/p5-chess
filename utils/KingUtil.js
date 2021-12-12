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
}