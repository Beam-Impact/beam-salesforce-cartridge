window.jQuery = window.$ = require('jquery');

$(document).ready(function () {
    require('./components/menu')();
    require('./components/footer')();
});

require('../../../node_modules/bootstrap/dist/js/bootstrap');
