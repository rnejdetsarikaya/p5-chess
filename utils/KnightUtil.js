function KnightUtil(){
    this.getTargetCells = function(s,d){
        let targets = [];
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        let color = board[sourceX][sourceY].color;

        let minX = destinationX-2;
        let maxX = destinationX+2;
        let minY = destinationY-2;
        let maxY = destinationY+2;

        targets.push(s);
        for(var i =minX;i<maxX+1;i++){
            for(var j=minY;j<maxY+1;j++){
                if(i<0 || i>7 || j<0 || j>7 || i==destinationX || j == destinationY 
                    || (i+j) % 2 == (destinationX+destinationY) % 2 
                    || (board[i][j].type != pieces.EMPTY && board[i][j].color == color))
                    continue;
                targets.push([i,j]);
            }
        }   
        return targets;
    }
}
