'use strict';

/* globals cat, cd, cp, echo, exec, exit, find, ls, mkdir, rm, target, test */
/* eslint no-console: off, max-len: off */

require('shelljs/make');

const fs = require('fs');
const path = require('path');

const paths = require('../package.json').paths;

const locales = ['', '_fr_FR', '_it_IT', '_ja_JP', '_zh_CN'];

target.copyResource = function (args) {
    if (args.length === 3) {
        const source = args[0].split('=')[1];
        const property = args[1].split('=')[1];
        const target = args[2].split('=')[1];
        locales.forEach(function (locale) {
            const sourceFile = path.resolve(paths.resources + source + locale + '.properties');
            fs.readFile(sourceFile, 'UTF8', function (err, data) {
                if (data && !err) {
                    const resources = {};
                    data.split(/\n/).forEach(function (line) {
                        const tokens = line.split('=');
                        resources[tokens[0]] = tokens[1];
                    });
                    if (resources[property]) {
                        fs.appendFile(
                            path.resolve(path.join(
                                './app_storefront_base/cartridge/templates/resources/',
                                target + locale + '.properties')),
                            property + '=' + resources[property] + '\n');
                    }
                }
            });
        });
    } else {
        console.log('Three arguments required in the format: source=filename key=keyName target=filename');
    }
};
