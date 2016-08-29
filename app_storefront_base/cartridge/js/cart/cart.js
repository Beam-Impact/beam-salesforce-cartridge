'use strict';

/**
 * appends params to a url
 * @param {string} url
 * @param {object} params
 * @returns {string} a url
 */
function appendToUrl(url, params) {
    var newUrl = url;
    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return newUrl;
}

function updateCartTotals(data) {
    $('.number-of-items').empty();
    $('.number-of-items').append(data.resources.number_of_items);

    $('.shipping-cost').empty();
    $('.shipping-cost').append(data.totals.totalShippingCost);

    $('.tax-total').empty();
    $('.tax-total').append(data.totals.totalTax);

    $('.sub-total').empty();
    $('.sub-total').append(data.totals.grandTotal);
}

module.exports = function () {
    $('.remove-btn').click(function (e) {
        e.preventDefault();
        var actionUrl = $(this).attr('data-actionUrl');
        var productID = $(this).attr('data-pid');
        var productName = $(this).attr('data-name');
        var uuid = $(this).attr('data-uuid');
        $('.delete-confirmation-btn').attr('data-pid', productID);
        $('.delete-confirmation-btn').attr('data-actionUrl', actionUrl);
        $('.delete-confirmation-btn').attr('data-uuid', uuid);
        $('.product-to-remove').empty();
        $('.product-to-remove').append(productName);
    });

    $('.remove-btn-lg').click(function (e) {
        e.preventDefault();
        var actionUrl = $(this).attr('data-actionUrl');
        var productID = $(this).attr('data-pid');
        var productName = $(this).attr('data-name');
        var uuid = $(this).attr('data-uuid');
        $('.delete-confirmation-btn').attr('data-pid', productID);
        $('.delete-confirmation-btn').attr('data-actionUrl', actionUrl);
        $('.delete-confirmation-btn').attr('data-uuid', uuid);
        $('.product-to-remove').empty();
        $('.product-to-remove').append(productName);
    });

    $('.optional-promo').click(function (e) {
        e.preventDefault();
        $('.promo-code-form').toggle();
    });

    $('.delete-confirmation-btn').click(function (e) {
        e.preventDefault();
        var productID = $(this).attr('data-pid');
        var url = $(this).attr('data-actionUrl');
        var uuid = $(this).attr('data-uuid');
        var urlParams = {
            pid: productID,
            uuid: uuid
        };

        url = appendToUrl(url, urlParams);

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.items.length === 0) {
                    $('.cart').empty();
                    $('.number-of-items').empty();
                    $('.cart').append('<div class="row"> ' +
                        '<div class="col-xs-12 text-xs-center"> ' +
                        '<h1>' + data.resources.empty_cart_msg + '</h1> ' +
                        '</div> ' +
                        '</div>');
                    $('.number-of-items').append(data.resources.number_of_items);
                } else {
                    // TODO update total num of items in cart
                    $('.uuid-' + uuid).remove();
                    updateCartTotals(data);
                }
            }
        });
    });

    $('.quantity').change(function () {
        var quantity = $(this).val();
        var productID = $(this).attr('data-pid');
        var url = $(this).attr('data-actionUrl');
        var uuid = $(this).attr('data-uuid');

        var urlParams = {
            pid: productID,
            quantity: quantity,
            uuid: uuid
        };
        url = appendToUrl(url, urlParams);

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $('.item-total-' + uuid).empty();
                for (var i = 0; i < data.items.length; i++) {
                    if (data.items[i].UUID === uuid) {
                        $('.item-total-' + uuid).append(data.items[i].priceTotal);
                        break;
                    }
                }
                updateCartTotals(data);
            }
        });
    });

    $('.shippingMethods').change(function () {
        var url = $(this).attr('data-actionUrl');
        var urlParams = {
            methodID: $(this).find(':selected').attr('data-shipping-id')
        };
        url = appendToUrl(url, urlParams);

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                updateCartTotals(data);
            }
        });
    });
};
