'use strict';

module.exports = {
    toArrayList: function (array) {
        return {
            iterator: function () {
                var i = -1;

                return {
                    hasNext: function () {
                        return i < array.length - 1;
                    },
                    next: function () {
                        i += 1;
                        return array[i];
                    }
                };
            },
            toArray: function () {
                return array;
            },
            length: array.length,
            contains: function (item) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === item) return true;
                }
                return false;
            }
        };
    }
};
