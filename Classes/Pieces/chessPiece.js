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

    static ERRORS = {
        INVALIDCLASS: new Error("The class used is not a valid class."),
        INVALIDPIECE: new Error("The piece must be a string with the name of the piece (rook, king...)."),
        INVALIDTEAM: new Error("The team selected is not valid. Use static values to selected it.")
    };

    constructor(team, properties=null) {
        let piece = this.constructor.name.toLowerCase(); // get Class name used to invoque this constructor (lowercase)
        
        // Check correct input
        if (!ChessPiece.PIECENAME.includes(piece)) {
            throw ChessPiece.ERRORS.INVALIDCLASS;
        }
        if (team != ChessPiece.TEAM.WHITE && team != ChessPiece.TEAM.BLACK) {
            throw ChessPiece.ERRORS.INVALIDTEAM;
        }

        this._piece = piece;
        this._team = team;
        
        this._properties = undefined;
        if (properties == null) {
            properties = {r: 0, h: 0, size: 50};
        }

        this._img = imgs[this.piece + this.teamName];
        this._imgProperties = undefined;

        this.setNewProperties(properties);
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        image(this.img, ...this.imgProperties);
    }

    /**
     * Overwrites the properties of the piece
     * @param {object} p (optional) object with the properties of the piece
     */
    setNewProperties(p) {
        this._properties = p
        this._imgProperties = [
            this.properties.r * this.properties.size,
            this.properties.c * this.properties.size,
            this.properties.size,
            this.properties.size
        ];
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
    get properties() {
        return this._properties;
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