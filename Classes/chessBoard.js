/**
 * Class to have the logic of a full chess board
 */
class ChessBoard {
    /**
     * Colors used to represent the cells on the board.
     * 
     * Current order: WhiteCell, BlackCell, FocusCell, AimedCell, AttackedCell
     */
    static COLORS = [
        [213, 184, 144],
        [114, 54, 26],
        [0, 0, 100],
        [255, 255, 0, 100],
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
        INVALIDCLASS: new Error("The class used is not a valid class."),
        INVALIDPIECE: new Error("The piece must be a valid ChessPiece instance."),
        INVALIDTEAM: new Error("The team selected is not valid. Use static values to selected it."),
        INVALIDVECTOR: new Error("The input must be a valid vector. Please use the method createVector on the ChessBoard class."),
        NOTYOURTURN: new Error("It is not the turn of this piece")
    };

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

//         // User control:
//         this._mouse = this.createVector(-1, -1);
//         this.pieceLocked = null;
//         this._currentMoves = {piece: {team: ChessBoard.TURN.WHITE}, moves: new Set()};
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
    // showCell(pos, aimed=ChessBoard.CELLSTATE.NORMAL) {
    //     if (!(pos instanceof ChessVector) || !pos.checkVector()) {
    //         throw ChessBoard.ERRORS.INVALIDVECTOR;
    //     }

    //     push(); // basic cell representation
    //     fill(...ChessBoard.COLORS[(pos.r + pos.c) % 2]);
    //     rect(this.cellSize * pos.c, this.cellSize * pos.r, this.cellSize, this.cellSize);
    //     pop();

    //     console.log(pos);

    //     let possiblePiece = this.grid[pos.r][pos.c];

    //     if (aimed != ChessBoard.CELLSTATE.NORMAL) { // If focused or aimed (or attacked)
    //         let colorIndex;
    //         if (aimed == ChessBoard.CELLSTATE.AIMED) { // aim or attack
    //             colorIndex = aimed;
    //             if (possiblePiece instanceof ChessPiece) { 
    //                 colorIndex++; // if possibleCell is a piece and aimed => attack
    //             }
    //         }
    //         else { // focused
    //             // colorIndex
    //         }
    //         push(); // hightlight the cell with the specified color
    //         fill(...ChessBoard.COLORS[colorIndex]);
    //         rect(this.cellSize * pos.c, this.cellSize * pos.r, this.cellSize, this.cellSize);
    //         pop();
    //     }

    //     if (possiblePiece instanceof ChessPiece) {
    //         possiblePiece.show(); // represent the piece
    //     }
    // }

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

