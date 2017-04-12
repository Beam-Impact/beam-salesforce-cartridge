'use strict';
var base = require('./base');

module.exports = {
    selectAttributes: base.selectAttribute,

    colorAttribute: base.colorAttribute,

    availability: base.availability,

    addToCart: base.addToCart,

    UpdateAttributesAndDetails: function () {
        $('body').on('product:statusUpdate', function (e, data) {
            $('.description-and-detail .product-attributes').empty().html(data.attributesHtml);

            if (data.shortDescription) {
                $('.description-and-detail .description').removeClass('hidden-xl-down');
                $('.description-and-detail .description .content')
                    .empty()
                    .html(data.shortDescription);
            } else {
                $('.description-and-detail .description').addClass('hidden-xl-down');
            }

            if (data.longDescription) {
                $('.description-and-detail .details').removeClass('hidden-xl-down');
                $('.description-and-detail .details .content').empty().html(data.longDescription);
            } else {
                $('.description-and-detail .details').addClass('hidden-xl-down');
            }
        });
    }
};
