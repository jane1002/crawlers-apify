const Apify = require('apify');
const querystring = require("querystring");
const { URL } = require('url');
const json2csv = require('json2csv');
const fs = require('fs');
const os = require('os');
const url = require('url');
const { handleStart, handleDockets, handleFilings, handleDocs} = require('./routes');
const { utils: { log } } = Apify;

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    const baseUrl = 'http://interchange.puc.texas.gov';

    let qs = {
        'UtilityType': 'E',
        'ControlNumber': '',
        'ItemMatch': 1,
        'ItemNumber': '',
        'UtilityName': '',
        'FilingParty': '',
        'DocumentType': 'ALL',
        'DateFiledFrom': '2019-06-01',
        'DateFiledTo': '2020-06-01',
        'Description': '',
        'FilingDescription': ''
    };

    qs = querystring.stringify(qs);

    await requestQueue.addRequest({
        url: `${baseUrl}/Search/Search?${qs}`
    });


    const handlePageFunction =  async ({ request, response, body, contentType, $ }) => {

        const pathName = url.parse(request.url).pathname;
        // log.info(`[${pathName}]`);

        switch (pathName) {
            case '/Search/Dockets':
            case '/Search/Search':
                return handleDockets($, requestQueue);
            case '/Search/Filings':
                return handleFilings($, requestQueue);
            case '/Search/Document:':
                return handleDocs($, requestQueue);
            default:
                return handleStart($);
        }
        // console.log(request.url);
        // console.log('response', body);

        // $("table tr:first-child").remove();

    };
// Crawl the URLs
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
        // maxRequestsPerCrawl: 10
    });

    await crawler.run();
});


