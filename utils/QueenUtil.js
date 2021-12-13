function QueenUtil(){
    this.getTargetCells = function(s,d){
        let steps = [[0,1],[0,-1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]]
        return boardUtil.getTargetCells(s,d,steps);
    }
}