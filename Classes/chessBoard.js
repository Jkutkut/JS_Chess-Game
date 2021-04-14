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

        let order = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
        // for(let i = 0; i < 8; i++){
        //     grid[i][0].setPiece(new piece(order[i], 1));
        //     grid[i][1].setPiece(new piece("pawn", 1));
        //     grid[i][6].setPiece(new piece("pawn", -1));
        //     grid[i][7].setPiece(new piece(order[i], -1));

        //     //add pices to team var
        //     team[0].push(grid[i][0].piece);
        //     team[0].push(grid[i][1].piece);
        //     team[1].push(grid[i][6].piece);
        //     team[1].push(grid[i][7].piece);
        // }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 2; j++) {
                let piece = new ChessBoard.PIECES["pawn"](1);
                this._grid[i][j * 5 + 1] = piece;
                this._teamPieces[j].add(piece);
            }
            // grid[i][6].setPiece(new piece("pawn", -1));
        }
    }

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

    get cellSize() {
        return this._cellSize;
    }

    get grid() {
        return this._grid;
    }
}