var assert = require('chai').assert;
var request = require("request");
var config = require("../it.config");


describe("Store Locator", function() {
        
    var baseUrlSplit = config.baseUrl.split("/");
    var expectedActionUrl = "/" + 
                            baseUrlSplit[baseUrlSplit.length - 4] + "/" +
                            baseUrlSplit[baseUrlSplit.length - 3] + "/" +
                            baseUrlSplit[baseUrlSplit.length - 2] + "/" +
                            baseUrlSplit[baseUrlSplit.length - 1] + "/Stores-FindStores";

    describe("FindStores using Postal Code and radius", function() {

        it("should returns locations for valid postal code and radius", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?postalCode=01803&radius=15";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [
                    {
                      "name": "Demandware",
                      "address1": "10 Presidential Way",
                      "address2": null,
                      "city": "Woburn",
                      "postalCode": "01801",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Champaign Electronic Shop",
                      "address1": "1001 Cambridge St",
                      "address2": null,
                      "city": "Cambridge",
                      "postalCode": "02141",
                      "phone": "+1-617-714-2640",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Downtown TV Shop",
                      "address1": "333 Washington St",
                      "address2": null,
                      "city": "Boston",
                      "postalCode": "02108",
                      "phone": "+1-617-695-1565",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Short Electro",
                      "address1": "584 Columbus Ave",
                      "address2": null,
                      "city": "Boston",
                      "postalCode": "02118",
                      "phone": "+1-617-888-7276",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Khale Street Electronics",
                      "address1": "150 Winthrop Ave",
                      "address2": null,
                      "city": "Lawrence",
                      "postalCode": "01843",
                      "phone": "+1-978-580-2704",
                      "stateCode": "MA"
                    }
                ],
                "locations": [
                    {
                      "name": "Demandware",
                      "latitude": 42.5273334,
                      "longitude": -71.13758250000001
                    },
                    {
                      "name": "Champaign Electronic Shop",
                      "latitude": 42.3729794,
                      "longitude": -71.09346089999997
                    },
                    {
                      "name": "Downtown TV Shop",
                      "latitude": 42.3569512,
                      "longitude": -71.05902600000002
                    },
                    {
                      "name": "Short Electro",
                      "latitude": 42.3403189,
                      "longitude": -71.0817859
                    },
                    {
                      "name": "Khale Street Electronics",
                      "latitude": 42.6895548,
                      "longitude": -71.14878340000001
                    }
                ],
                "searchKey": {
                    "postalCode": "01803"
                },
                "radius": 15,
                "actionUrl": expectedActionUrl,
                "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
                "radiusOptions": [
                    15,
                    30,
                    50,
                    100,
                    300
                ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

        it("should returns location for specified postal code and default radius = 100", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?postalCode=04330";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [
                    {
                      "name": "Electro Turbo",
                      "address1": "2 Canal Plz",
                      "address2": null,
                      "city": "Portland",
                      "postalCode": "04101",
                      "phone": "+1-207-599-5467",
                      "stateCode": "ME"
                    }
                ],
                "locations": [
                    {
                      "name": "Electro Turbo",
                      "latitude": 43.656852,
                      "longitude": -70.25567999999998
                    }
                ],
                "searchKey": {
                    "postalCode": "04330"
                },
                "radius": 100,
                "actionUrl": expectedActionUrl,
                "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
                "radiusOptions": [
                    15,
                    30,
                    50,
                    100,
                    300
                ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

        it("should returns 0 location for non-exist postal code", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?postalCode=012AB&radius=5";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [],
              "locations": [],
              "searchKey": {
                    "postalCode": "012AB"
                  },
              "radius": 5,
              "actionUrl": expectedActionUrl,
              "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
              "radiusOptions": [
                  15,
                  30,
                  50,
                  100,
                  300
              ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

        it("should returns 0 location for negative radius", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?postalCode=01803&radius=-15";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [],
              "locations": [],
              "searchKey": {
                    "postalCode": "01803"
                  },
              "radius": -15,
              "actionUrl": expectedActionUrl,
              "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
              "radiusOptions": [
                  15,
                  30,
                  50,
                  100,
                  300
              ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

    });

    describe("FindStores using valid longitude, latitude and radius.", function() {

        it("should returns locations for specified longitude, latitude and radius", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?long=-71.14878340000001&lat=42.6895548&radius=23";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [
                    {
                      "name": "Khale Street Electronics",
                      "address1": "150 Winthrop Ave",
                      "address2": null,
                      "city": "Lawrence",
                      "postalCode": "01843",
                      "phone": "+1-978-580-2704",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Demandware",
                      "address1": "10 Presidential Way",
                      "address2": null,
                      "city": "Woburn",
                      "postalCode": "01801",
                      "stateCode": "MA"
                    },
                    {
                      "name": "Champaign Electronic Shop",
                      "address1": "1001 Cambridge St",
                      "address2": null,
                      "city": "Cambridge",
                      "postalCode": "02141",
                      "phone": "+1-617-714-2640",
                      "stateCode": "MA"
                    }
                ],
                "locations": [
                    {
                      "name": "Khale Street Electronics",
                      "latitude": 42.6895548,
                      "longitude": -71.14878340000001
                    },
                    {
                      "name": "Demandware",
                      "latitude": 42.5273334,
                      "longitude": -71.13758250000001
                    },
                    {
                      "name": "Champaign Electronic Shop",
                      "latitude": 42.3729794,
                      "longitude": -71.09346089999997
                    }
                ],
                "searchKey": {
                    "lat": 42.6895548,
                    "long": -71.14878340000001
                },
                "radius": 23,
                "actionUrl": expectedActionUrl,
                "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
                "radiusOptions": [
                    15,
                    30,
                    50,
                    100,
                    300
                ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

        it("should returns 0 location for the specified longitude and latitude", function(done) {
            var url = config.baseUrl + "/Stores-FindStores?long=0&lat=0";
            var myRequest = {
                url: url,
                method: 'GET',
                rejectUnauthorized: false
            };
            var ExpectedResBody = {
                "stores": [],
                "locations": [],
                "searchKey": {
                    "lat": 0,
                    "long": 0
                },
                "radius": 100,
                "actionUrl": expectedActionUrl,
                "googleMapsApi": "https://maps.googleapis.com/maps/api/js?key=null",
                "radiusOptions": [
                    15,
                    30,
                    50,
                    100,
                    300
                ]
            };

            request(myRequest, function(error, response, body) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.deepEqual(bodyAsJson, ExpectedResBody, "Actual response body not as expected.");

                done();
            });
        });

    });

});
