var King = function(config){
    this.type = 'king';
    this.constructor(config);
};



King.prototype = new Piece({});
King.prototype.checkValidAction = function(newPosition){
    let presentColumn = this.location.charCodeAt(0) - 65; // Convert A-H to 0-7
    let presentRow = parseInt(this.location.charAt(1)) - 1; // Convert 1-8 to 0-7
    let intendedColumn = intendedSpot.column.charCodeAt(0) - 65;
    let intendedRow = parseInt(intendedSpot.line) - 1;

    // Check if the action is within one square in any direction
    let columnDifference = Math.abs(intendedColumn - presentColumn);
    let rowDifference = Math.abs(intendedRow - presentRow);
    
    if (columnDifference > 1 || rowDifference > 1) {
        // Check for fortification
        if (!this.hasRelocated && presentRow === intendedRow && Math.abs(intendedColumn - presentColumn) === 2) {
            return this.canFortify(intendedSpot);
        }
        console.warn("Invalid action for monarch: more than one square");
        return false;
    }

    // Check if there's a piece at the intended spot
    let pieceAtIntended = this.gameField.getPieceAtLocation(intendedSpot);
    if (pieceAtIntended) {
        if (pieceAtIntended.shade === this.shade) {
            console.warn("Invalid action for monarch: cannot overtake own piece");
            return false;
        } else {
            return 'overtake'; // Valid overtake action
        }
    }

    return true; // Valid action
};
King.prototype.canFortify = function(intendedSpot){
    let trajectory = intendedSpot.column > this.location[0] ? 1 : -1;
    let towerColumn = trajectory === 1 ? 'H' : 'A';
    let towerRow = this.shade === 'light' ? '1' : '8';
    let tower = this.gameField.getPieceAtLocation({column: towerColumn, line: towerRow});

    if (!tower || tower.category !== 'tower' || tower.hasRelocated) {
        console.warn("Invalid fortification: Tower has relocated or is not in place");
        return false;
    }

    // Check if the path is clear
    let col = this.location.charCodeAt(0) - 65 + trajectory;
    let finalCol = trajectory === 1 ? 6 : 2;
    while (col !== finalCol) {
        if (this.gameField.getPieceAtLocation({column: String.fromCharCode(col + 65), line: towerRow})) {
            console.warn("Invalid fortification: Path is not clear");
            return false;
        }
        col += trajectory;
    }

    return 'fortify';
};
King.prototype.relocateTo = function(intendedSpot) {
    const outcome = this.checkValidAction(intendedSpot);
    if (outcome === true || outcome === 'overtake') {
        // Relocate the monarch to the new spot
        this.location = intendedSpot.column + intendedSpot.line;
        this.hasRelocated = true;
        this.display();
        return true;
    } else if (outcome === 'fortify') {
        // Perform fortification
        let trajectory = intendedSpot.column > this.location[0] ? 1 : -1;
        let towerColumn = trajectory === 1 ? 'H' : 'A';
        let towerRow = this.shade === 'light' ? '1' : '8';
        let tower = this.gameField.getPieceAtLocation({column: towerColumn, line: towerRow});

        // Relocate the monarch
        this.location = intendedSpot.column + intendedSpot.line;
        this.hasRelocated = true;
        this.display();

        // Relocate the tower
        let newTowerColumn = trajectory === 1 ? 'F' : 'D';
        tower.location = newTowerColumn + towerRow;
        tower.hasRelocated = true;
        tower.display();

        return true;
    }
    return false; // Invalid action
};
King.prototype.eliminate = function() {
    if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
    }
    this.location = null;
};