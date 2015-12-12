// setting
// 
// status -> menu, playing, gameOver
// 
// role -> undefined, host, client
// 
// 
var status = 'menu';
var role = '';

var map = [];
var width = 41;
var height = 41;

var colors = {wall:'#ff7834', food:'#3d41ca', body:'#fff', empty:'#000'};

var moveTime = 100;
var timer;

var again = false;

var cvs = document.getElementById('myCanvas');
var ctx = cvs.getContext('2d');

var player1, player2;

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

/*********************** snake *************************/

snake = function (head, tail, body) {
    this.next = '';
    this.head = head;
    this.tail = tail;
    this.body = body || 1;
}

snake.prototype.move = function () {
    var x = this.head.x;
    var y = this.head.y;
    var direct = this.next ? this.next : map[x][y];
    var next = '';
    map[x][y] = direct;
    
    switch (direct) {
        case 'up':
            if (y - 1 < 0) { return true; };
            next = map[x][y - 1];
            map[x][y - 1] = 'up';
            this.head.y -= 1;
            break;

        case 'left':
            if (x - 1 < 0) { return true; };
            next = map[x - 1][y];
            map[x - 1][y] = 'left';
            this.head.x -= 1;
            break;

        case 'right':
            if (x + 1 > width - 1) { return true; };
            next = map[x + 1][y];
            map[x + 1][y] = 'right';
            this.head.x += 1;
            break;

        case 'down':
            if (y + 1 > height - 1) { return true; };
            next = map[x][y + 1];
            map[x][y + 1] = 'down';
            this.head.y += 1;
            break;

        default:
            return true;;
    }

    if (next == 'empty') {
        this.moveTail();
    }else if (next == 'food') {
        this.body += 1;
        map.createFood();
    }else {
        console.log('gameOver')
        return true;
    }
}


