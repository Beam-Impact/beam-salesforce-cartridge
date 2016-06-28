'use strict';

module.exports = function (array) {
    let items = [];
    if (array) {
        items = array;
    }

    this.add = function (item) {
        items.push(item);
    };

    this.iterator = function () {
        let i = 0;
        return {
            hasNext: function () {
                return i < items.length;
            },
            next: function () {
                return items[i++];
            }
        };
    };

    this.length = items.length;

    this.toArray = function () {
        return items;
    };

    this.addAll = function (collection) {
        items = items.concat(collection.toArray());
    };
};
