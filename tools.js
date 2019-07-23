const Apify = require('apify');
const routes = require('./routes');
const { utils: { log } } = Apify;

exports.getSources = async () => {
    log.debug('Getting sources');
    const input = await Apify.getInput();

    return input.map(category => ({
        url: `https://www.cellarlink.com.au/buy-wine-online/store/${category}`,
        userData: {
            label: 'CATEGORY'
        }
    }));
}

exports.createRouter = (globalContext) => {
    return async function (routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    }
}