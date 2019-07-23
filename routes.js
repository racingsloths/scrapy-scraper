const Apify = require('apify');
const { utils: { log } } = Apify;

exports.CATEGORY = async ({ $, request }, { requestQueue }) => {
    return Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector: 'a.item',
        baseUrl: request.loadedUrl,
        userData: {
            label: 'DETAIL'
        }
    })
}

exports.DETAIL = async ({ $, request }) => {
    const urlArr = request.url.split('/').slice(-2);
    const $wrapper = $('div.product-name');

    log.debug('Scraping results');
    const results = {
        url: request.url,
        uniqueIdentifier: urlArr.join('/'),
        owner: urlArr[0],
        title: $wrapper.find('h1').text(),
        description: $wrapper.find('p').text(),
    };

    log.debug('results=' + results);
    log.debug('Pushing data to dataset');
    await Apify.pushData(results);
}