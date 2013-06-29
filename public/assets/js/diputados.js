$(document).ready(function() {
    $('.chk-diputado-ninguno').hide();

    $('.diputados').on('click', '.chk-diputado', function() {
        if($('.chk-diputado:checked').length == 0) {
            $('circle').removeClass('diputado-blur diputado-focus');
            $('.chk-diputado-ninguno').hide();
        }
        else {
            $('.chk-diputado-ninguno').show();
            var diputado = $(this).val();
            if($(this).is(':checked')) {
                $('#d' + diputado).addClass('diputado-focus');
                $('circle').not('.diputado' + diputado + ' diputado-focus').addClass('diputado-blur');
            }
            else
                $('.diputado' + diputado).addClass('diputado-blur').removeClass('diputado-focus');
        }
    });

    $('.diputados').on('click', '.chk-diputado-ninguno', function() {
        $('circle').removeClass('diputado-blur diputado-focus');
        $('.chk-diputado:checked').removeAttr('checked');
        $(this).hide();
    });
});

var congressmenChecked;
function getCheckedCongressmen() {
    congressmenChecked = [];
    $('.chk-diputado:checked').each(function() {
        congressmenChecked.push($(this).val());
    });
}
function setCheckedCongressmen() {
    for(var v in congressmenChecked)
        $('.chk-diputado[value="' + congressmenChecked[v] + '"]').attr('checked', 'checked');
}
