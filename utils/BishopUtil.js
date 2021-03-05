function BishopUtil(){
    this.getTargetCells = function(s,d){
        let targets = [];
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];

        let color = board[sourceX][sourceY].color;
        let steps = [[1,1],[1,-1],[-1,1],[-1,-1]]
        let x;
        let y;
        for(var i=0;i<steps.length;i++){
            for(var j=1;j<8;j++){
                x = destinationX + steps[i][0]*j;
                y = destinationY + steps[i][1]*j;
                if(x < 0 || x > 7 || y < 0 || y > 7)
                continue;
                if(board[x][y].type != pieces.EMPTY && !(x == sourceX && y == sourceY)){
                    console.log("x,y:"+x,y);
                    if(board[x][y].color != color)
                        targets.push([x,y]);
                    break;
                }
                targets.push([x,y]);
            }
        }
        return targets;
    }
}