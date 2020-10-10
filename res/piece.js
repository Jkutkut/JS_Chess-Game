function piece(p, t) {
    this.piece = p; //"rook", "king"...
    this.x = 0; //spot gives it
    this.y = 0; //spot gives it
    this.team = t; //+-1


    this.set = function(x, y) {
        this.x = x;
        this.y = y;
    }

    this.getMoves = function() {
        var moves = [];
        var dX, dY, cx, cy; //d(XY) -> direction in X or Y; c(xy) -> coord in x or y
        switch (this.piece) {
            case "pawn":
                if ((this.y + this.team >= 0 && this.y + this.team < 8) &&
                (grid[this.x][this.y + this.team].piece == undefined)) {
                    moves.push(grid[this.x][this.y + this.team]);

                    if (this.y + 2.5 * this.team == 3.5 &&
                    grid[this.x][this.y + 2 * this.team].piece == undefined) {
                        //if first move, double foward: (0 based index) 
                        //it uses empty spot in +1Pos && dist to half grid (4)
                        moves.push(grid[this.x][this.y + 2 * this.team]);
                    }
                }
                //attack
                for (let i = -1; i < 2; i = i + 2) { //for x
                    //console.log((this.x + i) + ", "+ (this.y + this.team));
                    if ((this.y + this.team >= 0 && this.y + this.team < 8) &&
                    (this.x + i >= 0 && this.x + i < 8) &&
                    (grid[this.x + i][this.y + this.team].piece != undefined)) {
                        moves.push(grid[this.x + i][this.y + this.team]);
                    }
                }
                break;
            case "bishop":
            for (let i = 1; i <= 2; i++) {
                for (let j = 1; j <= 2; j++) {
                    dX = Math.pow(-1, i);
                    dY = Math.pow(-1, j);
                    for (let w = 1; w <= 8; w++) {
                        cx = this.x + w * dX;
                        cy = this.y + w * dY;
                        if (cx >= 0 && cx < 8 && cy >= 0 && cy < 8) {
                            moves.push(grid[cx][cy]);
                            if (grid[cx][cy].piece != undefined) { //if a piece in the way
                                break; //stop in this direction
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
            break;
            case "knight":
                let knightMoves = [
                    [-1, 2],//1L 2U
                    [1, 2],//1R 2U
                    [2, 1],//2R 1U
                    [2, -1],//2R 1D
                    [-1, -2],//1L 2D
                    [1, -2],//1R 2D
                    [-2, -1],//2L 1D
                    [-2, 1]//2L 1U
                ];
                for (let i = 0; i < knightMoves.length; i++) {
                    if (this.x + knightMoves[i][0] >= 0 && this.x + knightMoves[i][0] < 8 &&
                    this.y + knightMoves[i][1] >= 0 && this.y + knightMoves[i][1] < 8) {
                        moves.push(grid[this.x + knightMoves[i][0]][this.y + knightMoves[i][1]]);
                    }
                }
            break;
            case "rook":
                let rookMoves = [
                    [-1, 0],
                    [0, -1],
                    [1, 0],
                    [0, 1]
                ];
                for (let i = 0; i < 4; i++) {
                    for (let w = 1; w <= 8; w++) {
                        cx = this.x + w * rookMoves[i][0];
                        cy = this.y + w * rookMoves[i][1];
                        if (cx >= 0 && cx < 8 && cy >= 0 && cy < 8) {
                            moves.push(grid[cx][cy]);
                            if (grid[cx][cy].piece != undefined) { //if a piece in the way
                                break; //stop in this direction
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            case "queen":
                let r = new piece("rook", 1);
                r.set(this.x, this.y);
                let s = new piece("bishop", 1);
                s.set(this.x, this.y);
                moves.push(...r.getMoves());
                moves.push(...s.getMoves());
                break;
            case "king":
                let kingMoves = [
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [-1, 1],
                    [-1, 0]
                ];
                for (let i = 0; i < 8; i++) {
                    if (this.x + kingMoves[i][0] >= 0 && this.x + kingMoves[i][0] < 8 &&
                    this.y + kingMoves[i][1] >= 0 && this.y + kingMoves[i][1] < 8) {
                        moves.push(grid[this.x + kingMoves[i][0]][this.y + kingMoves[i][1]]);
                    }
                }
                break;
        }

        return moves;
    }





    this.show = function() {

    /*fill(color(0,255,255));
    rect(0, 0, w, h);
    fill(color(0,0,255));
    rect(w / 2, 0, w / 2, h);
    */
    //noStroke();
    //fill((this.team == 1) ? colorT[0] : colorT[1]);

    let sX = this.x * w;
    let sY = this.y * h;

    switch (this.piece) {
        case "rook":
            if(this.team == 1){
                image(imgs.rookB, sX, sY, w, h);
            }
            else{
                image(imgs.rookW, sX, sY, w, h);          
            }
            break;
        case "knight":
            if(this.team == 1){
                image(imgs.knightB, sX, sY, w, h);
            }
            else{
                image(imgs.knightW, sX, sY, w, h);          
            }
            break;
        case "bishop":
            if(this.team == 1){
                image(imgs.bishopB, sX, sY, w, h);
            }
            else{
                image(imgs.bishopW, sX, sY, w, h);          
            }
            break;
        case "king":
            if(this.team == 1){
                image(imgs.kingB, sX, sY, w, h); 
            }
            else{
                image(imgs.kingW, sX, sY, w, h); 
            }
            break;
        case "queen":
            if(this.team == 1){
                image(imgs.queenB, sX, sY, w, h); 
            }
            else{
                image(imgs.queenW, sX, sY, w, h); 
            }
            break;
        case "pawn":
            if(this.team == 1){
                image(imgs.pawnB, sX, sY, w, h); 
            }
            else{
                image(imgs.pawnW, sX, sY, w, h); 
            }
            break;
        }
        //filter(INVERT);
    }
}