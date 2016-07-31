'use strict'

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

function readCsv(cb) {
    let read = new Promise(function (resolve, reject) {
        fs.readFile(__dirname + '/sample.csv', 'utf8', function (err, loadedCsv) {
            if (err) return reject(err);
            resolve(loadedCsv);
        });
    });

    return read.then(function (dataCsv) {
        let result = [];
        parse(dataCsv, function (err, parsed) {
            parsed = parsed.shift();
            parsed.forEach(function (col, k) {
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
                result.push(obj);
            });
        });

        return cb(null, result);
    },

    function (err) {
        return cb(err);
    });
}

function sendLog() {
    readCsv(function (err, data) {
        if (err) return console.error(err);

        data.forEach(function (value, key, calback) {
            let sms = new Promise(function (resolve, reject) {
                helper.sendSms(value, function (err, sendingStatus) {
                    if (err) return reject(err);

                    resolve(sendingStatus);
                });
            });

            sms.then(function (sendingStatus) {
                helper.logToS3(sendingStatus, function (err, doc) {
                    if (err) return console.error(err);

                    console.log(doc);
                });
            },

            function (err) {
                console.error(err);
            });
        });
    });
}

sendLog();
