function spot(x, y){
  this.x = x;
  this.y = y;
  this.c;//color
  this.piece = undefined;
  
  this.setPiece = function(piece){
    piece.set(this.x, this.y);
    this.piece = piece;
    
    
  }
  
  this.show = function(color){
    this.c = color;
    noStroke();
    fill(color);
    rect(this.x * w, this.y * h, w, h);
    if(this.piece != undefined){//if it has a pice, show it
      this.piece.show();
    }
  }
}