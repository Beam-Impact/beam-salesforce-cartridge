"use strict";

var CustomObjectMgr = require("dw/object/CustomObjectMgr");

/**
 * Get Subscription Details
 * @param {string} subscriptionId - The ID of the subscription to retrieve
 * @returns {Object|null} - The subscription details or null if not found
 */
function getSubscriptionDetails(subscriptionId) {
    var subscriptionObject = CustomObjectMgr.getCustomObject(
        "Subscription",
        subscriptionId
    );
    if (subscriptionObject) {
        return {
            email: subscriptionObject.custom.email,
            subscriptionId: subscriptionObject.custom.subscriptionId,
        };
    }
    return null;
}

module.exports = {
    getSubscriptionDetails: getSubscriptionDetails,
};
