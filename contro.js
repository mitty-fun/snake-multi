$(document).ready(function () {
    $('.menu-multi, #back').hide();
    $('#singo').on('click', function () {
        $('.menu, .menu-multi').hide();
        $('#canvasBox').animate({
                width: '615',
                height: '615',
            }, 800)
            $('canvas').animate({
                top: '0',
                left: '0',
            }, 800)
        count(gameInit);
        gameStatus = 'gameing';
    })
    $('#multi').on('click', function () {
        $('.menu').hide();
        $('.menu-multi').show();
        $('#another_number').focus();
    })
    $('#back').on('click', function () {
        $('.menu-multi').hide();
        $('.menu').show();
    })
})
