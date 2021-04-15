/**
 * Class with the logic to create a piece of chess. Designed to use it with the ChessBoard class.
 */
class ChessPiece {
    static PIECENAME = [
        "bishop",
        "king",
        "knight",
        "pawn",
        "queen",
        "rook"
    ];
    static TEAM = {
        BLACK: 0,
        WHITE: 1
    };
    static TEAMIMGPREFIX = [
        "B",
        "W"
    ];

    constructor(team, vector=null) {
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

        this._img = imgs[this.piece + this.teamName];
        this._imgProperties = undefined;

        this._vector = undefined;
        if (vector == null) {
            vector = {r: 0, h: 0, size: 50};
        }
        this.vector = vector;
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        image(this.img, ...this.imgProperties);
    }


    // SETTERS AND GETTERS
    /**
     * @returns Name of the class used to create this instance. Note that the name is lowerCased.
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
        return this._properties;
    }

    /**
     * Overwrites the properties of the piece
     * @param {object} p (optional) object with the properties of the piece
     */
     set vector(p) {
        this._vector = p
        this._imgProperties = [
            this.vector.r * this.vector.size,
            this.vector.c * this.vector.size,
            this.vector.size,
            this.vector.size
        ];
    }
}

class Bishop extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}

class King extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}

class Knight extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}

class Pawn extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}

class Queen extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}

class Rook extends ChessPiece {
    constructor(...arg) {
        super(...arg);
    }
}