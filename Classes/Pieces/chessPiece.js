/**
 * Class with the logic to create a piece of chess. Designed to use it with the ChessBoard class.
 */
class ChessPiece {
    /**
     * All possible pieces names
     */
    static PIECENAME = [
        "bishop",
        "king",
        "knight",
        "pawn",
        "queen",
        "rook"
    ];

    /**
     * Standar value of each team. Used to define the this.team value.
     */
    static TEAM = {
        BLACK: 0,
        WHITE: 1
    };

    /**
     * Strings to transforms the current team to a string.
     * @see ChessPiece.TEAM
     */
    static TEAMIMGPREFIX = [
        "B",
        "W"
    ];

    /**
     * All possible movements allowed (not castling)
     */
    static PIECESMOVEMENT = {
        diagonals: [
            {r: 1, c: 1},
            {r: 1, c: -1},
            {r: -1, c: 1},
            {r: -1, c: -1}
        ],
        lines: [
            {r: 1, c: 0},
            {r: -1, c: 0},
            {r: 0, c: 1},
            {r: 0, c: -1}
        ],
        knight: [
            {r: 2, c: 1},
            {r: 2, c: -1},
            {r: -2, c: 1},
            {r: -2, c: -1},
            {r: -1, c: 2},
            {r:  1, c: 2},
            {r: -1, c: -2},
            {r: 1, c: -2},
        ]
    }

    constructor(team, vector, parent) {
        let piece = this.constructor.name.toLowerCase(); // get Class name used to invoque this constructor (lowercase)
        
        // Check correct input
        if (!ChessPiece.PIECENAME.includes(piece)) {
            throw ChessBoard.ERRORS.INVALIDCLASS;
        }
        if (team != ChessPiece.TEAM.WHITE && team != ChessPiece.TEAM.BLACK) {
            throw ChessBoard.ERRORS.INVALIDTEAM;
        }

        this._piece = piece;
        this._team = team;

        // img
        this._img = imgs[this.piece + this.teamName];
        this._imgProperties = undefined;

        this.vector = vector; // also updates this._imgProperties

        this._board = parent;

        this._moveDir = undefined; // possible directions to go (from ChessPiece.Piecesmovement)
        this._amount = undefined; // amount of cells a piece can move in each direction
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        image(this.img, ...this.imgProperties);
    }


    // SETTERS AND GETTERS
    /**
     * @returns Name of the class used to create this instance. 
     * @see Note that the name is lowerCased.
     */
    get piece() {
        return this._piece;
    }

    /**
     * @returns team code asign to this piece (see TEAM constant)
     */
    get team() {
        return this._team;
    }

    /**
     * @returns String equivalent of the get team method: W for white pieces or B for black pieces
     */
    get teamName() {
        return ChessPiece.TEAMIMGPREFIX[this.team];
    }

    /**
     * @returns img linked to the piece
     */
    get img() {
        return this._img;
    }

    /**
     * @returns properties needed to represent the img on a P5.Canvas as a array
     */
    get imgProperties() {
        return this._imgProperties;
    }
    
    /**
     * @returns object with all the properties of the piece (position, size...)
     */
    get vector() {
        return this._vector;
    }

    /**
     * Overwrites the properties of the piece
     * @param {object} p (optional) object with the properties of the piece
     */
    set vector(p) {
        if (!(p instanceof ChessVector) || !p.checkVector()) { // if invalid, error is raised
            return
        }
        this._vector = p.copy();
        this._imgProperties = [
            this.vector.c * this.vector.size,
            this.vector.r * this.vector.size,
            this.vector.size,
            this.vector.size
        ];
    }

    /**
     * @returns Directions allow by this piece by default.
     * @see ChessPiece.PIECESMOVEMENT to see the avalible
     */
    get moveDirections() {
        return this._moveDir;
    }

    /**
     * @returns Amount of cells this piece can move on a single move by default.
     */
    get amount() {
        return this._amount;
    }

    /**
     * Get current parent
     */
    get parent() {
        return this._board;
    }

