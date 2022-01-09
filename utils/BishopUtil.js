function BishopUtil(){
    this.getTargetCells = function(s,d, color){
        let steps = [[1,1],[1,-1],[-1,1],[-1,-1]]
        return boardUtil.getTargetCells(s, d, steps, color);
    }
}