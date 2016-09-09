'use strict';

var helper = require('~/cartridge/scripts/dwHelpers');

/**
 * description
 * @param {string} somthing something
 * @returns {String|Null} something
 */
function applicablePaymentMethods(PaymentMethods) {
    return helper.map(PaymentMethods, function (method) {
        return {
            ID: method.ID,
            name: method.name,
            UUID: method.UUID
        };
    });
}

/**
 * description
 * @param {string} somthing something
 * @returns {String|Null} something
 */
function applicablePaymentCards(PaymentCards) {
    return helper.map(PaymentCards, function (card) {
        return {
            cardType: card.cardType,
            name: card.name
        };
    });
}

/**
 * description
 * @param {string} somthing something
 * @constructor
 */
function payment(PaymentMethods, PaymentCards) {
    this.applicablePaymentMethods = applicablePaymentMethods(PaymentMethods);
    this.applicablePaymentCards = applicablePaymentCards(PaymentCards);
}

module.exports = payment;