snake.prototype.moveTail = function () {
    var x = this.tail.x;
    var y = this.tail.y;
    var tail_direct = map[x][y];
    map[x][y] = 'empty';
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

/******************** game array **********************/

map.createNewMap = function (wall) {
    for (var c1 = 0; c1 < width; c1++) {
        this[c1] = [];
        for (var c2 = 0; c2 < height; c2++){
            if (wall && wall[c1] 
                && (wall[c1].indexOf(c2) != -1)) {
                this[c1][c2] = 'wall';
            } else {
                this[c1][c2] = 'empty';    
            }
        }  
    }
}

map.createFood = function (data) {
    if (data) {
        map[data.x][data.y] = 'food';
        console.log(data);
    } 
    else if (role == 'host') {
        do {
            var c1 = Math.floor(Math.random()*height);
            var c2 = Math.floor(Math.random()*width);
        } while (map[c1][c2] != 'empty');
        
        this[c1][c2] = 'food';
        sendEvents({event:'createFood', x:c1, y:c2})
    } 
    if (!role) {
         do {
            var c1 = Math.floor(Math.random()*height);
            var c2 = Math.floor(Math.random()*width);
        } while (map[c1][c2] != 'empty');
        
        this[c1][c2] = 'food';
    } 
}

/*********************** draw **************************/

function showWords(words) {
    for (var c1 = 0; c1 < width; c1++) {
        for (var c2 = 0; c2 < height; c2 ++) {
            if (c1 in words && words[c1].indexOf(c2) != -1) {
                ctx.fillStyle = 'white';
                ctx.fillRect(c1*14, c2*14, 13, 13);
            }
            else {
                ctx.fillStyle = 'black';
                ctx.fillRect(c1*14, c2*14, 13, 13);   
            }
        }
    }
}

function draw () {
    for (var c1 = 0; c1 < width; c1++) {
        for (var c2 = 0; c2 < height; c2 ++) {
            switch (map[c1][c2]) {
                case 'empty':
                    ctx.fillStyle = colors.empty; break;
                case 'food':
                    ctx.fillStyle = colors.food;  break;
                case 'wall':
                    ctx.fillStyle = colors.wall;  break;
                default:
                    ctx.fillStyle = colors.body;  break;
            }
            ctx.fillRect(c1*14, c2*14, 13, 13);
        }
    }
}

/******************* keypress event **********************/

document.onkeydown = keyevent;
function keyevent () {

    if (status == 'playing') {
        var x = player1.head.x;
        var y = player1.head.y;
        var dir = map[x][y];
        var next;
        // right
        if (event.keyCode == 39 && dir != 'left' && !player1.next) {
            next = 'right';
        }
        // left
        else if (event.keyCode == 37 && dir != 'right' && !player1.next) {
            next = 'left';
        }
        // up
        else if (event.keyCode == 38 && dir != 'down' && !player1.next) {
            next = 'up';
        }
        // down
        else if (event.keyCode == 40 && dir != 'up' && !player1.next) {
            next = 'down';
        }

        if (next) {
            clearTimeout(timer);
            changeDir(next, true);
            if (role) {
                sendEvents({
                    event: 'changeDir',
                    dir: next,
                });
            }
        }
    }
    if (status == 'gameOver') {
        // enter
        if (event.keyCode == 13) {
            showWords(logo);
            narrow();
            status = 'menu';
        }
    }
}

function changeDir (data, myself) {
    if (myself) {
        player1.next = data;   
        
        if (role) {
            sendEvents({
                event: 'changeDir',
                dir: data,
            });
        }    
    } else {
        player2.next = data.dir;
    }

    if (role) {
        if (player1.next && player2.next) {
            run();
        }
    } else {
        if (player1.next) {
            run();
        }
    }
}

function singoModStart () {
    role = '';
    status = 'playing';
    gameInit();
    countdown(run);
}

function multiModStart () {
    role = 'host';
    status = 'playing';
    gameInit();
}


function gameInit (data) {
    map.createNewMap(logo); 
    if (!data) {
        // multi mod
        if (role == 'host') {
            player1 = new snake({x:11, y:21}, {x:11, y:24});
            player2 = new snake({x:31, y:21}, {x:31, y:18});
            map[11][21] = 'up';
            map[11][22] = 'up';
            map[11][23] = 'up';
            map[11][24] = 'up';
            map[31][21] = 'down';
            map[31][20] = 'down';
            map[31][19] = 'down';
            map[31][18] = 'down';
            map[20][20]= 'food';

            sendEvents({event: "gameInit", map: map});
            // map.createFood();
        } 
        // singo mod
        else {
            console.log('init game')
            player1 = new snake({x:20, y:21}, {x:20, y:24});
            map[20][21] = 'up';
            map[20][22] = 'up';
            map[20][23] = 'up';
            map[20][24] = 'up';
            map.createFood();
        }
    }
    else {
        // map = data.map;
        for (i = 0; i < width; i++) {
            map[i] = data.map[i];
        }
        role = 'client';
        status = 'playing';
        player2 = new snake({x:11, y:21}, {x:11, y:24});
        player1 = new snake({x:31, y:21}, {x:31, y:18});

        sendEvents({event: "initDone"});
        initDone();
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


function run () {
    if (!role) {
        draw();
        var gameOver = player1.move();
        if (gameOver) {
            status = 'gameOver';
            $('#enter').show();
            return 0;
        }
        player1.next = '';    
    } 
    else {
        draw();
        var g1 = player1.move();
        var g2 = player2.move();
        // check both status  
        if (g1 || g1 ) {
            status = 'gameOver';
            $('#enter').show();
            sendEvents({event: 'gameOver'});
            return 0;
        }
        player1.next = '';
        player2.next = '';
    }

    clearTimeout(timer);
    timer = setTimeout(
        'changeDir(map[player1.head.x][player1.head.y], true)',
        moveTime );
}


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
        sendEvents({event: "connectReq", id: your_peer_id});
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
        multiModStart();
    });
}

function initDone () {
    countdown(run);
    expand();
}

function gameOver () {
    $('#enter').show();
    status = 'gameOver';
}

function restart () {
    if (again && role == 'host') {
        status = 'playing';
        expand();
        return gameInit();
    }
    if (role == 'client') {
        sendEvents({event: 'restart'})
    }
    again = true;
}


/****************** UI control ********************/

$(document).ready(function () {
    showWords(logo);
    connectInit();

    $('.menu-item').hide();
    $('.menu-main').show();
    
    $('#singo').on('click', function () {
        expand();
        singoModStart();
    })   
    $('#multi').on('click', function () {
        if (!another_peer_id) {
            $('.menu-main').hide();
            $('.menu-multi, #back').show();
            $('#another_number').focus();    
        } else {
            $('#another_peer_id').text(another_peer_id);
            $('.menu-main').hide();
            $('#again, #back').show();
            console.log('XD');
            restart();
        }
    })
    
    $('#back').on('click', function () {
        $('.menu-item').hide();
        $('.menu-main').show();
    })
})

function expand () {
    $('.menu-item').hide();
    $('#canvasBox').animate({
        width: '574',
        height: '574',
    }, 800);
    $('canvas').animate({
        top: '0',
        left: '0',
    }, 800);
}

function narrow () {
    $('#canvasBox').animate({
        width: '224',
        height: '224',
    }, 800);
    $('canvas').animate({
        top: '-175',
        left: '-175',
    }, 800);
    $('#enter').hide();
    $('#forTitan, #back').show();
}

 
var listener = {};

listener.connectReq = connectReq;
listener.gameInit = gameInit;
listener.initDone = initDone;
listener.changeDir = changeDir;
listener.createFood = map.createFood;
listener.gameOver = gameOver;
listener.restart = restart;
