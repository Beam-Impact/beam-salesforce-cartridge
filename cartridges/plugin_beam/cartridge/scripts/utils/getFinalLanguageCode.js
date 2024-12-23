/**
 * This helper function checks if the current language is supported by Beam.
 * If the current language is supported, it returns it, otherwise, it returns the default language.
 *
 * @param {dw.system.Site} site The current site object
 * @param {string} currentLanguageCode The current language code (e.g., 'en', 'fr', etc.)
 * @returns {string} The final language code
 */
function getFinalLanguageCode(site, currentLanguageCode) {
    var supportedLangString =
        site.getCustomPreferenceValue("beamSupportedLang");
    var supportedLang = [];
    try {
        supportedLang = JSON.parse(supportedLangString);
    } catch (e) {
        var Logger = require("dw/system/Logger");
        Logger.error("Error parsing beamSupportedLang: {0}", e.message);
    }

    var defaultLang = site.getCustomPreferenceValue("beamDefaultLang");

    // If current language is supported, use it; otherwise, fall back to default language
    return supportedLang.indexOf(currentLanguageCode) !== -1
        ? currentLanguageCode
        : defaultLang;
}

module.exports = {
    getFinalLanguageCode: getFinalLanguageCode,
};
