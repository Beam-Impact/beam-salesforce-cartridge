"use strict";

var server = require("server");
var subscriptionHelper = require("*/cartridge/scripts/beamSubscriptionWidget");
var Resource = require("dw/web/Resource");

server.get("ShowSubscription", function (req, res, next) {
    var subscriptionId = req.querystring.subscriptionId; // Retrieve subscription id from request

    // Fetch subscription details
    var subscriptionDetails =
        subscriptionHelper.getSubscriptionDetails(subscriptionId);

    // Render the template from plugin_beam
    res.render("plugin_beam/beam_subscription_management", {
        subscriptionId: subscriptionDetails
            ? subscriptionDetails.subscriptionId
            : null,
        email: subscriptionDetails ? subscriptionDetails.email : null,
        errorMessage: subscriptionDetails
            ? null
            : Resource.msg("subscription_not_found", "strings", null),
    });

    next();
});

module.exports = server.exports();
