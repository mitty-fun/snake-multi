$(document).ready(function () {
    $('.menu-multi, #back, #end').hide();
    $('#singo').on('click', expand)
    $('#multi').on('click', function () {
        $('.menu-main').hide();
        $('.menu-multi, #back').show();
        $('#another_number').focus();
    })
    $('#back').on('click', function () {
        $('.menu-multi, #back, #end').hide();
        $('.menu-main').show();
    })
})

function expand () {
    $('.menu-item, .menu-multi').hide();
    $('#canvasBox').animate({
            width: '615',
            height: '615',
        }, 800);
        $('canvas').animate({
            top: '0',
            left: '0',
        }, 800);
    
    gameInit();
    countdown(clock);
    status = 'playing';
}

function narrow () {
    $('#canvasBox').animate({
        width: '240',
        height: '240',
    }, 800);
    $('canvas').animate({
        top: '-187.5',
        left: '-187.5',
    }, 800);
    $('#end, #back').show();
    showWords(logo);
}