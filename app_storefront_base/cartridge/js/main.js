window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap');

$(document).ready(function () {
    require('./components/menu')();
    require('./components/footer')();
    require('./storeLocator')();
});
