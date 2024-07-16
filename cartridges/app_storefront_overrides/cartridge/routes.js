"use strict";

module.exports = function (app) {
    // Other route mappings
    app.use(require("./controllers/BeamSubscriptionWidget"));
};
