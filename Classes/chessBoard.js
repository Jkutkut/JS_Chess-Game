/**
 * Class to have the logic of a full chess board
 */
class ChessBoard {
    // CONSTANTS
    /**
     * Colors used to represent the cells on the board.
     * 
     * Current order: WhiteCell, BlackCell, FocusCell, AimedCell, AttackedCell
     */
    static COLORS = [
        [213, 184, 144],
        [114, 54, 26],
        [0, 0, 100],
        [255, 255, 0, 200],
        [255, 0, 0, 200]
    ];

    /**
     * Conversor string-Class of pieces.
     */
    static PIECES = {
        "bishop": Bishop,
        "king": King,
        "knight": Knight,
        "pawn": Pawn,
        "queen": Queen,
        "rook": Rook
    }

    /**
     * When this.grid has a cell with no piece on it, this value is stored instead.
     */
    static EMPTYCELL = undefined;

    /**
     * All possible states a cell can be represented.
     * @see this.showCell function to see how the value changes the color.
     * @see ChessBoard.COLORS to see the colors used.
     */
    static CELLSTATE = {
        NORMAL: 0,
        FOCUSED:2,
        AIMED: 3
    };

    /**
     * The possible values this.turn can be and what it represents.
     * @example this.turn == ChessBoard.TURN.BLACK => black pieces playing
     */
    static TURN = {
        BLACK: 0,
        WHITE: 1
    }

    /**
     * All spected errors that can happend on this class.
     */
    static ERRORS = {
        INVALIDCLASS: "The class used is not a valid class.",
        INVALIDPIECE: "The piece must be a valid ChessPiece instance.",
        INVALIDTEAM: "The team selected is not valid. Use static values to selected it.",
        INVALIDVECTOR: "The input must be a valid vector. Please use the method createVector on the ChessBoard class.",
        NOTYOURTURN: "It is not the turn of this piece"
    };

    // CODE
    constructor(canvasSize) {
        this._canvasSize = canvasSize;
        this._cellSize = canvasSize / 8;

        // Create the pieces
        this._grid = new Array(8); //pieces stored on a 2D array
        for(let i = 0; i < 8; i++){
            this._grid[i] = new Array(8);
        }
        this._teamPieces = [new Set(), new Set()]; // Each set stores the pieces of each team
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
        let correctIndex, piece;
        for (let i = 0; i < 8; i++) { // for each column
            for (let j = 0; j < 2; j++) { // For each team
                // pawns
                correctIndex = j * 5 + 1; // 1, 6
                piece = new ChessBoard.PIECES["pawn"](j, this.createVector(correctIndex, i), this);
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);

                // rest of pieces
                correctIndex = j * 7; //0, 7
                piece = new order[i](j, this.createVector(correctIndex, i), this);
                this._grid[correctIndex][i] = piece;
                this._teamPieces[j].add(piece);
            }
        }

        this._turn = ChessBoard.TURN.WHITE; // Whites always start
        this.nTurn = 0;

        // User control:
        this._mouse = this.createVector(-1, -1);
        this._currentMoves = {piece: {team: ChessBoard.TURN.WHITE}, moves: new Set()};
        this.pieceLocked = false;
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
    showCell(pos, aimed=ChessBoard.CELLSTATE.NORMAL) {
        if (!(pos instanceof ChessVector) || !pos.checkVector()) {
            console.warn(pos);
            throw new Error(ChessBoard.ERRORS.INVALIDVECTOR);
        }

        push(); // basic cell representation
        fill(...ChessBoard.COLORS[(pos.r + pos.c) % 2]);
        rect(this.cellSize * pos.c, this.cellSize * pos.r, this.cellSize, this.cellSize);
        pop();

        let possiblePiece = this.grid[pos.r][pos.c];

        if (aimed != ChessBoard.CELLSTATE.NORMAL) { // If focused or aimed (or attacked)
            let colorIndex = aimed;

            if (aimed == ChessBoard.CELLSTATE.AIMED && possiblePiece instanceof ChessPiece) {
                colorIndex++; // if possibleCell is a piece and aimed => attack
            }
            
            push(); // hightlight the cell with the specified color
            fill(...ChessBoard.COLORS[colorIndex]);
            rect(this.cellSize * pos.c, this.cellSize * pos.r, this.cellSize, this.cellSize);
            pop();
        }

        if (possiblePiece instanceof ChessPiece) {
            possiblePiece.show(); // represent the piece
        }
    }

    /**
     * Updates the movement of the currentMoves object based on the given state.
     * @param {int} state Desired state of the cells.
     * @see ChessBoard.updateCurrentMoves function for states used
     * @see ChessBoard.CELLSTATE for the standar states
     */
     showMovement(state) {
        let move, moves = this.movesIterator(this.currentMoves);
        do {
            move = moves.next();
            if (move.done) {
                return
            }
            this.showCell(move.value, state);
        } while (true)
    }

//     // GETTERS AND SETTERS

