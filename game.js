var canvas = document.getElementById("joguinho");
var ctx = canvas.getContext("2d");
//var mx = 0, my = 0

class BoardData{
    #board = [];
    constructor(){
        this.#board = [];
        this.clear();
    }
    getBoard(){
        return JSON.encode(this.#board);
    }
    get(x, y){
        return [...this.#board[x][y]];
    }
    add(val, x, y){
        if(this.#board[x][y].length < 3)
            this.#board[x][y].push(val);
        else throw "TowerOverflow";
    }

    #remove = function(x, y){
        if(this.#board[x][y].length > 0){
            return this.#board[x][y].pop();
        }
    }
    
    move(x1, y1, x2, y2){
        //Move (x1, y1) to (x2, y2)
        console.log(this.#board[x1][y1])
        let height = this.#board[x1][y1].length;
        if(height > 0){
            this.add(this.#board[x1][y1][height-1], x2, y2);
            this.#remove(x1, y1);
        }  
        else throw "TowerUnderflow";
    }
    replace(x1, y1, x2, y2){
        //Replace (x1, y1) with (x2, y2)
        let height = this.#board[x1][y1].length;
        if(height > 0){
            this.#remove(x1, y1);
            this.move(x2, y2, x1, y1);
        }
    }
    clear(){
        this.#board = [];
        for(var i=0; i<9; i++){
            this.#board[i] = []
            for(var j=0; j<9; j++){
                this.#board[i][j] = [];
            }
        }
    }
}

class VirtualBoard{
    #mousePos = {x:-1, y:-1}
    #highlight = {x:-1, y:-1}
    #selectedPiece = null
    constructor(){
        this.board = new BoardData();
        this.#initboard();
    }
    setMousePos(pos){
        this.#mousePos.x = (pos.x);
        this.#mousePos.y = (pos.y);
    }
    processClick(pos){
        if(this.#selectedPiece===null){
            if(pos.x > 50 && pos.x < 590 && pos.y > 50 && pos.y < 590){
                this.#highlight.x = Math.floor((pos.x-50)/60);
                this.#highlight.y = Math.floor((pos.y-50)/60);
                let tower = this.board.get(this.#highlight.x, this.#highlight.y);
                if(tower.length>0)
                    this.#selectedPiece = tower[tower.length-1];
                console.log(this.#highlight)
            }
            else{
                this.#highlight.x = -1;
                this.#highlight.y = -1;
                this.#selectedPiece = null
            }
        }
        else{
            if(pos.x > 50 && pos.x < 590 && pos.y > 50 && pos.y < 590){
                let newx = Math.floor((pos.x-50)/60);
                let newy = Math.floor((pos.y-50)/60);
                let tower = this.board.get(newx, newy);
                if(tower.length==0){
                    this.board.move(this.#highlight.x, this.#highlight.y, newx, newy);
                }
                else{
                    this.board.replace(newx, newy, this.#highlight.x, this.#highlight.y)
                }
            }
            this.#highlight.x = -1;
            this.#highlight.y = -1;
            this.#selectedPiece = null
        }
    }
    #initboard = function(){
        //Use exclusivelly for inserting 
        //pieces on the board for the purpose of debugging
        
        this.board.add('BC', 0, 6);
        this.board.add('BC', 1, 6);
        this.board.add('BGC', 2, 7);
        this.board.add('BSH', 2, 6);
        
        this.board.add('BP', 3, 6);
        this.board.add('BP', 4, 6);
        this.board.add('BS', 5, 6);
        this.board.add('BP', 5, 6);
        
        this.board.add('BGG', 3, 7);
        this.board.add('BL', 3, 7);
        this.board.add('BL', 3, 7);
        this.board.add('BK', 4, 8);
        
        this.board.add('BCG', 7, 6);
        this.board.add('BSH', 7, 6);
        this.board.add('BP', 8, 6);
        this.board.add('BS', 7, 7);
        this.board.add('BB', 8, 8);

        this.board.add('WP', 0, 1);
        this.board.add('WCG', 0, 1);
        this.board.add('WP', 1, 2);
        this.board.add('WS', 1, 2);
        this.board.add('WC', 2, 2);
        this.board.add('WP', 2, 0);
        this.board.add('WCC', 2, 0);
        this.board.add('WL', 2, 0);
        this.board.add('WP', 3, 2);
        this.board.add('WSH', 4, 2);
        this.board.add('WP', 5, 2);
        this.board.add('WB', 3, 1);
        this.board.add('WGC', 3, 1);
        this.board.add('WR', 4, 1);
        this.board.add('WB', 5, 1);
        this.board.add('WGC', 5, 1);
        this.board.add('WK', 4, 0);
        this.board.add('WP', 6, 0);
        this.board.add('WCC', 6, 0);
        this.board.add('WL', 6, 0);
        this.board.add('WC', 6, 2);
        this.board.add('WP', 7, 2);
        this.board.add('WS', 7, 2);
        this.board.add('WP', 8, 1);
        this.board.add('WCG', 8, 1);
        
    }
    #drawRect = function(x, y, w, h, fill="#FF9999"){
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.closePath();
    }
    #drawImage = function(id, x, y, w=60, h=60){
        let img = document.getElementById(id)
        ctx.drawImage(img, x, y, w, h)
    }
    #write = function(val, x, y, fnt="12px Arial", fill="#222222"){
        ctx.fillStyle = fill;
        ctx.font = fnt;
        ctx.fillText(val, x, y);
    }
    draw(){
        let coordx = Math.floor((this.#mousePos.x-50)/60);
        let coordy = Math.floor((this.#mousePos.y-50)/60);
        
        //Actual Board
        this.#drawRect(50, 50, 540, 540);

        //this.#write("("+this.#mousePos.x+","+this.#mousePos.y+")", 600, 300);
        //this.#write("("+coordx+","+coordy+")", 600, 350);
        if(this.#selectedPiece !== null)
            this.#write(this.#selectedPiece, 640, 300);

        //Highlights
        if(this.#mousePos.x > 50 && this.#mousePos.x < 590 && this.#mousePos.y > 50 && this.#mousePos.y < 590)
            this.#drawRect(50+60*coordx, 50+60*coordy, 60, 60, "#AAFFAA");
        
        if(this.#highlight.x>=0 && this.#highlight.y>=0)
            this.#drawRect(50+60*this.#highlight.x, 50+60*this.#highlight.y, 60, 60, "#FFFF9F")

        //Show Pieces
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                let values = this.board.get(i,j);
                let tot = values.length;
                if(tot!=0){
                    this.#drawImage(values[tot-1], 50+60*i, 50+60*j);
                    this.#write(tot, 102+60*i, 60+60*j);
                    if(coordx==i && coordy==j){
                        for(var k=tot-1; k>=0; k--){
                            this.#drawRect(640, 50+90*(tot-k-1), 90, 90);
                            //this.#write(values[k], 675, 112+90*(tot-k-1),"45px Arial");
                            this.#drawImage(values[k], 640, 50+90*(tot-k-1), 90, 90);
                        }
                    }
                }
            }
        }
    }
}
let gameBoard = new VirtualBoard();

class Game{

}

function getMousePos(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', function(evt){
    var pos = getMousePos(canvas, evt)
    gameBoard.setMousePos(pos);
    }, false);

canvas.addEventListener('click', function(evt){
    var pos = getMousePos(canvas, evt)
    gameBoard.processClick(pos);
    }, false);

function draw(){
    //Clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Draws the Board
    gameBoard.draw();
}
setInterval(draw, 10)


