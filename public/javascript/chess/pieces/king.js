var King = function(config){
    this.type = 'king';
    Piece.call(this, config);
    this.hasMoved = false;
};

King.prototype = Object.create(Piece.prototype);
King.prototype.constructor = King;

King.prototype.isValidMove = function(targetPosition, board){
    let currentCol = this.position[0].charCodeAt(0) - 65; // Convert A-H to 0-7
    let currentRow = parseInt(this.position[1]) - 1; // Convert 1-8 to 0-7
    let targetCol = targetPosition.col.charCodeAt(0) - 65;
    let targetRow = parseInt(targetPosition.row) - 1;

    // Check if the move is within one square in any direction
    let colDiff = Math.abs(targetCol - currentCol);
    let rowDiff = Math.abs(targetRow - currentRow);
    
    if (colDiff <= 1 && rowDiff <= 1) {
        return this.checkCapture(targetPosition, board);
    }

    // Check for castling
    if (!this.hasMoved && currentRow === targetRow && Math.abs(targetCol - currentCol) === 2) {
        return this.canCastle(targetPosition, board);
    }

    console.warn("Invalid move for king");
            return false;
};
King.prototype.checkCapture = function(targetPosition, board) {
    let pieceAtTarget = board.getPieceAt(targetPosition);
    if (pieceAtTarget) {
        if (pieceAtTarget.color === this.color) {
            console.warn("Invalid move for king: cannot capture own piece");
        return false;
        } else {
            return 'capture';
    }
    }
        return true;
};
King.prototype.canCastle = function(targetPosition, board){
    let direction = targetPosition.col > this.position[0] ? 1 : -1;
    let rookCol = direction === 1 ? 'H' : 'A';
    let rookRow = this.color === 'white' ? '1' : '8';
    let rook = board.getPieceAt({col: rookCol, row: rookRow});

    if (!rook || rook.type !== 'rook' || rook.hasMoved) {
        console.warn("Invalid castling: Rook has moved or is not in place");
        return false;
    }

    // Check if the path is clear
    let col = this.position.charCodeAt(0) - 65 + direction;
    let endCol = direction === 1 ? 6 : 2;
    while (col !== endCol) {
        if (board.getPieceAt({col: String.fromCharCode(col + 65), row: rookRow})) {
            console.warn("Invalid castling: Path is not clear");
            return false;
        }
        col += direction;
    }

    return 'castle';
};

King.prototype.moveTo = function(targetPosition, board) {
    const result = this.isValidMove(targetPosition, board);
    if (result === true || result === 'capture') {
        if (result === 'capture') {
            let pieceToCapture = board.getPieceAt(targetPosition);
            if (pieceToCapture) {
                pieceToCapture.kill();
            }
        }
        this.position = targetPosition.col + targetPosition.row;
        this.hasMoved = true;
        this.render();
        return true;
    } else if (result === 'castle') {
        let direction = targetPosition.col > this.position[0] ? 1 : -1;
        let rookCol = direction === 1 ? 'H' : 'A';
        let rookRow = this.color === 'white' ? '1' : '8';
        let rook = board.getPieceAt({col: rookCol, row: rookRow});

        // Move the king
        this.position = targetPosition.col + targetPosition.row;
        this.hasMoved = true;
        this.render();

        // Move the rook
        let newRookCol = direction === 1 ? 'F' : 'D';
        rook.position = newRookCol + rookRow;
        rook.hasMoved = true;
        rook.render();

        return true;
    }
    return false;
};

King.prototype.kill = function() {
    if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
    }
    this.position = null;
};