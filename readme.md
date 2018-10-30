# Features
* We are doing 301 redirects to pass all info to target page
* Tracking shortener usage through google analytics 
* We can specify date range when link will be valid
* We can write custom short url
 
    
## Possible improvements
* Validations: Is input url, Is date range valid,  If link exist
* it will be good if we can create session for every request (to detect multiple clicks on same link)
* 1 long url can have exactly one custom url (but can have multiple short url's )

## Notes
* id column is used for logic for generating entries, id's must start with 118000 (then short url-s will be length 4 or more)
* If we need to add new million codes that can be done manually triggering generate.js (with range we want to cover)


## Databases
* codes: id, code - for every number we will create his pair code       1,99999
* urls: id,url,dateFrom,dateTo, customUrl/code - then we will get code for same id if exist


# Installation
If you running code for the first time, create database with name "url_shortener" then run following commands:

    nodejs src/init.js
    nodejs src/generate.js
