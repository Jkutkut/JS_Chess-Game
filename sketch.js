var mainCanvasSize = 400;
var cellSize;

var chessBoard;

function setup() {
    createCanvas(mainCanvasSize, mainCanvasSize);

    cellSize = mainCanvasSize / 8;
    

    chessBoard = new ChessBoard(mainCanvasSize);
    noStroke();
}

function draw() {
    // background(0);
    chessBoard.show();
    noLoop();
}