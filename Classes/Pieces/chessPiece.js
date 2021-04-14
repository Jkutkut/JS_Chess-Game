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
        INVALIDPIECE: new Error("The piece must be a string with the name of the piece (rook, king...)."),
        INVALIDTEAM: new Error("The team selected is not valid. Use static values to selected it.")
    };

    constructor(piece, team) {
        // Check correct input
        if (!ChessPiece.PIECENAME.includes(piece)) {
            throw ChessPiece.ERRORS.INVALIDPIECE;
        }
        if (team != ChessPiece.TEAM.WHITE && team != ChessPiece.TEAM.BLACK) {
            throw ChessPiece.ERRORS.INVALIDTEAM;
        }

        this._piece = piece;
        this._team = team;
        // this._pos = createVector(0, 0);
        this._pos = {
            row: {
                start: 0,
                w: 0
            },
            height: {
                start: 0,
                h: 0
            }
        };

        this._img = imgs[this.teamName + this.piece];
        this.imgSize = [0, 0, 0, 0];
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        // image(imgs.pawnW, sX, sY, w, h);
        image(this.img, ...this.imgSize);
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
}