    /**
     * Having on mind the current board, calculate all possible movements for this piece.
     * @returns Custom object with the possible moves of this cell.
     * @see this.parent with the ChessBoard instance
     * @see ChessPiece.PIECESMOVEMENT for moves
     */
    getMoves(){
        let moves = new Set();
        let am, pieceV, pieceToCheck;
        for (let dir of this.moveDirections) {
            am = 0;
            // console.log("----");
            // console.log(dir);
            for(let i = 1; i <= this.amount; i++) {
                pieceV = new ChessVector(
                    this.vector.r + i * dir.r,
                    this.vector.c + i * dir.c,
                    this.parent
                );

                if (!pieceV.checkVector()) {
                    break; // if not valid index (out of bounds)
                }

                pieceToCheck = this._board.grid[pieceV.r][pieceV.c];
                if (pieceToCheck == ChessBoard.EMPTYCELL) {
                    am++;
                    continue;
                }
                else if (pieceToCheck.team == this.team) {
                    break;
                }
                else { // != this.team
                    am++;
                    break;
                }
            }
            if (am > 0) {
                moves.add([dir, am]);
            }
        }
        return {piece: this, moves: moves};
    }
}

class Bishop extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = ChessPiece.PIECESMOVEMENT.diagonals;
        this._amount = Infinity;
    }
}

class King extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = Array.prototype.concat(
            ChessPiece.PIECESMOVEMENT.diagonals,
            ChessPiece.PIECESMOVEMENT.lines
        );
        this._amount = 1;
    }
}

class Knight extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = ChessPiece.PIECESMOVEMENT.knight;
        this._amount = 1;
    }
}

class Pawn extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = [
            ChessPiece.PIECESMOVEMENT.lines[this.team]
        ];
        this._amount = 1;

        this.killMoves = [
            ChessPiece.PIECESMOVEMENT.diagonals[this.team * 2],
            ChessPiece.PIECESMOVEMENT.diagonals[this.team * 2 + 1]
        ]
    }

    getMoves() {
        let am, pieceV, pieceToCheck;
        // let defMoves = ChessPiece.prototype.getMoves.call(this);
        let moves = new Set();

        for (let dir of this.moveDirections) {
            am = 0;
            for(let i = 1; i <= this.amount; i++) {
                pieceV = new ChessVector(
                    this.vector.r + i * dir.r,
                    this.vector.c + i * dir.c,
                    this.parent
                );

                if (!pieceV.checkVector()) {
                    break; // if not valid index (out of bounds)
                }

                pieceToCheck = this._board.grid[pieceV.r][pieceV.c];
                if (pieceToCheck == ChessBoard.EMPTYCELL) {
                    am++;
                    continue;
                }
                else if (pieceToCheck.team == this.team) {
                    break;
                }
            }
            if (am > 0) {
                moves.add([dir, am]);
            }
        }


        for (let dir of this.killMoves) {
            am = 0;
            for(let i = 1; i <= this.amount; i++) {
                pieceV = new ChessVector(
                    this.vector.r + i * dir.r,
                    this.vector.c + i * dir.c,
                    this.parent
                );

                if (!pieceV.checkVector()) {
                    break; // if not valid index (out of bounds)
                }

                pieceToCheck = this._board.grid[pieceV.r][pieceV.c];
                if (pieceToCheck != ChessBoard.EMPTYCELL && pieceToCheck.team != this.team) { // != this.team
                    am++;
                    break;
                }
            }
            if (am > 0) {
                // defMoves.moves.add([dir, am]);
                moves.add([dir, am]);
            }
        }
        // double distance on firt move
        // En passant
        return {piece: this, moves: moves};
    }
}

class Queen extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = Array.prototype.concat(
            ChessPiece.PIECESMOVEMENT.diagonals,
            ChessPiece.PIECESMOVEMENT.lines
        );
        this._amount = Infinity;
    }
}

class Rook extends ChessPiece {
    constructor(...arg) {
        super(...arg);
        this._moveDir = ChessPiece.PIECESMOVEMENT.lines;
        this._amount = Infinity;
    }
}