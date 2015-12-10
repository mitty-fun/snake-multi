var status = 'menu';
var multi = false;
var map = [];
var width = 41;
var height = 41;
var speed = 13;

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


document.onkeydown = keyevent;
function keyevent () {
    // console.log(event.keyCode)
    if (status == 'playing') {
        // right
        var dir = map[player1.head.x][player1.head.y];
        if (event.keyCode == 39 && dir != 'left') {
            map[player1.head.x][player1.head.y] = 'right';
        }
        // left
        else if (event.keyCode == 37 && dir != 'right') {
            map[player1.head.x][player1.head.y] = 'left';
        }
        // up
        else if (event.keyCode == 38 && dir != 'down') {
            map[player1.head.x][player1.head.y] = 'up';
        }
        // down
        else if (event.keyCode == 40 && dir != 'up') {
            map[player1.head.x][player1.head.y] = 'down';
        }
    }
    if (status == 'gameover') {
        // enter
        if (event.keyCode == 13) {
            narrow();
            status = 'menu';
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


function gameInit (data) {
    map.createNewMap(); 
    if (!data) {
        // multi mod
        if (multi) {
            player1 = new snake({x:11, y:21}, {x:11, y:21});
            map[11][21] = 'top';
            player2 = new snake({x:31, y:21}, {x:31, y:21});
            map[11][21] = 'down';
            map.createFood();
            map[0][0] = 'XDDD';

            sendEvents({"event": "gameInit", map: map});
        } 
        //singo mod
        else {
            player1 = new snake({x:11, y:21}, {x:11, y:21});
            map[11][21] = 'right';
        }
    }
    else {
        for (i = 0; i < width; i++) {
            map[i] = data.map[i];
        }
        sendEvents({event: "clock"});
    }
    map.createFood();
}


function clock () {
    var temp;
    temp = run();
    if (temp != 'gameOver') {
        setTimeout('clock()', 1000/speed);
    } else {
        status = 'gameover';
    }
}

function run () {
    draw();
    return player1.moveHead();
}


/******************** game array **********************/

map.createNewMap = function () {
    for (var c1 = 0; c1 < width; c1++) {
        this[c1] = [];
        for (var c2 = 0; c2 < height; c2++){
            this[c1][c2] = 'empty';
        }  
    }
}


map.createFood = function () {
    do {
        var c1 = Math.floor(Math.random()*height);
        var c2 = Math.floor(Math.random()*width);
    } while (map[c1][c2] != 'empty');
    this[c1][c2] = 'food';
}

/*********************** snake *************************/

snake = function (head, tail) {
    this.head = {x: head.x, y: head.y};
    this.tail = {x: tail.x, y:tail.y};
    this.body = 1;
}

snake.prototype.moveHead = function () {
    var direct = map[this.head.x][this.head.y];
    var x = this.head.x;
    var y = this.head.y;
    var next = '';
    
    switch (direct) {
        case 'up':
            if (y - 1 < 0) {
                return 'gameOver'
            }
            next = map[x][y - 1];
            map[x][y - 1] = 'up';
            this.head.y -= 1;
            break;

        case 'right':
        if (x + 1 > width - 1) {
                return 'gameOver'
            }
            next = map[x + 1][y];
            map[x + 1][y] = 'right';
            this.head.x += 1;
            break;

        case 'down':
        if (y + 1 > height - 1) {
                return 'gameOver'
            }
            next = map[x][y + 1];
            map[x][y + 1] = 'down';
            this.head.y += 1;
            break;

        case 'left':
            if (x - 1 < 0) {
                    return 'gameOver'
                }
            next = map[x - 1][y];
            map[x - 1][y] = 'left';
            this.head.x -= 1;
            break;

        default:
            return 'gameOver';
    }
    if (next == 'empty') {
        this.moveTail();
    }else if (next == 'food') {
        this.body += 1;
        map.createFood();
    }else {
        console.log('gameOver')
        return 'gameOver';
    }
}


snake.prototype.moveTail = function () {
    var tail_direct = map[this.tail.x][this.tail.y];
    map[this.tail.x][this.tail.y] = 'empty';
    switch (tail_direct) {
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


/*********************** draw **************************/
function showWords(words) {
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


showWords(logo);
console.log('stop')


/************************ connect *************************/

var your_peer_id;
var another_peer_id;
var peer;
var conn;


function connectInit () {
    // generate your ID number  0 ~ 999999
    your_peer_id = Math.floor(Math.random()*1000000).toString();
    console.log('your ID number: ' + your_peer_id);
    
    // show your ID number
    $('#your_number').text(your_peer_id);
    
    // input another ID number keypress "enter" to send request connect 
    $('#another_number').keypress(function(e) {
        code = e.keyCode ? e.keyCode : e.which;
        if(code == 13) {
            another_peer_id = $(this).val();
            $(this).val('');
            connect();
        }
    });

    // peerAPI key ->> ravoxvbzqf2sm7vi
    peer = new Peer(your_peer_id, {key:'ravoxvbzqf2sm7vi'});
    
    peer.on('connection', function(conn) {
        conn.on('data', function(data) {
            //data is JSON
            handleEvents(data);
        });
    });
}

function connect () {
    // connect another id
    console.log('connect to: ' + another_peer_id);
    conn = peer.connect(another_peer_id);
    
    // setting listen
    conn.on('open', function(){
        conn.send('{"event":"connectReq","id":' + your_peer_id + '}');
    });

}

function handleEvents (data) {
    var json = JSON.parse(data);
    console.log(json);
    var eventName = json.event;
    listener[eventName](json);
}

function sendEvents (data) {
    conn.send(JSON.stringify(data));
}


function connectReq (data) {
    // two-way connect
    another_peer_id = data.id;
    console.log('connect to: ' + another_peer_id);
    conn = peer.connect(another_peer_id);
    conn.on('open', function(){
        // both start in to role choose
        // conn.send('{"event":"startGame"}');
        multi = true;
        gameInit();
    });
}

function startGame () {
    expand();
}

var listener = {};
listener.connectReq = connectReq;
listener.gameInit = gameInit;
listener.startGame = startGame;


connectInit();