    /**
     * Return the size of the p5.Canvas
     */
    get canvasSize() {
        return this._canvasSize;
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

    /**
     * Current turn.
     * @example turn = ChessBoard.TURN.WHITE => turn for white pieces to move
     */
    get turn() {
        return this._turn;
    }

    // /**
    //  * Changes the turn of board.
    //  * @see this.turn for the current turn.
    //  * @see ChessBoard.TURN for possible turns.
    //  */
    changeTurn() {
        this.pieceLocked = false;
        this.currentMoves.moves.clear();

        if (this.turn == ChessBoard.TURN.WHITE) {
            this._turn = ChessBoard.TURN.BLACK;
            this.currentMoves.piece = {team: ChessBoard.TURN.BLACK};
        }
        else {
            this._turn = ChessBoard.TURN.WHITE;
            this.currentMoves.piece = {team: ChessBoard.TURN.WHITE};
        }
    }

    /**
     * Returns custom vector with the row and cell aimed with the mouse.
     * If position not on board, coordinate = -1.
     */
    get mouse() {
        return this._mouse;
    }

    /**
     * Return the current object with the cell used and the avalible moves for that cell
     * @see ChessPiece.getMoves function to see how it is generated
     */
    get currentMoves() {
        return this._currentMoves;
    }


    updateCurrentMoves() {
        /**
         * Cases:
         *  Nothing selected
         *  piece selected
         *  piece selected and aiming piece
         */

        if (!this.pieceLocked) { // if piece not locked => selecting piece
            if (!this.mouse.checkVector()) { // if not valid index
                // this.showMovement(ChessBoard.CELLSTATE.NORMAL);
                this._currentMoves.moves.clear(); // if not locked and on invalid position, reset the valid moves
                return;
            }

            this.showMovement(ChessBoard.CELLSTATE.NORMAL);

            let possibleCell = this.grid[this.mouse.r][this.mouse.c];

            if (possibleCell instanceof ChessPiece && possibleCell.team == this.turn) {
                // if cell contains a piece from the team playing now
                this._currentMoves = possibleCell.getMoves();
                console.log("selecting");
            }
            else {
                return;
            }

            this.showMovement(ChessBoard.CELLSTATE.AIMED);
            
        }
        else {
            this.showMovement(ChessBoard.CELLSTATE.AIMED);
            if (ChessBoard.vectorInPossibleMoves(this.mouse, this.currentMoves)) {
                this.showCell(this.mouse, ChessBoard.CELLSTATE.FOCUSED);
            }
            else {

            }
        }
    }

    

    // CHESS LOGIC
    
    /**
     * Appends to move the desired piece to the desired location.
     * @param {ChessPiece} piece Desired piece.
     * @param {Object} v Custom ChessBoard.createVector() object with the desired new position.
     * @throws Error if invalid input or not valid turn to move the desired piece.
     * @see ChessBoard.createVector() method where the object is generated.
     */
    movePiece(piece, v)  {
        if (!(piece instanceof ChessPiece)) {
            throw new Error(ChessBoard.ERRORS.INVALIDPIECE);
        }

        if(piece.team != this.turn) {
            throw new Error(ChessBoard.ERRORS.NOTYOURTURN);
        }

        if (!(v instanceof ChessVector) || !v.checkVector()) {
            throw new Error(ChessBoard.ERRORS.INVALIDVECTOR);
        }

        let oldPos = piece.vector;

        // Update cells on canvas
        this.showMovement(ChessBoard.CELLSTATE.NORMAL);

        this.grid[v.r][v.c] = piece;
        this.grid[oldPos.r][oldPos.c] = ChessBoard.EMPTYCELL;

        piece.vector = v;

        this.showCell(oldPos, ChessBoard.CELLSTATE.NORMAL);
        this.showCell(v, ChessBoard.CELLSTATE.NORMAL);
        this.changeTurn();
    }

    /**
     * Analyces the board to ensure the En Passant move can be executed and removes the piece.
     * @param {ChessPiece} piece Piece making the move.
     * @throws Error if invalid input or conditions not okay to execute the move.
     */
    enPassant(piece) {
        if (!(piece instanceof Pawn)) {
            throw new Error(ChessBoard.ERRORS.INVALIDPIECE);
        }
        if (!(piece instanceof Pawn)) {
            throw new Error(ChessBoard.ERRORS.INVALIDPIECE);
        }

        let coord = this.createVector(piece.vector.r - piece.moveDirections[0].r, piece.vector.c);
        let p = this.grid[coord.r][coord.c]; // Possible pawn to remove

        if (piece.team == p.team) {
            throw new Error(ChessBoard.ERRORS.INVALIDTEAM);
        }

        this.grid[coord.r][coord.c] = ChessBoard.EMPTYCELL; // Remove the pawn
        this.showCell(coord); // update that cell to show the pawn has been destroyed
    }

    promote(piece, value) {
        if (!(piece instanceof Pawn)) {
            throw new Error(ChessBoard.ERRORS.INVALIDPIECE);
        }

        let pieceClassIndex = ChessPiece.PIECENAME.indexOf(value);
        if (pieceClassIndex == -1) {
            throw new Error(ChessBoard.ERRORS.INVALIDCLASS);
        }
        let newPiece = new ChessBoard.PIECES[value](piece.team, piece.vector.copy(), this);
        this.grid[piece.vector.r][piece.vector.c] = newPiece;
        this.showCell(piece.vector);
    }


    /**
     * Analyses the position of the mouse.
     * @param {int} mX mouse position in pixels.
     * @param {int} mY mouse vertical position in pixels.
     * @returns (boolean) whenever the cell aimed has changed
     */
    mouseHandler(mX, mY) {
        // get new indices
        let newR = (mY < this.canvasSize) ? Math.floor(mY / this.cellSize) : -1;
        let newC = (mX < this.canvasSize) ? Math.floor(mX / this.cellSize) : -1;
        let mouseChanged = false; // Condition to see if mouse has changed position since last call
        if (newR != this.mouse.r) {
            this._mouse.r = newR;
            mouseChanged = true;
        }
        if (newC != this.mouse.c) {
            this._mouse.c = newC;
            mouseChanged = true;
        }

        if (mouseChanged) {
            this.updateCurrentMoves();
        }
        return mouseChanged;
    }

    clickHandler() {
        if (!this.mouse.checkVector()) { // if mouse not aiming a cell
            return;
        }

        let pieceAimed = this.grid[this.mouse.r][this.mouse.c];
        
        if (!this.pieceLocked) { // if looking for a piece to select
            if (pieceAimed == ChessBoard.EMPTYCELL) {
                return;
            }
            if (pieceAimed.team == this.turn) {
                // if selecting a piece from the team that plays now
                //updateMoves?
                this.pieceLocked = true;
                console.log("click");
            }   
        }
        else { // If piece selected
            if (ChessBoard.vectorInPossibleMoves(this.mouse, this.currentMoves)) {
                this.nTurn++;
                this.movePiece(this.currentMoves.piece, this.mouse);
            }
            else {
                this.showMovement(); // clear the selected cells
                this.pieceLocked = false;
                this.currentMoves.moves.clear();
                console.info("focus lost");
                this.updateCurrentMoves();
                return;
            }
        }
    }

    
    
    // TOOLS
    static vectorInPossibleMoves(v, moves) {
        let move, movesIte = this.movesIterator(moves);
        do {
            move = movesIte.next();
            if (move.done) {
                console.log("vector NOT on pos moves");
                return false;
            }
            if (v.sameCoordinates(move.value)){
                console.log("vector on pos moves");
                return true;
            }
        } while (true)
    }

    /**
     * Iterable with all the moves of the given moves object.
     * @param {obj} moveObj object generated on a chessPiece.getMoves().
     * @param {ChessBoard} board (optional) the board assigned to these moves.
     * @returns Iterable with the moves
     */
    static *movesIterator(moveObj, board=null) {
        if (!board) {
            board = ChessBoard;
        }
        for (let move of moveObj.moves) { // for each possible move of the current cell
            for (let i = 1; i <= move[1]; i++) { // for each amount
                yield board.createVector(
                    moveObj.piece.vector.r + i * move[0].r,
                    moveObj.piece.vector.c + i * move[0].c
                );
            }
        }
    }
    
    /**
     * Iterable with all the moves of the given moves object.
     * @param {obj} moveObj object generated on a chessPiece.getMoves()
     * @returns Iterable with the moves
     */
    movesIterator(moveObj) {
        return ChessBoard.movesIterator(moveObj, this);
    }
    
    
    /**
     * Returns the correct properties of the cell at the selected index.
     * @param {int} r row position.
     * @param {int} c col position.
     * @returns The correct object to send to the ChessPiece classes.
     * 
     * @todo
     */
    createVector(r, c) {
        return ChessBoard.createVector(r, c, this);
    }    

    /**
     * Returns the correct properties of the cell at the selected index.
     * @param {int} r row position.
     * @param {int} c col position.
     * @param {ChessBoard} (optional) the board asociated to. This argument allows to fill the cellSize.
     * @returns The correct object to send to the ChessPiece classes.
     * 
     * @todo
     */
    static createVector(r, c, board=null) {
        return new ChessVector(r, c, board);
    }
}