    /**
     * Changes the turn of board.
     * @see this.turn for the current turn.
     * @see ChessBoard.TURN for possible turns.
     */
    changeTurn() {
        if (this.turn == ChessBoard.TURN.WHITE) {
            this._turn = ChessBoard.TURN.BLACK;
        }
        else {
            this._turn = ChessBoard.TURN.WHITE;
        }
    }

//     /**
//      * Returns custom vector with the row and cell aimed with the mouse.
//      * If position not on board, coordinate = -1.
//      */
//     get mouse() {
//         return this._mouse;
//     }

//     /**
//      * Return the current object with the cell used and the avalible moves for that cell
//      * @see ChessPiece.getMoves function to see how it is generated
//      */
//     get currentMoves() {
//         return this._currentMoves;
//     }


//     updateCurrentMoves() {
//         if (this.pieceLocked != null) { // if piece locked
//             console.warn("piece locked")
//             if (ChessBoard.vectorInPossibleMoves(this.mouse, this.currentMoves)) {
//                 this.showCell(this.currentMoves.cell, ChessBoard.CELLSTATE.FOCUSED);
//             }
//             // if (current aimed cell in f(this.currentMoves.moves)){
//             //     this.showMovement(Normal)
//             //     this.showCell(aimed cell, focused State)
//             // }
//             return;
//         }
        
//         this.showMovement(ChessBoard.CELLSTATE.NORMAL); // clear previous state

//         if (!this.mouse.checkVector()) { // if not valid index
//             return;
//         }

//         let possibleCell = this.grid[this.mouse.r][this.mouse.c];

//         if (possibleCell instanceof ChessPiece) {
//             this._currentMoves = possibleCell.getMoves();
//         }

//         if (this.currentMoves.piece.team != this.turn) {
//             console.warn("invalid team");
//             return
//         }

//         this.showMovement(ChessBoard.CELLSTATE.AIMED);
//     }

//     /**
//      * Updates the movement of the currentMoves object based on the given state.
//      * @param {int} state Desired state of the cells.
//      * @see ChessBoard.updateCurrentMoves function for states used
//      * @see ChessBoard.CELLSTATE for the standar states
//      */
//     showMovement(state) {
//         let move, moves = this.movesIterator(this.currentMoves);
//         do {
//             move = moves.next();
//             if (move.done) {
//                 return
//             }
//             this.showCell(move.value, state);
//         } while (true)
//     }

//     // CHESS LOGIC
    
//     /**
//      * Appends to move the desired piece to the desired location.
//      * @param {ChessPiece} piece Desired piece.
//      * @param {Object} v Custom ChessBoard.createVector() object with the desired new position.
//      * @throws Error if invalid input or not valid turn to move the desired piece.
//      * @see ChessBoard.createVector() method where the object is generated.
//      */
//     movePiece(piece, v)  {
//         if (!(piece instanceof ChessPiece)) {
//             throw ChessBoard.ERRORS.INVALIDPIECE;
//         }

//         if(piece.team != this.turn) {
//             throw ChessBoard.ERRORS.NOTYOURTURN;
//         }

//         if (!v.checkVector()) {
//             throw ChessBoard.ERRORS.INVALIDVECTOR;
//         }

//         let oldPos = piece.vector;
//         this.grid[v.r][v.c] = piece;
//         this.grid[oldPos.r][oldPos.c] = ChessBoard.EMPTYCELL;
//         console.log("this.grid[oldPos.r][oldPos.c]: " + this.grid[oldPos.r][oldPos.c]);
//         console.log(oldPos);
//         console.log(v);

//         piece.vector = v;

//         // Update cells on canvas
//         this.showCell(piece.vector);
//         this.showCell(oldPos);

//         this.changeTurn();
//     }


//     mouseHandler(mX, mY) {
//         // get new indices
//         let newR = (mY < this.canvasSize) ? Math.floor(mY / this.cellSize) : -1;
//         let newC = (mX < this.canvasSize) ? Math.floor(mX / this.cellSize) : -1;
//         let mouseChanged = false; // Condition to see if mouse has changed position since last call
//         if (newR != this.mouse.r) {
//             this._mouse.r = newR;
//             mouseChanged = true;
//         }
//         if (newC != this.mouse.c) {
//             this._mouse.c = newC;
//             mouseChanged = true;
//         }

//         // if (mouseChanged) {
//         //     this.updateCurrentMoves();
//         // }
//         return mouseChanged;
//     }

//     clickHandler() {
//         if (!this.mouse.checkVector()) {
//             return;
//         }

//         let pieceAimed = this.grid[this.mouse.r][this.mouse.c];

//         if (pieceAimed == ChessBoard.EMPTYCELL) {
//             this.pieceLocked = null;
//             console.info("focus lost");
//             return;
//         }
        
//         if (!this.pieceLocked) { // if looking for a piece to select
//             if (pieceAimed.team == this.turn) {
//                 // if selecting a piece from the team that plays now
//                 this.pieceLocked = pieceAimed;
//                 console.log("click");
//                 console.log(pieceAimed.vector)
//             }
            
//         }
//         else { // If piece selected
//             // if pieceAimed is in valid spots
//                 // move
//         }
//     }

    
    
//     // TOOLS
//     static vectorInPossibleMoves(v, moves) {
//         let move, movesIte = this.movesIterator(moves);
//         do {
//             move = movesIte.next();
//             if (move.done) {
//                 return false;
//             }
//             console.log(move.value)
//             if (ChessBoard.equalVectors(move.value, v)){
//                 return true;
//             }
//         } while (true)
//     }

//     /**
//      * Iterable with all the moves of the given moves object.
//      * @param {obj} moveObj object generated on a chessPiece.getMoves().
//      * @param {ChessBoard} board (optional) the board assigned to these moves.
//      * @returns Iterable with the moves
//      */
//     static *movesIterator(moveObj, board=null) {
//         if (!board) {
//             board = ChessBoard;
//         }
//         for (let move of moveObj.moves) { // for each possible move of the current cell
//             for (let i = 1; i <= move[1]; i++) { // for each amount
//                 yield board.createVector(
//                     moveObj.piece.vector.r + i * move[0].r,
//                     moveObj.piece.vector.c + i * move[0].c
//                 );
//             }
//         }
//     }
    
//     /**
//      * Iterable with all the moves of the given moves object.
//      * @param {obj} moveObj object generated on a chessPiece.getMoves()
//      * @returns Iterable with the moves
//      */
//     movesIterator(moveObj) {
//         return ChessBoard.movesIterator(moveObj, this);
//     }
    
    
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