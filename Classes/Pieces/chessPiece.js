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
        this._pos = createVector(0, 0);

        this._img = imgs[ChessPiece.TEAMIMGPREFIX[this.team] + this.piece];
    }

    /**
     * Represents on the p5.Canvas the piece
     */
    show = function() {
        let sX = this.x * w;
        let sY = this.y * h;
        image(imgs.pawnW, sX, sY, w, h);
    }

    // SETTERS AND GETTERS
    
    get 
}