'use strict';

var ArrayList = require('dw/util/ArrayList');

module.exports = {
    toList: function (list) {
        var collection = new ArrayList();
        list.forEach(function (item) {
            collection.add(item);
        });
        return collection;
    }
};
