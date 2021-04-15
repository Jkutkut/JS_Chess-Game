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
                let piece = new ChessBoard.PIECES["pawn"](j, this.createPropertiesPiece(i, correctIndex));
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);

                // rest of pieces
                correctIndex = j * 7; //0, 7
                piece = new order[i](j, this.createPropertiesPiece(i, correctIndex));
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);
            }
        }
    }

    /**
     * Represents the board on a p5.Canvas
     */
    show() {
        push();
        stroke
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                fill(...ChessBoard.COLORS[(i + j) % 2]);
                rect(this.cellSize * i, this.cellSize * j, this.cellSize, this.cellSize);
            }
        }

        for (let team of this._teamPieces) {
            for (let piece of team) {
                piece.show();
            }
        }
        pop();
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


    // TOOLS

    /**
     * Returns the correct properties of the cell at the selected index.
     * @param {int} r row position.
     * @param {int} c col position.
     * @returns The correct object to send to the ChessPiece classes.
     */
    createPropertiesPiece(r, c) {
        return {
            r: r,
            c: c,
            size: this.cellSize
        }
    }
}