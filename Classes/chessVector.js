class ChessVector {
    static ERROR = {
        NOTVECTOR: new Error("The input must be a valid ChessVector instance.")
    };

    constructor(r, c, parent=null) {
        this.r = r;
        this.c = c;
        this.size = (parent) ? parent.cellSize : 0;
    }

    /**
     * Checks if both vectors have the same row and col values.
     * @returns Result result
     */
     sameCoordinates(v) {
        if (!(v instanceof ChessVector)) {
            throw ChessVector.ERROR.NOTVECTOR;
        }
        return this.r == v.r && this.c == v.c;
    }
    
    /**
     * Check if both vectors are equal.
     * @param {obj} v1 Vector from ChessPiece.getMoves()
     * @param {obj} v2 Vector from ChessPiece.getMoves()
     * @returns Whenever both vectors have the same values stored in them.
     */
    equal(v) {
        return this.sameCoordinates() && this.size == v.size;
    }

    /**
     * Chechs it the selected indexes are inside the board
     * @param {object} position chessBoard.createVector object
     * @returns Result of the analysis
     */
    checkVector() {
        return Number.isInteger(this.r) && Number.isInteger(this.c) &&
            this.r >= 0 && this.r < 8 && 
            this.c >= 0 && this.c < 8;
    }
}