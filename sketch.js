var mainCanvasSize = 400;
var cellSize;

var chessBoard;
var imgs = {};

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


function preload(){
    let types = ["W", "B"];
    let url = "https://cdn.jsdelivr.net/gh/Jkutkut/JS-Chess-Game";
    let imgDirectory = "@442c044119dd754b10617a7efd4816e5da3cd58e/res/img/";
    let piezas = [
        "bishop",
        "rook",
        "knight",
        "queen",
        "king",
        "pawn"
    ];
    let imgFormat = ".png";

    url += imgDirectory;
    for (let t = 0; t < 2; t++) { // for each type (White and black)
        let currentType = types[t];
        for (let p = 0; p < 6; p++) {
            imgs[piezas[p] + currentType] = loadImage(
                url + currentType + "-" + piezas[p] + imgFormat
            );
        }
    }
}