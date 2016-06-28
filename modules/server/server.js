/* globals request:false, response:false */

'use strict';

const middleware = require('./middleware');
const Request = require('./request');
const Response = require('./response');
const Route = require('./route');
const render = require('./render');

//--------------------------------------------------
// Private helpers
//--------------------------------------------------

/**
 * Validate that first item is a string and all of the following items are functions
 * @param {Array} args - Arguments that were passed into function
 * @returns {void}
 */
function checkParams(args) {
    const middlewareChain = args.slice(1);
    const name = args[0];

    if (typeof name !== 'string') {
        throw new Error('First argument should be a string');
    }

    if (!middlewareChain.every(function (item) { return typeof item === 'function'; })) {
        throw new Error('Middleware chain can only contain functions');
    }
}

//--------------------------------------------------
// Public Interface
//--------------------------------------------------

/**
 * @constructor
 * @classdesc Server is a routing solution
 */
function Server() {
    this.routes = {};
}

Server.prototype = {
    /**
     * Creates a new route with a name and a list of middleware
     * @param {string} name - Name of the route
     * @param {Function[]} arguments - List of functions to be executed
     * @returns {void}
     */
    use: function use(name) {
        const args = Array.isArray(arguments) ? arguments : Array.prototype.slice.call(arguments);
        const middlewareChain = args.slice(1);
        // freeze request object to prevent mutations
        const rq = Object.freeze(new Request(typeof request !== 'undefined' ? request : {}));
        const rs = new Response(typeof response !== 'undefined' ? response : {});

        checkParams(args);

        if (this.routes[name]) {
            throw new Error('Route with this name already exists');
        }

        const route = new Route(name, middlewareChain, rq, rs);
        // Add event handler for rendering out view on completion of the request chain
        route.on('route:Complete', function (req, res) {
            if (res.view && res.viewData) {
                render.template(res.view, res.viewData, res);
            } else if (res.isJson) {
                render.json(res.viewData, res);
            } else {
                throw new Error('Cannot render template without name or data');
            }
        });

        this.routes[name] = route;

        return route;
    },
    /**
     * Shortcut to "use" method that adds a check for get request
     * @param {string} name - Name of the route
     * @param {Function[]} arguments - List of functions to be executed
     * @returns {void}
     */
    get: function get() {
        const args = Array.prototype.slice.call(arguments);
        args.splice(1, 0, middleware.get);
        return this.use.apply(this, args);
    },
    /**
     * Shortcut to "use" method that adds a check for post request
     * @param {string} name - Name of the route
     * @param {Function[]} arguments - List of functions to be executed
     * @returns {void}
     */
    post: function post() {
        const args = Array.prototype.slice.call(arguments);
        args.splice(1, 0, middleware.post);
        return this.use.apply(this, args);
    },
    /**
     * Output an object with all of the registered routes
     * @returns {Object} Object with properties that match registered routes
     */
    exports: function exports() {
        const exportStatement = {};
        Object.keys(this.routes).forEach(function (key) {
            exportStatement[key] = this.routes[key].getRoute();
            exportStatement[key].public = true;
        }, this);
        if (!exportStatement.__routes) {
            exportStatement.__routes = this.routes;
        }
        return exportStatement;
    },
    /**
     * Extend existing server object with a list of registered routes
     * @param {Object} server - Object that corresponds to the output of "exports" function
     * @returns {void}
     */
    extend: function (server) {
        const newRoutes = {};
        if (!server.__routes) {
            throw new Error('Cannot extend non-valid server object');
        }
        if (Object.keys(server.__routes).length === 0) {
            throw new Error('Cannot extend server without routes');
        }

        Object.keys(server.__routes).forEach(function (key) {
            newRoutes[key] = server.__routes[key];
        });

        this.routes = newRoutes;
    },
    /**
     * Modify a given route by appending additional middleware to it
     * @param {string} name - Name of the route to modify
     * @param {Function[]} arguments - List of functions to be appended
     * @returns {void}
     */
    append: function append(name) {
        const args = Array.prototype.slice.call(arguments);
        const middlewareChain = Array.prototype.slice.call(arguments, 1);

        checkParams(args);

        if (!this.routes[name]) {
            throw new Error('Route with this name does not exist');
        }

        this.routes[name].chain = this.routes[name].chain.concat(middlewareChain);
    },
    /**
     * Returns a given route from the server
     * @param {string} name - Name of the route
     * @returns {Object} Route that matches the name that was passed in
     */
    getRoute: function getRoute(name) {
        return this.routes[name];
    }
};

module.exports = new Server();
