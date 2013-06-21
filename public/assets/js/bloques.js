$(document).ready(function() {
    $('.bloques').on('click', '.chk-bloque', function() {
        if($('.chk-bloque:checked').length == 0)
            $('circle').removeClass('bloque-blur bloque-focus');
        else {
            var bloque = $(this).val();
            if($(this).is(':checked')) {
                $('.bloque' + bloque).addClass('bloque-focus');
                $('circle').not('.bloque' + bloque + ' bloque-focus').addClass('bloque-blur');
            }
            else
                $('.bloque' + bloque).addClass('bloque-blur').removeClass('bloque-focus');
        }
    });
});