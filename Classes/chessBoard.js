class ChessBoard {
    static COLORS = [
        [213, 184, 144],
        [114, 54, 26],
        // color(255, 255, 0, 100),
        // color(255,0,0, 200),
        // color(0,0,100)
    ];

    constructor(canvasSize) {
        this._canvasSize = canvasSize;
        this._cellSize = canvasSize / 8;

        this._grid = new Array(8);
        for(let i = 0; i < 8; i++){
            this._grid[i] = new Array(8);
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
        pop();
    }

    get cellSize() {
        return this._cellSize;
    }
}