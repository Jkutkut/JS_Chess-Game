/**
 * Class to have the logic of a full chess board
 */
class ChessBoard {
    static COLORS = [
        [213, 184, 144],
        [114, 54, 26],
        // color(255, 255, 0, 100),
        // color(255,0,0, 200),
        // color(0,0,100)
    ];

    static PIECES = {
        "bishop": Bishop,
        "king": King,
        "knight": Knight,
        "pawn": Pawn,
        "queen": Queen,
        "rook": Rook
    }

    static ERRORS = {
        INVALIDCLASS: new Error("The class used is not a valid class."),
        INVALIDPIECE: new Error("The piece must be a valid ChessPiece instance."),
        INVALIDTEAM: new Error("The team selected is not valid. Use static values to selected it."),
        INVALIDVECTOR: new Error("The input must be a valid vector. Please use the method createVector on the ChessBoard class.")
    };

    constructor(canvasSize) {
        this._canvasSize = canvasSize;
        this._cellSize = canvasSize / 8;

        this._grid = new Array(8);
        for(let i = 0; i < 8; i++){
            this._grid[i] = new Array(8);
        }
        this._teamPieces = [new Set(), new Set()];

        
        let order = [
            ChessBoard.PIECES.rook,
            ChessBoard.PIECES.knight,
            ChessBoard.PIECES.bishop,
            ChessBoard.PIECES.queen,
            ChessBoard.PIECES.king,
            ChessBoard.PIECES.bishop,
            ChessBoard.PIECES.knight,
            ChessBoard.PIECES.rook
        ];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 2; j++) {
                // pawns
                let correctIndex = j * 5 + 1; // 1, 6
                let piece = new ChessBoard.PIECES["pawn"](j, this.createVector(i, correctIndex));
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);

                // rest of pieces
                correctIndex = j * 7; //0, 7
                piece = new order[i](j, this.createVector(i, correctIndex));
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);
            }
        }
    }

    /**
     * Represents the board on a p5.Canvas
     */
    show() {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                this.showCell(this.createVector(i, j));
            }
        }
    }

    /**
     * Represents the selected cell (0 based) on a p5.Canvas
     * @param {int} r index of the desired row
     * @param {int} c index of the desired col
     */
    showCell(pos) {
        if (!ChessBoard.checkVector(pos)) {
            throw ChessBoard.ERRORS.INVALIDVECTOR;
        }

        push();
        fill(...ChessBoard.COLORS[(pos.r + pos.c) % 2]);
        rect(this.cellSize * pos.c, this.cellSize * pos.r, this.cellSize, this.cellSize);
        pop();
        let possiblePiece = this.grid[pos.r][pos.c];
        if (possiblePiece instanceof ChessPiece) {
            possiblePiece.show();
        }
    }

    /**
     * Return the size of each cell in pixels.
     */
    get cellSize() {
        return this._cellSize;
    }

    /**
     * Return the 2D array with the pieces on their positions.
     */
    get grid() {
        return this._grid;
    }

    /**
     * Return the pieces of the White team as a Set<ChessPiece>.
     */
    get whiteTeam() {
        return this.getTeam(ChessPiece.TEAM.WHITE);
    }

    /**
     * Return the pieces of the Black team as a Set<ChessPiece>.
     */
    get blackTeam() {
        return this.getTeam(ChessPiece.TEAM.BLACK);
    }

    /**
     * Returns the selected team pieces as a Set<ChessPiece>.
     * @param {int} index Index of the team, following the ChessPiece.TEAM logic.
     * @returns The selected Set.
     */
    getTeam(index) {
        return this._teamPieces[index];
    }

    // CHESS LOGIC
    

    movePiece(piece, v)  {
        if (!(piece instanceof ChessPiece)) {
            throw ChessBoard.ERRORS.INVALIDPIECE;
        }

        if (!ChessBoard.checkVector(v)) {
            throw ChessBoard.ERRORS.INVALIDVECTOR;
        }

        let oldPos = piece.vector;
        this.grid[v.r][v.c] = piece;
        piece.vector = v;
        this.grid[oldPos.r][oldPos.c] = undefined;

        // Update cells on canvas
        this.showCell(piece.vector);
        this.showCell(oldPos);
    }

    // TOOLS

    /**
     * Returns the correct properties of the cell at the selected index.
     * @param {int} r row position.
     * @param {int} c col position.
     * @returns The correct object to send to the ChessPiece classes.
     */
    createVector(r, c) {
        let v = {
            r: r,
            c: c,
            size: this.cellSize
        }
        ChessBoard.checkVector(v); // Check if vector is valid
        return v;
    }

    static checkVector(position) {
        return Number.isInteger(position.r) && Number.isInteger(position.c) &&
            position.r >= 0 && position.r < 9 && 
            position.c >= 0 && position.c < 9
    }
}