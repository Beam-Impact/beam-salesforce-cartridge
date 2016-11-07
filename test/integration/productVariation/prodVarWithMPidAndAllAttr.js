var assert = require('chai').assert;
var request = require('request');
var _ = require('lodash');
var config = require('../it.config');
var jsonHelpers = require('../helpers/jsonUtils');

describe('ProductVariation - Get product variation with master product ID and all required variation attributes', function () {
    this.timeout(5000);

    var masterPid = '25604455';
    var paramColorWhite = 'dwvar_25604455_color=WHITEFB';
    var paramSize160 = 'dwvar_25604455_size=160';
    var paramWidth3233 = 'dwvar_25604455_width=A';
    var expectedVariant = '708141676220';

    var myGetRequest = {
        url: '',
        method: 'GET',
        rejectUnauthorized: false
    };

    it('should returns variant for the selected attributes', function (done) {
        var urlEndPoint = config.baseUrl + '/Product-Variation';
        var urlWithMpid = urlEndPoint + '?pid=' + masterPid;
        myGetRequest.url = urlWithMpid + '&' + paramColorWhite + '&' + paramSize160 + '&' + paramWidth3233;

        var expectedResBody = {
            'product': {
                'id': expectedVariant,
                'productName': 'No-Iron Textured Dress Shirt',
                'shortDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'longDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'online': true,
                'searchable': true,
                'minOrderQuantity': 1,
                'maxOrderQuantity': 9,
                'attributes': [
                    {
                        'attributeId': 'color',
                        'displayName': 'Color',
                        'id': 'color',
                        'swatchable': true,
                        'values': [
                            {
                                'id': 'SLABLFB',
                                'description': null,
                                'displayValue': 'Slate',
                                'value': 'SLABLFB',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_color=SLABLFB&dwvar_25604455_size=160&dwvar_25604455_width=A',
                                'images': {
                                    'swatch': [{
                                        'alt': 'No-Iron Textured Dress Shirt, Slate, swatch',
                                        'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw7a85aeb2/images/swatch/PG.15J0037EJ.SLABLFB.CP.jpg',
                                        'title': 'No-Iron Textured Dress Shirt, Slate'
                                    }]
                                }
                            },
                            {
                                'id': 'WHITEFB',
                                'description': null,
                                'displayValue': 'White',
                                'value': 'WHITEFB',
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_color=&dwvar_25604455_size=160&dwvar_25604455_width=A',
                                'images': {
                                    'swatch': [{
                                        'alt': 'No-Iron Textured Dress Shirt, White, swatch',
                                        'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw80b5ac36/images/swatch/PG.15J0037EJ.WHITEFB.CP.jpg',
                                        'title': 'No-Iron Textured Dress Shirt, White'
                                    }]
                                }
                            }
                        ]
                    },
                    {
                        'attributeId': 'size',
                        'displayName': 'Size',
                        'id': 'size',
                        'swatchable': false,
                        'values': [
                            {
                                'id': '145',
                                'description': null,
                                'displayValue': '14 1/2',
                                'value': '145',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=145&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '150',
                                'description': null,
                                'displayValue': '15',
                                'value': '150',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=150&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '155',
                                'description': null,
                                'displayValue': '15 1/2',
                                'value': '155',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=155&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '160',
                                'description': null,
                                'displayValue': '16',
                                'value': '160',
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '165',
                                'description': null,
                                'displayValue': '16 1/2',
                                'value': '165',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=165&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '170',
                                'description': null,
                                'displayValue': '17',
                                'value': '170',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=170&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '175',
                                'description': null,
                                'displayValue': '17 1/2',
                                'value': '175',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '180',
                                'description': null,
                                'displayValue': '18',
                                'value': '180',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_size=180&dwvar_25604455_color=WHITEFB&dwvar_25604455_width=A'
                            },
                            {
                                'id': '185',
                                'description': null,
                                'displayValue': '18 1/2',
                                'value': '185',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '190',
                                'description': null,
                                'displayValue': '19',
                                'value': '190',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '200',
                                'description': null,
                                'displayValue': '20',
                                'value': '200',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '220',
                                'description': null,
                                'displayValue': '22',
                                'value': '220',
                                'selected': false,
                                'selectable': false
                            }
                        ]
                    },
                    {
                        'attributeId': 'width',
                        'displayName': 'Width',
                        'id': 'width',
                        'swatchable': false,
                        'values': [
                            {
                                'id': 'A',
                                'description': null,
                                'displayValue': '32/33',
                                'value': 'A',
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_width=&dwvar_25604455_size=160&dwvar_25604455_color=WHITEFB'
                            },
                            {
                                'id': 'B',
                                'description': null,
                                'displayValue': '34/35',
                                'value': 'B',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455_width=B&dwvar_25604455_size=160&dwvar_25604455_color=WHITEFB'
                            }
                        ]
                    }
                ],
                'price': {
                    'value': 49.99,
                    'currency': 'USD',
                    'formatted': '$49.99',
                    'type': 'standard'
                },
                'images': {
                    'large': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8f141f96/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwadb01158/images/large/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        }
                    ],
                    'small': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe65fe261/images/small/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe28073fd/images/small/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        }
                    ]
                },
                'available': true,
                'readyToOrder': true,
                'productType': 'variant',
                'rating': 0
            },
            'resources': {
                'label_instock': 'In Stock',
                'label_allnotavailable': 'This item is currently not available.',
                'info_selectforstock': 'Select Styles for Availability'
            }

        };

        // strip out all "url" properties from the expected response
        var expectedResBodyStripped = jsonHelpers.deleteProperties(expectedResBody, ['url']);

        request(myGetRequest, function (error, response) {
            assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

            var bodyAsJson = JSON.parse(response.body);

            // strip out all "url" properties from the actual response
            var actualRespBodyStripped = jsonHelpers.deleteProperties(bodyAsJson, ['url']);

            assert.deepEqual(actualRespBodyStripped, expectedResBodyStripped, 'Actual response not as expected.');

            // Verify URL for product.attributes of color = SLABLFB
            var attrColorBlue = bodyAsJson.product.attributes[0].values[0];
            var urlSplit1 = attrColorBlue.url.split('?');
            var urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Color with id = SLABLFB: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Color with id = SLABLFB: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Color with id = SLABLFB: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Color with id = SLABLFB: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=SLABLFB'), 'product.attributes Color with id = SLABLFB: url not include parameter dwvar_25604455_color=SLABLFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=160'), 'product.attributes Color with id = SLABLFB: url not include parameter dwvar_25604455_size=160');

            var colorBlueImages = attrColorBlue.images;
            assert.isTrue(colorBlueImages.swatch[0].url.endsWith('SLABLFB.CP.jpg'), 'color SLABLFB image swatch[0]: url not ended with SLABLFB.CP.jpg.');

            // Verify URL for product.attributes of color = WHITEFB
            var attrColorWhite = bodyAsJson.product.attributes[0].values[1];
            urlSplit1 = attrColorWhite.url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Color with id = WHITEFB: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Color with id = WHITEFB: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Color with id = WHITEFB: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Color with id = WHITEFB: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color='), 'product.attributes Color with id = WHITEFB: url not include parameter dwvar_25604455_color=');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=160'), 'product.attributes Color with id = WHITEFB: url not include parameter dwvar_25604455_size=160');

            var colorWhiteImages = attrColorWhite.images;
            assert.isTrue(colorWhiteImages.swatch[0].url.endsWith('WHITEFB.CP.jpg'), 'color WHITEFB image swatch[0]: url not ended with WHITEFB.CP.jpg.');

            // Verify URL for product.attributes Size with id = 145
            urlSplit1 = bodyAsJson.product.attributes[1].values[0].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 145: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 145: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 145: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 145: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 145: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=145'), 'product.attributes Size with id = 145: url not include parameter dwvar_25604455_size=145');

            // Verify URL for product.attributes of Size of id = 150
            urlSplit1 = bodyAsJson.product.attributes[1].values[1].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 150: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 150: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 150: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 150: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 150: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=150'), 'product.attributes Size with id = 150: url not include parameter dwvar_25604455_size=150');

            // Verify URL for product.attributes Size with id = 155
            urlSplit1 = bodyAsJson.product.attributes[1].values[2].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 155: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 155: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 155: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 155: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 155: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=155'), 'product.attributes Size with id = 155: url not include parameter dwvar_25604455_size=155');

            // Verify URL for product.attributes Size with id = 160
            urlSplit1 = bodyAsJson.product.attributes[1].values[3].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 160: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 160: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 160: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 160: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 160: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size='), 'product.attributes Size with id = 160: url not include parameter dwvar_25604455_size=');

            // Verify URL for product.attributes Size with id = 165
            urlSplit1 = bodyAsJson.product.attributes[1].values[4].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 165: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 165 url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 165: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 165: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 165: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=165'), 'product.attributes Size with id = 165: url not include parameter dwvar_25604455_size=165');

            // Verify URL for product.attributes Size with id = 170
            urlSplit1 = bodyAsJson.product.attributes[1].values[5].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 170: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 170 url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 170: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 170: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 170: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=170'), 'product.attributes Size with id = 170: url not include parameter dwvar_25604455_size=170');

            // Verify URL for product.attributes Size with id = 180
            urlSplit1 = bodyAsJson.product.attributes[1].values[7].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = 180: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = 180 url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = 180: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=A'), 'product.attributes Size with id = 180: url not include parameter dwvar_25604455_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = 180: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=180'), 'product.attributes Size with id = 180: url not include parameter dwvar_25604455_size=180');

            // Verify URL for product.attributes of width = A (32/33)
            urlSplit1 = bodyAsJson.product.attributes[2].values[0].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = A: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = A: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = A: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width='), 'product.attributes Size with id = A: url not include parameter dwvar_25604455_width=');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = A: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=160'), 'product.attributes Size with id = A: url not include parameter dwvar_25604455_size=160');

            // Verify URL for product.attributes of width = B (34/35)
            urlSplit1 = bodyAsJson.product.attributes[2].values[1].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPoint, 'product.attributes Size with id = B: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 4, 'product.attributes Size with id = B: url does not have 4 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.attributes Size with id = B: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_width=B'), 'product.attributes Size with id = B: url not include parameter dwvar_25604455_width=B');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_color=WHITEFB'), 'product.attributes Size with id = B: url not include parameter dwvar_25604455_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455_size=160'), 'product.attributes Size with id = B: url not include parameter dwvar_25604455_size=160');

            // Verify URL for product.attributes of images
            var prodImages = bodyAsJson.product.images;
            assert.isTrue(prodImages.large[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image large[0]: url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(prodImages.large[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image large[1]: url not ended with WHITEFB.BZ.jpg.');
            assert.isTrue(prodImages.small[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image small[0]: url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(prodImages.small[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image small[1]: url not ended with WHITEFB.BZ.jpg.');

            done();
        });
    });
});