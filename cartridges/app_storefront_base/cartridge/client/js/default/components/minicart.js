'use strict';

var cart = require('../cart/cart');

module.exports = function () {
    cart();

    $('.mini-cart').on('count:update', function (event, count) {
        if (count && $.isNumeric(count.quantityTotal)) {
            $('.mini-cart .minicart-quantity').text(count.quantityTotal);
        }
    });

    $('.mini-cart').on('mouseenter focusin', function () {
        if ($('.search:visible').length === 0) {
            return;
        }
        var count = parseInt($('.mini-cart .minicart-quantity').text(), 10);

        if (count !== 0 && $('.mini-cart .popover.show').length === 0) {
            $('.mini-cart .popover').addClass('show');
            $('.mini-cart .popover').spinner().start();
            $.get('Cart-MiniCartShow', function (data) {
                $('.mini-cart .popover').append(data);
                $.spinner().stop();
            });
        }
    });

    $('.mini-cart').on('mouseleave focusout', function (event) {
        if (event.type === 'focusout' && $('.mini-cart').has(event.target).length > 0) {
            event.stopPropagation();
            return;
        }
        $('.mini-cart .popover').empty();
        $('.mini-cart .popover').removeClass('show');
    });
};