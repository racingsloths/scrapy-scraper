const Apify = require('apify');
const tools = require('./tools');
const { utils: { log } } = Apify;

Apify.main(async () => {
    log.info('Starting actor');

    const requestList = await Apify.openRequestList('categories', await tools.getSources());
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug('Setting up crawler.');
    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        handlePageFunction: async (context) => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        }
    });

    log.info('Starting the crawl');
    await crawler.run();
    log.info('Actor finished');
});