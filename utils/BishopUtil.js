function BishopUtil(){
    this.getTargetCells = function(s,d){
        let steps = [[1,1],[1,-1],[-1,1],[-1,-1]]
        return boardUtil.getTargetCells(s,d,steps);
    }
}