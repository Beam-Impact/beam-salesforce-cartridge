# Server module

Server module is partially a replacement for guard functionality that existing in the original SG controllers, and partially a different approach to extensibility of SiteGenesis.

Server module is trying to bring in some of the modern JavaScript approaches into SG. It borrows heavily from NodeJS's [Express](http://expressjs.com/) and adds some features specific to SG on top of it.

Server allows users to register routes that would create a mapping between provided URL and code that supposed to execute when server detects that URL.

```js

var server = require('server');

server.get('Show', function(req, res, next) {
    res.json({ value: 'Hello World'});
    next();
});

module.exports = server.exports();

```

The example above when saved to a file named `Page.js` would create a new route for URL matching http://sandbox-host-name/on/demandware.store/site-name/en_US/Page-Show. Whenever that url going to be called, provided function is going to execute and render back a page with `Content-Type: application/json` and body `{ value: 'Hello World '}`. This example can be made more complicated by adding another parameter `server.middleware.https`, after `Show` to limit this route to only allow HTTPS requests. First parameter of `get` and `post` functions are always going to be the name of the route, last parameter should always be something where you do most of the work. You can add as many parameters in between first and last as you need. Each one is going to be executed in order and can either allow next step to be executed (by calling `next()`), or reject a request (by calling `next(new Error())`). Those steps are usually referred to as **middleware** and the whole process is called **chaining**. You can easily create your own middleware functions for any purpose you have. It might be to limit route access, or to add information to `pdict`, or for any other reason. One limitation of this approach is that you always have to call `next()` function at the end of every step of the chain, otherwise the next still will not be executed.

## Middleware

Every step of the middleware chain is a function that takes 3 arguments. `req`, `res` and `next`.

### `req`

req stands for Request, and contains information about server request that initiated execution. If you are looking for input information, for example, content-type that user accepts, or user's login and locale information, it will be available on `req` object. `req` will automatically pre-parse query string parameters and assign them to `req.querystring` object.

### `res`

res stands for Response, and contains functionality for outputting data back to the client. For example, you can set cache expiration time for the output by using `res.cacheExpiration(24);` which will set expiration to 24 hours from now. `req.render(templateName, data)` will output an ISML template back to the client, and assign `data` to `pdict`. `req.json(data)` will print out json object back to the screen. It's helpful to create ajax service endpoints that you want to execute from the client-side scripts. `req.setViewData(data)` will not render anything, but will set output object. This can be helpful if you want to add multiple objects to the `pdict` of the template. `setViewData` will merge all of the data that you passed in into a single object. So you can call it at every step of the middleware chain. For example, you might want to have a separate middleware function that retrieves information about user's locale (to render language switch on the page). Actual output of the ISML template or JSON will happen after every step of the middleware chain is complete.

### `next`

Executing `next` function, will notify server that you are done with this middleware step, and it can execute next step in the chain.

## Extending routes

The power of this approach is that it doesn't only allows you to chain multiple middleware and as such compartmentalize your code better, but also because you can extend existing routes and modify them, without having to re-write them.

For example, you might have a controller `Page` with the following route:

```js
var server = require('server');

server.get('Show', function(req, res, next) {
    res.render('someTemplate', { value: 'Hello World' });
    next();
});

module.exports = server.exports();
```

Let's say that you are a client who is fine with the look and feel of Page-Show template, but would like to change the wording. Instead of creating your own controller and route, or modifying SG code, you can extend this route with the following code:

```js
var page = require('app_storefront_base/cartridge/controller/Page');
var server = require('server');

server.extend(page);

server.append(function(req, res, next) {
    res.setViewData({ value: 'Hello Demandware' });
    next();
});

module.exports = server.exports();
```

Once the user loads this page, the text on the page is going to now say "Hello Demandware", since the data that was passed to the template has been overwritten. This would also work if you are fine with the data, but don't like look and feel of the template. Instead of setting ViewData, you can just call `render` function and pass it a new template like this:

```js
var page = require('app_storefront_base/cartridge/controller/Page');
var server = require('server');

server.extend(page);

server.append(function(req, res, next) {
    res.render('myNewTemplate');
    next();
});

module.exports = server.exports();
```

Your new template is still going to have variable `pdict.value` and it's value is going to be `Hello World`, but you can render it using your own template without modifying any of the SG code.

As such, we would be recommending clients to never modify anything in app_storefront_base, but instead to create their own cartridge and overlay it in the BM cartridge path. This would allow clients to upgrade to a newer version of SiteGenesis without having to manually cherry-pick changes and performing manual merges. This doesn't mean that every new version of SG will not modify client's site, but upgrade process should be much less painful.

## Middleware Chain Events

On top of supporting middleware chaining, server will also emit events at every step of execution, user can subscribe and unsubscribe events from a given route. Here's the list of currently supported events:

* `route:Start` - will be emitted as a first thing before middleware chain execution.
* `route:Redirect` - will be emitted right before `res.redirect` execution.
* `route:Step` - will be emitted before execution of every step in the middleware chain.
* `route:Complete` - will be emitted after every step in the chain finishes execution. Currently subscribed by server to render ISML or JSON back to the client.

All of the events will provide both `req` and `res` as parameters to all handlers.

Subscribing/Unsubscribing from events can allow you to do some very complex and interesting things. For example, currently server subscribes to `route:Complete` event to render out ISML back to the client. If, for example, you want to use something other then ISML to render the content of your template, you could unsubscribe route from `route:Complete` event and subscribe to it again with a function that would use your own rendering engine instead of ISML, without modifying any of the existing controllers.
