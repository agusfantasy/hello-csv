'use strict';

// 0. Please use readline (https://nodejs.org/api/readline.html) to deal with per line file reading
// 1. Then use the parse API of csv-parse (http://csv.adaltas.com/parse/ find the Node.js Stream API section)

const readline = require('readline');
const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/sample.csv'),
});

let index = 0;
rl.on('line', (line) => {
    if (index > 0) {

        parse(line, function (err, col) {
            col = col[0];
            let fullName = col[0] + ' ' + col[1];
            let obj = {
                full_name: fullName,
                company_name: col[2],
                address: col[3],
                city: col[3],
                county: col[4],
                state: col[5],
                zip: col[6],
                phone1: col[7] != undefined ? col[7] : '',
                phone2: col[8] != undefined ? col[8] : '',
                email: col[9]  != undefined ? col[9] : '',
                web: col[10]  != undefined ? col[10] : '',
            };

            helper.sendSms(obj, function (err, sendingStatus) {
                if (err) return console.error(err);

                helper.logToS3(sendingStatus, function (err, loggingStatus) {
                    if (err) return console.error(err);

                    console.log({ obj, sendingStatus, loggingStatus, });
                });
            });
        });
    }

    index++;
});
