/**
 * This helper function formats a given subtotal based on the currency code. It removes non-numeric characters
 * (except for the thousand and decimal separators), adjusts the decimal and thousand separators according to
 * the currency's format, and returns the properly formatted amount.
 *
 * @param {string} subtotal - The raw subtotal value as a string that needs to be formatted. This may include
 *                            non-numeric characters and various currency symbols
 * @param {string} currencyCode - The 3-letter currency code (e.g., 'USD', 'EUR', 'JPY', etc.) which defines
 *                                the format for the decimal and thousand separators
 * @returns {number} - The formatted subtotal value, with two decimal places for most currencies
 */

function getSanitizedSubtotal(subtotal, currencyCode) {
    var currencyFormats = {
        USD: { decimal: ".", thousand: "," }, // United States Dollar
        EUR: { decimal: ",", thousand: "." }, // Euro
        GBP: { decimal: ".", thousand: "," }, // Great British Pound
        INR: { decimal: ".", thousand: "," }, // Indian Rupee
        JPY: { decimal: "", thousand: "," }, // Japanese Yen (no decimals)
        CAD: { decimal: ".", thousand: "," }, // Canadian Dollar
        AUD: { decimal: ".", thousand: "," }, // Australian Dollar
        CHF: { decimal: ".", thousand: "'" }, // Swiss Franc (apostrophe for thousand separator)
        SEK: { decimal: ",", thousand: "." }, // Swedish Krona
        NZD: { decimal: ".", thousand: "," }, // New Zealand Dollar
        ZAR: { decimal: ".", thousand: "," }, // South African Rand
        CNY: { decimal: ".", thousand: "," }, // Chinese Yuan
        BRL: { decimal: ",", thousand: "." }, // Brazilian Real
        MXN: { decimal: ".", thousand: "," }, // Mexican Peso
        RUB: { decimal: ",", thousand: "." }, // Russian Ruble
        IDR: { decimal: ",", thousand: "." }, // Indonesian Rupiah
        KRW: { decimal: ".", thousand: "," }, // South Korean Won
        TRY: { decimal: ",", thousand: "." }, // Turkish Lira
        MYR: { decimal: ".", thousand: "," }, // Malaysian Ringgit
        HKD: { decimal: ".", thousand: "," }, // Hong Kong Dollar
        TWD: { decimal: ".", thousand: "," }, // New Taiwan Dollar
        EGP: { decimal: ".", thousand: "," }, // Egyptian Pound
        PKR: { decimal: ".", thousand: "," }, // Pakistani Rupee
        VND: { decimal: ",", thousand: "." }, // Vietnamese Dong
        AED: { decimal: ".", thousand: "," }, // United Arab Emirates Dirham
        KES: { decimal: ".", thousand: "," }, // Kenyan Shilling
        NGN: { decimal: ".", thousand: "," }, // Nigerian Naira
        THB: { decimal: ".", thousand: "," }, // Thai Baht
        PHP: { decimal: ".", thousand: "," }, // Philippine Peso
        HUF: { decimal: ",", thousand: "." }, // Hungarian Forint
        BGN: { decimal: ",", thousand: "." }, // Bulgarian Lev
        LKR: { decimal: ".", thousand: "," }, // Sri Lankan Rupee
        UAH: { decimal: ",", thousand: "." }, // Ukrainian Hryvnia
    };

    var { decimal, thousand } = currencyFormats[currencyCode] || {
        decimal: ".",
        thousand: ",",
    };

    // Remove all non-numeric characters except thousand separators (ex: $, €, £, ¥, et.)
    var cleanedSubtotal = subtotal.replace(
        new RegExp(`[^\\d${thousand}${decimal}]`, "g"),
        ""
    );

    var processedSubtotal =
        currencyCode === "JPY"
            ? cleanedSubtotal.replace(new RegExp(`\\${thousand}`, "g"), "") // Removes thousand separators only since JPY doesn't use decimals
            : cleanedSubtotal
                  .replace(new RegExp(`\\${thousand}`, "g"), "")
                  .replace(new RegExp(`\\${decimal}`, "g"), ".");

    var amount = parseFloat(processedSubtotal);

    if (currencyCode === "JPY") {
        return isNaN(amount) ? parseFloat("0") : parseFloat(amount);
    }

    return isNaN(amount) ? parseFloat("0.00") : formatNumber(amount);
}

function formatNumber(amount) {
    if (isNaN(amount)) return "";
    let formattedAmount = parseFloat(amount).toFixed(2);
    return formattedAmount;
}

module.exports = {
    getSanitizedSubtotal: getSanitizedSubtotal,
};
