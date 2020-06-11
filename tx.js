const Apify = require('apify');
const querystring = require("querystring");
const { URL } = require('url');
const json2csv = require('json2csv');
const fs = require('fs');
const os = require('os');


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
        'DateFiledFrom': '2017-06-01',
        'DateFiledTo': '2020-06-01',
        'Description': '',
        'FilingDescription': ''
    };

    qs = querystring.stringify(qs);

    await requestQueue.addRequest({
        url: `${baseUrl}/Search/Search?${qs}`
    });

    // console.log(`${baseUrl}/Search/Search?${qs}`);

    const handlePageFunction =  async ({ request, response, body, contentType, $ }) => {
        const links = [];
        // console.log(request.url);
        // console.log('response', body);
        $('strong > a').each((index, e) => {
            const link = $(e).attr('href');
            links.push(link);
        });

        // $("table tr:first-child").remove();
        const lastIndex = $('table tr').get().length;
        console.log(lastIndex);

        const docketInfo = {};
        // const docketInfo = [];
        $('table').find('tr').each((index, el) => {
            if(index != 0 && index < lastIndex - 1) {
                const docketNum = $(el).find('td > strong > a').eq(0).text().trim();
                const filings = $(el).find('td').eq(1).text().trim();
                const utility = $(el).find('td').eq(2).text().trim();
                const description = $(el).find('td').eq(3).text().trim();
                docketInfo.docketNum = docketNum;
                docketInfo.filings = filings;
                docketInfo.utility = utility;
                docketInfo.description = description;
                // console.log(docketNum, filings, utility, description);
                console.log(JSON.stringify(docketInfo))
                exportJsonObjToCSV(docketInfo, 'docket.csv');
            }

           // if(index != 0 && index < lastIndex - 1) {
           //     $(el).find('td').each((index, el) => {
           //         let tdVal;
           //         if(index == 0) {
           //             tdVal = $(el).find('a').text();
           //         } else {
           //             tdVal = $(el).text();
           //             // console.log(tdVal);
           //         }
           //         // console.log(tdVal.trim());
           //         docketInfo.push(tdVal.trim());
           //     })
           // }
        });


        let nextPageLink = $('.PagedList-skipToNext a').attr('href');
        if(nextPageLink) {
            nextPageLink = new URL(nextPageLink, baseUrl);
            await requestQueue.addRequest({
               url: nextPageLink.href
            });
        }



        // await Apify.utils.enqueueLinks({
        //     $,
        //     requestQueue,
        //     baseUrl: request.loadedUrl,
        //     pseudoUrls: ['http[s?]://apify.com/[.+]/[.+]'],
        // });

        // Save the data to dataset.
        // await Apify.pushData({
        //     docketInfo
        // });

    };
// Crawl the URLs
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
        // maxRequestsPerCrawl: 10
    });

    await crawler.run();
});


const exportJsonObjToCSV = (data,  outputFile) => {
    const header = false;
    const fields = Object.keys(data);
    const opts = {fields, header};

    try {
        const parser = new json2csv.Parser(opts);
        const csv = parser.parse(data);

        fs.writeFileSync(outputFile, `${csv}${os.EOL}`, {flag: 'a'});

    } catch (err) {
        console.error(err.message);
    }
};
