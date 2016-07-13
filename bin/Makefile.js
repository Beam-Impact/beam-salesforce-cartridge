'use strict';

/* globals cat, cd, cp, echo, exec, exit, find, ls, mkdir, rm, target, test */
/* eslint no-console: off, max-len: off */

require('shelljs/make');

var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

var paths = require('../package.json').paths;

var locales = ['', '_fr_FR', '_it_IT', '_ja_JP', '_zh_CN'];

target.copyResource = function (args) {
    if (args.length === 3) {
        var source = args[0].split('=')[1];
        var property = args[1].split('=')[1];
        var target = args[2].split('=')[1];
        locales.forEach(function (locale) {
            var sourceFile = path.resolve(paths.resources + source + locale + '.properties');
            fs.readFile(sourceFile, 'UTF8', function (err, data) {
                if (data && !err) {
                    var resources = {};
                    data.split(/\n/).forEach(function (line) {
                        var tokens = line.split('=');
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

target.browserify = function () {
    var jsSource = 'app_storefront_base/cartridge/js';
    var jsDest = 'app_storefront_base/cartridge/static/default/js';

    var allJsFiles = ls(path.join(process.cwd(), jsSource, '/*.js'));

    allJsFiles.forEach(function (file) {
        var b = browserify();
        b.add(file);
        b.bundle(function (err, buf) {
            if (err) {
                console.log('Error bundling ' + file);
                console.log(err);
                return;
            }
            var resultFile = path.join(jsDest, '/', path.basename(file));
            fs.open(resultFile, 'w', function (err, fd) {
                fs.write(fd, buf, 0, buf.length, null, function (error) {
                    if (error) {
                        console.log('Error writting ' + file);
                        console.log(error);
                    }
                    fs.close(fd);
                });
            });
        });
    });
};
