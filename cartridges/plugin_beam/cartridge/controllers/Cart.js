"use strict";

var server = require("server");
var Site = require("dw/system/Site");
var BasketMgr = require("dw/order/BasketMgr");
var Transaction = require("dw/system/Transaction");
var Resource = require("dw/web/Resource");

server.extend(module.superModule);

/**
 * Adds custom attributes to the basket for nonprofitId, selectionId, cartId, sfCartId, and storeId
 */

server.post("UpdateBeamCustomAttributes", function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();

    // Check if the basket exists
    if (!currentBasket) {
        res.json({
            success: false,
            error: Resource.msg("error.basket.notfound", "cart", null),
        });
        return next();
    }

    // Get the parameters from the request body
    var existingAttributes = {
        nonprofitId: currentBasket.custom.beamNonprofitId,
        selectionId: currentBasket.custom.beamSelectionId,
        cartId: currentBasket.custom.beamCartId,
        sfCartId: currentBasket.custom.beamSFCartId,
        storeId: currentBasket.custom.beamStoreId,
    };

    var payload = JSON.parse(req.body);

    var sitePreferences = Site.getCurrent().getPreferences();
    var beamStoreId = sitePreferences.custom.beamStoreId;

    var nonprofitId = payload.nonprofitId || existingAttributes.nonprofitId;
    var selectionId = payload.selectionId || existingAttributes.selectionId;
    var cartId = payload.cartId || existingAttributes.cartId; // beam cart id
    var sfCartId = currentBasket.UUID || existingAttributes.sfCartId;
    var storeId = parseInt(beamStoreId, 10) || existingAttributes.storeId;

    try {
        // Update the basket custom attributes within a transaction
        Transaction.wrap(function () {
            currentBasket.custom.beamNonprofitId = nonprofitId;
            currentBasket.custom.beamSelectionId = selectionId;
            currentBasket.custom.beamCartId = cartId;
            currentBasket.custom.beamSFCartId = sfCartId;
            currentBasket.custom.beamStoreId = storeId;
        });

        res.json({
            success: true,
            message: Resource.msg(
                "basket.customattributes.updated",
                "cart",
                null
            ),
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        });
    }

    return next();
});

module.exports = server.exports();
