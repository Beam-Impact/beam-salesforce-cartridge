'use strict';

module.exports = {
    toArrayList: function(array) {
        return {
            iterator: function() {
                var i = -1;

                return {
                    hasNext: function() {
                        return i < array.length - 1;
                    },
                    next: function() {
                        i += 1;
                        return array[i];
                    }
                }
            },
            toArray: function() {
                return array;
            },
            length: array.length
        }
    }
};
