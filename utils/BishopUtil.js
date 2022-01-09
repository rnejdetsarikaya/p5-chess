function BishopUtil(){
    this.getTargetCells = function(s,d){
        let steps = [[1,1],[1,-1],[-1,1],[-1,-1]]
        let color = board[s[0]][s[1]].color;
        return boardUtil.getTargetCells(s, d, steps, color);
    }
}