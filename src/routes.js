const Apify = require('apify');

const { utils: { log } } = Apify;
const {exportJsonObjToCSV} = require('./helpers');
const baseUrl = 'http://interchange.puc.texas.gov';

exports.handleStart = async ({ request, page }) => {
    // Handle Start URLs
};

exports.handleDockets = async ($, requestQueue) => {
    log.info('[handle docket]');
    // Handle pagination
    const lastIndex = $('table tr').get().length;
    console.log(lastIndex);
    const docketInfo = {};

    $('table').find('tr').each(async (index, el) => {

        // if(index != 0 && index < lastIndex - 1) {
        if(index != 0 && index < 5) {
            const docketNum = $(el).find('td > strong > a').eq(0).text().trim();
            let docketLink = $(el).find('td > strong > a').attr('href');

            if(docketLink) {
                docketLink = new URL(docketLink, baseUrl);
                await requestQueue.addRequest({
                    url: docketLink.href
                });
            }

            const filings = $(el).find('td').eq(1).text().trim();
            const utility = $(el).find('td').eq(2).text().trim();
            const description = $(el).find('td').eq(3).text().trim();

            docketInfo.docketNum = docketNum;
            docketInfo.filings = filings;
            docketInfo.utility = utility;
            docketInfo.description = description;
            // console.log(docketNum, filings, utility, description);
            // console.log(JSON.stringify(docketInfo));
            exportJsonObjToCSV(docketInfo, 'dockets.csv');
        }
    });


    let nextPageLink = $('.PagedList-skipToNext a').attr('href');

    if(nextPageLink) {
        nextPageLink = new URL(nextPageLink, baseUrl);
        console.log(nextPageLink);
        await requestQueue.addRequest({
            url: nextPageLink.href
        });
    }
};
/*
 some filings don't have download link, 15599.
 */
exports.handleFilings = async ($, requestQueue) => {
    // Handle details
    log.info('[handle filings]');
    const lastIndex = $('table tr').get().length;
    // log.info(lastIndex);
    let docketNum = $('.layoutHeader h1').text();
    console.log('docketNum: ', docketNum);
    const pattern = /[0-9]*$/;
    docketNum = pattern.exec(docketNum)[0];

    $('table').find('tr').each(async (index, el) => {
        let fillings = {};
        if(index != 0 && index < lastIndex - 1) {
            let itemNum;
            let itemLink = $(el).find('td > strong > a').attr('href');

            if(itemLink) {
                itemNum = $(el).find('td > strong > a').eq(0).text().trim();
                itemLink = new URL(itemLink, baseUrl);
                await requestQueue.addRequest({
                    url: itemLink.href
                });
            } else {
                itemNum = $(el).find('td').eq(0).text().trim();
            }

            const fileStamp = $(el).find('td').eq(1).text().trim();
            const party = $(el).find('td').eq(2).text().trim();
            const description = $(el).find('td').eq(3).text().trim();
            fillings.docketNum = docketNum;
            fillings.itemNum = itemNum;
            fillings.fileStamp = fileStamp;
            fillings.party = party;
            fillings.description = description;
            // console.log(docketNum, filings, utility, description);
            // console.log(JSON.stringify(fillings));
            exportJsonObjToCSV(fillings, 'filings.csv');
        }
    });

    let nextPageLink = $('.PagedList-skipToNext a').attr('href');

    if(nextPageLink) {
        nextPageLink = new URL(nextPageLink, baseUrl);
        log.info(`[${nextPageLink}]`);
        await requestQueue.addRequest({
            url: nextPageLink.href
        });
    }
};

exports.handleDocs = async ($, requestQueue) => {
    // Handle doc details
    log.info('[handle docs]');
};

