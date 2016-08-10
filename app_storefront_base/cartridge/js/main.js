window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap');

$(document).ready(function () {
    require('./components/menu')();
    require('./components/footer')();
});
