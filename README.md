# Mobile First SiteGenesis

This is a repository for mobile first version of SiteGenesis. To install, clone this repository, manually upload `modules` folder to your sandbox (through CyborDuck software, or any other WebDAV client, you can't upload through Studio). Normally upload `app_storefront_base` cartridge and enable it in BM.

# NPM scripts

## Unit tests

You can run `npm test` to execute all unit tests in the project. Run `npm test --coverage` to get coverage information. Coverage will be available in `coverage` folder under root directory.

# Compilation

`npm run compile:scss` - Compiles all scss files into css.
`npm run compile:js` - Compiles all js files and aggregates them.
`npm run compile:fonts` - Will copy all needed font files. Usually have to be run only once.

# lint

`npm run lint` - Execute linting for all JavaScript and SCSS files in the project. You should run this command before committing your code.

# copyResource

`npm run copyResource -- source=sourceFilename key=keyname target=targetFilename` - Will copy localization strings for a given _keyname_ from file matching _sourceFilename_ into _targetFilename_ (target will be created if it doesn't exist). It will do it for every locale. For example `npm run copyResource -- source=locale key=global.user target=common` will copy `global.user` value for default, fr_FR, it_IT, ja_JP and zh_CN locals from file named locale(\_locale).properties into common(\_locale).properties. package.json path.resources key should be setup with the location of app_storefront_base resources folder so that original key values can be found.
