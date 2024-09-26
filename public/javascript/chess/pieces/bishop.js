var Bishop = function(config){
    this.type = 'bishop';
    this.constructor(config);
};


Bishop.prototype = new Piece({});


Bishop.prototype.isValidPosition = function(targetPosition,board){
    let currentCol = this.position[0];
    let currentRow = parseInt(this.position[1]);

    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let rowDiff = Math.abs(currentRow - targetRow);
    let colDiff = Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0));


    if (rowDiff === colDiff && (targetCol>='A' && targetCol<='H') && (targetRow>='1' && targetRow<='8') && this.isPathClear(targetPosition, board)) {
        return true;
    } 

    console.warn("Invalid move for bishop");
    return false;

};

Bishop.prototype.isPathClear = function(targetPosition, board) {
    let currentCol = this.position[0].charCodeAt(0);
    let currentRow = parseInt(this.position[1]);

    let targetCol = targetPosition.col.charCodeAt(0);
    let targetRow = parseInt(targetPosition.row);

    let colStep = (targetCol > currentCol) ? 1 : -1;
    let rowStep = (targetRow > currentRow) ? 1 : -1;

    let col = currentCol + colStep;
    let row = currentRow + rowStep;

    while (col !== targetCol && row !== targetRow) {
        if (board.getPieceAt({col: String.fromCharCode(col), row: row})) {
            return false;
        }
        col += colStep;
        row += rowStep;
    }

    return true;
};

Bishop.prototype.moveTo = function(targetPosition, board){    
    if(this.isValidPosition(targetPosition, board)){
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true
    }else{
        if(board.turn==="white"){
            board.turn="black";
        }else{
            board.turn="white";
        }
        return false
    }
}