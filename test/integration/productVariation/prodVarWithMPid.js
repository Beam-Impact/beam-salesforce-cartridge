var assert = require('chai').assert;
var request = require('request');
var config = require('../it.config');
var jsonHelpers = require('../helpers/jsonUtils');

describe('ProductVariation - Get product variation with only master product ID', function () {
    this.timeout(5000);

    var masterPid = '25604455';
    var myGetRequest = {
        url: '',
        method: 'GET',
        rejectUnauthorized: false
    };

    it('should returns master product details and variant attributes', function (done) {
        myGetRequest.url = config.baseUrl + '/Product-Variation?pid=' + masterPid;

        var expectedResBody = {
            'locale': {
                'countryCode': 'US',
                'name': 'United States',
                'continent': 'northamerica',
                'availableLocales': [
                    'en_US'
                ],
                'currencyCode': 'USD',
                'tax': 'net'
            },
            'product': {
                'id': masterPid,
                'name': 'No-Iron Textured Dress Shirt',
                'shortDescription': {},
                'longDescription': {},
                'isOnline': true,
                'isSearchable': true,
                'minOrderQuantity': 1,
                'maxOrderQuantity': 9,
                'attributes': [
                    {
                        'attributeID': 'color',
                        'displayName': 'Color',
                        'id': 'color',
                        'isSwatchable': true,
                        'values': [
                            {
                                'id': 'SLABLFB',
                                'description': null,
                                'displayValue': 'Slate',
                                'value': 'SLABLFB',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_color=SLABLFB',
                                'images': {
                                    'large': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, large',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe3107c94/images/large/PG.15J0037EJ.SLABLFB.PZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        },
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, large',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwc0e293c5/images/large/PG.15J0037EJ.SLABLFB.BZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        }
                                    ],
                                    'medium': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, medium',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwbb455002/images/medium/PG.15J0037EJ.SLABLFB.PZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        },
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, medium',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwcfda4574/images/medium/PG.15J0037EJ.SLABLFB.BZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        }
                                    ],
                                    'small': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, small',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw3548bd7c/images/small/PG.15J0037EJ.SLABLFB.PZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        },
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, small',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw80aa9ba3/images/small/PG.15J0037EJ.SLABLFB.BZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        }
                                    ],
                                    'swatch': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, Slate, swatch',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw7a85aeb2/images/swatch/PG.15J0037EJ.SLABLFB.CP.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, Slate'
                                        }
                                    ]
                                }
                            },
                            {
                                'id': 'WHITEFB',
                                'description': null,
                                'displayValue': 'White',
                                'value': 'WHITEFB',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_color=WHITEFB',
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
                                    'medium': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, White, medium',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8ad7d578/images/medium/PG.15J0037EJ.WHITEFB.PZ.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, White'
                                        },
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, White, medium',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw22201db2/images/medium/PG.15J0037EJ.WHITEFB.BZ.jpg',
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
                                    ],
                                    'swatch': [
                                        {
                                            'alt': 'No-Iron Textured Dress Shirt, White, swatch',
                                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw80b5ac36/images/swatch/PG.15J0037EJ.WHITEFB.CP.jpg',
                                            'title': 'No-Iron Textured Dress Shirt, White'
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        'attributeID': 'size',
                        'displayName': 'Size',
                        'id': 'size',
                        'isSwatchable': false,
                        'values': [
                            {
                                'id': '145',
                                'description': null,
                                'displayValue': '14 1/2',
                                'value': '145',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=145'
                            },
                            {
                                'id': '150',
                                'description': null,
                                'displayValue': '15',
                                'value': '150',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=150'
                            },
                            {
                                'id': '155',
                                'description': null,
                                'displayValue': '15 1/2',
                                'value': '155',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=155'
                            },
                            {
                                'id': '160',
                                'description': null,
                                'displayValue': '16',
                                'value': '160',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=160'
                            },
                            {
                                'id': '165',
                                'description': null,
                                'displayValue': '16 1/2',
                                'value': '165',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=165'
                            },
                            {
                                'id': '170',
                                'description': null,
                                'displayValue': '17',
                                'value': '170',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=170'
                            },
                            {
                                'id': '175',
                                'description': null,
                                'displayValue': '17 1/2',
                                'value': '175',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=175'
                            },
                            {
                                'id': '180',
                                'description': null,
                                'displayValue': '18',
                                'value': '180',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=180'
                            },
                            {
                                'id': '185',
                                'description': null,
                                'displayValue': '18 1/2',
                                'value': '185',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=185'
                            },
                            {
                                'id': '190',
                                'description': null,
                                'displayValue': '19',
                                'value': '190',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=190'
                            },
                            {
                                'id': '200',
                                'description': null,
                                'displayValue': '20',
                                'value': '200',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=200'
                            },
                            {
                                'id': '220',
                                'description': null,
                                'displayValue': '22',
                                'value': '220',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_size=220'
                            }
                        ]
                    },
                    {
                        'attributeID': 'width',
                        'displayName': 'Width',
                        'id': 'width',
                        'isSwatchable': false,
                        'values': [
                            {
                                'id': 'A',
                                'description': null,
                                'displayValue': '32/33',
                                'value': 'A',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_width=A'
                            },
                            {
                                'id': 'B',
                                'description': null,
                                'displayValue': '34/35',
                                'value': 'B',
                                'isSelected': false,
                                'isSelectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455_width=B'
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
                            'alt': 'No-Iron Textured Dress Shirt, , large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8f141f96/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwadb01158/images/large/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ],
                    'medium': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , medium',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8ad7d578/images/medium/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , medium',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw22201db2/images/medium/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ],
                    'small': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe65fe261/images/small/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe28073fd/images/small/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ],
                    'swatch': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , swatch',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw6baa392a/images/swatch/70284588_100_sw.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ]
                },
                'isAvailable': true,
                'hasRequiredAttrsSelected': false,
                'productType': 'master'
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
            assert.equal(attrColorBlue.url, myGetRequest.url + '&dwvar_25604455_color=SLABLFB', 'Actual color attribute = SLABLFB: url not as expected.');

            var colorBlueImages = attrColorBlue.images;
            assert.isTrue(colorBlueImages.large[0].url.endsWith('SLABLFB.PZ.jpg'), 'color SLABLFB image large[0]: url not ended with SLABLFB.PZ.jpg.');
            assert.isTrue(colorBlueImages.large[1].url.endsWith('SLABLFB.BZ.jpg'), 'color SLABLFB image large[1]: url not ended with SLABLFB.BZ.jpg.');
            assert.isTrue(colorBlueImages.medium[0].url.endsWith('SLABLFB.PZ.jpg'), 'color SLABLFB image medium[0]: url not ended with SLABLFB.PZ.jpg.');
            assert.isTrue(colorBlueImages.medium[1].url.endsWith('SLABLFB.BZ.jpg'), 'color SLABLFB image medium[1]: url not ended with SLABLFB.BZ.jpg.');
            assert.isTrue(colorBlueImages.small[0].url.endsWith('SLABLFB.PZ.jpg'), 'color SLABLFB image small[0]: url not ended with SLABLFB.PZ.jpg.');
            assert.isTrue(colorBlueImages.small[1].url.endsWith('SLABLFB.BZ.jpg'), 'color SLABLFB image small[1]: url not ended with SLABLFB.BZ.jpg.');
            assert.isTrue(colorBlueImages.swatch[0].url.endsWith('SLABLFB.CP.jpg'), 'color SLABLFB image swatch[0]: url not ended with SLABLFB.CP.jpg.');

            // Verify URL for product.attributes of color = WHITEFB
            var attrColorWhite = bodyAsJson.product.attributes[0].values[1];
            assert.equal(attrColorWhite.url, myGetRequest.url + '&dwvar_25604455_color=WHITEFB', 'Actual color attribute = WHITEFB: url not as expected.');

            var colorWhiteImages = attrColorWhite.images;
            assert.isTrue(colorWhiteImages.large[0].url.endsWith('WHITEFB.PZ.jpg'), 'color WHITEFB image large[0].url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(colorWhiteImages.large[1].url.endsWith('WHITEFB.BZ.jpg'), 'color WHITEFB image large[1].url not ended with WHITEFB.BZ.jpg.');
            assert.isTrue(colorWhiteImages.medium[0].url.endsWith('WHITEFB.PZ.jpg'), 'color WHITEFB image medium[0].url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(colorWhiteImages.medium[1].url.endsWith('WHITEFB.BZ.jpg'), 'color WHITEFB image medium[1].url not ended with WHITEFB.BZ.jpg.');
            assert.isTrue(colorWhiteImages.small[0].url.endsWith('WHITEFB.PZ.jpg'), 'color WHITEFB image small[0].url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(colorWhiteImages.small[1].url.endsWith('WHITEFB.BZ.jpg'), 'color WHITEFB image small[1].url not ended with WHITEFB.BZ.jpg.');
            assert.isTrue(colorWhiteImages.swatch[0].url.endsWith('WHITEFB.CP.jpg'), 'color WHITEFB image swatch[0].url not ended with WHITEFB.CP.jpg.');

            // Verify URL for product.attributes of Size of id = 145
            assert.equal(bodyAsJson.product.attributes[1].values[0].url, myGetRequest.url + '&dwvar_25604455_size=145', 'Actual product.attributes[1].values[0].url not as expected.');

            // Verify URL for product.attributes of Size of id = 150
            assert.equal(bodyAsJson.product.attributes[1].values[1].url, myGetRequest.url + '&dwvar_25604455_size=150', 'Actual product.attributes[1].values[1].url not as expected.');

            // Verify URL for product.attributes of Size of id = 155
            assert.equal(bodyAsJson.product.attributes[1].values[2].url, myGetRequest.url + '&dwvar_25604455_size=155', 'Actual product.attributes[1].values[2].url not as expected.');

            // Verify URL for product.attributes of Size of id = 160
            assert.equal(bodyAsJson.product.attributes[1].values[3].url, myGetRequest.url + '&dwvar_25604455_size=160', 'Actual product.attributes[1].values[3].url not as expected.');

            // Verify URL for product.attributes of Size of id = 165
            assert.equal(bodyAsJson.product.attributes[1].values[4].url, myGetRequest.url + '&dwvar_25604455_size=165', 'Actual product.attributes[1].values[4].url not as expected.');

            // Verify URL for product.attributes of Size of id = 170
            assert.equal(bodyAsJson.product.attributes[1].values[5].url, myGetRequest.url + '&dwvar_25604455_size=170', 'Actual product.attributes[1].values[5].url not as expected.');

            // Verify URL for product.attributes of Size of id = 175
            assert.equal(bodyAsJson.product.attributes[1].values[6].url, myGetRequest.url + '&dwvar_25604455_size=175', 'Actual product.attributes[1].values[6].url not as expected.');

            // Verify URL for product.attributes of Size of id = 180
            assert.equal(bodyAsJson.product.attributes[1].values[7].url, myGetRequest.url + '&dwvar_25604455_size=180', 'Actual product.attributes[1].values[7].url not as expected.');

            // Verify URL for product.attributes of Size of id = 185
            assert.equal(bodyAsJson.product.attributes[1].values[8].url, myGetRequest.url + '&dwvar_25604455_size=185', 'Actual product.attributes[1].values[8].url not as expected.');

            // Verify URL for product.attributes of Size of id = 190
            assert.equal(bodyAsJson.product.attributes[1].values[9].url, myGetRequest.url + '&dwvar_25604455_size=190', 'Actual product.attributes[1].values[9].url not as expected.');

            // Verify URL for product.attributes of Size of id = 200
            assert.equal(bodyAsJson.product.attributes[1].values[10].url, myGetRequest.url + '&dwvar_25604455_size=200', 'Actual product.attributes[1].values[10].url not as expected.');

            // Verify URL for product.attributes of Size of id = 220
            assert.equal(bodyAsJson.product.attributes[1].values[11].url, myGetRequest.url + '&dwvar_25604455_size=220', 'Actual product.attributes[1].values[11].url not as expected.');

            // Verify URL for product.attributes of width = A (32/33)
            assert.equal(bodyAsJson.product.attributes[2].values[0].url, myGetRequest.url + '&dwvar_25604455_width=A', 'Actual product.attributes[2].values[0].url not as expected.');

            // Verify URL for product.attributes of width = B (34/35)
            assert.equal(bodyAsJson.product.attributes[2].values[1].url, myGetRequest.url + '&dwvar_25604455_width=B', 'Actual product.attributes[2].values[1].url not as expected.');

            // Verify URL for product.attributes of images
            var prodImages = bodyAsJson.product.images;
            assert.isTrue(prodImages.large[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image large[0]: url not ended with WHITEFB.PZ.jpg');
            assert.isTrue(prodImages.large[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image large[1]: url not ended with WHITEFB.BZ.jpg');
            assert.isTrue(prodImages.medium[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image medium[0]: url not ended with WHITEFB.PZ.jpg');
            assert.isTrue(prodImages.medium[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image medium[1]: url not ended with WHITEFB.BZ.jpg');
            assert.isTrue(prodImages.small[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image small[0]: url not ended with WHITEFB.PZ.jpg');
            assert.isTrue(prodImages.small[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image small[1]: url not ended with WHITEFB.BZ.jpg');
            assert.isTrue(prodImages.swatch[0].url.endsWith('_sw.jpg'), 'product image swatch[0]: url not ended with _sw.jpg.');

            done();
        });
    });
});
