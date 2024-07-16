"use strict";
/* global response */

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");

/**
 * Render logic for storefront.communityImpact component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();

    return new Template("beam/beam_product_details_page").render(model).text;
};
