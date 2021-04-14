class ChessPiece {
    static PIECENAME = [
        "bishop",
        "rook",
        "knight",
        "queen",
        "king",
        "pawn"
    ];
    static TEAM = {
        WHITE: 0,
        BLACK: 1
    };
    static TEAMIMGPREFIX = [
        "W",
        "B"
    ];

    static ERRORS = {
        INVALIDCLASS: new Error("The class used is not a valid class."),
        INVALIDPIECE: new Error("The piece must be a string with the name of the piece (rook, king...)."),
        INVALIDTEAM: new Error("The team selected is not valid. Use static values to selected it.")
    };

    constructor(team, properties=null) {
        let piece = this.constructor.name.toLowerCase();
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
            properties = {
                r: 0,
                h: 0,
                size: 50
            };
        }

        this._img = imgs[this.piece + this.teamName];
        this._imgSize = undefined;

        this.setNewProperties(properties);
        // console.log(this.imgSize);
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        // image(imgs.pawnW, sX, sY, w, h);
        image(this.img, ...this.imgSize);
    }

    setNewProperties(p=null) {
        if (p != null) {
            this._properties = p
        }
        this._imgSize = [
            this.properties.r * this.properties.size,
            this.properties.c * this.properties.size,
            this.properties.size,
            this.properties.size
        ];
    }

    // SETTERS AND GETTERS
    
    get piece() {
        return this._piece;
    }

    get team() {
        return this._team;
    }

    get teamName() {
        return ChessPiece.TEAMIMGPREFIX[this.team];
    }

    get img() {
        return this._img;
    }

    get imgSize() {
        return this._imgSize;
    }
    
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