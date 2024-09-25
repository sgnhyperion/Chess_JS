var Bishop = function(config){
    this.type = 'bishop';
    this.constructor(config);
};


Bishop.prototype = new Piece({});


Bishop.prototype.isValidPosition = function(targetPosition){
    let currentCol = this.position[0];
    let currentRow = this.position[1];

    let targetCol = targetPosition[0];
    let targetRow = targetPosition[1];

    if (Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0)) === Math.abs(currentRow - targetRow) && (targetCol>='A' && targetCol<='H') && (targetRow>='1' && targetRow<='8')) {
        return true;
    } else {
        return false;
    }

};

Bishop.prototype.move = function(newPosition){
    if (this.isValidPosition(newPosition)) {
        this.position = newPosition;
    } else {
        console.error("Invalid move for bishop");
    }
};