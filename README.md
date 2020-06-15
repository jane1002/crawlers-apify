# My beautiful actor

The `README.md` file contains a documentation what your actor does and how to use it,
which is then displayed in the app or Apify Store. It's always a good
idea to write a good `README.md`, in a few months not even you
will remember all the details about the actor.

You can use [Markdown](https://www.markdownguide.org/cheat-sheet)
language for rich formatting.

## Documentation reference

- [Apify SDK](https://sdk.apify.com/)
- [Apify Actor documentation](https://docs.apify.com/actor)
- [Apify CLI](https://docs.apify.com/cli)


---
# [Scrapy](https://docs.scrapy.org/en/latest/index.html)
- python
- Selector: xpath / css, easy use, copy from page element.
- features: 
    - pipeline
    - middlewares
    - item(model)
    - setting
- good:
    - configurable. 
    - additional packages built on it, extend the functionality, like scrapy-splash, scrapy-fake-user-agent.
    - good support for feeds export, has some pre-defined pipelines, such as filePipeline, imagePipeline.
        download easily(add/inherit filePipeline, set up store path, add that pipeline in settings, add download item in item)
    - good documents, very clear architecture [data flow](https://docs.scrapy.org/en/latest/topics/architecture.html#data-flow)
    - plenty Q/A on stackoverflow
    - Scrapy shell is an interactive shell where you can try and debug your scraping code very quickly, without having to run the spider
    - fast 
- bad: 
    - doesn't support JS dynamic loading page.(possible workaround: write a middleware), 
        - work with selenium [example](https://cloud.tencent.com/developer/article/1467534)
    - for cloud, currently only supports AWS S3, need to write your own pipeline for Azure.

# Selenium
- python
- Selector: beautiful soup
- JS dynamic load, simulate human action on the page. 
- bad: slow.
- compared with Puppeteer, not recommend.

# Puppeteer
- nodeJS
- Selector: documentQuery, easy to get the path, copy from page.
- good:
    - web automated testing framework, you can open a browser to see the actual scraping process.
    - pagination: 
    - easily open new tab
- bad: 
    - loading a browser, so it is memory expensive.
    - time sleep before get the new page loaded.

# Apify
- nodeJS
- Selector: cheerio for cheerio crawler, puppeteer.
- good:
    - supports both static / dynamic loading page, construct API call or headless browser.
    - multiple features: 
- bad:
    - write your own export module to save data.
    - has some redundant folders for apify platform use. 
    - poor documentation, lack of Q/A on stackoverflow. 
    


