$(document).ready(function() {

    // index
    $('.quadrant0, .quadrant2').tooltip({
        container: 'body',
        placement: 'left',
        delay: {show: 500}
    });
    $('.quadrant1, .quadrant3').tooltip({
        container: 'body',
        placement: 'right',
        delay: {show: 500}
    });
    $('#intromodal').modal();

    // bloques
    $('.chk-bloque-ninguno').hide();

    $('.bloques').on('click', '.chk-bloque', function() {
        if(resetChecksBloques($('.chk-bloque:checked').length))
            return;
        $('.chk-bloque-ninguno').show();
        var bloque = $(this).val();
        if($(this).is(':checked'))
            checkBlock(bloque);
        else
            $('.bloque' + bloque).addClass('circle-blur').removeClass('circle-focus');
    });

    $('.bloques').on('click', '.chk-bloque-ninguno', function() {
        resetChecksBloques(0);
    });

    // diputados
    $('.chk-diputado-ninguno').hide();

    $('.diputados').on('click', '.chk-diputado', function() {
        if(resetChecksCongressmen($('.chk-diputado:checked').length))
            return;
        $('.chk-diputado-ninguno').show();
        var diputado = $(this).val();
        if($(this).is(':checked'))
            checkCongressman(diputado);
        else
            $('#d' + diputado).addClass('circle-blur').removeClass('circle-focus');
    });

    $('.diputados').on('click', '.chk-diputado-ninguno', function() {
        resetChecksCongressmen(0);
    });

    // tabs
    $('.container').on('click', '.tab-btn', function() {
        if(!$(this).parent('li').hasClass('active')) {
            $('circle').removeClass('circle-blur circle-focus');
            $('.chk-bloque:checked').removeAttr('checked');
            $('.chk-diputado:checked').removeAttr('checked');
            $('.chk-bloque-ninguno').hide();
            $('.chk-diputado-ninguno').hide();
        }
    });
});

function checkBlock(bloque) {
    $('.bloque' + bloque).addClass('circle-focus');
    $('circle').not('.bloque' + bloque + ' circle-focus').addClass('circle-blur');
}
function checkCongressman(diputado) {
    $('#d' + diputado).addClass('circle-focus');
    $('circle').not('#d' + diputado + ' circle-focus').addClass('circle-blur');
}

var blocksChecked;
function getCheckedBlocks() {
    blocksChecked = [];
    $('.chk-bloque:checked').each(function() {
        blocksChecked.push($(this).val());
    });
}
function setCheckedBlocks() {
    if(congressmenChecked.length + blocksChecked.length == 0) {
        resetChecksBloques(0);
        return;
    }
    if(blocksChecked.length == 0)
        return;
    nBlocks = blocksChecked.length;
    for(var v in blocksChecked) {
        if($('.chk-bloque[value="' + blocksChecked[v] + '"]').length) {
            $('.chk-bloque[value="' + blocksChecked[v] + '"]').attr('checked', 'checked');
            checkBlock(blocksChecked[v]);
        }
        else
            nBlocks--;
    }
    resetChecksBloques(nBlocks);
}

var congressmenChecked;
function getCheckedCongressmen() {
    congressmenChecked = [];
    $('.chk-diputado:checked').each(function() {
        congressmenChecked.push($(this).val());
    });
}
function setCheckedCongressmen() {
    if(congressmenChecked.length + blocksChecked.length == 0) {
        resetChecksCongressmen(0);
        return;
    }
    if(congressmenChecked.length == 0)
        return;
    nCongressmen = congressmenChecked.length;
    for(var v in congressmenChecked) {
        if($('.chk-diputado[value="' + congressmenChecked[v] + '"]').length) {
            $('.chk-diputado[value="' + congressmenChecked[v] + '"]').attr('checked', 'checked');
            checkCongressman(congressmenChecked[v]);
        }
        else
            nCongressmen--;
    }
    resetChecksCongressmen(nCongressmen);
}
function resetChecksBloques(size) {
    if(size == 0) {
        $('circle').removeClass('circle-blur circle-focus');
        $('.chk-bloque:checked').removeAttr('checked');
        $('.chk-bloque-ninguno').hide();
        return true;
    }
    return false;
}
function resetChecksCongressmen(size) {
    if(size == 0) {
        $('circle').removeClass('circle-blur circle-focus');
        $('.chk-diputado:checked').removeAttr('checked');
        $('.chk-diputado-ninguno').hide();
        return true;
    }
    return false;
}
function showTabs() {
    $('.nav-tabs').show();
}
