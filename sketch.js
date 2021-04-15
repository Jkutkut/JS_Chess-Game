var mainCanvasSize = 800;
var cellSize;

var chessBoard;
var imgs = {};

// FUNCTIONS

function ask(q, ...r){
    asking = true;//to lock the drawing function
    value = "";//reset value
    $("#dialog").dialog();
    $("#dialog").dialog( "option", "title", q);
    btns = [];
    for(let i = 0; i < r.length; i++){
        btns.push({
            text: r[i],
            click: function() {
                asking = false;
                value = r[i];
                grid[mX][mY].setPiece(new piece(value, grid[mX][mY].piece.team));
                $(this).dialog("close");
            }
        });
    }
    $("#dialog").dialog("option", "buttons", btns); // setter
    $('#myDialog').dialog( 'option', 'position', [mainCanvasSize, mainCanvasSize] );
    $("#dialog").dialog("open");
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
