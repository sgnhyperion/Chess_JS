
var ChessQueen = function(config, chessBoard) {
    this.pieceType = 'queen';
    this.chessBoard = chessBoard; // Keep a reference to the board
    this.initialize(config);
};

ChessQueen.prototype = new Piece({});

ChessQueen.prototype.isMoveValid = function(destination) {
    let startColumn = this.position.charCodeAt(0) - 65; // Convert A-H to 0-7
    let startRow = parseInt(this.position.charAt(1)) - 1; // Convert 1-8 to 0-7
    let endColumn = destination.col.charCodeAt(0) - 65;
    let endRow = parseInt(destination.row) - 1;

    // Validate if the move is horizontal, vertical, or diagonal
    let columnDifference = Math.abs(endColumn - startColumn);
    let rowDifference = Math.abs(endRow - startRow);
    
    if (!(columnDifference === 0 || rowDifference === 0 || columnDifference === rowDifference)) {
        console.warn("Invalid move for queen: not horizontal, vertical, or diagonal");
        return false;
    }

    // Determine the direction of movement
    let colIncrement = startColumn === endColumn ? 0 : (endColumn > startColumn ? 1 : -1);
    let rowIncrement = startRow === endRow ? 0 : (endRow > startRow ? 1 : -1);

    // Check for blocking pieces
    let col = startColumn + colIncrement;
    let row = startRow + rowIncrement;
    while (col !== endColumn || row !== endRow) {
        let blockingPiece = this.chessBoard.getPieceAt({
            col: String.fromCharCode(col + 65),
            row: (row + 1).toString()
        });
        if (blockingPiece) {
            console.warn("Invalid move for queen: piece blocking path");
            return false;
        }
        col += colIncrement;
        row += rowIncrement;
    }

    // Check if a piece is at the target position
    let targetPiece = this.chessBoard.getPieceAt(destination);
    if (targetPiece) {
        if (targetPiece.color === this.color) {
            console.warn("Invalid move for queen: cannot capture own piece");
            return false;
        } else {
            return 'capture'; // Valid capture move
        }
    }

    return true; // Move is valid
};

ChessQueen.prototype.moveToPosition = function(destination) {
    const moveResult = this.isMoveValid(destination);
    if (moveResult === true) {
        // Update queen's position
        this.position = destination.col + destination.row;
        this.render();
        return true;
    } else if (moveResult === 'capture') {
        // Capture the piece and move
        let pieceToCapture = this.chessBoard.getPieceAt(destination);
        if (pieceToCapture) {
            pieceToCapture.eliminate();
        }
        this.position = destination.col + destination.row;
        this.render();
        return true;
    }
    return false; // Move is invalid
};

ChessQueen.prototype.eliminate = function() {
    if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
    }
    this.position = null;
};
