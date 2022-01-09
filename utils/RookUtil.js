function RookUtil(){
    this.getTargetCells = function(s,d){
        let steps = [[0,1],[0,-1],[-1,0],[1,0]]
        let color = board[s[0]][s[1]].color;
        return boardUtil.getTargetCells(s, d, steps, color);
    }
}