//menu, playing, gameover
var status = 'menu';

var multi = false;

var map = [];
var width = 41;
var height = 41;

// millisecond/times
var speed = 100;

var cvs = document.getElementById('myCanvas');
var ctx = cvs.getContext('2d');

var player1;
var player2;

var logo = {
    15:[15, 17],
    17:[15, 17],
    19:[15, 17, 19, 21, 23, 25],
    21:[15, 17, 19, 21, 23, 25],
    23:[15, 17],
    25:[15, 17],
}

var number = [
    {
        18:[17, 18, 19, 20, 23],
        19:[17, 20, 23],
        20:[17, 20, 23],
        21:[17, 20, 23],
        22:[17, 20, 21, 22, 23],
    },
    {
        18:[17, 18, 19, 20],
        19:[20],
        20:[20],
        21:[20],
        22:[17, 18, 19, 20, 21, 22, 23],
    },
    {
        18:[17, 20, 23],
        19:[17, 20, 23],
        20:[17, 20, 23],
        21:[17, 20, 23],
        22:[17, 18, 19, 20, 21, 22, 23],
    },
    {
        18:[17, 20, 21, 22, 23],
        19:[17, 20, 23],
        20:[17, 20, 23],
        21:[17, 20, 23],
        22:[17, 18, 19, 20, 23],
    },
    {
        20:[17, 18, 19, 20, 21, 22, 23],
    },
]


snake = function (id, head, tail, body) {
    this.id = id;
    this.next = '';    
    // { x:positionX, y:positonY }
    this.head = head; 
    this.tail = tail;
    this.body = body;
}

snake.prototype.move = function () {
    var x = this.head.x;
    var y = this.head.y;
    var direct = this.next ? this.next : map[x][y];
    var next;
    
    switch (direct) {
        case 'up':
            if (y - 1 < 0) {
                return 'dead'
            }
            next = map[x][y - 1];
            map[x][y - 1] = 'up';
            this.head.y -= 1;
            break;

        case 'right':
            if (x + 1 > width - 1) {
                return 'dead'
            }
            next = map[x + 1][y];
            map[x + 1][y] = 'right';
            this.head.x += 1;
            break;

        case 'down':
            if (y + 1 > height - 1) {
                return 'dead'
            }
            next = map[x][y + 1];
            map[x][y + 1] = 'down';
            this.head.y += 1;
            break;

        case 'left':
            if (x - 1 < 0) {
                    return 'dead'
                }
            next = map[x - 1][y];
            map[x - 1][y] = 'left';
            this.head.x -= 1;
            break;

        default:
            return 'dead';
    }
    if (next == 'empty') {
        this.moveTail();
    }else if (next == 'food') {
        this.body += 1;
        map.createFood();
    }else {
        console.log(this.id + ' dead');
        return 'dead';
    }
}


snake.prototype.moveTail = function () {
    var x = this.tail.x;
    var y = this.tail.y;
    var direct = map[x][y];
    map[x][y] = 'empty';
    switch (direct) {
        case 'up':
            this.tail.y -= 1;
            break;
        case 'right':
            this.tail.x += 1;
            break;
        case 'down':
            this.tail.y += 1;
            break;
        case 'left':
            this.tail.x -= 1;
            break;
    }
}


map.createNewMap = function () {
    for (var c1 = 0; c1 < width; c1++) {
        this[c1] = [];
        for (var c2 = 0; c2 < height; c2++){
            this[c1][c2] = 'empty';
        }  
    }
}

map.createFood = function (data) {
    if (data) {
        this[data.x][data.y] = 'food';
    } else {
        var c1, c2;
        do {
            c1 = Math.floor(Math.random()*height);
            c2 = Math.floor(Math.random()*width);
        } while (map[c1][c2] != 'empty');
        this[c1][c2] = 'food';

        if (multi) {}
    }
}




function gameInit (data) {
    map.createNewMap(); 
    if (data) {
        for (i = 0; i < width; i++) {
            map[i] = data.map[i];
        }
        multi = true;
        status = 'playing';
        player2 = new snake({x:11, y:21}, {x:11, y:21});
        player1 = new snake({x:31, y:21}, {x:31, y:21});
        map[11][21] = 'up';
        map[31][21] = 'down';
        sendEvents({event: "initDone"});
        initDone();
    } else {
        // multi mod
        if (multi) {
            player1 = new snake({x:11, y:21}, {x:11, y:21});
            player2 = new snake({x:31, y:21}, {x:31, y:21});
            map[11][21] = 'up';
            map[31][21] = 'down';
            map.createFood();

            sendEvents({event: "gameInit", map: map});
        } 
        //singo mod
        else {
            player1 = new snake({x:21, y:21}, {x:21, y:21});
            map[21][21] = 'right';
            map.createFood();
        }
    }
}


function countdown(callback) {
    var i = 0;
    this.count = function () {
        showWords(number[i]);
        i ++;
        if (i >= number.length) {return true}
        else { setTimeout('count()',1000) }; 
    }
    this.count();
    // init player1
    setTimeout(callback, 5000);
}


function gameLoop () {
    var temp;
    temp = run();
    if (temp != 'gameOver') {
        setTimeout('gameLoop()', 1000/speed);
    } else {
        status = 'gameOver';
    }
}

function run () {
    if (!multi) {
        draw();
        return player1.moveHead();    
    } 
    else {
        draw();
        player1.moveHead();
        player2.moveHead();
        return 'playing';
    }
    
}














































function showWord(word) {
    for (var c1 = 0; c1 < width; c1++) {
        for (var c2 = 0; c2 < height; c2 ++) {
            if (c1 in words && words[c1].indexOf(c2) != -1) {
                ctx.fillStyle = 'white';
                ctx.fillRect(c1*15, c2*15, 14, 14);
            }
            else {
                ctx.fillStyle = 'black';
                ctx.fillRect(c1*15, c2*15, 14, 14);   
            }
        }
    }
}

function draw () {
    for (var c1 = 0; c1 < width; c1++) {
        for (var c2 = 0; c2 < height; c2 ++) {
            if (map[c1][c2] == 'empty') {
                ctx.fillStyle = 'black';
                ctx.fillRect(c1*15, c2*15, 14, 14);
            }else {
                ctx.fillStyle = 'white';
                ctx.fillRect(c1*15 , c2*15, 14, 14);
            }
        }
    }
}








var events = {};

events.poolRegist;

events.createFood;
events.dead;
events.nextDirect;




events.connectReq = connectReq;
events.gameInit = gameInit;
events.initDone = initDone;
events.changeDir = changeDir;