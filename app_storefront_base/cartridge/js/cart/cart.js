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

/**
 * re-renders the order totals and the number of items in the cart
 * @param {object} data
 */
function updateCartTotals(data) {
    var $numberOfItems = $('.number-of-items');
    var $shippingCost = $('.shipping-cost');
    var $subTotal = $('.sub-total');
    var $taxTotal = $('.tax-total');

    $numberOfItems.empty();
    $numberOfItems.append(data.resources.number_of_items);

    $shippingCost.empty();
    $shippingCost.append(data.totals.totalShippingCost);

    $taxTotal.empty();
    $taxTotal.append(data.totals.totalTax);

    $subTotal.empty();
    $subTotal.append(data.totals.grandTotal);
}

module.exports = function () {
    $('.remove-product').click(function (e) {
        e.preventDefault();
        var actionUrl = $(this).attr('data-actionUrl');
        var productID = $(this).attr('data-pid');
        var productName = $(this).attr('data-name');
        var uuid = $(this).attr('data-uuid');

        var $deleteConfirmBtn = $('.delete-confirmation-btn');
        var $productToRemoveSpan = $('.product-to-remove');

        $deleteConfirmBtn.attr('data-pid', productID);
        $deleteConfirmBtn.attr('data-actionUrl', actionUrl);
        $deleteConfirmBtn.attr('data-uuid', uuid);
        $productToRemoveSpan.empty();
        $productToRemoveSpan.append(productName);
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
                var $cartDiv = $('.cart');
                var $numberOfItems = $('.number-of-items');
                if (data.items.length === 0) {
                    $cartDiv.empty();
                    $numberOfItems.empty();
                    $cartDiv.append('<div class="row"> ' +
                        '<div class="col-xs-12 text-xs-center"> ' +
                        '<h1>' + data.resources.empty_cart_msg + '</h1> ' +
                        '</div> ' +
                        '</div>');
                    $numberOfItems.append(data.resources.number_of_items);
                } else {
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
