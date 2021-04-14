//global variables
var grid = [];
var w, h;
var c = [];//colors
var imgs = {};
var locked = false;//to control focus on piece
var mX, mY;//current coord of mouse
var mXL, mXY;//coord of locked piece
var team = [[],[]];//team 1 and -1
var turn = -1;//1 => up(black), -1 => down(white)

var asking = false;//to control if making a question or not
var value = "";//to store answer

var btns = [];
var debugM = false;



function ask(q, ...r){
    asking = true;//to lock the drawing function
    value = "";//reset value
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
    $('#myDialog').dialog( 'option', 'position', [w, h] );
    $("#dialog").dialog("open");
}

function movePiece(startS, endS){//move piece with given spots
    if(startS.piece != undefined){
        endS.setPiece(startS.piece);
        startS.piece = undefined;
    }
}

function possibleMoves(spot){ //show movements with given spot
    let myTeam = spot.piece.team;
    let moves = debuggedMoves(spot);
    for(let i = 0; i < moves.length; i++){
        if(moves[i].piece != undefined){//empty spot
            if(moves[i].piece.team != myTeam){//enemy
                moves[i].show(c[3]);
            }
        }
        else{
            moves[i].show(c[2]);
        }
    }
}
function debuggedMoves(spot){
    let moves = spot.piece.getMoves();
    let trueSpots = [];
    for(let i = 0; i < moves.length; i++){
        if(moves[i].piece == undefined || moves[i].piece.team != spot.piece.team){
            //if spot empty or diferent team
            trueSpots.push(moves[i]);
        }
    }
    if(spot.piece.piece == "king"){
        //enemy condition
        let otherTeamI = (spot.piece.team == 1) ? 1 : 0;//return the other team index
        let enemyMoves = [];
        for(let i = 0; i < team[otherTeamI].length; i++){
            enemyMoves.push(...team[otherTeamI][i].getMoves());//add all moves of enemy
        }
        enemyMoves = [...new Set(enemyMoves)];//remove duplicates
        for(let i = 0; i < enemyMoves.length; i++){//filter trueSpots based on enemy
            for(let j = 0; j < trueSpots.length; j++){
                if(enemyMoves[i] == trueSpots[j]){
                    trueSpots.splice(j, 1);
                    break;
                }
            }
        }

        //castling (continue on mouseClicked())
        if(spot.x == 4 && (spot.y == 0 || spot.y == 7)){
            //right
            if(grid[7][spot.y].piece != undefined && grid[7][spot.y].piece.piece == "rook" &&//if rook in place
            grid[5][spot.y].piece == undefined && grid[6][spot.y].piece == undefined){//empty in between
                trueSpots.push(grid[6][spot.y]);
            }
            //left
            if(grid[0][spot.y].piece != undefined && grid[0][spot.y].piece.piece == "rook" &&//if rook in place
            grid[1][spot.y].piece == undefined && grid[2][spot.y].piece == undefined &&
            grid[3][spot.y].piece == undefined){//empty in between
                trueSpots.push(grid[2][spot.y]);
            }
        }

    }
    return trueSpots;
}

function setup() {
    createCanvas(400, 400);

    w = width / 8;
    h = height / 8;
    c = [color(213, 184, 144), color(114, 54, 26), color(255, 255, 0, 100), color(255,0,0, 200), color(0,0,100)];
    //c = whiteSpot, blackSpot, empty move, attack move, final destination

    //create grid:
    grid = new Array(8);
    for(let i = 0; i < 8; i++){
        grid[i] = new Array(8);
        for(let j = 0; j < 8; j++){
            grid[i][j] = new spot(i, j);
        }
    }

    //create pieces:
    let order = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    for(let i = 0; i < 8; i++){
        grid[i][0].setPiece(new piece(order[i], 1));
        grid[i][1].setPiece(new piece("pawn", 1));
        grid[i][6].setPiece(new piece("pawn", -1));
        grid[i][7].setPiece(new piece(order[i], -1));

        //add pices to team var
        team[0].push(grid[i][0].piece);
        team[0].push(grid[i][1].piece);
        team[1].push(grid[i][6].piece);
        team[1].push(grid[i][7].piece);
    }

    $(function() {//jquerry setup
        $( "#dialog" ).dialog({
            draggable: true,
            autoOpen : false,
            show : "blind",//animation
            hide: { effect: "drop", duration: 1000 },//animation
            buttons: []
        });
    });
}

function draw() {
    if(!asking){
        //draw grid => draw pieces
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                grid[i][j].show(c[(i + j) % 2]);
            }
        }
        if(locked){
            possibleMoves(grid[mXL][mYL]);
        }


        mX = (mouseX < width) ? Math.floor(mouseX / w) : -1;
        mY = (mouseY < height) ? Math.floor(mouseY / h) : -1;
        fill(255);
        if(debugM){
            text(("("+mX+", "+mY+")"), 200, 200);
        }
        if(mX > -1 && mY > -1){
            if(!locked){//if selecting piece
                if(grid[mX][mY].piece != undefined && turn == grid[mX][mY].piece.team){
                    possibleMoves(grid[mX][mY]);
                }
            }
            else{//if piece selected, select spot
                if(grid[mX][mY].c == c[2] || grid[mX][mY].c == c[3]){
                    grid[mX][mY].show(c[4]);
                }
                if(debugM){
                    text(grid[mX][mY].c + "", 200, 250);
                }
            }
        }
    }
}

function mouseClicked(){
    if(mX == -1 || mY == -1){ //if not valid position selected
        return
    }
    if(grid[mX][mY].c != c[4]){//if not searching final spot (if aiming piece to move)
        if(grid[mX][mY].piece != undefined && grid[mX][mY].piece.team == turn && debuggedMoves(grid[mX][mY]) != []){
            //if not aiming empty spot, piece from correct team and possible moves here != null,
            //lock spot and start aiming for the final destination
            locked = !locked;
            mXL = mX;
            mYL = mY;
        }
    }
    else{//if searching for final destination + click
        if(grid[mX][mY].piece != undefined){//if piece already there => attack
            let teamAttacked = (grid[mX][mY].piece.team == 1) ? 0 : 1;//team 1: 0, team 2: 1
            team[teamAttacked].splice(grid[mX][mY].piece,1);
        }
        movePiece(grid[mXL][mYL], grid[mX][mY]);//move piece
        locked = false;
        turn = (turn == 1) ? -1 : 1;
        if((mY == 0 || mY == 7) && grid[mX][mY].piece.piece == "pawn"){//if pawn in end
            ask("change pawn to?", "queen", "knight");
        }
        if(grid[mX][mY].piece.piece == "king"){
            if(mY == mYL && Math.abs(mX - mXL) == 2){//if horizontal move + length2-Move => castling
                movePiece(grid[(mX > 3) ? 7 : 0][mY], grid[Math.abs((mX > 3) ? 5 : 3)][mY]);
            }
        }
    }
}

function preload(){
    let types = ["W", "B"];
    let url = "https://cdn.jsdelivr.net/gh/Jkutkut/JS-Chess-Game";
    // let imgDirectory = "@master/img/";
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